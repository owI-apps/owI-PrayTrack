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
    sholatLog: {} // TAMBAHAN: Nyimpen data harian { "2023-10-25": { wajib: {...}, sunnah: [...] } }
};

function loadState() {
    const saved = localStorage.getItem('owi_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.todayDate === todayStr) {
            appState = parsed;
        } else {
            const totalYesterday = parsed.points.wajib + parsed.sunnah + parsed.quran + parsed.infaq;
            appState.yesterdayPoints = totalYesterday;
            appState.userName = parsed.userName || 'Sobat';
            appState.darkMode = parsed.darkMode || false;
            appState.lang = parsed.lang || 'id';
            appState.utangSholat = parsed.utangSholat || [];
            appState.utangPuasa = parsed.utangPuasa || [];
            appState.quranLastRead = parsed.quranLastRead || { surahName: '', ayah: 0 };
            appState.sholatLog = parsed.sholatLog || {};
            appState.points = { wajib: 0, sunnah: 0, quran: 0, infaq: 0 };
            saveState();
        }
    }
    applyTheme();
}

export function saveState() { localStorage.setItem('owi_state', JSON.stringify(appState)); }
export function addPoint(type, amount) { appState.points[type] += amount; saveState(); }
export function subtractPoint(type, amount) { if (appState.points[type] > 0) appState.points[type] -= amount; saveState(); }

function applyTheme() {
    if (appState.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    updateUI();
}
function updateUI() {
    const t = document.getElementById('sidebar-theme-btn'), p = document.getElementById('sidebar-profile-btn');
    if(t) t.textContent = appState.darkMode ? '☀️ Tema Terang' : '🌙 Tema Gelap';
    if(p) p.textContent = `👤 ${appState.userName}`;
}
window.toggleTheme = function() { appState.darkMode = !appState.darkMode; saveState(); applyTheme(); renderDashboard(); }
window.toggleSidebar = function() {
    const s = document.getElementById('sidebar'), o = document.getElementById('sidebar-overlay');
    s.classList.toggle('-translate-x-full'); o.classList.toggle('hidden');
}
window.navigateTo = function(page) {
    document.querySelectorAll('.nav-btn').forEach(b => { b.classList.toggle('nav-active', b.dataset.tab === page); });
    document.getElementById('main-content').scrollTop = 0;
    import(`./modules/${page}.js`).then(m => { if(m.default) m.default(); }).catch(e => console.error("Nav Error:", e));
}
window.editProfile = function() { const n=prompt('Nama:', appState.userName); if(n&&n.trim()){appState.userName=n.trim();saveState();updateUI();renderDashboard();} }
window.resetData = function() { if(confirm('⚠️ Yakin reset SEMUA data poin dan utang?')){localStorage.removeItem('owi_state');location.reload();} }

loadState();
try { renderDashboard(); document.querySelector('.nav-btn[data-tab="dashboard"]')?.classList.add('nav-active'); } catch(e) {}
