exports.handleBadPaths = (req, res) => {
    res.status(404).send({message: "That page does not exist."});
}