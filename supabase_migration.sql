-- Modificar Property para incluir planos y videos
ALTER TABLE "public"."Property" ADD COLUMN "plans" TEXT;
ALTER TABLE "public"."Property" ADD COLUMN "videos" TEXT;
