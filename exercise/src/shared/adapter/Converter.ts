/**
 * I型オブジェクトの値を:T型に変換するインターフェイス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
export interface Converter<I , O> {
    /**
     * I型オブジェクトの値を:T型に変換する
     * @param source 変換対象
     * @returns 変換結果
     */
    convert(source: I): Promise<O>;

    /**
     * 複数のI型オブジェクトの値を:T型に変換する
     * @param sources 変換対象の配列
     * @returns 変換結果の配列
     */
    convertAll(sources: I[]): Promise<O[]>;
}