import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

axios.defaults.baseURL = 'https://pixabay.com/api/';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

// const lightBox = new SimpleLightbox('.photo-card a', {
//   captions: true,
//   captionType: 'attr',
//   captionPosition: 'bottom',
//   captionDelay: 250,
//   captionsData: 'alt',
//   docClose: true,
// });

let value = '';
let currentPage = 1;
const HITS_PER_PAGE = 40;
let totalPages = 0;

let items = [];
refs.form.addEventListener('submit', onSearchItems);

function onSearchItems(e) {
  e.preventDefault();
  value = e.currentTarget.elements.searchQuery.value;
  refs.loadMore.classList.remove('visible');
  if (value.trim() === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  currentPage = 1;
  refs.gallery.innerHTML = '';

  getPicture(value.trim());
}

function onClickLoadMore() {
  currentPage += 1;
  getPicture();
}

const getPicture = async () => {
  try {
    const { data } = await axios.get(
      `?q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${HITS_PER_PAGE}&page=${currentPage}&key=30191539-d56ffab2c88cb867d9bceaf74`
    );
    items = [...items, ...data.hits];
    renderList(data.hits);

    if (data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    refs.loadMore.classList.add('visible');

    totalPages = Math.ceil(data.totalHits / 40);

    if (currentPage >= totalPages) {
      refs.loadMore.classList.remove('visible');
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
  } catch (error) {
    Notify.failure(error);
  }
};

const renderList = items => {
  const list = items
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', list);
};

refs.loadMore.addEventListener('click', onClickLoadMore);
