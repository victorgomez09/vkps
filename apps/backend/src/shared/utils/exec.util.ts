import { execSync } from 'child_process';

export const executeCommand = (command: string, path: string) => {
  return execSync(command, {
    cwd: path,
  });
};
