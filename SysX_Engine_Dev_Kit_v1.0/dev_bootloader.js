// ===============================================================
//
//          SysX Dev Kit - Bootloader
//
// File ini mensimulasikan firmware SysMOGA. Tugasnya adalah
// memuat aset dan menjalankan SysX Engine.
//
// ===============================================================

class SysmogaCore {
    constructor() {
        this.activeInput = {};
        this.screenContainer = document.getElementById('sysmoga-screen-container');
        this.statusLog = document.getElementById('status-log');

        const keyMap = { 'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right', ' ': 'space', 'x': 'keyB' };
        document.addEventListener('keydown', (e) => { if (keyMap[e.key]) { this.activeInput[keyMap[e.key]] = true; e.preventDefault(); } });
        document.addEventListener('keyup', (e) => { if (keyMap[e.key]) { this.activeInput[keyMap[e.key]] = false; e.preventDefault(); } });
    }

    log(message) {
        const p = document.createElement('p');
        p.className = 'log-entry';
        p.textContent = message;
        this.statusLog.appendChild(p);
        this.statusLog.scrollTop = this.statusLog.scrollHeight;
    }

    async bootRom(rom) {
        this.log(`Membaca ROM...`);
        const assets = await this.loadAssets(rom.manifest);
        
        this.log(`ROM Type: experimental_canvas`);
        this.bootSysXGame(rom, assets);
    }

    async loadAssets(manifest) {
        if (!manifest || !manifest.assets || manifest.assets.length === 0) {
            this.log("Tidak ada aset eksternal untuk dimuat.");
            return {};
        }
        this.log(`Memuat ${manifest.assets.length} aset...`);
        // Di firmware asli, di sini akan ada logika untuk fetch aset dari file .win
        this.log("Semua aset berhasil dimuat (simulasi).");
        return {};
    }

    bootSysXGame(rom, assets) {
        this.log("Booting SysX Engine...");
        this.screenContainer.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;
        this.screenContainer.appendChild(canvas);

        const context = {
            canvas: canvas,
            ctx: canvas.getContext('2d'),
            assets: assets,
        };

        // Memanggil engine yang sudah dimuat oleh index.html
        SysX.init(context);
        this.startGameInputLoop();
        this.log(`SysX Game '${rom.manifest.title || 'Untitled'}' berjalan.`);
    }
    
    startGameInputLoop() {
        const loop = () => {
            // Memanggil fungsi internal dari modul input
            SysX._updateInput(this.activeInput);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}

// --- Inisialisasi Dev Kit ---
// Menunggu semua skrip (engine & game) dimuat oleh index.html
document.addEventListener('DOMContentLoaded', () => {
    const firmware = new SysmogaCore();
    
    // `manifest` dan `Game` sekarang ada di scope global
    // karena sudah dimuat oleh index.html
    const virtualRom = {
        manifest: window.manifest,
        gameCode: window.Game 
    };

    firmware.bootRom(virtualRom);
});
