// Load the SDK for JavaScript
var AWS = require('aws-sdk');
var uuid = require('uuid'); // Use this later to generate a unique identifier to prevent collisions?
//var fs = require('fs');

// Set the Region. us-west-1 is Northern California.
AWS.config.update({region: 'us-west-1'});

// Constants. Put this in a separate config file?
const BUCKET_NAME = 'cmpe172-project2-bucket'

// initialize s3, rekognition, and dynamoDB Document Client
var s3 = new AWS.S3();
var rekognition = new AWS.Rekognition();
var dynamodb = new AWS.DynamoDB.DocumentClient();


const uploadFile = (request, response) => {
  (async () => {
    var statusCode = 400;
    var message = "File does not exist"
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
          console.log("File successfully uploaded")
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
          console.log("Labels detected")
          console.log(rekogData)
          const labels = rekogData.Labels;
          var labelNames = []
          labels.forEach( async (label) => {
            // Put names of labels inside labelNames
            labelNames.push(label.Name)
    
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
            console.log("Added Item: ", tagData);
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
          console.log("Added Item:", fileData);
          statusCode = 200;
          message = "Upload successful";
        }
      }
      catch (e) {
        console.log("Upload error", e);
      }
    }
    response.status(statusCode).send(message);
  })().catch(e => {
    console.log("Something went wrong");
  });
};

//uploadFileAsync(process.argv[2])

module.exports = {
    uploadFile
};