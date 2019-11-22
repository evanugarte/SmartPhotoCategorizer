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
    const { userid, title, desc } = request.body;
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
            MaxLabels: 5,
            MinConfidence: 75
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
              TableName: "Photos",
              Item: {
                "file": newFileName,
                "tag": label.Name,
                "userid": userid,
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
    const userid = request.query.userid;

    
    // For now this will be in the headers. Modify later maybe.
    if (userid) {
      try {
        // Query for information based on input email.
        // Use email index to search.
        var sharedPhotosParams = {
          TableName: "SharedPhotos",
          KeyConditionExpression: "#userid = :userid",
          ExpressionAttributeNames: {
            "#userid": "userid"
          },
          ExpressionAttributeValues: {
            ":userid": userid
          }
        };
        const sharedPhotosQueryData = await dynamodb
          .query(sharedPhotosParams).promise();
        const sharedPhotos = sharedPhotosQueryData.Items;
        var queryParams = {
          TableName: "Photos",
          IndexName: "userid-index",
          KeyConditionExpression: "#userid = :userid",
          ExpressionAttributeNames: {
            "#userid": "userid"
          },
          ExpressionAttributeValues: {
            ":userid": userid
          }
        };
        const queryData = await dynamodb.query(queryParams).promise();
        var items = queryData.Items;
        items = items.concat(sharedPhotos);
        var responseData = [];
        var arrayFileName = [];
        // Loop through photos to send all object data
        for (let i = 0; i < items.length; i++) {
          if (arrayFileName.includes(items[i].file)) {
            continue;
          }
          // Get picture data from S3 to send in response.
          var getParams = {
            Bucket: BUCKET_NAME,
            Key: items[i].file
          };
          var photoData = await s3.getObject(getParams).promise();

          responseObject = {
            file: items[i].file,
            photo: photoData.Body,
            title: items[i].title,
            desc: items[i].desc,
            likes: items[i].likes,
            uploadDate: items[i].uploadDate,
            sharedBy: items[i].sharedBy || null
          };
          arrayFileName.push(items[i].file);
          responseData.push(responseObject);
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
        if ("avatar" in profileData) {
          var getParams = {
            Bucket: BUCKET_NAME,
            Key: profileData.avatar
          };
          try {
            var photoData = await s3.getObject(getParams).promise();
            responseObject = {
              avatar: photoData.Body,
              email: profileData.email,
              userid: profileData.userid
            };
          } catch (e) {
            console.error("can not find the photo", e);
            statusCode = 304;
            response.status(statusCode).send(e);
          }
        } else {
          responseObject = {
            avatar: null,
            email: profileData.email,
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

const signup =  (request, response) => {
  (async () => {
    var statusCode = 400;
    var message = "sever error";
    const userid = request.body.userid;
    const email = request.body.email;
    if (email){
      var usersParams = {
        TableName: "Users",
        Item: {
          "userid": userid,
          "email": email
        }
      };
      try {
        var queryUsers = {
          TableName: "Users",
          IndexName: "email-index",
          KeyConditionExpression: "#email = :email",
          ExpressionAttributeNames: {
            "#email": "email"
          },
          ExpressionAttributeValues: {
            ":email": email
          }
        };
        var usersQueryData = await dynamodb.query(queryUsers).promise();       
        if (usersQueryData.Items.length > 0){
          const currentUserInfo = {
            userid: usersQueryData.Items[0].userid,
            email: email
          };
          statusCode = 200;
          response.status(statusCode).send(currentUserInfo);
        } else {
          const fileData = await dynamodb.put(usersParams).promise();
          const newUserInfo = {
            userid: userid,
            email: email
          };
          statusCode = 200;
          response.status(statusCode).send(newUserInfo);
        }
      } catch (e) {
        console.error(e);
        response.status(statusCode).send(message);
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
    const reqTag = request.query.tag.replace(/^\w/, c => c.toUpperCase());
    if (reqTag) {
      try {
        var queryParams = {
          TableName: "Photos",
          IndexName: "tag-index",
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
 * @param {[{tag: String}]} response 
 */
const getTags = (request, response) => {
  (async () => {
    var statusCode = 400;
    var message = "Nothing to see here folks";
    // I assume this line is supposed to check if the user is authenticated.
    // Replace once authentication is done.
    const userid = request.query.userid;
    if (userid) {
      try {
        var scanParams = {
          TableName: "Photos",
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
          var responseObject = {
            tag: items[i].tag,
          };
          responseData.push(responseObject);
        }
        statusCode = 200;
        response.status(statusCode).send(responseData);
      }
      catch (e) {
        response.status(statusCode).send(message);
      }
    }
  })().catch(e => {
    console.error("User is not authenticated", e);
  });
};

//delete photo in s3 bucket and dynomoDB by userid 
const deletePhotoById = (request, response) => {
  (async () => {
    var statusCode = 400;
    var message = "delete photo error from begin";
    const {file, userid} = request.body;
    if (userid){
      // Parameters to delete object from s3 bucket
      var deleteParams={
        Bucket: BUCKET_NAME,
        Key: file
      };
      try {
        // query for dynamodb data we want to delete
        var queryParams = {
          TableName: "Photos",
          KeyConditionExpression: "#file = :file",
          ExpressionAttributeNames: {
            "#file": "file"
          },
          ExpressionAttributeValues: {
            ":file": file
          }
        };
        const deleteQueryData = await dynamodb.query(queryParams).promise();
        const items = deleteQueryData.Items;

        // loop through the queried items and delete them one by one
        for (let i = 0; i < items.length; i++) {
          var deleteEntryParams = {
            TableName: "Photos",
            Key: {
              file: items[i].file,
              tag: items[i].tag
            }
          };
          const deleteEnt = await dynamodb.delete(deleteEntryParams).promise();
        }
        
        // delete object from s3
        const deleteObject = await s3.deleteObject(deleteParams).promise();
        response.status(200).send("Deleted");
      }
      catch (e){
        console.error("can't delete photo in dynamodb");
        response.status(statusCode).send(e);
      };
    }
    else {
      response.status(statusCode).send("can't find user id");
    };
  })().catch(e=>{
    console.error("something went wrong,check server and try again", e);
    response.status(statusCode).send(message);
  });
};

const sharePhotos = (request, response) => {
  (async () => {
    var statusCode = 400;
    var message = "delete photo error from begin";
    const {file, userid, sharedByEmail, sharedEmail} = request.body;
    if (userid){
      // Parameters to delete object from s3 bucket
      try {
        var queryParams = {
          TableName: "Photos",
          KeyConditionExpression: "#file = :file",
          ExpressionAttributeNames: {
            "#file": "file"
          },
          ExpressionAttributeValues: {
            ":file": file
          }
        };
        const deleteQueryData = await dynamodb.query(queryParams).promise();
        const items = deleteQueryData.Items;
        var queryUsers = {
          TableName: "Users",
          IndexName: "email-index",
          KeyConditionExpression: "#email = :email",
          ExpressionAttributeNames: {
            "#email": "email"
          },
          ExpressionAttributeValues: {
            ":email": sharedEmail
          }
        };
        var usersQueryData = await dynamodb.query(queryUsers).promise();
        items.forEach(item =>  item.userid = usersQueryData.Items[0].userid );
        items.forEach(async (item) => {
          var fileParams = {
            TableName: "SharedPhotos",
            Item: {
              "file": item.file,
              "userid": item.userid,
              "title": item.title,
              "desc": item.desc,
              "uploadDate": item.uploadDate,
              "sharedBy": sharedByEmail
            }
          };
          const fileData = await dynamodb.put(fileParams).promise();
        });
        message = "Photos shared";
        response.status(200).send(message);
      }
      catch (e){
        console.error("Photo sharing error in DynamoDB");
        response.status(statusCode).send(e);
      };
    }
    else {
      response.status(statusCode).send("can't find user id");
    };
  })().catch(e=>{
    console.error("something went wrong,check server and try again", e);
    response.status(statusCode).send(message);
  });
};
module.exports = {
  uploadFile,
  updateProfile,
  getprofile,
  getPhotoSocial,
  getPhotoByTag,
  getTags,
  deletePhotoById,
  signup,
  sharePhotos
};
