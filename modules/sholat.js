export default function renderSholat() {
    const wajib = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
    const sunnah = [
        { name: 'Qabliyah Subuh', type: 'sunnah' },
        { name: 'Dzikir Pagi (Setelah Subuh)', type: 'dzikir' },
        { name: 'Qabliyah Dzuhur', type: 'sunnah' },
        { name: "Ba'diyah Dzuhur", type: 'sunnah' },
        { name: 'Dzikir Sore (Setelah Ashar)', type: 'dzikir' },
        { name: 'Qabliyah Maghrib', type: 'sunnah' },
        { name: "Ba'diyah Maghrib", type: 'sunnah' },
        { name: 'Qabliyah Isya', type: 'sunnah' },
        { name: "Ba'diyah Isya", type: 'sunnah' }
    ];

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <button onclick="window.goHome()" class="flex items-center text-sky-600 mb-4 font-semibold"><i data-lucide="arrow-left" class="w-5 h-5 mr-1"></i> Kembali</button>
        <h2 class="text-xl font-bold mb-4 text-gray-800">Agenda Sholat</h2>
        
        <div class="bg-white rounded-xl shadow p-4 mb-4">
            <h3 class="font-semibold mb-2 border-b pb-2">Sholat Wajib</h3>
            <div class="space-y-2 py-2 text-sm">
                ${wajib.map(s => `
                    <label class="flex items-center justify-between py-2 border-b last:border-0 cursor-pointer">
                        <span>${s}</span><input type="checkbox" class="w-5 h-5 accent-sky-600">
                    </label>
                `).join('')}
            </div>
        </div>

        <div class="bg-white rounded-xl shadow p-4 mb-4">
            <h3 class="font-semibold mb-2 border-b pb-2">Sunnah Rawatib & Dzikir</h3>
            <div class="space-y-2 py-2 text-sm">
                ${sunnah.map(s => `
                    <label class="flex items-center justify-between py-2 border-b last:border-0 cursor-pointer ${s.type === 'dzikir' ? 'text-green-600 font-semibold' : ''}">
                        <span>${s.name}</span><input type="checkbox" class="w-5 h-5 accent-sky-600">
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}