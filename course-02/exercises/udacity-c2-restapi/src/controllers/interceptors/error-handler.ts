import {Request, Response} from 'express';
import {NextFunction} from 'connect';

export function handleErrors(req: Request, res: Response, next: NextFunction) {
    try {
        next();
    } catch (e) {
        res.status(500).send(e.message);
    }
}
