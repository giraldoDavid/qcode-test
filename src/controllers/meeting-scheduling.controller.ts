import { Request, Response } from 'express';
import { MeetingSchedulingModel } from '../models';


export class MeetingSchedulingController {


    static getDisponibility = async (req: Request, res: Response) => {
        
        try {
            const disponibility = await MeetingSchedulingModel.disponibility(req.body.weekday);
            return res.status(200).json(disponibility);
        } catch (error) {
            console.log(error)
            return res.status(500).json({error: 'Internal Server Error'});    
        }
    }

}