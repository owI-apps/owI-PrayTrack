let utangSholat = [];
let utangPuasa = [];

export default function renderUtang() {
    const main = document.getElementById('main-content');
    
    const renderList = () => {
        main.innerHTML = `
            <h2 class="text-xl font-bold mb-4 text-gray-800">Utang Ibadah</h2>
            
            <div class="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                <h3 class="font-bold text-orange-700 mb-2 flex items-center gap-2"><i data-lucide="calculator" class="w-5 h-5"></i> Kalkulator Utang Lupa</h3>
                <p class="text-xs text-gray-600 mb-3">Estimasi utang karena lupa sejak baligh.</p>
                
                <div class="grid grid-cols-2 gap-2 mb-3">
                    <div>
                        <label class="text-xs font-semibold">Umur Baligh</label>
                        <input type="number" id="calc-baligh" value="14" class="border rounded p-1 w-full text-sm">
                    </div>
                    <div>
                        <label class="text-xs font-semibold">Umur Sekarang</label>
                        <input type="number" id="calc-sekarang" value="30" class="border rounded p-1 w-full text-sm">
                    </div>
                </div>

                <p class="text-xs font-semibold mb-1">Estimasi Bolos per Bulan (0-30 hari):</p>
                <div class="space-y-1 text-sm mb-3">
                    <label class="flex items-center justify-between">Subuh <input type="number" id="calc-subuh" value="15" min="0" max="30" class="border rounded p-1 w-16 text-right"></label>
                    <label class="flex items-center justify-between">Dzuhur <input type="number" id="calc-dzuhur" value="5" min="0" max="30" class="border rounded p-1 w-16 text-right"></label>
                    <label class="flex items-center justify-between">Ashar <input type="number" id="calc-ashar" value="20" min="0" max="30" class="border rounded p-1 w-16 text-right"></label>
                    <label class="flex items-center justify-between">Maghrib <input type="number" id="calc-maghrib" value="5" min="0" max="30" class="border rounded p-1 w-16 text-right"></label>
                    <label class="flex items-center justify-between">Isya <input type="number" id="calc-isya" value="25" min="0" max="30" class="border rounded p-1 w-16 text-right"></label>
                </div>

                <button onclick="window.hitungLupa()" class="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold text-sm">Hitung & Masukkan Utang</button>
            </div>

            <h3 class="font-semibold text-gray-600 mb-2 mt-4">Utang Sholat</h3>
            ${utangSholat.map((u, i) => `
                <div class="bg-white rounded-xl shadow p-4 mb-3">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-semibold text-gray-800">${u.sholat}</h4>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-600">${u.lunas} / ${u.total}</span>
                            <button onclick="window.editUtangSholat(${i})" class="text-gray-400 hover:text-blue-500"><i data-lucide="pencil" class="w-4 h-4"></i></button>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                        <div class="bg-orange-500 h-2.5 rounded-full" style="width: ${(u.lunas/u.total)*100}%"></div>
                    </div>
                    <button onclick="window.lunasiSholat(${i})" class="w-full bg-orange-500 text-white py-2 rounded-lg active:bg-orange-600 text-sm font-semibold">Lunasi 1</button>
                </div>
            `).join('')}

            <h3 class="font-semibold text-gray-600 mb-2 mt-4">Utang Puasa</h3>
            ${utangPuasa.map((u, i) => `
                <div class="bg-white rounded-xl shadow p-4 mb-3">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-semibold text-gray-800">${u.keterangan}</h4>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-600">${u.lunas} / ${u.total} Hari</span>
                            <button onclick="window.editUtangPuasa(${i})" class="text-gray-400 hover:text-blue-500"><i data-lucide="pencil" class="w-4 h-4"></i></button>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                        <div class="bg-orange-500 h-2.5 rounded-full" style="width: ${(u.lunas/u.total)*100}%"></div>
                    </div>
                    <button onclick="window.lunasiPuasa(${i})" class="w-full bg-orange-500 text-white py-2 rounded-lg active:bg-orange-600 text-sm font-semibold">Lunasi 1 Hari</button>
                </div>
            `).join('')}
        `;
        lucide.createIcons();
    }

    // KALKULATOR LUPA LOGIC
    window.hitungLupa = () => {
        const baligh = parseInt(document.getElementById('calc-baligh').value);
        const sekarang = parseInt(document.getElementById('calc-sekarang').value);
        if(sekarang <= baligh) { alert('Umur sekarang harus lebih tua dari umur baligh!'); return; }

        const totalBulan = (sekarang - baligh) * 12;
        
        const bolos = {
            'Subuh': parseInt(document.getElementById('calc-subuh').value) || 0,
            'Dzuhur': parseInt(document.getElementById('calc-dzuhur').value) || 0,
            'Ashar': parseInt(document.getElementById('calc-ashar').value) || 0,
            'Maghrib': parseInt(document.getElementById('calc-maghrib').value) || 0,
            'Isya': parseInt(document.getElementById('calc-isya').value) || 0
        };

        // Tambahkan ke utangSholat
        Object.keys(bolos).forEach(sholat => {
            if(bolos[sholat] > 0) {
                const totalUtang = totalBulan * bolos[sholat];
                // Cek kalau utang sholat itu udah ada, tambahin aja
                const existing = utangSholat.find(u => u.sholat === sholat);
                if(existing) {
                    existing.total += totalUtang;
                } else {
                    utangSholat.push({ sholat: sholat, total: totalUtang, lunas: 0 });
                }
            }
        });

        renderList();
    }

    // EDIT UTANG LOGIC
    window.editUtangSholat = (index) => {
        const newTotal = prompt(`Edit total utang ${utangSholat[index].sholat}:`, utangSholat[index].total);
        if (newTotal !== null && !isNaN(parseInt(newTotal))) {
            utangSholat[index].total = parseInt(newTotal);
            if(utangSholat[index].lunas > utangSholat[index].total) utangSholat[index].lunas = utangSholat[index].total;
            renderList();
        }
    }

    window.editUtangPuasa = (index) => {
        const newTotal = prompt(`Edit total utang ${utangPuasa[index].keterangan} (dalam hari):`, utangPuasa[index].total);
        if (newTotal !== null && !isNaN(parseInt(newTotal))) {
            utangPuasa[index].total = parseInt(newTotal);
            if(utangPuasa[index].lunas > utangPuasa[index].total) utangPuasa[index].lunas = utangPuasa[index].total;
            renderList();
        }
    }

    window.lunasiSholat = (index) => {
        if (utangSholat[index].lunas < utangSholat[index].total) { utangSholat[index].lunas += 1; renderList(); }
    }

    window.lunasiPuasa = (index) => {
        if (utangPuasa[index].lunas < utangPuasa[index].total) { utangPuasa[index].lunas += 1; renderList(); }
    }

    // Inisialisasi awal
    if(utangSholat.length === 0 && utangPuasa.length === 0) {
        utangSholat = [{ sholat: 'Dzuhur', total: 30, lunas: 0 }];
        utangPuasa = [{ keterangan: 'Puasa Ramadhan', total: 5, lunas: 0 }];
    }
    
    renderList();
}