document.getElementById("borrowedBooks").addEventListener('click', (e) => {
    e.preventDefault();
    fetch('/borrowed-books')
    .then(response => response.json())
    .then(res => {
        if(res.status === 'success'){
            const mainElement = document.querySelector('main');
            mainElement.innerHTML = `
            <div class="container mt-5 bg-dark">
                <div class="row g-4">
                    ${res.data.map(book => `
                        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div class="card">
                                <div class="card-body bg-dark text-white">
                                    <h5 class="card-title">${book.title}</h5>
                                    <h6 class="card-subtitle mb-2 text-white">Author: ${book.author}</h6>
                                    <p class="card-text book-description">${book.description}</p>
                                    <a href = "">View Book</a>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <p class="text-white">Rating: ${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</p>
                                        <button class="btn btn-success return-btn" data-book-title="${book.title}">
                                            Return
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
            document.querySelectorAll('.return-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const bookTitle = this.getAttribute('data-book-title');

                    fetch('/return-book', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ bookTitle: bookTitle }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        let responseDiv = document.getElementById('ReturnResponse');
                        responseDiv.innerText = data.status
                        responseDiv.style.display = 'block';
                        setTimeout(function() {
                        responseDiv.style.display = 'none';
                        }, 2000);
                    })
                    .catch(() => alert('Error processing your request'));
                    document.getElementById("borrowedBooks").click()
                });
            });
        }
        else if(res.status === 'error') {
            const mainElement = document.querySelector('main');
            mainElement.innerHTML = `<div class= "text-white text-center fs-1">${res.message}</div>`;
        }
    })
})