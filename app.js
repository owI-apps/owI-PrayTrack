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
    if (appState.points[type] > 0) {
        appState.points[type] -= amount;
    }
    saveState();
}

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
    if (themeBtn) themeBtn.textContent = appState.darkMode ? '☀️ Tema Terang' : '🌙 Tema Gelap';
    if (profileBtn) profileBtn.textContent = `👤 ${appState.userName}`;
}

window.toggleTheme = function() {
    appState.darkMode = !appState.darkMode;
    saveState();
    applyTheme();
    renderDashboard(); 
}

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

window.navigateTo = function(page) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.tab === page) {
            btn.classList.add('nav-active');
        } else {
            btn.classList.remove('nav-active');
        }
    });

    const main = document.getElementById('main-content');
    main.scrollTop = 0;
    
    // BAGIAN INI YANG NGELOAD HALAMAN
    import(`./modules/${page}.js`)
        .then(module => {
            if (module.default) {
                module.default();
            }
        })
        .catch(err => {
            // KALO FOLDER MODULES SALAH, INI YANG MUNCUL
            main.innerHTML = `
                <div class="win98-window m-4">
                    <div class="win98-titlebar" style="background: #800000;"><span>⚠️ 404_Error</span></div>
                    <div class="p-4">
                        <p>File <b>modules/${page}.js</b> tidak ditemukan!</p>
                        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Pastikan lu udah bikin folder modules dan masukin file js-nya di dalemnya, bukan di luar.</p>
                    </div>
                </div>
            `;
            console.error("Gagal load modul:", err);
        });
}

window.editProfile = function() {
    const newName = prompt('Masukkan panggilan kamu:', appState.userName);
    if (newName && newName.trim() !== '') {
        appState.userName = newName.trim();
        saveState();
        updateUI();
        renderDashboard(); 
    }
}

window.resetData = function() {
    if (confirm('⚠️ Yakin mau reset SEMUA data poin dan utang?')) {
        localStorage.removeItem('owi_state');
        location.reload();
    }
}

// INISIALISASI
loadState();
try {
    renderDashboard(); 
    const homeBtn = document.querySelector('.nav-btn[data-tab="dashboard"]');
    if(homeBtn) homeBtn.classList.add('nav-active');
} catch (e) {
    console.error("Gagal render awal:", e);
}
