import { Router } from "express";
const router=Router()
router.get("/users", (req, res) => {
  res.send("this gets all users for admin dashboard");
});
router.get("/users/:id", (req, res) => {
  const id = req.params.id;
  res.send(`this gets user data for specific user with id ${id}`);
});
router.post("/users", (req, res) => {
  res.json({ message: "this creates new user" });
});
router.patch("/users/:id", (req, res) => {
  res.json({
    message: "this edits the existing user info like name,personal details",
  });
});