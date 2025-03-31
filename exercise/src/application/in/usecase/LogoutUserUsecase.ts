import { LogoutDTO } from "../dto/LogoutDTO";

/**
 * ユーザーのログアウト処理を行うユースケースインターフェイス
 * - クライアントから送られたリフレッシュトークンを無効化する責務を担う
 * - ログアウト時には、リフレッシュトークンの再利用を防ぐためにトークンを失効させる
 * 実装クラスでは、トークンが有効であれば論理削除（revokedAtの設定）を行う。
 * JWT自体はステートレスであるため、アクセストークンの失効処理は通常不要。
 * @author Fullness
 * @date 2025-03-28
 * @version 1.0.0
 */
export interface LogoutUserUsecase {
    /**
     * リフレッシュトークンを無効化してログアウト処理を行う
     * @param refreshToken クライアントが保持するリフレッシュトークン（UUID形式の文字列）
     * @throws DomainException 不正なトークン形式などバリデーションエラー時
     */
    logout(logoutDTO: LogoutDTO): Promise<void>;
}