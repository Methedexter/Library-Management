function renderBooks(data) {
  const mainElement = document.querySelector("main");
  mainElement.innerHTML = `
            <div class="container mt-5 bg-dark">
                <div class="row g-4">
                    ${data.books
                      .map(
                        (book) => `
                        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div class="card">
                                <div class="card-body bg-dark text-white">
                                    <h5 class="card-title">${book.title}</h5>
                                    <h6 class="card-subtitle mb-2 text-white">Author: ${
                                      book.author
                                    }</h6>
                                    <p class="card-text book-description">${
                                      book.description
                                    }</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <p class="text-white">Rating: ${"★".repeat(
                                          book.rating
                                        )}${"☆".repeat(5 - book.rating)}</p>
                                        <button class="btn btn-success request-btn" data-book-title="${
                                          book.title
                                        }" ${
                          book.isApproved || book.hasRequested ? "disabled" : ""
                        }>
                                            ${
                                              book.isApproved
                                                ? "Approved"
                                                : book.hasRequested
                                                ? "Requested"
                                                : "Request"
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
            `;
  document.querySelectorAll(".request-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const bookTitle = this.getAttribute("data-book-title");

      fetch("/request-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookTitle: bookTitle }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            this.textContent = "Requested";
            this.disabled = true;
          }
        })
        .catch(() => alert("Error processing your request"));
    });
  });
}

function noBooksfound(res) {
  const mainElement = document.querySelector('main');
  mainElement.innerHTML = `<div class= "text-white text-center fs-1">${res}</div>`;
}

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  fetch("/get-books")
    .then((response) => response.json())
    .then((data) => {
        if(data.status === 'success') {
            renderBooks(data);
        }
        else {
            noBooksfound();
        }
    })
    .catch(() => console.log("Error"));
});

document.getElementById("search").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("searchText").value
  console.log(title)
  fetch("/search-books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookTitle: title }),
  })
    .then((response) => response.json())
    .then((data) => {
        if(data.status === 'success') {
            renderBooks(data);
        }
        else {
            noBooksfound(data.message);
        }
    })
    .catch(() => console.log("Error"));
});
