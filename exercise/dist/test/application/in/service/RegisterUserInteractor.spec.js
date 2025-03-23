"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const typeorm_1 = require("@nestjs/typeorm");
const RegisterUserInteractor_1 = require("../../../../src/application/in/service/RegisterUserInteractor");
const AppModule_1 = require("../../../../src/AppModule");
const UserModel_1 = require("../../../../src/infrastructure/typorm/model/UserModel");
const ExistsException_1 = require("../../../../src/shared/exceptions/ExistsException");
const InternalException_1 = require("../../../../src/shared/exceptions/InternalException");
const NotFoundException_1 = require("../../../../src/shared/exceptions/NotFoundException");
const typeorm_2 = require("typeorm");
/**
 * RegisterUserInteractorのテストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/service/RegisterUserInteractor.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-23
 * @version 1.0.0
 */
describe('RegisterUserInteractorの単体テスト', () => {
    let app; // NestJSのアプリケーションインスタンス
    let dataSource; // TypeORMのデータソース
    let usecase; // テストターゲット
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        usecase = app.get('RegisterUserUsecase');
        dataSource = app.get(typeorm_2.DataSource);
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        await dataSource.destroy();
        await app.close();
    });
    describe("正常系のテスト", () => {
        it("ユーザーが正常に登録される", async () => {
            const dto = {
                id: null,
                username: "testuser1",
                email: "test1@example.com",
                password: "user1password",
                isActive: true,
                roles: [
                    { id: "3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1", name: "user" }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            // 登録して例外はスローされていないことを検証する
            await expect(usecase.register(dto)).resolves.not.toThrow();
            const userRepo = dataSource.getRepository(UserModel_1.UserModel);
            const saved = await userRepo.findOne({
                where: { username: "testuser1" },
                relations: ["userRoles", "userRoles.role"],
            });
            expect(saved).not.toBeNull();
            expect(saved?.email).toBe("test1@example.com");
            expect(saved?.userRoles?.[0].role.name).toBe("user");
            if (saved) {
                await userRepo.delete(saved.id);
            }
        });
        it("ロールが指定されていなくてもユーザーを登録できる（roles: null）", async () => {
            const dto = {
                id: null,
                username: "noroleuser1",
                email: "norole1@example.com",
                password: "password123",
                isActive: true,
                roles: null, // ロールなし
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await expect(usecase.register(dto)).resolves.not.toThrow();
            const saved = await dataSource.getRepository(UserModel_1.UserModel).findOne({
                where: { username: dto.username },
                relations: ["userRoles"],
            });
            expect(saved).not.toBeNull();
            expect(saved?.email).toBe(dto.email);
            expect(saved?.userRoles.length).toBe(0); // ロールは0件
            // 後始末（削除）
            if (saved) {
                await dataSource.getRepository(UserModel_1.UserModel).delete(saved.id);
            }
        });
        it("ロールが空配列でもユーザーを登録できる（roles: []）", async () => {
            const dto = {
                id: null,
                username: "noroleuser2",
                email: "norole2@example.com",
                password: "password456",
                isActive: true,
                roles: [], // 空配列
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await expect(usecase.register(dto)).resolves.not.toThrow();
            const saved = await dataSource.getRepository(UserModel_1.UserModel).findOne({
                where: { username: dto.username },
                relations: ["userRoles"],
            });
            expect(saved).not.toBeNull();
            expect(saved?.email).toBe(dto.email);
            expect(saved?.userRoles.length).toBe(0); // ロールは0件
            // 後始末（削除）
            if (saved) {
                await dataSource.getRepository(UserModel_1.UserModel).delete(saved.id);
            }
        });
    });
    describe("異常系のテスト", () => {
        it("既存のユーザー名だった場合、ExistsExceptionがスローされる", async () => {
            const dto1 = {
                id: null,
                username: "duplicateUser",
                email: "first@example.com",
                password: "password123",
                isActive: true,
                roles: [
                    { id: "3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1", name: "user" }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const dto2 = {
                id: null,
                username: "duplicateUser", // 同じユーザー名
                email: "second@example.com", // メールアドレスは異なる
                password: "password456",
                isActive: true,
                roles: [
                    { id: "3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1", name: "user" }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            // 1人目のユーザー登録（成功）
            await expect(usecase.register(dto1)).resolves.not.toThrow();
            // 2人目の登録でExistsExceptionがスローされることを検証
            await expect(usecase.register(dto2)).rejects.toThrow(ExistsException_1.ExistsException);
            // テストデータのクリーンアップ
            const repo = dataSource.getRepository(UserModel_1.UserModel);
            const saved = await repo.findOne({ where: { username: "duplicateUser" } });
            if (saved) {
                await repo.delete(saved.id);
            }
        });
        it("既に存在するメールアドレスだった場合はExistsExceptionがスローされる", async () => {
            // 事前に登録されているユーザーと同じメールアドレスを使う
            const existingDto = {
                id: null,
                username: "username123",
                email: "duplicate@example.com",
                password: "password1",
                isActive: true,
                roles: [
                    { id: "3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1", name: "user" }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            // 先にユーザーを登録
            await usecase.register(existingDto);
            // 重複するメールアドレスで別ユーザーを登録しようとする
            const duplicateEmailDto = {
                id: null,
                username: "anotheruser123",
                email: "duplicate@example.com", // 重複
                password: "password2",
                isActive: true,
                roles: [
                    { id: "3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1", name: "user" }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await expect(usecase.register(duplicateEmailDto))
                .rejects
                .toThrow("メールアドレス「duplicate@example.com」は既に使用されています。");
            // 後片付け：登録したユーザーを削除（必要に応じて）
            const repo = dataSource.getRepository(UserModel_1.UserModel);
            const saved = await repo.findOne({ where: { username: "username123" } });
            if (saved) {
                await repo.delete(saved.id);
            }
        });
        it("存在しないロール名を指定した場合はNotFoundExceptionがスローされる", async () => {
            const dto = {
                id: null,
                username: "invaliduser",
                email: "invalidrole@example.com",
                password: "testpassword",
                isActive: true,
                roles: [
                    {
                        // あなたの既存ロールIDとは一致しないUUID（ランダムだが形式は正しい）
                        id: "3d1e3fd4-06dc-11f0-9fce-6a0ec6530aaa",
                        name: "ngrole" // 存在しないロール名
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await expect(usecase.register(dto)).rejects.toThrow(NotFoundException_1.NotFoundException);
            await expect(usecase.register(dto)).rejects.toThrow("ロール「ngrole」は存在しません。");
        });
    });
    describe("モックを利用した異常系のテスト", () => {
        let usecase;
        /**
         * beforeEach: RegisterUserInteractorの依存をすべてモック化してテスト対象を構築
         * - EntityManager: .transaction() の呼び出しだけ行えるようにモック
         * - UserRepository: existsByUsername / existsByEmail / create をモック
         * - RoleRepository: exists を常にtrueとしてモック
         * - Restorer: UserDTO → User への復元処理でわざとエラーをスローさせる
         */
        beforeEach(async () => {
            // モックEntityManager（.transaction() のみ対応）
            const mockManager = {
                transaction: jest.fn().mockImplementation(async (cb) => {
                    const dummyManager = {};
                    return cb(dummyManager);
                }),
            };
            // UserRepositoryのモック（全て正常系として動作する）
            const mockUserRepository = {
                existsByUsername: jest.fn().mockResolvedValue(false),
                existsByEmail: jest.fn().mockResolvedValue(false),
                create: jest.fn(),
            };
            // RoleRepositoryのモック（すべてのロールが存在すると見なす）
            const mockRoleRepository = {
                exists: jest.fn().mockResolvedValue(true),
            };
            // Restorerのモック（復元処理で例外を発生させる）
            const mockRestorer = {
                restore: jest.fn().mockRejectedValue(new Error('予期せぬエラー')),
            };
            // テストモジュールを作成してRegisterUserInteractorにモックを注入
            const moduleRef = await test_1.Test.createTestingModule({
                providers: [
                    RegisterUserInteractor_1.RegisterUserInteractor,
                    { provide: 'UserDTORestorer', useValue: mockRestorer },
                    { provide: 'UserRepository', useValue: mockUserRepository },
                    { provide: 'RoleRepository', useValue: mockRoleRepository },
                    { provide: (0, typeorm_1.getEntityManagerToken)(), useValue: mockManager },
                ],
            }).compile();
            // モジュールからインスタンス取得
            usecase = moduleRef.get(RegisterUserInteractor_1.RegisterUserInteractor);
        });
        /**
         * テストケース：
         * UserDTORestorer.restore() が例外をスローしたときに
         * RegisterUserInteractorがInternalExceptionをスローするか検証する
         */
        it('予期せぬ例外が発生した場合(InternalException)のテスト', async () => {
            const dto = {
                id: null,
                username: 'erroruser',
                email: 'error@example.com',
                password: 'pass',
                isActive: true,
                roles: [{ id: 'role-id', name: 'user' }],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            // RegisterUserInteractor.register() は予期せぬ例外をInternalExceptionでラップして返すはず
            await expect(usecase.register(dto)).rejects.toThrow(InternalException_1.InternalException);
        });
    });
});
