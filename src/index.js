import { getImages } from './API';
import Notiflix from 'notiflix';

const searchButton = document.querySelector('button');
const inputEl = document.querySelector('input');
const gallery = document.getElementById('gallery');

searchButton.addEventListener('click', onSearchClick);

function onSearchClick(event) {
  event.preventDefault();
  clearMarkup();

  const query = inputEl.value;

  getImages(query).then(data => {
    const images = data.hits;

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const quantity = data.totalHits;

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
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
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
</div>`;
}

function updateMarkup(markup) {
  gallery.innerHTML = markup;
}

function clearMarkup() {
  gallery.innerHTML = '';
}
