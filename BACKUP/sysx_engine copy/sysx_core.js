// --- /sysx_engine/sysx_core.js ---
// Mengelola data inti, game loop, dan state.

(() => {
    window.SysX_Modules = window.SysX_Modules || {};

    window.SysX_Modules.core = (() => {
        let _ctx, _canvas, _assets;
        let _currentState = '';
        let _debugMode = false;
        let _watchedValues = new Map();
        let _frameCount = 0, _lastFpsUpdate = 0, _currentFps = 0;

        const PICO8_PALETTE = ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8', '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA'];

        const SYSX_VERSION = 'v1.0.0';

        let _showIntro = true;
        let _introTimer = 120;
        let _introFrame = 0;
        let _introPhase = 0;
        let _bootLines = [
            '[SYSX BIOS ' + SYSX_VERSION + ']',
            '> Initializing virtual memory... ',
            '> Mounting cartridge.sysx',
            '> Loading engine modules...',
            '> Registering core...',
            '> Registering graphics...',
            '> OK',
            '> SYSTEM READY.'
        ];
        let _customBoot = null;

        fetch('assets/boot/intro.sysboot')
            .then(res => res.json())
            .then(data => { _customBoot = data; })
            .catch(() => {});

        function init(context) {
            _canvas = context.canvas;
            _ctx = context.ctx;
            _assets = context.assets;
            _ctx.imageSmoothingEnabled = false;
            _lastFpsUpdate = performance.now();

            try {
                const m = window.manifest;
                if (m && m.showIntro === false) _showIntro = false;
            } catch (e) {}

            _currentState = _showIntro ? '__sysx_intro__' : '';
            requestAnimationFrame(gameLoop);
        }

        function gameLoop(timestamp) {
            _frameCount++;
            if (timestamp > _lastFpsUpdate + 1000) {
                _currentFps = _frameCount;
                _frameCount = 0;
                _lastFpsUpdate = timestamp;
            }

            SysX_Modules.fx.updateParticles();
            SysX_Modules.fx.applyShake(_ctx);

            if (_currentState === '__sysx_intro__') {
                if (_customBoot) drawSysBootIntro(_customBoot);
                else drawIntro();
                requestAnimationFrame(gameLoop);
                return;
            }

            const updateFunc = window.Game[`_update_${_currentState}`];
            if (typeof updateFunc === 'function') updateFunc.call(window.Game);

            const drawFunc = window.Game[`_draw_${_currentState}`];
            if (typeof drawFunc === 'function') drawFunc.call(window.Game);

            SysX_Modules.fx.drawParticles(_ctx, SysX_Modules.graphics.rectfill);
            drawDebugInfo();

            _ctx.setTransform(1, 0, 0, 1, 0, 0);
            SysX_Modules.input.updatePrevInput();
            requestAnimationFrame(gameLoop);
        }

        function drawIntro() {
            SysX_Modules.graphics.cls(0);
            _introFrame++;

            if (_introPhase === 0) {
                const linesToShow = Math.floor(_introFrame / 10);
                for (let i = 0; i < linesToShow && i < _bootLines.length; i++) {
                    SysX_Modules.graphics.print(_bootLines[i], 20, 40 + i * 12, 7);
                }
                if (_introFrame === 10 || _introFrame === 30 || _introFrame === 50) playBeep(300, 0.05);
                if (_introFrame > _bootLines.length * 10 + 20) {
                    _introFrame = 0;
                    _introPhase = 1;
                }

            } else if (_introPhase === 1) {
                const logo = [
                    "  ██████  ██    ██ ███████ ██   ██  ",
                    " ██    ██ ██    ██ ██      ██   ██  ",
                    " ██    ██ ██    ██ █████   ███████  ",
                    " ██    ██ ██    ██ ██           ██  ",
                    "  ██████   ██████  ███████      ██  "
                ];
                for (let i = 0; i < logo.length; i++) {
                    SysX_Modules.graphics.print(logo[i], 20, 40 + i * 12, 10);
                }
                SysX_Modules.graphics.print("SYSX ENGINE™", 80, 120, 6);
                SysX_Modules.graphics.print("- Retro Spirit, Modern Soul -", 40, 140, 5);

                if (_introFrame === 1) {
                    SysX.emit(160, 120, 30, 8, 80);
                    SysX.shake(2, 300);
                    playBeep(660, 0.2);
                }

                if (_introFrame > 90 || SysX_Modules.input.btnp('space')) {
                    _currentState = '';
                    if (typeof window.Game._create === 'function') window.Game._create();
                }
            }
        }

        function drawSysBootIntro(data) {
            SysX_Modules.graphics.cls(0);
            _introFrame++;

            const lines = data.steps || [];
            const logo = data.logo || [];
            const slogan = data.slogan || "";
            const delay = data.duration || 10;
            const linesToShow = Math.floor(_introFrame / delay);

            if (_introPhase === 0) {
                for (let i = 0; i < linesToShow && i < lines.length; i++) {
                    SysX_Modules.graphics.print(lines[i], 20, 40 + i * 12, data.color || 7);
                }
                if (_introFrame > lines.length * delay + 20) {
                    _introFrame = 0;
                    _introPhase = 1;
                }
            } else if (_introPhase === 1) {
                for (let i = 0; i < logo.length; i++) {
                    SysX_Modules.graphics.print(logo[i], 20, 40 + i * 12, data.color || 10);
                }
                SysX_Modules.graphics.print(slogan, 40, 140, data.color || 6);
                if (_introFrame === 1) {
                    SysX.emit(160, 120, 30, data.color || 8, 80);
                    SysX.shake(2, 300);
                    playBeep(660, 0.2);
                }
                if (_introFrame > 90 || SysX_Modules.input.btnp('space')) {
                    _currentState = '';
                    if (typeof window.Game._create === 'function') window.Game._create();
                }
            }
        }

        function playBeep(freq, duration = 0.1) {
            try {
                let ctx = window.Game.audioCtx;
                if (!ctx) {
                    ctx = new (window.AudioContext || window.webkitAudioContext)();
                    window.Game.audioCtx = ctx;
                }
                if (ctx.state === 'suspended') {
                    ctx.resume().then(() => _playBeepNow(ctx, freq, duration));
                } else {
                    _playBeepNow(ctx, freq, duration);
                }
            } catch (e) {}
        }

        function _playBeepNow(ctx, freq, duration) {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.type = 'square';
            o.frequency.value = freq;
            g.gain.setValueAtTime(0.1, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            o.start(); o.stop(ctx.currentTime + duration);
        }

        function drawDebugInfo() {
            if (_debugMode) {
                const info = [`FPS: ${_currentFps}`, `PART: ${SysX_Modules.fx.getParticleCount()}`];
                _watchedValues.forEach((v, k) => info.push(`${k.toUpperCase()}: ${v}`));
                let y = 0;
                for (const t of info) {
                    SysX_Modules.graphics.rectfill(0, y, _ctx.measureText(t).width + 8, 16, 0);
                    SysX_Modules.graphics.print(t, 4, y + 12, 7);
                    y += 16;
                }
            }
        }

        const getContext = () => ({ _ctx, _canvas, _assets, PICO8_PALETTE });
        const debug = (isEnabled) => { _debugMode = !!isEnabled; };
        const watch = (key, value) => { if (_debugMode) _watchedValues.set(key, value); };
        const state = (newState) => {
            _currentState = newState;
            const initFunc = window.Game[`_init_${newState}`];
            if (typeof initFunc === 'function') initFunc.call(window.Game);
        };

        return { init, getContext, debug, watch, state };
    })();
})();