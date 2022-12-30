import expressLoader from "./express.js";
import db from "./sequelize.js";
import Logger from "./logger.js";

const expressApp = async (expressApp) => {
    db.sequelize.sync({ force: false })
        .then(() => {
            console.log("DB connect Success!")
            Logger.info("DB connect Success!");
        })
        .catch((error) => {
            console.log(error);
            Logger.info(error);
        });

    await expressLoader(expressApp);
};

export default expressApp;