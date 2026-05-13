import { addPoint } from '../app.js';
let riwayatInfaq = [];
let alreadyGotPoints = false;

export default function renderInvestasi() {
    const main = document.getElementById('main-content');
    const totalInfaq = riwayatInfaq.reduce((sum, item) => sum + item.nominal, 0);

    main.innerHTML = `
        <h2 class="text-xl font-bold mb-4 text-gray-800">Investasi Akhirat</h2>
        
        <div class="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl p-6 mb-6 shadow-lg text-center">
            <p class="text-sm opacity-80">Total Infaq / Shodaqoh</p>
            <h3 class="text-3xl font-bold mt-1">Rp ${totalInfaq.toLocaleString('id-ID')}</h3>
        </div>

        <div class="bg-white rounded-xl shadow p-4 mb-4">
            <h3 class="font-semibold mb-3">Catat Infaq Baru (+10 Poin)</h3>
            <div class="flex gap-2">
                <div class="relative w-2/3">
                    <span class="absolute left-3 top-2.5 text-gray-500">Rp</span>
                    <input type="number" id="input-nominal" placeholder="0" class="border rounded p-2 pl-10 w-full" min="0">
                </div>
                <button onclick="window.tambahInfaq()" class="w-1/3 bg-purple-600 text-white py-2 rounded-lg active:bg-purple-700 font-semibold">Tambah</button>
            </div>
        </div>

        <h3 class="font-semibold text-gray-600 mb-2">Riwayat</h3>
        ${riwayatInfaq.length === 0 ? '<p class="text-sm text-gray-400 text-center py-4">Belum ada catatan</p>' : ''}
        <div class="space-y-2">
            ${riwayatInfaq.map((item, index) => `
                <div class="bg-white rounded-xl shadow p-3 flex justify-between items-center">
                    <div>
                        <p class="font-semibold text-purple-700">Rp ${item.nominal.toLocaleString('id-ID')}</p>
                        <p class="text-xs text-gray-500">${item.tanggal}</p>
                    </div>
                    <button onclick="window.hapusInfaq(${index})" class="text-red-400 active:text-red-600"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
            `).join('')}
        </div>
    `;
    lucide.createIcons();
}

window.tambahInfaq = () => {
    const input = document.getElementById('input-nominal');
    const nominal = parseInt(input.value);
    if (!nominal || nominal <= 0) { alert('Masukkan nominal valid!'); return; }

    const tanggal = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    riwayatInfaq.unshift({ nominal, tanggal });
    
    if(!alreadyGotPoints) {
        addPoint('infaq', 10);
        alreadyGotPoints = true;
    }
    renderInvestasi();
}

window.hapusInfaq = (index) => {
    riwayatInfaq.splice(index, 1);
    renderInvestasi();
}