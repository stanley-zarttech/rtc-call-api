const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();
const filePath = "./public/rtccallapi_external.js";

const socketUrl = process.env.SOCKET_URL;
const token = process.env.TOKEN //|| "replacement done";
const domain = process.env.DOMAIN;

console.log("token: ", token);
const fileContent = fs.readFileSync(filePath, "utf8");
console.log("content: ", fileContent);
const updatedContent = fileContent
  //   .replace(/SOCKET_URL_PLACEHOLDER/g, socketUrl)
  .replace(/replace-token/i, token);
//   .replace(/DOMAIN_PLACEHOLDER/g, domain);
console.log("file content again: ", updatedContent);

fs.writeFileSync(filePath, updatedContent);
