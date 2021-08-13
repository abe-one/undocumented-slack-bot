const axios = require("axios")
const FormData = require('form-data')
const { DEFAULT_CHANNEL, USER_AUTH_TOKEN, TEST_URL, USER_COOKIE } = require("../../utils/env-fallbacks")


const postReaction = async (formSubmissions) => {

  const {channel, reaction, timestamp} = formSubmissions
  
  const formData = new FormData
  
  formData.append("channel", channel || DEFAULT_CHANNEL)
  formData.append("token", USER_AUTH_TOKEN)
  formData.append("name", reaction)
  formData.append("timestamp", timestamp)

  const formDataHeaders = formData.getHeaders()

  try {
  const response = await axios.post(TEST_URL, formData, {
        headers: { ...formDataHeaders, cookie: USER_COOKIE }//todo create custom axios to include url
  })
  return reaction + ": " + (response.data.error || "ok")
} catch (err) {
  return err
}
}

const celebrateAllPosts = (configObj) => {
  const { reactions } = configObj

  return Promise.allSettled(reactions.map(reaction => postReaction({...configObj, reaction: reaction}).then(results => results)
  ))
  
}


module.exports = {
  postReaction,
  celebrateAllPosts
}