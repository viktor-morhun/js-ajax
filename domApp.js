'use strict';

import { fetchData } from "./fetchData.js";
import { apikey, FETCH_BASE_URL } from "./constants.js";

class domApp {
  constructor(containerId) {
    this.moviesData = [];
    this.searchResult = [];
    this.containerId = containerId;
    this.searchQuerry = '';
    this.currentPage = 1;
    this.previousPage = 1;
    this.totalResults = 0;
  }

  setDefaultMovies = async (querry) => {
    // const moviesList = await fetchData(`${FETCH_BASE_URL}${querry}${apikey}`);
    // this.moviesData = moviesList.Search;
    // console.log(this.moviesData);
    // this.renderMoviesList();
    this.renderMessage();
    this.addEventListeners();
  }

  renderMoviesList(moviesList = this.moviesData) {
    const containerElement = document.getElementById(this.containerId);
    containerElement.innerHTML = moviesList.map((movie) => this.renderMovieCard(movie)).join('');
  }

  renderMovieCard({Poster, Title, Year, imdbID}) {
    return `<div class="movie-card">
                <img src="${Poster === 'N/A' ? 'no-image-icon.png' : Poster}" alt="Movie Poster" class="movie-card__image">
                <div class="movie-card__overlay">
                    <h3 class="movie-card__title">${Title}</h3>
                    <p class="movie-card__year">${Year}</p>
                    <a href="https://www.imdb.com/title/${imdbID}/" class="movie-card__details-button" target="_blank">Details</a>
                </div>
            </div>`;
  }

  renderMessage(message = `Search movie to start!`) {
    const containerElement = document.getElementById(this.containerId);
    containerElement.innerHTML = `<h3 class="movie-carousel__message">${message}</h3>`
  }

  searchMovies() {
    event.preventDefault();
    const searchBarElement = document.getElementById('movie-title');
    const searchQuerry = searchBarElement.value;
    this.getMoviesByQuerry(searchQuerry);
  }
  getMoviesByQuerry = async (querry) => {
    const resultOfSearch = await fetchData(`${FETCH_BASE_URL}${querry}${apikey}`);
    console.log(resultOfSearch);

    if (resultOfSearch.Error) {
      this.renderMessage(`Movie ${querry} not found!`);
    } else {
      this.searchResult = resultOfSearch.Search;
      this.renderMoviesList(this.searchResult);

      if(resultOfSearch.totalResults > 10) {
        this.totalResults = resultOfSearch.totalResults;
        console.log('pagination')
      }
    }

  }
  addEventListeners() {
    const searchButtonElement = document.getElementById('movie-search-button');

    searchButtonElement.addEventListener('click', () => this.searchMovies());
  }


  //pagination
  renderPagination() {
    const paginationElement = document.getElementById('pagination-container');
    
    paginationElement.innerHTML = '';
  }
}

const cinema = new domApp('results-container');

 cinema.setDefaultMovies();