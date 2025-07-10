//Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination.length > 0) {
  buttonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      const url = new URL(window.location.href);
      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}
