import { appState } from '../app.js';

export function renderDashboard() {
    const main = document.getElementById('main-content');
    
    const totalPoin = appState.points.wajib + appState.points.sunnah + appState.points.quran + appState.points.infaq;
    const percentage = Math.min((totalPoin / 100) * 100, 100);
    const yesterday = appState.yesterdayPoints;

    let statusMsg = "";
    let statusColor = "text-gray-500";
    if (percentage === 100) {
        statusMsg = "🔥 PERFECT! Kamu luar biasa hari ini!";
        statusColor = "text-green-500";
    } else if (totalPoin > yesterday) {
        statusMsg = "⬆️ Lebih baik dari kemarin!";
        statusColor = "text-sky-600";
    } else if (totalPoin === yesterday) {
        statusMsg = "➡️ Sama dengan kemarin.";
        statusColor = "text-gray-500";
    } else if (yesterday === 0 && totalPoin === 0) {
        statusMsg = "Mulai hari ini dengan istiqomah! 💪";
        statusColor = "text-sky-600";
    } else {
        statusMsg = "⬇️ Kurang dari kemarin, ayo kejar!";
        statusColor = "text-orange-500";
    }

    const circumference = 439.8;
    const offset = circumference - (percentage / 100) * circumference;
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Hitung Sisa Utang
    const sisaSholat = appState.utangSholat.reduce((sum, u) => sum + (u.total - u.lunas), 0);
    const sisaPuasa = appState.utangPuasa.reduce((sum, u) => sum + (u.total - u.lunas), 0);

    // Saran Motivasi Fiqh
    const saranList = [
        "💡 <strong>Sunnah Qodho Subuh:</strong> Dianjurkan qodho Subuh dikerjakan sebelum sholat Subuh berjamaah, agar 'hutang' lunas sebelum 'tagihan' baru jatuh tempo.",
        "💡 <strong>Utamakan Wajib:</strong> Jika punya qodho, jangan tinggalkan sholat wajib saat ini. Sholat wajib tetap wajib dikerjakan tepat waktu.",
        "💡 <strong>Ganti Sunnah dengan Qodho:</strong> Ulama Syafi'iyyah menyarankan, jika punya utang sholat, gantilah sholat sunnah rawatib (selain Rawatib Subuh & Witir) dengan qodho. Hutang lebih prioritas!",
        "💡 <strong>Sedikit tapi Istiqomah:</strong> 'Amal yang paling dicintai Allah adalah yang paling kecil tapi dilakukan terus-menerus.' (HR. Bukhari). Qodho 1 waktu sehari lebih utama daripada banyak tapi cuma sehari.",
        "💡 <strong>Perbanyak Istighfar:</strong> Utang ibadah terjadi karena lupa atau malas. Perbanyak istighfar dan niat kuat, Allah akan permudah jalan pelunasannya."
    ];
    const randomSaran = saranList[Math.floor(Math.random() * saranList.length)];

    main.innerHTML = `
        <div class="mb-5">
            <p class="text-sm text-gray-500 mb-1">📅 ${today}</p>
            <h2 class="text-xl font-bold text-gray-800">Assalamu'alaikum, ${appState.userName}!</h2>
        </div>

        <!-- 1. PROGRESS POIN (PALING ATAS) -->
        <div class="flex flex-col items-center mt-2 mb-6">
            <div class="relative">
                <svg class="w-40 h-40" viewBox="0 0 160 160">
                    <circle class="text-gray-200" stroke-width="12" fill="transparent" r="70" cx="80" cy="80" stroke="currentColor"/>
                    <circle class="text-sky-500 progress-ring__circle" stroke-width="12" fill="transparent" r="70" cx="80" cy="80" 
                        stroke-linecap="round" stroke="currentColor" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-3xl font-bold text-gray-800">${Math.round(percentage)}%</span>
                    <span class="text-xs text-gray-500">${totalPoin}/100 Poin</span>
                </div>
            </div>
            <p class="mt-3 font-semibold text-center text-sm ${statusColor}">${statusMsg}</p>
        </div>

        <!-- 2. DETAIL POIN (TOMBOL ONECLICK) -->
        <div class="grid grid-cols-2 gap-3 mb-5">
            <button onclick="window.navigateTo('sholat')" class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-sky-500 text-left active:scale-95 transition-transform">
                <p class="text-xs text-gray-500">Wajib (50)</p>
                <p class="text-xl font-bold text-gray-800">${appState.points.wajib} <span class="text-sm font-normal">Poin</span></p>
            </button>
            <button onclick="window.navigateTo('sholat')" class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 text-left active:scale-95 transition-transform">
                <p class="text-xs text-gray-500">Sunnah (27)</p>
                <p class="text-xl font-bold text-gray-800">${appState.points.sunnah} <span class="text-sm font-normal">Poin</span></p>
            </button>
            <button onclick="window.navigateTo('quran')" class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500 text-left active:scale-95 transition-transform">
                <p class="text-xs text-gray-500">Quran (13)</p>
                <p class="text-xl font-bold text-gray-800">${appState.points.quran} <span class="text-sm font-normal">Poin</span></p>
            </button>
            <button onclick="window.navigateTo('amalJariyah')" class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500 text-left active:scale-95 transition-transform">
                <p class="text-xs text-gray-500">Infaq (10)</p>
                <p class="text-xl font-bold text-gray-800">${appState.points.infaq} <span class="text-sm font-normal">Poin</span></p>
            </button>
        </div>

        <!-- 3. KARTU UTANG (TENGAH) -->
        ${(sisaSholat > 0 || sisaPuasa > 0) ? `
        <button onclick="window.navigateTo('utang')" class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl shadow-lg mb-5 text-left active:scale-[0.98] transition-transform">
            <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold text-sm flex items-center gap-2"><i data-lucide="alert-circle" class="w-4 h-4"></i> Sisa Utang Ibadah</h3>
                <i data-lucide="chevron-right" class="w-5 h-5 opacity-70"></i>
            </div>
            <div class="flex gap-4 text-sm">
                ${sisaSholat > 0 ? `<span>🕌 Qodho Sholat: <strong>${sisaSholat} waktu</strong></span>` : ''}
                ${sisaPuasa > 0 ? `<span>🌙 Qodho Puasa: <strong>${sisaPuasa} hari</strong></span>` : ''}
            </div>
            <p class="text-xs opacity-80 mt-2">Klik untuk melunasi!</p>
        </button>
        ` : `
        <div class="bg-green-50 border border-green-200 p-4 rounded-xl mb-5 text-center">
            <p class="text-green-700 font-semibold text-sm">✅ Alhamdulillah, tidak ada catatan utang ibadah saat ini.</p>
        </div>
        `}

        <!-- 4. SARAN & MOTIVASI (BAWAH) -->
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <h3 class="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2"><i data-lucide="lightbulb" class="w-4 h-4"></i> Saran & Motivasi</h3>
            <p class="text-xs text-amber-900 leading-relaxed">${randomSaran}</p>
        </div>
    `;
}

export function updateDashboardUI() {
    const isDashboardActive = document.querySelector('.nav-btn[data-tab="dashboard"]')?.classList.contains('text-sky-600');
    if (isDashboardActive) {
        renderDashboard();
    }
}