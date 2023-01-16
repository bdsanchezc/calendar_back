/* 
    * Events routes 
    host + /api/events
*/

const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const isDate = require('../helpers/isDate');
const { validateFields } = require('../middlewares/validate-fields');
const { validateToken } = require('../middlewares/validate-token');

router.use(validateToken);

router.get('/', getEvents);

router.post(
    '/', 
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Date start is required').custom(isDate),
        check('end', 'Date end is required').custom(isDate),
        validateFields
    ], 
    createEvent
);

router.put(
    '/:id', 
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Date start is required').custom(isDate),
        check('end', 'Date end is required').custom(isDate),
        validateFields
    ], 
    updateEvent
);

router.delete('/:id', deleteEvent);

module.exports = router;