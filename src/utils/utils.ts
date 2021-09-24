export { }

const { default: axios } = require("axios");
const FormData = require("form-data");
const {
  DEFAULT_CHANNEL,
  USER_AUTH_TOKEN,
  USER_COOKIE,
  BASE_SLACK_URL,
} = require("./env-fallbacks");

const defaultFormData = () => {
  const data = new FormData();
  data.append("channel", DEFAULT_CHANNEL);
  data.append("token", USER_AUTH_TOKEN);
  return data;
};

const axiosWithSlackAuth = (headers) =>
  axios.create({
    headers: { ...headers, cookie: USER_COOKIE },
    baseURL: BASE_SLACK_URL,
  });

const selectRandomArrayElements = (array, limit) => {
  const randomizedSet = new Set();

  while (limit > 0) {
    const randomEl = array[Math.floor(Math.random() * array.length)];
    randomizedSet.add(randomEl);
    limit--;
  }

  return [...randomizedSet];
};

module.exports = {
  defaultFormData,
  axiosWithSlackAuth,
  selectRandomArrayElements,
};
