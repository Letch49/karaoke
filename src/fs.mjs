import fs from 'fs';
import path from 'path';
import meta from 'ffmetadata'

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


export const getAllFiles = (dirname) => {
  readFiles(dirname).then((file) => {
    
  })
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