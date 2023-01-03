import Sequelize from "sequelize";

const users = class Users extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            userId: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                comment: "사용자 번호",
            },
            type: {
                type: Sequelize.ENUM("LOCAL", "SOCIAL"),
                allowNull: false,
                defaultValue: "LOCAL",
                comment: "사용자 분류",
            },
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
                comment: "사용자 이메일(아이디)",
            },
            password: {
                // 비밀번호는 암호화해서 저장해야 하기에 길게 만들어야 한다. 보통 64의 배수로 설정
                // 비밀번호가 NULL이 되는 이유 - 카카오 로그인
                type: Sequelize.STRING(128),
                allowNull: true,
                comment: "사용자 비밀번호",
            },
            nickname: {
                // 카카오 로그인시 닉네임을 사용하기에 NOT NULL 설정
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
                comment: "사용자 닉네임"
            },
            role: {
                type: Sequelize.ENUM("BASIC", "ADMIN"),
                allowNull: false,
                defaultValue: "BASIC",
                comment: "사용자 권한",
            },
            profileImg: {
                type: Sequelize.BLOB,
                allowNull: true,
                comment: "사용자 프로필 이미지",
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'users',
            tableName: 'USERS',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }

    static associate(db) {
        // 사용자(users)와 게시글(posts)은 1:N 관계
        db.Users.hasMany(db.Posts, {foreignKey: 'userId', sourceKey: 'userId'});
        
        // 사용자(users)와 댓글(comments)은 1:N 관계
        db.Users.hasMany(db.Comments, {foreignKey: 'userId', sourceKey: 'userId'});

        // 사용자(users)와 리프레시토큰은 1:1 관계
        db.Users.hasOne(db.Tokens, {foreignKey: 'email', sourceKey: 'email'});
    }
};
export default users;