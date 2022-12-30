import Sequelize from "sequelize";

const posts = class Posts extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            postId: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                comment: "게시글 번호",
            },
            cate: {
                type: Sequelize.ENUM("NORMAL", "QUESTION"),
                allowNull: false,
                defaultValue: "QUESTION",
                comment: "게시글 분류",
            },
            title: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: "게시글 제목",
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: "게시글 내용",
            },
            likes: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
                comment: "게시글 좋아요 수",
            },
            deadLine: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: "게시글 마감기한",
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'posts',
            tableName: 'POSTS',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(db) {
        // 사용자(users)와 게시글(posts)은 1:N 관계
        db.Posts.belongsTo(db.Users, {foreignKey: 'userId', targetKey: 'userId'});

        // 게시글(post)와 댓글(comments)은 1:M 관계
        db.Posts.hasMany(db.Comments, {foreignKey: 'postId', targetKey: 'postId'});
    }
};
export default posts;