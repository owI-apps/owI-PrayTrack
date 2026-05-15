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
    utangPuasa: [],
    quranLastRead: { surahName: '', ayah: 0 },
    sholatHistory: {} // TAMBAHAN: Nyimpen data sholat per tanggal
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
            // Hari berganti
            appState.yesterdayPoints = calculatePointsForDate(parsed.todayDate, parsed.sholatHistory);
            appState.userName = parsed.userName || 'Sobat';
            appState.darkMode = parsed.darkMode || false;
            appState.lang = parsed.lang || 'id';
            appState.utangSholat = parsed.utangSholat || [];
            appState.utangPuasa = parsed.utangPuasa || [];
            appState.quranLastRead = parsed.quranLastRead || { surahName: '', ayah: 0 };
            appState.sholatHistory = parsed.sholatHistory || {};
            appState.points = { wajib: 0, sunnah: 0, quran: 0, infaq: 0 }; // Reset poin hari ini
            saveState();
        }
    }
    applyTheme();
}

export function saveState() {
    localStorage.setItem('owi_state', JSON.stringify(appState));
}

function calculatePointsForDate(dateStr, history) {
    if (!history || !history[dateStr]) return 0;
    const dayData = history[dateStr];
    let pts = 0;
    if (dayData.wajib) {
        Object.values(dayData.wajib).forEach(status => {
            if (status === 'jamaah' || status === 'sendiri') pts += 10;
        });
    }
    if (dayData.sunnah) pts += (dayData.sunnah.length * 3);
    return pts;
}

// ==========================================
// SISTEM POIN
// ==========================================
export function addPoint(type, amount) { appState.points[type] += amount; saveState(); }
export function subtractPoint(type, amount) { if (appState.points[type] > 0) appState.points[type] -= amount; saveState(); }

// ==========================================
// SISTEM TEMA (WIN 98)
// ==========================================
function applyTheme() {
    if (appState.darkMode) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); }
    updateUI();
}
function updateUI() {
    const themeBtn = document.getElementById('sidebar-theme-btn');
    const profileBtn = document.getElementById('sidebar-profile-btn');
    if (themeBtn) themeBtn.textContent = appState.darkMode ? '☀️ Tema Terang' : '🌙 Tema Gelap';
    if (profileBtn) profileBtn.textContent = `👤 ${appState.userName}`;
}
window.toggleTheme = function() { appState.darkMode = !appState.darkMode; saveState(); applyTheme(); renderDashboard(); }
window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar'), overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('-translate-x-full'); overlay.classList.toggle('hidden');
}
window.navigateTo = function(page) {
    document.querySelectorAll('.nav-btn').forEach(btn => { btn.classList.remove('nav-active'); if(btn.dataset.tab === page) btn.classList.add('nav-active'); });
    const main = document.getElementById('main-content'); main.scrollTop = 0;
    import(`./modules/${page}.js`).then(module => { if (module.default) module.default(); }).catch(err => { console.error(err); });
}
window.editProfile = function() { const n=prompt('Nama:',appState.userName); if(n&&n.trim()){appState.userName=n.trim();saveState();updateUI();renderDashboard();} }
window.resetData = function() { if(confirm('Yakin reset?')){localStorage.removeItem('owi_state');location.reload();} }

loadState();
try { renderDashboard(); const h=document.querySelector('.nav-btn[data-tab="dashboard"]'); if(h)h.classList.add('nav-active'); } catch (e) { console.error(e); }
