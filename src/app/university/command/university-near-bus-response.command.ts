export type UniversityNearBusResponseCommand = {
  busNumber: string; //버스 번호
  busType: string; //저상버스, 일반버스 x
  routeType: string; // 노선 유형 x
  remainStationCount: number; //도착까지 남은 정류장 수
  remainMinute: number; // 버스 도착예상시간
  stationName: string; //정류장 이름 x
  stationId: string; // 정류장 고유 id x
};
