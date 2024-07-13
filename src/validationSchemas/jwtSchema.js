import { jwtConfigTokenPassword, jwtConfigRefreshTokenPassword, jwtConfigEmailConfirmPassword, jwtConfigPasswordChangingPassword } from '../config/jwt-config.js'
import jwt from 'jsonwebtoken'


function generateToken(body){
    const token = jwt.sign(
        {
            _id: body._id
        },
        jwtConfigTokenPassword,
        { expiresIn: 6000 },
    )
    return token
}



function generateRefreshToken(body){
    const refreshToken = jwt.sign(
        {
            _id: body.id,
            refreshToken: true
        },
        jwtConfigRefreshTokenPassword,
        { expiresIn: '7d' },
    )
    return refreshToken
}



function generateEmailConfirmToken(body, code){
    const EmailConfirmToken = jwt.sign(
        {...body, code},
        jwtConfigEmailConfirmPassword,
        { expiresIn: '10m' },
    )
    return EmailConfirmToken
}


function generateRequestPasswordResetToken(body, code){
    const RequestPasswordResetToken = jwt.sign(
        {...body, code},
        jwtConfigPasswordChangingPassword,
        { expiresIn: '10m' },
    )
    return RequestPasswordResetToken
}


function generatePasswordResetToken(body){
    const PasswordResetToken = jwt.sign(
        body,
        jwtConfigPasswordChangingPassword,
        { expiresIn: '10m' },
    )
    return PasswordResetToken
}

export {generateToken, generateRefreshToken, generateEmailConfirmToken, generateRequestPasswordResetToken, generatePasswordResetToken}