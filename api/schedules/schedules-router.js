const router = require("express").Router();

const Schedules = require("./schedules-logic");

//! NO VALIDATION NO SANITIZATION

router.get("/", (_req, res) => {
  const schedulesData = Schedules.getAllScheduledJobs();

  schedulesData.length === 0
    ? res.status(404).json({ error: "no cron jobs scheduled" })
    : res.status(200).json(schedulesData);
});

router.get("/:scheduleId", (req, res) => {
  const id = req.params.scheduleId;
  const schedulesData = Schedules.getScheduledJobById(id);

  res.status(200).json(schedulesData);
});

router.patch("/:scheduleId/:toggle", (req, res) => {
  const id = req.params.scheduleId;
  const jobStatus = Schedules.toggleJobOnOff(id);

  res.status(200).json({ message: `job ${id} was toggled ${jobStatus}` });
});

router.delete("/:scheduleId", (req, res) => {
  const id = req.params.scheduleId;
  Schedules.deleteJobById(id);

  res.status(200).json({ message: `job ${id} deleted` });
});
