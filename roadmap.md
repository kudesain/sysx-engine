Roadmap Pengembangan SysX Engine
Dokumen ini menguraikan rencana pengembangan untuk SysX Engine, dari kondisi saat ini hingga menjadi engine yang matang dan siap diintegrasikan ke dalam firmware SysMOGA.

Fase 1: Fondasi Inti (Core Foundation) - (75% Selesai)
Tujuan: Membangun kerangka kerja engine yang dapat berjalan dengan fungsionalitas rendering, input, dan manajemen aset yang paling dasar.

✅ Rendering Canvas 2D: Inisialisasi canvas dan context.

✅ Game Loop Dasar: Implementasi _create, _update, _draw melalui requestAnimationFrame.

✅ API Gambar Primitif: Fungsi cls() dan rectfill().

✅ API Input: Fungsi btn() (tekan dan tahan) dan btnp() (tekan sekali).

✅ Manajemen Aset Sederhana: Kemampuan memuat dan menampilkan sprite tunggal melalui spr().

✅ Palet Warna Tetap: Mengadopsi palet PICO-8 sebagai standar.

Status Saat Ini: Kita sudah berada di akhir fase ini dengan kode v0.2. Fondasi sudah terbukti berjalan.

Fase 2: Menciptakan "PICO-8 Vibe" (The Vibe)
Tujuan: Mengimplementasikan fitur-fitur kunci yang memberikan "rasa" konsol fantasi retro yang khas, powerful, namun tetap simpel. Ini adalah fase paling krusial untuk membentuk identitas engine.

1. Spritesheet & Tilemap (map()):

Prioritas: Sangat Tinggi.

Deskripsi: Mengembangkan API spr() agar bisa menggambar satu bagian (tile) dari sebuah gambar besar (spritesheet). Membuat fungsi map() yang bisa membaca sebuah array (atau data tilemap) untuk menggambar seluruh layar/level dengan efisien. Ini adalah tulang punggung dari kebanyakan game 2D retro.

2. Audio Engine (sfx() & music()):

Prioritas: Tinggi.

Deskripsi: Membuat sistem audio sederhana. sfx() untuk memutar efek suara pendek (tembakan, lompatan, ledakan) dan music() untuk memutar dan me-looping musik latar.

3. Deteksi Tabrakan (Collision):

Prioritas: Medium.

Deskripsi: Membuat fungsi helper di dalam engine untuk deteksi tabrakan, misalnya SysX.collide(obj1, obj2). Ini akan menyederhanakan logika game secara drastis bagi developer.

4. Kamera & Efek Visual:

Prioritas: Medium.

Deskripsi: Menambahkan fungsi camera(x, y) untuk menggeser viewport dan shake(intensity) untuk efek getaran layar. Ini akan menambah "juice" pada game.

Fase 3: Pengalaman Developer (Developer Experience)
Tujuan: Membuat engine ini tidak hanya powerful, tapi juga mudah dan menyenangkan untuk digunakan.

1. Dokumentasi API Resmi:

Prioritas: Tinggi.

Deskripsi: Membuat dokumen yang jelas menjelaskan setiap fungsi SysX, parameternya, dan contoh penggunaannya.

2. Debugging Tools:

Prioritas: Medium.

Deskripsi: Menambahkan "mode debug" yang bisa diaktifkan untuk menampilkan informasi di layar, seperti FPS (Frames Per Second), jumlah objek, dan penggunaan memori.

3. State Management Sederhana:

Prioritas: Rendah.

Deskripsi: Menyediakan helper opsional untuk mengelola state game (misalnya: MENU, PLAYING, GAME_OVER) agar kode game lebih terstruktur.

Fase 4: Integrasi Firmware Penuh
Tujuan: "Lulus" dari tahap simulasi dan mengintegrasikan SysX Engine secara native ke dalam firmware SysMOGA.

1. Modifikasi SysmogaCore.js:

Prioritas: Sangat Tinggi.

Deskripsi: Mengimplementasikan logika bootloader.js kita ke dalam file firmware SysMOGA yang sesungguhnya. Firmware harus bisa mengenali romType: 'experimental_canvas' dan menjalankan alur inisialisasi SysX.

2. Pemisahan File Engine:

Prioritas: Tinggi.

Deskripsi: Memecah sysx.js menjadi beberapa file (misal: sysx_core.js, sysx_gfx.js, sysx_audio.js) dan memastikan firmware memuatnya dengan benar sebelum game dijalankan.

3. Pengujian Kompatibilitas:

Prioritas: Tinggi.

Deskripsi: Memastikan game SysX berjalan mulus di dalam lingkungan SysMOGA, termasuk transisi dari menu utama, fungsi tombol keluar, dan interaksi dengan UI konsol.

Dengan roadmap ini, langkah kita selanjutnya sudah jelas: fokus pada Fase 2, dimulai dari fitur yang paling penting yaitu Spritesheet dan map(). Siap, Bro?