export type UniversityFinishDateProfileResponseCommand = {
  isFinished: boolean;
  comingFinishDate: Date;
  apiCalled: Date;
  semester: number;
  middleExamAt?: Date;
  finalExamAt?: Date;
};
