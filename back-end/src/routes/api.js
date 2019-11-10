// Load the SDK for JavaScript
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
var rekognition = new AWS.Rekognition();
var dynamodb = new AWS.DynamoDB.DocumentClient();


const uploadFile = (request, response) => {
  (async () => {
    var statusCode = 400;
    var message = "File does not exist";
    if (request.file) {
      // Read content from the file
      // const fileContent = fs.readFileSync(fileName);
      const fileContent = request.file.buffer;
      // Generate random handle
      const newFileName = uuid.v4() + request.file.originalname; 

      // Setting up S3 upload parameters
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: newFileName, 
        Body: fileContent
      };
      try {
        // Upload File to S3
        const uploadData = await s3.upload(uploadParams).promise();
        statusCode = 500;
        message = "Could not upload";
        if (uploadData) {
          console.debug("File successfully uploaded");
          // Setting up rekognition parameters
          var rekogParams = {
            Image: {
              Bytes: fileContent
            }, 
            MaxLabels: 10, 
            MinConfidence: 70
          };

          // Detect labels with Rekognition
          const rekogData = await rekognition.detectLabels(rekogParams).promise();
          console.debug("Labels detected");
          console.debug(rekogData);
          const labels = rekogData.Labels;
          var labelNames = [];
          labels.forEach( async (label) => {
            // Put names of labels inside labelNames
            labelNames.push(label.Name);
    
            // Set up dynamoDB params
            var tagParams = {
              TableName:"Tags",
              Item:{
                "tag": label.Name,
                "file": newFileName
              }
            };
    
            // Put tag item in table so we can query for files based on tags.
            const tagData = await dynamodb.put(tagParams).promise();
            console.debug("Added Item: ", tagData);
          });

          // Set up parameters for putting document in files table.
          const d = new Date();
          var uploadDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
          var fileParams = {
            TableName:"Files",
            Item: {
              "file": newFileName,
              "tags": labelNames,
              "title": request.body.title,
              "desc": request.body.desc,
              "likes": request.body.likes,
              "uploadDate": uploadDate,
              "email": request.body.email //Change to request.user.email when authentication is set up
            }
          };

          const fileData = await dynamodb.put(fileParams).promise();
          console.debug("Added Item:", fileData);
          statusCode = 200;
          message = "Upload successful";
        }
      }
      catch (e) {
        console.debug("Upload error", e);
      }
    }
    response.status(statusCode).send(message);
  })().catch(e => {
    console.debug("Something went wrong");
  });
};

/**
 * Retrieve all photos uploaded by user.
 * @param {email: String} request 
 * @param {[{photo: Object, desc: String, uploadDate: String, title: String, likes: String}]} response 
 */
const getPhotoSocial = (request, response) => {
  (async () => {
    var statusCode = 400;
    var message = "User does not exist";
    
    // Modify email accordingly. For now this is in body.
    if (request.body.email) {
      try {
        console.debug("Querying photos");
        var queryParams = {
          TableName: "Files",
          KeyConditionExpression: "#email = :email",
          ExpressionAttributeNames: {
            "#email": "email"
          },
          ExpressionAttributeValues: {
            ":email": request.body.email
          }
        };
        var photos = await dynamodb.query(queryParams).promise();

        // Loop through photos to send all object data
        photos.forEach( async (photo) => {
          
        });
        statusCode = 200;
        message = "Get Successful";
      }
      catch(e) {
        console.debug("Could not retrieve photos", e);
      }
      response.status(statusCode).send(photos);
    }
    else {
      response.status(statusCode).send(message);
    }
  })().catch(e => {
    console.debug("Something went wrong");
  });
};

/**
 * Retrieve all photos from a specific tag.
 * @param {tag: String} request 
 * @param {[{photo: Object, uploadDate: String, title: String}]} response 
 */
const getPhotoByTag = (request, response) => {
  (async () => {

  });
};

/**
 * Retrieve all tags and one of their associated photos. 
 * @param {userID: Integer} request 
 * @param {[{tag: String, photo: Object}]} response 
 */
const getTags = (request, response) => {
  (async () => {

  });
};
module.exports = {
  uploadFile
};