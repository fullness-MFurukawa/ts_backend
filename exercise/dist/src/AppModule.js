"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const InfrastructureModule_1 = require("./infrastructure/InfrastructureModule");
const ApplicationModule_1 = require("./application/ApplicationModule");
const InterfaceModule_1 = require("./interface/InterfaceModule");
const config_1 = require("@nestjs/config");
/**
 * アプリケーション全体のモジュール定義
 * - 各レイヤーモジュールを統合
 * - アプリケーションのエントリーポイント
 * @author Fullness
 * @date 2025-03-10
 * @version 1.0.0
 */
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // JWTで利用
            config_1.ConfigModule.forRoot({ isGlobal: true }), // 環境変数を読み込む
            InfrastructureModule_1.InfrastructureModule, // インフラストラクチャ層のモジュール定義
            ApplicationModule_1.ApplicationModule, // アプリケーション層のモジュール定義
            InterfaceModule_1.InterfaceModule, // インターフェイス層のモジュール定義
        ],
    })
], AppModule);
