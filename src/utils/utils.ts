import axios from 'axios';

const makeAPIPath = (path: string): string => (`${process.env.REACT_APP_API_URL}${path}`);

const asyncGetRequest = async (url: string) => {
  axios.defaults.withCredentials = true;
  const response = await axios.get(url);
  return response;
};

export { makeAPIPath, asyncGetRequest };
