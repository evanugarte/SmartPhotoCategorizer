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
router.post("/updateprofile", upload.single("file"), api.updateProfile);
router.get("/getprofile", api.getprofile);
router.post("/signup", api.signup);
router.get("/getPhotoSocial", api.getPhotoSocial);
router.get("/getPhotoByTag", api.getPhotoByTag);
router.get("/getTags", api.getTags);
router.delete("/deleteById", api.deletePhotoById);
router.post("/sharePhotos", api.sharePhotos);
module.exports = router;
