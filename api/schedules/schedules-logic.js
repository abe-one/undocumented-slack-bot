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
  const cronfirmationMsg = `cron job #${cronJobs.length} scheduled for every ${frequency} hour(s)`;

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
  const cronJobsMeta = cronJobs.map((job) => {
    if (job) {
      let jobMeta = { ...job };
      delete jobMeta.cron;
      delete jobMeta.original_submissions;
      return jobMeta;
    } else {
      return "DELETED";
    }
  });
  return cronJobsMeta;
};

const toggleJobOnOff = (id, toggle) => {
  id = parseInt(id);
  const job = cronJobs[id];

  if (toggle === "on") {
    job.cron.start();
    job.active = true;
    return "active";
  } else if (toggle === "off") {
    job.cron.stop();
    job.active = false;
    return "inactive";
  }
};

const deleteJobById = (id) => {
  toggleJobOnOff(id, "off");
  return (cronJobs[id] = null);
};

module.exports = {
  scheduleSlackRequests,
  getAllScheduledJobs,
  toggleJobOnOff,
  deleteJobById,
};
