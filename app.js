import { renderDashboard } from './modules/dashboard.js';

// Inisialisasi Ikon
lucide.createIcons();

// Render halaman pertama
renderDashboard();

// Logika Buka/Tutup Sidebar
window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-50', 'pointer-events-auto');
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-50', 'pointer-events-auto');
    }
}

// Logika Navigasi ke Sub-Halaman
window.navigateTo = function(page) {
    const main = document.getElementById('main-content');
    main.scrollTop = 0; // Reset scroll ke atas
    import(`./modules/${page}.js`).then(module => {
        module.default();
        lucide.createIcons(); // Re-init ikon di halaman baru
    });
}

// Logika kembali ke Dashboard
window.goHome = function() {
    renderDashboard();
    lucide.createIcons();
}

// Fungsi Theme (Sementara alert)
window.toggleTheme = function() {
    alert('Fitur Tema Gelap sedang dalam pengembangan!');
}

// Fungsi Reset (Sementara alert)
window.resetData = function() {
    if(confirm('Yakin mau reset semua data?')) {
        alert('Data di-reset (simulasi)');
    }
}