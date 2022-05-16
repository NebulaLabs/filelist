const fs = require('fs');
const express = require('express');

const app = express();
const port = 3000;
const path = '/Users/dylanmckee/IdeaProjects/filelist/media'

app.get('/', (req, res) => {
    let results = [];
    fs.readdir(path, (err, files) => {
        files.forEach(file => {
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    console.log(file);
                    results.push({
                        name: file,
                        isDirectory: stat.isDirectory()
                    });
                    res.json(results);

                }
            });
        });

    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});