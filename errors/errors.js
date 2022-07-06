exports.handleBadPaths = (req, res) => {
    res.status(404).send({message: "That page does not exist."});
}

exports.handlePSQLErrors = (err, req, res, next) => {
    switch (err.code) {
        case "22P02":
            res.status(400).send({message: "Invalid Review ID or input object."});
        case "23503":
            res.status(404).send({message: "That Review ID does not exist."});
        case "23502":
            res.status(400).send({message: "Invalid input object."});
        default: 
            next(err);
    }

}

exports.handleCustomErrors = (err, req, res, next) => {
    res.status(err.status).send({message: err.message});
}