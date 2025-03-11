import * as uuid from 'uuid';
import { CategoryId } from "@src/application/domain/model/category/CategoryId";
import { DomainException } from '@src/application/domain/exception/DomainException';
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
    describe('fromString()メソッド', () => {
        it('有効なUUID文字列からCategoryIdインスタンスを生成できる', () => {
            const validUuid = uuid.v4();
            const categoryId = CategoryId.fromString(validUuid);
            expect(categoryId.getValue()).toBe(validUuid);
        });
        it('無効なUUID文字列を指定した場合、DomainErrorをスローする', () => {
            const invalidUuid = 'invalid-uuid';
            expect(() => CategoryId.fromString(invalidUuid)).toThrow(DomainException);
            expect(() => CategoryId.fromString(invalidUuid)).toThrow(
                '商品カテゴリIdは、UUID形式でなければなりません。'
            );
        });
        it('空文字列を指定した場合、DomainErrorをスローする', () => {
            expect(() => CategoryId.fromString('')).toThrow(DomainException);
            expect(() => CategoryId.fromString('')).toThrow('商品カテゴリId、は必須です。');
        });
    });
    describe('equals()メソッド', () => {
        it('同じUUID値を持つCategoryIdは等しいと判定される', () => {
            const uuidValue = uuid.v4();
            const categoryId1 = CategoryId.fromString(uuidValue);
            const categoryId2 = CategoryId.fromString(uuidValue);
            expect(categoryId1.equals(categoryId2)).toBe(true);
        });
        it('異なるUUID値を持つCategoryIdは等しくないと判定される', () => {
            const categoryId1 = CategoryId.createNew();
            const categoryId2 = CategoryId.createNew();
            expect(categoryId1.equals(categoryId2)).toBe(false);
        });
        it('CategoryId以外のオブジェクトとは等しくないと判定される', () => {
            const categoryId = CategoryId.createNew();
            expect(categoryId.equals({} as any)).toBe(false);
        });
    });
    describe('toString()メソッド', () => {
        it('CategoryIdのUUID値を含む文字列を返す', () => {
            const uuidValue = uuid.v4();
            const categoryId = CategoryId.fromString(uuidValue);
            expect(categoryId.toString()).toBe(`CategoryId=${uuidValue}`);
        });
    });
});