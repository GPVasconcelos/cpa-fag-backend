-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('ALUNO', 'COORDENADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."EscopoFormulario" AS ENUM ('CURSO', 'INSTITUCIONAL');

-- CreateEnum
CREATE TYPE "public"."TipoPergunta" AS ENUM ('TEXTO', 'PARAGRAFO', 'RADIO', 'CHECKBOX', 'DROPDOWN', 'ESCALA', 'GRADE', 'UPLOAD', 'DATA', 'HORA');

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" "public"."TipoUsuario" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cursoId" INTEGER,
    "turmaId" INTEGER,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cursos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."turmas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."formularios" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "escopo" "public"."EscopoFormulario" NOT NULL,
    "anonimo" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "inicioEm" TIMESTAMP(3),
    "fimEm" TIMESTAMP(3),
    "publicadoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoPorId" INTEGER NOT NULL,
    "cursoId" INTEGER,

    CONSTRAINT "formularios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."perguntas" (
    "id" SERIAL NOT NULL,
    "enunciado" TEXT NOT NULL,
    "tipo" "public"."TipoPergunta" NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL,
    "configuracaoJson" JSONB,
    "formularioId" INTEGER NOT NULL,

    CONSTRAINT "perguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."respostas" (
    "id" SERIAL NOT NULL,
    "valorJson" JSONB NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formularioId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "cursoId" INTEGER,
    "turmaId" INTEGER,

    CONSTRAINT "respostas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."logs_eventos" (
    "id" SERIAL NOT NULL,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" INTEGER NOT NULL,
    "antesJson" JSONB,
    "depoisJson" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "logs_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_nome_key" ON "public"."cursos"("nome");

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."cursos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "public"."turmas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."turmas" ADD CONSTRAINT "turmas_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."formularios" ADD CONSTRAINT "formularios_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."formularios" ADD CONSTRAINT "formularios_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."cursos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."perguntas" ADD CONSTRAINT "perguntas_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "public"."formularios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."respostas" ADD CONSTRAINT "respostas_formularioId_fkey" FOREIGN KEY ("formularioId") REFERENCES "public"."formularios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."respostas" ADD CONSTRAINT "respostas_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "public"."perguntas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."respostas" ADD CONSTRAINT "respostas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logs_eventos" ADD CONSTRAINT "logs_eventos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
