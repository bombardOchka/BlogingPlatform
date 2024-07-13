const signinError = {
    status: 400,
    errorMessage: "Не правильний логін або пароль"
}

function setError(err, status){
    return {
        status: status,
        errorMessage: err.message
    }
}

export {signinError, setError}