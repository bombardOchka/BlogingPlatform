import { Router } from "express";
import { CommentModel } from "../MongoDBModels/CommentModel.js";
import { commentValidationSchema, commentPatchValidationSchema, commentFindByPostValidationSchema} from "../validationSchemas/commentValidationSchema.js";
import { validator } from "../middleware/validationMiddleware.js";
import passport from "passport";

const commentRouter = new Router()

commentRouter.post('/comment',  passport.authenticate('jwt-access', { session: false }), validator(commentValidationSchema), async (req, res) => {
    try {

        let {body} = req
        body.owner = req.user._id
        const comment = await CommentModel.create(body)

        res.status(201).json({
            comment
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
});

commentRouter.get('/get/:id', passport.authenticate('jwt-access', { session: false }), async (req, res) => {
    try {

        const id = req.params.id;

        const comment = await CommentModel.findById(id).populate('owner');

        res.status(201).json({
            comment
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})

commentRouter.get('/get', passport.authenticate('jwt-access', { session: false }), async (req, res) => {
    try {

        const id = req.params.id;

        const comment = await CommentModel.find().populate('owner');

        res.status(201).json({
            comment
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }

})

commentRouter.get('/findByPost', passport.authenticate('jwt-access', { session: false }), validator(commentFindByPostValidationSchema), async (req, res) => {
    try {
        const comments = await CommentModel.find({postID: req.body.postID}).populate('owner');

        res.status(201).json({
            comments
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})


commentRouter.delete('/delete/:id',  passport.authenticate('jwt-access', { session: false }), async (req, res) => {
    try {
        const {user} = req 
        const id = req.params.id;
        
        const currPost = await CommentModel.findById(id);
        if (user.role != 'admin' && !currPost.owner.equals(user._id)){
            throw new Error("Doesn't have permissions!")
        }

        const comment = await CommentModel.deleteOne( {_id: id}) 

        res.status(201).json({
            comment
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
});



commentRouter.patch('/patch/:id',  passport.authenticate('jwt-access', { session: false }), validator(commentPatchValidationSchema), async (req, res) => {
    try {
        const {user} = req 
        const id = req.params.id;

        const currPost = await CommentModel.findById(id);
        if (user.role != 'admin' && !currPost.owner.equals(user._id)){
            throw new Error("Doesn't have permissions!")
        }

        const {body} = req
        console.log(body)
        const comment = await CommentModel.findByIdAndUpdate(id, body);

        res.status(201).json({
            message: "succes"
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
});







export {commentRouter}