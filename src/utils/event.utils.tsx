import { EventInput } from '@fullcalendar/react';

let eventGuid = 0;

export const createEvent = (data: any): EventInput => ({ ...data, id: String(eventGuid++) });
