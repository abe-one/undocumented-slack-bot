/*
Get cronjobs from other files
  refactor jobs in other files
*/

const cron = require("node-cron");

let cronJobs = [];

const scheduleSlackRequests = async (
  frequency,
  cbToSchedule,
  formSubmissions,
  apiPath
) => {
  const response = {};
  const cronfirmationMsg = `Cron job #${cronJobs.length} scheduled for every ${frequency} hour(s)`;

  try {
    let newOldestMessage = `${new Date().getTime() / 1000}`;

    response.cronfirmation = cronfirmationMsg;
    response.firstResponse = await cbToSchedule(formSubmissions);

    const newJob = cron.schedule(`0-59 */${frequency} * * *`, async () => {
      try {
        formSubmissions = { ...formSubmissions, oldest: newOldestMessage };
        newOldestMessage = `${new Date().getTime() / 1000}`;
        const followingResponse = await cbToSchedule(formSubmissions);

        console.log(new Date(), ":", cronfirmationMsg, followingResponse);
      } catch (err) {
        console.log(err);
      }
      console.log(cronfirmationMsg);
      console.log(cronJobs);
    });
    cronJobs.push({
      cron: newJob,
      frequency: frequency,
      active: true,
      channel: formSubmissions.channel,
      api_path: apiPath,
      original_submissions: formSubmissions,
    });
  } catch (err) {
    return err;
  }
  return response;
};

const getAllScheduledJobs = () => {
  // jobs array should be objects including job, frequency, key form data
  return cronJobs;
};

module.exports = {
  scheduleSlackRequests,
  getAllScheduledJobs,
};
