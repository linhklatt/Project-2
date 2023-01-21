const router = require('express').Router();
const { Character } = require('../../models');
const withAuth = require('../../utils/auth');
const  { Op } = require('sequelize');

// returns JSON object containing a list of all active id's in the Character table.
router.get('/get-ids/:id', withAuth, async (req, res) => {
    try {
        const idData = await Character.findAll({
            // Return all character.id Where character.id != req.params.id
            where: { id: { [Op.ne]: req.params.id } },
            attributes: { exclude: ['name', 'role', 'user_id'] },
        });

        res.json(idData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/create', withAuth, async (req, res) => {
    try {
        res.render('create', {
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', withAuth, async (req, res) => {
    try {
        const characterData = await Character.findByPk(req.params.id);
        res.json(characterData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', withAuth, async (req, res) => {
    try {
        const newCharacter = await Character.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newCharacter);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const characterData = await Character.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!characterData) {
            res.status(404).json({ message: 'No character found with this id!' });
            return;
        }

        res.status(200).json(characterData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const characterData = await Character.update(
            req.body,
            { where: { id: req.params.id }
        });

        if (!characterData) {
            res.status(404).json({ message: 'No character found with that id.' });
            return;
        }

        res.status(200).json(characterData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;