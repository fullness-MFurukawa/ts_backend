import * as uuid from 'uuid';
import { ProductId } from "@src/application/domain/model/product/ProductId";
import { DomainException } from '@src/application/domain/exception/DomainException';

/**
 * ProductIdクラスの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/domain/model/product/ProductId.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-11
 * @version 1.0.0
 */
describe('値オブジェクト:ProductIdの単体テスト', () => {
    describe('createNew()メソッド', () => {
        it('新しいProductIdインスタンスを生成し、有効なUUIDを持つことを確認する', () => {
            const productId = ProductId.createNew();
            // UUIDが有効であることを検証
            expect(uuid.validate(productId.getValue())).toBe(true); 
        });
    });
    describe('fromString()メソッド', () => {
        it('有効なUUIDからProductIdインスタンスを生成する', () => {
            const validUuid = uuid.v4();
            const productId = ProductId.fromString(validUuid);
            // 正しい値が設定されていることを検証
            expect(productId.getValue()).toBe(validUuid); 
        });
        it('空文字列を指定した場合、DomainErrorをスローする', () => {
            expect(() => {ProductId.fromString('');})
                .toThrow(DomainException);
            expect(() => {ProductId.fromString('');})
                .toThrow('商品Idは必須です。');
        });
        it('UUID形式でない値を指定した場合、DomainErrorをスローする', () => {
            const invalidUuid = 'invalid-uuid';
            expect(() => {ProductId.fromString(invalidUuid);})
                .toThrow(DomainException);
            expect(() => {ProductId.fromString(invalidUuid);})
                .toThrow('商品IdはUUID形式でなければなりません。');
        });
    });
    describe('equals()メソッド', () => {
        it('同じ値を持つProductIdインスタンスを等しいと判定する', () => {
            const validUuid = uuid.v4();
            const productId1 = ProductId.fromString(validUuid);
            const productId2 = ProductId.fromString(validUuid);
            expect(productId1.equals(productId2)).toBe(true); 
        });
        it('異なる値を持つProductIdインスタンスを等しくないと判定する', () => {
            const productId1 = ProductId.createNew();
            const productId2 = ProductId.createNew();
            expect(productId1.equals(productId2)).toBe(false); 
        });
        it('nullやundefinedと比較した場合、falseを返す', () => {
            const productId = ProductId.createNew();
            // null比較時の検証
            expect(productId.equals(null as any)).toBe(false); 
            // undefined比較時の検証
            expect(productId.equals(undefined as any)).toBe(false); 
        });
    });
    describe('toString()メソッド', () => {
        it('ProductIdインスタンスの文字列表現を返す', () => {
            const validUuid = uuid.v4();
            const productId = ProductId.fromString(validUuid);
            // 文字列表現が期待通りかを検証
            expect(productId.toString()).toBe(`ProductId=${validUuid}`); 
        });
    });
});