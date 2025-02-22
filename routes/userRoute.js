const express = require("express");
const Book = require("../models/books");
const RequestedBook = require("../models/requestedBooks")
const approvedBook = require("../models/approvedBooks")
const app = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/get-books', async (req, res) => {
    try {
        const books = await Book.find();
        if (books && books.length > 0) {
            const userId = req.session.user._id;
            const requestedBooks = await RequestedBook.find({ userId });
            const approvedBooks = await approvedBook.find({ userId });

            const booksWithRequestStatus = books.map(book => {
                const hasRequested = requestedBooks.some(request => request.bookId.toString() === book._id.toString());
                const isApproved = approvedBooks.some(approved => approved.bookId.toString() === book._id.toString());
                return { ...book.toObject(), hasRequested, isApproved };
            });
            res.json({status: "success", books: booksWithRequestStatus });
        } else {
            res.json({status: "error", message: "No books found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

app.post("/request-book", async (req, res) => {
    const bookTitle = req.body.bookTitle
    const book = await Book.findOne({title : bookTitle})
    const requested = await new RequestedBook({bookId : book._id, userId : req.session.user._id}).save()
    if(requested) {
        return res.json({ status : "success" });
    }
    else {
        return res.status(404).json({ message: "Errorx" });
    }


})

app.get('/borrowed-books', async (req, res) => {
    const list = await approvedBook.find({userId : req.session.user._id})
    if(!list || list.length < 1) {
        return res.json({status : "error", message : "No books found"})
    }
    const bookIds = list.map(item => item.bookId); 
    const books = await Book.find({_id: { $in: bookIds }});

    if(books && books.length > 0) {
        return res.json({status : "success", data : books})
    }
    else {
        return res.json({status : "error", message : "No books found"})
    }
})

app.delete('/return-book', async (req, res) => {
    const bookTitle = req.body.bookTitle
    const book = await Book.findOne({title : bookTitle})
    const deleted = await approvedBook.findOneAndDelete({bookId : book._id, userId : req.session.user._id})
    if(deleted) {
        return res.json({status : "Successfully book returned"})
    }
    else {
        return res.status(400).json({error : "error while deleting"})
    }
})

app.post('/search-books', async (req, res) => {
    const title = req.body.bookTitle
    const regex = new RegExp(title, "i");
    const books = await Book.find({title : {$regex : regex}})
    if (books && books.length > 0) {
        const userId = req.session.user._id;
        const requestedBooks = await RequestedBook.find({ userId });
        const approvedBooks = await approvedBook.find({ userId });

        const booksWithRequestStatus = books.map(book => {
            const hasRequested = requestedBooks.some(request => request.bookId.toString() === book._id.toString());
            const isApproved = approvedBooks.some(approved => approved.bookId.toString() === book._id.toString());
            return { ...book.toObject(), hasRequested, isApproved };
        });
        res.json({status: "success", books: booksWithRequestStatus });
    } else {
        res.json({status: "error", message: "No books found" });
    }
})

module.exports = app;
