const { Schema, model } = require('mongoose');

// Set schema for User model
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address'] 
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    // set up a virtual called friendCount that grabs the length of the user's friends array field
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
    },
    {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

// get total count of friends on retrieval
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
