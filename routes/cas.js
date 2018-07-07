var express = require('express');
var router = express.Router();

/* GET CAS Path */
router.get( '/authenticate', global.cas.bounce );
router.get( '/logout', global.cas.logout );

module.exports = router;

