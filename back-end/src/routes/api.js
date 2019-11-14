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
          var fileParams = {
            TableName:"Files",
            Item: {
              "file": newFileName,
              "tags": labelNames,
              "desc": request.body.desc,
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

//uploadFileAsync(process.argv[2])
const updateProfile = (request,response) => {
  (async() => {
    var statusCode = 400;
    var message = "sever error";
    const email = request.body.email;
    const password = request.body.password;
    const userid = request.body.userid;

    if (request.file) {
      const avatar = request.file.buffer;
      const avatarName = uuid.v4() + request.file.originalname; 
      // Setting up S3 upload parameters
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: avatarName, 
        Body: avatar
      };
      const updateProfileParams = {
        TableName:"Users",
        Key: {
          "userid": userid,
        },
        UpdateExpression: "set email = :e, password = :p, avatar = :a",
        ExpressionAttributeValues:{
          ":e":email,
          ":p":password,
          ":a":avatarName
        },
        ReturnValues:"UPDATED_NEW"
      };
      try {
        const uploadAvatar = await s3.upload(uploadParams).promise();
        dynamodb.update(updateProfileParams, (err, data) => {
          if (err){
            console.debug("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            response.status(statusCode).send(message);

          } else {
            console.debug("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            statusCode = 200;
            message = "update profile successful";
            response.status(statusCode).send(message);
          }
        });
       
      }
      catch(e) {
        console.debug(e);
        response.status(statusCode).send(message);

      }
    } else {
      const updateProfileParams = {
        TableName:"Users",
        Key: {
          "userid": userid,
        },
        UpdateExpression: "set email = :e, password = :p",
        ExpressionAttributeValues:{
          ":e":email,
          ":p":password
        },
        ReturnValues:"UPDATED_NEW"
      };
      try {
        dynamodb.update(updateProfileParams, (err, data) => {
          if (err){
            console.debug("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            response.status(statusCode).send(message);

          } else {
            console.debug("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            statusCode = 200;
            message = "update profile successful";
            response.status(statusCode).send(message);
          }
        });
      }
      catch(e) {
        console.debug(e);
        response.status(statusCode).send(message);
      }
    }
  })().catch(e => {
    console.debug(e);
    response.status(statusCode).send(message);

  });
};

module.exports = {
  uploadFile,
  updateProfile
};