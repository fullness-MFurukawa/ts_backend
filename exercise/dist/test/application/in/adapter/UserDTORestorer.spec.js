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
const test_1 = require("@nestjs/testing/test");
const User_1 = require("../../../../src/application/domain/model/user/User");
const AppModule_1 = require("../../../../src/AppModule");
const bcrypt = __importStar(require("bcrypt"));
/**
 * UserDTORestorerの単体テスト
 * [テスト実行コマンド]
 * npx jest test/application/in/adapter/UserDTORestorer.spec.ts
 * @author Fullness
 * @date 2025-03-23
 * @version 1.0.0
 */
describe("UserDTORestorerの単体テスト", () => {
    let app; // NestJSアプリケーションインスタンス
    let restorer; // テストターゲット
    /**
     * すべてのテストの前処理
     */
    beforeAll(async () => {
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        restorer = app.get('UserDTORestorer');
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        await app.close();
    });
    describe("restore()", () => {
        it("UserDTOからUserエンティティを復元できる", async () => {
            const dto = {
                id: "3d1e89a4-06dc-11f0-9fce-6a0ec65304f1",
                username: "testuser",
                email: "testuser@example.com",
                password: "testpassword123",
                isActive: true,
                createdAt: new Date("2025-03-21T10:00:00Z"),
                updatedAt: new Date("2025-03-22T12:00:00Z"),
                roles: [
                    {
                        id: "3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1",
                        name: "user"
                    }
                ]
            };
            const user = await restorer.restore(dto);
            expect(user).toBeInstanceOf(User_1.User);
            expect(user.getId().getValue()).toBe(dto.id);
            expect(user.getUsername().getValue()).toBe(dto.username);
            expect(user.getEmail().getValue()).toBe(dto.email);
            // ハッシュ化されたパスワードを検証する
            const isMatch = await bcrypt.compare(dto.password, user.getPassword().getValue());
            expect(isMatch).toBe(true);
            expect(user.isUserActive()).toBe(true);
            expect(user.getCreatedAt().getValue().toISOString()).
                toBe(dto.createdAt.toISOString());
            expect(user.getUpdatedAt().getValue().toISOString()).
                toBe(dto.updatedAt.toISOString());
            expect(user.getRoles()).toHaveLength(1);
            expect(user.getRoles()[0].getId().getValue()).
                toBe("3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1");
            expect(user.getRoles()[0].getName().getValue()).toBe("user");
        });
    });
    describe("restoreAll()", () => {
        it("複数のUserDTOをUserエンティティ配列に復元できる", async () => {
            const dtos = [
                {
                    id: "3d1e89a4-06dc-11f0-9fce-6a0ec65304f1",
                    username: "user1",
                    email: "user1@example.com",
                    password: "testPassword1",
                    isActive: true,
                    createdAt: new Date("2025-01-01T00:00:00Z"),
                    updatedAt: new Date("2025-01-02T00:00:00Z"),
                    roles: [
                        { id: "3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1", name: "admin" }
                    ]
                },
                {
                    id: "3d1e89a4-06dc-11f0-9fce-6a0ec65304f2",
                    username: "user2",
                    email: "user2@example.com",
                    password: "testPassword2",
                    isActive: false,
                    createdAt: new Date("2025-02-01T00:00:00Z"),
                    updatedAt: new Date("2025-02-02T00:00:00Z"),
                    roles: [
                        { id: "3d1e3fd4-06dc-11f0-9fce-6a0ec65304f2", name: "guest" }
                    ]
                }
            ];
            const users = await restorer.restoreAll(dtos);
            expect(users).toHaveLength(2);
            expect(users[0].getUsername().getValue()).toBe("user1");
            expect(users[1].getUsername().getValue()).toBe("user2");
        });
    });
});
