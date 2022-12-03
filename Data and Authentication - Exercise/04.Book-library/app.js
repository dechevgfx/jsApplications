const booksURL = `http://localhost:3030/jsonstore/collections/books/`;
const form = document.querySelector("form");
let targetId = "";

function create(type, content, parentElement) {
    const element = document.createElement(type);

    if (content) {
        element.textContent = content;
    }
    if (parentElement) {
        parentElement.appendChild(element);
    }

    return element;
}

function attachEvents() {
    let loadBtn = document.querySelector("#loadBooks");

    loadBtn.addEventListener("click", loadAllBooks);
    form.addEventListener("submit", formSubmit);
}

async function loadAllBooks() {
    const tableBody = document.querySelector("tbody");
    tableBody.replaceChildren();

    try {
        const response = await fetch(`${booksURL}`);
        const data = await response.json();

        if (!response.ok || response.status != 200) {
            throw new Error(data.message);
        }

        Object.entries(data).forEach(([key, info]) => {
            let tableRow = create("tr", undefined, tableBody);
            tableRow.setAttribute("id", key);
            let titleTD = create("td", info.title, tableRow);
            let authorTD = create("td", info.author, tableRow);

            let buttonsTD = create("td", undefined, tableRow);
            let editBtn = create("button", "Edit", buttonsTD);
            let deleteBtn = create("button", "Delete", buttonsTD);

            tableBody.appendChild(tableRow);

            editBtn.addEventListener("click", editBook);
            deleteBtn.addEventListener("click", deleteBook);
        });
    } catch (error) {
        alert(error.message);
    }
}

async function editBook(event) {
    event.preventDefault();
    targetId = event.target.parentNode.parentNode.getAttribute("id");

    const response = await fetch(`${booksURL}${targetId}`);
    const data = await response.json();

    document.querySelector("form > h3").textContent = "Edit Form";
    document.querySelector("form button").textContent = "Save";

    let currTitle = document.getElementsByName("title")[0];
    let currAuthor = document.getElementsByName("author")[0];

    currTitle.value = data.title;
    currAuthor.value = data.author;
}

async function formSubmit(event) {
    event.preventDefault();

    let dataForm = new FormData(event.currentTarget);
    let title = dataForm.get("title");
    let author = dataForm.get("author");

    let h3Element = document.querySelector("form > h3");
    let btnElement = document.querySelector("form button");

    if (btnElement.textContent == "Save") {
        await fetch(`${booksURL}${targetId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author }),
        });

        h3Element.textContent = "FORM";
        btnElement.textContent = "Submit";
    } else {
        if (title == "" || author == "") {
            alert("Please fill the required fields!");
            return;
        }

        await fetch(`${booksURL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author }),
        });
    }

    form.reset();
    loadAllBooks();
}

async function deleteBook(event) {
    let targetId = event.target.parentNode.parentNode.getAttribute("id");

    await fetch(`${booksURL}${targetId}`, {
        method: "DELETE",
    });

    loadAllBooks();
}

attachEvents();
