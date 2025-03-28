
/**
 * 認証結果を表すDTO
 * - アプリケーション層のユースケースで使用
 * @author Fullness,Inc.
 * @date 2025-03-28
 * @version 1.0.0
 */
export class AuthenticateResultDTO {
    // アクセストークン
    readonly access_token: string;
    // リフレッシュトークン
    readonly refresh_token: string
    /**
     * コンストラクタ
     * @param access_token アクセストークン
     * @param refresh_token リフレッシュトークン
     */
    constructor(access_token: string,refresh_token: string){
        this.access_token = access_token;
        this.refresh_token = refresh_token;
    }
}