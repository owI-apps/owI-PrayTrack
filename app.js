import { renderDashboard } from './modules/dashboard.js';

// ==========================================
// SISTEM SUARA WIN 98 (AUDIO ENGINE)
// ==========================================
const audioCache = {
    click: new Audio('./assets/sounds/click.mp3'),
    chord: new Audio('./assets/sounds/chord.mp3')
};

// Atur volume biar nggak terlalu nge-shock
Object.values(audioCache).forEach(audio => audio.volume = 0.4); // 0.4 = 40% volume

// Fungsi global buat dipanggil
window.playSound = function(type) {
    if (audioCache[type]) {
        audioCache[type].currentTime = 0; // Rewind biar bisa dipencet cepat berkali-kali
        audioCache[type].play().catch(e => {}); // .catch() biar nggak error kalau browser block autoplay
    }
};

// MAGIC: Event Delegation. Ngecek semua klik di halaman.
// Kalau yang diklik itu tombol (button), mainkan suara click!
document.addEventListener('click', function(e) {
    // Cek apakah yang diklik atau parent-nya adalah tombol Win98
    if (e.target.closest('.win98-btn') || e.target.closest('button')) {
        window.playSound('click');
    }
});

const todayStr = new Date().toISOString().slice(0, 10);

// GANTI LET JADI CONST! Pake Object.assign nanti buat nge-load
export const appState = {
    todayDate: todayStr,
    points: { wajib: 0, sunnah: 0, quran: 0, infaq: 0 },
    yesterdayPoints: 0,
    userName: 'Sobat',
    darkMode: false,
    lang: 'id',
    utangSholat: [],
    utangPuasa: [],
    quranLastRead: { surahName: '', ayah: 0 },
    sholatHistory: {},
    infaqList: [], // TAMBAHAN: Biar data infaq nggak hilang
    dosaList: [],
    quranClaimedToday: false, // TAMBAHAN: Biar poin quran bisa di-claim tiap hari
    infaqClaimedToday: false // TAMBAHAN: Biar poin infaq bisa di-claim tiap hari
};

// ==========================================
// SISTEM SAVE & LOAD DATA
// ==========================================
function loadState() {
    const saved = localStorage.getItem('owi_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.todayDate === todayStr) {
            // FIX KRITIS: Pakai Object.assign biar referensi export-nya nggak putus
            Object.assign(appState, parsed); 
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
            appState.infaqList = parsed.infaqList || [];
            appState.points = { wajib: 0, sunnah: 0, quran: 0, infaq: 0 }; // Reset poin hari ini
            appState.quranClaimedToday = false; // Reset claim poin
            appState.infaqClaimedToday = false; // Reset claim poin
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

// ==========================================
// SISTEM PANDUAN (WIN98 HELP MODAL)
// ==========================================

const guideData = {
    sholat: `
        <h3 class="font-bold text-lg mb-2 border-b-2 border-dotted border-gray-400 pb-1">🤲 Panduan Sholat</h3>
        <p class="mb-3">Fitur ini dirancang untuk membantu Anda mencatat ibadah sholat harian sekaligus memantau keistiqomahan.</p>
        <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><b>Sholat Wajib:</b> Pilih status <i>Berjamaah</i>, <i>Sendiri</i>, atau <i>Tidak Sholat</i>. Berjamaah dan Sendiri akan menambah poin. <b>Tidak Sholat</b> akan otomatis menambah utang di modul Utang.</li>
            <li><b>Sunnah & Dzikir:</b> Centang box jika Anda mengerjakan sunnah rawatib atau dzikir pagi/sore. Setiap centang bernilai +3 poin.</li>
            <li><b>Lihat Tanggal:</b> Anda dapat melihat rekap ibadah di tanggal sebelumnya dengan mengubah tanggal di bagian atas. Namun, poin harian hanya dihitung untuk ibadah di hari ini.</li>
            <li><b>Koreksi Otomatis:</b> Jika Anda salah mencatat "Tidak Sholat" lalu mengubahnya menjadi "Berjamaah", sistem otomatis akan membatalkan utang yang tertulis.</li>
        </ul>
        <p class="text-xs italic text-gray-500 dark:text-gray-400">Tips: Utamakan sholat tepat waktu sebelum mengejar poin sunnah.</p>
    `,
    quran: `
        <h3 class="font-bold text-lg mb-2 border-b-2 border-dotted border-gray-400 pb-1">📖 Panduan Quran</h3>
        <p class="mb-3">Jangan biarkan Al-Quran hanya menjadi penghias rumah. Catat progres bacaan Anda agar istiqomah.</p>
        <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><b>Kartu Tadarus:</b> Menampilkan posisi terakhir Anda membaca Al-Quran. Akan berwarna hijau jika ada data tersimpan.</li>
            <li><b>Update Posisi:</b> Pilih nama surat dan masukkan nomor ayat terakhir yang Anda baca, lalu klik "Simpan Posisi".</li>
            <li><b>Sistem Poin:</b> Anda mendapatkan +13 poin setiap kali memperbarui posisi bacaan. Poin ini hanya bisa diklaim sekali per hari untuk mendorong Anda membaca setiap hari, meskipun hanya satu ayat.</li>
            <li><b>Validasi Ayat:</b> Sistem secara otomatis membatasi input sesuai dengan jumlah ayat di setiap surat.</li>
        </ul>
        <p class="text-xs italic text-gray-500 dark:text-gray-400">"Bacalah Al-Quran, karena ia akan datang pada hari kiamat sebagai pemberi syafaat bagi pembacanya." (HR. Muslim)</p>
    `,
    utang: `
        <h3 class="font-bold text-lg mb-2 border-b-2 border-dotted border-gray-400 pb-1">⏳ Panduan Utang Ibadah</h3>
        <p class="mb-3">Menghitung utang shalat yang sudah bertahun-tahun ditinggalkan memang seringkali menimbulkan rasa cemas dan bingung. Namun, dalam fiqih Islam (khususnya pandangan mayoritas ulama seperti Syafi'iyah), kewajiban Qadha tetap ada selama seseorang masih hidup.</p>
        <p class="mb-2">Berikut adalah panduan langkah demi langkah untuk menghitung, meyakinkan diri, dan memulainya dengan tenang:</p>
        
        <p class="font-bold mt-3">1. Menentukan Titik Awal (Masa Baligh)</p>
        <p>Laki-laki: Dihitung dari pertama kali mimpi basah atau maksimal usia 15 tahun Hijriah. Perempuan: Dihitung dari pertama kali mengalami menstruasi (haid).</p>
        
        <p class="font-bold mt-3">2. Cara Menghitung dengan Rumus Estimasi</p>
        <p>Karena Anda lupa jumlah pastinya, gunakan kaidah "Al-Yaqin la Yazulu bisy-Syakk" (Keyakinan tidak hilang karena keraguan). Ambillah angka yang paling maksimal agar hati lebih tenang (Ihtiyat).</p>
        <p class="text-xs mt-1"><i>Contoh: Meninggalkan shalat usia 15-20 tahun (5 tahun). Total Hari: 5 × 365 = 1.825 hari. Perempuan kurangi masa haid (5 × 12 × 7 = 420 hari).</i></p>

        <p class="font-bold mt-3">3. Cara Meyakinkan Diri (Mencapai Keakuratan)</p>
        <p>Gunakan prinsip Prasangka Kuat (Ghalabatuz Zhan): Pilih Angka Terberat. Jika ragu 3 atau 4 tahun, pilih 4 tahun. Sisanya akan jadi pahala sunnah. Gunakan aplikasi ini sebagai logbook checklist Anda. Niat Taubat Nasuha menutup ketidakpastian angka.</p>

        <p class="font-bold mt-3">4. Strategi Pelaksanaan agar Konsisten</p>
        <p>Gunakan metode Qadha Ma'al Faraidh (Qadha bersamaan dengan sholat wajib). Setiap selesai sholat fardhu, langsung sambung satu kali Qadha. Fokus pada Fardhu, selama punya utang prioritaskan Qadha di atas sunnah rawatib.</p>

        <p class="font-bold mt-3 text-green-800 dark:text-green-400">Kesimpulan untuk Ketenangan Hati</p>
        <p>Teruslah melakukan Qadha sampai Anda memiliki keyakinan kuat di dalam hati bahwa jumlah yang Anda kerjakan sudah menutupi atau melampaui jumlah yang ditinggalkan. Jangan biarkan rasa takut akan jumlah utang menghalangi Anda untuk bertaubat. Allah melihat proses kembalinya seorang hamba. Mulailah dari satu shalat hari ini.</p>
    `,
    amal: `
        <h3 class="font-bold text-lg mb-2 border-b-2 border-dotted border-gray-400 pb-1">💰 Panduan Amal & Dosa</h3>
        <p class="mb-3">Harta dan perasaan adalah titipan Allah. Fitur ini membantu Anda mengelola keuangan secara syariah dan menjaga kebersihan hati.</p>
        
        <p class="font-bold mt-3">1. Infaq & Sedekah</p>
        <p>Catat setiap infaq harta Anda. Pilih kategori (Masjid, Yatim, Dhuafa) dan masukkan nominal. Aplikasi akan merekap totalnya. Sedekah amal (seperti senyum) juga bisa dicentang untuk menambah poin harian.</p>
        
        <p class="font-bold mt-3">2. Zakat Fitrah</p>
        <p>Wajib dikeluarkan 1x setahun di bulan Ramadhan setara 2,5 kg bahan pokok per jiwa. Centang kotak jika sudah dibayarkan.</p>

        <p class="font-bold mt-3">3. Zakat Mal (Kalkulator)</p>
        <p>Masukkan harga emas saat ini dan total harta simpanan Anda. Jika harta mencapai <b>Nisab (85 gram emas)</b>, sistem akan menghitung berapa zakat yang harus dikeluarkan (2.5%). Anda bisa langsung mencatatnya ke rekap Infaq.</p>

        <p class="font-bold mt-3">4. Dosaku & Taubat</p>
        <p>Ini bukan fitur untuk menghakimi diri sendiri, tapi untuk <i>mintropeksi</i>. Catat dosa, kesalahan, dan pemicunya. Jangan hapus dosa yang sudah dicatat—tandai saja "Sudah Ditaubati". Coretan itu akan mengingatkan bahwa kita manusia yang pernah jatuh, tapi sudah bangkit bertaubat.</p>
        <p class="text-red-700 dark:text-red-400 font-bold mt-2">⚠️ Haqqul Ibad (Hak Manusia): Taubat tidak sah sebelum Anda meminta maaf langsung kepada orang yang terzalimi.</p>
    `
};

window.openGuideMenu = function() {
    // Tutup sidebar dulu
    window.toggleSidebar();

    // Buat Modal Win98
    const modal = document.createElement('div');
    modal.id = 'guide-modal';
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="win98-window w-full max-w-md">
            <div class="win98-titlebar">
                <span>📚 Panduan_Help.exe</span>
                <button class="win98-btn" onclick="window.closeGuide()" style="padding: 0 4px; font-size: 12px;">X</button>
            </div>
            <div id="guide-content" class="p-4">
                <p class="mb-4 text-sm">Pilih panduan yang ingin Anda baca:</p>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="window.showGuide('sholat')" class="win98-btn text-center font-bold py-3">🤲 Sholat</button>
                    <button onclick="window.showGuide('quran')" class="win98-btn text-center font-bold py-3">📖 Quran</button>
                    <button onclick="window.showGuide('utang')" class="win98-btn text-center font-bold py-3">⏳ Utang</button>
                    <button onclick="window.showGuide('amal')" class="win98-btn text-center font-bold py-3">💰 Amal</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

window.showGuide = function(type) {
    const contentDiv = document.getElementById('guide-content');
    if (!contentDiv) return;

    contentDiv.innerHTML = `
        <button onclick="window.openGuideMenu()" class="win98-btn mb-4 text-xs">⬅️ Kembali ke Menu</button>
        <div class="overflow-y-auto max-h-[60vh] text-sm leading-relaxed hide-scrollbar pr-2">
            ${guideData[type]}
        </div>
    `;
};

window.closeGuide = function() {
    const modal = document.getElementById('guide-modal');
    if (modal) modal.remove();
};

loadState();
try { renderDashboard(); const h=document.querySelector('.nav-btn[data-tab="dashboard"]'); if(h)h.classList.add('nav-active'); } catch (e) { console.error(e); }
