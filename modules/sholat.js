import { addPoint, subtractPoint } from '../app.js';

export default function renderSholat() {
    const wajib = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
    const sunnah = [
        { name: 'Qabliyah Subuh', type: 'sunnah' },
        { name: 'Dzikir Pagi', type: 'dzikir' },
        { name: 'Qabliyah Dzuhur', type: 'sunnah' },
        { name: "Ba'diyah Dzuhur", type: 'sunnah' },
        { name: 'Qabliyah Ashar', type: 'sunnah' },
        { name: 'Dzikir Sore', type: 'dzikir' },
        { name: 'Qabliyah Maghrib', type: 'sunnah' },
        { name: "Ba'diyah Maghrib", type: 'sunnah' },
        { name: 'Qabliyah Isya', type: 'sunnah' },
        { name: "Ba'diyah Isya", type: 'sunnah' }
    ];

    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const main = document.getElementById('main-content');
    
    main.innerHTML = `
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">📅 ${today}</p>
        <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Agenda Sholat</h2>
        
        <div class="bg-white dark:bg-[#0F172A] rounded-xl shadow-sm dark:shadow-none dark:border dark:border-slate-800 p-4 mb-4">
            <h3 class="font-semibold mb-2 border-b border-gray-200 dark:border-slate-700 pb-2 text-gray-800 dark:text-white">Sholat Wajib (+10 Poin)</h3>
            <div class="space-y-2 py-2 text-sm">
                ${wajib.map((s, i) => `
                    <label class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0 cursor-pointer text-gray-700 dark:text-gray-300">
                        <span>${s}</span>
                        <input type="checkbox" data-type="wajib" data-idx="${i}" class="w-5 h-5 accent-sky-600 sholat-check">
                    </label>
                `).join('')}
            </div>
        </div>

        <div class="bg-white dark:bg-[#0F172A] rounded-xl shadow-sm dark:shadow-none dark:border dark:border-slate-800 p-4 mb-4">
            <h3 class="font-semibold mb-2 border-b border-gray-200 dark:border-slate-700 pb-2 text-gray-800 dark:text-white">Sunnah Rawatib & Dzikir (+3 Poin)</h3>
            <div class="space-y-2 py-2 text-sm">
                ${sunnah.map((s, i) => `
                    <label class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0 cursor-pointer ${s.type === 'dzikir' ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}">
                        <span>${s.name}</span>
                        <input type="checkbox" data-type="sunnah" data-idx="${i}" class="w-5 h-5 accent-sky-600 sholat-check">
                    </label>
                `).join('')}
            </div>
        </div>
    `;

    document.querySelectorAll('.sholat-check').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const type = e.target.dataset.type;
            if(e.target.checked) {
                addPoint(type, type === 'wajib' ? 10 : 3);
            } else {
                subtractPoint(type, type === 'wajib' ? 10 : 3);
            }
        });
    });
}
