import type { Request, Response } from "express";
import { EventService } from "../services/EventService.js";

const eventService = new EventService();

export const getAllEvents = async (_req: Request, res: Response) => {
    try {
        const events = await eventService.getAllEvents();
        res.json(events);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await eventService.getEventById(Number(req.params.id));
        res.json(event);
    } catch (error: any) {
        const status = error.message === "Event not found" ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const getEventsByCreator = async (req: Request, res: Response) => {
    try {
        const events = await eventService.getEventsByCreator(Number(req.params.creator_id));
        res.json(events);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const {
            name, description, max_participants,
            start_time, end_time, address, latitude, longitude,
        } = req.body;

        const creator_id = (req as any).user.id;

        const event = await eventService.createEvent(
            name, description ?? null, creator_id,
            max_participants ?? null,
            new Date(start_time), new Date(end_time),
            address, latitude ?? null, longitude ?? null
        );
        res.status(201).json(event);
    } catch (error: any) {
        const status = error.message.includes("required") || error.message.includes("before") ? 400 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const requesterId = (req as any).user.id;
        const {
            name, description, max_participants,
            start_time, end_time, address, latitude, longitude,
        } = req.body;

        const event = await eventService.updateEvent(id, requesterId, {
            name,
            description: description ?? null,
            max_participants: max_participants ?? null,
            start_time: new Date(start_time),
            end_time: new Date(end_time),
            address,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
        });
        res.json(event);
    } catch (error: any) {
        const status =
            error.message === "Event not found" ? 404 :
            error.message === "Unauthorized" ? 403 :
            error.message.includes("before") ? 400 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const requesterId = (req as any).user.id;
        await eventService.deleteEvent(id, requesterId);
        res.status(204).send();
    } catch (error: any) {
        const status =
            error.message === "Event not found" ? 404 :
            error.message === "Unauthorized" ? 403 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const likeEvent = async (req: Request, res: Response) => {
    try {
        const event = await eventService.likeEvent(Number(req.params.id));
        res.json(event);
    } catch (error: any) {
        const status = error.message === "Event not found" ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const unlikeEvent = async (req: Request, res: Response) => {
    try {
        const event = await eventService.unlikeEvent(Number(req.params.id));
        res.json(event);
    } catch (error: any) {
        const status = error.message === "Event not found" ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};
