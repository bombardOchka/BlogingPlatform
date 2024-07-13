import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    postID: {type: Schema.Types.ObjectId, ref: 'Post'},
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    body: String,
    date: { type: Date, default: Date.now }
});

const CommentModel = mongoose.model('Comment', CommentSchema);


export { CommentModel }