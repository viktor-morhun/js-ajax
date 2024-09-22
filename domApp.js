import { renderUI } from "./renderUI.js";
import { movieService } from "./movieService.js";

class domApp {
  constructor(containerId) {
    this.moviesData = {};
    this.searchResult = [];
    this.movieCache = new Map();
    this.containerId = containerId;
    this.searchQuerry = "";
    this.currentPage = 1;
    this.previousPage = 1;
    this.totalPage = 0;
  }

  setStartPage() {
    renderUI.renderMessage(this.containerId);
    this.addEventListeners();
  }
  searchMovies() {
    event.preventDefault();
    const searchBarElement = document.getElementById("movie-title");
    this.searchQuerry = searchBarElement.value.trim();
    this.currentPage = 1;
    // this.totalPage = 1;
    this.getMoviesByQuerry();
  }
  getMoviesByQuerry = async () => {
    if (this.movieCache.has(this.searchQuerry + this.currentPage)) {
      this.searchResult = this.movieCache.get(this.searchQuerry + this.currentPage);
      console.log('Cache works');
    } else {
      this.searchResult = await movieService.getFullMovie(
        this.searchQuerry,
        "s=",
        `&page=${this.currentPage}`
      );
      this.movieCache.set(this.searchQuerry + this.currentPage, this.searchResult);
      console.log('fetch data');
    }

    if (this.searchResult.Error) {
      renderUI.renderMessage(
        this.containerId,
        `Movie ${this.searchQuerry} not found!`
      );
      this.totalPage = 0;
      this.addPagination();
    } else {
      this.moviesData = this.searchResult.Search;
      renderUI.renderMoviesList(this.moviesData, this.containerId);

      this.totalPage = Math.ceil(this.searchResult.totalResults / 10);
      this.addPagination();
    }
  };
  addEventListeners() {
    const searchButtonElement = document.getElementById("movie-search-button");
    const moviesContainerElement = document.getElementById(this.containerId);

    searchButtonElement.addEventListener("click", () => this.searchMovies());
    moviesContainerElement.addEventListener("click", (event) => {
      this.getFullMovieInfo(event);
    });
  }
  addPagination() {
    const paginationElement = document.getElementById("pagination-container");

    paginationElement.innerHTML = renderUI.renderPagination(
      this.totalPage,
      this.currentPage
    );

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
        this.currentPage === this.totalPage
          ? this.currentPage
          : ++this.currentPage;
      this.getMoviesByQuerry();
    } else if (event.target.closest("#firstPage")) {
      this.currentPage = 1;
      this.getMoviesByQuerry();
    } else if (event.target.closest("#lastPage")) {
      this.currentPage = this.totalPage;
      this.getMoviesByQuerry();
    }
  };
  setPaginationPage = () => {
    const inputPageNumber = Number(event.target.value);
    if (inputPageNumber > this.totalPage) {
      this.currentPage = this.totalPage;
    } else if (inputPageNumber < 1) {
      this.currentPage = 1;
    } else {
      this.currentPage = inputPageNumber;
    }

    this.getMoviesByQuerry();
  };
  getFullMovieInfo = async (event) => {
    if (event.target.className === "movie-card__details-button") {
      const mainContentElement = document.getElementById("mainContent");
      const movieId = event.target.dataset.id;
      const movieInfo = await movieService.getFullMovie(movieId, "i=");

      mainContentElement.innerHTML = renderUI.renderFullMovieInfo(movieInfo);

      const closeModalElement = document.getElementById("closeMovieInfoModal");
      closeModalElement.removeEventListener("click", this.closeModal);
      closeModalElement.addEventListener("click", this.closeModal);
    }
  };
  closeModal() {
    const mainContentElement = document.getElementById("mainContent");
    mainContentElement.innerHTML = "";
  }
}

const cinema = new domApp("results-container");

cinema.setStartPage();
