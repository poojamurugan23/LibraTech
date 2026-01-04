const express = require("express");
const {
  addBook,
  getBooks,
  issueBook,
  returnBook,
} = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addBook);
router.get("/", authMiddleware, getBooks);
router.post("/:id/issue", authMiddleware, issueBook);
router.post("/:id/return", authMiddleware, returnBook);

module.exports = router;
