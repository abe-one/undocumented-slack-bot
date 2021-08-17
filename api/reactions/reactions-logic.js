const cron = require("node-cron");

const { defaultFormData, axiosWithSlackAuth } = require("../../utils/utils");
const {
  requestFilterAndConcatMessages,
} = require("../messages/messages-logic");

let pendingCron;

const testCron = async (frequency) => {
  const responseObject = {};

  if (pendingCron) {
    pendingCron.stop();
  }
  if (frequency > 0) {
    pendingCron = cron.schedule(` */${frequency} * * * * *`, () => {
      console.log(
        `cron job scheduled by API for every ${frequency} seconds: ${new Date().getSeconds()}`
      );
    });
    responseObject.confirmation = `Cron job scheduled for every ${frequency} seconds`;
  } else {
    console.log("Cron job canceled by API");
    responseObject.confirmation = "Cron job canceled";
  }
  return responseObject;
};

const post1ReactionTo1Message = async (formSubmissions) => {
  const { channel, reaction, timestamp } = formSubmissions; //timestamp serves as post identifier

  const formData = defaultFormData();

  (() => (channel ? formData.append("channel", channel) : null))();
  //wrapping/invoking conditional inside function for stylistic reason

  formData.append("name", reaction);
  formData.append("timestamp", timestamp);

  const formDataHeaders = formData.getHeaders();

  try {
    const response = await axiosWithSlackAuth(formDataHeaders).post(
      "/reactions.add",
      formData
    );
    return reaction + ": " + (response.data.error || "ok");
  } catch (err) {
    return err;
  }
};

const postMultipleReactionsTo1Message = (formSubmissions) => {
  const { reactions } = formSubmissions;

  return Promise.allSettled(
    reactions.map((reaction) =>
      post1ReactionTo1Message({ ...formSubmissions, reaction: reaction }).then(
        (results) => results
      )
    )
  );
};

const postMultipleReactionsToMultipleMessages = async (formSubmissions) => {
  try {
    const messages = await requestFilterAndConcatMessages(formSubmissions);

    const postingResults = await Promise.all(
      messages.map(async (msg) => {
        const { timestamp } = msg;

        const reactionConfigObj = {
          timestamp,
          ...formSubmissions,
        };

        const postingResult = await postMultipleReactionsTo1Message(
          reactionConfigObj
        );
        return { postingResult, timestamp };
      })
    );

    return postingResults;
  } catch (err) {
    return err;
  }
};

const scheduleReactions = async (frequency, formSubmissions) => {
  //
};

module.exports = {
  post1ReactionTo1Message,
  postMultipleReactionsTo1Message,
  postMultipleReactionsToMultipleMessages,
  testCron,
};
