export type UniversityBusProfileCommand = {
  title: string;
  price: number;
  departedOn: Date;
};

export type UniversityBusResponseCommand = {
  toSchool: UniversityBusProfileCommand[];
  fromSchool: UniversityBusProfileCommand[];
};
