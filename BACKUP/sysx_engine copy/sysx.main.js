// --- /sysx_engine/sysx_main.js ---
// File ini bertugas sebagai "lem", menyatukan semua modul
// menjadi satu objek global `SysX` yang akan digunakan oleh developer.
// File ini harus dimuat setelah semua modul SysX lainnya.

const SysX = {
    // Sebarkan semua fungsi dari setiap modul ke dalam satu objek
    ...SysX_Modules.core,
    ...SysX_Modules.graphics,
    ...SysX_Modules.audio,
    ...SysX_Modules.fx,
    ...SysX_Modules.input
};
