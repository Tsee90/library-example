/* 
Library example for The Odin Project Lesson
Coded by Theo See aka Tsee90
*/

//Declare global variables
let myLibrary = [];
const library = document.querySelector('#library');
const dialog = document.getElementById('dialog');
const bookForm = document.querySelector('#book-form');
const displayContainer = document.querySelector('#display-container');

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
    this.info = function () {return "<strong>Title:</strong> " + this.title + "<br><strong>Author:</strong> " + this.author + "<br><strong>Pages:</strong> " + this.pages  + "<br><strong>Read?</strong> " + this.read}
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
    });
    const displayList = displayContainer.querySelectorAll('.book-display');
    displayList.forEach((div) => {
        const id = div.id;
        if(id === index){
            div.remove();
        }
    })
    //Update myLibrary to remove indexed book
    myLibrary = myLibrary.filter((book) => book.index !== index);
    //Update all the books with their new indexes
    myLibrary.forEach((book, index) => {
        book.index = index;
    })
}

function createRemoveButton(index) {
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.value = index;
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', (event) => {
        const value = event.target.value;
        removeBookFromLibrary(value);
    })
    return removeButton;
}

function createUpdateReadButton(index) {
    const updateReadButton = document.createElement('button');
    updateReadButton.value = index;
    updateReadButton.className = 'update-button';
    if (myLibrary[index].read === 'Yes') {
        updateReadButton.textContent = 'Mark As Unread';
    } else {
        updateReadButton.textContent = 'Mark As Read';
    }
    updateReadButton.addEventListener('click', (event) => {
        const value = event.target.value;
        if (myLibrary[value].read === 'Yes') {
            myLibrary[value].read = 'No'
            updateReadButton.textContent = 'Mark As Read';
        } else {
            myLibrary[value].read = 'Yes'
            updateReadButton.textContent = 'Mark As Unread';
        }
        const displayList = displayContainer.querySelectorAll('.book-display');
        displayList.forEach((div) => {
            if (parseInt(index) === parseInt(div.id)){
                const bookInfo = div.querySelector('#book-info');
                bookInfo.innerHTML = myLibrary[index].info();
            }
        });
        
    });
    return updateReadButton;
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
        let check = false;
        const displayList = displayContainer.querySelectorAll('.book-display');
        if (displayList.length > 0){
            displayList.forEach((div) => {
                if(event.target.id === div.id){
                    displayContainer.removeChild(div);
                    event.target.classList.remove('focused');
                    check = true;
                }
            });
        }
        if (check === false){
            const bookDisplay = document.createElement('div');
            bookDisplay.className = 'book-display';
            bookDisplay.id = book.index;
            const bookInfo = document.createElement('div');
            bookInfo.id = 'book-info';
            const bookButtons = document.createElement('div');
            bookButtons.id = 'book-buttons';
            bookText.classList.add('focused');
            bookInfo.innerHTML = book.info();
            const index = book.index;
            const updateReadButton = createUpdateReadButton(index);
            bookButtons.appendChild(updateReadButton);
            const removeButton = createRemoveButton(index);
            bookButtons.appendChild(removeButton);
            bookDisplay.appendChild(bookInfo);
            bookDisplay.appendChild(bookButtons);
            displayContainer.appendChild(bookDisplay);
        }
    });
    library.appendChild(bookText);
    
}

addBookToLibrary('The Hitchhicker\'s Guide to the Galaxy', 'Douglas Adams', '224', 'Yes');
addBookToLibrary('Hard-boiled Wonderland and the End of the World', 'Haruki Murakami', '416', 'Yes');
addBookToLibrary('Dune', 'Frank Herbert', '412', 'No');
addBookToLibrary('Misery', 'Stephen King', '432', 'Yes');













