Dokumentasi API Resmi - SysX Engine v0.7
Selamat datang di dokumentasi resmi SysX Engine. Dokumen ini adalah panduan lengkap untuk semua fungsi yang tersedia bagi developer untuk membuat game di platform SysX.

Filosofi API
API SysX didesain agar simpel, mudah diingat, dan terinspirasi dari konsol fantasi klasik. Sebagian besar fungsi menggunakan nama singkatan 3 huruf dan menggunakan indeks warna dari palet PICO-8.

Fungsi Inti (Core)
SysX.debug( isEnabled )
Mengaktifkan atau menonaktifkan mode debug.

isEnabled (boolean): true untuk mengaktifkan, false untuk menonaktifkan.

Contoh: SysX.debug(true) akan menampilkan informasi FPS.

Fungsi Gambar (Graphics)
SysX.cls( [colorIndex] )
Membersihkan seluruh layar (Clear Screen) dengan satu warna.

colorIndex (number, opsional): Indeks warna (0-15) dari palet PICO-8. Default-nya adalah 0 (hitam).

Contoh: SysX.cls(1) akan membuat seluruh layar menjadi biru gelap.

SysX.rectfill( x, y, width, height, [colorIndex] )
Menggambar sebuah kotak yang terisi warna.

x, y (number): Koordinat pojok kiri atas kotak.

width, height (number): Ukuran kotak dalam piksel.

colorIndex (number, opsional): Indeks warna. Default-nya adalah 7 (putih).

Contoh: SysX.rectfill(10, 20, 32, 32, 8) menggambar kotak merah.

SysX.print( text, x, y, [colorIndex] )
Menulis teks ke layar.

text (string): Teks yang ingin ditampilkan.

x, y (number): Koordinat awal teks.

colorIndex (number, opsional): Indeks warna. Default-nya adalah 7 (putih).

Contoh: SysX.print("HELLO", 100, 50, 10)

SysX.spr( spriteIndex, x, y )
Menggambar satu sprite dari spritesheet utama.

spriteIndex (number): Indeks sprite yang akan digambar (dimulai dari 0, dari kiri ke kanan, atas ke bawah).

x, y (number): Koordinat tujuan di layar.

Catatan: Ukuran sprite ditentukan oleh TILE_SIZE di dalam engine (saat ini 16x16).

SysX.map( tilemap, [mapX], [mapY] )
Menggambar seluruh tilemap (peta) ke layar.

tilemap (Array of Arrays): Data level 2D, di mana setiap angka adalah spriteIndex. Angka negatif akan dianggap kosong.

mapX, mapY (number, opsional): Offset atau pergeseran posisi peta di layar. Default-nya 0, 0.

Fungsi Audio
SysX.sfx( soundKey )
Memainkan efek suara (Sound Effect).

soundKey (string): Nama kunci (key) dari aset audio yang didefinisikan di manifest.json.

Catatan: sfx bisa diputar berkali-kali tanpa mengganggu musik atau sfx lainnya.

SysX.music( key, [loop], [stop] )
Mengontrol musik latar (BGM).

key (string | null): Kunci aset musik. Jika null, akan menghentikan musik saat ini.

loop (boolean, opsional): Apakah musik akan diulang. Default-nya true.

stop (boolean, opsional): Jika true, akan menghentikan musik dan tidak memulai yang baru. Berguna untuk SysX.music(null, false, true).

Contoh: SysX.music('level1_theme')

Fungsi Fisika & Efek
SysX.collide( object1, object2 )
Mendeteksi tabrakan antara dua objek (Axis-Aligned Bounding Box).

object1, object2 (object): Objek yang harus memiliki properti {x, y, w, h}.

Mengembalikan: true jika bertabrakan, false jika tidak.

SysX.shake( intensity, duration )
Menggetarkan layar.

intensity (number): Kekuatan getaran (misal: 4).

duration (number): Lamanya getaran dalam milidetik (misal: 150).

SysX.emit( x, y, [count], [colorIndex], [life] )
Menciptakan ledakan partikel.

x, y (number): Titik pusat ledakan.

count (number, opsional): Jumlah partikel. Default 10.

colorIndex (number, opsional): Warna partikel. Default 9 (oranye).

life (number, opsional): Umur partikel dalam frame. Default 30.

Fungsi Input
SysX.btn( key )
Mengecek apakah sebuah tombol sedang ditekan dan ditahan.

key (string): Nama tombol ('left', 'right', 'up', 'down', 'space', 'keyB').

Mengembalikan: true selama tombol ditekan.

SysX.btnp( key )
Mengecek apakah sebuah tombol baru saja ditekan (satu kali per tekanan).

key (string): Nama tombol.

Mengembalikan: true hanya pada frame pertama tombol ditekan.