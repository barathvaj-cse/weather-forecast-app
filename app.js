const apiKey = '7c9b993288952c10148dbe72c15c78a5'; // Your OpenWeatherMap API key

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (city === 'delhi') return;

    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const currentWeatherData = await currentWeatherResponse.json();
    displayCurrentWeather(currentWeatherData);

    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();
    displayWeatherForecast(forecastData);
}

function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('currentWeather');
    const date = new Date(data.dt * 1000).toLocaleString();
    currentWeatherDiv.innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <p>Condition: ${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Date & Time: ${date}</p>
    `;
}

function displayWeatherForecast(data) {
    const labels = [];
    const temperatures = [];
    const humidities = [];
    const conditions = [];

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        labels.push(date);
        temperatures.push(item.main.temp);
        humidities.push(item.main.humidity);
        conditions.push(item.weather[0].description);
    });

    const ctx = document.getElementById('weatherChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Humidity (%)',
                    data: humidities,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    getWeatherByLocation();
});

async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
            const data = await response.json();
            document.getElementById('cityInput').value = data.name;
            getWeather();
        }, () => {
            document.getElementById('cityInput').value = 'Delhi';
            getWeather();
        });
    } else {
        document.getElementById('cityInput').value = 'Delhi';
        getWeather();
    }
}
