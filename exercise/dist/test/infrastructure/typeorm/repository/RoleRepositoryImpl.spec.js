"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const Role_1 = require("../../../../src/application/domain/model/role/Role");
const RoleId_1 = require("../../../../src/application/domain/model/role/RoleId");
const RoleName_1 = require("../../../../src/application/domain/model/role/RoleName");
const AppModule_1 = require("../../../../src/AppModule");
const typeorm_1 = require("typeorm");
/**
 * RoleRepositoryImplの単体テストドライバ
 * [実行コマンド]
 * npx jest test/infrastructure/typeorm/repository/RoleRepositoryImpl.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
describe("RoleRepositoryImplの単体テスト", () => {
    let app; // NestJSアプリケーションインスタンス
    let repository; // テストターゲット
    let dataSource; // TypeORMのDataSource(データ復元用)
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        repository = app.get('RoleRepository');
        dataSource = app.get(typeorm_1.DataSource);
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe("findByName()メソッド", () => {
        it("存在するロール名で取得できる", async () => {
            const roleName = RoleName_1.RoleName.fromString("admin");
            const role = await repository.findByName(roleName);
            expect(role).not.toBeNull();
            expect(role.getName().getValue()).toBe("admin");
        });
        it("存在しないロール名でfalseを返す", async () => {
            const roleName = RoleName_1.RoleName.fromString("unknownrole");
            const result = await repository.exists(roleName);
            expect(result).toBe(false);
        });
    });
    describe("exists()メソッド", () => {
        it("存在するロール名でtrueを返す", async () => {
            const roleName = RoleName_1.RoleName.fromString("user");
            const result = await repository.exists(roleName);
            expect(result).toBe(true);
        });
        it("存在しないロール名でfalseを返す", async () => {
            const roleName = RoleName_1.RoleName.fromString("unknownrole");
            const result = await repository.exists(roleName);
            expect(result).toBe(false);
        });
    });
    describe("create()メソッド", () => {
        it("新しいロールを永続化できる", async () => {
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const manager = queryRunner.manager;
            const role = new Role_1.Role(RoleId_1.RoleId.createNew(), RoleName_1.RoleName.fromString("editor"));
            try {
                await repository.create(role, manager);
                const saved = await repository.findByName(role.getName(), manager);
                expect(saved).not.toBeNull();
                expect(saved.getName().getValue()).toBe("editor");
            }
            finally {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
            }
        });
    });
    describe("deleteByName()メソッド", () => {
        it("存在するロールを削除できる", async () => {
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const manager = queryRunner.manager;
            const role = new Role_1.Role(RoleId_1.RoleId.fromString('3d1e446b-06dc-11f0-9fce-6a0ec65304f2'), RoleName_1.RoleName.fromString("guestA"));
            try {
                await repository.create(role, manager);
                const deleted = await repository.deleteByName(role.getName(), manager);
                expect(deleted).toBe(true);
            }
            finally {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
            }
        });
        it("存在しないロールの削除はfalseを返す", async () => {
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const manager = queryRunner.manager;
            try {
                const deleted = await repository.deleteByName(RoleName_1.RoleName.fromString("nonexistent"), manager);
                expect(deleted).toBe(false);
            }
            finally {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
            }
        });
    });
    describe("findAllInheritedRoles()メソッド", () => {
        it("Adminロールを指定した場合、Admin, User, Guestが含まれる", async () => {
            const roleName = RoleName_1.RoleName.fromString("Admin");
            const roles = await repository.findAllInheritedRoles(roleName);
            const roleNames = roles.map(r => r.getName().getValue()).sort();
            console.log(roleNames);
            expect(roleNames).toEqual(["Admin", "Guest", "User"]);
        });
        it("Userロールを指定した場合、User, Guestが含まれる", async () => {
            const roleName = RoleName_1.RoleName.fromString("User");
            const roles = await repository.findAllInheritedRoles(roleName);
            const roleNames = roles.map(r => r.getName().getValue()).sort();
            expect(roleNames).toEqual(["Guest", "User"]);
        });
        it("Guestロールを指定した場合、Guestのみ含まれる", async () => {
            const roleName = RoleName_1.RoleName.fromString("Guest");
            const roles = await repository.findAllInheritedRoles(roleName);
            const roleNames = roles.map(r => r.getName().getValue()).sort();
            expect(roleNames).toEqual(["Guest"]);
        });
        it("存在しないロールを指定した場合、空配列が返される", async () => {
            const roleName = RoleName_1.RoleName.fromString("nonexistent");
            const roles = await repository.findAllInheritedRoles(roleName);
            expect(roles).toEqual([]);
        });
    });
});
