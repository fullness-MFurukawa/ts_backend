"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = __importStar(require("uuid"));
const ProductId_1 = require("../../../../../src/application/domain/model/product/ProductId");
const DomainException_1 = require("../../../../../src/application/domain/exception/DomainException");
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
            const productId = ProductId_1.ProductId.createNew();
            // UUIDが有効であることを検証
            expect(uuid.validate(productId.getValue())).toBe(true);
        });
    });
    describe('fromString()メソッド', () => {
        it('有効なUUIDからProductIdインスタンスを生成する', () => {
            const validUuid = uuid.v4();
            const productId = ProductId_1.ProductId.fromString(validUuid);
            // 正しい値が設定されていることを検証
            expect(productId.getValue()).toBe(validUuid);
        });
        it('空文字列を指定した場合、DomainErrorをスローする', () => {
            expect(() => { ProductId_1.ProductId.fromString(''); })
                .toThrow(DomainException_1.DomainException);
            expect(() => { ProductId_1.ProductId.fromString(''); })
                .toThrow('商品Idは必須です。');
        });
        it('UUID形式でない値を指定した場合、DomainErrorをスローする', () => {
            const invalidUuid = 'invalid-uuid';
            expect(() => { ProductId_1.ProductId.fromString(invalidUuid); })
                .toThrow(DomainException_1.DomainException);
            expect(() => { ProductId_1.ProductId.fromString(invalidUuid); })
                .toThrow('商品IdはUUID形式でなければなりません。');
        });
    });
    describe('equals()メソッド', () => {
        it('同じ値を持つProductIdインスタンスを等しいと判定する', () => {
            const validUuid = uuid.v4();
            const productId1 = ProductId_1.ProductId.fromString(validUuid);
            const productId2 = ProductId_1.ProductId.fromString(validUuid);
            expect(productId1.equals(productId2)).toBe(true);
        });
        it('異なる値を持つProductIdインスタンスを等しくないと判定する', () => {
            const productId1 = ProductId_1.ProductId.createNew();
            const productId2 = ProductId_1.ProductId.createNew();
            expect(productId1.equals(productId2)).toBe(false);
        });
        it('nullやundefinedと比較した場合、falseを返す', () => {
            const productId = ProductId_1.ProductId.createNew();
            // null比較時の検証
            expect(productId.equals(null)).toBe(false);
            // undefined比較時の検証
            expect(productId.equals(undefined)).toBe(false);
        });
    });
    describe('toString()メソッド', () => {
        it('ProductIdインスタンスの文字列表現を返す', () => {
            const validUuid = uuid.v4();
            const productId = ProductId_1.ProductId.fromString(validUuid);
            // 文字列表現が期待通りかを検証
            expect(productId.toString()).toBe(`ProductId=${validUuid}`);
        });
    });
});
