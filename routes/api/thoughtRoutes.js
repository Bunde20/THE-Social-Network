const router = require('express').Router();
const Thought = require('../../models/Thought');
const User = require('../../models/User');

// GET all thoughts
router.get('/', (req, res) => {
    Thought.find({})
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

// GET a single thought by its _id
router.get('/:id', (req, res) => {
    Thought.findOne({ _id: req.params.id })
    .then(dbThoughtData => {
        // If no thought is found, send 404
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

module.exports = router;