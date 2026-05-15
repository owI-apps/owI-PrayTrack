import { appState, saveState, addPoint } from '../app.js';

export default function renderAmalJariyah() {
    const main = document.getElementById('main-content');
    const t = new Date().toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
    
    // Init state
    if (!appState.infaqList) appState.infaqList = [];
    if (!appState.zakatFitrahPaid) appState.zakatFitrahPaid = false;
    if (!appState.zakatFitrahClaimed) appState.zakatFitrahClaimed = false;
    if (!appState.dosaList) appState.dosaList = []; // TAMBAHAN STATE DOSA

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

                <!-- ZAKAT FITRAH -->
                <button onclick="window.tC('cf')" class="win98-btn w-full text-left mb-2 font-bold">🌾 Zakat Fitrah [ + ]</button>
                <div id="cf" class="hidden mb-4 border-2 border-gray-400 dark:border-gray-600 p-3">
                    <div class="win98-window mb-3">
                        <div class="win98-titlebar" style="background: #808000;"><span>Fitrah_Check.sys</span></div>
                        <div class="p-3 text-sm">
                            <p class="mb-2">Wajib dikeluarkan 1x setahun setara 2,5 kg beras per jiwa.</p>
                            <label class="flex items-center gap-2 cursor-pointer font-bold">
                                <input type="checkbox" id="zf-check" style="width:16px;height:16px;" ${appState.zakatFitrahPaid ? 'checked' : ''}>
                                <span>Sudah membayar Zakat Fitrah tahun ini</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- ZAKAT MAL -->
                <button onclick="window.tC('cz')" class="win98-btn w-full text-left mb-2 font-bold">⚖️ Zakat Mal [ + ]</button>
                <div id="cz" class="hidden mb-4 border-2 border-gray-400 dark:border-gray-600 p-3">
                    <div class="win98-window">
                        <div class="win98-titlebar" style="background: #000080;"><span>Kalkulator_Zakat_Mal.exe</span></div>
                        <div class="p-3 text-sm">
                            <div class="mb-2">
                                <label class="text-xs font-semibold">Harga Emas Saat Ini (per gram):</label>
                                <div class="relative mt-1"><span class="absolute left-2 top-1.5 text-gray-500 text-sm">Rp</span><input type="number" id="zm-emas" placeholder="Cth: 1100000" class="w-full pl-8"></div>
                            </div>
                            <div class="mb-2">
                                <label class="text-xs font-semibold">Total Harta (Tabungan, Investasi, dll):</label>
                                <div class="relative mt-1"><span class="absolute left-2 top-1.5 text-gray-500 text-sm">Rp</span><input type="number" id="zm-harta" placeholder="Cth: 100000000" class="w-full pl-8"></div>
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

        <!-- KARTU DOSAKU (FITUR BARU) -->
        <div class="win98-window mb-4">
            <div class="win98-titlebar" style="background: #404040;">
                <span>📖 Dosaku_&_Taubat.sys</span>
                <button class="win98-btn" style="padding: 0 4px; font-size: 12px; background: #C0C0C0; color: #000;">X</button>
            </div>
            <div class="p-4">
                <p class="text-xs italic text-gray-600 dark:text-gray-400 mb-3">"Setiap anak Adam berbuat dosa, dan sebaik-baik orang yang berbuat dosa adalah yang bertaubat." (HR. Tirmidzi)</p>
                
                <button onclick="window.tC('cd')" class="win98-btn w-full text-left mb-2 font-bold">💔 Catat Dosa & Introspeksi [ + ]</button>
                <div id="cd" class="hidden mb-4 border-2 border-gray-400 dark:border-gray-600 p-3">
                    <div class="space-y-2 text-sm mb-3">
                        <div>
                            <label class="text-xs font-semibold">Kategori:</label>
                            <select id="d-kat" class="w-full mt-1">
                                <option value="Haqqullah (Hak Allah)">Haqqullah (Hak Allah)</option>
                                <option value="Haqqul Ibad (Hak Manusia)">Haqqul Ibad (Hak Manusia)</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-xs font-semibold">Apa yang saya lakukan?</label>
                            <input type="text" id="d-apa" placeholder="Cth: Ghibah, Menunda sholat..." class="w-full mt-1">
                        </div>
                        <div>
                            <label class="text-xs font-semibold">Kepada siapa? (Jika Haqqul Ibad wajib minta maaf)</label>
                            <input type="text" id="d-siapa" placeholder="Cth: Teman, Orang tua, Publik" class="w-full mt-1">
                        </div>
                        <div>
                            <label class="text-xs font-semibold">Akar masalah / Pemicu:</label>
                            <select id="d-pemicu" class="w-full mt-1">
                                <option value="Hawa Nafsu">Hawa Nafsu</option>
                                <option value="Emosi">Emosi</option>
                                <option value="Lupa/Lalai">Lupa/Lalai</option>
                                <option value="Lingkungan">Lingkungan</option>
                                <option value="Sombong/Riya">Sombong/Riya</option>
                            </select>
                        </div>
                    </div>
                    <button onclick="window.tambahDosa()" class="win98-btn w-full text-center font-bold">Catat & Minta Ampun</button>
                </div>

                <!-- DAFTAR DOSA -->
                ${appState.dosaList.length > 0 ? `
                <h3 class="font-bold mb-2 border-b-2 border-dotted border-gray-400 pb-1 text-sm">📜 Catatan Introspeksi</h3>
                <div class="space-y-2 max-h-60 overflow-y-auto hide-scrollbar">
                    ${appState.dosaList.slice().reverse().map((d, i) => {
                        const realIndex = appState.dosaList.length - 1 - i;
                        const isTaubat = d.taubat;
                        return `
                        <div class="win98-window text-xs ${isTaubat ? 'opacity-60' : ''}">
                            <div class="p-2">
                                <div class="flex justify-between items-start mb-1">
                                    <span class="font-bold ${isTaubat ? 'line-through text-gray-500' : 'text-red-700 dark:text-red-400'}">[${d.kategori}] ${d.apa}</span>
                                </div>
                                <p class="${isTaubat ? 'line-through text-gray-400' : ''}">➡️ Kepada: ${d.siapa}</p>
                                <p class="${isTaubat ? 'line-through text-gray-400' : ''}">🔄 Pemicu: ${d.pemicu}</p>
                                
                                ${!isTaubat ? `
                                <button onclick="window.taubatDosa(${realIndex})" class="win98-btn w-full text-center font-bold mt-2 text-xs" style="background:#008000; color:#FFF;">🙏 Bertaubat / Sudah Minta Maaf</button>
                                ` : `
                                <p class="text-green-700 dark:text-green-400 font-bold mt-1 text-center">✅ Sedang diusahakan taubat nasuha</p>
                                `}
                            </div>
                        </div>`;
                    }).join('')}
                </div>
                ` : `<p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">Belum ada catatan dosa hari ini. Jaga istiqomah ya! ✨</p>`}
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
                addPoint('infaq', 10); 
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
    if(!appState.infaqClaimedToday){addPoint('infaq',10);appState.infaqClaimedToday = true;}
    saveState();
    renderAmalJariyah(); 
};

window.dI = i => { 
    appState.infaqList.splice(i,1); 
    saveState();
    renderAmalJariyah(); 
};

window.hZM = () => {
    const hargaEmas = parseInt(document.getElementById('zm-emas').value) || 0;
    const totalHarta = parseInt(document.getElementById('zm-harta').value) || 0;
    if (!hargaEmas || !totalHarta) { alert('Isi harga emas dan total harta!'); return; }
    const nisab = 85 * hargaEmas; 
    const hasilEl = document.getElementById('zm-hasil');
    const textEl = document.getElementById('zm-hasil-text');
    let html = `<p class="text-xs mb-2">Nisab (85 gr emas): <b>Rp ${nisab.toLocaleString('id-ID')}</b></p>`;
    if (totalHarta >= nisab) {
        const zakat = totalHarta * 0.025; 
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

window.bayarZM = (jumlah) => {
    appState.infaqList.unshift({kategori: 'Zakat Mal', nominal: jumlah}); 
    if(!appState.infaqClaimedToday){addPoint('infaq',10);appState.infaqClaimedToday = true;}
    saveState();
    renderAmalJariyah();
};

// ================= LOGIC DOSA & TAUBAT =================
window.tambahDosa = () => {
    const kat = document.getElementById('d-kat').value;
    const apa = document.getElementById('d-apa').value.trim();
    const siapa = document.getElementById('d-siapa').value.trim() || '-';
    const pemicu = document.getElementById('d-pemicu').value;

    if (!apa) { alert('Isi apa dosa yang kamu lakukan!'); return; }

    appState.dosaList.push({
        kategori: kat,
        apa: apa,
        siapa: siapa,
        pemicu: pemicu,
        taubat: false
    });

    saveState();
    renderAmalJariyah(); // Re-render
};

window.taubatDosa = (index) => {
    const dosa = appState.dosaList[index];
    let msg = "Sudahkah kamu benar-benar menyesal dan bertekad tidak mengulanginya lagi?\n";
    if (dosa.kategori === 'Haqqul Ibad (Hak Manusia)') {
        msg += "\n⚠️ INI HAK MANUSIA! Pastikan kamu SUDAH MINTA MAAF langsung ke orang tersebut. Taubat tidak sah jika hak manusia belum dikembalikan/dimaafkan.";
    }

    if (confirm(msg)) {
        appState.dosaList[index].taubat = true;
        saveState();
        renderAmalJariyah(); // Re-render (Akan jadi coret & opacity rendah)
    }
};
