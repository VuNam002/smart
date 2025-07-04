// Change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");
    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active";
            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action;

            formChangeStatus.submit();
        });
    });
}
//end change status

//checkbox-nulti
const checkboxnulti = document.getElementById("checkbox-nulti");
if (checkboxnulti) {
    const inputCheckAll = checkboxnulti.querySelector("input[name='checkall']");
    const inputsId = checkboxnulti.querySelectorAll("input[name='ids']");

    // Khi click vào "chọn tất cả"
    inputCheckAll.addEventListener("click", () => {
        inputsId.forEach(input => {
            input.checked = inputCheckAll.checked;
        });
    });

    // Khi click vào từng checkbox con
    inputsId.forEach(input => {
        input.addEventListener("change", () => {
            // Nếu tất cả đều được chọn thì checkAll cũng được chọn
            const allChecked = Array.from(inputsId).every(cb => cb.checked);
            inputCheckAll.checked = allChecked;
        });
    });
}
//end checkbox-nulti

//form change nulti
const formChangeNutli = document.querySelector("[form-change-nulti]");
if(formChangeNutli) {
    formChangeNutli.addEventListener("submit", (e) => {
        // Lấy table chứa các checkbox
        const checkboxnulti = document.getElementById("checkbox-nulti");
        // Lấy các checkbox đã được chọn
        const inputsChecked = checkboxnulti.querySelectorAll(
            "input[name='ids']:checked"
        );
        // Nếu không chọn sản phẩm nào thì không submit và báo lỗi
        if(inputsChecked.length === 0) {
            e.preventDefault();
            alert("Vui lòng chọn ít nhất một sản phẩm!");
            return;
        }
        // Lấy input ẩn để gán giá trị ids
        const inputHiddenIds = formChangeNutli.querySelector("input[name='ids']");
        // Ghép các id đã chọn thành chuỗi, phân cách bằng dấu phẩy
        const ids = Array.from(inputsChecked).map(input => input.value).join(",");
        inputHiddenIds.value = ids;
        // Form sẽ submit bình thường với ids đã được gán
    })
}

// delete item
const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này?");
            if(isConfirm) {
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    });
}



