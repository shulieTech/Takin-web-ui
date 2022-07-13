const { exec } = require('child_process');
const fs = require('fs');

const filePath = './dist/version.html';

fs.writeFileSync(filePath, '');

exec(
  `git rev-parse --abbrev-ref HEAD > ${filePath} && git log -n 1 >> ${filePath}`,
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`git版本信息已写入到：${filePath}`);
    }
  }
);
