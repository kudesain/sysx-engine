// --- /sysx_engine/sysx_main.js ---
// File ini merakit semua modul menjadi satu objek global `SysX`.
// Dia harus dimuat SETELAH semua modul SysX lainnya.

// Deklarasikan objek SysX global sekali saja.
var SysX = {};

// Gunakan Object.assign untuk menggabungkan semua fungsi dari setiap modul
// ke dalam satu objek SysX.
Object.assign(
    SysX,
    SysX_Modules.core,
    SysX_Modules.graphics,
    SysX_Modules.audio,
    SysX_Modules.fx,
    SysX_Modules.input
);
