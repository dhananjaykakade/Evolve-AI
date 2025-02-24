import fs from "fs";
import path from "path";
import { logger } from "./logger.js";

const requiredFolders = ["logs"];

export const checkRequiredFolders = () => {
  requiredFolders.forEach((folder) => {
    if (!fs.existsSync(path.resolve(folder))) {
      logger.debug(`🚀 Creating missing folder: ${folder}`);
      fs.mkdirSync(path.resolve(folder), { recursive: true });
    }
  });

  logger.info("✅ Required folders exist.");
};


