const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;
const API_KEY = process.env.WEATHER_API_KEY;
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const NodeCache = require("node-cache");
const weatherCache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

app.get("/city/:city", async (req, res) => {
  const city = req.params.city;

  if (weatherCache.get(city)) {
    console.log(`Data fetching from cache for ${weatherCache.get(city).name}`);
    return res.json(weatherCache.get(city));
  } else {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      console.log(`Data fetching from API for ${city}`);

      weatherCache.set(city, response.data);
      // console.log(`Data of ${city} saved into weatherCache:`, weatherCache);
      // console.log(weatherCache.get(city));

      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
