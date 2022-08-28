import { EventInput } from '@fullcalendar/react';

let eventGuid = 0;

export const createEvent = <T,>(data: T): EventInput & T => ({ ...data, id: String(eventGuid++) });
