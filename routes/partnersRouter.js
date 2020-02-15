const express = require('express');
const bodyParser = require('body-parser');
const Partner = require('../models/partner');

const partnersRouter = express.Router();

partnersRouter.use(bodyParser.json());

partnersRouter.route('/') //path /partners will be in the server.js file
.get((req, res) => {
    Partner.find()
    .then(partners => {
        res.statusCode = 200;
        res.setHeader('Contect-Type', 'application/json');
        res.json(partners);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Partner.create(req.body)
    .then(partner => {
        console.log('Partner Created ', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supportd on /partners');
})
.delete((req, res, next) => {
    Partner.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Contect-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

partnersRouter.route('/:partnersId')
.get((req, res, next) => {
    Partner.find()
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Contect-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operations not supported on /partners/${req.params.partnersId}`);
})
.put((req, res, next) => {
    Partner.findByIdAndUpdate(req.params.partnersId, {
        $set: req.body
    }, { new: true })
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnersId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = partnersRouter;