import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public cityName: string,
    public date: string,
    public icon: string,
    public description: string,
    public temperature: number,
    public humidity: number,
    public windSpeed: number
  ) {}
}
  // TODO: Complete the WeatherService class
class WeatherService {
  // Method to convert temperature from Kelvin to Celsius
  private convertKelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15;
  }
  // TODO: Define the API key and city name properties
  private apiKey = process.env.be955bf1c93f4894df21d1eb27a3da57;
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const geocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${this.apiKey}`;
    const response = await axios.get(geocodeURL);
    const locationData = response.data[0];
    return { lat: locationData.lat, lon: locationData.lon };
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      throw new Error("Invalid location data: latitude and longitude must be numbers.");
    }
    return { lat, lon };
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const baseURL = "https://api.openweathermap.org/data/2.5/forecast";
    const apiKey = process.env.OPENWEATHER_API_KEY; // Ensure the API key is stored in .env
  
    if (!apiKey) {
      throw new Error("API key not found. Please set it in your .env file.");
    }
  
    const { lat, lon } = coordinates;
    const query = `${baseURL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    return query;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      // Step 1: Build the weather query URL using the coordinates
      const weatherQuery = this.buildWeatherQuery(coordinates);
  
      // Step 2: Send a request to the OpenWeather API
      const response = await fetch(weatherQuery);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }
  
      // Step 3: Parse and return the weather data
      const weatherData = await response.json();
      return weatherData;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {try {
    // Extract current weather data
    const currentWeather = new Weather(
      response.city.name,
      new Date(response.list[0].dt * 1000).toLocaleDateString(), // Convert timestamp to human-readable date
      response.list[0].weather[0].icon, // Weather icon code
      response.list[0].weather[0].description, // Weather description
      this.convertKelvinToCelsius(response.list[0].main.temp), // Convert temperature to Celsius
      response.list[0].main.humidity, // Humidity percentage
      response.list[0].wind.speed // Wind speed in m/s
    );

    // Convert temperature from Kelvin to Celsius or Fahrenheit (optional)
    currentWeather.temperature = this.convertKelvinToCelsius(currentWeather.temperature);

    return currentWeather;
  } catch (error) {
    console.error("Error parsing current weather data:", error);
    throw error;
  }
}
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]) {
    try {
      // Array to store the forecast data for the next 5 days
      const forecastArray = [];
  
      // Loop through the weather data to get the 5-day forecast
      for (let i = 0; i < weatherData.length; i++) {
        const dayData = weatherData[i];
  
        // Only select the 3-hour intervals that correspond to daily data
        if (dayData.dt_txt.includes("12:00:00")) {  // Filter for 12:00 PM data for consistency
          const forecast = new Weather(
            "", // City name is not needed for forecast
            new Date(dayData.dt * 1000).toLocaleDateString(),  // Convert timestamp to human-readable date
            dayData.weather[0].icon,  // Weather icon code
            dayData.weather[0].description,  // Weather description
            this.convertKelvinToCelsius(dayData.main.temp),  // Convert temperature to Celsius
            dayData.main.humidity,  // Humidity percentage
            dayData.wind.speed  // Wind speed in m/s
          );
          forecastArray.push(forecast);
        }
      }
  
      return forecastArray;
    } catch (error) {
      console.error("Error building forecast array:", error);
      throw error;
    }
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      // 1. Get coordinates for the city (using geocoding API)
      const locationData = await this.fetchLocationData(city);
      const coordinates = this.destructureLocationData(locationData);
  
      // 2. Fetch the weather data for the city using the coordinates
      const weatherData = await this.fetchWeatherData(coordinates);
  
      // 3. Parse the current weather and forecast data
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastArray = this.buildForecastArray(weatherData.list);
  
      // 4. Return the parsed data (current weather and forecast)
      return {
        currentWeather,
        forecastArray
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Unable to retrieve weather data for the city.");
    }
  }
}

export default new WeatherService();
