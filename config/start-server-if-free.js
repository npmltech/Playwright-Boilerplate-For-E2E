import net from 'net';
import { spawn } from 'child_process';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

function isPortInUse(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
}

(async () => {
  const inUse =
    (await isPortInUse(PORT, '127.0.0.1')) || (await isPortInUse(PORT, '::1'));
  if (inUse) {
    console.log(
      `[start-server-if-free] port ${PORT} is in use; skipping start.`
    );
    process.exit(0);
  }

  console.log(
    `[start-server-if-free] port ${PORT} is free; starting server...`
  );
  const child = spawn('yarn', ['start'], { stdio: 'inherit' });

  const forward = (sig) => {
    try {
      child.kill(sig);
    } catch (e) {}
  };

  process.on('SIGINT', () => forward('SIGINT'));
  process.on('SIGTERM', () => forward('SIGTERM'));

  child.on('exit', (code, signal) => {
    if (signal) process.exit(1);
    process.exit(code === null ? 1 : code);
  });
})();
