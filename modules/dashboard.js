export function renderDashboard() {
    const main = document.getElementById('main-content');
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return "Selamat Pagi";
        if (hour < 15) return "Selamat Siang";
        if (hour < 18) return "Selamat Sore";
        return "Selamat Malam";
    }

    main.innerHTML = `
        <div class="mb-6">
            <h2 class="text-xl font-bold text-gray-800">${getGreeting()}, Brad!</h2>
            <p class="text-gray-500 text-sm">Jangan lupa agendamu hari ini.</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <!-- Tombol Sholat -->
            <button onclick="window.navigateTo('sholat')" class="bg-sky-600 text-white p-5 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center active:scale-95 transition-transform h-36">
                <i data-lucide="check-circle" class="w-10 h-10 mb-2"></i>
                <span class="font-bold text-sm">Sholat</span>
                <span class="text-xs opacity-80">Wajib & Sunnah</span>
            </button>

            <!-- Tombol Al-Quran -->
            <button onclick="window.navigateTo('quran')" class="bg-emerald-600 text-white p-5 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center active:scale-95 transition-transform h-36">
                <i data-lucide="book-open" class="w-10 h-10 mb-2"></i>
                <span class="font-bold text-sm">Baca Al-Quran</span>
                <span class="text-xs opacity-80">Last Read</span>
            </button>

            <!-- Tombol Utang Ibadah -->
            <button onclick="window.navigateTo('utang')" class="bg-orange-500 text-white p-5 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center active:scale-95 transition-transform h-36">
                <i data-lucide="clock" class="w-10 h-10 mb-2"></i>
                <span class="font-bold text-sm">Utang Ibadah</span>
                <span class="text-xs opacity-80">Sholat & Puasa</span>
            </button>

            <!-- Tombol Investasi -->
            <button onclick="window.navigateTo('investasi')" class="bg-purple-600 text-white p-5 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center active:scale-95 transition-transform h-36">
                <i data-lucide="heart-handshake" class="w-10 h-10 mb-2"></i>
                <span class="font-bold text-sm">Investasi</span>
                <span class="text-xs opacity-80">Infaq & Shodaqoh</span>
            </button>
        </div>
    `;
}