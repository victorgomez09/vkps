import { spawnSync } from 'child_process';

export const executeCommand = (command: string, path: string) => {
  return spawnSync(command, {
    cwd: path,
    shell: true,
  });
};
