// Ditulis Hero (ScrollTrigger), dibaca HeroCar (useFrame). Bukan state React.
export const heroCar = { parked: true }; // true = mobil parkir, false = sudah pergi

// Semua knob "rasa" mobil ada di sini.
export const HERO_CAR = {
  columnCenter: 0.75, // pusat kolom kanan hero (fraksi lebar layar)
  lengthFrac: 0.42, // panjang mobil = 42% lebar layar yang kelihatan
  yaw: -Math.PI / 2 + 0.3, // -90° = tampak samping, menghadap kiri; +0.3 = sedikit miring 3/4
  yShift: 0, // geser vertikal (fraksi tinggi layar, + = naik)
  introDuration: 2.2, // detik, mobil masuk lalu melambat
  introDelay: 0.3, // detik jeda setelah model siap
  exitDuration: 1.2, // detik, mobil melesat pergi
  leaveVh: 6, // mobil pergi setelah hero lewat sekian vh
  wheelRadius: 1.52, // jari-jari roda di unit model (dari geometri)
  wheelSpin: 1, // ganti jadi -1 kalau roda berputar mundur
};
