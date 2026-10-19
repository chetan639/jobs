const express = require('express')

function createJobsRouter(service) {
    const router = express.Router();

    router.post("/",(req,res) => res.status(201).json(service.create(req.body??{})));

    router.get("/",(req,res) => res.json(service.list(req.query)));

    router.get("/:id",(req,res) => res.json(service.list(req.params.id)));
}

module.exports = {createJobsRouter}; 