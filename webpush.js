const webpush = require("web-push");
const dotenv = require('dotenv');
const path = require('path'); 
dotenv.config({ path: path.join(__dirname, '.env') });
//dotenv.config();
const { PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY,DB_NAME } = process.env;

 webpush.setVapidDetails(
  "mailto:jolivei@gmail.com",
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
); 
//console.log(PUBLIC_VAPID_KEY,PRIVATE_VAPID_KEY,DB_NAME);

module.exports = webpush;
