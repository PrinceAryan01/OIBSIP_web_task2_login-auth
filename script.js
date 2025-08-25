
const $ = (id) => document.getElementById(id);
const show = (id, text) => { $(id).textContent = text; };


$("regBtn").addEventListener("click", async () => {
  const username = $("regUser").value.trim();
  const password = $("regPass").value;

  if (!username || !password) return show("msg", "⚠️ Provide username & password.");

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  show("msg", await res.text());
});


$("loginBtn").addEventListener("click", async () => {
  const username = $("loginUser").value.trim();
  const password = $("loginPass").value;

  if (!username || !password) return show("msg", "⚠️ Provide username & password.");

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.ok) {
   
    localStorage.setItem("auth_token", data.token);
    show("msg", `✅ Welcome, ${username}! You are logged in.`);
  } else {
    show("msg", "❌ Invalid credentials!");
  }
});

$("secureBtn").addEventListener("click", async () => {
  const token = localStorage.getItem("auth_token") || "";
  const res = await fetch("/secure", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const text = await res.text();
  show("secureMsg", text);
});
