import { appState } from '../app.js';

export function renderDashboard() {
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
    const sisaSholat = appState.utangSholat.reduce((s, u) => s + (u.total - u.lunas), 0);
    const sisaPuasa = appState.utangPuasa.reduce((s, u) => s + (u.total - u.lunas), 0);

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

    // Progress Bar Block Retro
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
                <p class="font-bold text-blue-800" style="font-size: 20px;">${statusMsg}</p>
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

        <!-- WINDOW UTANG -->
        ${(sisaSholat > 0 || sisaPuasa > 0) ? `
        <button onclick="window.navigateTo('utang')" class="win98-window w-full text-left mb-4 block">
            <div class="win98-titlebar" style="background: #800000;">
                <span>⚠️ Warning_Utang.sys</span>
            </div>
            <div class="p-4">
                <p class="font-bold">Sisa Utang Ibadah:</p>
                ${sisaSholat > 0 ? `<p>🕌 Sholat: ${sisaSholat} waktu</p>` : ''}
                ${sisaPuasa > 0 ? `<p>🌙 Puasa: ${sisaPuasa} hari</p>` : ''}
                <p class="mt-2 text-red-800 font-bold">>> KLIK DISINI UNTUK MELUNASI <<</p>
            </div>
        </button>
        ` : `
        <div class="win98-window mb-4">
            <div class="win98-titlebar" style="background: #008000;">
                <span>✅ Status_Aman.doc</span>
            </div>
            <div class="p-4">
                <p>Alhamdulillah, tidak ada catatan utang ibadah.</p>
            </div>
        </div>
        `}

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
