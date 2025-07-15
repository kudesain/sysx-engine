// --- /sysx_engine/sysx_input.js ---
// Manajemen input.
(() => {
    window.SysX_Modules = window.SysX_Modules || {};

    window.SysX_Modules.input = (() => {
        let _inputState = {};
        let _prevInputState = {};

        function btn(k) { return _inputState[k] || false; }
        function btnp(k) { return _inputState[k] && !_prevInputState[k]; }
        
        // Fungsi internal yang dipanggil oleh firmware/bootloader
        function _updateInput(newState) { _inputState = newState; }
        
        // Fungsi internal yang dipanggil oleh core game loop
        function updatePrevInput() { _prevInputState = { ..._inputState }; }

        return { btn, btnp, _updateInput, updatePrevInput };
    })();
})();
