import { addPoint, subtractPoint, appState, saveState } from '../app.js';

export default function renderSholat() {
    const main = document.getElementById('main-content');
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const wajib = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
    const sunnah = [
        {n:'Qabliyah Subuh', t:'s'}, 
        {n:'Dzikir Pagi (Setelah Subuh)', t:'d'}, 
        {n:'Qabliyah Dzuhur', t:'s'}, 
        {n:"Ba'diyah Dzuhur", t:'s'}, 
        {n:'Qabliyah Ashar', t:'s'}, 
        {n:'Dzikir Sore (Setelah Ashar)', t:'d'}, 
        {n:'Qabliyah Maghrib', t:'s'}, 
        {n:"Ba'diyah Maghrib", t:'s'}, 
        {n:'Qabliyah Isya', t:'s'}, 
        {n:"Ba'diyah Isya", t:'s'}
    ];

    // Cek apa udah pernah dicentang hari ini
    const checked = appState.checkedSholat || [];

    main.innerHTML = `
        <div class="win98-window mb-4">
            <div class="win98-titlebar">
                <span>Agenda_Sholat.exe</span>
                <button class="win98-btn" style="padding: 0 4px; font-size: 12px; background: #C0C0C0; color: #000;">X</button>
            </div>
            <div class="p-4">
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">📅 ${today}</p>
                
                <h3 class="font-bold mb-2 border-b-2 border-dotted border-gray-400 pb-1">Sholat Wajib (+10 Poin)</h3>
                <div class="space-y-2 py-2 mb-4">
                    ${wajib.map(x => `
                        <label class="flex items-center justify-between py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800">
                            <span>${x}</span>
                            <input type="checkbox" data-type="wajib" data-name="${x}" class="sholat-check" style="width: 20px; height: 20px; cursor: pointer;" ${checked.includes(x) ? 'checked' : ''}>
                        </label>
                    `).join('')}
                </div>

                <h3 class="font-bold mb-2 border-b-2 border-dotted border-gray-400 pb-1">Sunnah & Dzikir (+3 Poin)</h3>
                <div class="space-y-2 py-2">
                    ${sunnah.map(x => `
                        <label class="flex items-center justify-between py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 ${x.t === 'd' ? 'font-bold text-green-800 dark:text-green-400' : ''}">
                            <span>${x.n}</span>
                            <input type="checkbox" data-type="sunnah" data-name="${x.n}" class="sholat-check" style="width: 20px; height: 20px; cursor: pointer;" ${checked.includes(x.n) ? 'checked' : ''}>
                        </label>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Event Listener Checkbox
    document.querySelectorAll('.sholat-check').forEach(cb => {
        cb.addEventListener('change', e => {
            const type = e.target.dataset.type;
            const name = e.target.dataset.name;
            
            if (e.target.checked) {
                // Kalau dicentang, dapet poin & simpan state
                addPoint(type, type === 'wajib' ? 10 : 3);
                appState.checkedSholat.push(name);
                saveState();
            } else {
                // Kalau di-uncheck, kurangi poin & hapus state
                subtractPoint(type, type === 'wajib' ? 10 : 3);
                appState.checkedSholat = appState.checkedSholat.filter(item => item !== name);
                saveState();
                
                // Jika Wajib di-uncheck, masuk utang
                if (type === 'wajib' && name) {
                    const existingDebt = appState.utangSholat.find(u => u.sholat === name);
                    if (existingDebt) {
                        existingDebt.total += 1;
                    } else {
                        appState.utangSholat.push({ sholat: name, total: 1, lunas: 0 });
                    }
                    saveState();
                    alert(`⚠️ Utang sholat ${name} ditambahkan ke daftar utang.`);
                }
            }
        });
    });
}
