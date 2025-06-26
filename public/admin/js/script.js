// Button status  
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      const url = new URL(window.location.href); // Luôn tạo mới mỗi lần click
       
      if (status && status.trim() !== "") {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    });
  });
}
//end button status

//form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault(); // ngăn reload trang ở đúng trạng thái
    const url = new URL(window.location.href); // tạo mới mỗi lần submit
    const keyword = e.target.elements.keyword.value.trim();
    
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}

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

//End Pagination

//Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
  const uploadImageRemove = uploadImage.querySelector("[upload-image-remove]");

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      uploadImagePreview.style.display = "block";
      if(uploadImageRemove) uploadImageRemove.style.display = "inline-block";
    } else {
      uploadImagePreview.src = "";
      uploadImagePreview.style.display = "none";
      if(uploadImageRemove) uploadImageRemove.style.display = "none";
    }
  });

  if(uploadImageRemove) {
    uploadImageRemove.addEventListener("click", () => {
      uploadImageInput.value = "";
      uploadImagePreview.src = "";
      uploadImagePreview.style.display = "none";
      uploadImageRemove.style.display = "none";
    });
  }
}
//End Upload Image

// Sort
const sort = document.querySelector("[sort]");
if (sort) {
  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");

  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");
    const url = new URL(window.location.href);

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url.href;
  });

  // Khi load trang, set selected cho option đúng với sort hiện tại
  const url = new URL(window.location.href);
  const currentSortKey = url.searchParams.get("sortKey");
  const currentSortValue = url.searchParams.get("sortValue");
  if (currentSortKey && currentSortValue) {
    const stringSort = `${currentSortKey}-${currentSortValue}`;
    const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
    if (optionSelected) optionSelected.selected = true;
  }
}
// End sort