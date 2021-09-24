const { defaultFormData, axiosWithSlackAuth } = require("../../utils/utils");

const requestMessages = async (formSubmissions) => {
  let { channel, oldest, cursor } = formSubmissions;

  const formData = defaultFormData();

  oldest = oldest || `${new Date().getTime() / 1000 - 24 * 60 * 60}`; //Default to last 24 hours

  (() => (cursor ? formData.append("cursor", cursor) : null))();
  (() => (channel ? formData.append("channel", channel) : null))();
  //wrapping/invoking conditionals inside function for stylistic reasons
  formData.append("oldest", oldest);

  const formDataHeaders = formData.getHeaders();

  try {
    const { data } = await axiosWithSlackAuth(formDataHeaders).post(
      "/conversations.history",
      formData
    );
    if (data.error) {
      throw {
        status: 500,
        error: data.error,
      };
    }
    if (data.messages.length === 0) {
      throw {
        status: 404,
        error: "No messages found matching posted request",
      };
    }
    return data;
  } catch (err) {
    return err;
  }
};

const filterMessages = (unfilteredMessages) => {
  const cleanedMessages = unfilteredMessages.map((msg) => {
    const cleanedPost = {
      timestamp: msg.ts,
      text: msg.text,
      user: {
        user_id: msg.user,
        username: msg?.user_profile?.name,
      },
    };
    return cleanedPost;
  });

  return cleanedMessages;
};

const requestFilterAndConcatMessages = async (formSubmissions) => {
  try {
    let unfilteredMessages = await requestMessages(formSubmissions);

    if (unfilteredMessages.error) {
      throw unfilteredMessages;
    }

    let cleanedMessages = filterMessages(unfilteredMessages.messages);

    while (unfilteredMessages.has_more) {
      formSubmissions = {
        ...formSubmissions,
        cursor: unfilteredMessages.response_metadata.next_cursor,
      };
      unfilteredMessages = await requestMessages(formSubmissions);
      cleanedMessages = filterMessages(unfilteredMessages.messages).concat(
        cleanedMessages
      );
    }

    return cleanedMessages;
  } catch (err) {
    return err;
  }
};

module.exports = {
  requestFilterAndConcatMessages,
};
