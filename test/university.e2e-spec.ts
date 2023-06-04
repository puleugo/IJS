import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './test-orm-config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppModule } from '@app/app.module';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { getLastMondayByDate } from '@infrastructure/utils/get-last-monday-by-date';

describe('학교 정보 API e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'MATH_SERVICE',
            transport: Transport.REDIS,
            options: {
              host: process.env.REDIS_HOST || 'localhost',
              port: Number(process.env.REDIS_PORT) || 6379,
              // password: process.env.REDIS_PASSWORD,
            },
          },
        ]),
        ConfigModule.forRoot({ isGlobal: true, cache: true }),
        TypeOrmModule.forRoot(ormConfig),
        EventEmitterModule.forRoot(),
        AppModule,
        // InfrastructureModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const connection = app.get(Connection);
    await connection.synchronize(true); // DB 초기화
  });

  afterAll(async () => {
    await app.close();
  });

  describe('학식 API 동작 테스트', () => {
    const url = '/universities/meals';

    const date = new Date();

    const mealOneDayArray = [
      {
        menu: ['firstMeal #1', 'lastMeal #1'],
        course: 'A',
        publishedAt: date,
      },
      {
        menu: ['firstMeal #2', 'lastMeal #2'],
        course: 'B',
        publishedAt: date,
      },
      {
        menu: ['firstMeal #3', 'lastMeal #3'],
        course: 'C',
        publishedAt: date,
      },
    ];

    const thisMonday = getLastMondayByDate(new Date());
    const lastSunday = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      thisMonday.getDate() - 1,
    );
    const thisTuesday = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      thisMonday.getDate() + 1,
    );
    const thisWednesday = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      thisMonday.getDate() + 2,
    );
    const thisThursday = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      thisMonday.getDate() + 3,
    );
    const thisFriday = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      thisMonday.getDate() + 4,
    );
    const thisSaturday = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      thisMonday.getDate() + 5,
    );

    const mealWeekArray = [
      {
        menu: ['badFirstMeal #1', 'badLastMeal #1'],
        course: 'A',
        publishedAt: lastSunday,
      },
      {
        menu: ['badFirstMeal #2', 'badLastMeal #2'],
        course: 'B',
        publishedAt: lastSunday,
      },
      {
        menu: ['badFirstMeal #3', 'badLastMeal #3'],
        course: 'C',
        publishedAt: lastSunday,
      },
      {
        menu: ['firstMeal #1', 'lastMeal #1'],
        course: 'A',
        publishedAt: thisMonday,
      },
      {
        menu: ['firstMeal #2', 'lastMeal #2'],
        course: 'B',
        publishedAt: thisMonday,
      },
      {
        menu: ['firstMeal #3', 'lastMeal #3'],
        course: 'C',
        publishedAt: thisMonday,
      },
      {
        menu: ['firstMeal #4', 'lastMeal #4'],
        course: 'A',
        publishedAt: thisTuesday,
      },
      {
        menu: ['firstMeal #5', 'lastMeal #5'],
        course: 'B',
        publishedAt: thisTuesday,
      },
      {
        menu: ['firstMeal #6', 'lastMeal #6'],
        course: 'C',
        publishedAt: thisTuesday,
      },
      {
        menu: ['firstMeal #7', 'lastMeal #7'],
        course: 'A',
        publishedAt: thisWednesday,
      },
      {
        menu: ['firstMeal #8', 'lastMeal #8'],
        course: 'B',
        publishedAt: thisWednesday,
      },
      {
        menu: ['firstMeal #9', 'lastMeal #9'],
        course: 'C',
        publishedAt: thisWednesday,
      },
      {
        menu: ['firstMeal #10', 'lastMeal #10'],
        course: 'A',
        publishedAt: thisThursday,
      },
      {
        menu: ['firstMeal #11', 'lastMeal #11'],
        course: 'B',
        publishedAt: thisThursday,
      },
      {
        menu: ['firstMeal #12', 'lastMeal #12'],
        course: 'C',
        publishedAt: thisThursday,
      },
      {
        menu: ['firstMeal #13', 'lastMeal #13'],
        course: 'A',
        publishedAt: thisFriday,
      },
      {
        menu: ['firstMeal #14', 'lastMeal #14'],
        course: 'B',
        publishedAt: thisFriday,
      },
      {
        menu: ['firstMeal #15', 'lastMeal #15'],
        course: 'C',
        publishedAt: thisFriday,
      },
      {
        menu: ['BadFirstMeal #16', 'badLastMeal #16'],
        course: 'A',
        publishedAt: thisSaturday,
      },
      {
        menu: ['BadFirstMeal #16', 'badLastMeal #17'],
        course: 'B',
        publishedAt: thisSaturday,
      },
      {
        menu: ['BadFirstMeal #18', 'badLastMeal #18'],
        course: 'C',
        publishedAt: thisSaturday,
      },
    ];

    it('쿼리가 제공되지 않았을 때 400을 반환해야 함', async () => {
      const response = await request(app.getHttpServer()).get(`${url}`);
      expect(response.status).toBe(400);
    });

    it('금일의 학식이 존재하지 않을 때 404를 반환해야 함', async () => {
      const response = await request(app.getHttpServer()).get(
        `${url}?time_range=today`,
      );
      expect(response.status).toBe(404);
    });

    it('금주의 학식이 존재하지 않을 때 404를 반환해야 함', async () => {
      const response = await request(app.getHttpServer()).get(
        `${url}?time_range=weekly`,
      );
      expect(response.status).toBe(404);
    });

    it('금일의 학식이 존재할 때 200이 반환되어야함.', async () => {
      // given
      const connection = app.get(Connection).getRepository('university_meals');
      await connection.save(mealOneDayArray);

      // when
      const response = await request(app.getHttpServer()).get(
        `${url}?time_range=today`,
      );

      // then
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        '0': {
          courseA: ['firstMeal #1', 'lastMeal #1'],
          courseB: ['firstMeal #2', 'lastMeal #2'],
          courseC: ['firstMeal #3', 'lastMeal #3'],
        },
        time_range: 'today',
      });
    });

    it('금주의 학식이 존재하지 않을 때 404를 반환해야 함', async () => {
      // given
      const connection = await app
        .get(Connection)
        .getRepository('university_meals');
      const meals = await connection.save(mealWeekArray);
      console.log(meals);

      // when
      const response = await request(app.getHttpServer()).get(
        `${url}?time_range=weekly`,
      );

      // then
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        '0': {
          courseA: ['firstMeal #1', 'lastMeal #1'],
          courseB: ['firstMeal #2', 'lastMeal #2'],
          courseC: ['firstMeal #3', 'lastMeal #3'],
        },
        '1': {
          courseA: ['firstMeal #4', 'lastMeal #4'],
          courseB: ['firstMeal #5', 'lastMeal #5'],
          courseC: ['firstMeal #6', 'lastMeal #6'],
        },
        '2': {
          courseA: ['firstMeal #7', 'lastMeal #7'],
          courseB: ['firstMeal #8', 'lastMeal #8'],
          courseC: ['firstMeal #9', 'lastMeal #9'],
        },
        '3': {
          courseA: ['firstMeal #10', 'lastMeal #10'],
          courseB: ['firstMeal #11', 'lastMeal #11'],
          courseC: ['firstMeal #12', 'lastMeal #12'],
        },
        '4': {
          courseA: ['firstMeal #13', 'lastMeal #13'],
          courseB: ['firstMeal #14', 'lastMeal #14'],
          courseC: ['firstMeal #15', 'lastMeal #15'],
        },
        time_range: 'weekly',
      });
    });
  });

  describe('학사 일정 API 동작 테스트', () => {
    const url = '/universities/calendars';

    const date = new Date('2023-01-01');

    const universityEventArray = [];
    for (let month = 0; month < 12; month++) {
      universityEventArray.push({
        title: `event #${month + 1}`,
        startAt: new Date(date.getFullYear(), month, 1),
        endAt: new Date(date.getFullYear(), month, 1),
      });
    }
    universityEventArray.push({
      title: `event #13`,
      startAt: new Date(date.getFullYear() + 1, 0, 1),
      endAt: new Date(date.getFullYear() + 1, 0, 1),
    });
    universityEventArray.push({
      title: `event #14`,
      startAt: new Date(date.getFullYear() + 1, 1, 1),
      endAt: new Date(date.getFullYear() + 1, 1, 1),
    });

    it('API를 호출했을 때 200을 반환해야함.', async () => {
      const response = await request(app.getHttpServer()).get(`${url}`);
      expect(response.status).toBe(200);
    });

    it('시간표를 반환해야함.', async () => {
      // given
      const connection = await app
        .get(Connection)
        .getRepository('university_events');
      await connection.save(universityEventArray);

      // when
      const response = await request(app.getHttpServer()).get(`${url}`);

      // then
      expect(response.body).toEqual({
        Mar: [
          {
            endAt: '2023-03-01',
            id: 3,
            startAt: '2023-03-01',
            title: 'event #3',
          },
        ],
        Apr: [
          {
            endAt: '2023-04-01',
            id: 4,
            startAt: '2023-04-01',
            title: 'event #4',
          },
        ],
        May: [
          {
            endAt: '2023-05-01',
            id: 5,
            startAt: '2023-05-01',
            title: 'event #5',
          },
        ],
        Jun: [
          {
            endAt: '2023-06-01',
            id: 6,
            startAt: '2023-06-01',
            title: 'event #6',
          },
        ],
        Jul: [
          {
            endAt: '2023-07-01',
            id: 7,
            startAt: '2023-07-01',
            title: 'event #7',
          },
        ],
        Aug: [
          {
            id: 8,
            startAt: '2023-08-01',
            endAt: '2023-08-01',
            title: 'event #8',
          },
        ],
        Sep: [
          {
            endAt: '2023-09-01',
            id: 9,
            startAt: '2023-09-01',
            title: 'event #9',
          },
        ],
        Oct: [
          {
            endAt: '2023-10-01',
            id: 10,
            startAt: '2023-10-01',
            title: 'event #10',
          },
        ],
        Nov: [
          {
            endAt: '2023-11-01',
            id: 11,
            startAt: '2023-11-01',
            title: 'event #11',
          },
        ],
        Dec: [
          {
            endAt: '2023-12-01',
            id: 12,
            startAt: '2023-12-01',
            title: 'event #12',
          },
        ],
        Jan: [
          {
            endAt: '2024-01-01',
            id: 13,
            startAt: '2024-01-01',
            title: 'event #13',
          },
        ],
        Feb: [
          {
            endAt: '2024-02-01',
            id: 14,
            startAt: '2024-02-01',
            title: 'event #14',
          },
        ],
      });
    });
  });

  describe('종강 시계 API 동작 테스트', () => {
    const url = '/universities/finish-date';
    const semesters = [
      {
        name: 'semester #1',
        startedAt: new Date('2023-03-02'),
        endedAt: new Date('2023-06-19'),
        year: 2023,
        semesterNumber: 1,
        middleExamAt: new Date('2023-05-01'),
        finalExamAt: new Date('2023-06-01'),
      },
      {
        name: 'semester #2',
        startedAt: new Date('2023-09-01'),
        endedAt: new Date('2023-12-19'),
        year: 2023,
        semesterNumber: 2,
        middleExamAt: new Date('2023-11-01'),
        finalExamAt: new Date('2023-12-01'),
      },
    ];

    it('데이터베이스에 값이 없다면 404를 반환해야 함', async () => {
      const response = await request(app.getHttpServer()).get(`${url}`);
      expect(response.status).toBe(404);
    });

    it('값이 존재한다면 API를 호출했을 때 200을 반환해야 함', async () => {
      const connection = await app
        .get(Connection)
        .getRepository('university_semesters');
      await connection.save(semesters);

      const response = await request(app.getHttpServer()).get(`${url}`);
      expect(response.status).toBe(200);
    });

    it('학기 중에 종강일이 조회되야 함', async () => {
      // given
      const connection = await app
        .get(Connection)
        .getRepository('university_semesters');
      await connection.save(semesters);

      // when
      const response = await request(app.getHttpServer()).get(
        `${url}?date=2023-04-01`,
      );

      // then
      expect(response.body).toEqual({
        // check apiCalled is date
        apiCalled: '2023-04-01T00:00:00.000Z',
        comingFinishDate: '2023-06-20T00:00:00.000Z',
        finalExamAt: '2023-06-01',
        isFinished: false,
        middleExamAt: '2023-05-01',
        semester: 1,
      });
    });

    it('방학 중에 개강일이 조회되야 함', async () => {
      // given
      const connection = await app
        .get(Connection)
        .getRepository('university_semesters');
      await connection.save(semesters);

      // when
      const response = await request(app.getHttpServer()).get(
        `${url}?date=2023-07-01`,
      );

      // then
      expect(response.body).toEqual({
        apiCalled: '2023-07-01T00:00:00.000Z',
        comingFinishDate: '2023-09-01',
        isFinished: true,
        semester: 2,
      });
    });
  });
});
