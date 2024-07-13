import {setError} from '../errors/errorSchemas.js'

const validator = (validationSchema, additionalValid=()=>'') => async (req, res, next) =>  {
    const {body} = req
    const validResult =  validationSchema.validate(body)
    const addError = await additionalValid(req)

    if (validResult.error){
        res.status(400).json(setError(validResult.error, 401))
    } else if(addError){
        res.status(400).json(setError(addError, 401))
    } else {
        next()
    }

    
}

export {validator }