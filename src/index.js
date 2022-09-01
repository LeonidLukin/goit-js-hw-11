import fetchImages from './js/fetch-images';
// import cardTemplate from '../templates/card-template.hbs';
import {
  Notify
} from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import throttle from 'lodash.throttle';

const {
  searchForm,
  gallery,
  loadMoreBtn,
  endCollectionText
} = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  endCollectionText: document.querySelector('.end-collection-text'),
};

function createImageEl(hits) {
  console.log(hits);
  const markup = hits
    .map(({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads
    }) => {
      return `
            <a href="${largeImageURL}" class="photo-card">
             <img src="${webformatURL}" alt="${tags}" loading = "lazy"  class="photo-image" />
                <div class="info" style= "display: flex">
                    <p class="info-item">
                    <b>Likes:</b>${likes}
                    </p>
                    <p class="info-item">
                    <b>Views: </b>${views}
                    </p>
                    <p class="info-item">
                    <b>Comments: </b>${comments}
                    </p>
                    <p class="info-item">
                    <b>Downloads: </b>${downloads}
                    </p>
                </div>
               </a> `;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  // console.log(refs.galleryEl);
  // ==========вызываем библиотеку лайтбокс для красивой галлереи============
  simpleLightbox();
  scroll();
  // =========показываем кнопку "загрузить еще" и кнопку "наверх" ====
  loadMoreBtn.style =
    ' display: flex;  margin-left: auto;  margin-right: auto; margin-bottom:32px; margin-top:32px; padding:16px; border: 1px solid green; border-radius:8px; background-color: yellow';
  goUpBtn.style =
    'position: fixed; bottom: 32px;right: 32px; border-radius: 50%; width: 80px; height: 80px; background-color: lime; color: blue; border: 1px solid blue';
}

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchForm.addEventListener('submit', onSubmitSearchForm);

async function onSubmitSearchForm(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.searchQuery.value;
  currentPage = 1;

  if (searchQuery === '') {
    return;
  }

  const response = await fetchImages(searchQuery, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    loadMoreBtn.classList.remove('is-hidden');
  } else {
    loadMoreBtn.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      createImageEl(response.hits);
      lightbox.refresh();
      endCollectionText.classList.add('is-hidden');

      const {
        height: cardHeight
      } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.classList.add('is-hidden');
      endCollectionText.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

async function onClickLoadMoreBtn() {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  createImageEl(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits === response.totalHits) {
    loadMoreBtn.classList.add('is-hidden');
    endCollectionText.classList.remove('is-hidden');
  }
}