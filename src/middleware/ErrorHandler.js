export function ErrorHandler(err, req, res, next) {
    if (err){
        res.json(
            {
                status: err.status,
                errorMessage: err.message
            }
        )
    }
}