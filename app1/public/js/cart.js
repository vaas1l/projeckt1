// Завантажити товари з localStorage та відобразити в кошику
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
  
    cartItemsContainer.innerHTML = ""; // Очищаємо попередній вміст
  
    let totalPrice = 0;
  
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
  
      const row = `
        <tr>
          <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;"></td>
          <td>${item.name}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>
            <button onclick="changeQuantity(${item.id}, -1)">-</button>
            ${item.quantity}
            <button onclick="changeQuantity(${item.id}, 1)">+</button>
          </td>
          <td>$${itemTotal.toFixed(2)}</td>
          <td><button onclick="removeFromCart(${item.id})">Видалити</button></td>
        </tr>
      `;
      cartItemsContainer.innerHTML += row;
    });
  
    totalPriceElement.textContent = totalPrice.toFixed(2);
  }
  
  // Змінити кількість товару
  function changeQuantity(productId, delta) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity += delta;
  
      if (item.quantity <= 0) {
        // Видаляємо товар, якщо кількість <= 0
        removeFromCart(productId);
        return;
      }
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  }
  
  // Видалити товар з кошика
  function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
  
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  }
  
  // Очистити кошик
  function clearCart() {
    localStorage.removeItem('cart');
    loadCart();
  }
  
  // Додаємо слухач на кнопку "Clear Cart"
  document.addEventListener('DOMContentLoaded', () => {
    loadCart();
  
    const clearCartButton = document.getElementById('clear-cart');
    clearCartButton.addEventListener('click', clearCart);
  });