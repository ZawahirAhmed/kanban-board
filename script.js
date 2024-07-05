let isDarkMode = false;
let cardIdCounter = 0;
let editingCard = null;

document.addEventListener("DOMContentLoaded", () => {
    openModal('auth-modal');
});

function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function signUp() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (username && password) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        Swal.fire({
            icon: 'success',
            title: 'Sign up successful!',
            text: 'Please log in.',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            document.getElementById('signup').classList.add('hidden');
            document.getElementById('login').classList.remove('hidden');
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill in all fields.'
        });
    }
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username === localStorage.getItem('username') && password === localStorage.getItem('password')) {
        closeModal('auth-modal');
        openBoard(); // Open the board after successful login
        Swal.fire({
            icon: 'success',
            title: 'Login successful!',
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Invalid username or password.'
        });
    }
}

function openBoard() {
    document.getElementById('auth-modal').style.display = 'none'; // Hide auth modal
    document.getElementById('board').style.display = 'block'; // Show the board
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
}

function addCard(columnId) {
    const cardText = prompt('Enter card text:');
    if (cardText) {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.textContent = cardText;
        card.id = `card-${cardIdCounter++}`;
        card.ondragstart = dragStart;
        card.ondblclick = () => openEditModal(card);
        card.onclick = deleteCard;

        document.getElementById(columnId).appendChild(card);
    }
}

function openEditModal(card) {
    editingCard = card;
    openModal('edit-modal');
}

function saveEditedCard() {
    const title = document.getElementById('edit-card-title').value;
    const date = document.getElementById('edit-card-date').value;
    const progress = document.getElementById('edit-card-progress').value;

    if (editingCard) {
        // Update card details
        editingCard.textContent = title;
        // Update other properties as needed (date, progress)
        closeModal('edit-modal');
        Swal.fire({
            icon: 'success',
            title: 'Card updated!',
            showConfirmButton: false,
            timer: 1500
        });
    }
}

function deleteCard(event) {
    if (confirm('Delete this card?')) {
        event.target.remove();
    }
}

function deleteAllCards() {
    Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'This will delete all cards. This action cannot be undone!',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete all!'
    }).then((result) => {
        if (result.isConfirmed) {
            document.querySelectorAll('.card-container').forEach(container => {
                container.innerHTML = '';
            });
            Swal.fire({
                icon: 'success',
                title: 'All cards deleted!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.effectAllowed = 'move';
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event, columnId) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');
    const card = document.getElementById(cardId);
    document.getElementById(columnId).appendChild(card);
}
