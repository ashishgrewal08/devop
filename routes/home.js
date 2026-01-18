const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("GreyWall backend is running successfully 🚀");
});

module.exports = router;
