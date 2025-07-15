// --- /sysx_engine/sysx_input.js ---
window.SysX_Modules = window.SysX_Modules || {};
window.SysX_Modules.input = (() => {
    let _inputState = {}; let _prevInputState = {};
    function btn(k) { return _inputState[k] || false; }
    function btnp(k) { return _inputState[k] && !_prevInputState[k]; }
    function _updateInput(newState) { _inputState = newState; }
    function updatePrevInput() { _prevInputState = { ..._inputState }; }
    return { btn, btnp, _updateInput, updatePrevInput };
})();
