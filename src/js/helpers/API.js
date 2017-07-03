import axios from 'axios';

const baseURL = 'https://anapioficeandfire.com/api';

const API = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

let HTTPRequest = {};

HTTPRequest.getCharacters = (page) => {
  return API.get(`${baseURL}/characters?page=${page}&pageSize=10`);
}

HTTPRequest.getCharacterByID = (characterID) => {
  return API.get(`${baseURL}/characters/${characterID}`);
}

export default HTTPRequest;