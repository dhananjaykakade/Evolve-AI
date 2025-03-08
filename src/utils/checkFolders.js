import fs from "fs";
import path from "path";
import { logger } from "./logger.js";
import { exec } from "child_process";

const requiredFolders = ["logs",'src','src/controllers','src/middleware',,'src/routes','src/utils','src/config','src/service','prisma','node_modules'];

export const checkRequiredFolders = () => {
  requiredFolders.forEach((folder) => {
    if (!fs.existsSync(path.resolve(folder))) {
      if(folder=== 'prisma'){
        logger.error(` Prisma folder does not exist. Creating prisma folder...`);
        // execute the prisma 
        exec('npx prisma init', (error, stdout, stderr) => {
          if (error) {
            logger.error(`Error generating prisma: ${error}`);
            process.exit(1);
          }
          logger.info(`Prisma schema generated successfully.`);
        });
      }
      logger.error(`🚀 Creating missing folder: ${folder}`);
      fs.mkdirSync(path.resolve(folder), { recursive: true });
    }
  });

  logger.info("✅ Required folders exist.");
};


