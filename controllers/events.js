const { response: res } = require('express');
const Event = require('../models/Events');

const getEvents = async (request, response = res) => {
    const events = await Event.find().populate('user', 'name');

    response.json({
        ok: true,
        message: 'These are the existing events',
        events
    })
}

const createEvent = async (request, response = res) => {

    const event = new Event(request.body);
    
    try {
        event.user = request.uid;
        const newEvent = await event.save();

        response.json({
            ok: true,
            message: 'New event created',
            event: newEvent
        })
    } catch (error) {
        console.log(error);
        response.status(500).json({
            ok: false,
            message: 'Please contact the administrator of the application'
        })
    }
}

const updateEvent = async (request, response = res) => {

    const eventID = request.params.id;
    const { uid } = request;

    try {

        const event = await Event.findById(eventID);

        if(!event) {
            return response.status(404).json({
                ok: false,
                message: 'This event does not exist',
            })
        }

        if(event.user.toString() !== uid) {
            return response.status(401).json({
                ok: false,
                message: 'You do not have the privileges to edit this event',
            })
        }

        const eventUpdate = { ...request.body, user: uid };
        const eventUpdated = await Event.findByIdAndUpdate(eventID, eventUpdate, { new: true });

        return response.json({
            ok: true,
            message: 'The event has been successfully updated',
            event: eventUpdated
        })
        
    } catch (error) {
        console.log(error);
        response.status(500).json({
            ok: false,
            message: 'Please contact the administrator of the application',
        })
    }
}

const deleteEvent = async (request, response = res) => {
    const eventID = request.params.id;
    const { uid } = request;

    try {
        const event = await Event.findById(eventID);

        if(!event) {
            return response.status(404).json({
                ok: false,
                message: 'This event does not exist',
            })
        }

        if(event.user.toString() !== uid) {
            return response.status(401).json({
                ok: false,
                message: 'You do not have the privileges to delete this event',
            })
        }

        await Event.findByIdAndDelete(eventID);
        
        return response.json({
            ok: true,
            message: 'The event has been successfully delated'
        })
    } catch (error) {
        console.log(error);
        response.status(500).json({
            ok: false,
            message: 'Please contact the administrator of the application',
        })
    }
}

module.exports = { getEvents, createEvent, updateEvent, deleteEvent }