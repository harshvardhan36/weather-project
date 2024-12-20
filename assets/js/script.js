document.addEventListener("DOMContentLoaded", () => {
    const greeting = document.getElementById("greeting");
    const cityInput = document.getElementById("cityInput");
    const checkButton = document.getElementById("checkButton");
    const weatherInfo = document.getElementById("weatherInfo");

    const apiKey = '00460c74ae61df520ee67428ac7de68d'; // Define the API key once

    // Function to get user's location
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showWeather, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    function showWeather(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Fetch weather data from API using latitude and longitude
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                displayWeatherData(data); // Call the common function to display the weather data
            })
            .catch(error => {
                weatherInfo.innerHTML = "Error fetching weather data. Please try again.";
            });
    }

    // Error handler for geolocation
    function showError(error) {
        if (error.code === error.PERMISSION_DENIED) {
            weatherInfo.innerHTML = "Location permission denied. Please allow location access.";
        } else {
            weatherInfo.innerHTML = "Error retrieving location.";
        }
    }

    // Function to display weather data in the weatherInfo div
    function displayWeatherData(data) {
        const condition = data.weather[0].main; // Weather condition
        const temp = data.main.temp; // Temperature
        const humidity = data.main.humidity; // Humidity
        const windSpeed = data.wind.speed; // Wind speed

        // Set weather condition icon based on weather condition
        const icon = condition === "Clear"
            ? "sun.svg"
            : condition === "Clouds"
            ? "cloud-sun.svg"
            : condition === "Rain"
            ? "rain-sun.svg"
            : "moon.svg"; // Default icon for other conditions

        // Display data
        weatherInfo.innerHTML = `
            <h2>Weather Update</h2>
            <div>
                <img src="assets/icons/${icon}" alt="${condition}" width="50">
            </div>
            <p>${condition} - ${temp}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;
    }

    // Call getLocation when the page loads
    window.onload = getLocation;

    // Greeting based on time
    const hours = new Date().getHours();
    let timeGreeting = hours < 12 ? "Good Morning!" : hours < 18 ? "Good Afternoon!" : "Good Evening!";
    greeting.textContent = timeGreeting;

    // Handle city input and weather fetching when the "Check" button is clicked
    checkButton.addEventListener("click", async () => {
        const city = cityInput.value.trim();

        if (!city) {
            weatherInfo.textContent = "Please enter a city name.";
            return;
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("City not found.");

            const data = await response.json();
            displayWeatherData(data); // Call the common function to display the weather data
        } catch (error) {
            weatherInfo.textContent = error.message;
        }
    });
});
