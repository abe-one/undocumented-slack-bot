/*
Get cronjobs from other files
  refactor jobs in other files
*/

const cron = require("node-cron");

let cronJobs = [];

const scheduleSlackRequests = async (
  frequency,
  cbToSchedule,
  formSubmissions
) => {
  const responseAndCronJob = {};
  const cancelMsg = "Cron job canceled";
  const cronfirmationMsg = `Cron job #${cronJobs.length} scheduled for every ${frequency} hour(s)`;

  if (frequency === 0) {
    //should be validated before being passed in

    console.log(cancelMsg);
    responseAndCronJob.cronfirmation = cancelMsg;
  } else {
    try {
      let newOldestMessage = `${new Date().getTime() / 1000}`;

      responseAndCronJob.cronfirmation = cronfirmationMsg;
      responseAndCronJob.firstResponse = await cbToSchedule(formSubmissions);

      const newJob = cron.schedule(`1 */${frequency} * * *`, async () => {
        try {
          formSubmissions = { ...formSubmissions, oldest: newOldestMessage };
          newOldestMessage = `${new Date().getTime() / 1000}`;
          const followingResponse = await cbToSchedule(formSubmissions);

          console.log(new Date(), ":", cronfirmationMsg, followingResponse);
        } catch (err) {
          console.log(err);
        }
      });
      cronJobs.push(newJob);
    } catch (err) {
      return err;
    }
  }
  return responseAndCronJob;
};

module.exports = {
  scheduleSlackRequests,
};
