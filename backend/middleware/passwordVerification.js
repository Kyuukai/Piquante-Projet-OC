const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.writeHead(400, '{"message":"Veuillez remplir les conditions de mot de passe : 8 caractères minimum, au moins 1 Majuscule, au moins 1 minuscule"}', {
            'content-type': 'application/json'
        });
        res.end('Format de mot de passe incorrect');
    } else {
        next();
    }
};