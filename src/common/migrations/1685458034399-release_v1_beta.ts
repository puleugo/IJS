import { MigrationInterface, QueryRunner, } from 'typeorm';

export class ReleaseV1Beta1685458034399 implements MigrationInterface {
    name = 'ReleaseV1Beta1685458034399';

    public async up(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query(`
            CREATE TABLE "university_bus_schedules"
            (
                "id"          SERIAL                NOT NULL,
                "title"       character varying(20) NOT NULL,
                "price"       smallint              NOT NULL,
                "departed_on" TIME                  NOT NULL,
                "to_school"   boolean               NOT NULL DEFAULT false,
                "from_school" boolean               NOT NULL DEFAULT false,
                CONSTRAINT "UQ_0b3f0895c0e5fd95c216b870617" UNIQUE (
                                                                    "title",
                                                                    "departed_on",
                                                                    "price",
                                                                    "to_school",
                                                                    "from_school"
                    ),
                CONSTRAINT "PK_d15727029e1e6e7177f091aa32f" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "crawler_logs"
            (
                "id"           SERIAL            NOT NULL,
                "crawler_name" character varying NOT NULL,
                "state"        text              NOT NULL,
                "created_at"   TIMESTAMP         NOT NULL DEFAULT now(),
                "crawlerName"  character varying,
                CONSTRAINT "PK_440fdbde38ede51dae2c3f79c52" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "crawlers"
            (
                "id"         SERIAL            NOT NULL,
                "name"       character varying NOT NULL,
                "cron_time"  text              NOT NULL DEFAULT '* 0 * * * *',
                "state"      character varying NOT NULL DEFAULT 'STOPPED',
                "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_a332004bcbb0b7f62a11ce20ac5" UNIQUE ("name"),
                CONSTRAINT "PK_179c3f770c5e191b94cb4ab6211" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "university_semesters"
            (
                "id"              SERIAL                NOT NULL,
                "name"            character varying(50) NOT NULL,
                "year"            smallint              NOT NULL,
                "started_at"      date                  NOT NULL,
                "ended_at"        date                  NOT NULL,
                "semester_number" smallint              NOT NULL,
                "middle_exam_at"  date                  NOT NULL,
                "final_exam_at"   date                  NOT NULL,
                CONSTRAINT "UQ_3fe7fd2f468824f540b56502137" UNIQUE ("name"),
                CONSTRAINT "UQ_82c0315b23a752528751b454f82" UNIQUE ("year", "semester_number"),
                CONSTRAINT "PK_7eed51483bbbd62d27056f075a3" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "user_auth_providers"
            (
                "id"   SERIAL                NOT NULL,
                "name" character varying(50) NOT NULL,
                CONSTRAINT "PK_e3b60f30b8112ac5bb474a2fe4b" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "user_auth"
            (
                "username"           character varying(50) NOT NULL,
                "user_id"            uuid                  NOT NULL,
                "provider_id"        smallint              NOT NULL,
                "vendor_provider_id" integer,
                CONSTRAINT "PK_bea6b55c1fa60a05aa3d5cd0b1b" PRIMARY KEY ("username", "user_id", "provider_id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "user_schedule_sets"
            (
                "id"              SERIAL    NOT NULL,
                "user_id"         uuid      NOT NULL,
                "schedule_set_id" uuid      NOT NULL,
                "created_at"      TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_51c9b7413f03b6f233c0e7cd08d" UNIQUE ("user_id", "schedule_set_id"),
                CONSTRAINT "PK_3c702be3ac16b9816d8d016be8f" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "schedule_sets"
            (
                "id"         uuid      NOT NULL DEFAULT uuid_generate_v4(),
                "owner_id"   uuid      NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_6b39ff5ce1fca6e49b43cc7dddb" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "user_lectures"
            (
                "id"         SERIAL  NOT NULL,
                "user_id"    uuid    NOT NULL,
                "lecture_id" integer NOT NULL,
                CONSTRAINT "UQ_ea5442fc5f3a495948d86aceced" UNIQUE ("user_id", "lecture_id"),
                CONSTRAINT "PK_f56bcba0215e4b725b1eb8efad9" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "university_major_notices"
            (
                "id"       SERIAL            NOT NULL,
                "title"    character varying NOT NULL,
                "url"      character varying NOT NULL,
                "author"   character varying NOT NULL,
                "wrote_at" TIMESTAMP         NOT NULL,
                "major_id" integer,
                CONSTRAINT "PK_7bdc18edcf96d5fed65d793ca0f" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "university_events"
            (
                "id"       SERIAL            NOT NULL,
                "title"    character varying NOT NULL,
                "major_id" integer,
                "start_at" date              NOT NULL,
                "end_at"   date              NOT NULL,
                CONSTRAINT "UQ_4a5690fc2752ca0f0a8bee0dd5a" UNIQUE ("title", "start_at", "end_at"),
                CONSTRAINT "PK_537cccdd5b8c4415125b6b78d5d" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "university_departments"
            (
                "id"   SERIAL            NOT NULL,
                "name" character varying NOT NULL,
                "url"  character varying,
                "slug" character varying,
                CONSTRAINT "UQ_bf145fc4d970a89f0cc2086c380" UNIQUE ("name"),
                CONSTRAINT "UQ_31f3af73ce6178c23edfcb526cf" UNIQUE ("name", "url"),
                CONSTRAINT "PK_d14548e66b526ea558bb0104a13" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "university_majors"
            (
                "id"            SERIAL                NOT NULL,
                "name"          character varying(50) NOT NULL,
                "slug"          character varying(50),
                "department_id" integer               NOT NULL,
                "notice_url"    text,
                CONSTRAINT "UQ_4fa8253bd91854a3e826d52decd" UNIQUE ("slug"),
                CONSTRAINT "UQ_e24fd1cd31a16efaa20d19ff3c9" UNIQUE ("notice_url"),
                CONSTRAINT "UQ_25b7adb7b58b1759334cf138f14" UNIQUE ("name", "department_id"),
                CONSTRAINT "PK_e29de8206b63dcac37a161b73b5" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "users"
            (
                "id"           uuid      NOT NULL DEFAULT uuid_generate_v4(),
                "major_id"     integer,
                "school_id"    character varying(20),
                "school_email" character varying(255),
                "created_at"   TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at"   TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at"   TIMESTAMP,
                CONSTRAINT "UQ_25e1cf8f41bae2f3d11f3c2a028" UNIQUE ("school_id"),
                CONSTRAINT "UQ_bd78220ceffe1758d23851cb27f" UNIQUE ("school_email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "university_lectures"
            (
                "id"            SERIAL                NOT NULL,
                "title"         text                  NOT NULL,
                "weekday_index" smallint              NOT NULL,
                "class_room"    character varying(30) NOT NULL,
                "start_at"      smallint              NOT NULL,
                "end_at"        smallint              NOT NULL,
                "semester_id"   integer,
                CONSTRAINT "PK_7245eb8a52fb1ae2b440df95064" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE INDEX "IDX_34f45220b44228a203fd0f2c2a" ON "university_lectures" ("title")
        `);
    	await queryRunner.query(`
            CREATE TABLE "university_meals"
            (
                "id"           SERIAL NOT NULL,
                "menu"         text array NOT NULL DEFAULT '{}',
                "course"       "public"."university_meals_course_enum",
                "published_at" date   NOT NULL,
                CONSTRAINT "UQ_ac20e543d37de930f0e79dacabf" UNIQUE ("course", "published_at"),
                CONSTRAINT "PK_fb740f581712c794953ac0ada7f" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "user_follows"
            (
                "user_id"      uuid NOT NULL,
                "to_follow_id" uuid NOT NULL,
                CONSTRAINT "PK_58d98b4aeddc0e60db2d6567ba4" PRIMARY KEY ("user_id", "to_follow_id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "university_programs"
            (
                "id"         SERIAL            NOT NULL,
                "title"      text              NOT NULL,
                "author"     character varying NOT NULL,
                "url"        text              NOT NULL,
                "end_at"     TIMESTAMP         NOT NULL,
                "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_bf483170239c794eb745399b47e" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            ALTER TABLE "crawler_logs"
                ADD CONSTRAINT "FK_294706b5fbfb9c7b04e08058a25" FOREIGN KEY ("crawlerName") REFERENCES "crawlers" ("name") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_auth"
                ADD CONSTRAINT "FK_d887e2dcbfe0682c46c055f93d6" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_auth"
                ADD CONSTRAINT "FK_0f634bf05ef6e5cba5e8a51e4cf" FOREIGN KEY ("vendor_provider_id") REFERENCES "user_auth_providers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_schedule_sets"
                ADD CONSTRAINT "FK_a4670f6ac0f289e0066c69daa9e" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_schedule_sets"
                ADD CONSTRAINT "FK_42eb100e22ea730a8f62f594e44" FOREIGN KEY ("schedule_set_id") REFERENCES "schedule_sets" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "schedule_sets"
                ADD CONSTRAINT "FK_0a7aeef6b2f79ddb0f14906ee48" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_lectures"
                ADD CONSTRAINT "FK_e94fbbf0939a8903fd7b33cd686" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_lectures"
                ADD CONSTRAINT "FK_089f2965ee40f44944f82841ce4" FOREIGN KEY ("lecture_id") REFERENCES "university_lectures" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "university_major_notices"
                ADD CONSTRAINT "FK_381e717c168175a80c2e315fe05" FOREIGN KEY ("major_id") REFERENCES "university_majors" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "university_events"
                ADD CONSTRAINT "FK_33ffd96aa80154dd06c4bb7a827" FOREIGN KEY ("major_id") REFERENCES "university_majors" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "university_majors"
                ADD CONSTRAINT "FK_47d9aef1fbaeb44d43e5d2a9d56" FOREIGN KEY ("department_id") REFERENCES "university_departments" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "users"
                ADD CONSTRAINT "FK_3a304667cecfc73e00249965179" FOREIGN KEY ("major_id") REFERENCES "university_majors" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "university_lectures"
                ADD CONSTRAINT "FK_b37b8a785fcfaef54317151ee1e" FOREIGN KEY ("semester_id") REFERENCES "university_semesters" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_follows"
                ADD CONSTRAINT "FK_c197e948ae00e07dd980e9fcc6b" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_follows"
                ADD CONSTRAINT "FK_0755cbb1ff7439674a26d7c5613" FOREIGN KEY ("to_follow_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query(`
            ALTER TABLE "user_follows" DROP CONSTRAINT "FK_0755cbb1ff7439674a26d7c5613"
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_follows" DROP CONSTRAINT "FK_c197e948ae00e07dd980e9fcc6b"
        `);
    	await queryRunner.query(`
            ALTER TABLE "university_lectures" DROP CONSTRAINT "FK_b37b8a785fcfaef54317151ee1e"
        `);
    	await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_3a304667cecfc73e00249965179"
        `);
    	await queryRunner.query(`
            ALTER TABLE "university_majors" DROP CONSTRAINT "FK_47d9aef1fbaeb44d43e5d2a9d56"
        `);
    	await queryRunner.query(`
            ALTER TABLE "university_events" DROP CONSTRAINT "FK_33ffd96aa80154dd06c4bb7a827"
        `);
    	await queryRunner.query(`
            ALTER TABLE "university_major_notices" DROP CONSTRAINT "FK_381e717c168175a80c2e315fe05"
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_lectures" DROP CONSTRAINT "FK_089f2965ee40f44944f82841ce4"
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_lectures" DROP CONSTRAINT "FK_e94fbbf0939a8903fd7b33cd686"
        `);
    	await queryRunner.query(`
            ALTER TABLE "schedule_sets" DROP CONSTRAINT "FK_0a7aeef6b2f79ddb0f14906ee48"
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_schedule_sets" DROP CONSTRAINT "FK_42eb100e22ea730a8f62f594e44"
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_schedule_sets" DROP CONSTRAINT "FK_a4670f6ac0f289e0066c69daa9e"
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_auth" DROP CONSTRAINT "FK_0f634bf05ef6e5cba5e8a51e4cf"
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_auth" DROP CONSTRAINT "FK_d887e2dcbfe0682c46c055f93d6"
        `);
    	await queryRunner.query(`
            ALTER TABLE "crawler_logs" DROP CONSTRAINT "FK_294706b5fbfb9c7b04e08058a25"
        `);
    	await queryRunner.query(`
            DROP TABLE "university_programs"
        `);
    	await queryRunner.query(`
            DROP TABLE "user_follows"
        `);
    	await queryRunner.query(`
            DROP TABLE "university_meals"
        `);
    	await queryRunner.query(`
            DROP INDEX "public"."IDX_34f45220b44228a203fd0f2c2a"
        `);
    	await queryRunner.query(`
            DROP TABLE "university_lectures"
        `);
    	await queryRunner.query(`
            DROP TABLE "users"
        `);
    	await queryRunner.query(`
            DROP TABLE "university_majors"
        `);
    	await queryRunner.query(`
            DROP TABLE "university_departments"
        `);
    	await queryRunner.query(`
            DROP TABLE "university_events"
        `);
    	await queryRunner.query(`
            DROP TABLE "university_major_notices"
        `);
    	await queryRunner.query(`
            DROP TABLE "user_lectures"
        `);
    	await queryRunner.query(`
            DROP TABLE "schedule_sets"
        `);
    	await queryRunner.query(`
            DROP TABLE "user_schedule_sets"
        `);
    	await queryRunner.query(`
            DROP TABLE "user_auth"
        `);
    	await queryRunner.query(`
            DROP TABLE "user_auth_providers"
        `);
    	await queryRunner.query(`
            DROP TABLE "university_semesters"
        `);
    	await queryRunner.query(`
            DROP TABLE "crawlers"
        `);
    	await queryRunner.query(`
            DROP TABLE "crawler_logs"
        `);
    	await queryRunner.query(`
            DROP TABLE "university_bus_schedules"
        `);
    }
}
