import axios from 'axios';

const API_KEY = '39640074-d9003677179e321cad733a89a';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImgs(query, page) {
  const params = {
    key: API_KEY,
    q: query, 
    image_type: 'photo',
    orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 40,
      
  };

  try {
      const { data } = await axios(BASE_URL, { params });
      return data;
      
  } catch (error) {
    console.log(error);
  }
}