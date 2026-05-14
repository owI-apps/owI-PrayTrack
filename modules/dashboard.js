import { appState } from '../app.js';

export function renderDashboard() {
    const main = document.getElementById('main-content');
    const isDark = appState.darkMode;
    
    const totalPoin = appState.points.wajib + appState.points.sunnah + appState.points.quran + appState.points.infaq;
    const percentage = Math.min((totalPoin / 100) * 100, 100);
    const yesterday = appState.yesterdayPoints;

    let statusMsg = "";
    let statusColor = "text-white/80"; 
    if (percentage === 100) { statusMsg = "🔥 PERFECT! Luar biasa!"; statusColor = "text-amber-300"; }
    else if (totalPoin === 0 && yesterday === 0) { statusMsg = "Mulai hari ini dengan istiqomah! 💪"; statusColor = "text-sky-200"; }
    else if (totalPoin > yesterday) { statusMsg = "⬆️ Lebih baik dari kemarin!"; statusColor = "text-sky-200"; }
    else if (totalPoin === yesterday) { statusMsg = "➡️ Sama dengan kemarin."; statusColor = "text-white/60"; }
    else { statusMsg = "⬇️ Kurang dari kemarin, ayo kejar!"; statusColor = "text-orange-300"; }

    const circumference = 439.8;
    const offset = circumference - (percentage / 100) * circumference;
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const sisaSholat = appState.utangSholat.reduce((sum, u) => sum + (u.total - u.lunas), 0);
    const sisaPuasa = appState.utangPuasa.reduce((sum, u) => sum + (u.total - u.lunas), 0);

    const saranList = [
        "💡 <strong>Sunnah Qodho Subuh:</strong> Dianjurkan qodho Subuh dikerjakan sebelum sholat Subuh berjamaah, agar 'hutang' lunas sebelum 'tagihan' baru jatuh tempo.",
        "💡 <strong>Utamakan Wajib:</strong> Jika punya qodho, jangan tinggalkan sholat wajib saat ini. Sholat wajib tetap wajib dikerjakan tepat waktu.",
        "💡 <strong>Ganti Sunnah dengan Qodho:</strong> Ulama Syafi'iyyah menyarankan, jika punya utang sholat, gantilah sholat sunnah rawatib (selain Rawatib Subuh & Witir) dengan qodho.",
        "💡 <strong>Sedikit tapi Istiqomah:</strong> 'Amal yang paling dicintai Allah adalah yang paling kecil tapi dilakukan terus-menerus.' (HR. Bukhari).",
        "💡 <strong>Perbanyak Istighfar:</strong> Utang ibadah terjadi karena lupa atau malas. Perbanyak istighfar dan niat kuat, Allah akan permudah jalan pelunasannya.",
        "🌙 <strong>Hutang Puasa:</strong> Puasa mengganti (qodho) Ramadhan tidak harus berurutan, tapi sebaiknya dijadwal agar tidak tertunda hingga Ramadhan berikutnya.",
        "🕌 <strong>Keutamaan Qiyamul Lail:</strong> 'Barangsiapa mendirikan sholat malam di bulan Ramadhan dengan penuh keimanan, dosa-dosanya yang lalu akan diampuni.' (HR. Bukhari)",
        "💰 <strong>Sedekah Penolak Bala:</strong> 'Bersegeralah bersedekah, karena bala bencana tidak bisa mendahului sedekah.' (HR. Baihaqi).",
        "⚠️ <strong>Utang Ibadah Paling Berat:</strong> Hutang kepada manusia bisa dibayar harta, hutang kepada Allah hanya bisa dibayar dengan ibadah itu sendiri. Jangan ditunda!",
        "🤲 <strong>Sholat Penawar:</strong> 'Jadikanlah sholat sebagai penawar hatimu.' Setiap lelah dunia, kembalilah kepada sujud.",
        "👨‍👩‍👧 <strong>Hutang Sholat Orang Tua:</strong> Jika seseorang meninggal dengan utang sholat, keluarganya tidak wajib membayarnya, tapi sangat dianjurkan.",
        "🔄 <strong>Amalan Paling Utama:</strong> 'Sebaik-baik amalan di sisi Allah adalah yang paling rutin, meskipun sedikit.' (HR. Bukhari & Muslim)",
        "📅 <strong>Puasa Senin-Kamis:</strong> Sambil menunda qodho puasa wajib, puasa sunnah Senin-Kamis bisa menjadi pemanis dan penguat niat ibadah.",
        "🏗️ <strong>Sedekah Jariyah:</strong> 'Jika anak Adam meninggal, terputuslah amalnya kecuali tiga: sedekah jariyah, ilmu yang bermanfaat, dan anak saleh yang mendoakannya.' (HR. Muslim)",
        "⏳ <strong>Jangan Tunda Taubat:</strong> 'Sesungguhnya Allah menerima taubat hamba-Nya selama ruh belum sampai di tenggorokan.' (HR. Tirmidzi)",
        "📖 <strong>Membaca Al-Quran:</strong> 'Bacalah Al-Quran, sesungguhnya ia akan datang pada hari kiamat sebagai pemberi syafa'at bagi pembacanya.' (HR. Muslim)",
        "🧎 <strong>Waktu Mustajab:</strong> Waktu yang mustajab untuk berdoa adalah saat sujud dan setelah sholat fardhu.",
        "⚖️ <strong>Hutang dan Kematian:</strong> 'Barangsiapa mati dalam keadaan masih memiliki puasa Ramadhan, maka walinya boleh berpuasa menggantikannya.' (HR. Bukhari)",
        "💧 <strong>Keutamaan Wudhu:</strong> 'Tidaklah seorang muslim berwudhu lalu memperbagus wudhunya, kemudian mendirikan sholat, melainkan diampuni dosa-dosanya.' (HR. Muslim)",
        "🛌 <strong>Istirahat yang Barokah:</strong> Tidur setelah Tahajud atau setelah Subuh sambil niat istirahat untuk beribadah kembali, lebih barokah daripada tidur tanpa qodho."
    ];
    const randomSaran = saranList[Math.floor(Math.random() * saranList.length)];

    main.innerHTML = `
        <div class="mb-6">
            <p class="text-xs text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-widest font-bold">📅 ${today}</p>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-1">Assalamu'alaikum, <span class="text-blue-600 dark:text-blue-400">${appState.userName}!</span></h2>
        </div>

        <!-- HERO CARD (Biru Mutiara) -->
        <div class="bg-gradient-to-br from-blue-700 to-blue-500 dark:from-blue-900 dark:to-blue-800 rounded-3xl p-6 mb-6 shadow-xl dark:border dark:border-blue-700/50 relative z-10 overflow-hidden">
            <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div class="flex flex-col items-center relative z-20">
                <div class="relative">
                    <svg class="w-36 h-36" viewBox="0 0 160 160">
                        <circle class="text-white/10" stroke-width="12" fill="transparent" r="70" cx="80" cy="80" stroke="currentColor"/>
                        <circle class="text-amber-400 dark:text-blue-300 progress-ring__circle" stroke-width="12" fill="transparent" r="70" cx="80" cy="80" 
                            stroke-linecap="round" stroke="currentColor" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span class="text-4xl font-black text-white drop-shadow-md">${Math.round(percentage)}%</span>
                        <span class="text-xs text-white/70 font-bold">${totalPoin}/100 Poin</span>
                    </div>
                </div>
                <p class="mt-4 font-bold text-center text-sm tracking-wide ${statusColor} drop-shadow-sm">${statusMsg}</p>
            </div>
        </div>

        <!-- GRID POIN (Kartu Putih / Gelap Mengapung) -->
        <div class="grid grid-cols-2 gap-4 mb-5">
            <button onclick="window.navigateTo('sholat')" class="bg-white dark:bg-[#0F172A] p-4 rounded-2xl shadow-sm dark:shadow-none dark:border dark:border-slate-800 text-left active:scale-[0.98] transition-transform">
                <div class="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3">
                    <i data-lucide="check-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Wajib</p>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-0.5">${appState.points.wajib} <span class="text-xs font-semibold text-slate-400 dark:text-slate-500">/50</span></p>
            </button>
            <button onclick="window.navigateTo('sholat')" class="bg-white dark:bg-[#0F172A] p-4 rounded-2xl shadow-sm dark:shadow-none dark:border dark:border-slate-800 text-left active:scale-[0.98] transition-transform">
                <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-3">
                    <i data-lucide="sun" class="w-5 h-5 text-emerald-600 dark:text-emerald-400"></i>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Sunnah</p>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-0.5">${appState.points.sunnah} <span class="text-xs font-semibold text-slate-400 dark:text-slate-500">/27</span></p>
            </button>
            <button onclick="window.navigateTo('quran')" class="bg-white dark:bg-[#0F172A] p-4 rounded-2xl shadow-sm dark:shadow-none dark:border dark:border-slate-800 text-left active:scale-[0.98] transition-transform">
                <div class="w-10 h-10 bg-sky-50 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-3">
                    <i data-lucide="book-open" class="w-5 h-5 text-sky-600 dark:text-sky-400"></i>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Quran</p>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-0.5">${appState.points.quran} <span class="text-xs font-semibold text-slate-400 dark:text-slate-500">/13</span></p>
            </button>
            <button onclick="window.navigateTo('amalJariyah')" class="bg-white dark:bg-[#0F172A] p-4 rounded-2xl shadow-sm dark:shadow-none dark:border dark:border-slate-800 text-left active:scale-[0.98] transition-transform">
                <div class="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3">
                    <i data-lucide="heart-handshake" class="w-5 h-5 text-purple-600 dark:text-purple-400"></i>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Infaq</p>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-0.5">${appState.points.infaq} <span class="text-xs font-semibold text-slate-400 dark:text-slate-500">/10</span></p>
            </button>
        </div>

        <!-- KARTU UTANG -->
        ${(sisaSholat > 0 || sisaPuasa > 0) ? `
        <button onclick="window.navigateTo('utang')" class="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white p-5 rounded-2xl shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10 mb-6 text-left active:scale-[0.98] transition-transform relative overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <div class="flex justify-between items-center mb-3 relative z-10">
                <h3 class="font-extrabold text-sm flex items-center gap-2 uppercase tracking-wider text-white"><i data-lucide="alert-circle" class="w-5 h-5"></i> Sisa Utang Ibadah</h3>
                <i data-lucide="chevron-right" class="w-5 h-5 opacity-70"></i>
            </div>
            <div class="flex gap-4 text-sm font-bold relative z-10">
                ${sisaSholat > 0 ? `<span class="text-white">🕌 Sholat: <strong>${sisaSholat} waktu</strong></span>` : ''}
                ${sisaPuasa > 0 ? `<span class="text-white">🌙 Puasa: <strong>${sisaPuasa} hari</strong></span>` : ''}
            </div>
            <p class="text-xs opacity-80 mt-3 font-semibold relative z-10 text-white">Klik di sini untuk melunasi!</p>
        </button>
        ` : `
        <div class="bg-white dark:bg-[#0F172A] p-4 rounded-2xl shadow-sm dark:shadow-none dark:border dark:border-slate-800 border-l-4 border-green-500 mb-6 text-center">
            <p class="text-green-600 dark:text-green-400 font-bold text-sm">✅ Alhamdulillah, tidak ada catatan utang ibadah.</p>
        </div>
        `}

        <!-- KARTU MOTIVASI (Hijau Matcha) -->
        <div class="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900 p-5 rounded-2xl relative overflow-hidden border-l-4 border-emerald-700 dark:border-emerald-400">
            <div class="absolute top-0 right-0 w-20 h-20 bg-emerald-400/20 dark:bg-emerald-400/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <h3 class="font-extrabold text-sm text-emerald-900 dark:text-emerald-200 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <i data-lucide="sparkles" class="w-4 h-4 text-emerald-700 dark:text-emerald-400"></i> Saran & Motivasi
            </h3>
            <p class="text-sm text-emerald-950 dark:text-emerald-50 leading-relaxed font-medium">${randomSaran}</p>
        </div>
    `;
}