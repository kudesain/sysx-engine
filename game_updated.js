// ===============================================================
//
//          SysX Game: Hyperpixel Shooter (Ultimate Edition v2)
//
// Versi final dengan perbaikan skor, menu baru, grafis tajam,
// dan gameplay yang disempurnakan.
//
// ===============================================================

window.Game = {
    // Variabel-variabel game
    player: {},
    bullets: [],
    enemyBullets: [],
    enemies: [],
    stars: [],
    explosions: [],
    powerUps: [], // Untuk item power-up
    score: 0,
    spawnTimer: 0,
    
    // Variabel untuk Menu
    playerColor: 7, // Warna default (putih)
    selectedColorIndex: 0,
    menuSelection: 0, // 0: Start, 1: Pilih Warna
    
    // Konfigurasi
    canvasWidth: 320,
    canvasHeight: 240,
    audioCtx: null,

    // Data untuk Pixel Art
    PLAYER_ART: [ "  1 ", " 111", "11111", " 2 2 " ],
    ENEMY_DIVER_ART: [ " 888 ", "88888", " 8 8 " ],
    ENEMY_SHOOTER_ART: [ " E E ", "EEEEE", " EEE " ],
    POWERUP_ART: [ " P ", "PPP", " P "],

    //----------------------------------------------------------------
    // _create()
    //----------------------------------------------------------------
    _create: function() {
        const initAudio = () => {
            if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            document.removeEventListener('keydown', initAudio);
            document.removeEventListener('mousedown', initAudio);
        };
        document.addEventListener('keydown', initAudio);
        document.addEventListener('mousedown', initAudio);

        this.initStars();
        SysX.state('charSelect'); // Mulai dari menu pilih karakter
    },

    //================================================================
    // STATE: charSelect (Menu Utama)
    //================================================================
    _init_charSelect: function() {
        this.menuSelection = 0; // Reset ke pilihan "START"
        this.availableColors = [7, 11, 12, 14, 5]; // Putih, Biru, Cyan, Ungu, Abu-abu
    },

    _update_charSelect: function() {
        this.updateStars();

        // Navigasi menu (atas/bawah)
        if (SysX.btnp('up') || SysX.btnp('down')) {
            this.menuSelection = 1 - this.menuSelection; // Toggle antara 0 dan 1
        }

        if (this.menuSelection === 1) { // Jika "PILIH WARNA" dipilih
            if (SysX.btnp('left')) {
                this.selectedColorIndex = (this.selectedColorIndex - 1 + this.availableColors.length) % this.availableColors.length;
            }
            if (SysX.btnp('right')) {
                this.selectedColorIndex = (this.selectedColorIndex + 1) % this.availableColors.length;
            }
            this.playerColor = this.availableColors[this.selectedColorIndex];
        }

        // Tombol Aksi (Spasi)
        if (SysX.btnp('space')) {
            if (this.menuSelection === 0) { // Jika "START" dipilih
                SysX.state('playing');
            }
        }
    },

    _draw_charSelect: function() {
        SysX.cls(0);
        this.drawStars();
        SysX.print("HYPERPIXEL SHOOTER", 88, 40, 7);

        // Gambar preview pesawat dengan warna terpilih
        this.drawPixelArt(140, 80, this.PLAYER_ART, 8, {'1': this.playerColor, '2': 10});

        // PERBAIKAN: Gambar kotak menu modern retro
        const menuBoxX = 70;
        const menuBoxY = 150;
        const menuBoxWidth = 180;
        const menuBoxHeight = 50;
        SysX.rectfill(menuBoxX, menuBoxY, menuBoxWidth, menuBoxHeight, 7); // Border putih
        SysX.rectfill(menuBoxX + 2, menuBoxY + 2, menuBoxWidth - 4, menuBoxHeight - 4, 1); // Background biru tua

        // Gambar menu
        const startColor = this.menuSelection === 0 ? 10 : 7;
        const selectColor = this.menuSelection === 1 ? 10 : 7;
        SysX.print("START", 138, 160, startColor);
        SysX.print("< PILIH WARNA >", 98, 180, selectColor);
        
        // Gambar panah selector
        const arrowY = this.menuSelection === 0 ? 160 : 180;
        SysX.print(">", 85, arrowY, 10);
    },

    //================================================================
    // STATE: playing
    //================================================================
    _init_playing: function() {
        this.player = { 
            x: 152, y: 210, w: 20, h: 16, speed: 3, 
            shootCooldown: 0, lives: 3, invincibleTimer: 120,
            weaponType: 'default', powerUpTimer: 0
        };
        this.score = 0;
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.explosions = [];
        this.powerUps = [];
        this.spawnTimer = 0;
    },

    _update_playing: function() {
        this.updateStars();
        this.updateExplosions();
        this.updatePowerUps();
        
        // --- Logika Player ---
        if (this.player.invincibleTimer > 0) this.player.invincibleTimer--;
        if (this.player.powerUpTimer > 0) {
            this.player.powerUpTimer--;
            if (this.player.powerUpTimer === 0) this.player.weaponType = 'default';
        }

        if (SysX.btn('left') && this.player.x > 0) this.player.x -= this.player.speed;
        if (SysX.btn('right') && this.player.x + this.player.w < this.canvasWidth) this.player.x += this.player.speed;

        if (this.player.shootCooldown > 0) this.player.shootCooldown--;
        if (SysX.btn('space') && this.player.shootCooldown === 0) {
            this.fireWeapon();
            this.playSound('shoot');
            this.player.shootCooldown = this.player.weaponType === 'spread' ? 12 : 10;
        }

        this.updateBullets();
        this.updateEnemies();
        
        SysX.watch('SCORE', this.score);
        SysX.watch('LIVES', this.player.lives);

        // Trigger pause
        if (SysX.btnp('start')) {
            SysX.state('__sysx_pause__');
        }
    },

    _draw_playing: function() {
        SysX.cls(0);
        this.drawStars();
        this.drawExplosions();
        this.drawPowerUps();
        
        for (const e of this.enemies) {
            const art = e.type === 'shooter' ? this.ENEMY_SHOOTER_ART : this.ENEMY_DIVER_ART;
            const colorMap = e.type === 'shooter' ? {'E': 14} : {'8': 8};
            this.drawPixelArt(e.x, e.y, art, 4, colorMap);
        }
        
        for (const eb of this.enemyBullets) SysX.rectfill(eb.x, eb.y, eb.w, eb.h, 8);
        for (const b of this.bullets) SysX.rectfill(b.x, b.y, b.w, b.h, 11);

        if (this.player.invincibleTimer % 10 < 5) {
             this.drawPixelArt(this.player.x, this.player.y, this.PLAYER_ART, 4, {'1': this.playerColor, '2': 10});
        }

        for (let i = 0; i < this.player.lives; i++) {
            this.drawPixelArt(8 + (i * 24), 22, this.PLAYER_ART, 2, {'1': this.playerColor, '2': 10});
        }
        SysX.print(`SKOR: ${this.score}`, 8, 10, 7);
    },

    //================================================================
    // STATE: gameOver
    //================================================================
    _init_gameOver: function() {},
    _update_gameOver: function() {
        this.updateStars();
        this.updateExplosions();
        if (SysX.btnp('space')) SysX.state('charSelect'); // Kembali ke menu utama
    },
    _draw_gameOver: function() {
        SysX.cls(2);
        this.drawStars();
        this.drawExplosions();
        SysX.print("GAME OVER", 120, 100, 7);
        SysX.print(`SKOR AKHIR: ${this.score}`, 96, 120, 7);
        SysX.print("Tekan Spasi untuk Kembali", 60, 160, 6);
    },
    
    //================================================================
    // Fungsi Helper (diperbarui dan ditambahkan)
    //================================================================
    fireWeapon: function() {
        switch(this.player.weaponType) {
            case 'spread':
                this.bullets.push({ x: this.player.x + 9, y: this.player.y, w: 3, h: 9, vx: -1, vy: -5 });
                this.bullets.push({ x: this.player.x + 9, y: this.player.y, w: 3, h: 9, vx: 0, vy: -5 });
                this.bullets.push({ x: this.player.x + 9, y: this.player.y, w: 3, h: 9, vx: 1, vy: -5 });
                break;
            default: // 'default'
                this.bullets.push({ x: this.player.x + 9, y: this.player.y, w: 3, h: 9, vx: 0, vy: -5 });
        }
    },
    
    updateBullets: function() {
        // Player
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.y += b.vy;
            b.x += b.vx;
            if (b.y < 0) this.bullets.splice(i, 1);
        }
        // Musuh
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const eb = this.enemyBullets[i];
            eb.y += eb.speed;
            if (eb.y > this.canvasHeight) this.enemyBullets.splice(i, 1);
            if (SysX.collide(eb, this.player)) this.handlePlayerHit();
        }
    },

    updateEnemies: function() {
        this.spawnTimer++;
        if (this.spawnTimer > 45) {
            this.spawnTimer = 0;
            const randomX = Math.random() * (this.canvasWidth - 20);
            const type = Math.random() > 0.6 ? 'shooter' : 'diver';
            this.enemies.push({ x: randomX, y: -16, w: 20, h: 12, speed: type === 'shooter' ? 1 : 2, type: type, shootTimer: Math.floor(Math.random() * 60) + 30, amplitude: Math.random() * 40 + 20, initialY: -16 });
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.initialY += enemy.speed;
            enemy.y = enemy.initialY;
            if (enemy.type === 'diver') enemy.x += Math.sin(enemy.y / enemy.amplitude) * 2;
            if (enemy.type === 'shooter') {
                enemy.shootTimer--;
                if (enemy.shootTimer <= 0) {
                    this.enemyBullets.push({x: enemy.x + 9, y: enemy.y + 12, w: 2, h: 6, speed: 2.5});
                    enemy.shootTimer = Math.floor(Math.random() * 80) + 60;
                }
            }
            if (enemy.y > this.canvasHeight) { this.enemies.splice(i, 1); continue; }
            if (SysX.collide(enemy, this.player)) {
                this.handlePlayerHit();
                this.createExplosion(enemy.x, enemy.y, 8);
                this.enemies.splice(i, 1);
                continue;
            }
            for (let j = this.bullets.length - 1; j >= 0; j--) {
                if (SysX.collide(this.bullets[j], enemy)) {
                    if (Math.random() < 0.2) {
                        this.spawnPowerUp(enemy.x, enemy.y);
                    }
                    this.createExplosion(enemy.x, enemy.y, enemy.type === 'shooter' ? 14 : 8);
                    this.playSound('explosion');
                    // PERBAIKAN: Tambahkan skor saat musuh hancur
                    this.score += 100;
                    this.enemies.splice(i, 1);
                    this.bullets.splice(j, 1);
                    break;
                }
            }
        }
    },

    spawnPowerUp: function(x, y) {
        this.powerUps.push({x: x, y: y, w: 12, h: 12, life: 300});
    },

    updatePowerUps: function() {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const p = this.powerUps[i];
            p.y += 1;
            p.life--;
            if (p.life <= 0 || p.y > this.canvasHeight) {
                this.powerUps.splice(i, 1);
                continue;
            }
            if (SysX.collide(p, this.player)) {
                this.player.weaponType = 'spread';
                this.player.powerUpTimer = 300;
                this.playSound('powerUp');
                this.powerUps.splice(i, 1);
            }
        }
    },

    drawPowerUps: function() {
        for (const p of this.powerUps) {
            if (p.life % 20 < 10) {
                this.drawPixelArt(p.x, p.y, this.POWERUP_ART, 4, {'P': 11});
            }
        }
    },

    handlePlayerHit: function() {
        if (this.player.invincibleTimer > 0) return;
        this.player.lives--;
        this.playSound('playerDie');
        SysX.shake(10, 500);
        this.createExplosion(this.player.x, this.player.y, 7);
        if (this.player.lives <= 0) {
            SysX.state('gameOver');
        } else {
            this.player.x = 152; this.player.y = 210;
            this.player.invincibleTimer = 120;
        }
    },

    drawPixelArt: function(x, y, art, pixelSize, colorMap) {
        for (let row = 0; row < art.length; row++) {
            for (let col = 0; col < art[row].length; col++) {
                const char = art[row][col];
                if (char !== ' ') {
                    const colorIndex = colorMap[char] || 7;
                    // PERBAIKAN: Gunakan Math.floor untuk gambar tajam
                    const drawX = Math.floor(x + col * pixelSize);
                    const drawY = Math.floor(y + row * pixelSize);
                    SysX.rectfill(drawX, drawY, pixelSize, pixelSize, colorIndex);
                }
            }
        }
    },
    
    createExplosion: function(x, y, baseColor) {
        this.explosions.push({ x: x, y: y, flashSize: 20, life: 30 });
        SysX.emit(x, y, 40, Math.random() > 0.5 ? baseColor : 10, 50);
    },
    updateExplosions: function() {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const exp = this.explosions[i];
            exp.life--; exp.flashSize -= 0.8;
            if (exp.life <= 0 || exp.flashSize <= 0) this.explosions.splice(i, 1);
        }
    },
    drawExplosions: function() {
        for (const exp of this.explosions) {
            const color = exp.life % 10 < 5 ? 7 : 10;
            SysX.rectfill(exp.x - exp.flashSize, exp.y - exp.flashSize, exp.flashSize * 2, exp.flashSize * 2, color);
        }
    },
    initStars: function() {
        this.stars = [];
        for (let i = 0; i < 100; i++) this.stars.push({ x: Math.random() * this.canvasWidth, y: Math.random() * this.canvasHeight, speed: Math.random() * 1.5 + 0.5, size: Math.random() * 1.5 + 0.5 });
    },
    updateStars: function() {
        for (const star of this.stars) {
            star.y += star.speed;
            if (star.y > this.canvasHeight) { star.y = 0; star.x = Math.random() * this.canvasWidth; }
        }
    },
    drawStars: function() {
        for (const star of this.stars) SysX.rectfill(star.x, star.y, star.size, star.size, 6);
    },
    playSound: function(type) {
        if (!this.audioCtx) return;
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        if (type === 'shoot') {
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(880, this.audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.1);
            oscillator.start(); oscillator.stop(this.audioCtx.currentTime + 0.1);
        } else if (type === 'explosion') {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(440, this.audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
            oscillator.start(); oscillator.stop(this.audioCtx.currentTime + 0.3);
        } else if (type === 'playerDie') {
             oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(880, this.audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.8);
            gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.8);
            oscillator.start(); oscillator.stop(this.audioCtx.currentTime + 0.8);
        } else if (type === 'powerUp') {
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(600, this.audioCtx.currentTime);
            oscillator.frequency.linearRampToValueAtTime(1200, this.audioCtx.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
            oscillator.start(); oscillator.stop(this.audioCtx.currentTime + 0.3);
        }
    }
};
