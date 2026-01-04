const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    totalCopies: {
      type: Number,
      required: [true, "Total copies is required"],
      min: [0, "Total copies cannot be negative"],
    },
    availableCopies: {
      type: Number,
      required: [true, "Available copies is required"],
      min: [0, "Available copies cannot be negative"],
    },
    issuedCopies: {
      type: Number,
      default: 0,
      min: [0, "Issued copies cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.pre("validate", function () {
  if (this.availableCopies == null) {
    this.availableCopies = this.totalCopies;
  }
  if (this.issuedCopies == null) {
    this.issuedCopies = 0;
  }
});

module.exports = mongoose.model("Book", bookSchema);
