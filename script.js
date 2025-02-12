const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if(bar) {
  bar.addEventListener('click', () => {
    nav.classList.add('active');
  })
};

if(close) {
  close.addEventListener('click', () => {
    nav.classList.remove('active');
  })
};

// script.js
let currentSlider = 0;

function moveSlider(direction) {
    const slides = document.querySelectorAll('.slider-item');
    const totalSlides = slides.length;

    // Hide current slide
    slides[currentSlider].classList.remove('active');

    // Update current slide index
    currentSlider = (currentSlider + direction + totalSlides) % totalSlides;

    // Show new slide
    slides[currentSlider].classList.add('active');

    // Move slider
    const slider = document.querySelector('.slider');
    slider.style.transform = `translateX(-${currentSlider * 100}%)`;
}

// Initialize the slider
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slider-item');
    slides[currentSlider].classList.add('active');
});

// Function to add product to cart
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProductIndex = cart.findIndex(item => item.name === name);

  if (existingProductIndex > -1) {
      // If the product already exists, increment the quantity
      cart[existingProductIndex].quantity += 1;
  } else {
      // If it's a new product, add it to the cart
      cart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}

// Event listener for add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function() {
      const name = this.getAttribute('data-name');
      const price = parseInt(this.getAttribute('data-price'));
      addToCart(name, price);
      alert(`${name} has been added to your cart!`); // Show alert once
  });
});

// Function to display cart items
function displayCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const tbody = document.querySelector('#cart tbody');
  tbody.innerHTML = ''; // Clear existing items

  let subtotal = 0;

  cart.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td><i class='bx bx-x-circle' onclick="removeFromCart('${item.name}')"></i></td>
          <td><img src="./img/products/${item.name.toLowerCase().replace(/ /g, '')}.jpg" alt="${item.name}"></td>
          <td>${item.name}</td>
          <td>₹${item.price}</td>
          <td><input type="number" value="${item.quantity}" onchange="updateQuantity('${item.name}', this.value)"></td>
          <td>₹${item.price * item.quantity}</td>
      `;
      tbody.appendChild(row);
      subtotal += item.price * item.quantity;
  });

  // Update subtotal in the cart total section
  document.querySelector('#subtotal td:last-child').innerText = `₹${subtotal}`;
}

// Function to remove item from cart
function removeFromCart(name) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.name !== name);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart(); // Refresh the cart display
}

// Function to update quantity
function updateQuantity(name, quantity) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = cart.find(item => item.name === name);
  if (item) {
      item.quantity = parseInt(quantity);
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCart(); // Refresh the cart display
  }
}

// Call displayCart on page load
document.addEventListener('DOMContentLoaded', displayCart);

//chartbot
 // Toggle chatbot window visibility
 function toggleChat() {
  const chatWindow = document.getElementById("chat-window");
  chatWindow.style.display = chatWindow.style.display === "block" ? "none" : "block";
}

// Function to generate random responses
function getRandomMessage(type) {
  const messages = {
      "order-status": [
          "📦 Your order is being packed and will be shipped soon!",
          "🚚 Your order is out for delivery!",
          "📅 Estimated delivery in 2-3 days!"
      ],
      "warranty": [
          "🔖 You can claim a 1-year warranty from the purchase date!",
          "💰 Refund policy: You can return items within 30 days!"
      ],
      "other-issue": [
          "❓ Please describe your issue, and we’ll assist you!",
          "📞 Contact support at support@example.com."
      ]
  };
  return messages[type][Math.floor(Math.random() * messages[type].length)];
}

// Function to fetch product suggestions (API Integration)
async function fetchProducts() {
  try {
      let response = await fetch("https://fakestoreapi.com/products/category/electronics");
      let products = await response.json();

      let randomProduct = products[Math.floor(Math.random() * products.length)];
      return `🛒 Check out this product: ${randomProduct.title} - $${randomProduct.price}`;
  } catch (error) {
      return "⚠️ Error fetching product suggestions.";
  }
}

// Function to send message and show response
async function sendMessage(type) {
  const chatMessages = document.getElementById("chat-messages");

  let userMessage = document.createElement("p");
  userMessage.classList.add("bot-message");
  userMessage.style.background = "#d1e7ff";
  userMessage.innerText = "✅ " + document.querySelector(`button[onclick="sendMessage('${type}')"]`).innerText;
  chatMessages.appendChild(userMessage);

  setTimeout(async () => {
      let botMessage = document.createElement("p");
      botMessage.classList.add("bot-message");

      if (type === "product-suggestions") {
          botMessage.innerText = await fetchProducts();
      } else if (type === "feedback") {
          document.getElementById("feedback-section").classList.remove("hidden");
          return;
      } else {
          botMessage.innerText = getRandomMessage(type);
      }

      chatMessages.appendChild(botMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1000);
}

// Function to handle star rating
function rate(stars) {
  let allStars = document.querySelectorAll("#stars span");
  allStars.forEach((star, index) => {
      star.classList.toggle("active", index < stars);
  });
  document.getElementById("feedback-result").innerText = `Thanks for rating us ${stars} stars! ⭐`;
}

