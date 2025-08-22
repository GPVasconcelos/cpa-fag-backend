/*
  Warnings:

  - You are about to drop the `cursos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `formularios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logs_eventos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `perguntas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `respostas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `turmas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."formularios" DROP CONSTRAINT "formularios_criadoPorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."formularios" DROP CONSTRAINT "formularios_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."logs_eventos" DROP CONSTRAINT "logs_eventos_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."perguntas" DROP CONSTRAINT "perguntas_formularioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."respostas" DROP CONSTRAINT "respostas_formularioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."respostas" DROP CONSTRAINT "respostas_perguntaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."respostas" DROP CONSTRAINT "respostas_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."turmas" DROP CONSTRAINT "turmas_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."usuarios" DROP CONSTRAINT "usuarios_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."usuarios" DROP CONSTRAINT "usuarios_turmaId_fkey";

-- DropTable
DROP TABLE "public"."cursos";

-- DropTable
DROP TABLE "public"."formularios";

-- DropTable
DROP TABLE "public"."logs_eventos";

-- DropTable
DROP TABLE "public"."perguntas";

-- DropTable
DROP TABLE "public"."respostas";

-- DropTable
DROP TABLE "public"."turmas";

-- DropTable
DROP TABLE "public"."usuarios";

-- DropEnum
DROP TYPE "public"."TipoPergunta";

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tipo" "public"."TipoUsuario" NOT NULL,
    "cursoId" INTEGER,
    "turmaId" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Curso" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Turma" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "Turma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Formulario" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "escopo" "public"."EscopoFormulario" NOT NULL,
    "cursoId" INTEGER,
    "turmaId" INTEGER,
    "anonimo" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "inicioEm" TIMESTAMP(3),
    "fimEm" TIMESTAMP(3),
    "criadoPorId" INTEGER NOT NULL,
    "publicadoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Formulario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pergunta" (
    "id" SERIAL NOT NULL,
    "formularioId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER NOT NULL,
    "configuracao" JSONB,

    CONSTRAINT "Pergunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Resposta" (
    "id" SERIAL NOT NULL,
    "formularioId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "cursoId" INTEGER,
    "turmaId" INTEGER,
    "valor" JSONB NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LogEvento" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" INTEGER NOT NULL,
    "antes" JSONB,
    "depois" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogEvento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_tipo_idx" ON "public"."Usuario"("tipo");

-- CreateIndex
CREATE INDEX "Usuario_cursoId_idx" ON "public"."Usuario"("cursoId");

-- CreateIndex
CREATE INDEX "Usuario_turmaId_idx" ON "public"."Usuario"("turmaId");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_nome_key" ON "public"."Curso"("nome");

-- CreateIndex
CREATE INDEX "Curso_nome_idx" ON "public"."Curso"("nome");

-- CreateIndex
CREATE INDEX "Turma_cursoId_idx" ON "public"."Turma"("cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "Turma_nome_cursoId_key" ON "public"."Turma"("nome", "cursoId");

-- CreateIndex
CREATE INDEX "Formulario_escopo_idx" ON "public"."Formulario"("escopo");

-- CreateIndex
CREATE INDEX "Formulario_cursoId_idx" ON "public"."Formulario"("cursoId");

-- CreateIndex
CREATE INDEX "Formulario_turmaId_idx" ON "public"."Formulario"("turmaId");

-- CreateIndex
CREATE INDEX "Formulario_ativo_inicioEm_fimEm_idx" ON "public"."Formulario"("ativo", "inicioEm", "fimEm");

-- CreateIndex
CREATE INDEX "Pergunta_formularioId_idx" ON "public"."Pergunta"("formularioId");

-- CreateIndex
CREATE UNIQUE INDEX "Pergunta_formularioId_ordem_key" ON "public"."Pergunta"("formularioId", "ordem");

-- CreateIndex
CREATE INDEX "Resposta_formularioId_idx" ON "public"."Resposta"("formularioId");

-- CreateIndex
CREATE INDEX "Resposta_perguntaId_idx" ON "public"."Resposta"("perguntaId");

-- CreateIndex
CREATE INDEX "Resposta_usuarioId_idx" ON "public"."Resposta"("usuarioId");

-- CreateIndex
CREATE INDEX "Resposta_cursoId_idx" ON "public"."Resposta"("cursoId");

-- CreateIndex
CREATE INDEX "Resposta_turmaId_idx" ON "public"."Resposta"("turmaId");

-- CreateIndex
CREATE INDEX "LogEvento_usuarioId_criadoEm_idx" ON "public"."LogEvento"("usuarioId", "criadoEm");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "public"."Turma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Turma" ADD CONSTRAINT "Turma_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Formulario" ADD CONSTRAINT "Formulario_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Formulario" ADD CONSTRAINT "Formulario_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Formulario" ADD CONSTRAINT "Formulario_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "public"."Turma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pergunta" ADD CONSTRAINT "Pergunta_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "public"."Formulario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resposta" ADD CONSTRAINT "Resposta_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "public"."Formulario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resposta" ADD CONSTRAINT "Resposta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "public"."Pergunta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resposta" ADD CONSTRAINT "Resposta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resposta" ADD CONSTRAINT "Resposta_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resposta" ADD CONSTRAINT "Resposta_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "public"."Turma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LogEvento" ADD CONSTRAINT "LogEvento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
