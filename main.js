import { query, where, getDocs, collection, addDoc, serverTimestamp }
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


// ===== Load Customer Orders =====
window.loadCustomerOrders = async function() {
    
    let phoneInput = document.getElementById("phone");
    if (!phoneInput) return;
    
    let phone = phoneInput.value.trim();
    if (!phone) {
        document.getElementById("customerOrders").innerHTML = "Enter phone number to see previous orders.";
        return;
    }
    
    const q = query(
        collection(window.db, "orders"),
        where("phone", "==", phone)
    );
    
    const snapshot = await getDocs(q);
    
    let container = document.getElementById("customerOrders");
    container.innerHTML = "";
    
    if (snapshot.empty) {
        container.innerHTML = "No previous orders.";
        return;
    }
    
    snapshot.forEach(doc => {
        let order = doc.data();
        container.innerHTML += `
            <div style="border:1px solid #ccc; padding:8px; margin:8px 0; border-radius:5px;">
                <strong>Ref:</strong> ${order.ref}<br>
                Quantity: ${order.quantity}<br>
                Total: ₦${order.total}<br>
            </div>
        `;
    });
};


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
    let quantity = parseInt(qtyInput.value);
    
    if (isNaN(quantity)) {
        document.getElementById("totalDisplay").innerText = "Total: ₦0";
        return;
    }
    
    let total = (quantity * 500) + 200;
    document.getElementById("totalDisplay").innerText = "Total: ₦" + total;
};


// ===== SEND ORDER =====
window.sendOrder = async function() {
    
    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let location = document.getElementById("location").value.trim();
    let quantity = parseInt(document.getElementById("quantity").value);
    
    if (isNaN(quantity) || quantity < 5) {
        alert("Minimum order is 5 packs.");
        return;
    }
    
    if (!name || !phone || !location) {
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
        
        await loadCustomerOrders(); // 🔥 now placed correctly
        
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


// ===== Auto Load History When Phone Changes =====
document.addEventListener("DOMContentLoaded", () => {
    
    updateTotal();
    
    const phoneInput = document.getElementById("phone");
    
    if (phoneInput) {
        phoneInput.addEventListener("blur", () => {
            loadCustomerOrders();
        });
    }
    
});


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