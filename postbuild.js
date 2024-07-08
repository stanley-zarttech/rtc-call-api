const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();
const filePath = "./public/rtccallapi_external.js";

const socketUrl = process.env.SOCKET_URL;
const token = process.env.TOKEN;
const domain = process.env.DOMAIN;

console.log("token: ", token);
const fileContent = fs.readFileSync(filePath, "utf8");
const updatedContent = fileContent
  //   .replace(/SOCKET_URL_PLACEHOLDER/g, socketUrl)
  .replace(/{token:""}/, ` { token :${token}}`);
//   .replace(/DOMAIN_PLACEHOLDER/g, domain);

fs.writeFileSync(filePath, updatedContent);
