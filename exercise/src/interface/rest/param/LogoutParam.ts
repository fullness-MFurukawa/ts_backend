import { IsNotEmpty, IsUUID } from "class-validator";

/**
 * ログアウト用パラメータ
 * - クライアントが保持するリフレッシュトークンを送信する
 */
export class LogoutParam {
    @IsNotEmpty({ message: 'リフレッシュトークンは必須です。' })
    @IsUUID('4', { message: 'リフレッシュトークンはUUID形式である必要があります。' })
    refresh_token!: string;
}