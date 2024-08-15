import { v4 as uuid } from 'uuid';
import os from 'os';
import fs from 'fs';
import path from 'path';
import ZipFile from 'adm-zip';

export const createLocalRepo = (): string => {
  const folder = path.join(os.tmpdir(), uuid());
  fs.mkdirSync(folder, { recursive: true });

  const zip = new ZipFile(path.join(__dirname, 'simple-repo.zip'));
  zip.extractAllTo(folder, true);
  return folder;
};
