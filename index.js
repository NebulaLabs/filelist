const fs = require('fs');
const express = require('express');
var path = require('path');

const app = express();
const port = 3000;
// const path = '/Users/dylanmckee/IdeaProjects/filelist/media';
const path1 = 'C:\\Users\\User\\Desktop\\other\\filelist\\test';

app.get('/', (req, res) => {


    if (fs.existsSync(path1)) {
        filewalker(path1, function (err, data) {
            newResult = [];
            p = path1.split('\\');
            data.map(res => {
                const newRes = res.replaceAll(path1.replace("\\" + p[p.length - 1], ""), "")
                newResult.push(newRes.substring(1))
            })
            if (err) {
                throw err;
            }
            console.log(newResult);

            const obj = nestedDirectories(newResult).exec();

            return res.status(200).json({ result: obj })

        });

    } else {
        return res.status(404).json({ result: "Directory does not exist" })
    }


    function nestedDirectories(arr) {
        const splittedArray = arr.map(a => a.split('\\'));
        return {
            mergeObjs: function (target, source) {
                for (let key in source) {
                    if (!target[key]) target[key] = {};
                    target[key] = this.mergeObjs(target[key], source[key]);
                }
                return target;
            },
            buildResponse: function (objMain) {
                let arr = [];
                for (let key in objMain) {
                    let o = { folderId: 1, folderName: key, content: [] };
                    if (key.includes(".")) {
                        o.fileId = 1;
                        o.fileName = key;
                        o.fileType = key.split('.').pop();
                        delete o.folderName;
                        delete o.folderId;
                        delete o.content;
                    } else if (Object.keys(objMain[key]).length) {
                        o.content = this.buildResponse(objMain[key]);
                    }
                    arr.push(o);
                }
                return arr;
            },
            exec: function () {
                let targetObject = {};
                splittedArray.forEach(arrParent => {
                    let strObj = '';
                    for (let i = arrParent.length - 1; i >= 0; i--) {
                        strObj = `"${arrParent[i]}": {${strObj}}`;
                    }
                    let parseObj = JSON.parse(`{${strObj}}`);
                    targetObject = this.mergeObjs(targetObject, parseObj);
                });
                return this.buildResponse(targetObject);
            }
        }
    }

    function filewalker(dir, done) {
        let results = [];

        fs.readdir(dir, function (err, list) {
            if (err) return done(err);

            var pending = list.length;

            if (!pending) return done(null, results);

            list.forEach(function (file) {
                file = path.resolve(dir, file);

                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        results.push(file);

                        filewalker(file, function (err, res) {
                            results = results.concat(res);
                            if (!--pending) done(null, results);
                        });
                    } else {
                        results.push(file);

                        if (!--pending) done(null, results);
                    }

                });
            });
        });
    };


});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})