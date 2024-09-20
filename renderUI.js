export class renderUI {
  static renderMoviesList(moviesList, containerId) {
    const containerElement = document.getElementById(containerId);
    containerElement.innerHTML = moviesList
      .map((movie) => this.renderMovieCard(movie))
      .join("");
  }

  static renderMovieCard({ Poster, Title, Year, imdbID }) {
    return `<div class="movie-card">
                <img src="${
                  Poster === "N/A" ? "no-image-icon.png" : Poster
                }" alt="Movie Poster" class="movie-card__image">
                <div class="movie-card__overlay">
                    <h3 class="movie-card__title">${Title}</h3>
                    <p class="movie-card__year">${Year}</p>
                    <a href="#" data-id="${imdbID}" class="movie-card__details-button">Details</a>
                </div>
            </div>`;
  }

  static renderMessage(containerId, message = `Search movie to start!`) {
    const containerElement = document.getElementById(containerId);
    containerElement.innerHTML = `<h3 class="movie-carousel__message">${message}</h3>`;
  }

  static renderFullMovieInfo({
    Title,
    Year,
    Poster,
    Rated,
    Released,
    Runtime,
    Genre,
    Director,
    Actors,
    Plot,
    Language,
    Country,
    Awards,
    imdbRating,
  }) {
    return ` <div class="movie-info-modal hidden">
        <div class="movie-info-modal__content">
          <div class="movie-info-modal__header">
            <h2 class="movie-info-modal__title">${Title}</h2>
            <span id="closeMovieInfoModal"class="movie-info-modal__close">&times;</span>
          </div>
          <div class="movie-info-modal__body">
            <div class="movie-info-modal__poster">
              <img src="${
                Poster === "N/A" ? "no-image-icon.png" : Poster
              }" alt="Movie Poster">
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
      </div>`;
  }

  static renderPagination(totalPageNumber, currentPageNumber) {
    return `
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

            <input type="number" class="pagination-input pagination-number" id="currentPage" min="1" value=${currentPageNumber}>
            <span class="pagination-number pagination-number-total">of ${totalPageNumber}</span>
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
  }
}
