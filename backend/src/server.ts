import express from "express";
import allRoutes from "./routes/index";
import cookieParser from "cookie-parser";
const server = express();
import cors from "cors";
import { errorMiddleware } from "./middleware/errorMiddleware";
server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
server.use(express.json());
server.use(cookieParser());
server.use(allRoutes);
server.use(errorMiddleware);
server.listen(4000, () => {
  console.log("server running in port 4000");
});
