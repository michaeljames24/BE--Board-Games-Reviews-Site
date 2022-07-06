exports.handleBadPaths = (req, res) => {
    res.status(404).send({message: "That page does not exist."});
}

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ message: "Invalid Review ID or input object." });
    }
    else if (err.code === "23502") {
        res.status(400).send({ message: "Invalid input object." });
    }
    else if (err.code === "23503" && err.constraint === "comments_review_id_fkey") {
        res.status(404).send({ message: "That Review ID does not exist." });
    }
    else if (err.code === "23503" && err.constraint === "comments_author_fkey") {
        res.status(400).send({ message: "Username does not exist." });
    }
    else {next(err);}

}

exports.handleCustomErrors = (err, req, res, next) => {
    res.status(err.status).send({message: err.message});
}