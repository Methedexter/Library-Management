const express = require("express");
const Book = require("../models/books");
const ApprovedBook = require("../models/approvedBooks")
const RequestedBook = require("../models/requestedBooks")
const User = require("../models/user");
const app = express.Router();

app.post("/add-book", async (req, res) => {
  const book = await new Book(req.body).save();
  if (book) {
    return res.json({ status: "success" });
  } else {
    return res.status(404).json({ message: "Errorx" });
  }
});

app.post('/approve-request', async (req, res)=> {
    const {bookTitle, username} = req.body
    const book = await Book.findOne({title : bookTitle})
    const user = await User.findOne({username : username})
    const deleteReq = await RequestedBook.findOneAndDelete({bookId : book._id, userId : user._id})
    const approvedBook = await new ApprovedBook({bookId : book._id, userId : user._id}).save()
    if(approvedBook && deleteReq) {
        return res.json({ status : "successfully Approved" });
    }
    else {
        return res.status(404).json({ message: "Errorx" });
    }
})

app.post('/search-books', async (req, res) => {
  const title = req.body.bookTitle
  const regex = new RegExp(title, "i");
  const books = await Book.find({title : {$regex : regex}})
  if (books && books.length > 0) {
      return res.json({status: "success", books: books });
  } else {
      return res.json({status: "error", message: "No books found" });
  }
})

app.delete('/delete-book', async (req, res) => {
  const title = req.body.bookTitle
  const book = await Book.findOne({title : title})
  const deleteBook = await Book.findOneAndDelete({_id : book._id})
  const deleteReqBook = await RequestedBook.deleteMany({bookId : book._id})
  const deleteApprovBook = await ApprovedBook.deleteMany({bookId : book._id})
  if(deleteBook && deleteReqBook && deleteApprovBook) {
    return res.json({status : "Successfully deleted books"})
  }
  else {
    return res.status(400).json({message : "error"})
  }
})

app.get("/requested-books", async (req, res) => {
  const requestedbooks = await RequestedBook.find()
  .populate({
    path: "bookId",
    model: "Book"
  })
  .populate({
    path: "userId",
    model: "User",
    select: "username"
  });
  if(requestedbooks && requestedbooks.length > 0) {
    return res.json({status : "success", data : requestedbooks})
  }
  else {
    return res.json({status : "error", message : "No Applications found"})
  }
})

module.exports = app;
