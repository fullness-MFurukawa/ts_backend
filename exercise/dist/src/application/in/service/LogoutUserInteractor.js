"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LogoutUserInteractor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutUserInteractor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const RefreshTokenId_1 = require("../../domain/model/token/RefreshTokenId");
const NotFoundException_1 = require("../../../shared/exceptions/NotFoundException");
const InternalException_1 = require("../../../shared/exceptions/InternalException");
/**
 * ユーザーログアウトユースケースの実装クラス
 * - クライアントから送信されたリフレッシュトークンを無効化する
 * - 不正なトークンや存在しないトークンには例外を投げる
 *
 * @author Fullness
 * @date 2025-03-28
 * @version 1.0.0
 */
let LogoutUserInteractor = LogoutUserInteractor_1 = class LogoutUserInteractor {
    /**
     * コンストラクタ
     * @param entityManager TypeORMのEntityManager
     * @param refreshTokenRepository リフレッシュトークンリポジトリ
     * @param blacklistedTokenRepository アクセストークンブラックリストの永続化リポジトリ
     */
    constructor(entityManager, refreshTokenRepository, blacklistedTokenRepository) {
        this.entityManager = entityManager;
        this.refreshTokenRepository = refreshTokenRepository;
        this.blacklistedTokenRepository = blacklistedTokenRepository;
        this.logger = new common_1.Logger(LogoutUserInteractor_1.name);
    }
    /**
     * リフレッシュトークンを無効化してログアウト処理を行う
     * @param refreshToken クライアントが保持するリフレッシュトークン（UUID形式の文字列）
     */
    async logout(logoutDTO) {
        // UUID形式のチェックとオブジェクト生成（バリデーション含む）
        const refreshTokenId = RefreshTokenId_1.RefreshTokenId.fromString(logoutDTO.refreshToken);
        await this.entityManager.transaction(async (manager) => {
            try {
                // トークンの存在確認
                const token = await this.refreshTokenRepository.findById(refreshTokenId, manager);
                if (!token) {
                    throw new NotFoundException_1.NotFoundException("指定されたリフレッシュトークンは存在しません。");
                }
                // すでに無効化済みでなければ、無効化する
                if (!token.isRevoked()) {
                    token.revoke(); // revoke日時を設定
                    await this.refreshTokenRepository.revoke(refreshTokenId, manager); // DB反映
                }
                // トークンをブラックリストに追加する 2025-03-30
                await this.blacklistedTokenRepository
                    .add(logoutDTO.accessToken, logoutDTO.expiresAt, manager);
            }
            catch (error) {
                this.logger.error(`ログアウト処理中にエラーが発生しました: ${error}`, error.stack);
                throw new InternalException_1.InternalException("ログアウト処理に失敗しました。");
            }
        });
    }
};
exports.LogoutUserInteractor = LogoutUserInteractor;
exports.LogoutUserInteractor = LogoutUserInteractor = LogoutUserInteractor_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectEntityManager)()),
    __param(1, (0, common_1.Inject)('RefreshTokenRepository')),
    __param(2, (0, common_1.Inject)('BlacklistedTokenRepository')),
    __metadata("design:paramtypes", [typeorm_2.EntityManager, Object, Object])
], LogoutUserInteractor);
