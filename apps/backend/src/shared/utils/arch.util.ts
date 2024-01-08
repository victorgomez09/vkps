export function isARM() {
  const arch = process.arch;
  if (
    arch === 'arm' ||
    arch === 'arm64'
    // arch === 'aarch' ||
    // arch === 'aarch64'
  ) {
    return true;
  }
  return false;
}
