const express = require('express');

const db = require('../data/helpers/projectModel.js');

const router = express.Router();

router.get('/', (req, res) => {
    db
        .get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error retrieving actions' })
        })
});

router.get('/:id', validateProjectById, (req, res) => {
    if(req.project){
        res.status(200).json(req.project);
    } else {
        res.status(404).json({ message: 'invalid id' })
    }
})

router.post('/', validateProject, (req, res) => {
    db
        .insert(req.body)
        .then(newProject => {
            res.status(200).json(newProject);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error creating new Project' })
        })
})

router.put('/:id', validateProjectById, validateProject, (req, res) => {
    db
        .update(req.params.id, req.body)
        .then(updatedProject => {
            res.status(200).json(updatedProject);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error updating project' })
        })
})

router.delete('/:id', validateProjectById, (req, res) => {
    db
        .remove(req.params.id)
        .then(num => {
            res.status(200).json(num);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error removing project from db' })
        })
})

function validateProject(req, res, next) {
    if(!req.body || !req.body.name || !req.body.description){
        res.status(400).json({ message: 'missing required name or description field' })
    } else {
        next();
    }
}

function validateProjectById(req, res, next) {
    db
        .get(req.params.id)
        .then(project => {
            req.project = project;
            next();
        })
        .catch(err => {
            console.log(err, 'validate project id');
            res.status(500).json({ message: 'error retrieving project by id' });
        })
}

module.exports = router;