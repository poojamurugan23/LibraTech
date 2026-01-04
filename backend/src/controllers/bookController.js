const Book = require("../models/Book");

const addBook = async (req, res) => {
  try {
    const { title, author, isbn, totalCopies } = req.body;

    if (!title || !author || !isbn || totalCopies == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res
        .status(400)
        .json({ message: "Book with this ISBN already exists" });
    }

    const total = Number(totalCopies);
    if (Number.isNaN(total) || total < 0) {
      return res
        .status(400)
        .json({ message: "Total copies must be a non‑negative number" });
    }

    const book = new Book({
      title,
      author,
      isbn,
      totalCopies: total,
      issuedCopies: 0,
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error("Add book error:", error);
    res.status(500).json({ message: "Server error while adding book" });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({ message: "Server error while fetching books" });
  }
};

const issueBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available to issue" });
    }

    book.availableCopies = book.availableCopies - 1;
    book.issuedCopies = (book.issuedCopies || 0) + 1;
    const updatedBook = await book.save();

    res.json(updatedBook);
  } catch (error) {
    console.error("Issue book error:", error);
    res.status(500).json({ message: "Server error while issuing book" });
  }
};

const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies >= book.totalCopies) {
      return res
        .status(400)
        .json({ message: "All copies are already in library" });
    }

    book.availableCopies = book.availableCopies + 1;
    book.issuedCopies = Math.max(0, (book.issuedCopies || 0) - 1);
    const updatedBook = await book.save();

    res.json(updatedBook);
  } catch (error) {
    console.error("Return book error:", error);
    res.status(500).json({ message: "Server error while returning book" });
  }
};

module.exports = {
  addBook,
  getBooks,
  issueBook,
  returnBook,
};
