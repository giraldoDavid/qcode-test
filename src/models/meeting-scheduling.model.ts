import { ApiJson } from '../data';
import { envs } from '../config';

interface Meeting {
    Day: string;
    Hour: string;
    Duration?: number;
}

interface Disponibility extends Meeting {
    isAvailable: boolean;
}

export class MeetingSchedulingModel {
    
    static minutesToHours( value: number ) {
        let hours = Math.floor( value / 60 );
        let minutes: string | number = value % 60;

        if (minutes === 0) minutes = '00';

        return [ hours, minutes ];
    };


    static hoursToMinutes ( programationOfTheDay: Meeting[], iteration: number ): [ number, number ]{

        const [hours, minutes] = programationOfTheDay[ iteration ].Hour.split(':');
        const programTimeInMinutes = Number(hours) * 60 + Number(minutes);

        const meetStart = programTimeInMinutes;
        const meetEnd = programTimeInMinutes + Number(programationOfTheDay[ iteration ].Duration);

        return [ meetStart, meetEnd ];
    }


    static pushDisponibility ( array: Disponibility[], weekday: string, message: string) {
        array.push({
            Day: weekday,
            Hour: message,
            isAvailable: true,
        });
    }

    
    static async disponibility( weekday: string ) {
        
        let startTimeInMinutes = 9 * 60;
        const endTimeInMinutes = 17 * 60;

        let disponibility: Disponibility[] | [] = [];
        let message = '';
        
        try {
            const programationOfTheWeek = await new ApiJson( envs.API_URL ).getJson();

            const programationOfTheDay: Meeting[] =
                programationOfTheWeek.filter(( programation: Meeting ) => {
                    if (programation.Day === weekday) return programation;
                });


            for (let i = 0; i <= programationOfTheDay.length - 1; i++) {

                const [ meetStart, meetEnd ] = this.hoursToMinutes( programationOfTheDay, i );

                if (meetStart > endTimeInMinutes) {
                    
                    const [ meetStart, meetEnd ] = this.hoursToMinutes( programationOfTheDay, i - 1 );
                    const [ initialHours, initialMinutes ] = this.minutesToHours( meetEnd );


                    message = `${initialHours}:${initialMinutes} - 17:00`;

                    this.pushDisponibility(disponibility, weekday, message);

                    continue;
                }

                if (Math.abs(startTimeInMinutes - meetStart) >= 30) {
                    
                    let [ initialHours, initialMinutes ] = this.minutesToHours( startTimeInMinutes );
                    let [ endHours, endMinutes ] = this.minutesToHours( meetStart );

                    message = `${initialHours}:${initialMinutes} - ${endHours}:${endMinutes}`;

                    this.pushDisponibility(disponibility, weekday, message);

                }

                startTimeInMinutes = meetEnd;


                if (
                    i === programationOfTheDay.length - 1 &&
                    meetStart < endTimeInMinutes &&
                    Math.abs(startTimeInMinutes - endTimeInMinutes) >= 30
                    ) {
                        
                        const [meetStart, meetEnd] = this.hoursToMinutes( programationOfTheDay, i );
                        const [initialHours, initialMinutes] = this.minutesToHours( meetEnd );
                        

                        message = `${initialHours}:${initialMinutes} - 17:00`;

                        this.pushDisponibility(disponibility, weekday, message);
                        
                    }
                    
                    
            }

            return disponibility;

        } catch (error) {
            throw ['Internal Server Error'];
        }
    }
}
