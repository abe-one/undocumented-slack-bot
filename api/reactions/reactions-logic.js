const {
  defaultFormData,
  axiosWithSlackAuth,
  selectRandomArrayElements,
} = require("../../utils/utils");
const {
  requestFilterAndConcatMessages,
} = require("../messages/messages-logic");
const { scheduleSlackRequests } = require("../schedules/schedules-logic");

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
  const { dynamic_reactions, dynamic_config, timestamp } = formSubmissions;

  try {
    if (timestamp) {
      return postMultipleReactionsTo1Message(formSubmissions);
    }

    const messages = await requestFilterAndConcatMessages(formSubmissions);

    if (messages.error) {
      throw messages;
    }

    const postingResults = await Promise.all(
      messages.map(async (msg) => {
        const { timestamp, text } = msg;

        if (!text.includes(dynamic_config?.trigger_string)) {
          return {
            status: "rejected",
            value: `Message: '${text}' did not match trigger_string: '${dynamic_config.trigger_string}'`,
          };
        }

        const reactionConfigObj = {
          timestamp,
          ...formSubmissions,
        };

        if (dynamic_reactions) {
          reactionConfigObj.reactions = selectRandomArrayElements(
            formSubmissions.reactions,
            dynamic_config?.reactions_per_message
          );
        }

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

let cronJob = {};

const scheduleReactions = async (frequency, formSubmissions, apiPath) => {
  if (cronJob?.stop) {
    cronJob.stop();
  } //stop logic located in higher order function due to scoping issues

  try {
    const response = await scheduleSlackRequests(
      frequency,
      postMultipleReactionsToMultipleMessages,
      formSubmissions,
      apiPath
    );
    return response;
  } catch (err) {
    return err;
  }
};

module.exports = {
  post1ReactionTo1Message,
  postMultipleReactionsTo1Message,
  postMultipleReactionsToMultipleMessages,
  scheduleReactions,
};
