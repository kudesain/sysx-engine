// --- /sysx_engine/sysx_graphics.js ---
// Semua fungsi yang berhubungan dengan menggambar.

window.SysX_Modules = window.SysX_Modules || {};

window.SysX_Modules.graphics = (() => {
    const TILE_SIZE = 16;
    const SPRITESHEET_KEY = 'main_spritesheet';
    
    const getCoreContext = () => SysX_Modules.core.getContext();

    function cls(c) { const { _ctx, _canvas, PICO8_PALETTE } = getCoreContext(); _ctx.fillStyle = PICO8_PALETTE[c] || '#000'; _ctx.fillRect(0, 0, _canvas.width, _canvas.height); }
    function rectfill(x, y, w, h, c) { const { _ctx, PICO8_PALETTE } = getCoreContext(); _ctx.fillStyle = PICO8_PALETTE[c] || '#FFF'; _ctx.fillRect(x, y, w, h); }
    function print(t, x, y, c) { const { _ctx, PICO8_PALETTE } = getCoreContext(); _ctx.font = '14px "Roboto Mono"'; _ctx.fillStyle = PICO8_PALETTE[c] || '#FFF'; _ctx.fillText(t, x, y); }
    function spr(idx, dx, dy) { const { _ctx, _assets } = getCoreContext(); const sheet = _assets[SPRITESHEET_KEY]; if (!sheet || !sheet.complete) return; const cols = Math.floor(sheet.width / TILE_SIZE); const sx = (idx % cols) * TILE_SIZE; const sy = Math.floor(idx / cols) * TILE_SIZE; _ctx.drawImage(sheet, sx, sy, TILE_SIZE, TILE_SIZE, dx, dy, TILE_SIZE, TILE_SIZE); }
    function map(tm, mx = 0, my = 0) { if (!tm) return; for (let r = 0; r < tm.length; r++) for (let c = 0; c < tm[r].length; c++) if (tm[r][c] >= 0) spr(tm[r][c], mx + c * TILE_SIZE, my + r * TILE_SIZE); }
    
    return { cls, rectfill, print, spr, map };
})();
