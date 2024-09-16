document.addEventListener('DOMContentLoaded', () => {
    const musicListElement = document.getElementById('music-list');
    const cartElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    const paginationElement = document.getElementById('pagination');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');
    const closeLogin = loginForm.querySelector('.close');
    const closeRegister = registerForm.querySelector('.close');
    const loginFormInner = document.getElementById('login-form-inner');
    const registerFormInner = document.getElementById('register-form-inner');

    let musicList = [];
    let cart = [];
    let currentPage = 1;
    const itemsPerPage = 3;
    let users = [];
    let loggedInUser = null;

    // Load data from JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            musicList = data;
            renderMusicList();
        });

    function renderMusicList() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedMusic = musicList.slice(start, end);

        musicListElement.innerHTML = '';
        paginatedMusic.forEach(music => {
            const item = document.createElement('div');
            item.className = 'music-item';
            item.innerHTML = `
                <span>${music.title} - ${music.artist} - R$ ${music.price.toFixed(2)}</span>
                <button onclick="addToCart(${music.id})">Adicionar ao Carrinho</button>
            `;
            musicListElement.appendChild(item);
        });

        renderPagination();
    }

    function renderPagination() {
        paginationElement.innerHTML = '';
        const totalPages = Math.ceil(musicList.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('button');
            pageItem.textContent = i;
            pageItem.onclick = () => {
                currentPage = i;
                renderMusicList();
            };
            paginationElement.appendChild(pageItem);
        }
    }

    window.addToCart = function(musicId) {
        const music = musicList.find(m => m.id === musicId);
        if (music) {
            cart.push(music);
            renderCart();
        }
    };

    function renderCart() {
        cartElement.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            const cartItem = document.createElement('li');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                ${item.title} - R$ ${item.price.toFixed(2)}
                <button onclick="removeFromCart(${index})">Remover</button>
            `;
            cartElement.appendChild(cartItem);
        });
        totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        renderCart();
    };

    loginLink.addEventListener('click', () => {
        loginForm.style.display = 'block';
    });

    registerLink.addEventListener('click', () => {
        registerForm.style.display = 'block';
    });

    logoutLink.addEventListener('click', () => {
        loggedInUser = null;
        localStorage.removeItem('loggedInUser');
        updateAuthStatus();
    });

    closeLogin.addEventListener('click', () => {
        loginForm.style.display = 'none';
    });

    closeRegister.addEventListener('click', () => {
        registerForm.style.display = 'none';
    });

    loginFormInner.addEventListener('submit',

