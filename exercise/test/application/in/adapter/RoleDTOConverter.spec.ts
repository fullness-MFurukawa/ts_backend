import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { Role } from "@src/application/domain/model/role/Role";
import { RoleId } from "@src/application/domain/model/role/RoleId";
import { RoleName } from "@src/application/domain/model/role/RoleName";
import { RoleDTO } from "@src/application/in/dto/RoleDTO";
import { AppModule } from "@src/AppModule";
import { Converter } from "@src/shared/adapter/Converter";

/**
 * RoleエンティティからRoleDTOへの変換 単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/adapter/RoleDTOConverter.spec.ts
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
describe("RoleDTOConverterの単体テスト", () => {
    let app: INestApplication; // NestJSアプリケーションインスタンス
    let converter: Converter<Role, RoleDTO>; // テスト対象
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get<Converter<Role, RoleDTO>>('RoleDTOConverter');
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
            const roleId = RoleId.fromString("3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1");
            const roleName = RoleName.fromString("user");
            const role = new Role(roleId, roleName);
            const dto = await converter.convert(role);
            expect(dto.id).toBe("3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1");
            expect(dto.name).toBe("user");
        });
    });

    describe("convertAll()", () => {
        it("複数のRoleエンティティをRoleDTOの配列に変換できる", async () => {
            const roles = [
                new Role(
                    RoleId.fromString("3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1"),
                    RoleName.fromString("user")),
                new Role(
                    RoleId.fromString("3d1e446b-06dc-11f0-9fce-6a0ec65304f1"),
                    RoleName.fromString("guest")),
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