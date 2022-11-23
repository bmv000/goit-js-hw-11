import './sass/_common.scss';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import ImgApiService from './js/img-servis';



const searchForm = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.classList.add('is-hidden');



searchForm.addEventListener('submit', searchImg);
loadMoreBtn.addEventListener('click', onLoadMore);

const imgApiService = new ImgApiService();



function searchImg(event) {
    event.preventDefault();
    clearGallery();
    loadMoreBtn.classList.remove('is-hidden');

    imgApiService.query = event.currentTarget.elements.searchQuery.value;
    imgApiService.resetPage();
    imgApiService.fetchImg()
        .then(({ totalHits, hits }) => {
            if (hits.length > 0) {
                Notify.success(`Hooray! We found ${totalHits} images.`);
            };
            if (hits.length === 0) {
                Notify.warning("Sorry, there are no images matching your search query. Please try again.");
                loadMoreBtn.classList.add('is-hidden');
            } else {
                createGallery(hits);
            };
        })
        .catch(onFetchError);
};

function createGallery(arrayForGallery) {
    const galleryMarkup = createGalleryMarkup(arrayForGallery);

    galleryListEl.insertAdjacentHTML('beforeend', galleryMarkup);
};

function createGalleryMarkup(imagesArray) {
    return imagesArray
        .map(image => {
            const { webformatURL, tags, likes, views, comments, downloads } = image;

            return `
                <div class="photo-card">
                
                    <img src="${webformatURL}" alt="${tags}"  loading="lazy" width="320px" height="210px"/>
                    
                    <div class="info">
                        <p class="info-item"><b>Likes</b><br/>${likes}
                        </p>
                        <p class="info-item"><b>Views</b><br/>${views}
                        </p>
                        <p class="info-item"><b>Comments</b><br/>${comments}
                        </p>
                        <p class="info-item"><b>Downloads</b><br/>${downloads}
                        </p>
                    </div>
                </div>
            `
        })
        .join('');
};

function onLoadMore () {
    imgApiService.fetchImg()
        .then(({ hits }) => {
            createGallery(hits);
        })
        .catch (onFetchError);
};

function clearGallery() {
    galleryListEl.innerHTML = '';
};

function onFetchError(error) {
    Notify.failure(error.message);
};

