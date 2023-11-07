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

// POST a new thought and push the created thought's _id to the associated user's thoughts array field
router.post('/', (req, res) => {
    Thought.create(req.body)
    .then((dbThoughtData) => {
        return User.findOneAndUpdate(
            { username: req.body.username },
            { $push: { thoughts: dbThoughtData._id } },
            { new: true }
        );
    })
    .then(dbUserData => {
        // If no user is found, send 404
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
});

// PUT to update a thought by its _id
router.put('/:id', (req, res) => {
    Thought.findOneAndUpdate (
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
    )
    .then(dbThoughtData => {
        // If no thought is found, send 404
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
});

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:id/reactions', (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { reactions: req.body } },
        { runValidators: true, new: true }
    )
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
        res.status(400).json(err)}
    );
});

// DELETE to remove a thought by its _id
router.delete('/:id', (req, res) => {
    Thought.findOneAndDelete({ _id: req.params.id })
    .then((dbThoughtData) => {
        return User.findOneAndUpdate(
            { username: dbThoughtData.username },
            { $pull: { thoughts: dbThoughtData._id } },
            { new: true }
        );
    })
    .then(dbUserData => {
        // If no user is found, send 404
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json({ message: 'Thought and associated user deleted!' });
    })
    .catch(err => res.status(400).json(err));
});

// DELETE a reaction by the reaction id
router.delete('/:id/reactions/:reactionId', (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { reactions: {reactionId: req.params.reactionId} } },
        { runValidators: true, new: true }
    )
    .then(dbThoughtData => {
        // If no thought is found, send 404
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No reaction found with this id!' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err)}
    );
});

module.exports = router;