// ===============================================================
//
//          SysX Game Template
//
// Ini adalah file utama untuk game Anda.
// Tulis semua logika game Anda di dalam objek `Game` ini.
//
// ===============================================================

const Game = {
    // Variabel-variabel game Anda bisa disimpan di sini
    player: {},
    score: 0,

    //----------------------------------------------------------------
    // _create()
    // Fungsi ini dipanggil sekali oleh engine saat game pertama kali dimulai.
    // Gunakan untuk setup awal dan memulai state pertama.
    //----------------------------------------------------------------
    _create: function() {
        // Memulai game dari state 'title'
        SysX.state('title');
    },

    //================================================================
    // STATE: title
    // State untuk layar judul.
    //================================================================
    
    // Dipanggil sekali saat state 'title' dimulai
    _init_title: function() {
        // Hentikan musik apa pun yang mungkin berjalan
        SysX.music(null, false, true); 
    },

    // Dipanggil setiap frame selama state adalah 'title'
    _update_title: function() {
        // Jika tombol A (spasi) ditekan, pindah ke state 'playing'
        if (SysX.btnp('space')) {
            SysX.state('playing');
        }
    },

    // Dipanggil setiap frame untuk menggambar selama state adalah 'title'
    _draw_title: function() {
        SysX.cls(1); // Latar biru gelap
        SysX.print("NAMA GAME ANDA", 80, 100, 7);
        SysX.print("Tekan Tombol A untuk Mulai", 40, 140, 6);
    },

    //================================================================
    // STATE: playing
    // State untuk permainan utama.
    //================================================================

    // Dipanggil sekali saat state 'playing' dimulai
    _init_playing: function() {
        // Reset semua variabel permainan
        this.player = { x: 152, y: 180, w: 16, h: 16, speed: 2, spriteIndex: 3 };
        this.score = 0;
        
        // Mainkan musik latar untuk level ini
        SysX.music('level_music');
    },

    // Dipanggil setiap frame selama state adalah 'playing'
    _update_playing: function() {
        // Logika pergerakan player
        if (SysX.btn('left')) this.player.x -= this.player.speed;
        if (SysX.btn('right')) this.player.x += this.player.speed;

        // Logika menembak
        if (SysX.btnp('space')) {
            SysX.sfx('shoot_sfx');
        }

        // Toggle debug mode dengan tombol B (x)
        if (SysX.btnp('keyB')) {
            this.isDebug = !this.isDebug;
            SysX.debug(this.isDebug);
        }
        
        // Tampilkan info di debug overlay
        SysX.watch('score', this.score);
        SysX.watch('player_x', Math.floor(this.player.x));
    },

    // Dipanggil setiap frame untuk menggambar selama state adalah 'playing'
    _draw_playing: function() {
        SysX.cls(12); // Latar biru langit
        
        // Gambar player
        SysX.spr(this.player.spriteIndex, this.player.x, this.player.y);

        // Gambar UI
        SysX.print(`SKOR: ${this.score}`, 8, 20, 7);
    }

    //================================================================
    // Tambahkan state lain di sini (misal: game_over, win, dll.)
    //================================================================
};
