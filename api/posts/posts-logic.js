const { defaultFormData, axiosWithSlackAuth } = require("../../utils/utils");

const requestPosts = async (formSubmissions) => {
  let { channel, oldest, cursor } = formSubmissions;

  const formData = defaultFormData();

  oldest = oldest || `${new Date().getTime() / 1000 - 24 * 60 * 60}`; //Default to last 24 hours

  (() => (cursor ? formData.append("cursor", cursor) : null))();
  (() => (channel ? formData.append("channel", channel) : null))();
  //wrapping/invoking conditionals inside function for stylistic reasons
  formData.append("oldest", oldest);

  const formDataHeaders = formData.getHeaders();

  try {
    const response = await axiosWithSlackAuth(formDataHeaders).post(
      "/conversations.history",
      formData
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

const filterPosts = (unfilteredPosts) => {
  const cleanedPosts = unfilteredPosts.map((post) => {
    const cleanedPost = {
      timestamp: post.ts,
      text: post.text,
      user: {
        user_id: post.user,
        username: post.user_profile.name,
      },
    };
    return cleanedPost;
  });

  return cleanedPosts;
};

const requestFilterAndConcatPosts = async (formSubmissions) => {
  try {
    let unfilteredPosts = await requestPosts(formSubmissions);
    let cleanedPosts = filterPosts(unfilteredPosts.messages);

    while (unfilteredPosts.has_more) {
      formSubmissions = {
        ...formSubmissions,
        cursor: unfilteredPosts.response_metadata.next_cursor,
      };
      unfilteredPosts = await requestPosts(formSubmissions);
      cleanedPosts = filterPosts(unfilteredPosts.messages).concat(cleanedPosts);
    }

    return cleanedPosts;
  } catch (err) {
    return err;
  }
};

module.exports = {
  requestFilterAndConcatPosts,
};
