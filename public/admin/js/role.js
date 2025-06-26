// Tự động tìm tất cả các bảng permissions
const permissionTables = document.querySelectorAll("[table-permissions], [table-permissions-roles], [table-permissions-users], [table-permissions-products]");

if (permissionTables.length > 0) {
    const buttonSubmit = document.querySelector("[button-submit]");
    
    function loadInitialState() {
        console.log(`Found ${permissionTables.length} permission tables`);
    }
    
    loadInitialState();
    
    // Hàm xử lý thu thập permissions từ một bảng
    function collectPermissionsFromTable(table) {
        let permissions = [];
        
        // Lấy tất cả các role headers để tạo structure ban đầu
        const roleHeaders = table.querySelectorAll("thead th");
        
        // Bỏ qua cột đầu tiên (Tính năng), lấy các role
        for (let i = 1; i < roleHeaders.length; i++) {
            permissions.push({
                id: roleHeaders[i].dataset.id || `role-${i}`,
                permissions: []
            });
        }
        
        // Lấy tất cả các hàng có data-name (không bao gồm hàng header)
        const rows = table.querySelectorAll("tbody tr[data-name]");
        
        rows.forEach(row => {
            const permissionName = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input[type='checkbox']");
            
            inputs.forEach((input, index) => {
                if (input.checked && permissions[index]) {
                    permissions[index].permissions.push(permissionName);
                }
            });
        });
        
        return permissions;
    }
    
    // Hàm merge permissions từ nhiều bảng
    function mergePermissions(allPermissions, newPermissions) {
        newPermissions.forEach(roleData => {
            const existingRole = allPermissions.find(p => p.id === roleData.id);
            if (existingRole) {
                // Merge permissions nếu role đã tồn tại (loại bỏ duplicate)
                const uniquePermissions = [...new Set([...existingRole.permissions, ...roleData.permissions])];
                existingRole.permissions = uniquePermissions;
            } else {
                // Thêm role mới
                allPermissions.push(roleData);
            }
        });
        return allPermissions;
    }
    
    buttonSubmit.addEventListener("click", () => {
        let allPermissions = [];
        
        // Tự động thu thập permissions từ TẤT CẢ các bảng
        permissionTables.forEach((table, index) => {
            console.log(`Processing table ${index + 1}:`, table.getAttribute('class'));
            const tablePermissions = collectPermissionsFromTable(table);
            allPermissions = mergePermissions(allPermissions, tablePermissions);
        });
        
        // Submit form nếu có dữ liệu
        if (allPermissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
            
            inputPermissions.value = JSON.stringify(allPermissions);
            
            console.log("Submitting permissions from", permissionTables.length, "tables:", allPermissions);
            formChangePermissions.submit();
        } else {
            console.warn("No permissions to submit");
        }
    });
}