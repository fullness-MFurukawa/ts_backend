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
import { UserRepository } from "@src/application/out/repository/UserRepository";
import { AppModule } from "@src/AppModule";
import { DataSource, EntityManager } from "typeorm";

/**
 * UserRepositoryImplの単体テストドライバ
 * [実行コマンド]
 * npx jest test/infrastructure/typeorm/repository/UserRepositoryImpl.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
describe('UserRepositoryImplの単体テスト', () => {
    let app: INestApplication;// NestJSアプリケーションインスタンス
    let repository: UserRepository<EntityManager>;// テストターゲット
    let dataSource: DataSource;// TypeORMのDataSource(データ復元用)
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        repository = app.get<UserRepository<EntityManager>>('UserRepository');
        dataSource = app.get(DataSource);
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    describe('findById() メソッド', () => {
        it('存在するユーザーIDでユーザーを取得できる', async () => {
            const userId = UserId.fromString('3d1e89a4-06dc-11f0-9fce-6a0ec65304f1');
            const user = await repository.findById(userId);
            expect(user).not.toBeNull();
            expect(user!.getUsername().getValue()).toBe('testuser');
            expect(user!.getEmail().getValue()).toBe('testuser@example.com');
        });
        it('存在しないユーザーIDでnullが返される', async () => {
            const userId = UserId.fromString('3d1e89a4-06dc-11f0-9fce-6a0ec65304f2');
            const user = await repository.findById(userId);
            expect(user).toBeNull();
        });
    });
    
    describe('findByUsername() メソッド', () => {
        it('存在するユーザー名でユーザーを取得できる', async () => {
            const username = Username.fromString('testuser');
            const user = await repository.findByUsername(username);
            expect(user).not.toBeNull();
            expect(user!.getEmail().getValue()).toBe('testuser@example.com');
        });
        it('存在しないユーザー名でnullが返される', async () => {
            const username = Username.fromString('nonexistentuser');
            const user = await repository.findByUsername(username);
            expect(user).toBeNull();
        });
    });

    describe('findByEmail()', () => {
        it('存在するメールアドレスでユーザーを取得できる', async () => {
            const email = Email.fromString('testuser@example.com');
            const user = await repository.findByEmail(email);
            expect(user).not.toBeNull();
            expect(user!.getUsername().getValue()).toBe('testuser');
        });
        it('存在しないメールアドレスでnullが返される', async () => {
            const email = Email.fromString('nobody@example.com');
            const user = await repository.findByEmail(email);
            expect(user).toBeNull();
        });
    });

    describe('existsByUsername()', () => {
        it('存在するユーザー名に対してtrueを返す', async () => {
            const username = Username.fromString('testuser');
            const exists = await repository.existsByUsername(username);
            expect(exists).toBe(true);
        });
        it('存在しないユーザー名に対してfalseを返す', async () => {
            const username = Username.fromString('nouser123');
            const exists = await repository.existsByUsername(username);
            expect(exists).toBe(false);
        });
    });

    describe('existsByEmail() メソッド', () => {
        it('存在するメールアドレスに対してtrueを返す', async () => {
            const email = Email.fromString('testuser@example.com');
            const exists = await repository.existsByEmail(email);
            expect(exists).toBe(true);
        });
        it('存在しないメールアドレスに対してfalseを返す', async () => {
            const email = Email.fromString('notfound@example.com');
            const exists = await repository.existsByEmail(email);
            expect(exists).toBe(false);
        });
    });

    describe('create()', () => {
        it('新規ユーザーを登録し取得できる', async () => {
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const entityManager = queryRunner.manager;

            const username = Username.fromString('createduser');
            const email = Email.fromString('createduser@example.com');
            const password = Password.fromHashed('hashedpassword123');
            const roles = [
                new Role(
                    RoleId.fromString('3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1'),
                    RoleName.fromString('user'))
            ];
            const user = User.createNew(username, password, email, roles);

            try {
                await repository.create(user, entityManager);
                const saved = await repository.findById(user.getId(), entityManager);
                expect(saved).not.toBeNull();
                expect(saved!.getUsername().getValue()).toBe('createduser');
                expect(saved!.getEmail().getValue()).toBe('createduser@example.com');
            } finally {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
            }
        });
    });

    describe('updateById()', () => {
        it('既存のユーザーのメールアドレスとパスワードを更新できる', async () => {
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const entityManager = queryRunner.manager;
            try {
                // 既存ユーザーを取得
                const original = await repository.findByUsername(
                    Username.fromString('testuser'),
                    entityManager
                );
                expect(original).not.toBeNull();
                // メールアドレスとパスワードを変更
                const newEmail = Email.fromString('updated@example.com');
                const newPassword = Password.fromHashed('updatedhashedpassword');
                original!.changeEmail(newEmail);
                original!.changePassword(newPassword);
                // 更新処理
                const result = await repository.updateById(original!, entityManager);
                expect(result).toBe(true);
                // 更新後のユーザーを取得して検証
                const updated = await repository.findById(original!.getId(), entityManager);
                expect(updated!.getEmail().getValue()).toBe('updated@example.com');
                expect(updated!.getPassword().getValue()).toBe('updatedhashedpassword');
            } finally {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
            }
        });
        it('存在しないユーザーIDでは更新できず、falseを返す', async () => {
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const entityManager = queryRunner.manager;
            try {
                // 存在しないユーザーIdでダミー作成
                const user = User.restore(
                    UserId.fromString('3d1f9999-06dc-11f0-9fce-6a0ec65304f2'),
                    Username.fromString('nonexistent'),
                    Password.fromHashed('dummy'),
                    Email.fromString('nonexistent@example.com'),
                    IsActive.active(),
                    CreatedAt.now(),
                    UpdatedAt.now(),
                    []
                );
                const result = await repository.updateById(user, entityManager);
                expect(result).toBe(false);
            } finally {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
            }
        });
    });
    describe('deleteById()', () => {
        it('既存のユーザーを削除できる', async () => {
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const entityManager = queryRunner.manager;
            try {
                // 既存ユーザーを取得
                const existing = await repository.findByUsername(
                    Username.fromString('testuser'),
                    entityManager
                );
                expect(existing).not.toBeNull();
                // 削除処理
                const result = 
                await repository.deleteById(existing!.getId(), entityManager);
                expect(result).toBe(true);
                // 削除確認
                const deleted = 
                await repository.findById(existing!.getId(), entityManager);
                expect(deleted).toBeNull();
            } finally {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
            }
        });
        it('存在しないユーザーIDは削除できずfalseを返す', async () => {
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const entityManager = queryRunner.manager;
            try {
                const result = await repository.deleteById(
                    UserId.fromString('3d1f9999-06dc-11f0-9fce-6a0ec65304f2'),
                    entityManager
                );
                expect(result).toBe(false);
            } finally {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
            }
        });
    });
});