document.addEventListener("DOMContentLoaded", () => {
    const greeting = document.getElementById("greeting");
    const cityInput = document.getElementById("cityInput");
    const checkButton = document.getElementById("checkButton");
    const weatherInfo = document.getElementById("weatherInfo");

    // Greeting based on time
    const hours = new Date().getHours();
    let timeGreeting = hours < 12 ? "Good Morning!" : hours < 18 ? "Good Afternoon!" : "Good Evening!";
    greeting.textContent = timeGreeting;

    checkButton.addEventListener("click", async () => {
        const city = cityInput.value.trim();

        if (!city) {
            weatherInfo.textContent = "Please enter a city name.";
            return;
        }

        const apiKey = "00460c74ae61df520ee67428ac7de68d"; // Add your OpenWeather API key here
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("City not found.");

            const data = await response.json();
            const condition = data.weather[0].main; // Weather condition
            const temp = data.main.temp; // Temperature

            // Set weather condition icon
            const icon = condition === "Clear"
                ? "sun.svg"
                : condition === "Clouds"
                ? "cloud-sun.svg"
                : condition === "Rain"
                ? "rain-sun.svg"
                : "moon.svg";

            weatherInfo.innerHTML = `
                <div>
                    <img src="assets/icons/${icon}" alt="${condition}" width="50">
                </div>
                <p>${condition} - ${temp}°C</p>
            `;
        } catch (error) {
            weatherInfo.textContent = error.message;
        }
    });
});
