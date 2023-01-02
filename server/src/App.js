import express from "express";
import config from "./config/config.js";
import Logger from "./loaders/logger.js";
import expressApp from "./loaders/index.js";

const startServer = async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));
  await expressApp(app);

  app.listen(config.port, () => {
    Logger.info(`
    ################################################
    🛡️  Server listening on port: ${config.port} 🛡️
    ################################################
  `);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });
}
startServer();

