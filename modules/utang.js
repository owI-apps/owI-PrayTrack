let utangSholat = [
    { id: 1, sholat: 'Dzuhur', total: 30, lunas: 0 },
    { id: 2, sholat: 'Ashar', total: 15, lunas: 0 }
];

let utangPuasa = [
    { id: 1, keterangan: 'Puasa Ramadhan 2020', total: 5, lunas: 0 }
];

export default function renderUtang() {
    const main = document.getElementById('main-content');
    
    const renderList = () => {
        main.innerHTML = `
            <button onclick="window.goHome()" class="flex items-center text-sky-600 mb-4 font-semibold"><i data-lucide="arrow-left" class="w-5 h-5 mr-1"></i> Kembali</button>
            <h2 class="text-xl font-bold mb-4 text-gray-800">Utang Ibadah</h2>
            
            <h3 class="font-semibold text-gray-600 mb-2 mt-2">Utang Sholat</h3>
            ${utangSholat.map(u => `
                <div class="bg-white rounded-xl shadow p-4 mb-3">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-semibold">${u.sholat}</h4>
                        <span class="text-sm text-gray-600">${u.lunas} / ${u.total}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                        <div class="bg-orange-500 h-2.5 rounded-full" style="width: ${(u.lunas/u.total)*100}%"></div>
                    </div>
                    <button onclick="window.lunasiSholat(${u.id})" class="w-full bg-orange-500 text-white py-2 rounded-lg active:bg-orange-600 text-sm font-semibold">Lunasi 1</button>
                </div>
            `).join('')}

            <h3 class="font-semibold text-gray-600 mb-2 mt-4">Utang Puasa</h3>
            ${utangPuasa.map(u => `
                <div class="bg-white rounded-xl shadow p-4 mb-3">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-semibold">${u.keterangan}</h4>
                        <span class="text-sm text-gray-600">${u.lunas} / ${u.total} Hari</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                        <div class="bg-orange-500 h-2.5 rounded-full" style="width: ${(u.lunas/u.total)*100}%"></div>
                    </div>
                    <button onclick="window.lunasiPuasa(${u.id})" class="w-full bg-orange-500 text-white py-2 rounded-lg active:bg-orange-600 text-sm font-semibold">Lunasi 1 Hari</button>
                </div>
            `).join('')}
        `;
        lucide.createIcons();
    }

    window.lunasiSholat = (id) => {
        const index = utangSholat.findIndex(u => u.id === id);
        if (index !== -1 && utangSholat[index].lunas < utangSholat[index].total) {
            utangSholat[index].lunas += 1;
            renderList();
        }
    }

    window.lunasiPuasa = (id) => {
        const index = utangPuasa.findIndex(u => u.id === id);
        if (index !== -1 && utangPuasa[index].lunas < utangPuasa[index].total) {
            utangPuasa[index].lunas += 1;
            renderList();
        }
    }

    renderList();
}