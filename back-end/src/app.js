var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
//----------------------
// const CognitoExpress=require("cognito-express");
// const authenticatedRoute=express.Router();

// const cognitoExpress=new CognitoExpress({
//   region: "us-west-2",
//   cognitoUserPoolID: "us-west-2_wf2PodP2N",
//   tokenUse: "access",
//   tokenExpriration: 3600000
// });
// //authenticate All API under authenticatedROute router
// authenticatedRoute.use(function(req,res,next){
//   let accessTokenFromClient=req.headers.accesstoken;
//   if(!accessTokenFromClient) 
//     return res.status(401).send("Access Token missing from header");
//   cognitoExpress.validate(accessTokenFromClient,function(err,response){
//     if(err)
//       return res.status(401).send(err);
//     else{
//       res.locals.user=response;
//       next();
//     }
//   });
// });
// //define routes that need authentication check
// authenticatedRoute.get("/api",function(req,res,next){
//   res.send("200");
// });


// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());




app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
