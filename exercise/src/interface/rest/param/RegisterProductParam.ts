import {    IsNotEmpty, 
            IsString, 
            IsUUID, 
            Length, 
            Max, 
            MaxLength, 
            Min } from "class-validator"
import { IsNumberCustom } from "./IsNumberCustom"

/**
 * 商品登録パラメータ
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
export class RegisterProductParam {
    // 文字列であることを検証
    @IsString({message: '商品名は、文字列である必要があります。'}) 
    // 空白でないことを検証
    @IsNotEmpty({ message: '商品名は、必須です。' }) 
    // 最大30文字以内であることを検証
    @MaxLength(30 , { message: '商品名は、30文字以内にしてください。' }) 
    name: string    // 商品名
    
    // 数値であることを検証する
    @IsNumberCustom({ message: '商品単価は数値である必要があります。' })
    // 空白でないことを検証
    @IsNotEmpty({ message: '商品単価は、必須です。' }) 
    // 最小金額以内であることを検証する
    @Min(50 , {message: '商品単価は50以上である必要があります。'})
    // 最大金額であることを検証する
    @Max(10000 , {message: '商品単価は10000以下である必要があります。'})
    price: number // 商品単価

    // 文字列であることを検証
    @IsString({message: '商品カテゴリIdは、文字列である必要があります。'}) 
    // 空白でないことを検証
    @IsNotEmpty({ message: '商品カテゴリIdは、必須です。' }) 
    // UUIDでることを検証する
    @IsUUID( 4, { message: '商品カテゴリIdは、UUIDです。' })
    // 最大30文字以内であることを検証
    @Length(36 , 36 , { message: '商品カテゴリIdは、36文字にしてください。' }) 
    categoryId: string // 商品カテゴリId
}