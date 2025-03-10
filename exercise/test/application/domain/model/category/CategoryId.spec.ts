import * as uuid from 'uuid';
import { CategoryId } from "@src/application/domain/model/category/CategoryId";
/**
 * CategoryIdクラスの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/domain/model/category/CategoryId.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
describe('値オブジェクト:CategoryIdの単体テスト', () => {
    describe('createNew()メソッド', () => {
        it('新しいCategoryIdインスタンスを生成し、有効なUUIDを持つことを確認する', () => {
            const categoryId = CategoryId.createNew();
            expect(uuid.validate(categoryId.getValue())).toBe(true);
        });
    });
});