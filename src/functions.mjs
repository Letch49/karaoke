import {allowFormats} from './settings'
export const wordCount = word => word.split(' ').reduce((count, w) => count + 1, 0)

export const firstLettersOfWord = word => word.split(' ').reduce((letters, word) => letters.concat(word[0]),'')

export const splitFolderAndSong = (folder, song) => `${folder}${song}`

export const getAllowedFiles = (arr, prop = 'type') => arr.filter((item) => allowFormats.some(lang => lang === item[prop]))

export const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await waitFor(50);
    await callback(array[index], index, array);
  }
};