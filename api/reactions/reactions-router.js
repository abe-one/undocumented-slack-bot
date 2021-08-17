const router = require("express").Router();

const Reactions = require("./reactions-logic");

//! NO VALIDATION NO SANITIZATION

router.post("/custom", (req, res, next) => {
  Reactions.postMultipleReactionsToMultipleMessages(req.body)
    .then((slackResponses) => {
      res.status(201).json(slackResponses);
    })
    .catch(next);
});

router.post("/test-cron/:frequency", (req, res, next) => {
  Reactions.testCron(req.params.frequency)
    .then((schedulingConfirmation) => {
      res.status(200).json(schedulingConfirmation);
    })
    .catch(next);
});

module.exports = router;
