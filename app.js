import { renderDashboard } from './modules/dashboard.js';

const todayStr = new Date().toISOString().slice(0, 10);

export let appState = {
    todayDate: todayStr,
    points: { wajib: 0, sunnah: 0, quran: 0, infaq: 0 },
    yesterdayPoints: 0,
    userName: 'Sobat',
    darkMode: false,
    lang: 'id',
    utangSholat: [],
    utangPuasa: []
};

// ==========================================
// SISTEM SAVE & LOAD DATA
// ==========================================
function loadState() {
    const saved = localStorage.getItem('owi_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.todayDate === todayStr) {
            appState = parsed;
        } else {
            const totalYesterday = parsed.points.wajib + parsed.points.sunnah + parsed.points.quran + parsed.points.infaq;
            appState.yesterdayPoints = totalYesterday;
            appState.userName = parsed.userName || 'Sobat';
            appState.darkMode = parsed.darkMode || false;
            appState.lang = parsed.lang || 'id';
            appState.utangSholat = parsed.utangSholat || [];
            appState.utangPuasa = parsed.utangPuasa || [];
            saveState();
        }
    }
    applyTheme();
}

export function saveState() {
    localStorage.setItem('owi_state', JSON.stringify(appState));
}

// ==========================================
// SISTEM POIN
// ==========================================
export function addPoint(type, amount) {
    appState.points[type] += amount;
    saveState();
}

export function subtractPoint(type, amount) {
    if (appState.points[type] > 0) {
        appState.points[type] -= amount;
    }
    saveState();
}

// ==========================================
// SISTEM TEMA (WIN 98 HIGH CONTRAST)
// ==========================================
function applyTheme() {
    if (appState.darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateUI();
}

function updateUI() {
    const themeBtn = document.getElementById('sidebar-theme-btn');
    const profileBtn = document.getElementById('sidebar-profile-btn');
    
    if (themeBtn) {
        themeBtn.textContent = appState.darkMode ? '☀️ Tema Terang' : '🌙 Tema Gelap';
    }
    if (profileBtn) {
        profileBtn.textContent = `👤 ${appState.userName}`;
    }
}

window.toggleTheme = function() {
    appState.darkMode = !appState.darkMode;
    saveState();
    applyTheme();
    // Re-render dashboard biar teks retro dan progress bar ikut ganti warna
    window.navigateTo('dashboard'); 
}

// ==========================================
// SISTEM SIDEBAR
// ==========================================
window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
}

// ==========================================
// SISTEM NAVIGASI (BOTTOM BAR) - FIX ONCLICK
// ==========================================
window.navigateTo = function(page) {
    // Update warna tombol navbar pake class CSS
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.tab === page) {
            btn.classList.add('nav-active'); // Kasih efek ditekan
        } else {
            btn.classList.remove('nav-active'); // Balikin ke biasa
        }
    });

    const main = document.getElementById('main-content');
    main.scrollTop = 0;
    
    // Load modul halaman
    import(`./modules/${page}.js`)
        .then(module => {
            if (module.default) {
                module.default();
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        })
        .catch(err => {
            main.innerHTML = `
                <div class="win98-window mb-4">
                    <div class="win98-titlebar" style="background: #800000;"><span>⚠️ System_Error</span></div>
                    <div class="p-4">
                        <p>Halaman <b>${page}</b> tidak ditemukan.</p>
                        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Pastikan file modules/${page}.js ada di repo lu.</p>
                    </div>
                </div>
            `;
        });
}

// ==========================================
// FUNGSI LAINNYA
// ==========================================
window.editProfile = function() {
    const newName = prompt('Masukkan panggilan kamu:', appState.userName);
    if (newName && newName.trim() !== '') {
        appState.userName = newName.trim();
        saveState();
        updateUI();
        window.navigateTo('dashboard'); 
    }
}

window.toggleLang = function() {
    appState.lang = appState.lang === 'id' ? 'en' : 'id';
    saveState();
    updateUI();
}

window.resetData = function() {
    if (confirm('⚠️ Yakin mau reset SEMUA data poin dan utang?')) {
        localStorage.removeItem('owi_state');
        location.reload();
    }
}

// ==========================================
// INISIALISASI PERTAMA KALI
// ==========================================
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
loadState();

// PENTING: Pakai navigateTo saat pertama kali load biar tombol Home langsung aktif
window.navigateTo('dashboard');
