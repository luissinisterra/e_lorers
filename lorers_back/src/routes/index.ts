import { Router } from 'express';
import { login, register } from '../controllers/AuthController.js';
import {
    getAllEvents,
    getEventById,
    getEventsByCreator,
    createEvent,
    updateEvent,
    deleteEvent,
} from '../controllers/EventController.js';
import {
    getParticipantsByEvent,
    getEventsByUser,
    joinEvent,
    leaveEvent,
} from '../controllers/ParticipantController.js';
import {
    likeEvent,
    unlikeEvent,
    getLikesByEvent,
    hasLiked,
} from '../controllers/EventLikeController.js';
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
router.get('/events/:id_event/likes', authMiddleware, getLikesByEvent);
router.get('/events/:id_event/likes/me', authMiddleware, hasLiked);
router.post('/events/:id_event/like', authMiddleware, likeEvent);
router.delete('/events/:id_event/unlike', authMiddleware, unlikeEvent);

router.get('/events/:id_event/participants', authMiddleware, getParticipantsByEvent);
router.post('/events/:id_event/join', authMiddleware, joinEvent);
router.delete('/events/:id_event/leave', authMiddleware, leaveEvent);
router.get('/participants/user/:id_user', authMiddleware, getEventsByUser);

export default router;
