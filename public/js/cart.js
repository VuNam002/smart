const listInputQuantity = document.querySelectorAll("input[name='quantity']");
if (listInputQuantity.length > 0) {
  listInputQuantity.forEach(input => {
    input.addEventListener("change", (event) => {
      const productId = event.target.dataset.itemId;
      const quantity = parseInt(event.target.value);
      if (quantity > 0) {
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    });
  });
}