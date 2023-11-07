const router = require('express').Router();
const User = require('../../models/User');
const Thought = require('../../models/Thought');

// GET all users and populate thoughts and friends
router.get('/', (req, res) => {
    User.find({})
    .populate({
        path: 'thoughts',
        select: '-__v'
    })
    .populate({
        path: 'friends',
        select: '-__v'
    })
    .sort({ _id: -1 })
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

// POST a new user
router.post('/', (req, res) => {
    User.create(req.body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
});

// PUT one friend into a user's friend list
router.put('/:userId/friends/:friendId', (req, res) => {
    User.findOneAndUpdate (
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { new: true }
    )
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

// PUT to update a user by its _id
router.put('/:id', (req, res) => {
    User.findOneAndUpdate (
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
    )
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

// DELETE user by its _id
router.delete('/:id', (req, res) => {
    User.findOneAndDelete({ _id: req.params.id })
    .then(dbUserData => {
        // If no user is found, send 404
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        // Remove the user from any friend arrays
        User.updateMany(
            { friends: req.params.id },
            { $pull: { friends: req.params.id } },
            { new: true }
        )
        .then(() => {
            // Delete any thoughts associated with the user
            Thought.deleteMany({ username: dbUserData.username })
            .then(() => {
                res.json({ message: 'Successfully deleted user!' });
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)} 
                );
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)} 
            );
    })
    .catch(err => {
        console.log(err)
        res.status(400).json(err)} 
        );
});

// DELETE one friend from a user's friend list
router.delete('/:userId/friends/:friendId', (req, res) => {
    User.findOneAndUpdate (
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
    )
    .then(dbUserData => {
        // If no user is found, send 404
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        // Remove the user from any friend arrays
        User.updateMany(
            { friends: req.params.id },
            { $pull: { friends: req.params.id } }
        )
        .then(() => {
            // Delete any thoughts associated with the user
            Thought.deleteMany({ username: dbUserData.username })
            .then(() => {
                res.json({ message: 'Successfully deleted user!' });
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
        res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
});



module.exports = router;