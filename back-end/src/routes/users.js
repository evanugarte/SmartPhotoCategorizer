var express = require("express");
var router = express.Router();
const api = require("./api.js");
const multer = require("multer");
const upload = multer();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/upload", upload.single("file"), api.uploadFile);
module.exports = router;
