const mongoose = require("mongoose");

const approvedBooksSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const approvedBook = mongoose.model("approvedBook", approvedBooksSchema);

module.exports = approvedBook;
