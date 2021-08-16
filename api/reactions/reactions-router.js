const router = require("express").Router();

const Reactions = require("./reactions-logic");

//! NO VALIDATION NO SANITIZATION

router.post("/celebrate", (req, res, next) => {
  Reactions.postMultipleReactionsTo1Message(req.body)
    .then((slackResponses) => {
      res.status(201).json(slackResponses);
    })
    .catch(next);
});

module.exports = router;
