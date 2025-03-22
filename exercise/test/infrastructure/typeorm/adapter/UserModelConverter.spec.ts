import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { CreatedAt } from "@src/application/domain/model/user/CreatedAt";
import { Email } from "@src/application/domain/model/user/Email";
import { IsActive } from "@src/application/domain/model/user/IsActive";
import { Password } from "@src/application/domain/model/user/Password";
import { UpdatedAt } from "@src/application/domain/model/user/UpdatedAt";
import { User } from "@src/application/domain/model/user/User";
import { UserId } from "@src/application/domain/model/user/UserId";
import { Username } from "@src/application/domain/model/user/Username";
import { AppModule } from "@src/AppModule";
import { UserModel } from "@src/infrastructure/typorm/model/UserModel";
import { Converter } from "@src/shared/adapter/Converter";
import { v4 as uuidv4 } from 'uuid';

/**
 * UserエンティティからUserModelへの変換 単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/infrastructure/typeorm/adapter/UserModelConverter.spec.ts
 * - ロールは空配列として扱う（user.getRoles() → []）
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
describe('UserModelConverterの単体テスト', () => {
    let app: INestApplication;// NestJSアプリケーションインスタンス
    let converter: Converter<User, UserModel>;// テストターゲット
    /**
     * テスト前にNestアプリケーションを初期化し、コンバータを取得
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        converter = app.get<Converter<User, UserModel>>('UserModelConverter');
    });
    /**
     * テスト後にNestアプリケーションをシャットダウン
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe('convert()メソッド', () => {
        it('UserエンティティをUserModelに変換できる', async () => {
            const user = User.restore(
                UserId.fromString('123e4567-e89b-12d3-a456-426614174000'),
                Username.fromString('testuser'),
                Password.fromHashed('hashed-password'),
                Email.fromString('test@example.com'),
                IsActive.active(),
                CreatedAt.now(),
                UpdatedAt.now(),
                [] // ロールは空配列とする
            );
            const model = await converter.convert(user);
            expect(model).toBeInstanceOf(UserModel);
            expect(model.id).toBe(user.getId().getValue());
            expect(model.username).toBe(user.getUsername().getValue());
            expect(model.password).toBe(user.getPassword().getValue());
            expect(model.email).toBe(user.getEmail().getValue());
            expect(model.isActive).toBe(user.isUserActive());
        });
    });

    describe('convertAll()メソッド', () => {
        it('Userエンティティ配列をUserModel配列に変換できる', async () => {
            const users = [
                User.restore(
                    UserId.fromString(uuidv4()),
                    Username.fromString('alice'),
                    Password.fromHashed('hashed-password-1'),
                    Email.fromString('alice@example.com'),
                    IsActive.active(),
                    CreatedAt.now(),
                    UpdatedAt.now(),
                    []),
                User.restore(
                    UserId.fromString(uuidv4()),
                    Username.fromString('bob'),
                    Password.fromHashed('hashed-password-2'),
                    Email.fromString('bob@example.com'),
                    IsActive.inactive(),
                    CreatedAt.now(),
                    UpdatedAt.now(),
                    []),
            ];
            const models = await converter.convertAll(users);
            expect(models).toHaveLength(users.length);
            models.forEach((model, i) => {
                expect(model).toBeInstanceOf(UserModel);
                expect(model.id).toBe(users[i].getId().getValue());
                expect(model.username).toBe(users[i].getUsername().getValue());
                expect(model.password).toBe(users[i].getPassword().getValue());
                expect(model.email).toBe(users[i].getEmail().getValue());
                expect(model.isActive).toBe(users[i].isUserActive());
            });
        });
    });
});