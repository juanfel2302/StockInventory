const express = require('express');
const path = require('path');
const session = require('express-session');
const connection = require('./config/db'); // Asegúrate de que esta ruta es correcta
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // Asegúrate de que la ruta sea correcta
const stateRoutes = require('./routes/stateRoutes');
const providerRoutes = require('./routes/providerRoutes'); // Asegúrate de que la ruta sea correcta
const userRoutes = require('./routes/userRoutes');
const movimientoRoutes = require('./routes/movimientoRoutes'); // Import the route

const app = express();
const port = process.env.PORT || 3000;

// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
    secret: 'clave_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambiar a true si estás usando HTTPS
}));

// Servir archivos estáticos desde la carpeta "views"
app.use(express.static(path.join(__dirname, 'views')));

// Rutas para las páginas HTML
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
    if (req.session && req.session.userId) {
        res.sendFile(path.join(__dirname, 'views', 'home.html'));
    } else {
        res.redirect('/');
    }
});

app.get('/provider', (req, res) => {
    if (req.session && req.session.userId) {
        res.sendFile(path.join(__dirname, 'views', 'provider.html'));
    } else {
        res.redirect('/');
    }
});

app.get('/users', (req, res) => {
    if (req.session && req.session.userId) {
        res.sendFile(path.join(__dirname, 'views', 'user.html'));
    } else {
        res.redirect('/');
    }
});



// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/users', userRoutes); // Ruta API para usuarios
app.use('/api/movimientos', movimientoRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
