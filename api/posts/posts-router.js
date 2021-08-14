const router = require("express").Router();

const Posts = require("./posts-logic");

//! NO VALIDATION NO SANITIZATION

router.post("/history", (req, res, next) => {
  Posts.requestFilterAndConcatPosts(req.body)
    .then((slackResponse) => {
      res.status(200).json(slackResponse);
    })
    .catch(next);
});

module.exports = router;
