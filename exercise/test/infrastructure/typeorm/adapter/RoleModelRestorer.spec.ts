import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { Role } from "@src/application/domain/model/role/Role";
import { AppModule } from "@src/AppModule";
import { RoleModel } from "@src/infrastructure/typorm/model/RoleModel";
import { Restorer } from "@src/shared/adapter/Restorer";

/**
 * RoleModelからRoleエンティティへの復元 単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/RoleModelRestorer.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
describe("RoleModelRestorerの単体テスト", () => {
    let app: INestApplication;// NestJSアプリケーションインスタンス
    let restorer: Restorer<RoleModel, Role>;// テストターゲット
    /**
     * テスト前にNestアプリケーションを初期化し、コンバータを取得
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        restorer = app.get<Restorer<RoleModel, Role>>("RoleModelRestorer");
    });
    /**
     * テスト後にNestアプリケーションをシャットダウン
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe("restore() メソッド", () => {
        it("RoleModelからRoleエンティティを復元できる", async () => {
            const model = new RoleModel();
            model.id = "08e7b8b2-cc99-4d9b-88f0-b01986f244b1";
            model.name = "admin";
            const role = await restorer.restore(model);
            expect(role).toBeInstanceOf(Role);
            expect(role.getId().getValue()).toBe(model.id);
            expect(role.getName().getValue()).toBe(model.name);
        });
    });

    describe("restoreAll() メソッド", () => {
        it("複数のRoleModelからRoleエンティティを復元できる", async () => {
            const models: RoleModel[] = [
                { id: "08e7b8b2-cc99-4d9b-88f0-b01986f244b1", 
                    name: "admin", userRoles: [] } as RoleModel,
                { id: "1be4f432-d35f-48d1-8122-56de9ec1f154", 
                    name: "user", userRoles: [] } as RoleModel,
            ];
            const roles = await restorer.restoreAll(models);
            expect(roles).toHaveLength(models.length);
            roles.forEach((role, index) => {
                expect(role).toBeInstanceOf(Role);
                expect(role.getId().getValue()).toBe(models[index].id);
                expect(role.getName().getValue()).toBe(models[index].name);
            });
        });
    });
});