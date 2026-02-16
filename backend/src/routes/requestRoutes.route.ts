import Router from "express";
const router = Router();
router.get("/requests", (req, res) => {
  res.send("gets all requests used to be viewed by manager");
});
router.get("/requests/:id", (req, res) => {
  const id = req.params.id;
  res.send(`gets a specific request with id ${id}`);
});

router.post("/requests", (req, res) => {
  res.json({ message: "used to create a request" });
});
router.post("/requests/:id/aprove", (req, res) => {
  const id = req.params.id;
  res.json({ message: `aproves the specific request with id ${id}` });
});
router.post("/requests/:id/reject", (req, res) => {
  const id = req.params.id;
  res.json({ message: `rejects the specific request with id ${id}` });
});
router.post("/requests/:id/cancel", (req, res) => {
  const id = req.params.id;
  res.json({ message: `cancels the specific request with id ${id}` });
});
export default router;
