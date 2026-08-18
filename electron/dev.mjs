import { spawn } from 'node:child_process';
import http from 'node:http';

const DEV_URL = 'http://127.0.0.1:5173';

const isUp = () =>
  new Promise(resolve => {
    const req = http.get(DEV_URL, res => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
  });

const waitForServer = async (timeoutMs = 30000) => {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await isUp()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Vite did not start at ${DEV_URL}`);
};

const children = [];

const start = (command, args) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      ELECTRON: '1',
      VITE_DEV_SERVER_URL: DEV_URL,
    },
  });
  children.push(child);
  return child;
};

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

if (!(await isUp())) {
  start('pnpm', ['dev', '--host', '127.0.0.1', '--port', '5173']);
  await waitForServer();
}

const electron = start('pnpm', ['exec', 'electron', '.']);
electron.on('exit', code => {
  shutdown();
  process.exit(code ?? 0);
});
