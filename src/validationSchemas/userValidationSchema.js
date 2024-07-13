import Joi from 'joi'
import { UserModel } from "../MongoDBModels/UserModel.js";

const userSignValidationSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
        .required(),
    
    email: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
        .required(),
    
    role: Joi.string()
        .alphanum()

}).required()

async function userSignValidation(req) {
    const {body} = req
    const UsersData = await UserModel.findOne({ email: body.email})
    if (UsersData)
        return {message: "Account with this email already exists"}
}

const userLoginValidationSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
        .required(),
    
    email: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
        .required()

}).required()


const userUpdateValidationSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()

}).required()


const userCodeValidationSchema = Joi.object({
    code: Joi.string()
        .alphanum()
        .length(6)

}).required()



const userPasswordValidationSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
        .required(),

}).required()



const userEmailValidationSchema = Joi.object({
    email: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
        .required(),

}).required()

export {userSignValidationSchema, userSignValidation, userLoginValidationSchema, userUpdateValidationSchema, userCodeValidationSchema, userPasswordValidationSchema, userEmailValidationSchema}