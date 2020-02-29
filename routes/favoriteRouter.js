const express = require('express');
const Favorite = require('../models/favorites');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find()
    .populate('user.ref')
    .populate('campsites.ref')
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Contect-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => {
        console.log(err);
        next(err);
    })
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findById(req.user._id)
        .populate('user.ref')
        .populate('campsites.ref')
        .then(favorite => {
            if (favorite) {
                req.body.forEach(message => {
                    favorite.campsite.forEach(campsite => {
                        if (campsite._id === message._id) {
                            console.log('Campsite already favorited!')
                        } else {
                            campsite.findById(message._id)
                            .then(campsite => {
                                favorite.campsite.push(campsite);
                                favorite.save();
                            })
                            .then(campsite => {
                                console.log('Campsite added to your favorites!')
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(campsite);
                            })
                            .catch(err => next(err));
                        }
                    })
                })
            } else {
                Favorite.create(req.body)
                    .then(favorite => {
                        console.log('Favorite list created!', favorite);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    .catch(err => next(err));
            }
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findByIdAndDelete(req.user._id)
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Contect-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operations not supported on /campsites/${req.params.campsiteId}`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findById(req.user._id)
    .then(favorite => {
        favorite.campsites.forEach(campsite => {
            if (campsite._id === req.params.campsiteId) {
                res.statusCode = 403;
                res.end('POST operation not supported on /favorites');
            } else {
                favorite.campsites.push(Campsite.findById(req.params.campsiteId));
                Favorite.save()
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(Favorite);
                    })
                    .catch(err => next(err))
            }
        })
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operations not supported on /campsites/${req.params.campsiteId}`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findByIdAndDelete(req.params.campsiteId)
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;