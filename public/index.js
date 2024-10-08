const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "." });
});
app.get("/:name", (req, res) => {
  const name = req.params.name;
  console.log("file name: ", name);
  console.log("TOKEN: ", process.env.TOKEN);
  res.sendFile(name, { root: "." });
});
const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log("Server started on port ", `http://localhost:${port}`);
});
