var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryModel } from "../model/CategoryModel.js";
import { Restorer } from "@/shared/adapter/Restorer.js";
/**
 * Categoryエンティティのリポジトリインターフェイス実装
 * @author Fullness,Inc.
 * @date 2025-01-08
 * @version 1.0.0
 */
let CategoryRepositoryImpl = class CategoryRepositoryImpl {
    /**
     * コンストラクタ
     * @param repository TypeORMのRepository
     * @param restorer  CategoryModelからCategoryエンティティを復元
     */
    constructor(repository, restorer) {
        this.repository = repository;
        this.restorer = restorer;
    }
    /**
     * Idで商品カテゴリを取得する
     * @param id 取得するCategoryのCategoryId
     * @param manager? TypeORMのEntityManager
     * @returns Categoryインスタンス、存在しない場合はnull
     */
    async findById(id, manager) {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(CategoryModel) : this.repository;
        const model = await repo.findOne({ where: { objId: id.getValue() } });
        if (!model) {
            return null; // 見つからない場合はnullを返す
        }
        // モデルをエンティティに変換して返す
        return this.restorer.restore(model);
    }
    /**
     * すべての商品カテゴリを取得する
     * @param manager? TypeORMのEntityManager
     * @returns すべてのCategoryインスタンスの配列
     */
    async findAll(manager) {
        // 引数managerが指定された場合は、EntityManagerを利用する
        // 引数managerが指定されない場合は、Repositoryを利用する
        const repo = manager ? manager.getRepository(CategoryModel) : this.repository;
        // リポジトリを使用してすべてのモデルを取得
        const models = await repo.find();
        // モデルリストをエンティティリストに変換して返す
        return this.restorer.restoreAll(models);
    }
};
CategoryRepositoryImpl = __decorate([
    Injectable(),
    __param(0, InjectRepository(CategoryModel)),
    __param(1, Inject('CategoryModelRestorer')),
    __metadata("design:paramtypes", [Repository, typeof (_a = typeof Restorer !== "undefined" && Restorer) === "function" ? _a : Object])
], CategoryRepositoryImpl);
export { CategoryRepositoryImpl };
