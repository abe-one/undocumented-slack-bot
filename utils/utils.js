const { default: axios } = require("axios");
const cron = require("node-cron");
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

const scheduleSlackRequests = async (
  cronVariable,
  frequency,
  cbToSchedule,
  formSubmissions
) => {
  const responseAndCronJob = {};
  if (frequency === 0) {
    console.log("Cron job canceled by API");
    responseAndCronJob.cronfirmation = "Cron job canceled";
  } else {
    try {
      let newOldestMessage = `${new Date().getTime() / 1000}`;
      const firstResponse = await cbToSchedule(formSubmissions);
      responseAndCronJob.firstResponse = firstResponse;
      cronVariable = cron.schedule(`* */${frequency} * * *`, async () => {
        try {
          formSubmissions = { ...formSubmissions, oldest: newOldestMessage };
          newOldestMessage = `${new Date().getTime() / 1000}`;
          const followingResponse = await cbToSchedule(formSubmissions);

          if (followingResponse.error) {
            throw followingResponse;
          }

          console.log(
            `${new Date().getTime()}: cron job scheduled by API for every ${frequency} hour(s)\n`,
            followingResponse
          );
        } catch (err) {
          console.log(err);
        }
      });
      responseAndCronJob.cronfirmation = `Cron job scheduled for every ${frequency} hour(s)`;
      responseAndCronJob.job = cronVariable;
    } catch (err) {
      return err;
    }
  }
  return responseAndCronJob;
};

module.exports = {
  defaultFormData,
  axiosWithSlackAuth,
  scheduleSlackRequests,
};
