"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const User_1 = require("../../../../src/application/domain/model/user/User");
const AppModule_1 = require("../../../../src/AppModule");
const RoleModel_1 = require("../../../../src/infrastructure/typorm/model/RoleModel");
const UserModel_1 = require("../../../../src/infrastructure/typorm/model/UserModel");
const UserRoleModel_1 = require("../../../../src/infrastructure/typorm/model/UserRoleModel");
const uuid_1 = require("uuid");
/**
 * UserModelからUserエンティティの復元 単体テストドライバ
 * [実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/UserModelRestorer.spec.ts
 * @author Fullness
 * @date 2025-03-22
 * @version 1.0.0
 */
describe('UserModelRestorerの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let restorer; // テストターゲット
    /**
     * テスト前にNestアプリケーションを初期化し、コンバータを取得
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        restorer = app.get('UserModelRestorer');
    });
    /**
     * テスト後にNestアプリケーションをシャットダウン
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe('restore() メソッド', () => {
        it('UserModel から User を復元できる', async () => {
            // RoleModel作成
            const roleModel = new RoleModel_1.RoleModel();
            roleModel.id = 'c0112df8-7b63-4f7a-9a77-0d7a50ebf4b5';
            roleModel.name = 'admin';
            // UserModel作成
            const userModel = new UserModel_1.UserModel();
            userModel.id = '93f24c19-7f0e-4375-bf2d-00213106c11d';
            userModel.username = 'johnDoe';
            userModel.password = '$2b$10$hashedpasswordvalue1234567890'; // dummy bcrypt
            userModel.email = 'john@example.com';
            userModel.isActive = true;
            userModel.createdAt = new Date('2024-01-01T00:00:00Z');
            userModel.updatedAt = new Date('2024-02-01T00:00:00Z');
            // UserRoleModel作成（中間テーブル）
            const userRole = new UserRoleModel_1.UserRoleModel();
            userRole.user = userModel;
            userRole.role = roleModel;
            userRole.userId = userModel.id;
            userRole.roleId = roleModel.id;
            userModel.userRoles = [userRole];
            const user = await restorer.restore(userModel);
            expect(user).toBeInstanceOf(User_1.User);
            expect(user.getId().getValue()).toBe(userModel.id);
            expect(user.getUsername().getValue()).toBe(userModel.username);
            expect(user.getPassword().getValue()).toBe(userModel.password);
            expect(user.getEmail().getValue()).toBe(userModel.email);
            expect(user.getCreatedAt().getValue()).toEqual(userModel.createdAt);
            expect(user.getUpdatedAt().getValue()).toEqual(userModel.updatedAt);
            expect(user.isUserActive()).toBe(true);
            expect(user.getRoles()).toHaveLength(1);
            expect(user.getRoles()[0].getId().getValue()).toBe(roleModel.id);
            expect(user.getRoles()[0].getName().getValue()).toBe(roleModel.name);
        });
    });
    describe('restoreAll() メソッド', () => {
        it('複数の UserModel を User に復元できる', async () => {
            const roleModel = new RoleModel_1.RoleModel();
            roleModel.id = 'd4227fbd-ec67-4c93-9d8d-eef8657e12a6';
            roleModel.name = 'user';
            const userModels = ['001', '002'].map(suffix => {
                const userModel = new UserModel_1.UserModel();
                userModel.id = (0, uuid_1.v4)(),
                    userModel.username = `user${suffix}`;
                userModel.password = '$2b$10$hashedpasswordvalue1234567890';
                userModel.email = `user${suffix}@example.com`;
                userModel.isActive = true;
                userModel.createdAt = new Date('2024-01-01T00:00:00Z');
                userModel.updatedAt = new Date('2024-02-01T00:00:00Z');
                const userRole = new UserRoleModel_1.UserRoleModel();
                userRole.user = userModel;
                userRole.role = roleModel;
                userRole.userId = userModel.id;
                userRole.roleId = roleModel.id;
                userModel.userRoles = [userRole];
                return userModel;
            });
            const users = await restorer.restoreAll(userModels);
            expect(users).toHaveLength(userModels.length);
            users.forEach((user, i) => {
                const model = userModels[i];
                expect(user.getId().getValue()).toBe(model.id);
                expect(user.getUsername().getValue()).toBe(model.username);
                expect(user.getEmail().getValue()).toBe(model.email);
                expect(user.getRoles()[0].getName().getValue()).toBe('user');
            });
        });
    });
});
