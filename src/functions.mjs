export const wordCount = word => word.split(' ').reduce((count, w) => count + 1, 0)

export const firstLettersOfWord = word => word.split(' ').reduce((letters, word) => letters.concat(word[0]),'')

export const splitFolderAndSong = (folder, song) => `${folder}${song}`
