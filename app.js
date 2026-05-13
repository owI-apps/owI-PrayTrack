import { renderDashboard, updateDashboardUI } from './modules/dashboard.js';

// STATE APLIKASI GLOBAL
const todayStr = new Date().toISOString().slice(0, 10);

export let appState = {
    todayDate: todayStr,
    points: { wajib: 0, sunnah: 0, quran: 0, infaq: 0 },
    yesterdayPoints: 0
};

// Load state dari Local Storage
function loadState() {
    const saved = localStorage.getItem('owi_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.todayDate === todayStr) {
            appState = parsed;
        } else {
            // Hari berganti, poin hari ini jadi poin kemarin, reset poin hari ini
            const totalYesterday = parsed.points.wajib + parsed.points.sunnah + parsed.points.quran + parsed.points.infaq;
            appState.yesterdayPoints = totalYesterday;
            saveState();
        }
    }
}

export function saveState() {
    localStorage.setItem('owi_state', JSON.stringify(appState));
}

export function addPoint(type, amount) {
    appState.points[type] += amount;
    saveState();
    // Update dashboard kalau lagi dibuka
    updateDashboardUI();
}

export function subtractPoint(type, amount) {
    if (appState.points[type] > 0) appState.points[type] -= amount;
    saveState();
    updateDashboardUI();
}

// Inisialisasi
lucide.createIcons();
loadState();
renderDashboard();

// SIDEBAR LOGIC
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

// NAVIGASI BOTTOM BAR
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
    import(`./modules/${page}.js`).then(module => {
        module.default();
        lucide.createIcons();
    });
}

window.toggleTheme = () => alert('Tema Gelap segera hadir!');
window.resetData = () => { if(confirm('Yakin reset?')) { localStorage.clear(); location.reload(); } }