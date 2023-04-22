import { UniversityCalendarProfileResponseCommand } from '@app/university/command/university-calendar-profile-response.command';

export type MonthlyEventDTO = {
  [key: string]: UniversityCalendarProfileResponseCommand[];
};

export interface UniversityCalendarResponseCommand {
  Mar: MonthlyEventDTO['Mar'];
  Apr: MonthlyEventDTO['Apr'];
  May: MonthlyEventDTO['May'];
  Jun: MonthlyEventDTO['Jun'];
  Jul: MonthlyEventDTO['Jul'];
  Aug: MonthlyEventDTO['Aug'];
  Sep: MonthlyEventDTO['Sep'];
  Oct: MonthlyEventDTO['Oct'];
  Nov: MonthlyEventDTO['Nov'];
  Dec: MonthlyEventDTO['Dec'];
  Jan: MonthlyEventDTO['Jan'];
  Feb: MonthlyEventDTO['Feb'];
}
