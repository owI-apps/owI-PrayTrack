import { appState } from '../app.js';

function renderDashboard() {
    const main = document.getElementById('main-content');
    const tp = appState.points.wajib + appState.points.sunnah + appState.points.quran + appState.points.infaq;
    const pct = Math.min((tp / 100) * 100, 100);
    const yesterday = appState.yesterdayPoints;

    let statusMsg = "";
    if (pct === 100) statusMsg = "PERFECT! Kamu luar biasa! 🔥";
    else if (tp === 0 && yesterday === 0) statusMsg = "Mulai istiqomah! 💪";
    else if (tp > yesterday) statusMsg = "Lebih baik dari kemarin! ⬆️";
    else if (tp === yesterday) statusMsg = "Sama dengan kemarin. ➡️";
    else statusMsg = "Kurang dari kemarin! ⬇️";

    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    // Hitung Utang
    const sisaSholat = appState.utangSholat.reduce((s, u) => s + (u.total - u.lunas), 0);
    const sisaPuasa = appState.utangPuasa.reduce((s, u) => s + (u.total - u.lunas), 0);
    const adaUtang = sisaSholat > 0 || sisaPuasa > 0;

    const saranList = [
        "💡 Qodho Subuh dikerjakan sebelum Subuh berjamaah.",
        "💡 Utamakan Wajib dari pada Sunnah jika punya utang.",
        "💡 Ganti Sunnah rawatib (kecuali Subuh) dengan qodho.",
        "💡 Amal paling dicintai Allah yang rutin (HR. Bukhari).",
        "🌙 Hutang Puasa tidak harus berurutan.",
        "💰 Sedekah penolak bala (HR. Baihaqi).",
        "📖 Al-Quran pemberi syafaat di hari kiamat."
    ];
    const randomSaran = saranList[Math.floor(Math.random() * saranList.length)];

    const filledBlocks = Math.round(pct / 10);
    const emptyBlocks = 10 - filledBlocks;
    const progressBar = `[${'█'.repeat(filledBlocks)}${'░'.repeat(emptyBlocks)}] ${Math.round(pct)}%`;

    main.innerHTML = `
        <div class="mb-4 p-2 bg-black text-green-400 border-2 border-gray-700 shadow-none" style="font-size: 20px;">
            <p>C:\\Users\\${appState.userName}\\Agenda</p>
            <p class="mt-1">Tanggal: ${today}</p>
        </div>

        <!-- WINDOW POIN -->
        <div class="win98-window mb-4">
            <div class="win98-titlebar">
                <span>System_Status.exe</span>
                <button class="win98-btn" style="padding: 0 4px; font-size: 12px; background: #C0C0C0; color: #000;">X</button>
            </div>
            <div class="p-4">
                <p class="mb-2">Progress Hari Ini:</p>
                <pre style="font-size: 20px; letter-spacing: 2px; margin-bottom: 8px;">${progressBar}</pre>
                <p class="font-bold text-blue-800 dark:text-cyan-400" style="font-size: 20px;">${statusMsg}</p>
            </div>
        </div>

        <!-- WINDOW STATISTIK -->
        <div class="win98-window mb-4">
            <div class="win98-titlebar">
                <span>Point_System.ini</span>
                <button class="win98-btn" style="padding: 0 4px; font-size: 12px; background: #C0C0C0; color: #000;">X</button>
            </div>
            <div class="p-4 grid grid-cols-2 gap-2">
                <button onclick="window.navigateTo('sholat')" class="win98-btn text-left p-2">
                    <span class="block text-gray-600">Wajib</span>
                    <span class="block text-2xl">${appState.points.wajib} / 50</span>
                </button>
                <button onclick="window.navigateTo('sholat')" class="win98-btn text-left p-2">
                    <span class="block text-gray-600">Sunnah</span>
                    <span class="block text-2xl">${appState.points.sunnah} / 27</span>
                </button>
                <button onclick="window.navigateTo('quran')" class="win98-btn text-left p-2">
                    <span class="block text-gray-600">Quran</span>
                    <span class="block text-2xl">${appState.points.quran} / 13</span>
                </button>
                <button onclick="window.navigateTo('amalJariyah')" class="win98-btn text-left p-2">
                    <span class="block text-gray-600">Infaq</span>
                    <span class="block text-2xl">${appState.points.infaq} / 10</span>
                </button>
            </div>
        </div>

        <!-- WINDOW UTANG (POLESAN BARU) -->
        <button onclick="window.navigateTo('utang')" class="win98-window w-full text-left mb-4 block">
            <div class="win98-titlebar" style="background: ${adaUtang ? '#800000' : '#008000'};">
                <span>${adaUtang ? '⚠️ Warning_Utang.sys' : '✅ Status_Aman.doc'}</span>
            </div>
            <div class="p-4">
                ${adaUtang ? `
                    <p class="font-bold mb-2">Sisa Utang Ibadah:</p>
                    
                    ${sisaSholat > 0 ? `
                    <div class="mb-2">
                        <div class="flex justify-between text-sm mb-1">
                            <span>🕌 Sholat</span>
                            <span class="font-bold">${sisaSholat} waktu</span>
                        </div>
                        <div class="w-full bg-gray-300 dark:bg-gray-800 h-2 border border-gray-400">
                            <div class="bg-blue-800 dark:bg-blue-400 h-full" style="width: 0%"></div> <!-- Progress dihitung per item di halaman utang -->
                        </div>
                    </div>` : ''}
                    
                    ${sisaPuasa > 0 ? `
                    <div class="mb-2">
                        <div class="flex justify-between text-sm mb-1">
                            <span>🌙 Puasa</span>
                            <span class="font-bold">${sisaPuasa} hari</span>
                        </div>
                        <div class="w-full bg-gray-300 dark:bg-gray-800 h-2 border border-gray-400">
                            <div class="bg-amber-700 dark:bg-amber-500 h-full" style="width: 0%"></div>
                        </div>
                    </div>` : ''}

                    <p class="mt-3 text-red-800 dark:text-red-400 font-bold text-sm">>> KLIK DISINI UNTUK MELUNASI <<</p>
                ` : `
                    <p>Alhamdulillah, tidak ada catatan utang ibadah.</p>
                `}
            </div>
        </button>

        <!-- WINDOW MOTIVASI -->
        <div class="win98-window mb-4">
            <div class="win98-titlebar">
                <span>💡 Tip_Of_The_Day.txt</span>
                <button class="win98-btn" style="padding: 0 4px; font-size: 12px; background: #C0C0C0; color: #000;">X</button>
            </div>
            <div class="p-4">
                <p>${randomSaran}</p>
            </div>
        </div>
    `;
}

export default renderDashboard;
export { renderDashboard };
