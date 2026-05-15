import { appState, saveState, addPoint, subtractPoint } from '../app.js';

export default function renderSholat() {
    const main = document.getElementById('main-content');
    const todayStr = new Date().toISOString().slice(0, 10);
    
    // Init log if empty
    if (!appState.sholatLog) appState.sholatLog = {};
    if (!appState.sholatLog[todayStr]) {
        appState.sholatLog[todayStr] = { wajib: {}, sunnah: [] };
        saveState();
    }

    let selectedDate = todayStr;

    const wajibList = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
    const sunnahList = [
        'Qabliyah Subuh', 'Dzikir Pagi', 
        'Qabliyah Dzuhur', "Ba'diyah Dzuhur", 
        'Qabliyah Ashar', 'Dzikir Sore', 
        'Qabliyah Maghrib', "Ba'diyah Maghrib", 
        'Qabliyah Isya', "Ba'diyah Isya"
    ];

    const renderUI = () => {
        const log = appState.sholatLog[selectedDate] || { wajib: {}, sunnah: [] };
        const isToday = selectedDate === todayStr;

        main.innerHTML = `
            <div class="win98-window mb-4">
                <div class="win98-titlebar">
                    <span>Agenda_Sholat.exe</span>
                    <button class="win98-btn" style="padding: 0 4px; font-size: 12px; background: #C0C0C0; color: #000;">X</button>
                </div>
                <div class="p-4">
                    <div class="flex items-center gap-2 mb-4">
                        <label class="text-sm font-bold">📅 Tanggal:</label>
                        <input type="date" id="date-picker" value="${selectedDate}" class="flex-1" max="${todayStr}">
                    </div>
                    
                    <h3 class="font-bold mb-2 border-b-2 border-dotted border-gray-400 pb-1">Sholat Wajib ${isToday ? '(Hari Ini)' : '(Edit Data Lalu)'}</h3>
                    <div class="space-y-3 py-2 mb-4">
                        ${wajibList.map(x => {
                            const val = log.wajib[x] || 'none';
                            return `
                            <div class="flex items-center justify-between py-1 border-b border-dotted border-gray-300 last:border-0">
                                <span class="font-bold text-sm">${x}</span>
                                <div class="flex gap-1">
                                    <button data-name="${x}" data-val="jamaah" class="w-btn win98-btn text-xs ${val==='jamaah'?'nav-active':''}">Jamaah</button>
                                    <button data-name="${x}" data-val="sendiri" class="w-btn win98-btn text-xs ${val==='sendiri'?'nav-active':''}">Sendiri</button>
                                    <button data-name="${x}" data-val="tidak" class="w-btn win98-btn text-xs ${val==='tidak'?'nav-active':''}">Tidak</button>
                                </div>
                            </div>`;
                        }).join('')}
                    </div>

                    <h3 class="font-bold mb-2 border-b-2 border-dotted border-gray-400 pb-1">Sunnah & Dzikir (+3 Poin)</h3>
                    <div class="space-y-2 py-2">
                        ${sunnahList.map(x => `
                            <label class="flex items-center justify-between py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800">
                                <span class="text-sm">${x}</span>
                                <input type="checkbox" data-name="${x}" class="s-check" style="width: 20px; height: 20px; cursor: pointer;" ${log.sunnah.includes(x) ? 'checked' : ''}>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        bindEvents();
    };

    const bindEvents = () => {
        // 1. Date Picker Change
        document.getElementById('date-picker').addEventListener('change', e => {
            selectedDate = e.target.value;
            if (!appState.sholatLog[selectedDate]) {
                appState.sholatLog[selectedDate] = { wajib: {}, sunnah: [] };
            }
            saveState();
            renderUI(); // Re-render with new date
        });

        // 2. Wajib Buttons
        document.querySelectorAll('.w-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const name = e.target.dataset.name;
                const newVal = e.target.dataset.val;
                const oldVal = appState.sholatLog[selectedDate].wajib[name] || 'none';
                const isToday = selectedDate === todayStr;

                if (oldVal === newVal) return; // Do nothing if clicking same button

                // Update Log
                appState.sholatLog[selectedDate].wajib[name] = newVal;
                saveState();

                // Handle Points (Only for today)
                if (isToday) {
                    // Remove old points
                    if (oldVal === 'jamaah') subtractPoint('wajib', 15);
                    else if (oldVal === 'sendiri') subtractPoint('wajib', 10);

                    // Add new points
                    if (newVal === 'jamaah') addPoint('wajib', 15);
                    else if (newVal === 'sendiri') addPoint('wajib', 10);
                }
