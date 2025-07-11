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

  document.querySelectorAll('[show-alert]').forEach(alert => {
    const time = parseInt(alert.dataset.time) || 3000;
    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, time);

    const closeBtn = alert.querySelector('[close-alert]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => alert.remove());
    }
  });