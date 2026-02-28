import express from "express";
import allRoutes from "./routes/index";
import cookieParser from "cookie-parser";
const server = express();
server.use(express.json());
server.use(cookieParser());
server.get("/", (req, res) => {
  res.send("this is homepage");
});
server.use(allRoutes);
server.listen(4000, () => {
  console.log("server running in port 4000");
});
