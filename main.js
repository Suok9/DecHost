import { collection, addDoc, serverTimestamp }
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// ===== Reference Generator =====
function generateRef() {
    let random = Math.floor(Math.random() * 900000) + 100000;
    return "FDX-2026-" + random;
}

// ===== Quantity Controls (Minimum 5) =====
window.increase = function() {
    let qty = document.getElementById("quantity");
    qty.value = parseInt(qty.value || 5) + 1;
    updateTotal();
};

window.decrease = function() {
    let qty = document.getElementById("quantity");
    if (parseInt(qty.value) > 5) {
        qty.value = parseInt(qty.value) - 1;
        updateTotal();
    }
};

window.updateTotal = function() {
    let qtyInput = document.getElementById("quantity");
    let quantity = parseInt(qtyInput.value) || 5;
    
    if (quantity < 5) {
        quantity = 5;
        qtyInput.value = 5;
    }
    
    let total = (quantity * 500) + 200;
    document.getElementById("totalDisplay").innerText = "Total: ₦" + total;
};

// ===== SEND ORDER TO FIREBASE =====
window.sendOrder = async function() {
    
    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value;
    let location = document.getElementById("location").value;
    let quantity = parseInt(document.getElementById("quantity").value) || 5;
    
    if (name === "" || phone === "" || location === "") {
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
        quantity,
        total,
        createdAt: serverTimestamp()
    };
    
    try {
        await addDoc(collection(window.db, "orders"), order);
        
        let message =
            "Hello FidEx Nuts,%0A%0A" +
            "Reference: " + refNumber + "%0A" +
            "Quantity: " + quantity + "%0A" +
            "Total: ₦" + total + "%0A%0A" +
            "Name: " + name + "%0A" +
            "Phone: " + phone + "%0A" +
            "Location: " + location;
        
        window.open("https://wa.me/2348058075181?text=" + message, "_blank");
        
        alert("Order submitted successfully!");
        
    } catch (error) {
        console.error("Error saving order:", error);
        alert("Error submitting order.");
    }
};

updateTotal();

// ===== Service Worker =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log("Service Worker Registered"))
            .catch(err => console.log("SW registration failed:", err));
    });
}

// ===== Install Button =====
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