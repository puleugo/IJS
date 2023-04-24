import { IUniversityBusSchedule } from '../../../domain/university/university-bus-schedule.interface';

export type UniversityBusProfileCommand = Pick<
  IUniversityBusSchedule,
  'id' | 'title' | 'price' | 'departedOn'
>;
export type UniversityBusResponseCommand = {
  toSchool: UniversityBusProfileCommand[];
  fromSchool: UniversityBusProfileCommand[];
};
