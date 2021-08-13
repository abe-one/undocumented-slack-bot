const { defaultFormData, axiosWithSlackAuth } = require("../../utils/utils");

const requestHistory = async (formSubmissions) => {
  let { channel, oldest } = formSubmissions;

  const formData = defaultFormData();

  oldest =
    oldest ||
    new Date().getTime()(() =>
      channel ? formData.append("channel", channel) : null
    )();
  //wrapping/invoking conditional inside function for stylistic reason
  formData.append("oldest", oldest);

  const formDataHeaders = formData.getHeaders();

  try {
    const response = await axiosWithSlackAuth(formDataHeaders).post(
      "/conversations.history",
      formData
    );
    return response.data.messages;
    // Does not account for pagination of results
    // const cursor = response.data?.response_metadata.next_cursor
    // followup request to same endpoint, {...formData, cursor: cursor}
  } catch (err) {
    return err;
  }
};
