"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import type { Group, Object3D } from "three";
import gsap from "gsap";
import { HERO_CAR, heroCar } from "@/lib/heroCar";
import { RING_OFFSET_X } from "./KartuRing";

const MODEL = "/models/bmw.glb";
const WHEEL_NODES = ["wheel_F1", "wheel_F2", "wheel_R1", "wheel_R2"];
const WIDE_BREAKPOINT = 768; // px, sama dengan KartuRing

type CarState = {
  x: number;
  prevX: number;
  spin: number;
  init: boolean;
  last: boolean;
  moving: boolean;
  tween: gsap.core.Tween | null;
};

export default function HeroCar() {
  const { scene } = useGLTF(MODEL);
  const outer = useRef<Group>(null);
  const st = useRef<CarState>({
    x: 0,
    prevX: 0,
    spin: 0,
    init: false,
    last: true,
    moving: false,
    tween: null,
  });

  // Ukuran asli model, offset supaya pusat (x,z) di 0 dan dasar roda di y = 0.
  const model = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    return {
      size,
      offset: new Vector3(-center.x, -box.min.y, -center.z),
      wheels: WHEEL_NODES.map((n) => scene.getObjectByName(n)).filter(
        (o): o is Object3D => !!o,
      ),
    };
  }, [scene]);

  useFrame(({ viewport, size }) => {
    const o = outer.current;
    if (!o) return;
    const s = st.current;

    // Satuan scene di bidang z = 0. World x = 0 berada di ±69% layar
    // (kamera digeser oleh KartuRing), jadi semua dihitung dari RING_OFFSET_X.
    const vw = viewport.width;
    const scale = (vw * HERO_CAR.lengthFrac) / model.size.z;
    const half = (model.size.z * scale) / 2;
    const g = {
      park: vw * (HERO_CAR.columnCenter - 0.5 - RING_OFFSET_X),
      gone: -vw * (0.5 + RING_OFFSET_X) - half, // sepenuhnya di luar kiri
      arrive: vw * (0.5 - RING_OFFSET_X) + half, // sepenuhnya di luar kanan
    };

    const play = (toParked: boolean, delay = 0) => {
      s.tween?.kill();
      if (toParked && s.x <= g.gone) {
        s.x = g.arrive; // sudah di luar kiri: masuk lagi dari kanan
        s.prevX = s.x;
      }
      s.moving = true;
      s.tween = gsap.to(s, {
        x: toParked ? g.park : g.gone,
        duration: toParked ? HERO_CAR.introDuration : HERO_CAR.exitDuration,
        delay,
        ease: toParked ? "power3.out" : "power3.in",
        onComplete: () => {
          s.moving = false;
        },
      });
    };

    if (!s.init) {
      s.init = true;
      s.last = heroCar.parked;
      if (heroCar.parked) {
        s.x = g.arrive;
        s.prevX = s.x;
        play(true, HERO_CAR.introDelay);
      } else {
        s.x = g.gone; // reload di bawah hero: langsung "sudah pergi"
        s.prevX = s.x;
      }
    } else if (heroCar.parked !== s.last) {
      s.last = heroCar.parked;
      play(heroCar.parked);
    } else if (!s.moving) {
      s.x = s.last ? g.park : g.gone; // diam: ikut ukuran layar saat di-resize
      s.prevX = s.x;
    }

    // Roda menggelinding: sudut = jarak tempuh / jari-jari.
    const dx = s.x - s.prevX;
    s.prevX = s.x;
    s.spin += (-dx / (HERO_CAR.wheelRadius * scale)) * HERO_CAR.wheelSpin;
    for (const w of model.wheels) w.rotation.x = s.spin;

    o.visible = size.width >= WIDE_BREAKPOINT;
    o.scale.setScalar(scale);
    o.position.set(
      s.x,
      -(model.size.y * scale) / 2 + HERO_CAR.yShift * viewport.height,
      0,
    );
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 6]} intensity={3} />
      <directionalLight position={[-5, 3, -4]} intensity={1.2} />
      <group ref={outer} rotation={[0, HERO_CAR.yaw, 0]}>
        <group position={model.offset}>
          <primitive object={scene} />
        </group>
      </group>
    </>
  );
}

useGLTF.preload(MODEL);
