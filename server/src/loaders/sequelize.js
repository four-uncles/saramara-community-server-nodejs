import config from "../config/config.js";

import { Sequelize } from "sequelize";
import Users from "../models/users.js";
import Posts from "../models/posts.js";
import Comments from "../models/comments.js";
import Attachs from "../models/attachs.js"

const sequelize = new Sequelize(
    config.databaseName, 
    config.databaseUser, 
    config.databasePassword,
    { 
        host: config.databaseURL, 
        dialect: config.databaseDialect, 
        port: config.databasePort 
    }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// model
db.Users = Users;
db.Posts = Posts;
db.Comments = Comments;
db.Attachs = Attachs;


// model init
Users.init(sequelize);
Posts.init(sequelize);
Comments.init(sequelize);
Attachs.init(sequelize);

// model associate
Users.associate(db);
Posts.associate(db);
Comments.associate(db);

export default db;