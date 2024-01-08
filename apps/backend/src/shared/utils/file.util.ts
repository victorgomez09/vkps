import { readdirSync, statSync } from 'fs';
import path from 'path';

export const searchFile = (dir: string, fileName: string): boolean => {
  // read the contents of the directory
  const files = readdirSync(dir);

  // search through the files
  for (const file of files) {
    // build the full path of the file
    const filePath = path.join(dir, file);

    // get the file stats
    const fileStat = statSync(filePath);

    // if the file is a directory, recursively search the directory
    if (fileStat.isDirectory()) {
      searchFile(filePath, fileName);
    } else if (file.endsWith(fileName)) {
      // if the file is a match, print it
      console.log(filePath);
      return true;
    }

    return false;
  }
};
