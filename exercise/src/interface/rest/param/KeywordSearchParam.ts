import { IsNotEmpty, IsString, MaxLength } from "class-validator";

/**
 * 商品キーワード検索パラメータ
 * @author Fullness,Inc.
 * @date 2025-03-16
 * @version 1.0.0
 */
export class KeywordSearchParam {
    // 文字列であることを検証
    @IsString({message: 'キーワードは文字列である必要があります。'}) 
    // 空白でないことを検証
    @IsNotEmpty({ message: 'キーワードは必須です。' }) 
    // 最大30文字以内であることを検証
    @MaxLength(30 , { message: 'キーワードは30文字以内にしてください。' }) 
    keyword: string
}