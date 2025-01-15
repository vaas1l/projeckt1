const header = document.querySelector('.header');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');


// Toggle меню при натисканні на кнопку
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Фіксувати хедер, коли меню активне
    if (navLinks.classList.contains('active')) {
        header.classList.add('fixed');  // Додати клас для фіксації хедера
    } else {
        header.classList.remove('fixed');  // Видалити клас, коли меню закрито
    }
});





function redirectToCart() {
    window.location.href = "shopping-cart/index.html";
}

function addToCart(productId, productName, productPrice, productImage) {
  // Отримуємо поточний кошик
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Шукаємо, чи товар вже є в кошику
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    // Збільшуємо кількість, якщо товар існує
    existingItem.quantity++;
  } else {
    // Додаємо новий товар до кошика
    cart.push({
      id: productId,
      name: productName,
      price: parseFloat(productPrice),
      image: productImage,
      quantity: 1
    });
  }

  // Зберігаємо оновлений кошик
  localStorage.setItem('cart', JSON.stringify(cart));

  // Показуємо повідомлення про додавання
  showTemporaryMessage(`${productName} додано до кошика!`);
}

// Функція для відображення повідомлення
function showTemporaryMessage(message) {
  // Створюємо контейнер для повідомлення
  const messageBox = document.createElement('div');
  messageBox.textContent = message;
  messageBox.style.position = 'fixed';
  messageBox.style.bottom = '20px';
  messageBox.style.right = '20px';
  messageBox.style.backgroundColor = '#0077cc';
  messageBox.style.color = '#fff';
  messageBox.style.padding = '10px 20px';
  messageBox.style.borderRadius = '5px';
  messageBox.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  messageBox.style.zIndex = '1000';

  // Додаємо повідомлення на сторінку
  document.body.appendChild(messageBox);

  // Прибираємо повідомлення через 3 секунди
  setTimeout(() => {
    messageBox.remove();
  }, 3000);
}

// Додаємо слухачі до кнопок "Add to Cart"
document.addEventListener('DOMContentLoaded', () => {
  const buyButtons = document.querySelectorAll('.buy-button');

  buyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productCard = button.closest('.product-card');
      const productId = parseInt(productCard.getAttribute('data-id'));
      const productName = productCard.querySelector('.product-name').textContent;
      const productPrice = productCard.querySelector('.product-price').textContent.replace('$', '');
      const productImage = productCard.querySelector('.product-image').src;

      addToCart(productId, productName, productPrice, productImage);
    });
  });
});