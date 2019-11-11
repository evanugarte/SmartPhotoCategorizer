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
            const d = new Date();
            var uploadDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
            var fileParams = {
              TableName:"Files",
              Item:{
                "file": newFileName,
                "tag": label.Name,
                "email": request.body.email,
                "title": request.body.title,
                "desc": request.body.desc,
                "likes": 0,
                "uploadDate": uploadDate
              }
            };
    
            // Put tag item in table so we can query for files based on tags.
            const fileData = await dynamodb.put(fileParams).promise();
            console.debug("Added Item: ", fileData);
          });
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
    console.debug(request.headers.email);
    const reqEmail = request.headers.email;
    // For now this will be in the headers. Modify later maybe.
    if (reqEmail) {
      try {
        console.debug("Querying photos");
        
        var queryParams = {
          TableName: "Files",
          IndexName: "email-file-index",
          KeyConditionExpression: "#email = :email",
          ExpressionAttributeNames: {
            "#email": "email"
          },
          ExpressionAttributeValues: {
            ":email": reqEmail
          }
        };
        const queryData = await dynamodb.query(queryParams).promise();
        const items = queryData.Items;

        var responseData = [];
        // Loop through photos to send all object data
        prevTitle = "";
        for (let i = 0; i < items.length; i++) {
          if (items[i].title === prevTitle) {
            continue;
          }
          var getParams = {
            Bucket: BUCKET_NAME,
            Key: items[i].file
          };
          var photoData = await s3.getObject(getParams).promise();
          
          responseObject = {
            photo: photoData.Body.buffer,
            title: items[i].title,
            desc: items[i].desc,
            likes: items[i].likes,
            uploadDate: items[i].uploadDate
          };

          responseData.push(responseObject);
          prevTitle = items[i].title;
        }
        statusCode = 200;
        console.debug(responseData);
        response.status(statusCode).send(responseData);
      }
      catch(e) {
        console.debug("Could not retrieve photos", e);
      }
      console.debug("Retrieval successful");
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
    var statusCode = 400;
    var message = "Empty";
    const reqTag = request.headers.tag;
    if (reqTag) {
      try {
        var queryParams = {
          TableName: "Files",
          IndexName: "tag-file-index",
          KeyConditionExpression: "#tag = :tag",
          ExpressionAttributeNames: {
            "#tag": "tag"
          },
          ExpressionAttributeValues: {
            ":tag": reqTag
          }
        };

        const queryData = await dynamodb.query(queryParams).promise();
        const items = queryData.Items;
        console.debug("Data Queried");
        console.debug(items);

        var fileKeys = [];

        var responseData = [];
        // Loop through photos to send all object data
        for (let i = 0; i < items.length; i++) {
          var getParams = {
            Bucket: BUCKET_NAME,
            Key: items[i].file
          };
          var photoData = await s3.getObject(getParams).promise();
            
          responseObject = {
            photo: photoData.Body.buffer,
            title: items[i].title,
            uploadDate: items[i].uploadDate
          };

          responseData.push(responseObject);
        }
        statusCode = 200;
        console.debug(responseData);
        response.status(statusCode).send(responseData);
      }
      catch(e) {
        console.debug("Could not retrieve information", e);
      }
    }
    else {
      response.status(statusCode).send(message);
    }
  })().catch(e => {
    console.debug("Something went wrong");
  });
};

/**
 * Retrieve all tags and one of their associated photos. 
 * @param {userID: Integer} request 
 * @param {[{tag: String, photo: Object}]} response 
 */
const getTags = (request, response) => {
  (async () => {
    var statusCode = 400;
    var message = "Nothing to see here folks";
    // I assume this line is supposed to check if the user is authenticated. Replace once authentication is done.
    if (true) {
      try {
        var scanParams = {
          TableName: "Files",
          ProjectionExpression: "#tag, #file",
          ExpressionAttributeNames: {
            "#tag": "tag",
            "#file": "file"
          }
        };

        console.debug("Scanning");
        const scanData = await dynamodb.scan(scanParams).promise();
        const items = scanData.Items;

        prevTag = "";
        var responseData = [];
        for (let i = 0; i < items.length; i++) {
          if (items[i].tag === prevTag) {
            continue;
          }
          var getParams = {
            Bucket: BUCKET_NAME,
            Key: items[i].file
          };
          var photoData = await s3.getObject(getParams).promise();

          var responseObject = {
            tag: items[i].tag,
            photo: photoData.Body.buffer
          };

          console.debug(responseObject);
          responseData.push(responseObject);
        }
        statusCode = 200;
        response.status(statusCode).send(responseData);
      }
      catch(e) {
        response.status(statusCode).send(message);
      }
    }
  })().catch(e => {
    console.debug("User is not authenticated");
  });
};
module.exports = {
  uploadFile,
  getPhotoSocial,
  getPhotoByTag,
  getTags
};