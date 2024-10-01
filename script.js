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
    const check = checkInputs(title, author, pages);
    if (check === true){
        addBookToLibrary(title, author, pages, read);
        bookForm.reset();
        dialog.close();
    }else{
        errorMessage.textContent = check;
    }
});

function checkInputs (title, author, pages) {
    if (title === '') {
        return 'Please add title';
    }else if (author === '') {
        return 'Please add author';
    }else if (pages === '' | parseInt(pages) !== 'number' | parseInt(pages) < 1) {
        return 'Please enter positive integer page number';
    }else {
        return true;
    }
}

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
            if (parseInt(value) === parseInt(div.id)){
                const bookInfo = div.querySelector('#book-info');
                bookInfo.innerHTML = myLibrary[index].info();
            }
        });
        
    });
    return updateReadButton;
}

function createExitButton (index) {
    const exitButton = document.createElement('button');
    exitButton.textContent = 'x';
    exitButton.value = index;
    exitButton.className = 'exit-button';
    exitButton.addEventListener('click', (event) => {
        const value = event.target.value;
        const displayList = displayContainer.querySelectorAll('.book-display');
        displayList.forEach((div) => {
            if (parseInt(value) === parseInt(div.id)){
                div.remove();
                const libraryBooks = library.querySelectorAll('.book');
                libraryBooks.forEach((div) => {
                    if (parseInt(value) === parseInt(div.id)){
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
    const bookText = document.createElement('div');
    bookText.className = 'book';
    bookText.id = book.index; //This will allow us to reference target the book div within the library container
    bookText.textContent = book.title;
    bookText.style.backgroundColor = getRandomColor();
    //Make title clickable
    bookText.addEventListener('click', (event) => {
        event.preventDefault();
        let check = false;
        const displayList = displayContainer.querySelectorAll('.book-display');
        if (displayList.length > 0){
            //checks if book is already displayed
            displayList.forEach((div) => {
                if(event.target.id === div.id){
                    displayContainer.removeChild(div);
                    event.target.classList.remove('focused');
                    check = true;
                }
            });
        }
        //If book is not already displayed, create a new book display
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
            const exitButton = createExitButton(index);
            bookDisplay.appendChild(bookInfo);
            bookDisplay.appendChild(bookButtons);
            bookDisplay.appendChild(exitButton);
            displayContainer.appendChild(bookDisplay);
        }
    });
    library.appendChild(bookText);
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













