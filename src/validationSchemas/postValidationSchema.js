import Joi from 'joi'

const postValidationSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(30)
        .required(),

    body: Joi.string()
        .min(3)
        .required(),
    
    category: Joi.string(),

    image: Joi.string()
    .min(3)
    .max(200)

}).required()


const postPatchValidationSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(30),

    body: Joi.string()
        .min(3),

    image: Joi.string()
        .min(3)
        .max(200)

}).required()


const postFindByCategoryValidationSchema = Joi.object({
    category: Joi.string()
    .required()

}).required()

export {postValidationSchema, postPatchValidationSchema, postFindByCategoryValidationSchema}