const mongoose = require("mongoose");

const requestedBooksSchema = new mongoose.Schema({
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

const RequestedBook = mongoose.model("RequestedBook", requestedBooksSchema);

module.exports = RequestedBook;
