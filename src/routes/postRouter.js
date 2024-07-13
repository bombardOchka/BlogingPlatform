import { Router } from "express";
import { PostModel } from "../MongoDBModels/PostModel.js";
import { CommentModel } from "../MongoDBModels/CommentModel.js";
import { postValidationSchema, postPatchValidationSchema, postFindByCategoryValidationSchema} from "../validationSchemas/postValidationSchema.js";
import { validator } from "../middleware/validationMiddleware.js";
import passport from "passport";

const postRouter = new Router()

postRouter.post('/post',  passport.authenticate('jwt-access', { session: false }), validator(postValidationSchema), async (req, res) => {
    try {

        let {body} = req
        body.owner = req.user._id
        const post = await PostModel.create(body)

        res.status(201).json({
            post
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
});

postRouter.get('/get/:id', passport.authenticate('jwt-access', { session: false }), async (req, res) => {
    try {

        const id = req.params.id;

        const post = await PostModel.findById(id).populate('owner');

        res.status(201).json({
            post
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})

postRouter.get('/get', passport.authenticate('jwt-access', { session: false }), async (req, res) => {
    try {

        const id = req.params.id;

        const posts = await PostModel.find().populate('owner');

        res.status(201).json({
            posts
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }

})


postRouter.get('/findByCategory', passport.authenticate('jwt-access', { session: false }), validator(postFindByCategoryValidationSchema), async (req, res) => {
    try {
        const posts = await PostModel.find({category: req.body.category}).populate('owner');

        res.status(201).json({
            posts
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})


postRouter.get('/findByKeyWord/:title', passport.authenticate('jwt-access', { session: false }), async (req, res) => {
    try {
        const posts = await PostModel.find({ title: { $regex: req.params.title, $options: 'i' } }).populate('owner');
        res.status(201).json({
            posts
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})



postRouter.delete('/delete/:id',  passport.authenticate('jwt-access', { session: false }), async (req, res) => {
    try {
        const {user} = req 
        const id = req.params.id;
        
        const currPost = await PostModel.findById(id);
        if (user.role != 'admin' && !currPost.owner.equals(user._id)){
            throw new Error("Doesn't have permissions!")
        }

        const post = await PostModel.deleteOne( {_id: id}) 
        const commentsDel = await CommentModel.deleteMany({postID: id})

        res.status(201).json({
            post
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
});



postRouter.put('/put/:id',  passport.authenticate('jwt-access', { session: false }),validator(postValidationSchema), async (req, res) => {
    try {
        const {user} = req 
        const id = req.params.id;

        const currPost = await PostModel.findById(id);
        if (user.role != 'admin' && !currPost.owner.equals(user._id)){
            throw new Error("Doesn't have permissions!")
        }

        let {body} = req
        body.owner = req.user._id
        const post = await PostModel.findByIdAndUpdate(id, body, { overwrite: true});

        res.status(201).json({
            message: "succes"
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
});


postRouter.patch('/patch/:id',  passport.authenticate('jwt-access', { session: false }), validator(postPatchValidationSchema), async (req, res) => {
    try {
        const {user} = req 
        const id = req.params.id;

        const currPost = await PostModel.findById(id);
        if (user.role != 'admin' && !currPost.owner.equals(user._id)){
            throw new Error("Doesn't have permissions!")
        }

        const {body} = req
        let update = {}
        if (body.title){
            update.title = body.title
        }
        if (body.body){
            update.body = body.body
        }
        if (body.image){
            update.image = body.image
        }
        const post = await PostModel.findByIdAndUpdate(id, update);

        res.status(201).json({
            message: "succes"
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
});







export {postRouter}