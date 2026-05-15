import { addPoint } from '../app.js';
let qs = [], pts = false;

export default async function renderQuran() {
    if (qs.length === 0) {
        try {
            const r = await fetch('./data/quranData.json');
            qs = await r.json();
        } catch (e) {
            console.error("Gagal memuat data Quran");
        }
    }
    
    const main = document.getElementById('main-content');
    const t = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    main.innerHTML = `
        <div class="win98-window mb-4">
            <div class="win98-titlebar">
                <span>Al_Quran.exe</span>
                <button class="win98-btn" style="padding: 0 4px; font-size: 12px; background: #C0C0C0; color: #000;">X</button>
            </div>
            <div class="p-4">
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">📅 ${t}</p>
                
                <div id="qlr" class="win98-window mb-4 hidden">
                    <div class="win98-titlebar" style="background: #008000;">
                        <span>📖 Last_Read.sys</span>
                    </div>
                    <div class="p-4 text-center">
                        <p class="text-sm">Terakhir dibaca</p>
                        <h3 class="text-2xl font-bold mt-1" id="ls">-</h3>
                        <p class="text-lg" id="la">Ayat ke-</p>
                    </div>
                </div>

                <h3 class="font-bold mb-2">Update Posisi (+13 Poin)</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Masukkan nomor surat & ayat</p>
                
                <div class="flex gap-2 mb-2">
                    <input type="number" id="is" placeholder="No. Surat" class="w-1/2" min="1">
                    <input type="number" id="ia" placeholder="No. Ayat" class="w-1/2" min="1">
                </div>
                <p id="qe" class="text-red-700 dark:text-red-400 text-sm mb-2 hidden"></p>
                <button onclick="window.saveQ()" class="win98-btn w-full text-center font-bold">Simpan Posisi</button>
            </div>
        </div>
    `;
}

window.saveQ = function() {
    const si = document.getElementById('is').value, ai = document.getElementById('ia').value, ee = document.getElementById('qe');
    if (!si || !ai) { ee.textContent = 'Wajib diisi!'; ee.classList.remove('hidden'); return; }
    
    const f = qs.find(s => s.id === parseInt(si)), an = parseInt(ai);
    if (!f) { ee.textContent = 'Surat tidak valid!'; ee.classList.remove('hidden'); return; }
    if (isNaN(an) || an <= 0 || an > f.totalAyahs) { ee.textContent = `Maks ${f.totalAyahs} ayat!`; ee.classList.remove('hidden'); return; }
    
    ee.classList.add('hidden');
    document.getElementById('ls').textContent = f.name;
    document.getElementById('la').textContent = `Ayat ke-${an}`;
    document.getElementById('qlr').classList.remove('hidden');
    
    if (!pts) { addPoint('quran', 13); pts = true; }
};
