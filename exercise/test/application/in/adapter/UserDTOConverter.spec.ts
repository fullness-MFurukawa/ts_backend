import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { Role } from "@src/application/domain/model/role/Role";
import { RoleId } from "@src/application/domain/model/role/RoleId";
import { RoleName } from "@src/application/domain/model/role/RoleName";
import { CreatedAt } from "@src/application/domain/model/user/CreatedAt";
import { Email } from "@src/application/domain/model/user/Email";
import { IsActive } from "@src/application/domain/model/user/IsActive";
import { Password } from "@src/application/domain/model/user/Password";
import { UpdatedAt } from "@src/application/domain/model/user/UpdatedAt";
import { User } from "@src/application/domain/model/user/User";
import { UserId } from "@src/application/domain/model/user/UserId";
import { Username } from "@src/application/domain/model/user/Username";
import { UserDTO } from "@src/application/in/dto/UserDTO";
import { AppModule } from "@src/AppModule";
import { Converter } from "@src/shared/adapter/Converter";

/**
 * UserDTOConverterの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/adapter/UserDTOConverter.spec.ts
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
describe("UserDTOConverterの単体テスト", () => {
    let app: INestApplication;// NestJSアプリケーションインスタンス
    let converter: Converter<User, UserDTO>;// テストターゲット
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get<Converter<User, UserDTO>>('UserDTOConverter');
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
            const user = User.restore(
                UserId.fromString("3d1e89a4-06dc-11f0-9fce-6a0ec65304f1"),
                Username.fromString("testuser"),
                Password.fromHashed("hashedpassword123"),
                Email.fromString("testuser@example.com"),
                IsActive.active(),
                CreatedAt.fromDate(new Date("2025-03-21T10:00:00Z")),
                UpdatedAt.fromDate(new Date("2025-03-22T12:00:00Z")),
                [
                    new Role(
                        RoleId.fromString("3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1"),
                        RoleName.fromString("user")
                    )
                ]
            );
            const dto = await converter.convert(user);
            expect(dto.id).toBe("3d1e89a4-06dc-11f0-9fce-6a0ec65304f1");
            expect(dto.username).toBe("testuser");
            expect(dto.email).toBe("testuser@example.com");
            expect(dto.password).toBe("hashedpassword123");
            expect(dto.isActive).toBe(true);
            expect(dto.createdAt?.toISOString()).toBe("2025-03-21T10:00:00.000Z");
            expect(dto.updatedAt?.toISOString()).toBe("2025-03-22T12:00:00.000Z");
            expect(dto.roles).toHaveLength(1);
            expect(dto.roles![0].id).toBe("3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1");
            expect(dto.roles![0].name).toBe("user");
        });
    });

    describe("convertAll()", () => {
        it("複数のUserエンティティをUserDTOの配列に変換できる", async () => {
            const users: User[] = [
                User.restore(
                    UserId.fromString("3d1e89a4-06dc-11f0-9fce-6a0ec65304f1"),
                    Username.fromString("user1"),
                    Password.fromHashed("pass1"),
                    Email.fromString("user1@example.com"),
                    IsActive.active(),
                    CreatedAt.fromDate(new Date("2025-01-01T00:00:00Z")),
                    UpdatedAt.fromDate(new Date("2025-01-02T00:00:00Z")),
                    [new Role(
                        RoleId.fromString("3d1e3fd4-16dc-11f0-9fce-6a0ec65304f1"), 
                        RoleName.fromString("admin"))]
                ),
                User.restore(
                    UserId.fromString("3d1e89a4-06dc-11f0-9fce-6a0ec65304f2"),
                    Username.fromString("user2"),
                    Password.fromHashed("pass2"),
                    Email.fromString("user2@example.com"),
                    IsActive.inactive(),
                    CreatedAt.fromDate(new Date("2025-02-01T00:00:00Z")),
                    UpdatedAt.fromDate(new Date("2025-02-02T00:00:00Z")),
                    [new Role(
                        RoleId.fromString("3d1e3fd4-16dc-11f0-9fce-6a0ec65304f2"), 
                        RoleName.fromString("guest"))]
                )
            ];
            const dtos = await converter.convertAll(users);
            expect(dtos).toHaveLength(2);
            expect(dtos[0].username).toBe("user1");
            expect(dtos[1].username).toBe("user2");
        });
    });
});