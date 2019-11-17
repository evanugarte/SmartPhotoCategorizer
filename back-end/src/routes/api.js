// Load the SDK for JavaScript
var AWS = require("aws-sdk");
// Use this later to generate a unique identifier to prevent collisions?
var uuid = require("uuid");
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
    const { email, title, desc } = request.body;
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
          // Setting up rekognition parameters
          var rekogParams = {
            Image: {
              Bytes: fileContent
            },
            MaxLabels: 10,
            MinConfidence: 70
          };

          // Detect labels with Rekognition
          const rekogData =
            await rekognition.detectLabels(rekogParams).promise();
          const labels = rekogData.Labels;
          var labelNames = [];
          labels.forEach(async (label) => {
            // Put names of labels inside labelNames
            labelNames.push(label.Name);

            // Set up dynamoDB params
            const d = new Date();
            var uploadDate = (d.getMonth() + 1) + "/" +
              d.getDate() + "/" + d.getFullYear();
            var fileParams = {
              TableName: "Files",
              Item: {
                "file": newFileName,
                "tag": label.Name,
                "email": email,
                "title": title,
                "desc": desc,
                "likes": 0,
                "uploadDate": uploadDate
              }
            };

            // Put tag item in table so we can query for files based on tags.
            const fileData = await dynamodb.put(fileParams).promise();
          });
          statusCode = 200;
          message = "Upload successful";
        }
      }
      catch (e) {
        console.error("Upload error", e);
      }
    }
    response.status(statusCode).send(message);
  })().catch(e => {
    console.error("Something went wrong", e);
  });
};

/**
 * Retrieve all photos uploaded by user.
 * @param {email: String} request 
 * @param {[{photo: Object, desc: String,
 * uploadDate: String, title: String, likes: String}]} response 
 */
const getPhotoSocial = (request, response) => {
  (async () => {
    var statusCode = 400;
    var message = "User does not exist";
    const reqEmail = request.query.email;
    // For now this will be in the headers. Modify later maybe.
    if (reqEmail) {
      try {
        // Query for information based on input email.
        // Use email index to search.
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
        prevFile = "";
        for (let i = 0; i < items.length; i++) {
          if (items[i].file === prevFile) {
            continue;
          }
          // Get picture data from S3 to send in response.
          var getParams = {
            Bucket: BUCKET_NAME,
            Key: items[i].file
          };
          var photoData = await s3.getObject(getParams).promise();

          responseObject = {
            photo: photoData.Body,
            title: items[i].title,
            desc: items[i].desc,
            likes: items[i].likes,
            uploadDate: items[i].uploadDate
          };

          responseData.push(responseObject);
          prevFile = items[i].file;
        }
        statusCode = 200;
        response.status(statusCode).send(responseData);
      }
      catch (e) {
        console.error("Could not retrieve photos", e);
      }
    }
    else {
      response.status(statusCode).send(message);
    }
  })().catch(e => {
    console.error("Something went wrong", e);
  });
};

const updateProfile = (request, response) => {
  (async () => {
    var statusCode = 400;
    var message = "sever error";
    const { email, password, userid } = request.body;
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
        TableName: "Users",
        Key: {
          "userid": userid,
        },
        UpdateExpression: "set email = :e, password = :p, avatar = :a",
        ExpressionAttributeValues: {
          ":e": email,
          ":p": password,
          ":a": avatarName
        },
        ReturnValues: "UPDATED_NEW"
      };
      try {
        const uploadAvatar = await s3.upload(uploadParams).promise();
        dynamodb.update(updateProfileParams, (err, data) => {
          if (err) {
            console.error("Unable to update item. Error JSON:",
              JSON.stringify(err, null, 2));
            response.status(statusCode).send(message);

          } else {
            statusCode = 200;
            message = "update profile successful";
            response.status(statusCode).send(message);
          }
        });

      }
      catch (e) {
        console.error(e);
        response.status(statusCode).send(e);

      }
    } else {
      const updateProfileParams = {
        TableName: "Users",
        Key: {
          "userid": userid,
        },
        UpdateExpression: "set email = :e, password = :p",
        ExpressionAttributeValues: {
          ":e": email,
          ":p": password
        },
        ReturnValues: "UPDATED_NEW"
      };
      try {
        dynamodb.update(updateProfileParams, (err, data) => {
          if (err) {
            console.error("Unable to update item. Error JSON:",
              JSON.stringify(err, null, 2));
            response.status(statusCode).send(err);

          } else {
            statusCode = 200;
            message = "update profile successful";
            response.status(statusCode).send(message);
          }
        });
      }
      catch (e) {
        console.error(e);
        response.status(statusCode).send(e);
      }
    }
  })().catch(e => {
    console.error(e);
    response.status(statusCode).send(e);

  });
};

const getprofile = (request, response) => {
  (async () => {
    var statusCode = 400;
    var message = "sever error";
    const userid = request.query.userid;
    if (userid) {
      try {
        var queryParams = {
          TableName: "Users",
          Key: {
            "userid": userid
          }
        };

        const queryData = await dynamodb.get(queryParams).promise();
        const profileData = queryData.Item;
        var responseObject = null;
        if (profileData.avatar !== "N/A") {
          var getParams = {
            Bucket: BUCKET_NAME,
            Key: profileData.avatar
          };
          try {
            var photoData = await s3.getObject(getParams).promise();
            responseObject = {
              avatar: photoData.Body,
              email: profileData.email,
              password: profileData.password,
              userid: profileData.userid
            };
          } catch (e) {
            console.error("can not find the photo", e);
            response.status(statusCode).send(e);
          }
        } else {
          responseObject = {
            avatar: null,
            email: profileData.email,
            password: profileData.password,
            userid: profileData.userid
          };
        }
        statusCode = 200;
        response.status(statusCode).send(responseObject);
      }
      catch (e) {
        console.error("Could not retrieve information", e);
        response.status(statusCode).send(e);
      }
    } else {
      response.status(statusCode).send(message);
    }
  })().catch(e => {
    console.error(e);
    response.status(statusCode).send(e);
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
    const reqTag = request.query.tag;
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
        response.status(statusCode).send(responseData);
      }
      catch (e) {
        console.error("Could not retrieve information", e);
      }
    } else {
      response.status(statusCode).send(message);
    }
  })().catch(e => {
    console.error("Something went wrong", e);
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
    // I assume this line is supposed to check if the user is authenticated.
    // Replace once authentication is done.
    try {
      var scanParams = {
        TableName: "Files",
        ProjectionExpression: "#tag, #file",
        ExpressionAttributeNames: {
          "#tag": "tag",
          "#file": "file"
        }
      };

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
        responseData.push(responseObject);
      }
      statusCode = 200;
      response.status(statusCode).send(responseData);
    }
    catch (e) {
      response.status(statusCode).send(message);
    }
  })().catch(e => {
    console.error("User is not authenticated", e);
  });
};

module.exports = {
  uploadFile,
  updateProfile,
  getprofile,
  getPhotoSocial,
  getPhotoByTag,
  getTags
};
