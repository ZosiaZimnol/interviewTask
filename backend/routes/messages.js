import express from 'express';
import Message from '../models/message.js';

const router = express.Router();

// GET /messages
router.get('/', async (req, res, next) => {
    try {
        const messages = await Message.findAll({ order: [['id', 'ASC']] });
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
});

// POST /messages
router.post('/', async (req, res, next) => {
    try {
        const { content } = req.body;
        const newMessage = await Message.create({ content });
        res.status(201).json(newMessage);
    } catch (error) {
        next(error);
    }
});

// PUT /messages/:id
router.put('/:id', async (req, res, next) => {
    try {
        const { content } = req.body;
        const message = await Message.findByPk(req.params.id);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        message.content = content;
        await message.save();
        res.status(200).json(message);
    } catch (error) {
        next(error);
    }
});

// DELETE /messages/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const message = await Message.findByPk(req.params.id);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        await message.destroy();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
