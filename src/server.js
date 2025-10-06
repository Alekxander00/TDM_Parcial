const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, "..", "public")));

// API simple de ejemplo
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Endpoints de ejemplo para pruebas (POST ejemplo)
app.use(express.json());
app.post("/api/echo", (req, res) => {
  res.json({ youSent: req.body });
});

// Fallback: para SPA (history API) devolver index.html
// Uso '/*' en lugar de '*' para evitar PathError
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
