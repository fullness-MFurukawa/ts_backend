"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const Role_1 = require("../../../../src/application/domain/model/role/Role");
const RoleId_1 = require("../../../../src/application/domain/model/role/RoleId");
const RoleName_1 = require("../../../../src/application/domain/model/role/RoleName");
const AppModule_1 = require("../../../../src/AppModule");
/**
 * RoleエンティティからRoleDTOへの変換 単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/adapter/RoleDTOConverter.spec.ts
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
describe("RoleDTOConverterの単体テスト", () => {
    let app; // NestJSアプリケーションインスタンス
    let converter; // テスト対象
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get('RoleDTOConverter');
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe("convert()", () => {
        it("RoleエンティティをRoleDTOに変換できる", async () => {
            const roleId = RoleId_1.RoleId.fromString("3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1");
            const roleName = RoleName_1.RoleName.fromString("user");
            const role = new Role_1.Role(roleId, roleName);
            const dto = await converter.convert(role);
            expect(dto.id).toBe("3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1");
            expect(dto.name).toBe("user");
        });
    });
    describe("convertAll()", () => {
        it("複数のRoleエンティティをRoleDTOの配列に変換できる", async () => {
            const roles = [
                new Role_1.Role(RoleId_1.RoleId.fromString("3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1"), RoleName_1.RoleName.fromString("user")),
                new Role_1.Role(RoleId_1.RoleId.fromString("3d1e446b-06dc-11f0-9fce-6a0ec65304f1"), RoleName_1.RoleName.fromString("guest")),
            ];
            const dtos = await converter.convertAll(roles);
            expect(dtos).toHaveLength(2);
            expect(dtos[0].id).toBe("3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1");
            expect(dtos[0].name).toBe("user");
            expect(dtos[1].id).toBe("3d1e446b-06dc-11f0-9fce-6a0ec65304f1");
            expect(dtos[1].name).toBe("guest");
        });
    });
});
