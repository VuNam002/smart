    
    subMenus.forEach(menu => {
        const link = menu.querySelector('a');
        link.addEventListener('click', function(e) {
            // Chỉ chặn hành vi mặc định và bật dropdown trên màn hình lớn (desktop)
            if (window.innerWidth > 991) {
                e.preventDefault();
                menu.classList.toggle('active');
                // Đóng các dropdown khác
                subMenus.forEach(other => {
                    if (other !== menu) {
                        other.classList.remove('active');
                    }
                });
            }
        });
    });
    

