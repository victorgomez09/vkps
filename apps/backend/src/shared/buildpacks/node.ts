import { writeFileSync } from 'fs';
import { checkPnpm } from './common';

type NodeProps = {
  baseImage: string;
  workdir: string;
  port: number;
  installCommand: string;
  buildCommand: string;
  startCommand: string;
  baseDirectory: string;
  envs: {
    key: string;
    value: string;
  }[];
};

const createDockerfile = async (data: NodeProps): Promise<void> => {
  const {
    baseImage,
    workdir,
    port,
    installCommand,
    buildCommand,
    startCommand,
    baseDirectory,
    envs,
  } = data;
  const Dockerfile: Array<string> = [];
  const isPnpm = checkPnpm(installCommand, buildCommand, startCommand);

  Dockerfile.push(`FROM ${baseImage}`);
  Dockerfile.push('WORKDIR /app');
  if (envs.length > 0) {
    envs.forEach(({ key, value }) => {
      Dockerfile.push(`ARG ${key}=${value}`);
    });
  }
  if (isPnpm) {
    Dockerfile.push(
      'RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm@7',
    );
  }
  Dockerfile.push(`COPY .${baseDirectory || ''} ./`);
  Dockerfile.push(`RUN ${installCommand}`);
  if (buildCommand) {
    Dockerfile.push(`RUN ${buildCommand}`);
  }
  Dockerfile.push(`EXPOSE ${port}`);
  Dockerfile.push('RUN rm -fr .git');
  Dockerfile.push(`CMD ${startCommand}`);
  writeFileSync(`${workdir}/Dockerfile`, Dockerfile.join('\n'));
};

export default async function (data: NodeProps) {
  try {
    await createDockerfile(data);
  } catch (error) {
    throw error;
  }
}
