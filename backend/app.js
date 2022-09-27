// Importation des plugins
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require('helmet');

// Importation des Routes
const sauceRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

// Connection à MongoDB avec la string de connection fournie depuis le site
require('dotenv').config();
mongoose.connect(process.env.DB_ADMIN,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connexion à MongoDB réussie"))
    .catch(() => console.log("Connexion à MongoDB échouée"));

app.use(express.json());

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Middleware qui permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(bodyParser.json());

// Middleware qui va transmettre les requêtes vers ces url vers les routes correspondantes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

// On utilise helmet pour plusieurs raisons notamment la mise en place du X-XSS-Protection afin d'activer le filtre de script intersites(XSS) dans les navigateurs web
app.use(helmet());

module.exports = app;