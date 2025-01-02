window.onload = function () {
    function showErrorPopup(message) {
        const popup = document.createElement('div');
        popup.classList.add('error-popup'); // Đảm bảo có class để định dạng
        popup.textContent = message;
    
        // Thêm popup vào body
        document.body.appendChild(popup);
    
        // Hiển thị popup
        popup.style.display = 'block';
    
        // Ẩn popup sau 4 giây
        setTimeout(() => {
            popup.style.display = 'none';
        }, 4000);
    }


    const token = sessionStorage.getItem("token");

    // Redirect to login page if no token and not already on login page
    if (!token && !window.location.href.includes("/admin/login")) {
        window.location.href = "/admin/login";
        return;
    }

    const sidebar = document.querySelector(".sidebar ul");

    // Clear the existing list items
    sidebar.innerHTML = "";

    // Create and append list items based on token existence
    if (token) {
        // Create "Quản lý danh mục" item
        const liManage = document.createElement("li");
        const aManage = document.createElement("a");
        aManage.href = "/admin/dashboard";
        aManage.textContent = "Quản lý danh mục";
        liManage.appendChild(aManage);

        // Create "Logout" item
        const liLogout = document.createElement("li");
        const aLogout = document.createElement("a");
        aLogout.href = "#"; // Set to "#" or your logout endpoint
        aLogout.textContent = "Logout";
        aLogout.addEventListener("click", async function (e) {
            e.preventDefault();
            const result = await fetch("/admin/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (result.ok) {
                sessionStorage.removeItem("token"); // Remove token
                window.location.href = "/admin/login"; // Redirect to login
            }
            else{
                console.log(result)
                showErrorPopup(result.message)
            }
        });
        liLogout.appendChild(aLogout);

        // Append items to sidebar
        sidebar.appendChild(liManage);
        sidebar.appendChild(liLogout);
    } else {
        // Create "Login" item
        const liLogin = document.createElement("li");
        const aLogin = document.createElement("a");
        aLogin.href = "/admin/login";
        aLogin.textContent = "Login";
        liLogin.appendChild(aLogin);

        // Append item to sidebar
        sidebar.appendChild(liLogin);
    }

};
