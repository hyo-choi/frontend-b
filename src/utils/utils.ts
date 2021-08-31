import axios, { CancelTokenSource } from 'axios';

const makeAPIPath = (path: string): string => (`${process.env.REACT_APP_API_URL}${path}`);

const asyncGetRequest = async (url: string, source?: CancelTokenSource) => {
  let response;
  axios.defaults.withCredentials = true;
  if (source) response = await axios.get(url, { cancelToken: source.token });
  else response = await axios.get(url);
  return response;
};

export { makeAPIPath, asyncGetRequest };
