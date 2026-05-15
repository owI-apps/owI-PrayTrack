import { appState, saveState } from '../app.js';

export default function renderUtang() {
    const main = document.getElementById('main-content');
    const t = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const r = () => {
        main.innerHTML = `
            <div class="win98-window mb-4">
                <div class="win98-titlebar" style="background: #800000;">
                    <span>⚠️ Utang_Ibadah.sys</span>
                    <button class="win98-btn" style="padding: 0 4px; font-size: 12px; background: #C0C0C0; color: #000;">X</button>
                </div>
                <div class="p-4">
                    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">📅 ${t}</p>
                    
                    <!-- KALKULATOR SHOLAT -->
                    <h3 class="font-bold mb-2 border-b-2 border-dotted border-gray-400 pb-1">Kalkulator Utang Sholat</h3>
                    <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div>
                            <label class="text-xs font-semibold">Umur Baligh</label>
                            <input type="number" id="cb" placeholder="Cth: 14" class="w-full">
                        </div>
                        <div>
                            <label class="text-xs font-semibold">Umur Sekarang</label>
                            <input type="number" id="cs" placeholder="Cth: 30" class="w-full">
                        </div>
                    </div>
                    <p class="text-xs font-semibold mb-1">Bolos/bulan (0-30):</p>
                    <div class="space-y-1 text-sm mb-3">
                        <label class="flex items-center justify-between">Subuh <input type="number" id="c1" value="0" min="0" max="30" class="w-16 text-right"></label>
                        <label class="flex items-center justify-between">Dzuhur <input type="number" id="c2" value="0" min="0" max="30" class="w-16 text-right"></label>
                        <label class="flex items-center justify-between">Ashar <input type="number" id="c3" value="0" min="0" max="30" class="w-16 text-right"></label>
                        <label class="flex items-center justify-between">Maghrib <input type="number" id="c4" value="0" min="0" max="30" class="w-16 text-right"></label>
                        <label class="flex items-center justify-between">Isya <input type="number" id="c5" value="0" min="0" max="30" class="w-16 text-right"></label>
                    </div>
                    <button onclick="window.hL()" class="win98-btn w-full text-center font-bold">Hitung Sholat</button>
                    
                    <div id="hR" class="hidden mt-4 win98-window">
                        <div class="win98-titlebar" style="background: #808000;"><span>Hasil_Taksiran_Sholat</span></div>
                        <div class="p-3">
                            <p id="hT" class="text-sm"></p>
                            <button onclick="window.sT()" class="win98-btn w-full text-center mt-3 font-bold" style="background: #FF0000; color: #FFF;">Masukkan ke Utang</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- DAFTAR UTANG SHOLAT -->
            <h3 class="font-bold mb-2 border-b-2 border-dotted border-gray-400 pb-1">🕌 Daftar Utang Sholat</h3>
            ${appState.utangSholat.length === 0 ? '<p class="text-sm text-gray-500 mb-4">Kosong</p>' : ''}
            ${appState.utangSholat.map((u, i) => `
                <div class="win98-window mb-3">
                    <div class="p-3">
                        <div class="flex justify-between items-center mb-2">
                            <h4 class="font-bold">${u.sholat}</h4>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-600 dark:text-gray-400">${u.lunas}/${u.total} waktu</span>
                                <button onclick="window.eS(${i})" class="win98-btn" style="padding: 0 4px; font-size: 12px;">Edit</button>
                            </div>
                        </div>
                        <div class="w-full bg-gray-300 dark:bg-gray-800 h-3 mb-3 border border-gray-400">
                            <div class="bg-blue-800 dark:bg-blue-400 h-full" style="width:${(u.lunas/u.total)*100}%"></div>
                        </div>
                        <button onclick="window.lS(${i})" class="win98-btn w-full text-center font-bold">Lunasi 1</button>
                    </div>
                </div>
            `).join('')}

            <!-- INPUT UTANG PUASA -->
            <h3 class="font-bold mb-2 mt-6 border-b-2 border-dotted border-gray-400 pb-1">🌙 Tambah Utang Puasa</h3>
            <div class="win98-window mb-4 mt-2">
                <div class="p-3">
                    <div class="mb-2">
                        <label class="text-xs font-semibold">Keterangan (Cth: Ramadhan 2021)</label>
                        <input type="text" id="puasa-ket" placeholder="Ramadhan tahun..." class="w-full mt-1">
                    </div>
                    <div class="mb-3">
                        <label class="text-xs font-semibold">Total Hari Bolos</label>
                        <input type="number" id="puasa-total" placeholder="Cth: 5" min="1" class="w-full mt-1">
                    </div>
                    <button onclick="window.addPuasa()" class="win98-btn w-full text-center font-bold">Tambah Utang Puasa</button>
                </div>
            </div>

            <!-- DAFTAR UTANG PUASA -->
            <h3 class="font-bold mb-2 border-b-2 border-dotted border-gray-400 pb-1">🌙 Daftar Utang Puasa</h3>
            ${appState.utangPuasa.length === 0 ? '<p class="text-sm text-gray-500 mb-4">Kosong</p>' : ''}
            ${appState.utangPuasa.map((u, i) => `
                <div class="win98-window mb-3">
                    <div class="p-3">
                        <div class="flex justify-between items-center mb-2">
                            <h4 class="font-bold">${u.keterangan}</h4>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-600 dark:text-gray-400">${u.lunas}/${u.total} hari</span>
                                <button onclick="window.editPuasa(${i})" class="win98-btn" style="padding: 0 4px; font-size: 12px;">Edit</button>
                            </div>
                        </div>
                        <div class="w-full bg-gray-300 dark:bg-gray-800 h-3 mb-3 border border-gray-400">
                            <div class="bg-amber-700 dark:bg-amber-500 h-full" style="width:${(u.lunas/u.total)*100}%"></div>
                        </div>
                        <button onclick="window.lunasiPuasa(${i})" class="win98-btn w-full text-center font-bold">Lunasi 1 Hari</button>
                    </div>
                </div>
            `).join('')}
        `;
    };

    // ================= LOGIC SHOLAT =================
    window.hL = () => {
        const b = parseInt(document.getElementById('cb').value), s = parseInt(document.getElementById('cs').value);
        if (!b || !s || s <= b) { alert('Umur sekarang harus lebih tua dari umur baligh!'); return; }
        const m = (s - b) * 12;
        const bolos = { Subuh: parseInt(document.getElementById('c1').value)||0, Dzuhur: parseInt(document.getElementById('c2').value)||0, Ashar: parseInt(document.getElementById('c3').value)||0, Maghrib: parseInt(document.getElementById('c4').value)||0, Isya: parseInt(document.getElementById('c5').value)||0 };
        let h = "";
        Object.keys(bolos).forEach(k => { if(bolos[k]>0) h += `<p>${k}: ${m} bln x ${bolos[k]} = <b>${m*bolos[k]} waktu</b></p>`; });
        if (!h) h = "<p>Tidak ada taksiran.</p>";
        document.getElementById('hT').innerHTML = h;
        document.getElementById('hR').classList.remove('hidden');
    };

    window.sT = () => {
        const b = parseInt(document.getElementById('cb').value), s = parseInt(document.getElementById('cs').value), m = (s-b)*12;
        const bolos = { Subuh: parseInt(document.getElementById('c1').value)||0, Dzuhur: parseInt(document.getElementById('c2').value)||0, Ashar: parseInt(document.getElementById('c3').value)||0, Maghrib: parseInt(document.getElementById('c4').value)||0, Isya: parseInt(document.getElementById('c5').value)||0 };
        Object.keys(bolos).forEach(k => {
            if(bolos[k]>0) {
                const t = m*bolos[k], ex = appState.utangSholat.find(u => u.sholat === k);
                if(ex) ex.total += t; else appState.utangSholat.push({sholat:k,total:t,lunas:0});
            }
        });
        saveState(); r();
    };

    window.eS = i => { const n=prompt('Edit total waktu:',appState.utangSholat[i].total); if(n&&!isNaN(parseInt(n))){appState.utangSholat[i].total=parseInt(n);if(appState.utangSholat[i].lunas>appState.utangSholat[i].total)appState.utangSholat[i].lunas=appState.utangSholat[i].total;saveState();r();} };
    
    window.lS = i => {
        if(appState.utangSholat[i].lunas < appState.utangSholat[i].total) {
            if(confirm(`Alhamdulillah, yakin sudah melakukan utang sholat ${appState.utangSholat[i].sholat}?`)) {
                appState.utangSholat[i].lunas += 1;
                saveState();
                r();
            }
        }
    };

    // ================= LOGIC PUASA =================
    window.addPuasa = () => {
        const ket = document.getElementById('puasa-ket').value;
        const total = parseInt(document.getElementById('puasa-total').value);
        if (!ket || !total || total <= 0) { alert('Isi keterangan dan total hari!'); return; }
        appState.utangPuasa.push({ keterangan: ket, total: total, lunas: 0 });
        saveState(); r();
    };

    window.editPuasa = i => {
        const n = prompt('Edit total hari:', appState.utangPuasa[i].total);
        if (n && !isNaN(parseInt(n))) {
            appState.utangPuasa[i].total = parseInt(n);
            if (appState.utangPuasa[i].lunas > appState.utangPuasa[i].total) appState.utangPuasa[i].lunas = appState.utangPuasa[i].total;
            saveState(); r();
        }
    };

    window.lunasiPuasa = i => {
        if(appState.utangPuasa[i].lunas < appState.utangPuasa[i].total) {
            if(confirm(`Alhamdulillah, yakin sudah melakukan qodho puasa ${appState.utangPuasa[i].keterangan}?`)) {
                appState.utangPuasa[i].lunas += 1;
                saveState();
                r();
            }
        }
    };

    r();
}
