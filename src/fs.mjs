import fs, { copyFile, exists, mkdirSync, mkdir } from 'fs';
import path, { parse } from 'path';
import meta from 'ffmetadata'
import { getAllowedFiles } from './functions.mjs'

/**
 * 
 * @param dirname path to directory
 * @return files contained in the directory
 */
export const readFiles = (dirname) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, files) => {
      const result = files.map(async (filename) => {
        const dir = path.resolve(dirname);
        const name = filename;
        const type = path.extname(filename).toLowerCase() === '' ? 'dir' : path.extname(filename).toLowerCase();
        const children = type === 'dir' ? await readFiles(path.join(dir, filename)).then(list => list) : null;
        return await {
          dir,
          name,
          type,
          children: children !== null ? children : ''
        }
      });
      resolve(Promise.all(result).then(_ => _));
      reject(err);
    })
  })
};

/**
 * 
 * @param filePath path to file
 * @returns object contains metainfo about file
 */
export const getFileMeta = (filePath) => {
  return new Promise((resolve, reject) => {
    meta.read(filePath, function (err, data) {
      if (err) {
        reject(err)
        return -1;
      }

      data = keyObjectToLowerCase(data);
      resolve({
        artist: data.artist ? data.artist.toLowerCase() : null,
        genre: data.genre ? data.genre.toLowerCase() : null,
        title: data.title ? data.title.toLowerCase() : null,
        language: data.language ? data.language.toLowerCase() : null
      })
    });
  })
}


/**
 * 
 * @param dirname path to file
 * @return files contained in the directory with children
 */
export const getAllFiles = (dirname) => {
  return new Promise((resolve, reject) => {
    readFiles(dirname).then((files) => {
      const newFiles = files.map((file) => {
        if (file.type === 'dir') {
          const children = getAllFiles(path.join(path.join(file.dir, file.name)));
          return children;
        }
        return file;
      });
      resolve(Promise.all(newFiles).then(file => [...traverse(file)]));
    });
  })
}

export const getAllAllowedFiles = async (dirname) => {
  const files = await getAllFiles(dirname).then(files => getAllowedFiles(files));
  return files;
}

export const copyFileTo = (file, to) => {
  copyFile(file, to, (err) => {
    if (!err) return;
    if (err.code === 'ENOENT') {
      return mkdir(parse(to).dir,{recursive: true}, (err) => {
        if (err) console.log(err);
        return copyFileTo(file, to);
      })
    }

    if (err) throw err;
  });
}

const keyObjectToLowerCase = (object) => {
  var key, keys = Object.keys(object);
  var n = keys.length;
  var newobj = {}
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = object[key];
  }
  return newobj;
}

function* traverse(array) {
  for (const item of array) {
    if (Array.isArray(item)) {
      yield* traverse(item);
    } else {
      yield item;
    }
  }
}
