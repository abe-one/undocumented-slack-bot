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

router.post("/test-cron/:frequency", async (req, res, next) => {
  const frequency = Math.abs(parseInt(req.params.frequency));

  try {
    const schedulingConfirmation = await Reactions.scheduleReactions(
      frequency,
      req.body
    );
    res.status(200).json(schedulingConfirmation);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
