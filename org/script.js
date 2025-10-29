const STORAGE_KEY = 'inventory-products';

let products = loadProducts();
let editingId = null;

function loadProducts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const brand = document.getElementById('productBrand').value.trim();
    const quantity = document.getElementById('productQuantity').value.trim();
    const price = document.getElementById('productPrice').value.trim();

    if (!name || !brand || !quantity || !price) {
        alert('Please fill in all fields');
        return;
    }

    if (parseFloat(quantity) < 0 || parseFloat(price) < 0) {
        alert('Quantity and price must be positive numbers');
        return;
    }

    const product = {
        id: generateId(),
        name: name,
        brand: brand,
        quantity: parseInt(quantity),
        price: parseFloat(price).toFixed(2)
    };

    products.push(product);
    saveProducts();
    clearForm();
    renderTable();
}

function updateProduct() {
    const name = document.getElementById('productName').value.trim();
    const brand = document.getElementById('productBrand').value.trim();
    const quantity = document.getElementById('productQuantity').value.trim();
    const price = document.getElementById('productPrice').value.trim();

    if (!name || !brand || !quantity || !price) {
        alert('Please fill in all fields');
        return;
    }

    if (parseFloat(quantity) < 0 || parseFloat(price) < 0) {
        alert('Quantity and price must be positive numbers');
        return;
    }

    const index = products.findIndex(p => p.id === editingId);
    if (index !== -1) {
        products[index] = {
            id: editingId,
            name: name,
            brand: brand,
            quantity: parseInt(quantity),
            price: parseFloat(price).toFixed(2)
        };
        saveProducts();
        cancelEdit();
        renderTable();
    }
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        editingId = id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productBrand').value = product.brand;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productPrice').value = product.price;

        document.getElementById('addBtn').style.display = 'none';
        document.getElementById('updateBtn').style.display = 'inline-block';
        document.getElementById('cancelBtn').style.display = 'inline-block';
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderTable();
    }
}

function cancelEdit() {
    editingId = null;
    clearForm();
    document.getElementById('addBtn').style.display = 'inline-block';
    document.getElementById('updateBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'none';
}

function clearForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productBrand').value = '';
    document.getElementById('productQuantity').value = '';
    document.getElementById('productPrice').value = '';
}

function clearAllProducts() {
    if (confirm('Are you sure you want to clear all products? This action cannot be undone.')) {
        products = [];
        saveProducts();
        renderTable();
    }
}

function renderTable(filteredProducts = null) {
    const tbody = document.getElementById('inventoryBody');
    const emptyMessage = document.getElementById('emptyMessage');
    const displayProducts = filteredProducts !== null ? filteredProducts : products;

    tbody.innerHTML = '';

    if (displayProducts.length === 0) {
        emptyMessage.classList.add('show');
        return;
    }

    emptyMessage.classList.remove('show');

    displayProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHtml(product.name)}</td>
            <td>${escapeHtml(product.brand)}</td>
            <td>${product.quantity}</td>
            <td>$${product.price}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="window.editProduct('${product.id}')">Edit</button>
                    <button class="btn-delete" onclick="window.deleteProduct('${product.id}')">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function filterProducts(searchTerm) {
    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderTable(filtered);
}

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

document.getElementById('addBtn').addEventListener('click', addProduct);
document.getElementById('updateBtn').addEventListener('click', updateProduct);
document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
document.getElementById('resetBtn').addEventListener('click', clearForm);
document.getElementById('clearAllBtn').addEventListener('click', clearAllProducts);
document.getElementById('clearInventoryBtn').addEventListener('click', clearAllProducts);

document.getElementById('searchInput').addEventListener('input', (e) => {
    filterProducts(e.target.value);
});

document.getElementById('productName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (editingId) {
            updateProduct();
        } else {
            addProduct();
        }
    }
});

document.getElementById('productBrand').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (editingId) {
            updateProduct();
        } else {
            addProduct();
        }
    }
});

document.getElementById('productQuantity').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (editingId) {
            updateProduct();
        } else {
            addProduct();
        }
    }
});

document.getElementById('productPrice').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (editingId) {
            updateProduct();
        } else {
            addProduct();
        }
    }
});

renderTable();