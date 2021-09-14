import axios, { CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';

const makeAPIPath = (path: string): string => (`${process.env.REACT_APP_API_URL}${path}`);

const asyncGetRequest = async (url: string, source?: CancelTokenSource) => {
  let response;
  axios.defaults.withCredentials = true;
  if (source) response = await axios.get(url, { cancelToken: source.token });
  else response = await axios.get(url);
  return response;
};

const errorMessageHandler = (error: any) => {
  if (error.response?.data?.message) {
    toast.error(error.response.data.message[0]);
  } else toast.error(error.message);
};

export { makeAPIPath, asyncGetRequest, errorMessageHandler };
