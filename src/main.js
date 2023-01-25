import axios from 'axios';
import Notiflix from 'notiflix';

const formEl = document.querySelector('.search-form')
const inputEl = document.querySelector('input')

const galleryEl = document.querySelector('.gallery')
const loadMoreEl = document.querySelector('.load-more')

const BASE_URL = 'https://pixabay.com/api/'
const API_KEY = '33056563-cc044f40a294fc1629405232d'
const parametres = 'image_type=photo&orientation=horizontal&safesearch=true'
let pageCount = 1

loadMoreEl.style.display = 'none'
formEl.addEventListener('submit', fetchPhotos)

async function fetchPhotos(e) {
    e.preventDefault()
    try {
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${inputEl.value}&${parametres}&page=${pageCount}&per_page=40`)
        if (response.data.totalHits === 0) {
            throw new Error()
        } else if(inputEl.value.length === 0){
            Notiflix.Notify.info('oops');
        } else {
            Notiflix.Notify.success(`Hooray! We found ${response.data.total} images.`);
            galleryEl.innerHTML = createMarkup(response.data.hits)
            loadMoreEl.style.display = 'block'
            // inputEl.value = ''
        }
    } catch (error) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }
};

function createMarkup(arr) {
    const galleryItemMarkup = arr.map(
        ({ webformatURL, tags, likes, views, comments, downloads, }) => {
        return `
        <div class="photo-card">
        <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" width=300/>
        <div class="info">
            <p class="info-item">
            <b>Likes: </b>${likes}
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
        </div>`
        }).join('')
    
    return galleryItemMarkup
}

loadMoreEl.addEventListener('click', async () => {
    pageCount += 1
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${inputEl.value}&${parametres}&page=${pageCount}&per_page=40`)
    galleryEl.insertAdjacentHTML('beforeend',createMarkup(response.data.hits))
    if (response.data.totalHits < pageCount * 40) {
        inputEl.value = ''
        loadMoreEl.style.display = 'none'
        Notiflix.Notify.failure('Sorry, there are no more images.')
    } 
})