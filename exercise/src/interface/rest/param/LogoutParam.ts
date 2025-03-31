import { IsDateString, IsNotEmpty, IsUUID } from "class-validator";

/**
 * ログアウト用パラメータ
 * - クライアントが保持するリフレッシュトークンを送信する
 * @author Fullness,Inc.
 * @date 2025-03-30
 * @version 1.0.0
 */
export class LogoutParam {
    @IsNotEmpty({ message: 'リフレッシュトークンは必須です。' })
    @IsUUID('4', { message: 'リフレッシュトークンはUUID形式である必要があります。' })
    refresh_token!: string;

    @IsNotEmpty({ message: 'アクセストークンは必須です。' })
    access_token!: string;
    
    @IsNotEmpty({ message: 'アクセストークンの有効期限は必須です。' })
    @IsDateString({}, { message: '有効期限はISO8601形式の日付文字列である必要があります。' })
    expires_at!: string;
}