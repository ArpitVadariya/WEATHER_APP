const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files like city.html

const port = 3000;
const API_KEY = process.env.WEATHER_API_KEY;

// Serve the homepage with search form (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const NodeCache = require("node-cache");
const weatherCache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

// Serve the city-specific weather page (city.html) for every search
app.get("/city/:city", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "city.html"));
});
// API route to fetch weather data (cached or fresh)
app.get("/api/weather/:city", async (req, res) => {
  const city = req.params.city;

  // Check if the data for the city is in the cache
  if (weatherCache.get(city)) {
    console.log(`Fetching weather data from cache for ${city}`);
    return res.json(weatherCache.get(city)); // Send cached data
  } else {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      console.log(`Fetching weather data from API for ${city}`);

      // Cache the fetched data for the city
      weatherCache.set(city, response.data);
      // console.log(`Data of ${city} saved into weatherCache:`, weatherCache);
      // console.log(weatherCache.get(city));

      // Send the fetched weather data as JSON
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
