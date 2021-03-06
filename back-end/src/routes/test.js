var AWS = require("aws-sdk");
// Use this later to generate a unique identifier to prevent collisions?
var uuid = require("uuid");
var fs = require("fs");

// Set the Region. us-west-1 is Northern California.
AWS.config.update({
  region: "us-west-1",
});

// Constants. Put this in a separate config file?
const BUCKET_NAME = "cmpe172-project2-bucket";

// initialize s3, rekognition, and dynamoDB Document Client
var s3 = new AWS.S3();
var dynamodb = new AWS.DynamoDB.DocumentClient();
