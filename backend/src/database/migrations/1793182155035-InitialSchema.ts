import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1793182155035 implements MigrationInterface {
  name = 'InitialSchema1793182155035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableNames = [
      'users',
      'otp_codes',
      'topics',
      'courses',
      'session_participants',
      'tutoring_sessions',
      'study_partner_matches',
      'academic_materials',
      'reviews',
      'reports',
      'notifications',
    ];
    const existingTables: boolean[] = [];
    for (const tableName of tableNames) {
      existingTables.push(await queryRunner.hasTable(tableName));
    }
    if (existingTables.every(Boolean)) return;
    if (existingTables.some(Boolean)) {
      throw new Error(
        'A partial StudyConnect schema already exists. Review it and create a forward migration; the initial migration will not alter partial schemas.',
      );
    }

    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('LEARNER', 'TUTOR', 'BOTH', 'STUDY_PARTNER', 'ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "gender" character varying(20), "matricNumber" character varying(50), "department" character varying(150), "level" character varying(50), "role" "public"."users_role_enum" NOT NULL DEFAULT 'BOTH', "bio" text, "avatarUrl" character varying(255), "phoneNumber" character varying(30), "coursesToTeach" text, "coursesNeedingHelp" text, "rating" numeric(3,2) NOT NULL DEFAULT '0', "reviewCount" integer NOT NULL DEFAULT '0', "totalSessionsGiven" integer NOT NULL DEFAULT '0', "totalSessionsAttended" integer NOT NULL DEFAULT '0', "isVerified" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."otp_codes_type_enum" AS ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET')`,
    );
    await queryRunner.query(
      `CREATE TABLE "otp_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "code" character varying(255) NOT NULL, "type" "public"."otp_codes_type_enum" NOT NULL DEFAULT 'EMAIL_VERIFICATION', "attempts" integer NOT NULL DEFAULT '0', "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_9d0487965ac1837d57fec4d6a26" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9e85e1945c47dfb71042ae5d19" ON "otp_codes" ("email") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."topics_difficulty_enum" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "topics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "description" text, "difficulty" "public"."topics_difficulty_enum" NOT NULL DEFAULT 'BEGINNER', "courseId" uuid NOT NULL, CONSTRAINT "PK_e4aa99a3fa60ec3a37d1fc4e853" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f511a2b28e4acd2b481f79e55c" ON "topics" ("title") `,
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "code" character varying(20) NOT NULL, "title" character varying(255) NOT NULL, "department" character varying(150) NOT NULL, "level" character varying(50) NOT NULL DEFAULT '100', "description" text, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_86b3589486bac01d2903e22471" ON "courses" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "session_participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sessionId" uuid NOT NULL, "learnerId" uuid NOT NULL, "notes" text, CONSTRAINT "PK_f186de01f7f809e45eaa9bd5b84" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_405fbf7474a2df8d2131619ad1" ON "session_participants" ("sessionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5c1aa99924fa2f7fd68973db86" ON "session_participants" ("learnerId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tutoring_sessions_sessiontype_enum" AS ENUM('ONE_ON_ONE', 'GROUP')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tutoring_sessions_locationtype_enum" AS ENUM('PHYSICAL', 'ONLINE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tutoring_sessions_status_enum" AS ENUM('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tutoring_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "tutorId" uuid NOT NULL, "courseId" uuid NOT NULL, "topicId" uuid, "sessionType" "public"."tutoring_sessions_sessiontype_enum" NOT NULL DEFAULT 'ONE_ON_ONE', "locationType" "public"."tutoring_sessions_locationtype_enum" NOT NULL DEFAULT 'PHYSICAL', "locationVenue" character varying(255), "meetingUrl" character varying(500), "scheduledAt" TIMESTAMP WITH TIME ZONE NOT NULL, "durationMinutes" integer NOT NULL DEFAULT '60', "maxLearners" integer NOT NULL DEFAULT '1', "status" "public"."tutoring_sessions_status_enum" NOT NULL DEFAULT 'SCHEDULED', "notes" text, CONSTRAINT "PK_ac31b0397b399a463de999fe85a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ff838936aa4b0dc247f94ce06d" ON "tutoring_sessions" ("tutorId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ea8d13351ddc0161b1c92dcf35" ON "tutoring_sessions" ("courseId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_38ecab6102de14402561e80710" ON "tutoring_sessions" ("scheduledAt") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."study_partner_matches_status_enum" AS ENUM('ACTIVE', 'RESHUFFLED', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "study_partner_matches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "studentAId" uuid NOT NULL, "studentBId" uuid NOT NULL, "courseId" uuid NOT NULL, "status" "public"."study_partner_matches_status_enum" NOT NULL DEFAULT 'ACTIVE', "preferredFormat" character varying(100), "notes" text, "matchedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_02f1ddf89b88131181ab9a690f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c1dbd42ba71dd212fba27f6e5" ON "study_partner_matches" ("studentAId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d0b9eba3712e0fb0379849b16" ON "study_partner_matches" ("studentBId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2254776123fe51cc6cd0e8dd5c" ON "study_partner_matches" ("courseId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."academic_materials_materialtype_enum" AS ENUM('LECTURE_NOTES', 'PAST_QUESTIONS', 'SLIDES', 'LAB_REPORT', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "academic_materials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "uploaderId" uuid NOT NULL, "courseId" uuid NOT NULL, "topicId" uuid, "title" character varying(255) NOT NULL, "description" text, "fileUrl" character varying(1000) NOT NULL, "materialType" "public"."academic_materials_materialtype_enum" NOT NULL DEFAULT 'LECTURE_NOTES', "fileFormat" character varying(50) NOT NULL DEFAULT 'pdf', "downloadsCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_8d25606c25ecb06c9fbf92e25ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f435d8d55bb9177f9cf7177892" ON "academic_materials" ("uploaderId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_56381e726a512603f36dd9b33f" ON "academic_materials" ("courseId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sessionId" uuid NOT NULL, "tutorId" uuid NOT NULL, "learnerId" uuid NOT NULL, "courseId" uuid NOT NULL, "rating" integer NOT NULL, "comment" text, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a850a1d2a7c119634df63e8a03" ON "reviews" ("sessionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_74f6007c5b68195878108ec64a" ON "reviews" ("tutorId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5bf69933adff1ca058dc6c6660" ON "reviews" ("learnerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_01ad76b89c3d4f612209556e2c" ON "reviews" ("courseId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reports_reason_enum" AS ENUM('NO_SHOW', 'HARASSMENT', 'ACADEMIC_DISHONESTY', 'INAPPROPRIATE_BEHAVIOR', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reports_status_enum" AS ENUM('PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "reporterId" uuid NOT NULL, "reportedUserId" uuid NOT NULL, "sessionId" uuid, "reason" "public"."reports_reason_enum" NOT NULL DEFAULT 'OTHER', "description" text NOT NULL, "status" "public"."reports_status_enum" NOT NULL DEFAULT 'PENDING', "adminNotes" text, CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4353be8309ce86650def2f8572" ON "reports" ("reporterId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c88d2686339ad6d166620b741a" ON "reports" ("reportedUserId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2a732cde6d4172fa7d668e1541" ON "reports" ("sessionId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('SESSION', 'PARTNER', 'REVIEW', 'MATERIAL', 'REPORT', 'SYSTEM')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "title" character varying(255) NOT NULL, "message" text NOT NULL, "type" "public"."notifications_type_enum" NOT NULL DEFAULT 'SYSTEM', "metadata" jsonb, "isRead" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_692a909ee0fa9383e7859f9b40" ON "notifications" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8ba28344602d583583b9ea1a50" ON "notifications" ("isRead") `,
    );
    await queryRunner.query(
      `ALTER TABLE "topics" ADD CONSTRAINT "FK_d126bf5fd3fd90291ac985f7d91" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session_participants" ADD CONSTRAINT "FK_405fbf7474a2df8d2131619ad1d" FOREIGN KEY ("sessionId") REFERENCES "tutoring_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session_participants" ADD CONSTRAINT "FK_5c1aa99924fa2f7fd68973db869" FOREIGN KEY ("learnerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tutoring_sessions" ADD CONSTRAINT "FK_ff838936aa4b0dc247f94ce06de" FOREIGN KEY ("tutorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tutoring_sessions" ADD CONSTRAINT "FK_ea8d13351ddc0161b1c92dcf35b" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tutoring_sessions" ADD CONSTRAINT "FK_1882b3d698dc22592066d620471" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "study_partner_matches" ADD CONSTRAINT "FK_1c1dbd42ba71dd212fba27f6e52" FOREIGN KEY ("studentAId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "study_partner_matches" ADD CONSTRAINT "FK_5d0b9eba3712e0fb0379849b164" FOREIGN KEY ("studentBId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "study_partner_matches" ADD CONSTRAINT "FK_2254776123fe51cc6cd0e8dd5c1" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_materials" ADD CONSTRAINT "FK_f435d8d55bb9177f9cf71778925" FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_materials" ADD CONSTRAINT "FK_56381e726a512603f36dd9b33fb" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "academic_materials" ADD CONSTRAINT "FK_49d12bcaf9ad35c9fa71804f2db" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_a850a1d2a7c119634df63e8a030" FOREIGN KEY ("sessionId") REFERENCES "tutoring_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_74f6007c5b68195878108ec64a2" FOREIGN KEY ("tutorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_5bf69933adff1ca058dc6c66602" FOREIGN KEY ("learnerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_01ad76b89c3d4f612209556e2c3" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_4353be8309ce86650def2f8572d" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_c88d2686339ad6d166620b741a6" FOREIGN KEY ("reportedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_2a732cde6d4172fa7d668e15416" FOREIGN KEY ("sessionId") REFERENCES "tutoring_sessions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    throw new Error(
      'InitialSchema is intentionally irreversible because it can baseline an existing database. Use a forward migration for schema changes.',
    );
  }
}
