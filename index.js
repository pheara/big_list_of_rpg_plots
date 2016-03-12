const fs = require('fs');
const cheerio = require('cheerio');
const mkdirp = require('mkdirp');
//const html = require('html');
const beautifyHtml = require('js-beautify').html_beautify;




const sourceFile = './fullindex.html';
const targetDir = './_posts';




const directoryPromise = mkdir(targetDir);

const tropesPromise = readFile(sourceFile)
.then(fileContent => {
  const $ = cheerio.load(fileContent, {
    normalizeWhitespace: true,
    decodeEntities: true,
  });
  const tropeTags = $('.trope').toArray();
  const tropes = tropeTags.map(tropeTag => {
    const title = $(tropeTag).find('h2').html().trim();
    const html = $(tropeTag).html();
    const prettyHtml = beautifyHtml(html, {
      indent_size: 2,
      wrap_line_length: 60,
    });
    const id = title
      .replace(/\s/g, '_')
      .replace(/\&apos\;/g, '_')
      .replace(/[\?,]/g, '');
    return {
      trope: $(tropeTag),
      frontmatter: frontmatter(title, id),
      html: prettyHtml,
      id: id,
    }
  });
  return tropes;
})

const filePromises = Promise
  .all([directoryPromise, tropesPromise])
  .then( args => {
    const tropes = args[1];
    //console.log('Tropes: \n', tropes.map(t => t.title));
    return Promise.all(
      tropes.map((trope, i) => {
        const filePath = `${targetDir}/2002-01-01-${trope.id}.html`;
        console.log('writing to', filePath);
        return writeFile(filePath, trope.frontmatter + '\n\n' + trope.html)
      })
    );
  });

filePromises.then(() => console.log('finished writing.'));






function frontmatter(title, id) {
return `---
layout: trope
fragmentid: ${id}
title: "${title}"
date: 2002-01-01 00:00:00 +0000
categories: tropes
---`
}

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
