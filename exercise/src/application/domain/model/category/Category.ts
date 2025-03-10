import { CategoryId } from "./CategoryId";
import { CategoryName } from "./CategoryName";

/**
 * 商品カテゴリを表すエンティティクラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */    
export class Category {
    private readonly id: CategoryId;// 商品カテゴリId（不変）
    private name: CategoryName;     // 商品カテゴリ名（可変）
   
    /**
     * コンストラクタ
     * 新規カテゴリまたは既存カテゴリの復元に使用
     * @param id 商品カテゴリId（値オブジェクト）
     * @param name 商品カテゴリ名（値オブジェクト）
     */
    private constructor(id: CategoryId, name: CategoryName) {
        this.id = id;
        this.name = name;
    }

    /**
     * 新しいカテゴリを作成するための静的ファクトリメソッド
     * @param name 商品カテゴリ名
     * @returns 新しいCategoryインスタンス
     */
    static create(name: CategoryName): Category {
        return new Category(CategoryId.createNew(), name);
    }

    /**
     * 既存のカテゴリデータからインスタンスを生成するための静的ファクトリメソッド
     * @param id 既存のカテゴリID
     * @param name 既存のカテゴリ名
     * @returns 既存のCategoryインスタンス
     */
    static fromExisting(id: CategoryId, name: CategoryName): Category {
        return new Category(id, name);
    }

    /**
     * 商品カテゴリIdを取得
     * @returns 商品カテゴリId（値オブジェクト）
     */
    getId(): CategoryId {
        return this.id;
    }
    /**
     * 商品カテゴリ名を取得
     * @returns 商品カテゴリ名（値オブジェクト）
     */
    getName(): CategoryName {
        return this.name;
    }

    /**
     * 商品カテゴリ名を変更
     * @param name 新しい商品カテゴリ名
     */
    changeName(name: CategoryName): void {
        this.name = name;
    }


    /**
     * この商品カテゴリと他の商品カテゴリが等しいかどうかを判定する
     * @param other 比較対象の商品カテゴリ
     * @returns 他の商品カテゴリと等しい場合はtrue、それ以外の場合はfalse
     */
    equals(other: Category): boolean {
        return other instanceof Category && this.id.equals(other.getId());
    }

    /**
     * カテゴリ情報の文字列を返す（デバッグ用）
     * @returns 商品カテゴリIdと名称を含む文字列
     */
    toString(): string {
        return `Category [id=${this.id.toString()}, name=${this.name.toString()}]`;
    }
}