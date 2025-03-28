"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const test_1 = require("@nestjs/testing/test");
const AppModule_1 = require("../../../../src/AppModule");
const UserModel_1 = require("../../../../src/infrastructure/typorm/model/UserModel");
const typeorm_1 = require("typeorm");
const AuthenticateDTO_1 = require("../../../../src/application/in/dto/AuthenticateDTO");
const bcrypt = __importStar(require("bcrypt"));
/**
 * CategoryInteractorのテストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/service/AuthenticateUserInteractor.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-24
 * @version 1.0.0
 */
describe('AuthenticateUserInteractorの認証テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let usecase; // テストターゲット
    let dataSource; // TypeORMデータソース
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [
                AppModule_1.AppModule,
            ],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        usecase = app.get('AuthenticateUserUsecase');
        dataSource = app.get(typeorm_1.DataSource);
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
            const userRepository = dataSource.getRepository(UserModel_1.UserModel);
            const username = 'logintestuser';
            const password = 'loginpassword';
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
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
            const authDTO = new AuthenticateDTO_1.AuthenticateDTO(username, password);
            const token = await usecase.authenticate(authDTO);
            // 結果の検証
            expect(typeof token).toBe('string');
            //expect(token.length).toBeGreaterThan(0);
            // 登録したユーザーを削除
            await userRepository.delete({ username });
        });
    });
    describe('異常系テスト', () => {
        it('存在しないユーザー名の場合、UnauthorizedExceptionがスローされる', async () => {
            const authDTO = new AuthenticateDTO_1.AuthenticateDTO('nonexistentuser', 'any-password');
            await expect(usecase.authenticate(authDTO))
                .rejects.toThrow(common_1.UnauthorizedException);
        });
        it('パスワードが間違っている場合、UnauthorizedExceptionがスローされる', async () => {
            const userRepository = dataSource.getRepository(UserModel_1.UserModel);
            const username = 'wrongpassworduser';
            const correctPassword = 'correct123';
            const hashedPassword = await bcrypt.hash(correctPassword, 10);
            const newUser = {
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
            const authDTO = new AuthenticateDTO_1.AuthenticateDTO(username, 'incorrect123');
            await expect(usecase.authenticate(authDTO)).rejects.toThrow(common_1.UnauthorizedException);
            await userRepository.delete({ username });
        });
    });
});
