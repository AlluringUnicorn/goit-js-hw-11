const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '33430670-3151596af5f0d850f5d459d27';

export default class API {
  constructor() {
    this.page = 1;
    this.query = '';
  }

  async getImages() {
    try {
      const response = await axios.get(
        `${BASE_URL}?key=${KEY}&q=${this.query}&per_page=40&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`
      );
      console.log(response.data);
      this.page += 1;
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
