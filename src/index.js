import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './API';

const gallery = document.getElementById('gallery');
const loadMore = document.getElementById('load-button');
const form = document.getElementById('search-form');

const api = new API();

form.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', onLoadMore);

const modal = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function onLoadMore() {
  try {
    const response = await api.getImages();
    const images = response.data.hits;

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'We are sorry, but you have reached the end of search results'
      );
      loadMore.hidden = true;
      return;
    }

    const markup = images.reduce(
      (markup, image) => createImageCard(image) + markup,
      ''
    );

    gallery.insertAdjacentHTML('beforeend', markup);
    modal.refresh();
    scroll();
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'We are sorry, but you have reached the end of search results'
    );
    loadMore.hidden = true;
  }
}

async function onSubmit(event) {
  event.preventDefault();
  clearMarkup();
  loadMore.hidden = true;

  api.page = 1;
  api.query = form.elements.searchQuery.value.trim();

  if (api.query === '') {
    clearMarkup();
    return;
  }
  try {
    const response = await api.getImages();
    const images = response.data.hits;
    const quantity = response.data.totalHits;

    loadMore.hidden = false;

    if (images.length < 40) {
      loadMore.hidden = true;
    }

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
  } catch (error) {
    console.log(error);
  }
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
