const { exec } = require('child_process');
const fs = require('fs');

const filePath = './dist/git.json';

fs.writeFileSync(filePath, '');

exec(
  `repository=$(git remote -v | grep fetch | base64); branchName=$(git rev-parse --abbrev-ref HEAD | base64); commitId=$(git rev-parse HEAD | base64); echo "{\\"repository\\":\\"$repository\\",\\"branchName\\": \\"$branchName\\", \\"commitId\\": \\"$commitId\\", \\"buildTime\\": \\"$(date)\\" }" > ${filePath}`,
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`git版本信息已写入到：${filePath}`);
    }
  }
);
