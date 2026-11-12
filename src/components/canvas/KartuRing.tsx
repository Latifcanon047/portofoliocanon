"use client";

import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { Color, MathUtils } from "three";
import type { Group, MeshBasicMaterial, PerspectiveCamera } from "three";
import {
  CARD_LAYOUT,
  KARYA,
  activeProject,
  ringRadius,
  ringSlots,
  scrollProgress,
} from "@/lib/karya";
import type { KartuData, Orientation, ProjectData } from "@/lib/karyaData";

const PLACEHOLDER_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#06b6d4",
  "#6366f1",
  "#d946ef",
];

export const RING_OFFSET_X = 0.19; // fraksi lebar layar dari tengah (0.19 = pusat cincin di ±69%)
const RING_SCALE = 0.85; // skala cincin di layar lebar (1 = ukuran penuh)
const WIDE_BREAKPOINT = 768; // px, sama dengan breakpoint md Tailwind

type RingState = { rotation: number; presence: number };
type MatRef = RefObject<MeshBasicMaterial | null>;

function ImageMaterial({ image, matRef }: { image: string; matRef: MatRef }) {
  const texture = useTexture(image);
  return (
    <meshBasicMaterial
      ref={matRef}
      map={texture}
      transparent
      toneMapped={false}
    />
  );
}

type KartuProps = {
  card: KartuData;
  cardIndex: number; // indeks kartu asli (untuk warna placeholder)
  slot: number; // posisi slot di cincin (untuk sudut)
  step: number;
  radius: number;
  orientation: Orientation;
  ring: RefObject<RingState>;
};

function Kartu({
  card,
  cardIndex,
  slot,
  step,
  radius,
  orientation,
  ring,
}: KartuProps) {
  const layout = CARD_LAYOUT[orientation];
  const groupRef = useRef<Group>(null);
  const faceMat = useRef<MeshBasicMaterial>(null);
  const bezelMat = useRef<MeshBasicMaterial>(null);

  const faceBase = useMemo(
    () =>
      new Color(
        card.image
          ? "#ffffff"
          : PLACEHOLDER_COLORS[cardIndex % PLACEHOLDER_COLORS.length],
      ),
    [card.image, cardIndex],
  );
  const bezelBase = useMemo(() => new Color("#16161d"), []);

  const a = slot * step;

  useFrame(() => {
    const { rotation, presence } = ring.current;
    if (presence < 0.01) return;

    // Sudut kartu relatif ke posisi depan, dinormalisasi ke [-PI, PI)
    const angle =
      MathUtils.euclideanModulo(a + rotation + Math.PI, Math.PI * 2) - Math.PI;

    // 1 = tepat di depan, 0 = sudah satu langkah atau lebih jauh
    const focus = MathUtils.clamp(1 - Math.abs(angle) / step, 0, 1);
    const k = KARYA.dimMin + (1 - KARYA.dimMin) * focus;

    groupRef.current?.scale.setScalar(1 + KARYA.frontScale * focus);

    if (faceMat.current) {
      faceMat.current.color.copy(faceBase).multiplyScalar(k);
      faceMat.current.opacity = presence;
    }
    if (bezelMat.current) {
      bezelMat.current.color.copy(bezelBase).multiplyScalar(k);
      bezelMat.current.opacity = presence;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[Math.sin(a) * radius, 0, Math.cos(a) * radius]}
      rotation={[0, a, 0]}
    >
      {layout.bezel > 0 && (
        <RoundedBox
          args={[
            layout.width + layout.bezel * 2,
            layout.height + layout.bezel * 2,
            0.06,
          ]}
          radius={0.14}
          smoothness={4}
        >
          <meshBasicMaterial ref={bezelMat} transparent toneMapped={false} />
        </RoundedBox>
      )}

      <mesh position={[0, 0, layout.bezel > 0 ? 0.035 : 0]}>
        <planeGeometry args={[layout.width, layout.height]} />
        {card.image ? (
          <ImageMaterial image={card.image} matRef={faceMat} />
        ) : (
          <meshBasicMaterial ref={faceMat} transparent toneMapped={false} />
        )}
      </mesh>
    </group>
  );
}

export default function KartuRing({ project }: { project: ProjectData }) {
  const groupRef = useRef<Group>(null);
  const ring = useRef<RingState>({ rotation: 0, presence: 0 });

  const count = project.cards.length;
  const slots = ringSlots(count);
  const step = (Math.PI * 2) / slots;
  const radius = ringRadius(project.orientation, slots);

  // Layar lebar: tampilan kamera digeser ke kanan (bukan cincinnya) supaya
  // perspektif cincin tetap simetris. HP: tetap di tengah.
  const size = useThree((state) => state.size);
  const camera = useThree((state) => state.camera);
  const wide = size.width >= WIDE_BREAKPOINT;
  const s = wide ? RING_SCALE : 1;

  useEffect(() => {
    if (!wide) return;
    const cam = camera as PerspectiveCamera;
    cam.setViewOffset(
      size.width,
      size.height,
      -size.width * RING_OFFSET_X,
      0,
      size.width,
      size.height,
    );
    cam.updateProjectionMatrix();
    return () => {
      cam.clearViewOffset();
      cam.updateProjectionMatrix();
    };
  }, [camera, size.width, size.height, wide]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const progress = scrollProgress[project.id] ?? 0;

    // Negatif = kartu depan bergeser ke kiri pengguna saat scroll turun.
    const target = -progress * (count - 1) * step;
    ring.current.rotation = MathUtils.damp(
      ring.current.rotation,
      target,
      KARYA.damping,
      delta,
    );

    const shown = activeProject.current === project.id ? 1 : 0;
    ring.current.presence = MathUtils.damp(
      ring.current.presence,
      shown,
      shown ? KARYA.presenceIn : KARYA.presenceOut,
      delta,
    );

    group.visible = ring.current.presence > 0.01;
    group.rotation.y = ring.current.rotation;
  });

  return (
    // Digeser mundur sebesar radius supaya kartu depan ada di z = 0
    <group
      ref={groupRef}
      position={[0, 0, -radius * s]}
      scale={s}
      visible={false}
    >
      {Array.from({ length: slots }, (_, slot) => (
        <Kartu
          key={slot}
          card={project.cards[slot % count]}
          cardIndex={slot % count}
          slot={slot}
          step={step}
          radius={radius}
          orientation={project.orientation}
          ring={ring}
        />
      ))}
    </group>
  );
}
