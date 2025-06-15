const express = require('express');
const router = express.Router();
const sharerController = require('../controllers/sharer.controller');

router.get('/', sharerController.getAllSharers);
router.get('/:id', sharerController.getSharerById);
router.post('/', sharerController.createSharer);
router.put('/', sharerController.updateSharer);

router.delete('/:id', sharerController.deleteSharer);

module.exports = router;
