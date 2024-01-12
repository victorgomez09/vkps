import fs from 'fs';

import { isARM } from './arch.util';

const staticApps = [
  'static',
  'react',
  'vuejs',
  'svelte',
  'gatsby',
  'astro',
  'eleventy',
];

const nodeBased = [
  'react',
  'preact',
  'vuejs',
  'svelte',
  'gatsby',
  'astro',
  'eleventy',
  'node',
  'nestjs',
  'nuxtjs',
  'nextjs',
];

export function setDefaultBaseImage(
  buildPack: string | null,
  deploymentType: string | null = null,
) {
  const nodeVersions = [
    {
      value: 'node:lts',
      label: 'node:lts',
    },
    {
      value: 'node:18',
      label: 'node:18',
    },
    {
      value: 'node:17',
      label: 'node:17',
    },
    {
      value: 'node:16',
      label: 'node:16',
    },
    {
      value: 'node:14',
      label: 'node:14',
    },
    {
      value: 'node:12',
      label: 'node:12',
    },
  ];

  const staticVersions = [
    {
      value: 'webdevops/nginx:alpine',
      label: 'webdevops/nginx:alpine',
    },
    {
      value: 'webdevops/apache:alpine',
      label: 'webdevops/apache:alpine',
    },
    {
      value: 'nginx:alpine',
      label: 'nginx:alpine',
    },
    {
      value: 'httpd:alpine',
      label: 'httpd:alpine (Apache)',
    },
  ];

  const rustVersions = [
    {
      value: 'rust:latest',
      label: 'rust:latest',
    },
    {
      value: 'rust:1.60',
      label: 'rust:1.60',
    },
    {
      value: 'rust:1.60-buster',
      label: 'rust:1.60-buster',
    },
    {
      value: 'rust:1.60-bullseye',
      label: 'rust:1.60-bullseye',
    },
    {
      value: 'rust:1.60-slim-buster',
      label: 'rust:1.60-slim-buster',
    },
    {
      value: 'rust:1.60-slim-bullseye',
      label: 'rust:1.60-slim-bullseye',
    },
    {
      value: 'rust:1.60-alpine3.14',
      label: 'rust:1.60-alpine3.14',
    },
    {
      value: 'rust:1.60-alpine3.15',
      label: 'rust:1.60-alpine3.15',
    },
  ];

  const phpVersions = [
    {
      value: 'webdevops/php-apache:8.2',
      label: 'webdevops/php-apache:8.2',
    },
    {
      value: 'webdevops/php-nginx:8.2',
      label: 'webdevops/php-nginx:8.2',
    },
    {
      value: 'webdevops/php-apache:8.1',
      label: 'webdevops/php-apache:8.1',
    },
    {
      value: 'webdevops/php-nginx:8.1',
      label: 'webdevops/php-nginx:8.1',
    },
    {
      value: 'webdevops/php-apache:8.0',
      label: 'webdevops/php-apache:8.0',
    },
    {
      value: 'webdevops/php-nginx:8.0',
      label: 'webdevops/php-nginx:8.0',
    },
    {
      value: 'webdevops/php-apache:7.4',
      label: 'webdevops/php-apache:7.4',
    },
    {
      value: 'webdevops/php-nginx:7.4',
      label: 'webdevops/php-nginx:7.4',
    },
    {
      value: 'webdevops/php-apache:7.3',
      label: 'webdevops/php-apache:7.3',
    },
    {
      value: 'webdevops/php-nginx:7.3',
      label: 'webdevops/php-nginx:7.3',
    },
    {
      value: 'webdevops/php-apache:7.2',
      label: 'webdevops/php-apache:7.2',
    },
    {
      value: 'webdevops/php-nginx:7.2',
      label: 'webdevops/php-nginx:7.2',
    },
    {
      value: 'webdevops/php-apache:7.1',
      label: 'webdevops/php-apache:7.1',
    },
    {
      value: 'webdevops/php-nginx:7.1',
      label: 'webdevops/php-nginx:7.1',
    },
    {
      value: 'webdevops/php-apache:7.0',
      label: 'webdevops/php-apache:7.0',
    },
    {
      value: 'webdevops/php-nginx:7.0',
      label: 'webdevops/php-nginx:7.0',
    },
    {
      value: 'webdevops/php-apache:5.6',
      label: 'webdevops/php-apache:5.6',
    },
    {
      value: 'webdevops/php-nginx:5.6',
      label: 'webdevops/php-nginx:5.6',
    },
    {
      value: 'webdevops/php-apache:8.2-alpine',
      label: 'webdevops/php-apache:8.2-alpine',
    },
    {
      value: 'webdevops/php-nginx:8.2-alpine',
      label: 'webdevops/php-nginx:8.2-alpine',
    },
    {
      value: 'webdevops/php-apache:8.1-alpine',
      label: 'webdevops/php-apache:8.1-alpine',
    },
    {
      value: 'webdevops/php-nginx:8.1-alpine',
      label: 'webdevops/php-nginx:8.1-alpine',
    },
    {
      value: 'webdevops/php-apache:8.0-alpine',
      label: 'webdevops/php-apache:8.0-alpine',
    },
    {
      value: 'webdevops/php-nginx:8.0-alpine',
      label: 'webdevops/php-nginx:8.0-alpine',
    },
    {
      value: 'webdevops/php-apache:7.4-alpine',
      label: 'webdevops/php-apache:7.4-alpine',
    },
    {
      value: 'webdevops/php-nginx:7.4-alpine',
      label: 'webdevops/php-nginx:7.4-alpine',
    },
    {
      value: 'webdevops/php-apache:7.3-alpine',
      label: 'webdevops/php-apache:7.3-alpine',
    },
    {
      value: 'webdevops/php-nginx:7.3-alpine',
      label: 'webdevops/php-nginx:7.3-alpine',
    },
    {
      value: 'webdevops/php-apache:7.2-alpine',
      label: 'webdevops/php-apache:7.2-alpine',
    },
    {
      value: 'webdevops/php-nginx:7.2-alpine',
      label: 'webdevops/php-nginx:7.2-alpine',
    },
    {
      value: 'webdevops/php-apache:7.1-alpine',
      label: 'webdevops/php-apache:7.1-alpine',
    },
    {
      value: 'php:8.1-fpm',
      label: 'php:8.1-fpm',
    },
    {
      value: 'php:8.0-fpm',
      label: 'php:8.0-fpm',
    },
    {
      value: 'php:8.1-fpm-alpine',
      label: 'php:8.1-fpm-alpine',
    },
    {
      value: 'php:8.0-fpm-alpine',
      label: 'php:8.0-fpm-alpine',
    },
  ];

  const pythonVersions = [
    {
      value: 'python:3.10-alpine',
      label: 'python:3.10-alpine',
    },
    {
      value: 'python:3.10-buster',
      label: 'python:3.10-buster',
    },
    {
      value: 'python:3.10-bullseye',
      label: 'python:3.10-bullseye',
    },
    {
      value: 'python:3.10-slim-bullseye',
      label: 'python:3.10-slim-bullseye',
    },
    {
      value: 'python:3.9-alpine',
      label: 'python:3.9-alpine',
    },
    {
      value: 'python:3.9-buster',
      label: 'python:3.9-buster',
    },
    {
      value: 'python:3.9-bullseye',
      label: 'python:3.9-bullseye',
    },
    {
      value: 'python:3.9-slim-bullseye',
      label: 'python:3.9-slim-bullseye',
    },
    {
      value: 'python:3.8-alpine',
      label: 'python:3.8-alpine',
    },
    {
      value: 'python:3.8-buster',
      label: 'python:3.8-buster',
    },
    {
      value: 'python:3.8-bullseye',
      label: 'python:3.8-bullseye',
    },
    {
      value: 'python:3.8-slim-bullseye',
      label: 'python:3.8-slim-bullseye',
    },
    {
      value: 'python:3.7-alpine',
      label: 'python:3.7-alpine',
    },
    {
      value: 'python:3.7-buster',
      label: 'python:3.7-buster',
    },
    {
      value: 'python:3.7-bullseye',
      label: 'python:3.7-bullseye',
    },
    {
      value: 'python:3.7-slim-bullseye',
      label: 'python:3.7-slim-bullseye',
    },
  ];

  const herokuVersions = [
    {
      value: 'heroku/builder:22',
      label: 'heroku/builder:22',
    },
    {
      value: 'heroku/buildpacks:20',
      label: 'heroku/buildpacks:20',
    },
    {
      value: 'heroku/builder-classic:22',
      label: 'heroku/builder-classic:22',
    },
  ];

  let payload: any = {
    baseImage: null,
    baseBuildImage: null,
    baseImages: [],
    baseBuildImages: [],
  };

  if (nodeBased.includes(buildPack)) {
    if (deploymentType === 'static') {
      payload.baseImage = isARM() ? 'nginx:alpine' : 'webdevops/nginx:alpine';
      payload.baseImages = isARM()
        ? staticVersions.filter(
            (version) => !version.value.includes('webdevops'),
          )
        : staticVersions;
      payload.baseBuildImage = 'node:lts';
      payload.baseBuildImages = nodeVersions;
    } else {
      payload.baseImage = 'node:lts';
      payload.baseImages = nodeVersions;
      payload.baseBuildImage = 'node:lts';
      payload.baseBuildImages = nodeVersions;
    }
  }

  if (staticApps.includes(buildPack)) {
    payload.baseImage = isARM() ? 'nginx:alpine' : 'webdevops/nginx:alpine';
    payload.baseImages = isARM()
      ? staticVersions.filter((version) => !version.value.includes('webdevops'))
      : staticVersions;
    payload.baseBuildImage = 'node:lts';
    payload.baseBuildImages = nodeVersions;
  }
  if (buildPack === 'python') {
    payload.baseImage = 'python:3.10-alpine';
    payload.baseImages = pythonVersions;
  }

  if (buildPack === 'rust') {
    payload.baseImage = 'rust:latest';
    payload.baseBuildImage = 'rust:latest';
    payload.baseImages = rustVersions;
    payload.baseBuildImages = rustVersions;
  }

  if (buildPack === 'deno') {
    payload.baseImage = 'denoland/deno:latest';
  }

  if (buildPack === 'php') {
    payload.baseImage = isARM()
      ? 'php:8.1-fpm-alpine'
      : 'webdevops/php-apache:8.2-alpine';
    payload.baseImages = isARM()
      ? phpVersions.filter((version) => !version.value.includes('webdevops'))
      : phpVersions;
  }

  if (buildPack === 'laravel') {
    payload.baseImage = isARM()
      ? 'php:8.1-fpm-alpine'
      : 'webdevops/php-apache:8.2-alpine';
    payload.baseImages = isARM()
      ? phpVersions.filter((version) => !version.value.includes('webdevops'))
      : phpVersions;
    payload.baseBuildImage = 'node:18';
    payload.baseBuildImages = nodeVersions;
  }

  if (buildPack === 'heroku') {
    payload.baseImage = 'heroku/buildpacks:20';
    payload.baseImages = herokuVersions;
  }

  return payload;
}

export const setDefaultConfiguration = async (data: any) => {
  let {
    buildPack,
    port,
    installCommand,
    startCommand,
    buildCommand,
    publishDirectory,
    baseDirectory,
    dockerFileLocation,
    dockerComposeFileLocation,
    denoMainFile,
  } = data;
  const template = scanningTemplates[buildPack];
  if (!port) {
    port = template?.port || 3000;

    if (buildPack === 'static') port = 80;
    else if (buildPack === 'node') port = 3000;
    else if (buildPack === 'php') port = 80;
    else if (buildPack === 'python') port = 8000;
  }
  if (!installCommand && buildPack !== 'static' && buildPack !== 'laravel')
    installCommand = template?.installCommand || 'yarn install';
  if (!startCommand && buildPack !== 'static' && buildPack !== 'laravel')
    startCommand = template?.startCommand || 'yarn start';
  if (!buildCommand && buildPack !== 'static' && buildPack !== 'laravel')
    buildCommand = template?.buildCommand || null;
  if (!publishDirectory) {
    publishDirectory = template?.publishDirectory || null;
  } else {
    if (!publishDirectory.startsWith('/'))
      publishDirectory = `/${publishDirectory}`;
    if (publishDirectory.endsWith('/'))
      publishDirectory = publishDirectory.slice(0, -1);
  }
  if (baseDirectory) {
    if (!baseDirectory.startsWith('/')) baseDirectory = `/${baseDirectory}`;
    if (baseDirectory.endsWith('/') && baseDirectory !== '/')
      baseDirectory = baseDirectory.slice(0, -1);
  }
  if (dockerFileLocation) {
    if (!dockerFileLocation.startsWith('/'))
      dockerFileLocation = `/${dockerFileLocation}`;
    if (dockerFileLocation.endsWith('/'))
      dockerFileLocation = dockerFileLocation.slice(0, -1);
  } else {
    dockerFileLocation = '/Dockerfile';
  }
  if (dockerComposeFileLocation) {
    if (!dockerComposeFileLocation.startsWith('/'))
      dockerComposeFileLocation = `/${dockerComposeFileLocation}`;
    if (dockerComposeFileLocation.endsWith('/'))
      dockerComposeFileLocation = dockerComposeFileLocation.slice(0, -1);
  } else {
    dockerComposeFileLocation = '/Dockerfile';
  }
  if (!denoMainFile) {
    denoMainFile = 'main.ts';
  }

  return {
    buildPack,
    port,
    installCommand,
    startCommand,
    buildCommand,
    publishDirectory,
    baseDirectory,
    dockerFileLocation,
    dockerComposeFileLocation,
    denoMainFile,
  };
};

export const scanningTemplates = {
  '@sveltejs/kit': {
    buildPack: 'nodejs',
  },
  astro: {
    buildPack: 'astro',
  },
  '@11ty/eleventy': {
    buildPack: 'eleventy',
  },
  svelte: {
    buildPack: 'svelte',
  },
  '@nestjs/core': {
    buildPack: 'nestjs',
  },
  next: {
    buildPack: 'nextjs',
  },
  nuxt: {
    buildPack: 'nuxtjs',
  },
  'react-scripts': {
    buildPack: 'react',
  },
  'parcel-bundler': {
    buildPack: 'static',
  },
  '@vue/cli-service': {
    buildPack: 'vuejs',
  },
  vuejs: {
    buildPack: 'vuejs',
  },
  gatsby: {
    buildPack: 'gatsby',
  },
  'preact-cli': {
    buildPack: 'react',
  },
};

export function checkPnpm(
  installCommand = null,
  buildCommand = null,
  startCommand = null,
) {
  return (
    installCommand?.includes('pnpm') ||
    buildCommand?.includes('pnpm') ||
    startCommand?.includes('pnpm')
  );
}
