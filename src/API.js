const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '33430670-3151596af5f0d850f5d459d27';

export async function getImages(query) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
