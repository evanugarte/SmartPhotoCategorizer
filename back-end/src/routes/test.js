var AWS = require("aws-sdk");
var uuid = require("uuid"); // Use this later to generate a unique identifier to prevent collisions?
//var fs = require('fs');
const config = require("../../config/config");

// Set the Region. us-west-1 is Northern California.
AWS.config.update({
  region: "us-west-1",
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});

// Constants. Put this in a separate config file?
const BUCKET_NAME = "cmpe172-project2-bucket";

// initialize s3, rekognition, and dynamoDB Document Client
var s3 = new AWS.S3();

var getParams = {
  Bucket: BUCKET_NAME,
  
};