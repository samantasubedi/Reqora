import express from "express";
const server = express();
server.get("/", (req, res) => {
  res.send("this is homepage");
});
server.listen(4000, () => {
  console.log("server running in port 4000");
});
