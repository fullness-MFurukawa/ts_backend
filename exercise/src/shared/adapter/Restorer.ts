/**
 * 他のモデルI型からエンティティO型を復元するインターフェイス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
export interface Restorer<I , O> {
    /**
     * 他のモデルI型からをO型エンティティを復元する
     * @param source 任意の他のモデル
     * @returns エンティティ
     */
    restore(source: I): Promise<O>;
    /**
     * 複数の他のモデルI型からO型エンティティを復元する
     * @param sources 任意の他のモデルの配列
     * @returns エンティティの配列
     */
    restoreAll(sources: I[]): Promise<O[]>;
}