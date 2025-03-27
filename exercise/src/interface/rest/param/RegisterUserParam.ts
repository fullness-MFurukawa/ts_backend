import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { RoleParam } from "./RoleParam";

/**
 * ユーザー登録リクエストパラメータ
 * - クライアントからのユーザー登録リクエストを受け取るためのDTO
 * @author Fullness,Inc.
 * @date 2025-  03-26
 * @version 1.0.0
 */
export class RegisterUserParam {
    @IsNotEmpty({ message: 'ユーザー名は必須です。' })
    @IsString({ message: 'ユーザー名は文字列である必要があります。' })
    username: string;
  
    @IsNotEmpty({ message: 'メールアドレスは必須です。' })
    @IsEmail({}, { message: '正しいメールアドレス形式である必要があります。' })
    email: string;
  
    @IsNotEmpty({ message: 'パスワードは必須です。' })
    @IsString({ message: 'パスワードは文字列である必要があります。' })
    @MinLength(8, { message: 'パスワードは8文字以上である必要があります。' })
    password: string;
  
    @ValidateNested()
    @Type(() => RoleParam)
    @IsNotEmpty({ message: 'ロールは必須です。' })
    role: RoleParam;
}



