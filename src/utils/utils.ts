const makeAPIPath = (path: string): string => (`${process.env.REACT_APP_API_URL}${path}`);

export default makeAPIPath;
