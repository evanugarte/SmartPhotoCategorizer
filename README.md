[![CircleCI](https://circleci.com/gh/evanugarte/SmartPhotoCategorizer.svg?style=svg)](https://circleci.com/gh/evanugarte/SmartPhotoCategorizer)
# SmartPhotoCategorizer
University Name: http://www.sjsu.edu

Course: [Enterprise Software](http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE172.html)

Professor: [Sanjay Garje](https://www.linkedin.com/in/sanjaygarje/)

Student: [Minh Phan](https://www.linkedin.com/in/minhphan156/);
        [Evan Ugarte](https://www.linkedin.com/in/evan-ugarte/);
        Roy Zhang;
        [Yanyan Yang](https://www.linkedin.com/in/yanyan-yang-20b614148/)
        

## Project Introduction
Our application is called Photo Share. It is a web application that allows registered users to upload, delete, search and share their photos with family and friends. The app will auto categorized uploaded photos by its objects as well as detect any inappropriate content. The app can be tested with test account credentials [user id: tester, password: Cmpe172!]
It uses a 3-Tier Application Architecture: 
- The presentation tier is built with React and hosted in an S3 bucket
- The business logic tier is built with Express and Node.js
- The database tier is built with AWS DynamoDB

### Feature List
- Social login with Google or Facebook account
- User account register with user name and password combination
- Upload, delete, modify,  search photos
- User profile page
- Auto categorized photo by its object
- Social View page 
- Reliable, autoscaling, content distribution  powered by AWS Services 


## Sample Demo Screenshots

## Pre-requisites Set Up
### Cloud Services
- S3 buckets to hold images and stage website
- DynamoDB tables to store user information and references to photo objects
- Route53 for domain name and routing
- ELB, ASG, and EC2 to host our server and direct traffic
- CloudFront for content delivery
- SNS and CloudWatch for notifications about our system
- Rekognition for label detection on images
- Cognito user pool for user authentication
### Local Software
- Visual Studio Code. 
- ESlint plugin.
- NodeJS. Modules with npm.
- Git
### Local Configurations
- Install Node.js, Visual Studio Code, ESlint plugin, and Redux DevTools plugin for web browser.
- Clone github repository.
- npm install all required modules.
- Get AWS access and secret keys from administrator. Set up configuration file with these keys.
- Run npm start in '/back-end' to start server.
- Run npm start in '/' to start react scripts.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
