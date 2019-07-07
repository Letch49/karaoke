import { readFiles, getFileMeta } from './src/fs';
import path from 'path'
import { stat, openSync, readSync, readFile, readFileSync } from 'fs';
const base_dir = '../../down/Night In The Tropics';


readFiles(base_dir).then((files) => {
  files.map(file => {
    const filePath = path.join(file.dir, file.name);
    const fileMeta = getFileMeta(filePath).then(about => console.log(about));
  });
});

