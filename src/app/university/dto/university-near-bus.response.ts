import { UniversityNearBusResponseCommand } from '@app/university/command/university-near-bus-response.command';

export class UniversityNearBusResponse
  implements UniversityNearBusResponseCommand
{
  readonly busNumber: string; //버스 번호
  readonly busType: string; //저상버스, 일반버스 x
  readonly routeType: string; // 노선 유형 x
  readonly remainStationCount: number; //도착까지 남은 정류장 수
  readonly remainMinute: number; // 버스 도착예상시간
  readonly stationName: string; //정류장 이름 x
  readonly stationId: string; // 정류장 고유 id x

  constructor({
    busNumber,
    busType,
    routeType,
    remainStationCount,
    remainMinute,
    stationName,
    stationId,
  }: UniversityNearBusResponseCommand) {
    this.busNumber = busNumber;
    this.busType = busType;
    this.routeType = routeType;
    this.remainStationCount = remainStationCount;
    this.remainMinute = remainMinute;
    this.stationName = stationName;
    this.stationId = stationId;
  }
}
