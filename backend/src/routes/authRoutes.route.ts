import { Router } from "express";
const router = Router();
router.get("/login", (req, res) => {
  res.send("this is login page");
});
router.post("/login", (req, res) => {
  res.json({ message: "post request sent to login page" });
});
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/register", (req, res) => {
  res.send("this is register page");
});
router.post("/register", (req, res) => {
  res.json({ message: "post request to register page" });
});
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/logout",(req,res)=>{res.json({"message":"this is logout page"})})
export default router;
