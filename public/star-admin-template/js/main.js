/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function addProduct() {
    document.getElementById("addproduct").style.display = "block";
    document.getElementById("main").style.display = "none";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function backInventory() {
    document.getElementById("addproduct").style.display = "none";
    document.getElementById("main").style.display = "block";
}
