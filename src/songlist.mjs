/**
 * 
 * @param {String} songName - filename of song
 * @param {Number} musicState 0 - music; 1 - vocal;
 * @param {String} artistName - name of author of song
 * @param {Number} wordCountOfSongName - word count of song name; for example: I FIND YOU - 3
 * @param {Number} SongLanguage - language of song
 * @param {Number} VolumeParametrs - 0-9
 * @param {String} SpellOfSongName - first letters of song name; for example: IFY
 * @param {Number} digitName - code of song; from 00001 to 99999; foldername + songname
 * @param {String} spellOfArtist - first letters of artist name
 * @param {Number} sexOfArtist - 1 - male; 2 - female; 3 - Bands;
 * @param {void} _ - not used, but should be 🧠
 * @returns object ready to wtire in songlist.txt and transport to folder;
 */
const songToKaraoke = (songName, musicState = 1, artistName, wordCountOfSongName, SongLanguage, VolumeParametrs, spellOfSongName, digitName, spellOfArtist = 3, sexOfArtist, _ = '') => {
  return `${songName};${musicState};${artistName};${wordCountOfSongName};${SongLanguage};${VolumeParametrs};${spellOfSongName};${digitName};${spellOfArtist};${sexOfArtist};${_};`;
}