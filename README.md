# Projeto Flashvolve Backend

Aplicação backend desenvolvida com NodeJS, PrismaORM e PostgreSQL para o projeto Flashvolve. Ela visa integrar mensagens do telegram com um frontend em Vue.

Para ver o projeto rodando entre nesse [link](https://flashvolve-frontend.vercel.app/)

## Como rodar

### Pré-requisitos

- [NodeJS](https://nodejs.org/en)
- [Pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [LocalTunnel](https://github.com/localtunnel/localtunnel)
- [Bot Telegram](https://t.me/BotFather)

### Testes

Para rodar os testes, basta rodar o comando `pnpm test`, ou então, `pnpm test:ci` para ver a cobertura de testes.

### Instalação

1. Clone o repositório.

2. Instale as dependências com o comando `pnpm install`.

3. Renomeie o arquivo `.env.example` para `.env` e preencha as variáveis de ambiente.

4. Rode as migrations com o comando `pnpm prisma migrate dev`.

5. Rode o projeto com o comando `pnpm start`.

6. Rode o LocalTunnel com o comando `lt --port 3333`.

7. Abra a url e configure o LocalTunnel com seu ip.

8. Copie a URL gerada pelo LocalTunnel.

9. Dê um POST na URL `https://api.telegram.org/bot<TELEGRAM_TOKEN>/setWebhook?url=<URL_DO_LOCAL_TUNNEL>/api/telegram/webhook`.

10. Envie uma mensagem para o bot do telegram.

11. Rode o frontend da aplicação para ver as mensagens.

## Pontos de melhoria

- [ ] Adicionar testes de integração.
- [ ] Adicionar Socket.IO para atualizar as mensagens em tempo real.
- [ ] Adicionar Docker.
- [ ] Adicionar CI/CD.
- [ ] Adicionar documentação com Swagger.
