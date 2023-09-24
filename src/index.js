import { fetchImgs } from './js/api';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox'; // Бібліотека для галереї зображень
import 'simplelightbox/dist/simple-lightbox.min.css';
import { MarkupGallery } from './js/gallery';

const form = document.getElementById('search-form');
const galleryList = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
loadBtn.style.display = 'none';

let page;
let queryForSearch = '';

form.addEventListener('submit', onSubmit);
loadBtn.addEventListener('click', onLoadClick);

const lightbox = new SimpleLightbox('.gallery a');

async function onSubmit(evt) {
  evt.preventDefault();
  const { searchQuery } = evt.target.elements;
  queryForSearch = searchQuery.value.trim();

  galleryList.innerHTML = '';
  page = 1;

    if (!queryForSearch) {
        // hideLoadBtn();
    loadBtn.style.display = 'none';
    Notify.info('Please enter word for search!!!');
    return;
  }

  try {
      const { hits, totalHits } = await fetchImgs(queryForSearch, page);
      
    if (hits.length === 0) {
      
       loadBtn.style.display = 'none';
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    MarkupGallery(hits, galleryList);
    lightbox.refresh();
    form.reset();
    Notify.success(`"Hooray! We found ${totalHits} images.`);

    if (totalHits > 40) {
      loadBtn.style.display = 'block';
    } else {
      hideLoadBtn();
      }
      
  } catch (error) {
    console.log(error);
      Notify.failure('Ooops...Something went wrong!');
      hideLoadBtn();
  }
}

async function onLoadClick() {
  page += 1;

  try {
    const { hits, totalHits } = await fetchImgs(queryForSearch, page);

    MarkupGallery(hits, galleryList);
    lightbox.refresh();
    scrollPage();

    if (totalHits <= page * 40) {
      hideLoadBtn();
    }
  } catch (error) {
    console.log(error);
      Notify.failure('Ooops...Something went wrong!');
      hideLoadBtn();
  }
}

function hideLoadBtn() {
  loadBtn.style.display = 'none';
  Notify.info("We're sorry, but you've reached the end of search results!");
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}