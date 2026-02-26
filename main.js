function generateRef() {
    let random = Math.floor(Math.random() * 900000) + 100000;
    return "FDX-2026-" + random;
}

function increase() {
    let qty = document.getElementById("quantity");
    qty.value = parseInt(qty.value || 1) + 1;
    updateTotal();
}

function decrease() {
    let qty = document.getElementById("quantity");
    if (parseInt(qty.value) > 1) {
        qty.value = parseInt(qty.value) - 1;
        updateTotal();
    }
}

function updateTotal() {
    let quantity = parseInt(document.getElementById("quantity").value) || 1;
    let total = (quantity * 500) + 200;
    document.getElementById("totalDisplay").innerText = "Total: ₦" + total;
}

function sendOrder() {
    
    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value;
    let location = document.getElementById("location").value;
    let sweetType = document.getElementById("sweetType").value;
    let quantity = parseInt(document.getElementById("quantity").value) || 1;
    
    if (name === "" || phone === "" || location === "" || sweetType === "") {
        alert("Please fill all fields.");
        return;
    }
    
    let total = (quantity * 500) + 200;
    let refNumber = generateRef();
    
    let order = {
        ref: refNumber,
        name,
        phone,
        location,
        sweetType,
        quantity,
        total,
        date: new Date().toLocaleString()
    };
    
    let orders = JSON.parse(localStorage.getItem("fidexOrders")) || [];
    orders.push(order);
    localStorage.setItem("fidexOrders", JSON.stringify(orders));
    
    loadCustomerOrders();
    
    let message =
        "Hello FidEx Nuts,%0A%0A" +
        "Reference: " + refNumber + "%0A" +
        "Type: " + sweetType + "%0A" +
        "Quantity: " + quantity + "%0A" +
        "Total: ₦" + total + "%0A%0A" +
        "Name: " + name + "%0A" +
        "Phone: " + phone + "%0A" +
        "Location: " + location;
    
    window.open("https://wa.me/2348058075181?text=" + message, "_blank");
}

function loadCustomerOrders() {
    let orders = JSON.parse(localStorage.getItem("fidexOrders")) || [];
    let container = document.getElementById("customerOrders");
    
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = "No previous orders.";
        return;
    }
    
    let html = "";
    
    orders.slice().reverse().forEach(order => {
        html += `
        <div style="border:1px solid #ccc; padding:8px; margin:8px 0; border-radius:5px;">
            <strong>Ref: ${order.ref}</strong><br>
            ${order.sweetType}<br>
            Quantity: ${order.quantity}<br>
            Total: ₦${order.total}<br>
            <small>${order.date}</small>
        </div>`;
    });
    
    container.innerHTML = html;
}

updateTotal();
loadCustomerOrders();

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log("Service Worker Registered"))
            .catch(err => console.log("SW registration failed:", err));
    });
}

// Install Button Logic
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const installBtn = document.createElement("button");
    installBtn.textContent = "Install FidEx App";
    installBtn.className = "order-btn";
    installBtn.style.marginTop = "10px";
    
    document.querySelector(".product-box").appendChild(installBtn);
    
    installBtn.addEventListener("click", () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
            installBtn.remove();
        });
    });
});