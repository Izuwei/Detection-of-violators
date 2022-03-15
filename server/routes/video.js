const express = require("express");
const router = express.Router();
var path = require("path");

router.get("/:id", async (req, res) => {
  res.sendFile(path.resolve("videos/" + req.params.id + ".mp4"));
});

module.exports = router;
