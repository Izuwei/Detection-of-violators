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
  res.sendFile(path.resolve("videos/" + req.params.id + ".json"), (err) => {
    if (err) {
      res.status(err.status || 404).end();
    }
  });
});

module.exports = router;
