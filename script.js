const myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function () {return this.title + ", " + this.author + ", " + this.pages  + ", " + this.read}
}

function addBookToLibrary (title, author, pages, read) {
const book = new Book(title, author, pages, read);
myLibrary.push(book);
libraryContainer.textContent = myLibrary[0].info();
}



const libraryContainer = document.querySelector('#library-container');
const showDialogButton = document.querySelector('#show-dialog');
const dialog = document.getElementById('dialog');
const addButton = document.querySelector('#add');
const closeButton = document.querySelector('#close');

showDialogButton.addEventListener('click', () => {
dialog.showModal();
})

addButton.addEventListener('click', (event) => {
    event.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;
    const read = document.querySelector('#read').value;
    addBookToLibrary(title, author, pages, read);
    console.log(myLibrary);
    dialog.close();
})

closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.close();
})

