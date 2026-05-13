import { addPoint } from '../app.js';
let quranSurahs = [];
let alreadyGotPoints = false;

export default async function renderQuran() {
    if(quranSurahs.length === 0) {
        const response = await fetch('./data/quranData.json');
        quranSurahs = await response.json();
    }

    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const main = document.getElementById('main-content');
    
    main.innerHTML = `
        <p class="text-sm text-gray-500 mb-4">📅 ${today}</p>
        <h2 class="text-xl font-bold mb-4 text-gray-800">Baca Al-Quran</h2>
        
        <div id="quran-lastread" class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-6 mb-6 shadow-lg text-center hidden">
            <p class="text-sm opacity-80">Terakhir dibaca</p>
            <h3 class="text-2xl font-bold mt-1" id="last-surat">-</h3>
            <p class="text-lg" id="last-ayat">Ayat ke-</p>
        </div>

        <div class="bg-white rounded-xl shadow p-4">
            <h3 class="font-semibold mb-3">Update Posisi Baca (+13 Poin)</h3>
            <p class="text-xs text-gray-500 mb-4">Masukkan nomor surat dan ayat</p>
            <div class="flex gap-2 mb-2">
                <input type="number" id="input-surat" placeholder="No. Surat" class="border rounded p-2 w-1/2" min="1" max="114">
                <input type="number" id="input-ayat" placeholder="No. Ayat" class="border rounded p-2 w-1/2" min="1">
            </div>
            <p id="quran-error" class="text-red-500 text-xs mb-2 hidden"></p>
            <button onclick="window.saveQuran()" class="w-full bg-emerald-600 text-white py-2 rounded-lg active:bg-emerald-700 mt-2 font-semibold">Simpan Posisi</button>
        </div>
    `;
}

window.saveQuran = function() {
    const suratInput = document.getElementById('input-surat').value;
    const ayatInput = document.getElementById('input-ayat').value;
    const errorEl = document.getElementById('quran-error');

    if(!suratInput || !ayatInput) { errorEl.textContent = 'Wajib diisi!'; errorEl.classList.remove('hidden'); return; }

    const foundSurah = quranSurahs.find(s => s.id === parseInt(suratInput));
    const ayahNum = parseInt(ayatInput);

    if (!foundSurah) { errorEl.textContent = 'ID Surat tidak valid!'; errorEl.classList.remove('hidden'); return; }
    if (isNaN(ayahNum) || ayahNum <= 0 || ayahNum > foundSurah.totalAyahs) {
        errorEl.textContent = `Ayat tidak valid! ${foundSurah.name} maks ${foundSurah.totalAyahs} ayat.`;
        errorEl.classList.remove('hidden'); return;
    }

    errorEl.classList.add('hidden');
    document.getElementById('last-surat').textContent = foundSurah.name;
    document.getElementById('last-ayat').textContent = `Ayat ke-${ayahNum}`;
    document.getElementById('quran-lastread').classList.remove('hidden');
    
    if(!alreadyGotPoints) {
        addPoint('quran', 13);
        alreadyGotPoints = true;
    }
};