"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const typeorm_1 = require("typeorm");
const ProductModel_1 = require("./ProductModel");
/**
 * categoryテーブルにマッピングされるエンティティクラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
let CategoryModel = class CategoryModel {
};
exports.CategoryModel = CategoryModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CategoryModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "obj_id", type: "varchar", length: 36, nullable: false }),
    __metadata("design:type", String)
], CategoryModel.prototype, "objId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, nullable: false }),
    __metadata("design:type", String)
], CategoryModel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductModel_1.ProductModel, (product) => product.category),
    __metadata("design:type", Array)
], CategoryModel.prototype, "products", void 0);
exports.CategoryModel = CategoryModel = __decorate([
    (0, typeorm_1.Entity)({ name: "category" }),
    (0, typeorm_1.Unique)("idx_obj_id", ["objId"]) // objIdカラムに対するユニーク制約を定義
], CategoryModel);
