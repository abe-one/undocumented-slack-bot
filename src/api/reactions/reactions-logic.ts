export { }

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
  const { dynamic_reactions, dynamic_config, timestamp, reactions } =
    formSubmissions;

  const reactionConfigObj = { ...formSubmissions };

  try {
    if (timestamp) {
      if (dynamic_reactions) {
        reactionConfigObj.reactions = selectRandomArrayElements(
          reactions,
          dynamic_config?.reactions_per_message || 23
        );
      }
      return postMultipleReactionsTo1Message(reactionConfigObj);
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
            reactions,
            dynamic_config?.reactions_per_message || 23
          );

          if (dynamic_config.optional_trigger_strings.length > 0) {
            dynamic_config.optional_trigger_strings.map((trigger) => {
              if (text.includes(trigger.trigger_string)) {
                reactionConfigObj.reactions.push(...trigger.reactions);
              }
            });
          }
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

const scheduleReactions = async (frequency, formSubmissions, apiPath) => {
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
