import { renderDashboard } from './modules/dashboard.js';

const todayStr = new Date().toISOString().slice(0, 10);

// STATE GLOBAL
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

// LOAD DATA DARI LOCAL STORAGE
function loadState() {
    const saved = localStorage.getItem('owi_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.todayDate === todayStr) {
            appState = parsed;
        } else {
            // Hari berganti
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

export function addPoint(type, amount) {
    appState.points[type] += amount;
    saveState();
}

export function subtractPoint(type, amount) {
    if (appState.points[type] > 0) appState.points[type] -= amount;
    saveState();
}

// --- FUNGSI SIDEBAR & SETTINGS ---
window.editProfile = function() {
    const newName = prompt('Masukkan panggilan kamu:', appState.userName);
    if (newName && newName.trim() !== '') {
        appState.userName = newName.trim();
        saveState();
        renderDashboard(); // Langsung refresh dashboard
    }
}

window.toggleTheme = function() {
    appState.darkMode = !appState.darkMode;
    saveState();
    applyTheme();
    renderDashboard();
}

function applyTheme() {
    if (appState.darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

window.toggleLang = function() {
    appState.lang = appState.lang === 'id' ? 'en' : 'id';
    saveState();
}

window.resetData = function() {
    if(confirm('⚠️ Yakin mau reset SEMUA data poin dan utang?')) {
        localStorage.removeItem('owi_state');
        location.reload();
    }
}

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

// --- NAVIGASI BOTTOM BAR (ANTI BLANK) ---
window.navigateTo = function(page) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-sky-600');
        btn.classList.add('text-gray-400');
        if(btn.dataset.tab === page) {
            btn.classList.remove('text-gray-400');
            btn.classList.add('text-sky-600');
        }
    });

    const main = document.getElementById('main-content');
    main.scrollTop = 0;
    
    // Load modul dengan aman
    import(`./modules/${page}.js`)
        .then(module => {
            if (module.default) {
                module.default();
            } else if (page === 'dashboard' && module.renderDashboard) {
                module.renderDashboard();
            }
            lucide.createIcons();
        })
        .catch(err => {
            main.innerHTML = `<div class="p-6 text-center text-red-500"><h2 class="font-bold">Error</h2><p class="text-xs mt-2">File modules/${page}.js tidak ditemukan.</p></div>`;
        });
}

// INISIALISASI PERTAMA KALI
lucide.createIcons();
loadState();
renderDashboard(); // Langsung render dashboard tanpa navigasi dulu