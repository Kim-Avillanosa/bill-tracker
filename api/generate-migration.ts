import { exec } from 'child_process';

const generateCommand = () => {
  let command = `npm run build `;
  // command += `&& npm run typeorm migration:create ./src/db/migrations/${process.argv[2]} `;
  command += `&& npm run typeorm -- -d ./src/db/orm.config.ts migration:generate ./src/db/migrations/${process.argv[2]}`;

  return command;
};

(() =>
  exec(generateCommand(), (error, stdout, stderr) => {
    if (error !== null) {
      console.error(stderr);
    }
    console.log(stdout);
  }))();
