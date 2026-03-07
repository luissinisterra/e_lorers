import { Router } from 'express';
import { login, register } from '../controllers/AuthController.js';
import {
    getAllEvents,
    getEventById,
    getEventsByCreator,
    createEvent,
    updateEvent,
    deleteEvent,
    likeEvent,
    unlikeEvent,
} from '../controllers/EventController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);

router.get('/events', authMiddleware, getAllEvents);
router.get('/events/creator/:creator_id', authMiddleware, getEventsByCreator);
router.get('/events/:id', authMiddleware, getEventById);
router.post('/events', authMiddleware, createEvent);
router.put('/events/:id', authMiddleware, updateEvent);
router.delete('/events/:id', authMiddleware, deleteEvent);
router.post('/events/:id/like', authMiddleware, likeEvent);
router.post('/events/:id/unlike', authMiddleware, unlikeEvent);

export default router;
