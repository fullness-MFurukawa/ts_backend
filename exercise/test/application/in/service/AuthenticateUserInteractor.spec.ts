import { INestApplication, UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { AuthenticateUserUsecase } from "@src/application/in/usecase/AuthenticateUserUsecase";
import { AppModule } from "@src/AppModule";
import { UserModel } from "@src/infrastructure/typorm/model/UserModel";
import { DataSource } from "typeorm";
import { AuthenticateDTO } from "@src/application/in/dto/AuthenticateDTO";
import * as bcrypt from 'bcrypt';

/**
 * CategoryInteractorのテストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/service/AuthenticateUserInteractor.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-24
 * @version 1.0.0
 */
describe('AuthenticateUserInteractorの認証テスト', () => {
    let app: INestApplication;// NestJSアプリケーションインスタンス
    let usecase: AuthenticateUserUsecase;// テストターゲット
    let dataSource: DataSource; // TypeORMデータソース
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
              AppModule,
            ],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        usecase = app.get<AuthenticateUserUsecase>('AuthenticateUserUsecase');
        dataSource = app.get(DataSource);
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        await dataSource.destroy();
        await app.close();
    });

    describe('正常系テスト', () => {
        it('正しいユーザー名とパスワードでJWTが返される', async () => {
            // テスト用ユーザーを登録
            const userRepository = dataSource.getRepository(UserModel);
            const username = 'logintestuser';
            const password = 'loginpassword';
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser: UserModel = {
                id: '3d1e89a4-06dc-11f0-9fce-6a0ec65304f2',
                username,
                password: hashedPassword,
                email: 'login@test.com',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                userRoles: [],
                refreshTokens: []
            };
            await userRepository.save(newUser);
            // 認証を実行
            const authDTO = new AuthenticateDTO(username, password);
            const token = await usecase.authenticate(authDTO);
            // 結果の検証
            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(0);
            // 登録したユーザーを削除
            await userRepository.delete({ username });
        });
    });
    describe('異常系テスト', () => {
        it('存在しないユーザー名の場合、UnauthorizedExceptionがスローされる', async () => {
            const authDTO = new AuthenticateDTO('nonexistentuser', 'any-password');
            await expect(usecase.authenticate(authDTO))
                .rejects.toThrow(UnauthorizedException);
        });
        it('パスワードが間違っている場合、UnauthorizedExceptionがスローされる', async () => {
            const userRepository = dataSource.getRepository(UserModel);
            const username = 'wrongpassworduser';
            const correctPassword = 'correct123';
            const hashedPassword = await bcrypt.hash(correctPassword, 10);
            const newUser: UserModel = {
                id: '3d1e89a4-06dc-11f0-9fce-6a0ec6530999',
                username,
                password: hashedPassword,
                email: 'wrongpass@test.com',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                userRoles: [],
                refreshTokens: []
            };
            await userRepository.save(newUser);
            const authDTO = new AuthenticateDTO(username, 'incorrect123');
            await expect(usecase.authenticate(authDTO)).rejects.toThrow(UnauthorizedException);
            await userRepository.delete({ username });
        });
    });
})