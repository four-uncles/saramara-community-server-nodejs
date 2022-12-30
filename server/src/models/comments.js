import Sequelize from "sequelize";

const comments = class Comments extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            commentId: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey:true,
                autoIncrement: true,
                comment: "댓글 번호",
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
                comment: "댓글 내용",
            },
            pick: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                comment: "선택한 후보",
            },
            like: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
                comment: "댓글 좋아요 수",
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'comments',
            tableName: 'COMMENTS',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(db) {
        // 사용자(users)와 댓글(comments)은 1:N 관계
        db.Comments.belongsTo(db.Users, {foreignKey: 'userId', targetKey: 'userId'});

        // 게시글(post)와 댓글(comments)은 N:M 관계
        db.Comments.belongsTo(db.Posts, {foreignKey: 'postId', targetKey: 'postId'});
    }
};
export default comments;