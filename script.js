/* 
Library example for The Odin Project Lesson
Coded by Theo See aka Tsee90
*/

//Declare global variables
let myLibrary = [];
const library = document.querySelector('#library');
const dialog = document.getElementById('dialog');
const bookForm = document.querySelector('#book-form');
const bookDisplay = document.querySelector('#book-display');

const showDialogButton = document.querySelector('#show-dialog');
showDialogButton.addEventListener('click', () => {
dialog.showModal();
});

const addButton = document.querySelector('#add');
addButton.addEventListener('click', (event) => {
    event.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;
    const read = document.querySelector('input[name="read"]:checked').value;
    addBookToLibrary(title, author, pages, read);
    bookForm.reset();
    dialog.close();
});

const clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', (event) =>{
    event.preventDefault();
    bookForm.reset();
});

const closeButton = document.querySelector('#close');
closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.close();
});

//Create a book object
function Book(title, author, pages, read, index) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.index = index;
    this.info = function () {return "Title: " + this.title + "<br>Author: " + this.author + "<br>Pages: " + this.pages  + "<br>Read? " + this.read}
}

function addBookToLibrary (title, author, pages, read) {
    const index = myLibrary.length;
    const book = new Book(title, author, pages, read, index);
    myLibrary.push(book);
    updateLibraryDisplay(book);
}

function removeBookFromLibrary (index) {
    //Select all divs inside library container and remove the one equal to index
    const libraryBooks = library.querySelectorAll('.book');
    libraryBooks.forEach((div) => {
        const id = div.id;
        if (id === index) {
            div.remove();
        }
    })
    //Update myLibrary to remove indexed book
    myLibrary = myLibrary.filter((book) => book.index !== index);
    //Update all the books with their new indexes
    myLibrary.forEach((book, index) => {
        book.index = index;
    })
    bookDisplay.textContent = '';
}

function createRemoveButton(index) {
    const removeButton = document.createElement('button');
    removeButton.value = index;
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', (event) => {
        const value = event.target.value;
        removeBookFromLibrary(value);
    })
    return removeButton;
}

//Updates the library display and makes title clickable to reveal book information and remove button
function updateLibraryDisplay (book) {   
    const bookText = document.createElement('div');
    bookText.className = 'book';
    bookText.id = book.index; //This will allow us to reference target the book div within the library container
    bookText.textContent = book.title;
    //Make title clickable
    bookText.addEventListener('click', (event) => {
        event.preventDefault();
        bookDisplay.innerHTML = book.info();
        const index = book.index;
        const removeButton = createRemoveButton(index);
        bookDisplay.appendChild(removeButton);
    })
    library.appendChild(bookText);
}














