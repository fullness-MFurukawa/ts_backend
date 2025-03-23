import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { Role } from "@src/application/domain/model/role/Role";
import { RoleDTO } from "@src/application/in/dto/RoleDTO";
import { AppModule } from "@src/AppModule";
import { Restorer } from "@src/shared/adapter/Restorer";

/**
 * RoleDTOからRoleエンティティへの復元 単体テストドライバ  
 * [テスト実行コマンド]  
 * npx jest test/application/in/adapter/RoleDTORestorer.spec.ts  
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
describe("RoleDTORestorerの単体テスト", () => {
    let app: INestApplication; // NestJSアプリケーションインスタンス
    let restorer: Restorer<RoleDTO, Role>;// テストターゲット
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        restorer = app.get<Restorer<RoleDTO, Role>>('RoleDTORestorer');
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    describe("restore()", () => {
        it("RoleDTOをRoleエンティティに復元できる", async () => {
            const dto: RoleDTO = {
                id: "3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1",
                name: "user"
            };
            const role = await restorer.restore(dto);
            expect(role).toBeInstanceOf(Role);
            expect(role.getId().getValue()).toBe(dto.id);
            expect(role.getName().getValue()).toBe(dto.name);
        });
    });

    describe("restoreAll()", () => {
        it("RoleDTOの配列をRoleエンティティの配列に復元できる", async () => {
            const dtos: RoleDTO[] = [
                { id: "3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1", name: "user" },
                { id: "3d1e446b-06dc-11f0-9fce-6a0ec65304f1", name: "guest" }
            ];
            const roles = await restorer.restoreAll(dtos);
            expect(roles).toHaveLength(2);
            expect(roles[0].getId().getValue()).toBe(dtos[0].id);
            expect(roles[0].getName().getValue()).toBe(dtos[0].name);
            expect(roles[1].getId().getValue()).toBe(dtos[1].id);
            expect(roles[1].getName().getValue()).toBe(dtos[1].name);
        });
    });
});