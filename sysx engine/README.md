Selamat Datang di SysX Engine Starter Kit!
Ini adalah titik awal Anda untuk membuat game retro yang keren untuk platform SysMOGA menggunakan SysX Engine. Engine ini didesain agar simpel, cepat, dan memberikan "rasa" seperti konsol fantasi klasik.

Isi Starter Kit
/sysx_engine/: Folder berisi semua file inti dari SysX Engine. Jangan diubah kecuali Anda tahu apa yang Anda lakukan.

/assets/: Folder untuk menyimpan semua aset Anda (gambar, suara, musik).

spritesheet.png: File gambar utama untuk semua sprite game Anda.

game.js: File utama tempat Anda akan menulis semua logika game.

manifest.json: "Daftar isi" dari game Anda. Daftarkan semua aset Anda di sini.

Cara Memulai (Langkah demi Langkah)
Siapkan Aset:

Gambar semua sprite Anda (player, musuh, tile, dll.) di dalam file assets/spritesheet.png.

Masukkan file suara (.wav, .mp3) ke dalam folder assets/audio/.

Daftarkan Aset:

Buka manifest.json.

Untuk setiap aset, tambahkan entri baru. Beri key (nama panggilan) yang unik dan path (lokasi file) yang benar.

Tulis Kode Game:

Buka game.js.

Semua kode Anda ditulis di dalam objek Game.

Gunakan fungsi _create() untuk setup awal dan memulai state pertama (SysX.state('title')).

Untuk setiap state (misal: 'title', 'playing'), buat tiga fungsi: _init_..., _update_..., dan _draw_....

Gunakan API SysX:

Untuk menggambar, memutar suara, atau mengecek input, panggil fungsi dari objek global SysX. Contoh: SysX.spr(...), SysX.sfx(...), SysX.btnp(...).

Referensi API Cepat
Fungsi

Deskripsi

SysX.cls(color)

Bersihkan layar dengan warna.

SysX.spr(index, x, y)

Gambar sprite dari spritesheet.

SysX.map(data, x, y)

Gambar tilemap.

SysX.print(text, x, y, color)

Tulis teks.

SysX.sfx(key)

Mainkan efek suara.

SysX.music(key)

Mainkan musik latar.

SysX.btn(key)

Cek tombol (ditekan terus).

SysX.btnp(key)

Cek tombol (tekan sekali).

SysX.collide(obj1, obj2)

Cek tabrakan.

SysX.shake(intens, dur)

Getarkan layar.

SysX.emit(x, y, ...)

Buat partikel ledakan.

SysX.state(newState)

Ganti state game.

SysX.debug(bool)

Aktifkan/matikan mode debug.

SysX.watch(key, val)

Tampilkan nilai variabel di debug.

Selamat berkarya! Buatlah game impianmu!