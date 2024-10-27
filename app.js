const express = require('express');
const path = require('path');
const session = require('express-session');
const connection = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'clave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/inventory', (req, res) => {
  if (req.session && req.session.userId) {
    res.sendFile(path.join(__dirname, 'views', 'inventory.html'));
  } else {
    res.redirect('/');
  }
});

app.get('/home', (req, res) => {
  console.log('Session User ID:', req.session.userId); // Verifica el ID de usuario en la sesión
  if (req.session && req.session.userId) {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
  } else {
    res.redirect('/');
  }
});


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
