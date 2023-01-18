const router = require("express").Router();
const userRoutes = require("./userRoutes");
const characterRoutes = require('./characterRoutes');
const playRoutes = require('./playRoutes');

router.use("/users", userRoutes);
router.use('/characters', characterRoutes);
router.use('/play', playRoutes);

module.exports = router;
