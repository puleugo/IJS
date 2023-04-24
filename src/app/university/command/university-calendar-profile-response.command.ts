import { IUniversityEvent } from '../../../domain/university/university-event.interface';

export type UniversityCalendarProfileResponseCommand = Pick<
  IUniversityEvent,
  'id' | 'title' | 'startAt' | 'endAt'
>;
