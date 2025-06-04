const fs = require("fs");

function getDatePath(date) {
    return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
}

function getDirPath(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) fs.promises.mkdir(dirPath, { recursive: true });
        return dirPath;
    } catch (error) {
        console.log(error.message);
    }
}

// console.log(getDatePath(new Date()));
// console.log(getDirPath('upload/' + getDatePath(new Date())));

module.exports = {
    getDatePath,
    getDirPath
}