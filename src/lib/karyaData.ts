export type Orientation = "landscape" | "portrait";

export type KartuData = {
  title: string;
  description: string;
  image?: string; // path dari /public, contoh: "/karya/mymind/dashboard.webp"
};

export type ProjectData = {
  id: string;
  name: string;
  description: string; // penjelasan project, tampil di kolom kiri section Karya
  orientation: Orientation;
  demoUrl: string;
  cards: KartuData[];
};

// Kartu tanpa `image` tampil sebagai kotak berwarna (placeholder).
export const PROJECTS: ProjectData[] = [
  {
    id: "mymind",
    name: "Nodea",
    description:
      "Aplikasi mind map berbasis web untuk menyusun ide jadi cabang topik yang rapi. Bisa dikerjakan bareng secara real-time dengan live cursor, peran Owner, Editor, dan Viewer, lima tema kanvas, serta gambar di tiap node.",
    orientation: "landscape",
    demoUrl: "https://stfqmind.vercel.app/dashboard",
    cards: [
      {
        title: "Dashboard",
        description: "Ringkasan semua mind map-mu dalam satu tampilan.",
        image: "/karya/mymind/dashboard.png",
      },
      {
        title: "Editor Mind Map",
        description:
          "Kanvas interaktif dengan auto-layout, drag & drop, undo/redo, dan gambar di node.",
        image: "/karya/mymind/editor.png",
      },
      {
        title: "Atur Akses",
        description:
          "Undang lewat email dan atur peran Owner, Editor, atau Viewer.",
        image: "/karya/mymind/kolaborasi.png",
      },
      {
        title: "Kolaborasi Real-Time",
        description:
          "Live cursor dan penanda node, perubahan muncul seketika di semua kolaborator.",
        image: "/karya/mymind/kolaborasi-realtime.png",
      },
      {
        title: "Tema Kanvas",
        description:
          "5 tema kanvas, plus cari node dan ubah warna serta border tiap node.",
        image: "/karya/mymind/tema.png",
      },
    ],
  },
  {
    id: "jawhan",
    name: "Jawhan",
    description:
      "Aplikasi mobile-first untuk membantu mengurangi kebiasaan memencet jerawat. Ada Pause untuk menahan dorongan, pencatatan keberhasilan dan kegagalan, ringkasan dengan grafik, serta pemantauan jerawat dengan foto sampai sembuh.",
    orientation: "portrait",
    demoUrl: "https://jerawat-hunter.vercel.app",
    cards: [
      {
        title: "Dashboard",
        description:
          "Pintu masuk cepat: mulai Pause saat dorongan muncul, lalu catat keberhasilan atau kegagalan.",
        image: "/karya/jawhan/dashboard.png",
      },
      {
        title: "Pause",
        description:
          "Atur durasi jeda, aktifkan notifikasi, pilih suaranya, lalu catat hasilnya setelah selesai.",
        image: "/karya/jawhan/pause.png",
      },
      {
        title: "Ringkasan",
        description:
          "Lihat berapa dorongan yang berhasil ditahan, persentase keberhasilan, dan grafik harian.",
        image: "/karya/jawhan/ringkasan.png",
      },
      {
        title: "Pemantauan",
        description:
          "Catat data, unggah foto dan beri tanda, lalu pantau lama sembuh sesuai perawatan.",
        image: "/karya/jawhan/pemantauan.png",
      },
      {
        title: "Rata-rata Sembuh",
        description:
          "Lihat rata-rata lama jerawat sembuh per bulan atau tahun, bisa difilter per lokasi.",
        image: "/karya/jawhan/rata-sembuh.png",
      },
    ],
  },
  {
    id: "seblak",
    name: "Dapur Seblak", // sementara, dari tulisan di UI
    description:
      "Aplikasi pemesanan berbasis web untuk tempat makan seblak. Pelanggan memindai kode QR di meja, memesan, membayar, dan memantau status pesanan. Admin mengelola order, menu, dan laporan, dengan struk tercetak otomatis.",
    orientation: "portrait",
    demoUrl: "#", // TODO: ganti dengan tautan demo sebelum deploy
    cards: [
      {
        title: "Pilih Menu",
        description:
          "Pilih seblak sesuai topping, lalu tambah minuman dan makanan penutup. Setelah itu lanjut ke pembayaran.",
        image: "/karya/seblak/menu.png",
      },
      {
        title: "Konfirmasi Pesanan",
        description:
          "Periksa pesananmu, isi nama, lalu pilih bayar lewat E-Wallet atau langsung di kasir.",
        image: "/karya/seblak/konfirmasi.png",
      },
      {
        title: "Status Pesanan",
        description:
          "Pantau pesananmu langsung: baru diterima, sedang dimasak, atau sudah selesai. Status diperbarui otomatis.",
        image: "/karya/seblak/status.png",
      },
      {
        title: "Panel Admin",
        description:
          "Kelola order, menu, meja, dan kode QR dari satu panel, lengkap dengan riwayat order dan laporan penjualan. Struk tercetak otomatis saat pesanan selesai.",
        image: "/karya/seblak/admin.png",
      },
    ],
  },
  {
    id: "absensi",
    name: "Absensi Pesantren", // sementara, dari tulisan di UI
    description:
      "Aplikasi web untuk mengelola absensi dan kedisiplinan santri di pesantren. Admin mencatat absen sholat dan kelas, lalu sistem merekap kehadiran, skor kedisiplinan, dan peringkat santri dalam rentang tanggal yang dipilih.",
    orientation: "landscape",
    demoUrl: "#", // TODO: ganti dengan tautan demo sebelum deploy
    cards: [
      {
        title: "Dashboard",
        description:
          "Navigasi cepat ke Rekap Absensi, Leaderboard, Rekap Piket, dan Data Absen dalam satu klik.",
        image: "/karya/absensi/dashboard.png",
      },
      {
        title: "Rekap Absen",
        description:
          "Filter per rentang tanggal, lihat hadir, telat, sakit, izin, alpa, skor persen, ringkasan, dan grafik.",
        image: "/karya/absensi/rekap.png",
      },
      {
        title: "Leaderboard",
        description:
          "Peringkat santri dari yang terbaik, lengkap dengan persentase kedisiplinan, tanggung jawab, dan skor final.",
        image: "/karya/absensi/leaderboard.png",
      },
      {
        title: "Panel Admin",
        description:
          "Kelola data santri dan isi absen sholat serta kelas per santri, bisa tandai semua hadir lalu submit sekaligus.",
        image: "/karya/absensi/admin.png",
      },
    ],
  },
];
