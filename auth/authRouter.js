const router = require("express").Router();

const bcrypt = require("bcryptjs");

const Users = require("../users/userModel.js");

router.post("/register", (req, res) => {
    const creds = req.body;

    const rounds = process.env.HASH_ROUNDS || 14;

    const hash = bcrypt.hashSync(creds.password, rounds);

    creds.password = hash;

    Users.add(creds)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: error.message });
        });
});

router.post("/login", (req, res) => {
    let { username, password } = req.body;

    // search for the user using the username
    Users.findBy({ username })
        .then(([user]) => {
            // if we find the user, then also check that passwords match
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.loggedIn = true;
                res.status(200).json({ message: "Welcome!" });
            } else {
                res.status(401).json({ message: "You cannot pass!" });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: error.message });
        });
});

module.exports = router;