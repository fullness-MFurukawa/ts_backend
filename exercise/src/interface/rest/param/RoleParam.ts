import { IsNotEmpty, IsString } from "class-validator";

/**
 * ユーザー登録リクエストパラメータ（ロール情報）
 * @author Fullness,Inc.
 * @date 2025-03-26
 * @version 1.0.0
 */
export class RoleParam {
    @IsNotEmpty({ message: 'ロールIdは必須です。' })
    @IsString({ message: 'ロールIdは文字列である必要があります。' })
    id: string;
  
    @IsNotEmpty({ message: 'ロール名は必須です。' })
    @IsString({ message: 'ロール名は文字列である必要があります。' })
    name: string;
}