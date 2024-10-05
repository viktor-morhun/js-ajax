import {FETCH_BASE_URL, apikey} from "./constants.js";
import { fetchData } from "./fetchData.js";

export class movieService {
  static getFullMovie = async (querry, searchType, page = '') => {
    const link = `${FETCH_BASE_URL}${searchType}${querry}${apikey}${page}`;
    return await fetchData(link);
  }
}