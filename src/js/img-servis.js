
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import axios from 'axios';
const axios = require('axios').default;

const API_KEY = '31491634-f9e5a76d496e450b9a690dee6';
const BASE_URL = 'https://pixabay.com/api/';
const perPage = 40;


export default class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  
  async fetchImg() {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${perPage}`;


      
      const response = await axios.get(url);
        
        const { totalHits, hits } = response.data;

        this.page += 1;

        if (totalHits / (this.page - 1) < perPage && hits.length !== 0) {
            refs.loadMoreBtn.classList.add('is-hidden');
            Notify.info("We're sorry, but you've reached the end of search results.");
        };

        return { totalHits, hits };
    }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}