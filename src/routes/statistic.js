import { Router } from "express";
import { postValidationSchema, postPatchValidationSchema, postFindByCategoryValidationSchema} from "../validationSchemas/postValidationSchema.js";
import { validator } from "../middleware/validationMiddleware.js";
import passport from "passport";
import { UserModel } from "../MongoDBModels/UserModel.js";
import { PostModel } from "../MongoDBModels/PostModel.js";
import { CommentModel } from "../MongoDBModels/CommentModel.js";

const statistikRouter = new Router()




statistikRouter.get('/posts', passport.authenticate('jwt-access', { session: false }), async (req, res) => {
    try {
        const {user} = req
        // const id = req.params.id
        if (user.role != 'admin'){
            throw new Error("Doesn't have permissions!")
        }

        const postsCount = await PostModel.find().count();

        res.status(201).json({
            postsCount
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})


statistikRouter.get('/comments', passport.authenticate('jwt-access', { session: false }), async (req, res) => {
    try {
        const {user} = req
        // const id = req.params.id
        if (user.role != 'admin'){
            throw new Error("Doesn't have permissions!")
        }

        const commentsCount = await CommentModel.find().count();

        res.status(201).json({
            commentsCount
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})

statistikRouter.get('/commentsByPost/:id', passport.authenticate('jwt-access', { session: false }), async (req, res) => {
    try {
        const {user} = req
        const id = req.params.id
        if (user.role != 'admin'){
            throw new Error("Doesn't have permissions!")
        }

        const commentsCount = await CommentModel.find({postID: id});

        res.status(201).json({
            commentsCount: commentsCount.length
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})



statistikRouter.get('/users', passport.authenticate('jwt-access', { session: false }), async (req, res) => {
    try {
        const {user} = req
        // const id = req.params.id
        if (user.role != 'admin'){
            throw new Error("Doesn't have permissions!")
        }

        const usersCount = await UserModel.find().count();

        res.status(201).json({
            usersCount
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})


export {statistikRouter}