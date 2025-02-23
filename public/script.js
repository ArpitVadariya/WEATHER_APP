document.getElementById("searchButton").addEventListener("click", function () {
  const city = document.getElementById("city").value;

  if (city) {
    // Make the API call to your backend
    fetch(`http://localhost:3000/city/${city}`) // Update the URL to your backend's URL
      .then((response) => response.json())
      .then((data) => {
        if (data && data.weather) {
          displayWeather(data);
        } else {
          document.getElementById("weatherData").innerHTML =
            "No weather data found!";
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        document.getElementById("weatherData").innerHTML =
          "Error fetching weather data.";
      });
  } else {
    document.getElementById("weatherData").innerHTML =
      "Please enter a city name.";
  }
});

function displayWeather(data) {
  const weatherHtml = `
    <h2>Weather in ${data.name}</h2>
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
  `;
  document.getElementById("weatherData").innerHTML = weatherHtml;
}
