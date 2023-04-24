export type UniversityBusProfileCommand = {
  id: number;
  title: string;
  price: number;
  departedOn: Date;
};

export type UniversityBusResponseCommand = {
  toSchool: UniversityBusProfileCommand[];
  fromSchool: UniversityBusProfileCommand[];
};
