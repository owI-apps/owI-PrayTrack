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
    applyTheme(); // PASTIKAN TEMA DIPASANG SAAT LOAD
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

// --- SISTEM TEMA ANTI ERROR ---
function applyTheme() {
    if (appState.darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateSidebarUI();
}

window.editProfile = function() {
    const newName = prompt('Masukkan panggilan kamu:', appState.userName);
    if (newName && newName.trim() !== '') {
        appState.userName = newName.trim();
        saveState();
        renderDashboard();
    }
}

window.toggleTheme = function() {
    appState.darkMode = !appState.darkMode;
    saveState();
    applyTheme(); // PANGGIL LAGI SAAT DI KLIK
    renderDashboard(); // RE-RENDER DASHBOARD BIAR ICON TEKS UPDATE
}

function updateSidebarUI() {
    const themeBtn = document.getElementById('sidebar-theme-btn');
    const langBtn = document.getElementById('sidebar-lang-btn');
    if(themeBtn) themeBtn.textContent = appState.darkMode ? 'Tema Terang' : 'Tema Gelap';
    if(langBtn) langBtn.textContent = appState.lang === 'id' ? 'Bahasa: Indonesia' : 'Language: English';
}

window.toggleLang = function() {
    appState.lang = appState.lang === 'id' ? 'en' : 'id';
    saveState();
    updateSidebarUI();
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
        overlay.classList.add('opacity-100', 'pointer-events-auto');
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-100', 'pointer-events-auto');
    }
}

window.navigateTo = function(page) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-blue-600', 'dark:text-blue-400');
        btn.classList.add('text-slate-400', 'dark:text-slate-500');
        if(btn.dataset.tab === page) {
            btn.classList.remove('text-slate-400', 'dark:text-slate-500');
            btn.classList.add('text-blue-600', 'dark:text-blue-400');
        }
    });

    const main = document.getElementById('main-content');
    main.scrollTop = 0;
    
    import(`./modules/${page}.js`)
        .then(module => {
            if (module.default) module.default();
            lucide.createIcons();
        })
        .catch(err => {
            main.innerHTML = `<div class="p-6 text-center text-red-500"><h2 class="font-bold">Error</h2><p class="text-xs mt-2">File modules/${page}.js tidak ditemukan.</p></div>`;
        });
}

// INISIALISASI PERTAMA KALI
lucide.createIcons();
loadState();
renderDashboard();