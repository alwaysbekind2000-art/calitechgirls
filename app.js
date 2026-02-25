const API_BASE = 'http://localhost:5000/api';
let allFoods = {};
let cart = [];
let currentClassification = 'All';

// Initialize the app
async function init() {
  await loadFoodItems();
  setupEventListeners();
  displayFoods();
}

// Load food items from backend
async function loadFoodItems() {
  try {
    const response = await fetch(`${API_BASE}/foods`);
    allFoods = await response.json();
  } catch (error) {
    console.error('Error loading food items:', error);
  }
}

// Display foods based on classification
function displayFoods() {
  const foodGrid = document.getElementById('foodGrid');
  foodGrid.innerHTML = '';

  let itemsToDisplay = [];

  if (currentClassification === 'All') {
    for (const classification in allFoods) {
      itemsToDisplay = itemsToDisplay.concat(allFoods[classification]);
    }
  } else {
    itemsToDisplay = allFoods[currentClassification] || [];
  }

  itemsToDisplay.forEach(food => {
    const foodCard = document.createElement('div');
    foodCard.className = 'food-card';
    foodCard.innerHTML = `
      <div class="food-info">
        <h3>${food.name}</h3>
        <p class="classification">${food.classification}</p>
        <p class="price">$${food.price.toFixed(2)}</p>
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${food.id}, '${food.name}', ${food.price})">
        Add to Cart
      </button>
    `;
    foodGrid.appendChild(foodCard);
  });
}

// Add item to cart
function addToCart(id, name, price) {
  cart.push({ id, name, price });
  updateCart();
  alert(`${name} added to cart!`);
}

// Update cart display
function updateCart() {
  const cartItemsDiv = document.getElementById('cartItems');
  const cartTotalSpan = document.getElementById('cartTotal');

  cartItemsDiv.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <span>${item.name} - $${item.price.toFixed(2)}</span>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsDiv.appendChild(cartItem);
  });

  cartTotalSpan.textContent = total.toFixed(2);
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Setup event listeners for classification buttons
function setupEventListeners() {
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentClassification = btn.dataset.classification;
      displayFoods();
    });
  });

  document.getElementById('checkoutBtn').addEventListener('click', checkout);
}

// Checkout function
async function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
    });
    const data = await response.json();
    alert(`Order placed! Order ID: ${data.orderId}`);
    cart = [];
    updateCart();
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Error placing order');
  }
}

// Start the app when page loads
document.addEventListener('DOMContentLoaded', init);