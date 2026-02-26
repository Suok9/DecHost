import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import {
    signInWithRedirect,
    GoogleAuthProvider,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";


const provider = new GoogleAuthProvider();


// ================= GOOGLE LOGIN =================
window.googleLogin = async function() {
    try {
        await signInWithRedirect(window.auth, provider);
    } catch (error) {
        console.error(error);
        alert("Login failed.");
    }
};

onAuthStateChanged(window.auth, (user) => {
    const info = document.getElementById("userInfo");
    
    if (user) {
        info.innerText = "Logged in as: " + user.email;
        loadCustomerOrders();
    } else {
        info.innerText = "Not logged in";
        document.getElementById("customerOrders").innerHTML =
            "Login to see your orders.";
    }
});


// ================= LOAD CUSTOMER ORDERS =================
window.loadCustomerOrders = async function() {
    
    let user = window.auth.currentUser;
    
    if (!user) return;
    
    const q = query(
        collection(window.db, "orders"),
        where("uid", "==", user.uid)
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
            <div style="border:1px solid #ccc; padding:8px; margin:8px 0;">
                <strong>Ref:</strong> ${order.ref}<br>
                Quantity: ${order.quantity}<br>
                Total: ₦${order.total}
            </div>
        `;
    });
};


// ================= REFERENCE =================
function generateRef() {
    let random = Math.floor(Math.random() * 900000) + 100000;
    return "FDX-2026-" + random;
}


// ================= QUANTITY =================
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
    let quantity = parseInt(document.getElementById("quantity").value);
    
    if (isNaN(quantity)) {
        document.getElementById("totalDisplay").innerText = "Total: ₦0";
        return;
    }
    
    let total = (quantity * 500) + 200;
    document.getElementById("totalDisplay").innerText = "Total: ₦" + total;
};


// ================= SEND ORDER =================
window.sendOrder = async function() {
    
    let user = window.auth.currentUser;
    
    if (!user) {
        alert("Please sign in with Google first.");
        return;
    }
    
    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let location = document.getElementById("location").value.trim();
    let quantity = parseInt(document.getElementById("quantity").value);
    
    if (!name || !phone || !location) {
        alert("Please fill all fields.");
        return;
    }
    
    if (isNaN(quantity) || quantity < 5) {
        alert("Minimum order is 5 packs.");
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
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp()
    };
    
    try {
        
        await addDoc(collection(window.db, "orders"), order);
        
        await loadCustomerOrders();
        
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
        console.error("Error:", error);
        alert("Error submitting order.");
    }
};


// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    updateTotal();
});


// ================= SERVICE WORKER =================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/DecHost/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}