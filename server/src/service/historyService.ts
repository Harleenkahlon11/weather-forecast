import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
const historyFile = path.join(__dirname, 'searchHistory.json');

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
      const data = await fs.readFile(historyFile, 'utf-8');
      return JSON.parse(data || '[]').map((cityData: { name: string; id: string }) => new City(cityData.name, cityData.id));
    } catch (error) {
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await fs.writeFile(historyFile, JSON.stringify(cities, null, 2));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(name: string) {
    const cities = await this.read();
    const newCity = new City(name, uuidv4());
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.read();
    const updatedCities = cities.filter((city: City) => city.id !== id);
    await this.write(updatedCities);
    return updatedCities;
  }
}


export default new HistoryService();
