const router = require("express").Router();

const Users = require('./userModel.js');

router.get("/", (req, res) => {
    Users.find()
    .then(user => {
        res.status(201).json(user)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: error.message })
    })
});

module.exports = router;