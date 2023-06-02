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

const mealOneDayArray = [
  {
    menu: ['firstMeal #1', 'lastMeal #1'],
    course: 'A',
    publishedAt: new Date(),
  },
  {
    menu: ['firstMeal #2', 'lastMeal #2'],
    course: 'B',
    publishedAt: new Date(),
  },
  {
    menu: ['firstMeal #3', 'lastMeal #3'],
    course: 'C',
    publishedAt: new Date(),
  },
];

const date = new Date();
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

    it('쿼리가 때제공되지 않았을 때 400을 반환해야 함', async () => {
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
      const connection = app.get(Connection).getRepository('university_meals');
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
});
