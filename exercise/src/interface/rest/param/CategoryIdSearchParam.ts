import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
/**
 * 商品カテゴリId検索パラメータ
 * @author Fullness,Inc.
 * @date 2025-01-11
 * @version 1.0.0
 */
export class CategoryIdSearchParam {
    // 文字列であることを検証
    @IsString({message: '商品カテゴリIdは、文字列である必要があります。'}) 
    // 空白でないことを検証
    @IsNotEmpty({ message: '商品カテゴリIdは、必須です。' }) 
    // UUIDでることを検証する
    @IsUUID( 4, { message: '商品カテゴリIdは、UUIDです。' })
    // 最大30文字以内であることを検証
    @Length(36, 36, { message: '商品カテゴリIdは、36文字にしてください。' }) 
    categoryId: string
}