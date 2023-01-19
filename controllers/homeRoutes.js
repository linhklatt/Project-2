const router = require('express').Router();
const { Character, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    res.render('homepage', {
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/home', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on their session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Character }],
    });

    const user = userData.get({ plain: true });

    res.render('userhome', {
      ...user,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/characters', async(req, res) => {
  try {
    const characterData = await Character.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const characters = characterData.map((character) => character.get({ plain: true }));

    res.render('characters', {
      characters,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/home');
      return;
    }
  
    res.render('login');
});

module.exports = router;