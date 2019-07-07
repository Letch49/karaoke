import { getAllAllowedFiles, getFileMeta, copyFileTo } from './src/fs.mjs';
import { copyFile, openSync, readFileSync, fstat, writeFile, appendFile } from 'fs';
import { join, parse } from 'path';
import { createSongListItem } from './src/songlist.mjs'
import { log } from 'util';
import { MAX_SIZE } from './src/settings.mjs'
import { asyncForEach } from './src/functions.mjs';

const base_dir = '../../down/Night In The Tropics';
const end_dir = 'G:/'

const createSongListJson = (path = end_dir) => JSON.parse(readFileSync(`${path}uni_sys/songlist.json`, { encoding: 'utf-8' }));

const createSetOfSongs = (json) => new Set(json.map(item => item.song));
const createFoldersAlready = (json) => {
  if(!json.length) {
    return '000000';
  }
  const file = json[json.length - 1];
  return `${file.folder}${file.file}`
}

const songListJson = createSongListJson(end_dir)
const setOfSongs = createSetOfSongs(songListJson);
let foldersAlready = createFoldersAlready(songListJson);

const songListReadyToWriteTxt = [];


const main = async () => {
  const allowedFiles = await getAllAllowedFiles(base_dir);
  const filesAlreadyExists = [];
  await asyncForEach(allowedFiles, async (file, idx) => {
    const fileMeta = await getFileMeta(join(file.dir, file.name)).then(_ => _);
    if (setOfSongs.has(fileMeta.title)) {
      await filesAlreadyExists.push(fileMeta.title);
      return;
    }

    let folderCode = foldersAlready.slice(0,3);
    let fileCode = (new Number('1' + foldersAlready.slice(3,6)) + 1).toString().slice(1,4);
    if (fileCode > MAX_SIZE) {
      folderCode = (new Number('1' + folderCode) + 1).toString().slice(1,4);
      fileCode = '000';
    }

    songListJson.push({ // добавлять объект к исходному массиву в файле
      song: fileMeta.title,
      file: fileCode,
      folder: folderCode
    });

    foldersAlready = `${folderCode}${fileCode}`;
    songListReadyToWriteTxt.push(createSongListItem(fileMeta.title, fileMeta.artist, 1, foldersAlready));
     
    const getFilePath = join(file.dir, file.name);
    const getFileWithoutExt = parse(getFilePath);
    const fileFullPath = join(getFileWithoutExt.dir, getFileWithoutExt.base);
    const localName = join(end_dir, folderCode, `${fileCode}${getFileWithoutExt.ext}`);
    await copyFileTo(fileFullPath, localName);
    return;
  });
  await writeFile(`${end_dir}uni_sys/songlist.json`, JSON.stringify(songListJson),(err) => console.log(err));
  await appendFile(`${end_dir}uni_sys/songlist.txt`, songListReadyToWriteTxt.join('\n'), (err) => console.log(err));
}
main();

