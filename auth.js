// Đăng ký
function register() {
    let user = document.getElementById("reg-user").value;
    let pass = document.getElementById("reg-pass").value;
    let pass2 = document.getElementById("reg-pass2").value;

    if (!user || !pass || !pass2) {
        alert("Vui lòng nhập đầy đủ!");
        return;
    }

    if (pass !== pass2) {
        alert("Mật khẩu nhập lại không khớp!");
        return;
    }

    const account = {
        username: user,
        password: pass
    };

    localStorage.setItem("account", JSON.stringify(account));
    alert("Đăng ký thành công!");
    window.location.href = "login.html";
}

// Đăng nhập
function login() {
    let user = document.getElementById("login-user").value;
    let pass = document.getElementById("login-pass").value;

    const account = JSON.parse(localStorage.getItem("account"));

    if (!account) {
        alert("Chưa có tài khoản nào. Vui lòng đăng ký!");
        return;
    }

    if (user === account.username && pass === account.password) {
        alert("Đăng nhập thành công!");
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", user);
        window.location.href = "index.html";
    } else {
        alert("Sai tài khoản hoặc mật khẩu!");
    }
}

// Đăng xuất
function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}
