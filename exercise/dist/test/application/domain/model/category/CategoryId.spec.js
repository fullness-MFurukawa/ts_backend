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
const CategoryId_1 = require("../../../../../src/application/domain/model/category/CategoryId");
const DomainException_1 = require("../../../../../src/application/domain/exception/DomainException");
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
            const categoryId = CategoryId_1.CategoryId.createNew();
            expect(uuid.validate(categoryId.getValue())).toBe(true);
        });
    });
    describe('fromString()メソッド', () => {
        it('有効なUUID文字列からCategoryIdインスタンスを生成できる', () => {
            const validUuid = uuid.v4();
            const categoryId = CategoryId_1.CategoryId.fromString(validUuid);
            expect(categoryId.getValue()).toBe(validUuid);
        });
        it('無効なUUID文字列を指定した場合、DomainErrorをスローする', () => {
            const invalidUuid = 'invalid-uuid';
            expect(() => CategoryId_1.CategoryId.fromString(invalidUuid)).toThrow(DomainException_1.DomainException);
            expect(() => CategoryId_1.CategoryId.fromString(invalidUuid)).toThrow('商品カテゴリIdは、UUID形式でなければなりません。');
        });
        it('空文字列を指定した場合、DomainErrorをスローする', () => {
            expect(() => CategoryId_1.CategoryId.fromString('')).toThrow(DomainException_1.DomainException);
            expect(() => CategoryId_1.CategoryId.fromString('')).toThrow('商品カテゴリId、は必須です。');
        });
    });
    describe('equals()メソッド', () => {
        it('同じUUID値を持つCategoryIdは等しいと判定される', () => {
            const uuidValue = uuid.v4();
            const categoryId1 = CategoryId_1.CategoryId.fromString(uuidValue);
            const categoryId2 = CategoryId_1.CategoryId.fromString(uuidValue);
            expect(categoryId1.equals(categoryId2)).toBe(true);
        });
        it('異なるUUID値を持つCategoryIdは等しくないと判定される', () => {
            const categoryId1 = CategoryId_1.CategoryId.createNew();
            const categoryId2 = CategoryId_1.CategoryId.createNew();
            expect(categoryId1.equals(categoryId2)).toBe(false);
        });
        it('CategoryId以外のオブジェクトとは等しくないと判定される', () => {
            const categoryId = CategoryId_1.CategoryId.createNew();
            expect(categoryId.equals({})).toBe(false);
        });
    });
    describe('toString()メソッド', () => {
        it('CategoryIdのUUID値を含む文字列を返す', () => {
            const uuidValue = uuid.v4();
            const categoryId = CategoryId_1.CategoryId.fromString(uuidValue);
            expect(categoryId.toString()).toBe(`CategoryId=${uuidValue}`);
        });
    });
});
