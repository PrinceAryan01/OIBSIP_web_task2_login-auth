const express = require("express");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = 3000;


const users = [];                   
const activeTokens = new Map();     

app.use(express.json());
app.use(express.static(__dirname)); 


const issueToken = (username) => {
  const token = crypto.randomUUID();
  activeTokens.set(token, username);
  return token;
};

const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token && activeTokens.has(token)) {
    req.user = activeTokens.get(token);
    return next();
  }
  return res.status(401).send("🔒 Unauthorized. Please log in first.");
};


app.post("/register", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.send("⚠️ Username & password required.");

  if (users.find(u => u.username === username)) {
    return res.send("⚠️ User already exists.");
  }
  users.push({ username, password });
  res.send("✅ Registration successful!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const found = users.find(u => u.username === username && u.password === password);
  if (!found) return res.json({ ok: false });

  const token = issueToken(username);
  res.json({ ok: true, token });
});

app.get("/secure", requireAuth, (req, res) => {
  res.send(`🎉 Hi ${req.user}, this is a SECURED message visible only after login.`);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
