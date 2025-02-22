document.getElementById("applications").addEventListener("click", (e) => {
  e.preventDefault();
  fetch("/requested-books")
    .then((response) => response.json())
    .then((res) => {
      if (res.status === "success") {
        const mainElement = document.querySelector("main");
        mainElement.innerHTML = `
            <table class="table table-dark table-bordered mt-5">
            <thead>
            <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Description</th>
                <th>Rating</th>
                <th>Requested By</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            ${res.data.map((item) => `
                <tr>
                    <td>${item.bookId.title}</td>
                    <td>${item.bookId.author}</td>
                    <td class ="book-description">${item.bookId.description}</td>
                    <td>${"★".repeat(item.bookId.rating)}${"☆".repeat(
                5 - item.bookId.rating
                )}</td>
                    <td>${item.userId.username}</td>
                    <td>
                        <button class="btn btn-success approve-btn" data-book-title="${item.bookId.title}" data-username = "${item.userId.username}">Approve</button>
                    </td>
                </tr>`).join("")}
            </tbody>
            </table>`;
            document.querySelectorAll('.approve-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const bookTitle = this.getAttribute('data-book-title');
                    const username = this.getAttribute('data-username')
                    fetch('/approve-request', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ bookTitle: bookTitle, username : username }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        let responseDiv = document.getElementById('ApproveResponse');
                        responseDiv.innerText = data.status
                        responseDiv.style.display = 'block';
                        setTimeout(function() {
                        responseDiv.style.display = 'none';
                        }, 2000);
                        document.getElementById("applications").click()
                    })
                    .catch(() => alert('Error processing your request'));
                    
                });
            });
        }
        else {
            const mainElement = document.querySelector('main');
            mainElement.innerHTML = `<div class= "text-white text-center fs-1">${res.message}</div>`;
        }
    });
});
