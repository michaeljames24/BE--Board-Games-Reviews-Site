exports.handleBadPaths = (req, res) => {
    res.status(404).send({message: "That page does not exist."});
}

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({message: "Invalid Review ID or input object."});
    }
    next(err);
}

exports.handleCustomErrors = (err, req, res, next) => {
    res.status(err.status).send({message: err.message});
}