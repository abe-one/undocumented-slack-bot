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
  const cancelMsg = "Cron job canceled";
  const cronfirmationMsg = `Cron job scheduled for every ${frequency} hour(s)`;

  if (frequency === 0) {
    console.log(cancelMsg);
    responseAndCronJob.cronfirmation = cancelMsg;
  } else {
    try {
      let newOldestMessage = `${new Date().getTime() / 1000}`;

      responseAndCronJob.cronfirmation = cronfirmationMsg;
      responseAndCronJob.firstResponse = await cbToSchedule(formSubmissions);

      responseAndCronJob.job = cron.schedule(
        `1 */${frequency} * * *`,
        async () => {
          try {
            formSubmissions = { ...formSubmissions, oldest: newOldestMessage };
            newOldestMessage = `${new Date().getTime() / 1000}`;
            const followingResponse = await cbToSchedule(formSubmissions);

            console.log("${new Date()}:", cronfirmationMsg, followingResponse);
          } catch (err) {
            console.log(err);
          }
        }
      );
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
