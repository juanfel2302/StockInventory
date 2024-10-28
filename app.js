const express = require('express');
const path = require('path');
const session = require('express-session');
const connection = require('./config/db'); // Asegúrate de que esta ruta es correcta
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // Asegúrate de que la ruta sea correcta
const stateRoutes = require('./routes/stateRoutes');
const providerRoutes = require('./routes/providerRoutes'); // Asegúrate de que la ruta sea correcta

console.log({ authRoutes, productRoutes, categoryRoutes, stateRoutes, providerRoutes });

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
    cookie: { secure: false }
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
    console.log('Session User ID:', req.session.userId); // Verifica el ID de usuario en la sesión
    if (req.session && req.session.userId) {
        res.sendFile(path.join(__dirname, 'views', 'home.html'));
    } else {
        res.redirect('/');
    }
});

app.get('/provider', (req, res) => {
    console.log('Session User ID:', req.session.userId); // Verifica el ID de usuario en la sesión
    if (req.session && req.session.userId) {
        res.sendFile(path.join(__dirname, 'views', 'provider.html'));
    } else {
        res.redirect('/');
    }
});

// Rutas de API
console.log("Adding routes: /api/auth", authRoutes);
app.use('/api/auth', authRoutes);

console.log("Adding routes: /api/products", productRoutes);
app.use('/api/products', productRoutes);

console.log("Adding routes: /api/categories", categoryRoutes);
app.use('/api/categories', categoryRoutes);

console.log("Adding routes: /api/states", stateRoutes);
app.use('/api/states', stateRoutes);

console.log("Adding routes: /api/providers", providerRoutes);
app.use('/api/providers', providerRoutes); 

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
