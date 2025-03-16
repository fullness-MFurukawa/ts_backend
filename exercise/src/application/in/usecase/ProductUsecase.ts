import { ProductDTO } from "../dto/ProductDTO";

/**
 * 商品ユースケースインターフェイス
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
export interface ProductUsecase {
    /**
     * 指定されたキーワードを含む商品の取得結果を返す
     * @param keyword 商品キーワード
     * @returns ProductDTOの配列
     * @throws NotFoundException 商品が存在しない
     * @throws InternalException 内部エラー
     */
    getByKeyword(keyword: string):Promise<ProductDTO[]>;

    /**
     * 指定された商品Idのエンティティを取得する
     * @param id 商品Id
     * @returns ProductDTO
     * @throws NotFoundException 商品が存在しない
     * @throws InternalException 内部エラー
     */
    getByProductId(id: string): Promise<ProductDTO>;

    /**
     * 指定された商品の存在有無を調べる
     * @param name 商品名
     * @throws InternalError 内部エラー
     * @throws ExistsError 指定された商品が存在する
     */
    exists(name: string): Promise<void>;

    /**
     * 新商品を登録する
     * @param product 登録対象のProductDTO
     * @throws InternalError 内部エラー
     */
    register(product: ProductDTO): Promise<void>;

    /**
     * 商品名または単価を変更する
     * @param product ProductDTO
     * @throws NotFoundException 商品が存在しない
     * @throws InternalError 内部エラー
     */
    modify(product: ProductDTO): Promise<void>; 

    /**
     * 商品を削除する
     * @param id 商品Id
     * @throws NotFoundException 商品が存在しない
     * @throws InternalException 内部エラー
     */
    delete(id: string): Promise<void>;
}