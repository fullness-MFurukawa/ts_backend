"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const Role_1 = require("../../../../src/application/domain/model/role/Role");
const RoleId_1 = require("../../../../src/application/domain/model/role/RoleId");
const RoleName_1 = require("../../../../src/application/domain/model/role/RoleName");
const CreatedAt_1 = require("../../../../src/application/domain/model/user/CreatedAt");
const Email_1 = require("../../../../src/application/domain/model/user/Email");
const IsActive_1 = require("../../../../src/application/domain/model/user/IsActive");
const Password_1 = require("../../../../src/application/domain/model/user/Password");
const UpdatedAt_1 = require("../../../../src/application/domain/model/user/UpdatedAt");
const User_1 = require("../../../../src/application/domain/model/user/User");
const UserId_1 = require("../../../../src/application/domain/model/user/UserId");
const Username_1 = require("../../../../src/application/domain/model/user/Username");
const AppModule_1 = require("../../../../src/AppModule");
/**
 * UserDTOConverterの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/adapter/UserDTOConverter.spec.ts
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
describe("UserDTOConverterの単体テスト", () => {
    let app; // NestJSアプリケーションインスタンス
    let converter; // テストターゲット
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get('UserDTOConverter');
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
        it("UserエンティティをUserDTOに変換できる", async () => {
            const user = User_1.User.restore(UserId_1.UserId.fromString("3d1e89a4-06dc-11f0-9fce-6a0ec65304f1"), Username_1.Username.fromString("testuser"), Password_1.Password.fromHashed("hashedpassword123"), Email_1.Email.fromString("testuser@example.com"), IsActive_1.IsActive.active(), CreatedAt_1.CreatedAt.fromDate(new Date("2025-03-21T10:00:00Z")), UpdatedAt_1.UpdatedAt.fromDate(new Date("2025-03-22T12:00:00Z")), [
                new Role_1.Role(RoleId_1.RoleId.fromString("3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1"), RoleName_1.RoleName.fromString("user"))
            ]);
            const dto = await converter.convert(user);
            expect(dto.id).toBe("3d1e89a4-06dc-11f0-9fce-6a0ec65304f1");
            expect(dto.username).toBe("testuser");
            expect(dto.email).toBe("testuser@example.com");
            expect(dto.password).toBe("hashedpassword123");
            expect(dto.isActive).toBe(true);
            expect(dto.createdAt?.toISOString()).toBe("2025-03-21T10:00:00.000Z");
            expect(dto.updatedAt?.toISOString()).toBe("2025-03-22T12:00:00.000Z");
            expect(dto.roles).toHaveLength(1);
            expect(dto.roles[0].id).toBe("3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1");
            expect(dto.roles[0].name).toBe("user");
        });
    });
    describe("convertAll()", () => {
        it("複数のUserエンティティをUserDTOの配列に変換できる", async () => {
            const users = [
                User_1.User.restore(UserId_1.UserId.fromString("3d1e89a4-06dc-11f0-9fce-6a0ec65304f1"), Username_1.Username.fromString("user1"), Password_1.Password.fromHashed("pass1"), Email_1.Email.fromString("user1@example.com"), IsActive_1.IsActive.active(), CreatedAt_1.CreatedAt.fromDate(new Date("2025-01-01T00:00:00Z")), UpdatedAt_1.UpdatedAt.fromDate(new Date("2025-01-02T00:00:00Z")), [new Role_1.Role(RoleId_1.RoleId.fromString("3d1e3fd4-16dc-11f0-9fce-6a0ec65304f1"), RoleName_1.RoleName.fromString("admin"))]),
                User_1.User.restore(UserId_1.UserId.fromString("3d1e89a4-06dc-11f0-9fce-6a0ec65304f2"), Username_1.Username.fromString("user2"), Password_1.Password.fromHashed("pass2"), Email_1.Email.fromString("user2@example.com"), IsActive_1.IsActive.inactive(), CreatedAt_1.CreatedAt.fromDate(new Date("2025-02-01T00:00:00Z")), UpdatedAt_1.UpdatedAt.fromDate(new Date("2025-02-02T00:00:00Z")), [new Role_1.Role(RoleId_1.RoleId.fromString("3d1e3fd4-16dc-11f0-9fce-6a0ec65304f2"), RoleName_1.RoleName.fromString("guest"))])
            ];
            const dtos = await converter.convertAll(users);
            expect(dtos).toHaveLength(2);
            expect(dtos[0].username).toBe("user1");
            expect(dtos[1].username).toBe("user2");
        });
    });
});
