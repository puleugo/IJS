import { MigrationInterface, QueryRunner, } from 'typeorm';

export class ReleaseV2Beta1689361006233 implements MigrationInterface {
    name = 'ReleaseV2Beta1689361006233';

    public async up(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query(`
            CREATE TABLE "deliveries"
            (
                "id"           SERIAL            NOT NULL,
                "order_name"   character varying NOT NULL,
                "store_url"    character varying NOT NULL,
                "order_url"    character varying NOT NULL,
                "delivery_url" character varying NOT NULL,
                "created_at"   TIMESTAMP         NOT NULL DEFAULT now(),
                "deleted_at"   TIMESTAMP,
                CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "boards"
            (
                "id"             SMALLSERIAL            NOT NULL,
                "name"           character varying(255) NOT NULL,
                "description"    character varying(255) NOT NULL,
                "articles_count" integer                NOT NULL DEFAULT '0',
                "is_anonymous"   boolean                NOT NULL DEFAULT false,
                "created_at"     TIMESTAMP              NOT NULL DEFAULT now(),
                "updated_at"     TIMESTAMP              NOT NULL DEFAULT now(),
                "deleted_at"     TIMESTAMP,
                CONSTRAINT "PK_606923b0b068ef262dfdcd18f44" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE INDEX "IDX_19ed7ce2fd82856a7038567174" ON "boards" ("deleted_at")
        `);
    	await queryRunner.query(`
            CREATE TABLE "article_likes"
            (
                "article_id" integer   NOT NULL,
                "author_id"  uuid      NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ea15135b89d8f907a4cc26c9752" PRIMARY KEY ("article_id", "author_id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "comment_likes"
            (
                "comment_id" bigint    NOT NULL,
                "author_id"  uuid      NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_1dd201afaf8adb6cdada49b9056" PRIMARY KEY ("comment_id", "author_id")
            )
        `);
    	await queryRunner.query(`
            CREATE TABLE "comments"
            (
                "id"          BIGSERIAL              NOT NULL,
                "content"     character varying(200) NOT NULL,
                "article_id"  integer                NOT NULL,
                "author_id"   uuid                   NOT NULL,
                "likes_count" integer                NOT NULL DEFAULT '0',
                "reply_to_id" bigint,
                "created_at"  TIMESTAMP              NOT NULL DEFAULT now(),
                "deleted_at"  TIMESTAMP,
                CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE INDEX "IDX_8e7c9a36c0ac867b543c6509aa" ON "comments" ("created_at")
        `);
    	await queryRunner.query(`
            CREATE INDEX "IDX_b6f97e2e112b5d7bad003655b7" ON "comments" ("deleted_at")
        `);
    	await queryRunner.query(`
            CREATE TABLE "articles"
            (
                "id"             SERIAL                  NOT NULL,
                "title"          character varying(255)  NOT NULL,
                "content"        character varying(4000) NOT NULL,
                "images"         character varying(255) array,
                "board_id"       smallint                NOT NULL,
                "author_id"      uuid                    NOT NULL,
                "views_count"    integer                 NOT NULL DEFAULT '0',
                "comments_count" integer                 NOT NULL DEFAULT '0',
                "likes_count"    integer                 NOT NULL DEFAULT '0',
                "created_at"     TIMESTAMP               NOT NULL DEFAULT now(),
                "updated_at"     TIMESTAMP               NOT NULL DEFAULT '"2023-07-14T18:56:51.635Z"',
                "deleted_at"     TIMESTAMP,
                CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id")
            )
        `);
    	await queryRunner.query(`
            CREATE INDEX "IDX_766eaf03c57b40f88a205e0c7e" ON "articles" ("created_at")
        `);
    	await queryRunner.query(`
            CREATE INDEX "IDX_81584df35625f1e8b3af41daef" ON "articles" ("deleted_at")
        `);
    	await queryRunner.query(`
            ALTER TABLE "users"
                ADD "is_verified" boolean NOT NULL DEFAULT false
        `);
    	await queryRunner.query(`
            ALTER TABLE "users"
                ADD "delivery_id" integer
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_auth_providers"
                ADD CONSTRAINT "UQ_3f703e2aeb5c14388c45cc6d669" UNIQUE ("name")
        `);
    	await queryRunner.query(`
            ALTER TABLE "article_likes"
                ADD CONSTRAINT "FK_78ef1e3144629e94df4e80baa34" FOREIGN KEY ("article_id") REFERENCES "articles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "article_likes"
                ADD CONSTRAINT "FK_d1ac8a419d9ad79a639878d9b76" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "comment_likes"
                ADD CONSTRAINT "FK_2073bf518ef7017ec19319a65e5" FOREIGN KEY ("comment_id") REFERENCES "comments" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "comment_likes"
                ADD CONSTRAINT "FK_1554e581835838aba50f849d7c1" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "comments"
                ADD CONSTRAINT "FK_e9b498cca509147e73808f9e593" FOREIGN KEY ("article_id") REFERENCES "articles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "comments"
                ADD CONSTRAINT "FK_e6d38899c31997c45d128a8973b" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "comments"
                ADD CONSTRAINT "FK_06f316e1f2279bf691ed5f1fd52" FOREIGN KEY ("reply_to_id") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "articles"
                ADD CONSTRAINT "FK_24b7266824b3f842d9ada3d8245" FOREIGN KEY ("board_id") REFERENCES "boards" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "articles"
                ADD CONSTRAINT "FK_6515da4dff8db423ce4eb841490" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    	await queryRunner.query(`
            ALTER TABLE "users"
                ADD CONSTRAINT "FK_3427c02cc62d617526370cb0e2b" FOREIGN KEY ("delivery_id") REFERENCES "deliveries" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_3427c02cc62d617526370cb0e2b"
        `);
    	await queryRunner.query(`
            ALTER TABLE "articles" DROP CONSTRAINT "FK_6515da4dff8db423ce4eb841490"
        `);
    	await queryRunner.query(`
            ALTER TABLE "articles" DROP CONSTRAINT "FK_24b7266824b3f842d9ada3d8245"
        `);
    	await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_06f316e1f2279bf691ed5f1fd52"
        `);
    	await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_e6d38899c31997c45d128a8973b"
        `);
    	await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_e9b498cca509147e73808f9e593"
        `);
    	await queryRunner.query(`
            ALTER TABLE "comment_likes" DROP CONSTRAINT "FK_1554e581835838aba50f849d7c1"
        `);
    	await queryRunner.query(`
            ALTER TABLE "comment_likes" DROP CONSTRAINT "FK_2073bf518ef7017ec19319a65e5"
        `);
    	await queryRunner.query(`
            ALTER TABLE "article_likes" DROP CONSTRAINT "FK_d1ac8a419d9ad79a639878d9b76"
        `);
    	await queryRunner.query(`
            ALTER TABLE "article_likes" DROP CONSTRAINT "FK_78ef1e3144629e94df4e80baa34"
        `);
    	await queryRunner.query(`
            ALTER TABLE "user_auth_providers" DROP CONSTRAINT "UQ_3f703e2aeb5c14388c45cc6d669"
        `);
    	await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "delivery_id"
        `);
    	await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "is_verified"
        `);
    	await queryRunner.query(`
            DROP INDEX "public"."IDX_81584df35625f1e8b3af41daef"
        `);
    	await queryRunner.query(`
            DROP INDEX "public"."IDX_766eaf03c57b40f88a205e0c7e"
        `);
    	await queryRunner.query(`
            DROP TABLE "articles"
        `);
    	await queryRunner.query(`
            DROP INDEX "public"."IDX_b6f97e2e112b5d7bad003655b7"
        `);
    	await queryRunner.query(`
            DROP INDEX "public"."IDX_8e7c9a36c0ac867b543c6509aa"
        `);
    	await queryRunner.query(`
            DROP TABLE "comments"
        `);
    	await queryRunner.query(`
            DROP TABLE "comment_likes"
        `);
    	await queryRunner.query(`
            DROP TABLE "article_likes"
        `);
    	await queryRunner.query(`
            DROP INDEX "public"."IDX_19ed7ce2fd82856a7038567174"
        `);
    	await queryRunner.query(`
            DROP TABLE "boards"
        `);
    	await queryRunner.query(`
            DROP TABLE "deliveries"
        `);
    }
}
