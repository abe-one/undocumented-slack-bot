export { }
const router = require("express").Router();
const Posts = require("./messages-logic");

//! NO VALIDATION NO SANITIZATION

router.get("/history", (req, res, next) => {
  Posts.requestFilterAndConcatMessages(req.body)
    .then((slackMessages) => {
      res.status(200).json(slackMessages);
    })
    .catch(next);
});

module.exports = router;
