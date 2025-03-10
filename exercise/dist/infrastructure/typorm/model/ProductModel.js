var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { CategoryModel } from "./CategoryModel.js";
/**
 * productテーブルにマッピングされるエンティティクラス
 * @author Fullness,Inc.
 * @date 2025-03-10
 * @version 1.0.0
 */
let ProductModel = class ProductModel {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProductModel.prototype, "id", void 0);
__decorate([
    Column({ name: "obj_id", type: "varchar", length: 36, nullable: false }),
    __metadata("design:type", String)
], ProductModel.prototype, "objId", void 0);
__decorate([
    Column({ type: "varchar", length: 30, nullable: false }),
    __metadata("design:type", String)
], ProductModel.prototype, "name", void 0);
__decorate([
    Column({ type: "int", nullable: false }),
    __metadata("design:type", Number)
], ProductModel.prototype, "price", void 0);
__decorate([
    Column({ name: "category_id", type: "varchar", length: 36, nullable: false }),
    __metadata("design:type", String)
], ProductModel.prototype, "categoryId", void 0);
__decorate([
    ManyToOne(() => CategoryModel, (category) => category.products),
    JoinColumn({ name: "category_id", referencedColumnName: "objId" }),
    __metadata("design:type", CategoryModel)
], ProductModel.prototype, "category", void 0);
ProductModel = __decorate([
    Entity({ name: "product" }),
    Unique("idx_obj_id", ["objId"]) // objIdカラムに対するユニーク制約を定義
], ProductModel);
export { ProductModel };
