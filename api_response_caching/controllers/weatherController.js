import axios from "axios";
import { getOrSetCache } from "../utils/cache.js";

export const getWeather = async (req, res) => {
  const city = req.params.city.toLowerCase();
  const key = `cache:weather:${city}`;

  try {
    const data = await getOrSetCache(key, 300, async () => {
   

      // Example with real API (uncomment if you have an API key)
      const r = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}
`);
      return r.data;
    });

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
