import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { Role } from "@src/application/domain/model/role/Role";
import { RoleId } from "@src/application/domain/model/role/RoleId";
import { RoleName } from "@src/application/domain/model/role/RoleName";
import { AppModule } from "@src/AppModule";
import { RoleModel } from "@src/infrastructure/typorm/model/RoleModel";
import { Converter } from "@src/shared/adapter/Converter";

/**
 * RoleエンティティからRoleModelへの変換 単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/RoleModelConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
describe("RoleModelConverterの単体テスト", () => {
    let app: INestApplication;// NestJSアプリケーションインスタンス
    let converter: Converter<Role, RoleModel>;// テストターゲット
    /**
     * テスト前にNestアプリケーションを初期化し、コンバータを取得
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get<Converter<Role, RoleModel>>("RoleModelConverter");
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
            const roleId = RoleId.fromString("ac413f22-0cf1-490a-9635-7e9ca810e544");
            const roleName = RoleName.fromString("Admin");
            const role = new Role(roleId, roleName);
            const model = await converter.convert(role);
            expect(model).toBeInstanceOf(RoleModel);
            expect(model.id).toBe(roleId.getValue());
            expect(model.name).toBe(roleName.getValue());
        });
    });
    
    describe("convertAll() メソッド", () => {
        it("Roleエンティティの配列をRoleModelの配列に変換できる", async () => {
            const roles = [
                new Role(
                RoleId.fromString("ac413f22-0cf1-490a-9635-7e9ca810e544"),
                RoleName.fromString("Admin")),
                new Role(
                RoleId.fromString("8f81a72a-58ef-422b-b472-d982e8665292"),
                RoleName.fromString("User")),
            ];
            const models = await converter.convertAll(roles);
            expect(models).toHaveLength(2);
            models.forEach((model, index) => {
                expect(model).toBeInstanceOf(RoleModel);
                expect(model.id).toBe(roles[index].getId().getValue());
                expect(model.name).toBe(roles[index].getName().getValue());
            });
        });
    });
});