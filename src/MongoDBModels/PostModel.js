import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostsSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    body: String,
    category: {
        type: String,
        enum: ['all', 'games', "music", "sport", "blog"],
        default: 'all'
    },
    date: { type: Date, default: Date.now },
    image: {
        type: String,
        default: null
    }
});

const PostModel = mongoose.model('Post', PostsSchema);


export { PostModel }