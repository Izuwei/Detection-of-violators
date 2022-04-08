/**
 * @author Jakub Sadilek
 *
 * Faculty of Information Technology
 * Brno University of Technology
 * 2022
 */

const express = require("express");
const router = express.Router();
var path = require("path");

router.get("/:id", async (req, res) => {
  res.download(path.resolve("videos/" + req.params.id + ".mp4"), (err) => {
    if (err) {
      res.status(err.status || 404).end();
    }
  });
});

module.exports = router;
