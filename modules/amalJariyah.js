import { addPoint } from '../app.js';
let iL=[], pts=false;

export default function renderAmalJariyah() {
    const main = document.getElementById('main-content');
    const t = new Date().toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'}), tI=iL.reduce((s,i)=>s+i.nominal,0);
    
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
                    ${iL.length>0?`<div class="mt-3 text-sm max-h-24 overflow-y-auto">${iL.map((x,i)=>`<div class="flex justify-between"><span>${x.k} Rp ${x.n.toLocaleString('id-ID')}</span><button onclick="window.dI(${i})" class="text-red-700 dark:text-red-400">Hapus</button></div>`).join('')}</div>`:''}
                    <div class="mt-2 pt-2 border-t-2 border-dotted border-gray-400 font-bold text-right">Total: Rp ${tI.toLocaleString('id-ID')}</div>
                </div>

                <!-- WAKAF -->
                <button onclick="window.tC('cw')" class="win98-btn w-full text-left mb-2 font-bold">🏠 Wakaf [ + ]</button>
                <div id="cw" class="hidden mb-4 border-2 border-gray-400 dark:border-gray-600 p-3">
                    <div class="mb-3"><label class="text-sm font-semibold">Jenis:</label><select id="wj" class="w-full mt-1"><option value="Uang">Uang</option><option value="Benda">Benda</option></select></div>
                    <div class="mb-3"><label class="text-sm font-semibold">Keterangan:</label><input type="text" id="wi" placeholder="Contoh: 1 Juta" class="w-full mt-1"></div>
                    <button onclick="window.aW()" class="win98-btn w-full text-center font-bold">Catat</button>
                </div>

                <!-- ZAKAT -->
                <button onclick="window.tC('cz')" class="win98-btn w-full text-left mb-2 font-bold">⚖️ Zakat [ + ]</button>
                <div id="cz" class="hidden mb-4 border-2 border-gray-400 dark:border-gray-600 p-3 text-sm">
                    <p class="mb-3 text-gray-600 dark:text-gray-400">Zakat Fitrah & Mal wajib dikeluarkan bagi yang mampu. Hitung sesuai ketentuan.</p>
                    <p class="font-bold">Nisab Zakat Mal: Setara 85gr Emas</p>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.sc').forEach(cb => cb.addEventListener('change', e => { if(e.target.checked && !pts){ addPoint('infaq',5); pts=true; } }));
}

window.tC = id => { document.getElementById(id).classList.toggle('hidden'); };
window.aI = () => { const k=document.getElementById('ik').value,n=parseInt(document.getElementById('ii').value); if(!n||n<=0){alert('Isi nominal!');return;} iL.unshift({k,n}); if(!pts){addPoint('infaq',10);pts=true;} renderAmalJariyah(); };
window.dI = i => { iL.splice(i,1); renderAmalJariyah(); };
window.aW = () => { const j=document.getElementById('wj').value,k=document.getElementById('wi').value; if(!k){alert('Isi keterangan!');return;} alert(`Wakaf ${j}: ${k} dicatat!`); }; // Sementara pakai alert
