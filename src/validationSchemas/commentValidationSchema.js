import Joi from 'joi'

const commentValidationSchema = Joi.object({
    postID: Joi.string()
        .min(3)
        .max(30)
        .required(),

    body: Joi.string()
        .min(3)
        .required(),
    


}).required()


const commentPatchValidationSchema = Joi.object({
    body: Joi.string()
        .min(3)
        .required()

}).required()


const commentFindByPostValidationSchema = Joi.object({
    postID: Joi.string()
        .min(3)
        .max(30)
        .required(),

}).required()
export {commentValidationSchema, commentPatchValidationSchema, commentFindByPostValidationSchema}