"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const CreatedAt_1 = require("../../../../src/application/domain/model/user/CreatedAt");
const Email_1 = require("../../../../src/application/domain/model/user/Email");
const IsActive_1 = require("../../../../src/application/domain/model/user/IsActive");
const Password_1 = require("../../../../src/application/domain/model/user/Password");
const UpdatedAt_1 = require("../../../../src/application/domain/model/user/UpdatedAt");
const User_1 = require("../../../../src/application/domain/model/user/User");
const UserId_1 = require("../../../../src/application/domain/model/user/UserId");
const Username_1 = require("../../../../src/application/domain/model/user/Username");
const AppModule_1 = require("../../../../src/AppModule");
const UserModel_1 = require("../../../../src/infrastructure/typorm/model/UserModel");
const uuid_1 = require("uuid");
/**
 * UserエンティティからUserModelへの変換 単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/UserModelConverter.spec.ts
 * - ロールは空配列として扱う（user.getRoles() → []）
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
describe('UserModelConverterの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let converter; // テストターゲット
    /**
     * テスト前にNestアプリケーションを初期化し、コンバータを取得
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get('UserModelConverter');
    });
    /**
     * テスト後にNestアプリケーションをシャットダウン
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe('convert()メソッド', () => {
        it('UserエンティティをUserModelに変換できる', async () => {
            const user = User_1.User.restore(UserId_1.UserId.fromString('123e4567-e89b-12d3-a456-426614174000'), Username_1.Username.fromString('testuser'), Password_1.Password.fromHashed('hashed-password'), Email_1.Email.fromString('test@example.com'), IsActive_1.IsActive.active(), CreatedAt_1.CreatedAt.now(), UpdatedAt_1.UpdatedAt.now(), [] // ロールは空配列とする
            );
            const model = await converter.convert(user);
            expect(model).toBeInstanceOf(UserModel_1.UserModel);
            expect(model.id).toBe(user.getId().getValue());
            expect(model.username).toBe(user.getUsername().getValue());
            expect(model.password).toBe(user.getPassword().getValue());
            expect(model.email).toBe(user.getEmail().getValue());
            expect(model.isActive).toBe(user.isUserActive());
        });
    });
    describe('convertAll()メソッド', () => {
        it('Userエンティティ配列をUserModel配列に変換できる', async () => {
            const users = [
                User_1.User.restore(UserId_1.UserId.fromString((0, uuid_1.v4)()), Username_1.Username.fromString('alice'), Password_1.Password.fromHashed('hashed-password-1'), Email_1.Email.fromString('alice@example.com'), IsActive_1.IsActive.active(), CreatedAt_1.CreatedAt.now(), UpdatedAt_1.UpdatedAt.now(), []),
                User_1.User.restore(UserId_1.UserId.fromString((0, uuid_1.v4)()), Username_1.Username.fromString('bob'), Password_1.Password.fromHashed('hashed-password-2'), Email_1.Email.fromString('bob@example.com'), IsActive_1.IsActive.inactive(), CreatedAt_1.CreatedAt.now(), UpdatedAt_1.UpdatedAt.now(), []),
            ];
            const models = await converter.convertAll(users);
            expect(models).toHaveLength(users.length);
            models.forEach((model, i) => {
                expect(model).toBeInstanceOf(UserModel_1.UserModel);
                expect(model.id).toBe(users[i].getId().getValue());
                expect(model.username).toBe(users[i].getUsername().getValue());
                expect(model.password).toBe(users[i].getPassword().getValue());
                expect(model.email).toBe(users[i].getEmail().getValue());
                expect(model.isActive).toBe(users[i].isUserActive());
            });
        });
    });
});
