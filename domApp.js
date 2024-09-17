"use strict";

import { fetchData } from "./fetchData.js";
import { apikey, FETCH_BASE_URL } from "./constants.js";

class domApp {
  constructor(containerId) {
    this.moviesData = [];
    this.searchResult = [];
    this.containerId = containerId;
    this.searchQuerry = "";
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
  };

  renderMoviesList(moviesList = this.moviesData) {
    const containerElement = document.getElementById(this.containerId);
    containerElement.innerHTML = moviesList
      .map((movie) => this.renderMovieCard(movie))
      .join("");
  }

  renderMovieCard({ Poster, Title, Year, imdbID }) {
    return `<div class="movie-card">
                <img src="${
                  Poster === "N/A" ? "no-image-icon.png" : Poster
                }" alt="Movie Poster" class="movie-card__image">
                <div class="movie-card__overlay">
                    <h3 class="movie-card__title">${Title}</h3>
                    <p class="movie-card__year">${Year}</p>
                    <a href="https://www.imdb.com/title/${imdbID}/" class="movie-card__details-button" target="_blank">Details</a>
                </div>
            </div>`;
  }

  renderMessage(message = `Search movie to start!`) {
    const containerElement = document.getElementById(this.containerId);
    containerElement.innerHTML = `<h3 class="movie-carousel__message">${message}</h3>`;
  }

  searchMovies() {
    event.preventDefault();
    const searchBarElement = document.getElementById("movie-title");
    this.searchQuerry = searchBarElement.value;
    this.getMoviesByQuerry(this.searchQuerry);
  }
  getMoviesByQuerry = async (querry = this.searchQuerry) => {
    const resultOfSearch = await fetchData(
      `${FETCH_BASE_URL}${querry}${apikey}&page=${this.currentPage}`
    );
    if (resultOfSearch.Error) {
      this.renderMessage(`Movie ${querry} not found!`);
    } else {
      this.searchResult = resultOfSearch.Search;
      this.renderMoviesList(this.searchResult);

      if (resultOfSearch.totalResults > 10) {
        this.totalResults = Math.ceil(resultOfSearch.totalResults / 10);
        this.renderPagination();
      }
    }
  };
  addEventListeners() {
    const searchButtonElement = document.getElementById("movie-search-button");

    searchButtonElement.addEventListener("click", () => this.searchMovies());
  }

  //pagination
  renderPagination() {
    const paginationElement = document.getElementById("pagination-container");

    paginationElement.innerHTML = `
        <div class="pagination-container">
          <div class="pagination-number arrow" id="firstPage">
            <span class="material-symbols-outlined">
              keyboard_double_arrow_left
            </span>
              <span class="arrow-text">First</span> 
          </div>
            <div class="pagination-number arrow" id="previousPage">
                <span class="material-symbols-outlined">
                  chevron_left
                </span>
            </div>

            <input type="number" class="pagination-input" id="currentPage" min="1" max="${this.totalResults}" value=${this.currentPage}>
            <span class="pagination-number pagination-number-total">of ${this.totalResults}</span>
            <div class="pagination-number arrow" >

                <span class="material-symbols-outlined" id="nextPage">
                  chevron_right
                </span>
            </div>
              <div class="pagination-number arrow" id="lastPage">
                <span class="arrow-text">Last</span> 

                <span class="material-symbols-outlined">
                  keyboard_double_arrow_right
                </span>
              </div>
          </div>`;

    const pageNumberElement = document.getElementById("currentPage");
    pageNumberElement.removeEventListener("change", this.setPaginationPage);
    pageNumberElement.addEventListener("change", this.setPaginationPage);
    paginationElement.removeEventListener("click", this.changePaginationPage);
    paginationElement.addEventListener("click", this.changePaginationPage);
  }

  changePaginationPage = (event) => {
    if (event.target.closest("#previousPage")) {
      this.currentPage = this.currentPage - 1 === 0 ? 1 : --this.currentPage;
      this.getMoviesByQuerry();
    } else if (event.target.id === "nextPage") {
      this.currentPage =
        this.currentPage === this.totalResults
          ? this.currentPage
          : ++this.currentPage;
      this.getMoviesByQuerry();
    } else if (event.target.closest("#firstPage")) {
      this.currentPage = 1;
      this.getMoviesByQuerry();
    } else if (event.target.closest("#lastPage")) {
      this.currentPage = this.totalResults;
      this.getMoviesByQuerry();
    }
  };

  setPaginationPage = () => {
    const inputPageNumber = Number(event.target.value);
    if (inputPageNumber > this.totalResults) {
      this.currentPage = this.totalResults;
    } else if (inputPageNumber < 1) {
      this.currentPage = 1;
    } else {
      this.currentPage = inputPageNumber;
    }

    this.getMoviesByQuerry();
  };
}

const cinema = new domApp("results-container");

cinema.setDefaultMovies();
