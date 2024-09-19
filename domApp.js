"use strict";

import { fetchData } from "./fetchData.js";
import { apikey, FETCH_BASE_URL } from "./constants.js";
import { renderUI } from "./renderUI.js";

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

  setDefaultMovies() {
    renderUI.renderMessage(this.containerId);
    this.addEventListeners();
  };

  searchMovies() {
    event.preventDefault();
    const searchBarElement = document.getElementById("movie-title");
    this.searchQuerry = searchBarElement.value;
    this.currentPage = 1;
    this.totalResults = 1;
    this.getMoviesByQuerry();
  }
  getMoviesByQuerry = async (searchType = 's=') => {
    const resultOfSearch = await fetchData(
      `${FETCH_BASE_URL}${searchType}${this.searchQuerry}${apikey}&page=${this.currentPage}`
    );

    if (resultOfSearch.Error) {
      renderUI.renderMessage(this.containerId, `Movie ${this.searchQuerry} not found!`);
      this.removePagination();
    } else {
      this.searchResult = resultOfSearch.Search;
      renderUI.renderMoviesList(this.searchResult, this.containerId);

      if (resultOfSearch.totalResults > 10) {
        this.totalResults = Math.ceil(resultOfSearch.totalResults / 10);
        this.renderPagination();
      } else {
        this.removePagination();
      }
    }
  };


  getFullMovie = async (movieId) => {
    const resultOfSearch = await fetchData(
      `${FETCH_BASE_URL}i=${movieId}${apikey}`
    );

    return resultOfSearch;
  }
  addEventListeners() {
    const searchButtonElement = document.getElementById('movie-search-button');

    searchButtonElement.addEventListener('click', () => this.searchMovies());
    const moviesContainerElement = document.getElementById(this.containerId);
    moviesContainerElement.addEventListener('click', (event) => {
      this.getFullMovieInfo(event);
    });

  }

  renderPagination() {
    const paginationElement = document.getElementById('pagination-container');

    paginationElement.innerHTML = `
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

            <input type="number" class="pagination-input pagination-number" id="currentPage" min="1" max="${this.totalResults}" value=${this.currentPage}>
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
              </div>`;

    const pageNumberElement = document.getElementById('currentPage');
    pageNumberElement.removeEventListener('change', this.setPaginationPage);
    pageNumberElement.addEventListener('change', this.setPaginationPage);
    paginationElement.removeEventListener('click', this.changePaginationPage);
    paginationElement.addEventListener('click', this.changePaginationPage);
  }
  removePagination() {
    const paginationElement = document.getElementById("pagination-container");
    paginationElement.innerHTML = '';
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

  getFullMovieInfo = async (event) => {
    if (event.target.className === 'movie-card__details-button') {
      const movieId = event.target.dataset.id;
      const movieInfo = await this.getFullMovie(movieId);
      const mainContentElement = document.getElementById('mainContent');
      mainContentElement.innerHTML = this.renderFullMovieInfo(movieInfo);

      const closeModalElement = document.getElementById('closeMovieInfoModal');
      closeModalElement.removeEventListener('click', this.closeModal);
      closeModalElement.addEventListener('click', this.closeModal);
    }
  };

  closeModal() {
    const mainContentElement = document.getElementById('mainContent');
    mainContentElement.innerHTML = '';
  }

  renderFullMovieInfo({Title, Year, Poster, Rated, Released, Runtime, Genre, Director, Actors, Plot, Language, Country, Awards, imdbRating}) {
    return ` <div class="movie-info-modal hidden">
        <div class="movie-info-modal__content">
          <div class="movie-info-modal__header">
            <h2 class="movie-info-modal__title">${Title}</h2>
            <span id="closeMovieInfoModal"class="movie-info-modal__close">&times;</span>
          </div>
          <div class="movie-info-modal__body">
            <div class="movie-info-modal__poster">
              <img src="${Poster}" alt="Movie Poster">
            </div>
            <div class="movie-info-modal__details">
              <p><strong>Year:</strong>${Year}</p>
              <p><strong>Rated:</strong>${Rated}</p>
              <p><strong>Released:</strong>${Released}</p>
              <p><strong>Runtime:</strong>${Runtime}</p>
              <p><strong>Genre:</strong>${Genre}</p>
              <p><strong>Director:</strong>${Director}</p>
              <p><strong>Actors:</strong>${Actors}</p>
              <p><strong>Plot:</strong>${Plot}</p>
              <p><strong>Language:</strong>${Language}</p>
              <p><strong>Country:</strong>${Country}</p>
              <p><strong>Awards:</strong>${Awards}</p>
              <div class="movie-info-modal__ratings">
                <p><strong>Ratings:</strong></p>
                <ul>
                  <li>Internet Movie Database: ${imdbRating}/10</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>`
  }
}

const cinema = new domApp("results-container");
cinema.setDefaultMovies();
