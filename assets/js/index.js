function pad(s) {
    return String(s).padStart(2, "0");
}

async function updateTime() {
    const api = 'https://timeapi.io/api/time/current/zone?timeZone=Asia%2FJakarta';
    const req = await fetch(api);
    const rest = await req.json();

    const { hour, minute, seconds, day, year, dayOfWeek, month } = rest;
    const hours = pad(hour);
    const minutes = pad(minute);
    const second = pad(seconds);

    const timeString = `${hours}:${minutes}:${second}`;
    document.getElementById('time').textContent = timeString;

    const dayList = {
        'Sunday': 'Minggu',
        'Monday': 'Senin',
        'Tuesday': 'Selasa',
        'Wednesday': 'Rabu',
        'Thursday': 'Kamis',
        'Friday': 'Jumat',
        'Saturday': 'Sabtu'
    }
    const days = pad(day);

    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const dayName = dayList[dayOfWeek];
    const monthName = months[month - 1];
    const dateString = `${dayName}, ${days} ${monthName} ${year}`;
    document.getElementById('date').textContent = dateString;
}

async function fetchWeather(lat, lon) {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=e19784e69dd747858b873343251902&q=${lat},${lon}&days=5&aqi=yes&alerts=no`);
    const data = await response.json();

    document.getElementById('location').textContent = data.location.name;
    document.getElementById('temperature').textContent = `${data.current.temp_c}°`;
    document.getElementById('condition').textContent = `${data.current.condition.text} ${data.forecast.forecastday[0].day.maxtemp_c}°/${data.forecast.forecastday[0].day.mintemp_c}°`;
    document.getElementById('air-quality').textContent = `IKU ${data.current.air_quality.pm2_5}`;

    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    data.forecast.forecastday.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('flex', 'justify-between', 'items-center', 'mb-2');
        dayElement.innerHTML = `
            <div>${new Date(day.date).toLocaleDateString('id-ID', { weekday: 'long' })}</div>
            <div class="flex items-center">
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="w-6 h-6">
                <div class="ml-2 flex items-center">
                    <span>${day.day.mintemp_c}°</span>
                    <div class="w-20 h-2 bg-gray-600 mx-2 rounded-full relative">
                        <div class="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <span>${day.day.maxtemp_c}°</span>
                </div>
            </div>
        `;
        forecastContainer.appendChild(dayElement);
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            document.getElementById('location-service').style.visibility = 'hidden';
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(lat, lon);
        }, error => {
            console.error('Error getting location:', error);
            document.getElementById('location-service').textContent = 'Gagal mendapatkan lokasi';
        });
    } else {
        document.getElementById('location-service').textContent = 'Geolocation tidak didukung oleh browser ini';
    }
}

setInterval(updateTime, 1000);
updateTime();
getLocation();