const express = require('express');

const db = require('../data/helpers/actionModel.js');
const projectDB = require('../data/helpers/projectModel.js');

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

router.get('/:id', validateActionById, (req, res) => {
    if(req.action){
        res.status(200).json(req.action);
    } else {
        res.status(404).json({ message: 'invalid id' })
    }
})

router.delete('/:id', validateActionById, (req, res) => {
    db
        .remove(req.params.id)
        .then(num => {
            res.status(200).json(num);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error deleting action from db' })
        })
})

router.put('/:id', validateActionById, validateAction, validateProjectById, (req, res) => {
    db
        .update(req.params.id, req.body)
        .then(updatedAction => {
            res.status(200).json(updatedAction);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error updating action in db' })
        })
})

router.post('/', validateAction, validateProjectById, (req, res) => {
    db
        .insert(req.body)
        .then(newAction => {
            res.status(200).json(newAction);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error adding new Action to db' })
        })
})

function validateAction(req, res, next){
    if(!req.body || !req.body.project_id || !req.body.description || !req.body.notes){
        res.status(400).json({ message: 'missing required project_id, description, or notes fields' })
    } else {
        if(req.body.description.length > 128){
            res.status(400).json({ message: 'Description too long, max length 128' })
        } else {
            next();
        }
    }
}

function validateActionById(req, res, next){
    db.
        get(req.params.id)
        .then(action => {
            req.action = action;
            next();
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error retrieving action by id' })
        })
}

function validateProjectById(req, res, next){
    projectDB
        .get(req.body.project_id)
        .then(project => {
            next();
        })
        .catch(err => {
            console.log(err);
            res.status(500).status({ message: 'Error retrieving project by id' })
        })
}

module.exports = router;