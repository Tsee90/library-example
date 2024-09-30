let myLibrary = [];

function Book(title, author, pages, read, index) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.index = index;
    this.info = function () {return this.title + ", " + this.author + ", " + this.pages  + ", " + this.read}
}

function addBookToLibrary (title, author, pages, read) {
    const index = myLibrary.length;
    const book = new Book(title, author, pages, read, index);
    myLibrary.push(book);
    updateLibraryDisplay(book);
}

function removeBookFromLibrary (index) {
    const libraryBooks = library.querySelectorAll('.book');
    libraryBooks.forEach((div) => {
        const id = div.id;
        if (id === index) {
            div.remove();
        }
    })
    myLibrary = myLibrary.filter((book) => book.index !== index);
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

function updateLibraryDisplay (book) {   
    const buttons = bookDisplay.querySelectorAll('button');
    buttons.forEach(button => button.remove());
    const bookText = document.createElement('div');
    bookText.className = 'book';
    bookText.id = book.index;
    bookText.textContent = book.title;
    bookText.addEventListener('click', (event) => {
        event.preventDefault();
        bookDisplay.textContent = book.info();
        const index = book.index;
        const removeButton = createRemoveButton(index);
        bookDisplay.appendChild(removeButton);

    })
    library.appendChild(bookText);
}

const library = document.querySelector('#library');
const showDialogButton = document.querySelector('#show-dialog');
const dialog = document.getElementById('dialog');
const addButton = document.querySelector('#add');
const clearButton = document.querySelector('#clear');
const closeButton = document.querySelector('#close');
const bookForm = document.querySelector('#book-form');
const bookDisplay = document.querySelector('#book-display');


showDialogButton.addEventListener('click', () => {
dialog.showModal();
});

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

clearButton.addEventListener('click', (event) =>{
    event.preventDefault();
    bookForm.reset();
});

closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.close();
});

