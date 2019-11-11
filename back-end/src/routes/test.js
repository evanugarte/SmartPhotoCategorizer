var AWS = require("aws-sdk");
var uuid = require("uuid"); // Use this later to generate a unique identifier to prevent collisions?
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

var getParams = {
  Bucket: BUCKET_NAME,
  Key: "202f5b5d-1746-48d1-8c88-09eeef8fb4bbbrandless-xoCZEKJxwgY-unsplash.jpg"
};

var queryParams = {
  TableName: "Tags",
  KeyConditionExpression: "#tag = :tag",
  ExpressionAttributeNames: {
    "#tag": "tag"
  },
  ExpressionAttributeValues: {
    ":tag": "Crow"
  }
};

dynamodb.query(queryParams, function(err, data) {
  if (err) {
    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
  } else {
    console.debug("Query succeeded.");
    console.debug(data.Items);
  }
});