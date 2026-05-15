import { appState, saveState, addPoint } from '../app.js';

export default function renderAmalJariyah() {
    const main = document.getElementById('main-content');
    const t = new Date().toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
    
    // Init state kalau belum ada
    if (appState.infaqList === undefined) appState.infaqList = [];
    if (appState.zakatFitrahPaid === undefined) appState.zakatFitrahPaid = false;
    if (appState.zakatFitrahClaimed === undefined) appState.zakatFitrahClaimed = false;

    const tI = appState.infaqList.reduce((s,i)=>s+i.nominal,0);
    
    main.innerHTML = `
        <div class="win98-window mb-4">
            <div class="win98-titlebar" style="background: #008000;">
                <span>💰 Amal_Jariyah.exe</span>
                <button class="win98-btn" style="padding: 0 4px; font-size: 12px; background: #C0C0C0; color: #000;">X</button>
            </div>
            <div class="p-4">
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">📅 ${t}</p>

                <!-- INFAQ & SEDEKAH -->
                <button onclick="window.tC('ci')" class="win98-btn w-full text-left mb-2 font-bold">🤲 Infaq & Sedekah [ + ]</button>
                <div id="ci" class="hidden mb-4 border-2 border-gray-400 dark:border-gray-600 p-3">
                    <h4 class="font-bold text-sm mb-2">Sadaqah Amal (+5 Poin)</h4>
                    <div class="space-y-2 text-sm mb-4">
                        <label class="flex items-center gap-2"><input type="checkbox" class="sc" style="width:16px;height:16px;"> Senyum</label>
                        <label class="flex items-center gap-2"><input type="checkbox" class="sc" style="width:16px;height:16px;"> Menyingkirkan gangguan</label>
                    </div>

                    <h4 class="font-bold text-sm mb-2">Infaq Harta (+10 Poin)</h4>
                    <div class="flex gap-2 mb-2">
                        <select id="ik" class="w-1/3"><option>Masjid</option><option>Yatim</option><option>Dhuafa</option></select>
                        <div class="relative w-2/3">
                            <span class="absolute left-2 top-1.5 text-gray-500 text-sm">Rp</span>
                            <input type="number" id="ii" placeholder="0" class="w-full pl-8">
                        </div>
                    </div>
                    <button onclick="window.aI()" class="win98-btn w-full text-center font-bold">Tambah</button>
                    ${appState.infaqList.length>0?`<div class="mt-3 text-sm max-h-24 overflow-y-auto">${appState.infaqList.map((x,i)=>`<div class="flex justify-between"><span>${x.kategori} Rp ${x.nominal.toLocaleString('id-ID')}</span><button onclick="window.dI(${i})" class="text-red-700 dark:text-red-400">Hapus</button></div>`).join('')}</div>`:''}
                    <div class="mt-2 pt-2 border-t-2 border-dotted border-gray-400 font-bold text-right">Total: Rp ${tI.toLocaleString('id-ID')}</div>
                </div>

                <!-- ZAKAT FITRAH (BARU) -->
                <button onclick="window.tC('cf')" class="win98-btn w-full text-left mb-2 font-bold">🌾 Zakat Fitrah [ + ]</button>
                <div id="cf" class="hidden mb-4 border-2 border-gray-400 dark:border-gray-600 p-3">
                    <div class="win98-window mb-3">
                        <div class="win98-titlebar" style="background: #808000;"><span>Fitrah_Check.sys</span></div>
                        <div class="p-3 text-sm">
                            <p class="mb-2">Wajib dikeluarkan 1x setahun (bulan Ramadhan) setara 2,5 kg beras per jiwa.</p>
                            <label class="flex items-center gap-2 cursor-pointer font-bold">
                                <input type="checkbox" id="zf-check" style="width:16px;height:16px;" ${appState.zakatFitrahPaid ? 'checked' : ''}>
                                <span>Sudah membayar Zakat Fitrah tahun ini</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- ZAKAT MAL (BARU) -->
                <button onclick="window.tC('cz')" class="win98-btn w-full text-left mb-2 font-bold">⚖️ Zakat Mal [ + ]</button>
                <div id="cz" class="hidden mb-4 border-2 border-gray-400 dark:border-gray-600 p-3">
                    <div class="win98-window">
                        <div class="win98-titlebar" style="background: #000080;"><span>Kalkulator_Zakat_Mal.exe</span></div>
                        <div class="p-3 text-sm">
                            <div class="mb-2">
                                <label class="text-xs font-semibold">Harga Emas Saat Ini (per gram):</label>
                                <div class="relative mt-1">
                                    <span class="absolute left-2 top-1.5 text-gray-500 text-sm">Rp</span>
                                    <input type="number" id="zm-emas" placeholder="Cth: 1100000" class="w-full pl-8">
                                </div>
                            </div>
                            <div class="mb-2">
                                <label class="text-xs font-semibold">Total Harta (Tabungan, Investasi, dll):</label>
                                <div class="relative mt-1">
                                    <span class="absolute left-2 top-1.5 text-gray-500 text-sm">Rp</span>
                                    <input type="number" id="zm-harta" placeholder="Cth: 100000000" class="w-full pl-8">
                                </div>
                            </div>
                            <button onclick="window.hZM()" class="win98-btn w-full text-center font-bold mt-2">Hitung Zakat</button>
                            
                            <div id="zm-hasil" class="hidden mt-3 win98-window">
                                <div class="win98-titlebar" style="background: #808000;"><span>Hasil_Taksiran</span></div>
                                <div class="p-3" id="zm-hasil-text"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Event Sadaqah
    document.querySelectorAll('.sc').forEach(cb => cb.addEventListener('change', e => { 
        if(e.target.checked && !appState.infaqClaimedToday){ 
            addPoint('infaq',5); 
            appState.infaqClaimedToday = true;
            saveState();
        } 
    }));

    // Event Zakat Fitrah
    const zfCheck = document.getElementById('zf-check');
    if (zfCheck) {
        zfCheck.addEventListener('change', e => {
            appState.zakatFitrahPaid = e.target.checked;
            if (e.target.checked && !appState.zakatFitrahClaimed) {
                addPoint('infaq', 10); // Kasih poin kalau udah bayar
                appState.zakatFitrahClaimed = true;
            }
            saveState();
        });
    }
}

window.tC = id => { document.getElementById(id).classList.toggle('hidden'); };

window.aI = () => { 
    const k=document.getElementById('ik').value, n=parseInt(document.getElementById('ii').value); 
    if(!n||n<=0){alert('Isi nominal!');return;} 
    
    appState.infaqList.unshift({kategori: k, nominal: n}); 
    
    if(!appState.infaqClaimedToday){
        addPoint('infaq',10);
        appState.infaqClaimedToday = true;
    }
    saveState();
    renderAmalJariyah(); 
};

window.dI = i => { 
    appState.infaqList.splice(i,1); 
    saveState();
    renderAmalJariyah(); 
};

// KALKULATOR ZAKAT MAL
window.hZM = () => {
    const hargaEmas = parseInt(document.getElementById('zm-emas').value) || 0;
    const totalHarta = parseInt(document.getElementById('zm-harta').value) || 0;
    
    if (!hargaEmas || !totalHarta) {
        alert('Isi harga emas dan total harta!');
        return;
    }
    
    const nisab = 85 * hargaEmas; // Nisab zakat mal = 85 gram emas
    const hasilEl = document.getElementById('zm-hasil');
    const textEl = document.getElementById('zm-hasil-text');
    
    let html = `<p class="text-xs mb-2">Nisab (85 gr emas): <b>Rp ${nisab.toLocaleString('id-ID')}</b></p>`;
    
    if (totalHarta >= nisab) {
        const zakat = totalHarta * 0.025; // 2.5%
        html += `<p class="font-bold text-green-800 dark:text-green-400">Status: WAJIB ZAKAT ✅</p>`;
        html += `<p class="mt-1">Total Zakat yang harus dikeluarkan (2.5%):</p>`;
        html += `<p class="text-xl font-bold text-red-700 dark:text-red-400 mt-1">Rp ${zakat.toLocaleString('id-ID')}</p>`;
        html += `<button onclick="window.bayarZM(${zakat})" class="win98-btn w-full text-center font-bold mt-3">Catat Sebagai Infaq</button>`;
    } else {
        html += `<p class="font-bold">Status: Belum Wajib Zakat ❌</p>`;
        html += `<p class="text-xs text-gray-500 mt-1">Total harta belum mencapai Nisab.</p>`;
    }
    
    textEl.innerHTML = html;
    hasilEl.classList.remove('hidden');
};

// Simpan Zakat Mal ke Infaq kalau user klik "Catat"
window.bayarZM = (jumlah) => {
    appState.infaqList.unshift({kategori: 'Zakat Mal', nominal: jumlah}); 
    if(!appState.infaqClaimedToday){
        addPoint('infaq',10);
        appState.infaqClaimedToday = true;
    }
    saveState();
    renderAmalJariyah();
};
