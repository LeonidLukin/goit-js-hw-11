const axios = require('axios');

export default async function fetchImage(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '11240134-58b8f655e9e0f8ae8b6e8e7de';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios
    .get(`${url}${filter}`)
    .then(res => res.data)
    .catch(err => console.log('catch ERROR > ', err))
}