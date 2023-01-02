import Sequelize from "sequelize";

const tokens = class Tokens extends Sequelize.Model {
    static init(sequelize) {
        // 테이블에 대한 설정

        return super.init({
        // 컬럼에 대한 설정
        // 카카오 로그인 때문에 email, nick, pw에 대한 설정이 조금 다르다.
            refreshToken: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
        }, {
            // 테이블에 대한 설정
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'tokens',
            tableName: 'TOKENS',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    // 관계에 대한 설정
    static associate(db) {
        db.Tokens.belongsTo(db.Users, {
                foreignKey: 'userId',
                sourceKey: 'userId'
            });
    }
};

export default tokens;