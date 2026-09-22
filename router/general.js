const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        const userExists = users.some(user => user.username === username);

        if (!userExists) {
            users.push({
                username: username,
                password: password
            });

            return res.status(201).json({
                message: "User successfully registered. Now you can login"
            });
        } else {
            return res.status(409).json({
                message: "User already exists!"
            });
        }
    }

    return res.status(400).json({
        message: "Unable to register user. Please provide both username and password."
    });
});


// Get all books
public_users.get('/', (req, res) => {
    res.json(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});


// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const booksByAuthor = [];

    for (const bookId in books) {
        if (books[bookId].author === author) {
            booksByAuthor.push(books[bookId]);
        }
    }

    if (booksByAuthor.length > 0) {
        return res.json(booksByAuthor);
    }

    return res.status(404).json({
        message: "No books found by this author"
    });
});


// Get book details based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const booksByTitle = [];

    for (const bookId in books) {
        if (books[bookId].title === title) {
            booksByTitle.push(books[bookId]);
        }
    }

    if (booksByTitle.length > 0) {
        return res.json(booksByTitle);
    }

    return res.status(404).json({
        message: "No books found with this title"
    });
});


// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn] && books[isbn].reviews) {
        return res.json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Reviews not found for this book"
    });
});


// Task 11: Axios and async/await implementation

async function getAllBooks() {
    return await axios.get('http://localhost:5000/');
}

async function getBookByISBN(isbn) {
    return await axios.get(`http://localhost:5000/isbn/${isbn}`);
}

async function getBooksByAuthor(author) {
    return await axios.get(
        `http://localhost:5000/author/${encodeURIComponent(author)}`
    );
}

async function getBooksByTitle(title) {
    return await axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
    );
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;