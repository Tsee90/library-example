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
const errorMessage = document.querySelector('#error-message');

//New Book button shows input dialog
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
    const check = checkInputs(title, author, pages);//Will return true or an error message
    if (check === true){
        addBookToLibrary(title, author, pages, read);
        errorMessage.textContent = '';
        bookForm.reset();
        dialog.close();
    }else{
        errorMessage.textContent = check;
    }
});

//Checks user inputs and returns true or appropriate error message
function checkInputs (title, author, pages) {
    if (title === '') {
        return 'Please add title';
    }else if (author === '') {
        return 'Please add author';
    }else if (pages === '' | Number.isNaN(parseInt(pages)) | parseInt(pages) < 1) {
        return 'Please enter positive integer page number';
    }else if (parseInt(pages) > 1000000000){
        return 'Over a million pages? Really?';
    }else {
        return true;
    }
}

//Reset form
const clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', (event) =>{
    event.preventDefault();
    bookForm.reset();
    errorMessage.textContent = '';
});


//Close form
const closeButton = document.querySelector('#close');
closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    errorMessage.textContent = '';
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
    const index = myLibrary.length.toString();//To string for logical consistency
    const book = new Book(title, author, pages, read, index);
    myLibrary.push(book);
    updateLibraryDisplay(book);
}

function removeBookFromLibrary (index) {
    //Select all divs inside library container and remove the one equal to index
    const libraryBooks = library.querySelectorAll('.book');
    libraryBooks.forEach((div) => {
        if (div.book.index === index) {
            div.remove();
        }
    });
    //Update display container
    const displayList = displayContainer.querySelectorAll('.book-display');
    displayList.forEach((div) => {
        if(div.book.index === index){
            div.remove();
        }
    })
    //Update myLibrary to remove indexed book
    myLibrary = myLibrary.filter((book) => book.index !== index);
    //Update all the books with their new indexes
    myLibrary.forEach((book, index) => {
        book.index = index.toString();
    })
}

/* 
    All of the creation functions below take a book object as an argument. This allows the created object to store a reference to the book object it is associated with so that it can pull an up to date reference to any of it's properties. Allows for consistency and flexibility in changing the code.
*/
function createRemoveButton(book) {
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.book = book;//Store book object reference inside button
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', (event) => {
        const value = event.target.book.index;//Retrieve current index of book
        removeBookFromLibrary(value);
    })
    return removeButton;
}

function createUpdateReadButton(book) {
    const updateReadButton = document.createElement('button');
    updateReadButton.book = book;//Store book object reference inside button
    updateReadButton.className = 'update-button';
    if (myLibrary[book.index].read === 'Yes') {
        updateReadButton.textContent = 'Mark As Unread';
    } else {
        updateReadButton.textContent = 'Mark As Read';
    }
    updateReadButton.addEventListener('click', (event) => {
        const value = event.target.book.index;//Retrieve current index of book
        if (myLibrary[value].read === 'Yes') {
            myLibrary[value].read = 'No'
            updateReadButton.textContent = 'Mark As Read';
        } else {
            myLibrary[value].read = 'Yes'
            updateReadButton.textContent = 'Mark As Unread';
        }
        //Update display
        const displayList = displayContainer.querySelectorAll('.book-display');
        displayList.forEach((div) => {
            if (parseInt(value) === parseInt(div.book.index)){
                const bookInfo = div.querySelector('#book-info');
                bookInfo.innerHTML = myLibrary[book.index].info();
            }
        });
        
    });
    return updateReadButton;
}

function createExitButton (book) {
    const exitButton = document.createElement('button');
    exitButton.textContent = 'x';
    exitButton.book = book;//Store book object reference inside button
    exitButton.className = 'exit-button';
    exitButton.addEventListener('click', (event) => {
        const value = event.target.book.index;//Retrieve current index of book
        //Find book in display list and remove
        const displayList = displayContainer.querySelectorAll('.book-display');
        displayList.forEach((div) => {
            if (parseInt(value) === parseInt(div.book.index)){
                div.remove();
                const libraryBooks = library.querySelectorAll('.book');
                libraryBooks.forEach((div) => {
                    if (parseInt(value) === parseInt(div.book.index)){
                        div.classList.remove('focused');
                    }
                });
            }
        });
    });
    return exitButton;
}

//Updates the library display and makes title clickable to reveal book information and remove button
function updateLibraryDisplay (book) {   
    const bookOnShelf = document.createElement('div');
    bookOnShelf.book = book;//Store book object reference inside div
    bookOnShelf.className = 'book';
    bookOnShelf.textContent = book.title;
    bookOnShelf.style.backgroundColor = getRandomColor();
    bookOnShelf.addEventListener('click', (event) => {
        const clickBook = event.target.book;
        const check = checkDisplay(clickBook);//Checks if book is already in the display as to not duplicate. Returns false if not found
        if (!check) {
            //Book is not found, creates a new card for display
            const bgColor = window.getComputedStyle(event.target).backgroundColor;
            const card = createCard(clickBook, bgColor);
            displayContainer.appendChild(card);
            event.target.classList.add('focused');
        } else {
            //Book is found, removes the card display but does not remove the book from array
            const displayList = displayContainer.querySelectorAll('.book-display');
            displayList.forEach((div) => {
                if(event.target.book.index === div.book.index){
                    displayContainer.removeChild(div);
                    event.target.classList.remove('focused');
                    check = true;
                }
            });
        }
    });
    library.appendChild(bookOnShelf);
}

//Creates a card element and returns it
function createCard(book, bgColor) {
    const bookDisplay = document.createElement('div');
    bookDisplay.style.borderColor = bgColor;
    bookDisplay.className = 'book-display';
    bookDisplay.book = book;//Store book object reference inside card
    const bookInfo = document.createElement('div');
    bookInfo.id = 'book-info';
    const bookButtons = document.createElement('div');
    bookButtons.id = 'book-buttons';
    bookInfo.innerHTML = book.info();
    const updateReadButton = createUpdateReadButton(book);
    bookButtons.appendChild(updateReadButton);
    const removeButton = createRemoveButton(book);
    bookButtons.appendChild(removeButton);
    const exitButton = createExitButton(book);
    bookDisplay.appendChild(bookInfo);
    bookDisplay.appendChild(bookButtons);
    bookDisplay.appendChild(exitButton);
    return bookDisplay;
}

//Checks if card is already on display. Returns false if not found
function checkDisplay (book) {
    const display = displayContainer.querySelectorAll('.book-display');
    let check = false;
    display.forEach((div) => {
        if (div.book.index === book.index){
            check = true;
        }
    });
     return check;
}

function getRandomColor() {
    //Array of pastel colors for red, green, blue, orange, yellow, purple
    const colors = [
        '#FFB3BA', 
        '#AEC6CF', 
        '#77DD77', 
        '#FDFD96', 
        '#CBAACB', 
        '#FFB347'  
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

//Add starting books as filler
addBookToLibrary('The Hitchhicker\'s Guide to the Galaxy', 'Douglas Adams', '224', 'Yes');
addBookToLibrary('Hard-boiled Wonderland and the End of the World', 'Haruki Murakami', '416', 'Yes');
addBookToLibrary('Dune', 'Frank Herbert', '412', 'No');
addBookToLibrary('Misery', 'Stephen King', '432', 'Yes');
addBookToLibrary('The Hobbit', 'J.R.R Tolkien', '304', 'No');
addBookToLibrary('Dark Matter', 'Blake Crouch','342', 'Yes');













