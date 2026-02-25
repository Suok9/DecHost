function increase() {
    let qty = document.getElementById("quantity");
    qty.value = parseInt(qty.value) + 1;
}

function decrease() {
    let qty = document.getElementById("quantity");
    if (parseInt(qty.value) > 1) {
        qty.value = parseInt(qty.value) - 1;
    }
}

function sendOrder() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let location = document.getElementById("location").value;
    let sweetType = document.getElementById("sweetType").value;
    let quantity = document.getElementById("quantity").value;

    if(name === "" || phone === "" || location === "" || sweetType === "") {
        alert("Please fill all fields and select sweetening option.");
        return;
    }

    let total = quantity * 500;

    let message =
    "Hello FidEx Nuts,%0A%0A" +
    "I would like to place an order:%0A" +
    "--------------------------------%0A" +
    "Sweetening Type: " + sweetType + "%0A" +
    "Quantity: " + quantity + " Pack(s)%0A" +
    "Total Amount: ₦" + total + "%0A%0A" +
    "Customer Details:%0A" +
    "Name: " + name + "%0A" +
    "Phone: " + phone + "%0A" +
    "Location: " + location + "%0A%0A" +
    "Thank you.";

    let whatsappNumber = "2348058075181";

    window.open("https://wa.me/" + whatsappNumber + "?text=" + message, "_blank");
}