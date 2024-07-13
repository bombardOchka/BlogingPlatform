import 'dotenv/config'


const jwtConfigTokenPassword = process.env.JWT_CONFIG_TOKEN_PASSWORD;
const jwtConfigRefreshTokenPassword = process.env.JWT_CONFIG_REFRESH_TOKEN_PASSWORD;
const jwtConfigEmailConfirmPassword = process.env.JWT_CONFIG_EMAIL_CONFIRM_PASSWORD;
const jwtConfigPasswordChangingPassword = process.env.JWT_CONFIG_PASSWORD_CHANGING_PASSWORD;


export {jwtConfigTokenPassword, jwtConfigRefreshTokenPassword, jwtConfigEmailConfirmPassword, jwtConfigPasswordChangingPassword}