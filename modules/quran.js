import { appState, saveState, addPoint } from '../app.js';
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
    
    // Ambil data tersimpan
    const lastRead = appState.quranLastRead;
    
    main.innerHTML = `
        <div class="win98-window mb-4">
            <div class="win98-titlebar">
                <span>Al_Quran.exe</span>
                <button class="win98-btn" style="padding: 0 4px; font-size: 12px; background: #C0C0C0; color: #000;">X</button>
            </div>
            <div class="p-4">
                <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">📅 ${t}</p>
                
                <!-- KARTU TADARUS (Data Tersimpan) -->
                <div class="win98-window mb-4">
                    <div class="win98-titlebar" style="background: ${lastRead.surahName ? '#008000' : '#404040'};">
                        <span>📖 Kartu_Tadarus.sys</span>
                    </div>
                    <div class="p-4 text-center">
                        ${lastRead.surahName ? `
                            <p class="text-sm">Posisi Terakhir</p>
                            <h3 class="text-2xl font-bold mt-1">${lastRead.surahName}</h3>
                            <p class="text-lg">Ayat ke-${lastRead.ayah}</p>
                        ` : `
                            <p class="text-sm text-gray-500 dark:text-gray-400">Belum ada catatan tadarus.</p>
                            <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">Gunakan form di bawah untuk menyimpan posisi bacaan.</p>
                        `}
                    </div>
                </div>

                <!-- FORM INPUT -->
                <h3 class="font-bold mb-2">Update Posisi (+13 Poin)</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Pilih nama surat dan masukkan nomor ayat</p>
                
                <div class="mb-3">
                    <label class="text-xs font-bold">Nama Surat:</label>
                    <select id="is" class="w-full mt-1">
                        <option value="">-- Pilih Surat --</option>
                        ${qs.map(s => `<option value="${s.id}" ${lastRead.surahName === s.name ? 'selected' : ''}>${s.name}</option>`).join('')}
                    </select>
                </div>
                
                <div class="mb-3">
                    <label class="text-xs font-bold">Nomor Ayat:</label>
                    <input type="number" id="ia" placeholder="Contoh: 1" class="w-full mt-1" min="1" value="${lastRead.ayah || ''}">
                </div>

                <p id="qe" class="text-red-700 dark:text-red-400 text-sm mb-2 hidden"></p>
                <button onclick="window.saveQ()" class="win98-btn w-full text-center font-bold">Simpan Posisi</button>
            </div>
        </div>
    `;
}

window.saveQ = function() {
    const si = document.getElementById('is').value, ai = document.getElementById('ia').value, ee = document.getElementById('qe');
    if (!si || !ai) { ee.textContent = 'Surat dan Ayat wajib diisi!'; ee.classList.remove('hidden'); return; }
    
    const f = qs.find(s => s.id === parseInt(si)), an = parseInt(ai);
    if (!f) { ee.textContent = 'Surat tidak valid!'; ee.classList.remove('hidden'); return; }
    if (isNaN(an) || an <= 0 || an > f.totalAyahs) { ee.textContent = `Ayat tidak valid! ${f.name} maks ${f.totalAyahs} ayat.`; ee.classList.remove('hidden'); return; }
    
    ee.classList.add('hidden');
    
    // Update state & simpan ke local storage
    appState.quranLastRead = { surahName: f.name, ayah: an };
    saveState();

    // Kasih poin (hanya sekali per buka halaman)
    if (!pts) { addPoint('quran', 13); pts = true; }
    
    // Re-render halaman biar Kartu Tadarus langsung update
    renderQuran();
};
