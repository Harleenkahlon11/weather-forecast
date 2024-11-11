import { Router } from 'express';
import WeatherService from '../../service/weatherService';
import HistoryService from '../../service/historyService';
const router = Router();


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const { city } = req.body; // Get city name from request body

    // Fetch weather data using WeatherService
    const weatherData = await WeatherService.getWeatherForCity(city);

    // Save the city to search history (assuming cities are stored with a unique id)
    const savedCity = await HistoryService.addCity(city);

    // Return weather data and saved city details
    res.status(200).json({
      weatherData,
      savedCity,
    });
  } catch (error) {
    console.error('Error in POST request:', error);
    res.status(500).json({ message: 'An error occurred while fetching the weather data.' });
  }
});
// TODO: GET search history
router.get('/history', async (req, res) => {
  try {
    // Get cities from search history
    const cities = await HistoryService.getCities();
    res.status(200).json(cities);
  } catch (error) {
    console.error('Error in GET /history request:', error);
    res.status(500).json({ message: 'An error occurred while fetching the search history.' });
  }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get city id from request params

    // Remove the city with the given id from search history
    const deletedCity = await HistoryService.removeCity(id);

    if (!deletedCity) {
      return res.status(404).json({ message: 'City not found in search history.' });
    }

    res.status(200).json({ message: 'City removed from search history successfully.' });
  } catch (error) {
    console.error('Error in DELETE /history/:id request:', error);
    res.status(500).json({ message: 'An error occurred while removing the city from history.' });
  }
});

export default router;
