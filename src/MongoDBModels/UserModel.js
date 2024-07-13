import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    email: {type: String, unique: true},
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

const UserModel = mongoose.model('User', UserSchema);


export { UserModel }