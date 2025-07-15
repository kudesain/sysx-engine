// --- /sysx_engine/sysx_fx.js ---
window.SysX_Modules = window.SysX_Modules || {};
window.SysX_Modules.fx = (() => {
    let _particles = []; let _shakeEndTime = 0, _shakeIntensity = 0;
    function collide(r1, r2) { if (!r1 || !r2) return false; return r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y; }
    function shake(intensity, duration) { _shakeIntensity = intensity; _shakeEndTime = Date.now() + duration; }
    function emit(x, y, count = 10, color = 9, life = 30) { for (let i = 0; i < count; i++) _particles.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4 - 1, size: Math.random() * 2 + 1, life: Math.random() * life, color }); }
    function updateParticles() { for (let i = _particles.length - 1; i >= 0; i--) { const p = _particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--; if (p.life <= 0) _particles.splice(i, 1); } }
    function drawParticles(_ctx, rectfillFunc) { for (const p of _particles) rectfillFunc(p.x, p.y, p.size, p.size, p.color); }
    function applyShake(_ctx) { if (Date.now() < _shakeEndTime) { const dx = (Math.random() - 0.5) * _shakeIntensity * 2; const dy = (Math.random() - 0.5) * _shakeIntensity * 2; _ctx.translate(dx, dy); } else { _shakeIntensity = 0; } }
    const getParticleCount = () => _particles.length;
    return { collide, shake, emit, updateParticles, drawParticles, applyShake, getParticleCount };
})();
