import Sequelize from "sequelize";

const attachs = class Attachs extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            attachId: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                comment: "첨부파일 번호",
            },
            img: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: "첨부파일 경로",
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'attachs',
            tableName: 'ATTACHS',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
};
export default attachs;