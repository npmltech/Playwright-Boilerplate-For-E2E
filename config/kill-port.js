const { exec } = require('child_process');

const port = process.argv[2] || process.env.PORT || '9323';

function run(cmd) {
    return new Promise((resolve) => {
        exec(cmd, (err, stdout, stderr) => resolve({ err, stdout: String(stdout || ''), stderr: String(stderr || '') }));
    });
}

(async () => {
    // Try lsof to get PIDs listening on the TCP port
    const { err, stdout } = await run(`lsof -ti tcp:${port}`);
    if (err && !stdout) {
        console.error(`[kill-port] failed to run lsof: ${err.message || err}`);
        process.exit(1);
    }

    const pids = stdout.split(/\s+/).map(s => s.trim()).filter(Boolean);
    if (!pids.length) {
        console.log(`[kill-port] no process listening on port ${port}`);
        process.exit(0);
    }

    console.log(`[kill-port] killing PIDs on port ${port}: ${pids.join(', ')}`);
    for (const pid of pids) {
        try {
            process.kill(Number(pid), 'SIGKILL');
            console.log(`[kill-port] killed ${pid}`);
        } catch (e) {
            console.error(`[kill-port] failed to kill ${pid}: ${e.message}`);
        }
    }
    process.exit(0);
})();