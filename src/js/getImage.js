import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import axios from 'axios';

import axios from 'axios'
const DEFAULT_URL = 'https://pixabay.com/api/';


// const options = {
//   headers: {
//     "key": "33660007-8865277052768d74528f73e50",
//   },
// };

import { Notify } from 'notiflix/build/notiflix-notify-aio';
Notify.init({
  width: '500px',
  position: 'center-top',
  closeButton: false,
});

export default class ImageApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  async getImages() {
   
    const URL = `${DEFAULT_URL}?key=33660007-8865277052768d74528f73e50&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
    if(this.searchQuery === '') {
      Notify.failure(
        'Please, enter your query'
      );
        throw new Error('No query');}

  const response = await axios.get(URL);
     this.nextPage();
      return response.data;
  }

  
  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
