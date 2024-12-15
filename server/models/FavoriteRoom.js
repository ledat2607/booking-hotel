const mongoose = require('mongoose');

const favoriteRoomSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'users',
        },
        rooms: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'rooms',
            },
        ],
    },
    {
        timestamps: true,
    },
);

const FavoriteRoom = mongoose.model('favoriteRoom', favoriteRoomSchema);

module.exports = FavoriteRoom;
