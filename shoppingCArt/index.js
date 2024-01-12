let cart = [];
let totalPrice = 0;

fetch('./products.json')
    .then(response => response.json())
    .then(products => {
        renderProducts(products);
    })
    .catch(error => console.error('Error fetching products:', error));

function renderProducts(products) {
    let productListContainer = document.getElementById('productList');

    products.forEach(product => {
        let productCard = document.createElement('div');
        productCard.className = 'product-card';

        let productName = document.createElement('h2');
        productName.textContent = product.name;

        let productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.name;

        let productPrice = document.createElement('p');
        productPrice.textContent = 'Price: $' + product.price.toFixed(2);

        let productQuantity = document.createElement('p');
        productQuantity.textContent = 'Quantity: ' + product.quantity;

        let productAddButton = document.createElement('button');
        productAddButton.textContent = 'ADD TO CART';
        productAddButton.addEventListener('click', () => addToCart(product));

        productCard.appendChild(productName);
        productCard.appendChild(productImage);
        productCard.appendChild(productPrice);
        productCard.appendChild(productQuantity);
        productCard.appendChild(productAddButton);

        productListContainer.appendChild(productCard);
    });
}

function addToCart(product) {
    const existingCartItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingCartItemIndex !== -1) {
        // If the item is already in the cart, update the quantity
        cart[existingCartItemIndex].quantityInCart += 1;
    } else {
        // If the item is not in the cart, add it
        cart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: product.quantity,
            quantityInCart: 1 // Initial quantity is 1
        });
    }

    updateCartUI();
}

console.log(cart);
function updateCartUI() {
    // Update the shopping cart list
    let cartList = document.getElementById('cartList');
    cartList.innerHTML = '';
    let cartEmptyMessage = document.getElementById('cartEmptyMessage');

    if (cart.length === 0) {
        // Display a message when the cart is emptys
        // cartEmptyMessage.style.display = 'block';
    } else {
        //  let cartEmptyMessage = document.getElementById('cartEmptyMessage');
        // cartEmptyMessage.style.display = 'none';

        totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantityInCart, 0);

        cart.forEach(item => {
            let cartItemCard = document.createElement('div');
            cartItemCard.className = 'cart-item-card';

            let itemName = document.createElement('h3');
            itemName.textContent = item.name;

            let itemImage = document.createElement('img');
            itemImage.src = item.image;
            itemImage.alt = item.name;

            let itemPrice = document.createElement('p');
            itemPrice.textContent = 'Price: $' + item.price.toFixed(2);

            let itemQuantity = document.createElement('p');
            itemQuantity.textContent = 'Quantity: ' + item.quantityInCart;

            let addQtyButton = document.createElement('button');
            addQtyButton.textContent = 'Add Qty';
            addQtyButton.addEventListener('click', () => updateCartItemQuantity(item, 1));

            let removeQtyButton = document.createElement('button');
            removeQtyButton.textContent = 'Remove Qty';
            removeQtyButton.addEventListener('click', () => updateCartItemQuantity(item, -1));

            cartItemCard.appendChild(itemName);
            cartItemCard.appendChild(itemImage);
            cartItemCard.appendChild(itemPrice);
            cartItemCard.appendChild(itemQuantity);
            cartItemCard.appendChild(addQtyButton);
            cartItemCard.appendChild(removeQtyButton);

            cartList.appendChild(cartItemCard);
        });
    }

    // Update total price
    let totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.textContent = totalPrice.toFixed(2);

    calculateAveragePrice();
}

function updateCartItemQuantity(item, quantityChange) {
    cart = cart.map(cartItem => {
        if (cartItem.id === item.id) {
            return { ...cartItem, quantityInCart: Math.max(0, cartItem.quantityInCart + quantityChange) };
        }
        return cartItem;
    });

    updateCartUI();

}

function calculateAveragePrice() {
    let averagePrice = cart.length > 0 ? totalPrice / cart.length : 0;
    let averagePriceElement = document.getElementById('averagePrice');
    averagePriceElement.textContent = averagePrice.toFixed(2);
}
// calculateAveragePrice()

function clearCart() {
    cart.length = 0;
    calculateAveragePrice()
    totalPrice = 0
    updateCartUI();
    console.log(cart);
}

document.getElementById('filterDropdown').addEventListener('change', sortCart);
function sortCart() {
    const sortBy = document.getElementById('filterDropdown').value;

    if (sortBy === 'name') {
        cart.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
        cart.sort((a, b) => a.price - b.price);
    }

    updateCartUI();
}