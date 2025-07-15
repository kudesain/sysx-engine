// --- /sysx_engine/sysx_core.js ---
// Mengelola data inti, game loop, dan state.

// Menggunakan IIFE (Immediately Invoked Function Expression) untuk menjaga scope
// dan tidak mengotori global scope selain yang kita inginkan.
(() => {
    // Definisikan modul ini di dalam scope global sementara
    window.SysX_Modules = window.SysX_Modules || {};

    window.SysX_Modules.core = (() => {
        let _ctx, _canvas, _assets;
        let _currentState = '';
        let _debugMode = false;
        let _watchedValues = new Map();
        let _frameCount = 0, _lastFpsUpdate = 0, _currentFps = 0;

        // Palet warna standar
        const PICO8_PALETTE = ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8', '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA'];

        function init(context) {
            _canvas = context.canvas; _ctx = context.ctx; _assets = context.assets;
            _ctx.imageSmoothingEnabled = false;
            _lastFpsUpdate = performance.now();
            if (typeof window.Game._create === 'function') window.Game._create();
            requestAnimationFrame(gameLoop);
        }

        function gameLoop(timestamp) {
            // Kalkulasi FPS
            _frameCount++;
            if (timestamp > _lastFpsUpdate + 1000) { _currentFps = _frameCount; _frameCount = 0; _lastFpsUpdate = timestamp; }
            
            // Panggil update & draw dari modul lain
            SysX_Modules.fx.updateParticles();
            SysX_Modules.fx.applyShake(_ctx);

            const updateFunc = window.Game[`_update_${_currentState}`];
            if (typeof updateFunc === 'function') updateFunc();
            
            const drawFunc = window.Game[`_draw_${_currentState}`];
            if (typeof drawFunc === 'function') drawFunc();
            
            SysX_Modules.fx.drawParticles(_ctx, SysX_Modules.graphics.rectfill);
            drawDebugInfo();

            _ctx.setTransform(1, 0, 0, 1, 0, 0);
            SysX_Modules.input.updatePrevInput();
            requestAnimationFrame(gameLoop);
        }

        function drawDebugInfo() {
            if (_debugMode) {
                const info = [`FPS: ${_currentFps}`, `PART: ${SysX_Modules.fx.getParticleCount()}`];
                _watchedValues.forEach((v, k) => info.push(`${k.toUpperCase()}: ${v}`));
                let y = 0;
                for (const t of info) {
                    // Menggunakan fungsi dari modul graphics
                    SysX_Modules.graphics.rectfill(0, y, _ctx.measureText(t).width + 8, 16, 0);
                    SysX_Modules.graphics.print(t, 4, y + 12, 7);
                    y += 16;
                }
            }
        }

        // Fungsi helper untuk memberikan akses ke variabel internal yang dibutuhkan modul lain
        const getContext = () => ({ _ctx, _canvas, _assets, PICO8_PALETTE });
        
        // API Publik dari modul ini
        const debug = (isEnabled) => { _debugMode = !!isEnabled; };
        const watch = (key, value) => { if (_debugMode) _watchedValues.set(key, value); };
        const state = (newState) => {
            _currentState = newState;
            const initFunc = window.Game[`_init_${newState}`];
            if (typeof initFunc === 'function') initFunc();
        };

        return { init, getContext, debug, watch, state };
    })();
})();
