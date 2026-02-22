import express from "express";
import allRoutes from "./routes/index";
const server = express();
server.use(express.json());
server.get("/", (req, res) => {
  res.send("this is homepage");
});
server.use(allRoutes);
server.listen(4000, () => {
  console.log("server running in port 4000");
});
