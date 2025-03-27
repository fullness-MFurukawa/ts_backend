import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

/**
 * 認証用リクエストパラメータ
 * - ユーザー名とパスワードを受け取るDTO
 * @author Fullness,Inc.
 * @date 2025-03-27
 * @version 1.0.0
 */
export class AuthenticateParam {
    @ApiProperty({ description: 'ユーザー名', example: 'taro123' })
    @IsNotEmpty({ message: 'ユーザー名は必須です。' })
    @IsString({ message: 'ユーザー名は文字列である必要があります。' })
    username!: string;
  
    @ApiProperty({ description: 'パスワード（8文字以上）', example: 'secret123' })
    @IsNotEmpty({ message: 'パスワードは必須です。' })
    @IsString({ message: 'パスワードは文字列である必要があります。' })
    @MinLength(8, { message: 'パスワードは8文字以上である必要があります。' })
    password!: string;
  }