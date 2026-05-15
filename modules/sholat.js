let quranSurahs = [];

// Fetch data dari file JSON kita
export async function initQuran() {
    const response = await fetch('./data/quranData.json');
    quranSurahs = await response.json();
    renderQuran();
}

function renderQuran() {
    const container = document.getElementById('page-quran');
    container.innerHTML = `
        <h2 class="text-xl font-bold mb-4 text-sky-700">Tracker Quran</h2>
        <div id="quran-lastread" class="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl p-6 mb-6 shadow-lg text-center hidden">
            <p class="text-sm opacity-80">Terakhir dibaca</p>
            <h3 class="text-2xl font-bold mt-1" id="last-surat">-</h3>
            <p class="text-lg" id="last-ayat">Ayat ke-</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4">
            <h3 class="font-semibold mb-3">Update Posisi Baca</h3>
            <p class="text-xs text-gray-500 mb-4">Masukkan nomor surat (1-114) dan ayat</p>
            <div class="flex gap-2 mb-2">
                <input type="number" id="input-surat" placeholder="No. Surat" class="border rounded p-2 w-1/2" min="1" max="114">
                <input type="number" id="input-ayat" placeholder="No. Ayat" class="border rounded p-2 w-1/2" min="1">
            </div>
            <p id="quran-error" class="text-red-500 text-xs mb-2 hidden"></p>
            <button onclick="window.saveQuran()" class="w-full bg-sky-600 text-white py-2 rounded-lg active:bg-sky-700 mt-2 font-semibold">Simpan Posisi</button>
        </div>
    `;
}

window.saveQuran = function() {
    const suratInput = document.getElementById('input-surat').value;
    const ayatInput = document.getElementById('input-ayat').value;
    const errorEl = document.getElementById('quran-error');

    if(!suratInput || !ayatInput) {
        errorEl.textContent = 'Surat dan Ayat wajib diisi!';
        errorEl.classList.remove('hidden');
        return;
    }

    const surahId = parseInt(suratInput);
    const ayahNum = parseInt(ayatInput);
    const foundSurah = quranSurahs.find(s => s.id === surahId);

    if (!foundSurah) {
        errorEl.textContent = 'ID Surat tidak valid!';
        errorEl.classList.remove('hidden');
        return;
    }
    if (isNaN(ayahNum) || ayahNum <= 0 || ayahNum > foundSurah.totalAyahs) {
        errorEl.textContent = `Ayat tidak valid! ${foundSurah.name} hanya punya ${foundSurah.totalAyahs} ayat.`;
        errorEl.classList.remove('hidden');
        return;
    }

    errorEl.classList.add('hidden');
    document.getElementById('last-surat').textContent = foundSurah.name;
    document.getElementById('last-ayat').textContent = `Ayat ke-${ayahNum}`;
    document.getElementById('quran-lastread').classList.remove('hidden');
    document.getElementById('input-surat').value = '';
    document.getElementById('input-ayat').value = '';
};
