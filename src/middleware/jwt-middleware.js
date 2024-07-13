import {Strategy, ExtractJwt} from 'passport-jwt'
import { jwtConfigTokenPassword, jwtConfigRefreshTokenPassword, jwtConfigEmailConfirmPassword, jwtConfigPasswordChangingPassword} from '../config/jwt-config.js'
import { UserModel } from "../MongoDBModels/UserModel.js";


const optionToken = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfigTokenPassword,
}

const optionRefreshToken = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfigRefreshTokenPassword,
}

const optionEmailConfirmToken = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfigEmailConfirmPassword,
}

const optionPasswordChangingToken = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfigPasswordChangingPassword,
}

export default (passport) => {
    passport.use(
        'jwt-access',
        new Strategy(optionToken, async (payload, done) => {
            const id = payload._id
            try {
                const UsersData = await UserModel.findOne({ _id: id}).select('-password')
                if (UsersData) {
                    done(null, UsersData)
                } else {
                    done(null, false)
                }
                
            } catch (e) {
                throw new Error(e)
            }
        }),
    )


    passport.use(
        'jwt-refresh-access',
        new Strategy(optionRefreshToken, async (payload, done) => {
            const id = payload._id
            console.log(id)
            try {
                let user = {
                    _id: id
                }
                
                if (user) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            } catch (e) {
                throw new Error(e)
            }
        }),
    )

    passport.use(
        'jwt-email-confirm',
        new Strategy(optionEmailConfirmToken, async (payload, done) => {
            try {
                let userData = payload
                if (userData) {
                    done(null, userData)
                } else {
                    done(null, false)
                }
            } catch (e) {
                throw new Error(e)
            }
        }),
    )

    passport.use(
        'jwt-request-password-reset',
        new Strategy(optionPasswordChangingToken, async (payload, done) => {
            try {
                let userData = payload
                if (userData) {
                    done(null, userData)
                } else {
                    done(null, false)
                }
            } catch (e) {
                throw new Error(e)
            }
        }),
    )

}