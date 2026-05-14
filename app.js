import { appState, saveState } from './app.js'; // Ini buat export state

// Biar app nggak blank kalau ada file hilang, kita pake dynamic import yang aman
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
    
    import(`./modules/${page}.js`)
        .then(module => {
            // Cek apakah modul punya default export atau named export
            if (module.default) {
                module.default();
            } else if (page === 'dashboard' && module.renderDashboard) {
                module.renderDashboard();
            }
            lucide.createIcons();
        })
        .catch(err => {
            console.error("Gagal memuat halaman:", err);
            main.innerHTML = `
                <div class="p-6 text-center text-red-500">
                    <h2 class="text-xl font-bold mb-2">Error Memuat Halaman</h2>
                    <p class="text-sm">File <strong>modules/${page}.js</strong> tidak ditemukan atau ada error kode.</p>
                    <p class="text-xs mt-4 text-gray-500">Pesan Error: ${err.message}</p>
                </div>
            `;
        });
}

// --- STATE MANAGEMENT ---
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
    // Update dashboard poin instan
    const dashPoints = document.getElementById('dashboard-points');
    if(dashPoints) {
        const total = appState.points.wajib + appState.points.sunnah + appState.points.quran + appState.points.infaq;
        dashPoints.innerText = `${total}/100 Poin`;
    }
}

export function subtractPoint(type, amount) {
    if (appState.points[type] > 0) appState.points[type] -= amount;
    saveState();
    const dashPoints = document.getElementById('dashboard-points');
    if(dashPoints) {
        const total = appState.points.wajib + appState.points.sunnah + appState.points.quran + appState.points.infaq;
        dashPoints.innerText = `${total}/100 Poin`;
    }
}

window.editProfile = function() {
    const newName = prompt('Masukkan panggilan kamu:', appState.userName);
    if (newName && newName.trim() !== '') {
        appState.userName = newName.trim();
        saveState();
        window.navigateTo('dashboard'); // Auto refresh dashboard
    }
}

window.toggleTheme = function() {
    appState.darkMode = !appState.darkMode;
    saveState();
    applyTheme();
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

// INISIALISASI PERTAMA KALI
lucide.createIcons();
loadState();
window.navigateTo('dashboard');