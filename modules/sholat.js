import { appState, saveState, addPoint, subtractPoint } from '../app.js'; // FIX: Import fungsi poin

export default function renderSholat() {
    const main = document.getElementById('main-content');
    let viewDate = appState.todayDate; // Default hari ini

    const renderUI = () => {
        const dayData = appState.sholatHistory[viewDate] || { wajib: {}, sunnah: [] };
        const wajibList = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
        const sunnahList = [
            {n:'Qabliyah Subuh', t:'s'}, {n:'Dzikir Pagi', t:'d'}, 
            {n:'Qabliyah Dzuhur', t:'s'}, {n:"Ba'diyah Dzuhur", t:'s'}, {n:'Qabliyah Ashar', t:'s'}, 
            {n:'Dzikir Sore', t:'d'}, {n:'Qabliyah Maghrib', t:'s'}, {n:"Ba'diyah Maghrib", t:'s'}, 
            {n:'Qabliyah Isya', t:'s'}, {n:"Ba'diyah Isya", t:'s'}
        ];

        main.innerHTML = `
            <div class="win98-window mb-4">
                <div class="win98-titlebar">
                    <span>Agenda_Sholat.exe</span>
                    <button class="win98-btn" style="padding: 0 4px; font-size: 12px; background: #C0C0C0; color: #000;">X</button>
                </div>
                <div class="p-4">
                    <div class="mb-4">
                        <label class="text-xs font-bold">Lihat Tanggal:</label>
                        <input type="date" id="datePicker" value="${viewDate}" class="w-full mt-1">
                    </div>
                    
                    <h3 class="font-bold mb-2 border-b-2 border-dotted border-gray-400 pb-1">Sholat Wajib</h3>
                    <div class="space-y-2 py-2 mb-4 text-sm">
                        ${wajibList.map(x => `
                            <div class="flex items-center justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                                <span class="w-20 font-bold">${x}</span>
                                <select data-name="${x}" class="wajib-status">
                                    <option value="">--Pilih--</option>
                                    <option value="jamaah" ${dayData.wajib[x]==='jamaah'?'selected':''}>Berjamaah</option>
                                    <option value="sendiri" ${dayData.wajib[x]==='sendiri'?'selected':''}>Sendiri</option>
                                    <option value="tidak" ${dayData.wajib[x]==='tidak'?'selected':''}>Tidak Sholat</option>
                                </select>
                            </div>
                        `).join('')}
                    </div>

                    <h3 class="font-bold mb-2 border-b-2 border-dotted border-gray-400 pb-1">Sunnah & Dzikir (+3 Poin)</h3>
                    <div class="space-y-2 py-2 text-sm">
                        ${sunnahList.map(x => `
                            <label class="flex items-center justify-between py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 ${x.t === 'd' ? 'font-bold text-green-800 dark:text-green-400' : ''}">
                                <span>${x.n}</span>
                                <input type="checkbox" data-name="${x.n}" class="sunnah-check" style="width: 20px; height: 20px; cursor: pointer;" ${dayData.sunnah.includes(x.n)?'checked':''}>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('datePicker').addEventListener('change', e => {
            viewDate = e.target.value;
            renderUI(); 
        });

        document.querySelectorAll('.wajib-status').forEach(sel => {
            sel.addEventListener('change', e => {
                const name = e.target.dataset.name;
                const status = e.target.value;
                const isToday = viewDate === appState.todayDate; // CEK APAKAH HARI INI
                
                if (!appState.sholatHistory[viewDate]) appState.sholatHistory[viewDate] = { wajib: {}, sunnah: [] };
                const prevStatus = appState.sholatHistory[viewDate].wajib[name] || "";
                appState.sholatHistory[viewDate].wajib[name] = status;
                saveState();

                // Hitung Poin (Hanya untuk hari ini)
                if (isToday) {
                    if (status === 'jamaah' || status === 'sendiri') {
                        if (!prevStatus || prevStatus === 'tidak') addPoint('wajib', 10); 
                    } else {
                        if (prevStatus === 'jamaah' || prevStatus === 'sendiri') subtractPoint('wajib', 10); 
                    }
                }

                // FIX UX: Logika Utang Cuma Jalan Kalau Di Tanggal Hari Ini
                if (isToday && status === 'tidak') {
                    const existingDebt = appState.utangSholat.find(u => u.sholat === name);
                    if (existingDebt) { existingDebt.total += 1; } else { appState.utangSholat.push({ sholat: name, total: 1, lunas: 0 }); }
                    saveState();
                    window.playSound('chord');  alert(`⚠️ Utang sholat ${name} ditambahkan.`);
                } else if (isToday && (status === 'jamaah' || status === 'sendiri') && prevStatus === 'tidak') {
                    const debt = appState.utangSholat.find(u => u.sholat === name);
                    if (debt && debt.total > 0) { debt.total -= 1; if(debt.total===0) appState.utangSholat = appState.utangSholat.filter(u=>u.total>0); saveState(); window.playSound('chord');  alert(`✅ Utang ${name} dibatalkan.`); }
                }
            });
        });

        document.querySelectorAll('.sunnah-check').forEach(cb => {
            cb.addEventListener('change', e => {
                const name = e.target.dataset.name;
                const isToday = viewDate === appState.todayDate;
                
                if (!appState.sholatHistory[viewDate]) appState.sholatHistory[viewDate] = { wajib: {}, sunnah: [] };
                if (e.target.checked) {
                    appState.sholatHistory[viewDate].sunnah.push(name);
                    if (isToday) addPoint('sunnah', 3); // Poin cuma buat hari ini
                } else {
                    appState.sholatHistory[viewDate].sunnah = appState.sholatHistory[viewDate].sunnah.filter(n => n !== name);
                    if (isToday) subtractPoint('sunnah', 3); // Poin cuma buat hari ini
                }
                saveState();
            });
        });
    };

    renderUI();
}
