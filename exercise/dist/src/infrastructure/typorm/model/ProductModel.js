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
exports.ProductModel = void 0;
const typeorm_1 = require("typeorm");
const CategoryModel_1 = require("./CategoryModel");
/**
 * productテーブルにマッピングされるエンティティクラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
let ProductModel = class ProductModel {
};
exports.ProductModel = ProductModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "obj_id", type: "varchar", length: 36, nullable: false }),
    __metadata("design:type", String)
], ProductModel.prototype, "objId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 30, nullable: false }),
    __metadata("design:type", String)
], ProductModel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    __metadata("design:type", Number)
], ProductModel.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "category_id", type: "varchar", length: 36, nullable: false }),
    __metadata("design:type", String)
], ProductModel.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CategoryModel_1.CategoryModel, (category) => category.products),
    (0, typeorm_1.JoinColumn)({ name: "category_id", referencedColumnName: "objId" }),
    __metadata("design:type", CategoryModel_1.CategoryModel)
], ProductModel.prototype, "category", void 0);
exports.ProductModel = ProductModel = __decorate([
    (0, typeorm_1.Entity)({ name: "product" }),
    (0, typeorm_1.Unique)("idx_obj_id", ["objId"]) // objIdカラムに対するユニーク制約を定義
], ProductModel);
