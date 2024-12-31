window.onload = function() {
    const token = localStorage.getItem("token");
    if (!token && !window.location.href.includes("/admin/login")) {
        window.location.href = "/admin/login";
    }

};
