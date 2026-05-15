import { addPoint, subtractPoint } from '../app.js';

export default function renderSholat() {
    const wajib = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
    const sunnah = [
        { name: 'Qabliyah Subuh', type: 'sunnah' },
        { name: 'Dzikir Pagi', type: 'dzikir' },
        { name: 'Qabliyah Dzuhur', type: 'sunnah' },
        { name: "Ba'diyah Dzuhur", type: 'sunnah' },
        { name: 'Dzikir Sore', type: 'dzikir' },
        { name: 'Qabliyah Maghrib', type: 'sunnah' },
        { name: "Ba'diyah Maghrib", type: 'sunnah' },
        { name: 'Qabliyah Isya', type: 'sunnah' },
        { name: "Ba'diyah Isya", type: 'sunnah' }
    ];

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <h2 class="text-xl font-bold mb-4 text-gray-800">Agenda Sholat</h2>
        
        <div class="bg-white rounded-xl shadow p-4 mb-4">
            <h3 class="font-semibold mb-2 border-b pb-2">Sholat Wajib (+10 Poin)</h3>
            <div class="space-y-2 py-2 text-sm" id="wajib-list">
                ${wajib.map((s, i) => `
                    <label class="flex items-center justify-between py-2 border-b last:border-0 cursor-pointer">
                        <span>${s}</span>
                        <input type="checkbox" data-type="wajib" data-idx="${i}" class="w-5 h-5 accent-sky-600 sholat-check">
                    </label>
                `).join('')}
            </div>
        </div>

        <div class="bg-white rounded-xl shadow p-4 mb-4">
            <h3 class="font-semibold mb-2 border-b pb-2">Sunnah & Dzikir (+3 Poin)</h3>
            <div class="space-y-2 py-2 text-sm" id="sunnah-list">
                ${sunnah.map((s, i) => `
                    <label class="flex items-center justify-between py-2 border-b last:border-0 cursor-pointer ${s.type === 'dzikir' ? 'text-green-600 font-semibold' : ''}">
                        <span>${s.name}</span>
                        <input type="checkbox" data-type="sunnah" data-idx="${i}" class="w-5 h-5 accent-sky-600 sholat-check">
                    </label>
                `).join('')}
            </div>
        </div>
    `;

    // Event Listener Checkbox
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
