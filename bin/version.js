const { exec } = require('child_process');
const fs = require('fs');

const filePath = './dist/version.log';

fs.writeFileSync(filePath, '');

exec(
  `git branch --show-current > ${filePath} && git log -n 1 >> ${filePath}`,
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`git版本信息已写入到：${filePath}`);
    }
  }
);
