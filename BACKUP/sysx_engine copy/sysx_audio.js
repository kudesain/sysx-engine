// --- /sysx_engine/sysx_audio.js ---
window.SysX_Modules = window.SysX_Modules || {};
window.SysX_Modules.audio = (() => {
    let _currentMusic = null;
    const getCoreContext = () => SysX_Modules.core.getContext();
    function sfx(key) { const { _assets } = getCoreContext(); const sound = _assets[key]; if (sound) { sound.currentTime = 0; sound.play().catch(e => {}); } }
    function music(key, loop = true, stop = false) { if (_currentMusic) { _currentMusic.pause(); _currentMusic = null; } if (stop) return; const { _assets } = getCoreContext(); const sound = _assets[key]; if (sound) { sound.loop = loop; sound.currentTime = 0; sound.play().catch(e => {}); _currentMusic = sound; } }
    return { sfx, music };
})();
