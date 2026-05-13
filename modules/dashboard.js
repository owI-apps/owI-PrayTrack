import { appState } from '../app.js';

export function renderDashboard() {
    const main = document.getElementById('main-content');
    
    const totalPoin = appState.points.wajib + appState.points.sunnah + appState.points.quran + appState.points.infaq;
    const percentage = Math.min((totalPoin / 100) * 100, 100); // Maks 100
    const yesterday = appState.yesterdayPoints;

    let statusMsg = "";
    let statusColor = "text-gray-500";
    if (percentage === 100) {
        statusMsg = "🔥 PERFECT! Kamu luar biasa hari ini!";
        statusColor = "text-green-500";
    } else if (totalPoin > yesterday) {
        statusMsg = "⬆️ Lebih baik dari kemarin!";
        statusColor = "text-sky-600";
    } else if (totalPoin === yesterday) {
        statusMsg = "➡️ Sama dengan kemarin.";
        statusColor = "text-gray-500";
    } else {
        statusMsg = "⬇️ Kurang dari kemarin, ayo kejar!";
        statusColor = "text-orange-500";
    }

    // SVG Circle Logic (Radius 70, Keliling = 2 * PI * 70 = 439.8)
    const circumference = 439.8;
    const offset = circumference - (percentage / 100) * circumference;

    main.innerHTML = `
        <div class="flex flex-col items-center mt-4 mb-8">
            <div class="relative">
                <svg class="w-48 h-48" viewBox="0 0 160 160">
                    <circle class="text-gray-200" stroke-width="12" fill="transparent" r="70" cx="80" cy="80" stroke="currentColor"/>
                    <circle class="text-sky-500 progress-ring__circle" stroke-width="12" fill="transparent" r="70" cx="80" cy="80" 
                        stroke-linecap="round" stroke="currentColor" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-4xl font-bold text-gray-800">${Math.round(percentage)}%</span>
                    <span class="text-sm text-gray-500">${totalPoin} Poin</span>
                </div>
            </div>
            <p class="mt-4 font-semibold text-center ${statusColor}">${statusMsg}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-sky-500">
                <p class="text-xs text-gray-500">Wajib (50)</p>
                <p class="text-xl font-bold text-gray-800">${appState.points.wajib} <span class="text-sm font-normal">Poin</span></p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                <p class="text-xs text-gray-500">Sunnah (27)</p>
                <p class="text-xl font-bold text-gray-800">${appState.points.sunnah} <span class="text-sm font-normal">Poin</span></p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500">
                <p class="text-xs text-gray-500">Quran (13)</p>
                <p class="text-xl font-bold text-gray-800">${appState.points.quran} <span class="text-sm font-normal">Poin</span></p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
                <p class="text-xs text-gray-500">Infaq (10)</p>
                <p class="text-xl font-bold text-gray-800">${appState.points.infaq} <span class="text-sm font-normal">Poin</span></p>
            </div>
        </div>
    `;
}

export function updateDashboardUI() {
    // Dipanggil saat poin berubah di tab lain
    const isDashboardActive = document.querySelector('.nav-btn[data-tab="dashboard"]')?.classList.contains('text-sky-600');
    if (isDashboardActive) {
        renderDashboard();
    }
}