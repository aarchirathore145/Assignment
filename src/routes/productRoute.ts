const express = require("express");
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNotesStats
} = require("../controllers/notesController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateUser);
router.get("/stats/summary", getNotesStats);
router.route("/").get(getAllNotes).post(createNote);
router.route("/:id").get(getNoteById).put(updateNote).delete(deleteNote);

module.exports = router;
export {};

