const loading = document.querySelector('.loading');
loading.style.display = 'none';

const submit = document.querySelector('button[type="submit"]');

submit.addEventListener('click', async (e) => {
    e.preventDefault(); // Ngừng hành động mặc định của form (không reload trang)
    
    loading.style.display = 'flex'; // Hiển thị spinner

    // Lấy giá trị từ các input
    const email = document.querySelector('input[name="username"]').value; // Dựa trên id="username" trong EJS
    const password = document.querySelector('input[name="password"]').value;
    
    const data = { email, password };

    try {
        const response = await fetch('/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Đặt Content-Type là JSON
            },
            body: JSON.stringify(data) // Chuyển đối tượng thành chuỗi JSON
        });

        const responseData = await response.json();
        if (response.ok) {
            if (responseData.data.token) {
                sessionStorage.setItem('token', responseData.data.token);
                window.location.href = '/admin/dashboard';
            } else {
                showErrorPopup("Lỗi đăng nhập.");
            }
        } else {
            const errorMessage = `${responseData.message || "Lỗi đăng nhập."} ${responseData.data.email ?? ""} ${responseData.data.password ?? ""}`;
            showErrorPopup(errorMessage);
        }
    } catch (error) {
        console.error('Lỗi kết nối:', error);
        showErrorPopup("Không thể kết nối với máy chủ.");
    } finally {
        loading.style.display = 'none';
    }
});

// Hàm hiển thị popup thông báo lỗi
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
