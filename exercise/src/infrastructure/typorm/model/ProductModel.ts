import { 
    Column, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
    Unique } 
from "typeorm";
import { CategoryModel } from "./CategoryModel";

/**
 * productテーブルにマッピングされるエンティティクラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
@Entity({ name: "product" })
@Unique("idx_obj_id", ["objId"]) // objIdカラムに対するユニーク制約を定義
export class ProductModel{
    // 自動生成される主キー列 (idカラム)
    @PrimaryGeneratedColumn()
    id!: number;
    // オブジェクトIdを表すobjIdカラム、36文字以内で必須
    @Column({ name: "obj_id" , type: "varchar", length: 36, nullable: false })
    objId!: string;
    // 商品名を表すnameカラム、30文字以内で必須
    @Column({ type: "varchar", length: 30, nullable: false })
    name!: string;
    // 商品の価格を表すpriceカラム、整数で必須
    @Column({ type: "int", nullable: false })
    price!: number;
    // カテゴリーIdを表すcategoryIdカラム、36文字以内で必須
    @Column({  name: "category_id" , type: "varchar", length: 36, nullable: false })
    categoryId!: string;
    // CategoryModelと多対1のリレーションを設定
    // category_idカラムとCategoryModelのobjIdカラムを紐付ける
    @ManyToOne(() => CategoryModel, (category) => category.products)
    @JoinColumn({ name: "category_id", referencedColumnName: "objId" })
    category!: CategoryModel;
}