function increase() {
    let qty = document.getElementById("quantity");
    qty.value = parseInt(qty.value || 1) + 1;
    updateTotal();
}

function decrease() {
    let qty = document.getElementById("quantity");
    let current = parseInt(qty.value || 1);

    if (current > 1) {
        qty.value = current - 1;
        updateTotal();
    }
}

function updateTotal() {
    let quantity = parseInt(document.getElementById("quantity").value) || 1;

    if (quantity < 1) {
        quantity = 1;
        document.getElementById("quantity").value = 1;
    }

    let pricePerPack = 500;
    let deliveryFee = 200;

    let total = (quantity * pricePerPack) + deliveryFee;

    document.getElementById("totalDisplay").innerText = "₦" + total;
}

function sendOrder() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let location = document.getElementById("location").value;
    let sweetType = document.getElementById("sweetType").value;
    let quantity = parseInt(document.getElementById("quantity").value) || 1;

    if(name === "" || phone === "" || location === "" || sweetType === "") {
        alert("Please fill all fields and select sweetening option.");
        return;
    }

    let pricePerPack = 500;
    let deliveryFee = 200;
    let total = (quantity * pricePerPack) + deliveryFee;

    let message =
    "Hello FidEx Nuts,%0A%0A" +
    "I would like to place an order:%0A" +
    "--------------------------------%0A" +
    "Sweetening Type: " + sweetType + "%0A" +
    "Quantity: " + quantity + " Pack(s)%0A" +
    "Product Cost: ₦" + (quantity * pricePerPack) + "%0A" +
    "Delivery Fee: ₦" + deliveryFee + "%0A" +
    "Total Amount: ₦" + total + "%0A%0A" +
    "Customer Details:%0A" +
    "Name: " + name + "%0A" +
    "Phone: " + phone + "%0A" +
    "Location: " + location + "%0A%0A" +
    "Thank you.";

    let whatsappNumber = "2348058075181";

    window.open("https://wa.me/" + whatsappNumber + "?text=" + message, "_blank");
}

updateTotal();