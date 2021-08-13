const router = require("express").Router();

const Reactions = require("./posts-logic");

//! NO VALIDATION NO SANITIZATION

router.post("/history", (req, res, next) => {
  Reactions.requestHistory(req.body)
    .then((slackResponse) => {
      res.status(201).json(slackResponse);
    })
    .catch(next);
});

module.exports = router;
