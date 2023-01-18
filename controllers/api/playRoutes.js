const router = require('express').Router();
const { Character } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        res.render('play');
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;