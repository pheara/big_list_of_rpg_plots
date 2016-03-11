const fs = require('fs');
const cheerio = require('cheerio');
const mkdirp = require('mkdirp');






const directoryPromise = mkdir('./generated');

const tropesPromise = readFile('./big_list_of_rpg_plots.html');
.then(fileContent => {
  const $ = cheerio.load(fileContent, {
    //normalizeWhitespace: true,
    normalizeWhitespace: false,
    decodeEntities: true,
  });
  const tropeTags = $('.trope').toArray();
  const tropes = tropeTags.map(tropeTag => ({
    html: $(tropeTag).html(),
    title: $(tropeTag).find('h2').html().trim(),
  }));
  return tropes;
})

const filePromises = Promise
  .all([directoryPromise, tropesPromise])
  .then( args => {
    const tropes = args[1];
    console.log('Tropes: \n', tropes.map(t => t.title));
    return Promise.all(
      tropes.map((trope, i) => writeFile(`generated/trope_${i}.html`, trope.html))
    );

    /* TODO
    * either normalizeWhitespace plus prettify html
    * or
    * strip whitespaces from titles
    */
  })

filePromises.then(() => console.log('finished writing.'));







function toFileName(someText) {
  // strip non-ascii-characters
  // collapse spaces to one space
  // replace spaces with underscores
  // all to lowercase
}

function mkdir(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, err => {
      if(err) {
        reject(err);
      } else {
        resolve('directory \'' + path + '\' created successfully');
      }
    })
  })
}


function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err,fileContent) => {
      if(err) {
        reject(err);
      } else {
        resolve(fileContent)
      }
    })
  })
}

function writeFile(filePath, text) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, text, err => {
      if(err) {
        reject(err);
      } else {
        resolve('wrote to ', filePath);
      }
    });
  })
}
