import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
/**
 * 商品Id検索パラメータ
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
export class ProductIdSearchParam {
    // 文字列であることを検証
    @IsString({message: '商品Idは、文字列である必要があります。'}) 
    // 空白でないことを検証
    @IsNotEmpty({ message: '商品Idは、必須です。' }) 
    // UUIDでることを検証する
    @IsUUID( 4, { message: '商品Idは、UUIDです。' })
    // 最大30文字以内であることを検証
    @Length(36, 36, { message: '商品Idは、36文字にしてください。' }) 
    productId: string
}