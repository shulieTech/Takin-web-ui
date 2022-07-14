const { exec } = require('child_process');
const fs = require('fs');

const filePath = './dist/git.json';

fs.writeFileSync(filePath, '');

exec(
  `branchName=$(git rev-parse --abbrev-ref HEAD); commitId=$(git rev-parse HEAD);commitTime=; echo "{\\"branchName\\": \\"$branchName\\", \\"commitId\\": \\"$commitId\\", \\"deployTime\\": \\"$(date)\\" }" > ${filePath}`,
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`git版本信息已写入到：${filePath}`);
    }
  }
);
