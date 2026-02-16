import { Router } from "express";
const router =Router()
router.get("/resources", (req, res) => {
  res.send("gets all resources");
});
router.get("/resources/:id", (req, res) => {
  const id = req.params.id;
  res.send(`gets details for a sepecific user with id ${id}`);
});

router.post("/resources", (req, res) => {
  res.json({ message: "used to add resources by admin" });
});
router.patch("/resources/:id", (req, res) => {
  const id = req.params.id;
  res.json({
    message: `used to update a particular resource details with id ${id}`,
  });
});
router.delete("/resources/:id", (req, res) => {
  const id = req.params.id;
  res.json({ message: `used to delete a specific resource with id ${id}` });
});
export default router