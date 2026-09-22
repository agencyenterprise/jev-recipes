import { spawn } from 'node:child_process';

export function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options });
    let output = '';
    child.stdout?.on('data', (data) => {
      output += data;
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) resolve(output);
      else reject(new Error(`${command} ${args.join(' ')} failed (${signal ?? code}).`));
    });
  });
}

export function npm(args, options = {}) {
  return process.env.npm_execpath
    ? run(process.execPath, [process.env.npm_execpath, ...args], options)
    : run('npm', args, options);
}
