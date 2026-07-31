const userButton = document.getElementById("userBtn");
const adminButton = document.getElementById("adminBtn");

// ==========================================
// USER PORTAL LOGIC
// ==========================================
userButton.addEventListener("click", function () {
  if (document.getElementById("loginModal")) return;

  const modal = document.createElement("div");
  modal.id = "loginModal";
  modal.className = "modal-overlay";

  modal.innerHTML = `
        <div class="login-box">
            <button class="close-btn" id="closeModal">✖</button>
            <h2>User Portal Login</h2>
            <form id="loginForm">
                <div class="input-group">
                    <label>Registration Number</label>
                    <input type="text" id="regNo" placeholder="Enter Registration No." required>
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <input type="password" id="password" placeholder="Enter Password" required>
                </div>
                
                <div class="captcha-container">
                    <span id="captchaText"></span>
                    <button type="button" id="refreshCaptcha" title="Refresh Captcha">↻</button>
                </div>
                
                <div class="input-group">
                    <input type="text" id="captchaInput" placeholder="Enter Captcha Code" required>
                </div>

                <button type="submit" class="submit-btn">LOGIN</button>
                <div id="message" class="message"></div>
            </form>
        </div>
    `;

  document.body.appendChild(modal);

  let currentCaptcha = "";

  function generateCaptcha() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function loadNewCaptcha() {
    currentCaptcha = generateCaptcha();
    document.getElementById("captchaText").textContent = currentCaptcha;
    document.getElementById("captchaInput").value = "";
  }

  loadNewCaptcha();

  document
    .getElementById("refreshCaptcha")
    .addEventListener("click", loadNewCaptcha);

  document.getElementById("closeModal").addEventListener("click", function () {
    document.body.removeChild(modal);
  });

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const regNo = document.getElementById("regNo").value.trim();
    const password = document.getElementById("password").value.trim();
    const captchaTyped = document.getElementById("captchaInput").value.trim();
    const messageBox = document.getElementById("message");

    if (captchaTyped.toUpperCase() !== currentCaptcha.toUpperCase()) {
      messageBox.textContent = "Incorrect captcha. Please try again.";
      messageBox.className = "message error";
      loadNewCaptcha();
      return;
    }

    if (regNo === "" || password === "") {
      messageBox.textContent = "Please fill in all fields.";
      messageBox.className = "message error";
      return;
    }

    messageBox.textContent = "Login Successful! Redirecting...";
    messageBox.className = "message success";
    console.log(
      "User login successful. Waiting 1 second to redirect to User Portal...",
    );

    setTimeout(function () {
      localStorage.setItem("portal", "user");
      window.location.assign("http://localhost:5173/user");
    }, 1000);
  });
});

// ==========================================
// ADMIN PORTAL LOGIC
// ==========================================
adminButton.addEventListener("click", function () {
  if (document.getElementById("adminLoginModal")) return;

  const modal = document.createElement("div");
  modal.id = "adminLoginModal";
  modal.className = "modal-overlay";

  modal.innerHTML = `
        <div class="login-box">
            <button class="close-btn" id="closeAdminModal">✖</button>
            <h2>Admin Portal Login</h2>
            <form id="adminLoginForm">
                <div class="input-group">
                    <label>Admin ID</label>
                    <input type="text" id="adminId" placeholder="Enter Admin ID" required>
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <input type="password" id="adminPassword" placeholder="Enter Password" required>
                </div>
                <button type="submit" class="submit-btn">LOGIN</button>
                <div id="adminMessage" class="message"></div>
            </form>
        </div>
    `;

  document.body.appendChild(modal);

  document
    .getElementById("closeAdminModal")
    .addEventListener("click", function () {
      document.body.removeChild(modal);
    });

  document
    .getElementById("adminLoginForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Admin form submitted!");

      const adminId = document.getElementById("adminId").value.trim();
      const password = document.getElementById("adminPassword").value.trim();
      const message = document.getElementById("adminMessage");

      if (adminId === "" || password === "") {
        message.textContent = "Please fill all fields.";
        message.className = "message error";
        console.log("Admin login failed: Empty fields");
        return;
      }

      message.textContent = "Login Successful! Redirecting...";
      message.className = "message success";
      console.log(
        "Admin login successful. Waiting 1 second to redirect to Admin Portal...",
      );

      setTimeout(function () {
        localStorage.setItem("portal", "admin");
        window.location.assign("http://localhost:5173/admin");
      }, 1000);
    });
});

async function loadApexData() {
  try {
    // 1. Call your FastAPI endpoint (NOT the Oracle URL directly)
    const response = await fetch("http://127.0.0.1:8000/apex-data");

    // 2. Check if the backend returned an error (like the 503 Maintenance error)
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // 3. Convert the response to JSON
    const data = await response.json();

    // 4. Log it to see what it looks like
    console.log("Data received from backend:", data);

    // 5. Call a function to display this data on your webpage
    displayDataOnPage(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // You can display an error message on your UI here
  }
}

// Trigger the function when the page loads
loadApexData();

async function loadApexData() {
  try {
    // 1. Call your FastAPI endpoint (NOT the Oracle URL directly)
    const response = await fetch("http://127.0.0.1:8000/apex-data");

    // 2. Check if the backend returned an error (like the 503 Maintenance error)
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // 3. Convert the response to JSON
    const data = await response.json();

    // 4. Log it to see what it looks like
    console.log("Data received from backend:", data);

    // 5. Call a function to display this data on your webpage
    displayDataOnPage(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // You can display an error message on your UI here
  }
}

// Trigger the function when the page loads
loadApexData();
