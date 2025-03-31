import { ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from 'express';
import { BlacklistAccessTokenUsecase } from "@src/application/in/usecase/BlacklistAccessTokenUsecase";

/**
 * JWT認証ガード（ブラックリスト対応）
 * - 通常のJWT認証に加え、トークンがブラックリストに登録されていないことを確認
 * - 無効トークンの場合はUnauthorizedExceptionをスロー
 * @author Fullness,Inc
 * @date 2025-03-30
 * @version 1.0.0
 */
@Injectable()
export class JwtBlacklistGuard extends AuthGuard('jwt') {
    /**
     * コンストラクタで依存関係を注入
     * @param reflector メタデータリフレクター（必要に応じて使用）
     * @param entityManager TypeORMのEntityManager（トランザクション可能）
     * @param blacklistedTokenRepo ブラックリストリポジトリ
     */
    constructor(
        @Inject('BlacklistAccessTokenUsecase')
        private readonly blacklistAccessTokenUsecase: BlacklistAccessTokenUsecase,
    ) {
        super(); // AuthGuard('jwt') を継承して基本認証処理を利用
    }
    /**
     * アクセス可否を判定（ガード本体）
     * - JWT認証に加えてブラックリスト照会を行う
     * @param context Nestの実行コンテキスト
     * @returns アクセス可能ならtrue、拒否なら例外スロー
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Step 1: 通常のJWT認証を実行（失敗時はfalseを返す）
        const can = await super.canActivate(context);
        if (!can) return false;
        // Step 2: HTTPリクエストからトークンを抽出
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('アクセストークンが指定されていません。');
        }
        const token = authHeader.replace('Bearer ', '').trim();
        // Step 3: トークンがブラックリストに存在するかを確認
        const isBlacklisted = await this.blacklistAccessTokenUsecase.isBlacklisted(token);
        if (isBlacklisted) {
            throw new UnauthorizedException('このトークンは無効化されています。');
        }
        // 認証OK + ブラックリスト未登録 → アクセス許可
        return true;
    }
}