import { AuthenticateDTO } from "../dto/AuthenticateDTO";
import { AuthenticateResultDTO } from "../dto/AuthenticateResultDTO";

/**
 * ユーザー認証ユースケースのインターフェース
 * - アプリケーション層に定義
 * @author Fullness,Inc.
 * @date 2025-03-24
 * @version 1.0.0
 */
export interface AuthenticateUserUsecase {
    /**
     * 認証を実行する
     * @param dto 認証用DTO（ユーザー名とパスワード）
     * @returns 認証成功時にJWTトークンを返す
     * @throws UnauthorizedException認証に失敗した場合
     */
    authenticate(dto: AuthenticateDTO): Promise<AuthenticateResultDTO>;
}