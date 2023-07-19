import * as http from 'http';

type ServerType = {
  req: any;
  res: any;
};

const port: number = 3000;

const server = http.createServer((req: ServerType['req'], res: ServerType['res']) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, Node.js server!');
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function shutdown() {
  console.log('Shutting down server gracefully...');
  server.close(() => {
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT signal.');
  shutdown();
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM signal.');
  shutdown();
});
