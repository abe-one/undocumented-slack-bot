const { defaultFormData, axiosWithSlackAuth } = require("../../utils/utils");

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

const postMultipleReactionsTo1Message = (configObj) => {
  const { reactions } = configObj;

  return Promise.allSettled(
    reactions.map((reaction) =>
      post1ReactionTo1Message({ ...configObj, reaction: reaction }).then(
        (results) => results
      )
    )
  );
};

module.exports = {
  post1ReactionTo1Message,
  postMultipleReactionsTo1Message,
};
