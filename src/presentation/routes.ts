import { Router } from 'express';
import { MeetingSchedulingController } from '../controllers';

export class AppRoutes {


    static get routes(): Router {


        const router = Router();

        router.get('/api', MeetingSchedulingController.getDisponibility)


        return router;
    }

}