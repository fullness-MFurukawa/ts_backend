import {    Column , 
    Entity, 
    OneToMany, 
    PrimaryGeneratedColumn, 
    Unique } 
from "typeorm";
import { ProductModel } from "./ProductModel.js";
/**
 * categoryテーブルにマッピングされるエンティティクラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
@Entity({ name: "category" })
@Unique("idx_obj_id", ["objId"]) // objIdカラムに対するユニーク制約を定義
export class CategoryModel{
    // 自動生成される主キー列 (idカラム)
    @PrimaryGeneratedColumn()
    id!: number;
    // オブジェクトIdを表すobj_idカラム、36文字以内で必須
    @Column({ name: "obj_id" , type: "varchar", length: 36, nullable: false })
    objId!: string;
    // カテゴリー名を表すnameカラム、20文字以内で必須
    @Column({ type: "varchar", length: 20, nullable: false })
    name!: string;
    // このカテゴリーに属するProductModelの配列、1対多の関係
    @OneToMany(() => ProductModel, (product) => product.category)
    products!: ProductModel[];
}