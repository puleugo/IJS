export type UniversityMealSearchQuery = {
  timeRange?: 'today' | 'weekly';
};

export type UniversityMealInfo = {
  courseA: string[];
  courseB: string[];
  courseC: string[];
};

export type UniversityMealInfoProfileResponseCommand = {
  time_range: 'today' | 'weekly';
  '0': UniversityMealInfo;
  '1'?: UniversityMealInfo;
  '2'?: UniversityMealInfo;
  '3'?: UniversityMealInfo;
  '4'?: UniversityMealInfo;
};
