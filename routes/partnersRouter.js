const express = require('express');
const bodyParser = require('body-parser');

const partnersRouter = express.Router();

partnersRouter.use(bodyParser.json());

partnersRouter.route('/') //path /partners will be in the server.js file
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the partners to you');
})
.post((req, res) => {
    res.end(`Will add the partners: ${req.body.name} with description ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supportd on /partners');
})
.delete((req, res) => {
    res.end('Deleting all partners');
});

partnersRouter.route('/:partnersId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send all the partners: ${req.params.partnersId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operations not supported on /partners/${req.params.partnersId}`);
})
.put((req, res) => {
    res.write(`Updating the partners: ${req.params.partnersId}\n`);
    res.end(`Will update the partners: ${req.body.name}
        with description: ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting campsite: ${req.params.partnersId}`);
});

module.exports = partnersRouter;