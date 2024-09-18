import app from './app';

const host = process.env.HOST ?? 'localhost' as const;
const port = process.env.PORT ? Number(process.env.PORT) : 3000 as const;

const server = app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

server.on('error', console.error);
