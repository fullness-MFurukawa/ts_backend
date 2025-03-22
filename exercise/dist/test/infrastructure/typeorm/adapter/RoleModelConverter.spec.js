"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const Role_1 = require("../../../../src/application/domain/model/role/Role");
const RoleId_1 = require("../../../../src/application/domain/model/role/RoleId");
const RoleName_1 = require("../../../../src/application/domain/model/role/RoleName");
const AppModule_1 = require("../../../../src/AppModule");
const RoleModel_1 = require("../../../../src/infrastructure/typorm/model/RoleModel");
/**
 * RoleエンティティからRoleModelへの変換 単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/RoleModelConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
describe("RoleModelConverterの単体テスト", () => {
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
        converter = app.get("RoleModelConverter");
    });
    /**
     * テスト後にNestアプリケーションをシャットダウン
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe("convert() メソッド", () => {
        it("RoleエンティティをRoleModelに変換できる", async () => {
            const roleId = RoleId_1.RoleId.fromString("ac413f22-0cf1-490a-9635-7e9ca810e544");
            const roleName = RoleName_1.RoleName.fromString("Admin");
            const role = new Role_1.Role(roleId, roleName);
            const model = await converter.convert(role);
            expect(model).toBeInstanceOf(RoleModel_1.RoleModel);
            expect(model.id).toBe(roleId.getValue());
            expect(model.name).toBe(roleName.getValue());
        });
    });
    describe("convertAll() メソッド", () => {
        it("Roleエンティティの配列をRoleModelの配列に変換できる", async () => {
            const roles = [
                new Role_1.Role(RoleId_1.RoleId.fromString("ac413f22-0cf1-490a-9635-7e9ca810e544"), RoleName_1.RoleName.fromString("Admin")),
                new Role_1.Role(RoleId_1.RoleId.fromString("8f81a72a-58ef-422b-b472-d982e8665292"), RoleName_1.RoleName.fromString("User")),
            ];
            const models = await converter.convertAll(roles);
            expect(models).toHaveLength(2);
            models.forEach((model, index) => {
                expect(model).toBeInstanceOf(RoleModel_1.RoleModel);
                expect(model.id).toBe(roles[index].getId().getValue());
                expect(model.name).toBe(roles[index].getName().getValue());
            });
        });
    });
});
