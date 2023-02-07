import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './API';

const searchButton = document.querySelector('button');
const inputEl = document.querySelector('input');
const gallery = document.getElementById('gallery');
const loadMore = document.getElementById('load-button');

const api = new API();

searchButton.addEventListener('click', onSearchClick);
loadMore.addEventListener('click', onLoadMore);

const modal = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function onLoadMore() {
  api
    .getImages()
    .then(data => {
      const images = data.hits;
      const quantity = data.totalHits;

      if (images.length === 0) {
        Notiflix.Notify.failure(
          'We are sorry, but you have reached the end of search results'
        );
        loadMore.hidden = true;
        return;
      }

      Notiflix.Notify.success(`Hooray! We found ${quantity} images.`);

      const markup = images.reduce(
        (markup, image) => createImageCard(image) + markup,
        ''
      );
      return markup;
    })
    .then(markup => {
      gallery.insertAdjacentHTML('beforeend', markup);
      modal.refresh();
      scroll();
    });
}

function onSearchClick(event) {
  event.preventDefault();
  clearMarkup();
  loadMore.hidden = true;

  api.page = 1;
  api.query = inputEl.value.trim();

  if (api.query === '') {
    clearMarkup();
    return;
  }

  api.getImages().then(data => {
    const images = data.hits;
    const quantity = data.totalHits;
    loadMore.hidden = false;

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMore.hidden = true;
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${quantity} images.`);

    const markup = images.reduce(
      (markup, image) => createImageCard(image) + markup,
      ''
    );
    updateMarkup(markup);
  });
}

function createImageCard({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="340px" height="220px"  />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <br>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> <br>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> <br>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> <br>
      ${downloads}
    </p>
  </div>
</div></a>`;
}

function updateMarkup(markup) {
  gallery.innerHTML = markup;
  modal.refresh();
}

function clearMarkup() {
  gallery.innerHTML = '';
}

function scroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
