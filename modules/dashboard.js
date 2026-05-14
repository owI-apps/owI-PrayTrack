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
        statusColor = "text-green-400";
    } else if (totalPoin === 0 && yesterday === 0) {
        statusMsg = "Mulai hari ini dengan istiqomah! 💪";
        statusColor = "text-sky-400";
    } else if (totalPoin > yesterday) {
        statusMsg = "⬆️ Lebih baik dari kemarin!";
        statusColor = "text-sky-400";
    } else if (totalPoin === yesterday) {
        statusMsg = "➡️ Sama dengan kemarin.";
        statusColor = "text-gray-400";
    } else {
        statusMsg = "⬇️ Kurang dari kemarin, ayo kejar!";
        statusColor = "text-orange-400";
    }

    const circumference = 439.8;
    const offset = circumference - (percentage / 100) * circumference;
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const sisaSholat = appState.utangSholat.reduce((sum, u) => sum + (u.total - u.lunas), 0);
    const sisaPuasa = appState.utangPuasa.reduce((sum, u) => sum + (u.total - u.lunas), 0);

    // 20 STOCK MOTIVASI BERDASARKAN HADITS & FIQH
    const saranList = [
        "💡 <strong>Sunnah Qodho Subuh:</strong> Dianjurkan qodho Subuh dikerjakan sebelum sholat Subuh berjamaah, agar 'hutang' lunas sebelum 'tagihan' baru jatuh tempo.",
        "💡 <strong>Utamakan Wajib:</strong> Jika punya qodho, jangan tinggalkan sholat wajib saat ini. Sholat wajib tetap wajib dikerjakan tepat waktu.",
        "💡 <strong>Ganti Sunnah dengan Qodho:</strong> Ulama Syafi'iyyah menyarankan, jika punya utang sholat, gantilah sholat sunnah rawatib (selain Rawatib Subuh & Witir) dengan qodho. Hutang lebih prioritas!",
        "💡 <strong>Sedikit tapi Istiqomah:</strong> 'Amal yang paling dicintai Allah adalah yang paling kecil tapi dilakukan terus-menerus.' (HR. Bukhari). Qodho 1 waktu sehari lebih utama daripada banyak tapi cuma sehari.",
        "💡 <strong>Perbanyak Istighfar:</strong> Utang ibadah terjadi karena lupa atau malas. Perbanyak istighfar dan niat kuat, Allah akan permudah jalan pelunasannya.",
        "🌙 <strong>Hutang Puasa:</strong> Puasa mengganti (qodho) Ramadhan tidak harus berurutan, tapi sebaiknya dijadwal agar tidak tertunda-tunda hingga Ramadhan berikutnya.",
        "🕌 <strong>Keutamaan Qiyamul Lail:</strong> 'Barangsiapa mendirikan sholat malam di bulan Ramadhan dengan penuh keimanan, dosa-dosanya yang lalu akan diampuni.' (HR. Bukhari)",
        "💰 <strong>Sedekah Penolak Bala:</strong> 'Bersegeralah bersedekah, karena bala bencana tidak bisa mendahului sedekah.' (HR. Baihaqi). Amal jariyah adalah benteng kita.",
        "⚠️ <strong>Utang Ibadah Paling Berat:</strong> Hutang kepada manusia bisa dibayar harta, hutang kepada Allah hanya bisa dibayar dengan ibadah itu sendiri. Jangan ditunda!",
        "🤲 <strong>Sholat Penawar:</strong> 'Jadikanlah sholat sebagai penawar hatimu.' Setiap lelah dunia, kembalilah kepada sujud.",
        "👨‍👩‍👧 <strong>Hutang Sholat Orang Tua:</strong> Jika seseorang meninggal dengan utang sholat, keluarganya tidak wajib membayarnya, tapi sangat dianjurkan sebagai bentuk kecintaan.",
        "🔄 <strong>Amalan Paling Utama:</strong> 'Sebaik-baik amalan di sisi Allah adalah yang paling rutin, meskipun sedikit.' (HR. Bukhari & Muslim) - Qodho 1 waktu sehari lebih utama!",
        "📅 <strong>Puasa Senin-Kamis:</strong> Sambil menunda qodho puasa wajib, puasa sunnah Senin-Kamis bisa menjadi pemanis dan penguat niat ibadah.",
        "🏗️ <strong>Sedekah Jariyah:</strong> 'Jika anak Adam meninggal, terputuslah amalnya kecuali tiga: sedekah jariyah, ilmu yang bermanfaat, dan anak saleh yang mendoakannya.' (HR. Muslim)",
        "⏳ <strong>Jangan Tunda Taubat:</strong> 'Sesungguhnya Allah menerima taubat hamba-Nya selama ruh belum sampai di tenggorokan.' (HR. Tirmidzi) - Segera lunasi utang!",
        "📖 <strong>Membaca Al-Quran:</strong> 'Bacalah Al-Quran, sesungguhnya ia akan datang pada hari kiamat sebagai pemberi syafa'at bagi pembacanya.' (HR. Muslim)",
        "🧎 <strong>Waktu Mustajab:</strong> Waktu yang mustajab untuk berdoa adalah saat sujud dan setelah sholat fardhu. Manfaatkan untuk mohon kemudahan melunasi utang.",
        "⚖️ <strong>Hutang dan Kematian:</strong> 'Barangsiapa mati dalam keadaan masih memiliki puasa Ramadhan, maka walinya boleh berpuasa menggantikannya.' (HR. Bukhari)",
        "💧 <strong>Keutamaan Wudhu:</strong> 'Tidaklah seorang muslim berwudhu lalu memperbagus wudhunya, kemudian mendirikan sholat, melainkan diampuni dosa-dosanya.' (HR. Muslim)",
        "🛌 <strong>Istirahat yang Barokah:</strong> Tidur setelah Tahajud atau setelah Subuh sambil niat istirahat untuk beribadah kembali, lebih barokah daripada tidur tanpa qodho."
    ];
    const randomSaran = saranList[Math.floor(Math.random() * saranList.length)];

    main.innerHTML = `
        <div class="mb-5">
            <p class="text-xs text-gray-500 mb-1 uppercase tracking-widest font-bold">📅 ${today}</p>
            <h2 class="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">Assalamu'alaikum, <span class="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">${appState.userName}!</span></h2>
        </div>

        <div class="flex flex-col items-center mt-2 mb-8">
            <div class="relative">
                <svg class="w-44 h-44" viewBox="0 0 160 160">
                    <circle class="text-gray-200 dark:text-gray-700" stroke-width="12" fill="transparent" r="70" cx="80" cy="80" stroke="currentColor"/>
                    <circle class="text-sky-500 progress-ring__circle" stroke-width="12" fill="transparent" r="70" cx="80" cy="80" 
                        stroke-linecap="round" stroke="currentColor" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-4xl font-extrabold text-gray-800 dark:text-white">${Math.round(percentage)}%</span>
                    <span class="text-xs text-gray-500 font-semibold">${totalPoin}/100 Poin</span>
                </div>
            </div>
            <p class="mt-4 font-bold text-center text-sm tracking-wide ${statusColor}">${statusMsg}</p>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-5">
            <button onclick="window.navigateTo('sholat')" class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 border-sky-500 text-left active:scale-95 transition-transform">
                <p class="text-xs text-gray-500 font-semibold">Wajib (50)</p>
                <p class="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">${appState.points.wajib} <span class="text-sm font-normal">Poin</span></p>
            </button>
            <button onclick="window.navigateTo('sholat')" class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 border-green-500 text-left active:scale-95 transition-transform">
                <p class="text-xs text-gray-500 font-semibold">Sunnah (27)</p>
                <p class="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">${appState.points.sunnah} <span class="text-sm font-normal">Poin</span></p>
            </button>
            <button onclick="window.navigateTo('quran')" class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 border-emerald-500 text-left active:scale-95 transition-transform">
                <p class="text-xs text-gray-500 font-semibold">Quran (13)</p>
                <p class="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">${appState.points.quran} <span class="text-sm font-normal">Poin</span></p>
            </button>
            <button onclick="window.navigateTo('amalJariyah')" class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 border-purple-500 text-left active:scale-95 transition-transform">
                <p class="text-xs text-gray-500 font-semibold">Infaq (10)</p>
                <p class="text-2xl font-extrabold text-gray-800 dark:text-white mt-1">${appState.points.infaq} <span class="text-sm font-normal">Poin</span></p>
            </button>
        </div>

        ${(sisaSholat > 0 || sisaPuasa > 0) ? `
        <button onclick="window.navigateTo('utang')" class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl shadow-lg mb-6 text-left active:scale-[0.98] transition-transform border border-orange-400">
            <div class="flex justify-between items-center mb-2">
                <h3 class="font-extrabold text-sm flex items-center gap-2 uppercase tracking-wider"><i data-lucide="alert-circle" class="w-4 h-4"></i> Sisa Utang Ibadah</h3>
                <i data-lucide="chevron-right" class="w-5 h-5 opacity-70"></i>
            </div>
            <div class="flex gap-4 text-sm font-semibold">
                ${sisaSholat > 0 ? `<span>🕌 Qodho Sholat: <strong>${sisaSholat} waktu</strong></span>` : ''}
                ${sisaPuasa > 0 ? `<span>🌙 Qodho Puasa: <strong>${sisaPuasa} hari</strong></span>` : ''}
            </div>
            <p class="text-xs opacity-80 mt-2 font-medium">Klik untuk melunasi!</p>
        </button>
        ` : `
        <div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-4 rounded-xl mb-6 text-center">
            <p class="text-green-700 dark:text-green-400 font-bold text-sm uppercase tracking-wider">✅ Alhamdulillah, tidak ada catatan utang ibadah saat ini.</p>
        </div>
        `}

        <!-- KARTU MOTIVASI PREMIUM (Glassmorphism + Gold Border) -->
        <div class="motivation-card rounded-2xl p-5 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <h3 class="font-extrabold text-sm text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
                <i data-lucide="sparkles" class="w-4 h-4 text-yellow-600 dark:text-yellow-400"></i> Saran & Motivasi
            </h3>
            <p class="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">${randomSaran}</p>
        </div>
    `;
}