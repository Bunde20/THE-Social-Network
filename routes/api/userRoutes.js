const router = require('express').Router();
const User = require('../../models/User');

// GET all users
router.get('/', (req, res) => { 
    User.find({})
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

// GET a single user by its _id
router.get('/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
    .then(dbUserData => {
        // If no user is found, send 404
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

module.exports = router;