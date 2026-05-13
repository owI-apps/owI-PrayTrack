import { addPoint } from '../app.js';

export default function renderAmalJariyah() {
    const main = document.getElementById('main-content');
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    // State Sementara
    let infaqList = [];
    let wakafList = [];
    let fitrahPaid = false;
    let malPaid = false;
    let alreadyGotPoints = false;

    const renderPage = () => {
        const totalInfaq = infaqList.reduce((sum, item) => sum + item.nominal, 0);
        const totalWakaf = wakafList.reduce((sum, item) => sum + item.nominal, 0);

        main.innerHTML = `
            <p class="text-sm text-gray-500 mb-2">📅 ${today}</p>
            <h2 class="text-xl font-bold mb-1 text-gray-800">Amal Jariyah</h2>
            <p class="text-xs text-gray-500 mb-4 italic">"Sedekah tidak akan mengurangi harta." (HR. Muslim)</p>

            <!-- KARTU 1: INFAQ & SEDEKAH -->
            <div class="bg-white rounded-xl shadow mb-4 overflow-hidden">
                <button onclick="window.toggleCard('card-infaq')" class="w-full p-4 flex justify-between items-center bg-green-50 border-l-4 border-green-500">
                    <div class="flex items-center gap-2">
                        <i data-lucide="hand-heart" class="w-5 h-5 text-green-600"></i>
                        <span class="font-bold text-green-800">Infaq & Sedekah</span>
                    </div>
                    <i data-lucide="chevron-down" class="w-5 h-5 text-green-600"></i>
                </button>
                <div id="card-infaq" class="hidden p-4">
                    <!-- Sedekah Amal (Non-Materi) -->
                    <div class="mb-4 border-b pb-3">
                        <h4 class="font-semibold text-sm text-gray-700 mb-2">Sadaqah Amal (Non-Harta) +5 Poin</h4>
                        <div class="space-y-2 text-sm">
                            <label class="flex items-center gap-2"><input type="checkbox" class="w-4 h-4 accent-green-600 sadaqah-check"> Senyum kepada saudara</label>
                            <label class="flex items-center gap-2"><input type="checkbox" class="w-4 h-4 accent-green-600 sadaqah-check"> Menyingkirkan gangguan di jalan</label>
                            <label class="flex items-center gap-2"><input type="checkbox" class="w-4 h-4 accent-green-600 sadaqah-check"> Membantu sesama</label>
                        </div>
                    </div>

                    <!-- Infaq Harta -->
                    <h4 class="font-semibold text-sm text-gray-700 mb-2">Catat Infaq Harta (+10 Poin)</h4>
                    <div class="flex gap-2 mb-2">
                        <select id="infaq-kategori" class="border rounded p-1 text-sm w-1/3">
                            <option>Masjid</option><option>Yatim</option><option>Dhuafa</option><option>Lainnya</option>
                        </select>
                        <div class="relative w-2/3">
                            <span class="absolute left-2 top-1.5 text-gray-500 text-sm">Rp</span>
                            <input type="number" id="input-infaq" placeholder="0" class="border rounded p-1 pl-8 w-full text-sm" min="0">
                        </div>
                    </div>
                    <button onclick="window.tambahInfaq()" class="w-full bg-green-600 text-white py-1.5 rounded-lg text-sm font-semibold active:bg-green-700">Tambah Infaq</button>
                    
                    ${infaqList.length > 0 ? `<div class="mt-3 max-h-32 overflow-y-auto space-y-1 text-sm">
                        ${infaqList.map((item, i) => `
                            <div class="flex justify-between items-center text-gray-600">
                                <span><span class="text-xs bg-gray-100 px-1 rounded">${item.kat}</span> Rp ${item.nominal.toLocaleString('id-ID')}</span>
                                <button onclick="window.hapusInfaq(${i})" class="text-red-400 text-xs">Hapus</button>
                            </div>
                        `).join('')}
                    </div>` : ''}
                    <div class="mt-2 pt-2 border-t font-bold text-sm text-right text-green-700">Total Infaq: Rp ${totalInfaq.toLocaleString('id-ID')}</div>
                </div>
            </div>

            <!-- KARTU 2: WAKAF -->
            <div class="bg-white rounded-xl shadow mb-4 overflow-hidden">
                <button onclick="window.toggleCard('card-wakaf')" class="w-full p-4 flex justify-between items-center bg-purple-50 border-l-4 border-purple-500">
                    <div class="flex items-center gap-2">
                        <i data-lucide="landmark" class="w-5 h-5 text-purple-600"></i>
                        <span class="font-bold text-purple-800">Wakaf</span>
                    </div>
                    <i data-lucide="chevron-down" class="w-5 h-5 text-purple-600"></i>
                </button>
                <div id="card-wakaf" class="hidden p-4">
                    <div class="mb-3">
                        <label class="text-sm font-semibold">Jenis Wakaf:</label>
                        <select id="wakaf-jenis" class="border rounded p-1 w-full text-sm mt-1">
                            <option value="Uang">Uang / Finansial</option>
                            <option value="Benda">Benda / Aset (Tanah, Mushaf, dll)</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="text-sm font-semibold">Keterangan / Nominal (Rp):</label>
                        <input type="text" id="input-wakaf" placeholder="Contoh: 1 Juta atau 5 Mushaf Al-Quran" class="border rounded p-1 w-full text-sm mt-1">
                    </div>
                    <button onclick="window.tambahWakaf()" class="w-full bg-purple-600 text-white py-1.5 rounded-lg text-sm font-semibold active:bg-purple-700">Catat Wakaf</button>
                    
                    ${wakafList.length > 0 ? `<div class="mt-3 space-y-1 text-sm">
                        ${wakafList.map((item, i) => `
                            <div class="flex justify-between items-center text-gray-600">
                                <span><span class="text-xs bg-gray-100 px-1 rounded">${item.jenis}</span> ${item.ket}</span>
                                <button onclick="window.hapusWakaf(${i})" class="text-red-400 text-xs">Hapus</button>
                            </div>
                        `).join('')}
                    </div>` : ''}
                </div>
            </div>

            <!-- KARTU 3: ZAKAT FITRAH -->
            <div class="bg-white rounded-xl shadow mb-4 overflow-hidden">
                <button onclick="window.toggleCard('card-fitrah')" class="w-full p-4 flex justify-between items-center bg-sky-50 border-l-4 border-sky-500">
                    <div class="flex items-center gap-2">
                        <i data-lucide="wheat" class="w-5 h-5 text-sky-600"></i>
                        <span class="font-bold text-sky-800">Zakat Fitrah</span>
                        <span class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-1">WAJIB</span>
                    </div>
                    <i data-lucide="chevron-down" class="w-5 h-5 text-sky-600"></i>
                </button>
                <div id="card-fitrah" class="hidden p-4 text-sm">
                    <p class="text-gray-600 mb-3">Wajib dibayarkan setiap bulan Ramadhan oleh setiap jiwa (setara 2,5 kg bahan makanan pokok / setara uang).</p>
                    <label class="flex items-center gap-2 font-semibold cursor-pointer">
                        <input type="checkbox" id="check-fitrah" class="w-5 h-5 accent-sky-600" ${fitrahPaid ? 'checked' : ''} onchange="window.toggleFitrah()">
                        Sudah Membayar Zakat Fitrah Tahun Ini
                    </label>
                </div>
            </div>

            <!-- KARTU 4: ZAKAT MAL -->
            <div class="bg-white rounded-xl shadow mb-4 overflow-hidden">
                <button onclick="window.toggleCard('card-mal')" class="w-full p-4 flex justify-between items-center bg-orange-50 border-l-4 border-orange-500">
                    <div class="flex items-center gap-2">
                        <i data-lucide="coins" class="w-5 h-5 text-orange-600"></i>
                        <span class="font-bold text-orange-800">Zakat Mal (Harta)</span>
                        <span class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-1">WAJIB</span>
                    </div>
                    <i data-lucide="chevron-down" class="w-5 h-5 text-orange-600"></i>
                </button>
                <div id="card-mal" class="hidden p-4 text-sm">
                    <p class="text-gray-600 mb-3">Wajib dikeluarkan 2,5% jika hartanya sudah mencapai <strong>Nisab (85gr Emas)</strong> dan dimiliki selama 1 tahun (Haul).</p>
                    
                    <div class="space-y-2 mb-3">
                        <div>
                            <label class="text-xs font-semibold">1. Harga Emas 1 Gram saat ini (Rp)</label>
                            <input type="number" id="mal-emas" placeholder="Contoh: 1.100.000" class="border rounded p-1 w-full text-sm">
                        </div>
                        <div>
                            <label class="text-xs font-semibold">2. Total Harta (Tabungan, Gaji, dll) (Rp)</label>
                            <input type="number" id="mal-harta" placeholder="0" class="border rounded p-1 w-full text-sm">
                        </div>
                        <div>
                            <label class="text-xs font-semibold">3. Total Hutang (Rp)</label>
                            <input type="number" id="mal-hutang" placeholder="0" class="border rounded p-1 w-full text-sm">
                        </div>
                    </div>
                    
                    <button onclick="window.hitungZakatMal()" class="w-full bg-orange-500 text-white py-1.5 rounded-lg text-sm font-semibold active:bg-orange-600">Hitung Zakat Mal</button>
                    
                    <div id="mal-result" class="hidden mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p id="mal-result-text" class="font-semibold text-gray-800"></p>
                    </div>

                    <label class="flex items-center gap-2 font-semibold cursor-pointer mt-3">
                        <input type="checkbox" id="check-mal" class="w-5 h-5 accent-sky-600" ${malPaid ? 'checked' : ''} onchange="window.toggleMal()">
                        Sudah Membayar Zakat Mal Tahun Ini
                    </label>
                </div>
            </div>
        `;
        lucide.createIcons();
    }

    // FUNGSI BUKA/TUTUP KARTU
    window.toggleCard = (id) => {
        const el = document.getElementById(id);
        if(el) el.classList.toggle('hidden');
    }

    // INFAQ
    window.tambahInfaq = () => {
        const kat = document.getElementById('infaq-kategori').value;
        const nominal = parseInt(document.getElementById('input-infaq').value);
        if (!nominal || nominal <= 0) { alert('Masukkan nominal!'); return; }
        infaqList.unshift({ kat, nominal });
        if(!alreadyGotPoints) { addPoint('infaq', 10); alreadyGotPoints = true; }
        renderPage();
    }

    window.hapusInfaq = (index) => { infaqList.splice(index, 1); renderPage(); }

    // SEDekah non-harta poin
    document.querySelectorAll('.sadaqah-check').forEach(cb => {
        cb.addEventListener('change', (e) => {
            if(e.target.checked && !alreadyGotPoints) { addPoint('infaq', 5); alreadyGotPoints = true; }
        });
    });

    // WAKAF
    window.tambahWakaf = () => {
        const jenis = document.getElementById('wakaf-jenis').value;
        const ket = document.getElementById('input-wakaf').value;
        if (!ket) { alert('Isi keterangan wakaf!'); return; }
        const nominal = jenis === 'Uang' ? parseInt(ket.replace(/\D/g, '')) || 0 : 0;
        wakafList.unshift({ jenis, ket, nominal });
        renderPage();
    }
    window.hapusWakaf = (index) => { wakafList.splice(index, 1); renderPage(); }

    // ZAKAT FITRAH
    window.toggleFitrah = () => { fitrahPaid = document.getElementById('check-fitrah').checked; }

    // ZAKAT MAL (FIQH ACCURATE)
    window.hitungZakatMal = () => {
        const hargaEmas = parseInt(document.getElementById('mal-emas').value) || 0;
        const totalHarta = parseInt(document.getElementById('mal-harta').value) || 0;
        const totalHutang = parseInt(document.getElementById('mal-hutang').value) || 0;

        if(hargaEmas === 0) { alert('Masukkan harga emas per gram!'); return; }

        const nisab = 85 * hargaEmas; // Nisab zakat mal = 85gr emas
        const netHarta = totalHarta - totalHutang;

        const resultEl = document.getElementById('mal-result');
        const resultText = document.getElementById('mal-result-text');

        if (netHarta <= 0) {
            resultText.innerHTML = `<span class="text-red-600">Harta neto Anda minus atau nol. Tidak wajib zakat.</span>`;
        } else if (netHarta >= nisab) {
            const zakat = 0.025 * netHarta;
            resultText.innerHTML = `✅ Harta Anda mencapai Nisab (Rp ${nisab.toLocaleString('id-ID')}).<br><br><span class="text-orange-700 text-base">Zakat yang WAJIB dikeluarkan:<br><strong>Rp ${Math.round(zakat).toLocaleString('id-ID')}</strong></span> <span class="text-xs font-normal text-gray-600">(2.5% dari Rp ${netHarta.toLocaleString('id-ID')})</span>`;
        } else {
            resultText.innerHTML = `❌ Harta neto Anda (Rp ${netHarta.toLocaleString('id-ID')}) belum mencapai Nisab (Rp ${nisab.toLocaleString('id-ID')}). Anda belum wajib zakat mal.`;
        }

        resultEl.classList.remove('hidden');
    }

    window.toggleMal = () => { malPaid = document.getElementById('check-mal').checked; }

    renderPage();
}