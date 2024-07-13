import { Router } from "express";
import {validator} from '../middleware/validationMiddleware.js'
import { userSignValidationSchema, userSignValidation, userLoginValidationSchema, userUpdateValidationSchema, userCodeValidationSchema, userPasswordValidationSchema, userEmailValidationSchema } from "../validationSchemas/userValidationSchema.js";
import bcrypt from 'bcrypt'
import passport from 'passport'
import {generateToken, generateRefreshToken, generateEmailConfirmToken, generateRequestPasswordResetToken, generatePasswordResetToken} from '../validationSchemas/jwtSchema.js'
import {signinError} from '../errors/errorSchemas.js'
import { UserModel } from "../MongoDBModels/UserModel.js";
import { PostModel } from "../MongoDBModels/PostModel.js";
import { CommentModel } from "../MongoDBModels/CommentModel.js";
import { emailConfirmMail, passwordResetMail } from "../utils/smtpUtils.js";


const userRouter = new Router()




userRouter.post('/signup', validator(userSignValidationSchema, userSignValidation), (req, res) => {
        const {body} = req
        const saltRounds = 10
        bcrypt.hash(body.password, saltRounds, async function(err, hash) {
            try {
                body.password = hash

                const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
                const hashedEmailCode = await bcrypt.hash(emailCode, saltRounds);
                
                const emailConfirmToken = generateEmailConfirmToken(body, hashedEmailCode)
                emailConfirmMail(body.username, emailCode, body.email)
                
                res.json({
                    emailConfirmToken: `Bearer ${emailConfirmToken}`
                })
            }
            catch (e) {
                res.status(500).json({
                    error: e.message
                })
            }
        });
    
});

userRouter.post('/emailConfirm', passport.authenticate('jwt-email-confirm', { session: false }), validator(userCodeValidationSchema), async (req, res) => {
    const {user, body} = req
    let {code, ...newUser} = user
    try {
        await bcrypt.compare(body.code, code, async function(err, result) {
            try{
                if (!result){
                    res.status(401).json({message: "Incorrect code!"})
                }
                else {
                    const user = await UserModel.create(newUser)
    
                    const token = generateToken(user)
    
                    const refreshToken = generateRefreshToken(user)
    
                    res.json({
                        token: `Bearer ${token}`,
                        refreshToken: `Bearer ${refreshToken}`
                    })
                }
            }
            catch (e) {
                res.status(500).json({
                    error: e.message
                })
            }
        });
    }
    catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
    

});





userRouter.post('/signin', validator(userLoginValidationSchema), async (req, res, next) => {
    try{
        const {body} = req
        const UsersData = await UserModel.findOne({ email: body.email})
        if (!UsersData){
            res.status(401).json(signinError)
        } else {
            await bcrypt.compare(body.password, UsersData.password, function(err, result) {
                if (!result){
                    res.status(401).json(signinError)
                }
                else {
                    const token = generateToken(UsersData)

                    const refreshToken = generateRefreshToken(UsersData)

                    res.json({
                        token: `Bearer ${token}`,
                        refreshToken: `Bearer ${refreshToken}`
                    })
                }
            });
        }
    }
    catch (e) {
        res.status(401).json({
            error: e.message
        })
    }
});

userRouter.get('/me', passport.authenticate('jwt-access', { session: false }), async (req, res) => {
    try{
        res.json({
            data: req.user
        })
    }
    catch (e) {
        res.status(401).json({
            error: e.message
        })
    }
 });



 userRouter.get('/api/auth/refresh-token', passport.authenticate('jwt-refresh-access', { session: false }),  async (req, res) => {
    try{
        const body = req.user
        const token = generateToken(body)
        res.status(200).json({
            token: `Bearer ${token}`
        })
    }
    catch (e) {
        res.status(401).json({
            error: e.message
        })
    }
 });


 userRouter.patch('/update', passport.authenticate('jwt-access', { session: false }), validator(userUpdateValidationSchema),  async (req, res) => {
    try{
        const user = await UserModel.findByIdAndUpdate(req.user._id, req.body);
        
        res.status(200).json({
            message: "succes"
        })
    }
    catch (e) {
        res.status(401).json({
            error: e.message
        })
    }
 });


 userRouter.delete('/delete/:id', passport.authenticate('jwt-access', { session: false }),  async (req, res) => {
    try{
        const {user} = req 
        const id = req.params.id;

        if (user.role != 'admin' && id != user._id){
            throw new Error("Doesn't have permissions!")
        }

        const userDel = await UserModel.deleteOne( {_id: id})

        const posts = await PostModel.find({ owner: id})

        await posts.forEach(async post => {
            const commentsDel = await CommentModel.deleteMany({postID: post._id})
        })

        const moreCommentsDel = await CommentModel.deleteMany({owner: id})
        const postsDel = await PostModel.deleteMany({owner: id})


        res.status(201).json({
            userDel
        })
    }
    catch (e) {
        res.status(401).json({
            error: e.message
        })
    }
 });


 userRouter.patch('/setAdmin/:id', passport.authenticate('jwt-access', { session: false }),  async (req, res) => {
    try{
        const {user} = req
        const id = req.params.id

        if (user.role != 'admin'){
            throw new Error("Doesn't have permissions!")
        }
        const updateUser = await UserModel.findByIdAndUpdate(id, {role: "admin"});
        
        res.status(200).json({
            message: "succes"
        })
    }
    catch (e) {
        res.status(401).json({
            error: e.message
        })
    }
 });




 userRouter.post('/requestPasswordReset', validator(userEmailValidationSchema), async (req, res) => {
    const {body} = req
    const saltRounds = 10
    
    try {
        const user = await UserModel.findOne({email: body.email});
        if (!user){
            throw new Error("User not found!")
        }

        const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedEmailCode = await bcrypt.hash(emailCode, saltRounds);
        
        const requestPasswordResetToken = generateRequestPasswordResetToken(body, hashedEmailCode)
        passwordResetMail(emailCode, body.email)
        
        res.json({
            requestPasswordResetToken: `Bearer ${requestPasswordResetToken}`
        })
    }
    catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
});



userRouter.post('/resetPasswordAcces', passport.authenticate('jwt-request-password-reset', { session: false }), validator(userCodeValidationSchema), async (req, res) => {
    const {user, body} = req
    console.log(user)
    let {code, ...newUser} = user 
    try {
        const currUser = await UserModel.findOne({email: user.email})
        const id = currUser._id

        await bcrypt.compare(body.code, code, async function(err, result) {
            try{
                if (!result){
                    res.status(401).json({message: "Incorrect code!"})
                }
                else {
                    const passwordResetToken = generatePasswordResetToken({id})

                    res.json({
                        passwordResetToken: `Bearer ${passwordResetToken}`
                    })
                }
            }
            catch (e) {
                res.status(500).json({
                    error: e.message
                })
            }
        });
    }
    catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
});



userRouter.post('/resetPassword', passport.authenticate('jwt-request-password-reset', { session: false }), validator(userPasswordValidationSchema), async (req, res) => {
    const {user, body} = req
    const saltRounds = 10
    
    bcrypt.hash(body.password, saltRounds, async function(err, hash) {
        try {
            body.password = hash

            const userUpdate = await UserModel.findByIdAndUpdate(user.id, {password: body.password});
        
            res.status(200).json({
                message: "password was changing"
            })
        }
        catch (e) {
            res.status(500).json({
                error: e.message
            })
        }
    });
    
    
});


export {userRouter}