const sauceModel = require("../models/sauceModel");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new sauceModel ({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    .then(() => { res.status(201).json({ message: "Sauce enregistrée" })})
    .catch(error => { res.status(400).json({ error })})
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    sauceModel.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(400).json({ message : "Bad Request" });
        } else {
            if (req.file) {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {})
            }
            sauceModel.updateOne({ ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce Modifiée" }))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    })
};

exports.getOneSauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id })
    .then(sauce => {
        if(sauce.userId != req.auth.userId) {
            res.status(400).json({ message: "Non-autorisé" });
        } else {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                sauceModel.deleteOne({_id: req.params.id })
                .then(() => res.status(200).json({ message: "Sauce Supprimée" }))
                .catch(error => res.status(401).json({ error }));
            })
        }
    })
};

exports.getAllSauces = (req, res, next) => {
    sauceModel.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

exports.sauceLikeDislike = (req, res, next) => {
    if (req.body.like === 1) {
        sauceModel.updateOne({ _id: req.params.id }, {$push: { usersLiked: req.body.userId}, $inc: { likes: +1 }})
        .then(() => res.status(200).json({ message: "J'aime ajouté !"}))
        .catch(error => res.status(400).json({ error }));
    }

    if (req.body.like === -1) {
        sauceModel.updateOne({ _id: req.params.id }, {$push: { usersDisliked: req.body.userId}, $inc: { dislikes: +1 }})
        .then(() => res.status(200).json({ message: "Je n'aime pas ajouté !"}))
        .catch(error => res.status(400).json({ error }));
    }

    if (req.body.like === 0) {
        sauceModel.findOne({ _id: req.params.id })
        .then((sauce) => {

            if(sauce.usersLiked.includes(req.body.userId)) {
                sauceModel.updateOne({ $pull: { usersLiked: req.body.userId}, $inc: { likes: -1 }})
                .then(() => res.status(200).json({ message: "Like retiré !"}))
                .catch(error => res.status(400).json({ error }));
            }

            if(sauce.usersDisliked.includes(req.body.userId)) {
                sauceModel.updateOne({ $pull: { usersDisliked: req.body.userId}, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: "Je n'aime pas retiré !"}))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(404).json({ error }));
    }
}