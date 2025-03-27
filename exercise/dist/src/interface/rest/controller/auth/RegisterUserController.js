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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserController = void 0;
const common_1 = require("@nestjs/common");
const RoleDTO_1 = require("../../../../application/in/dto/RoleDTO");
const RegisterUserParam_1 = require("../../param/RegisterUserParam");
const swagger_1 = require("@nestjs/swagger");
/**
 * ユーザー登録RESTAPIコントローラ
 * @author Fullness,Inc.
 * @date 2025-03-25
 * @version 1.0.0
 */
let RegisterUserController = class RegisterUserController {
    /**
     * コンストラクタ
     * @param registerUserUsecase ユーザー登録ユースケース
     * @param paramConverter RegisterUserParamをUserDTOへ変換
     */
    constructor(registerUserUsecase, paramConverter) {
        this.registerUserUsecase = registerUserUsecase;
        this.paramConverter = paramConverter;
    }
    /**
     * 使用可能なロールを提供する
     * @returns
     */
    async getAvailableRoles() {
        return await this.registerUserUsecase.fetchRoles();
    }
    /**
     * ユーザーを登録する
     * @param param RegisterUserParam
     */
    async registerUser(param) {
        const dto = await this.paramConverter.convert(param);
        await this.registerUserUsecase.register(dto);
    }
};
exports.RegisterUserController = RegisterUserController;
__decorate([
    (0, common_1.Get)('roles'),
    (0, swagger_1.ApiOperation)({ summary: '利用可能なロール一覧の取得' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ロール一覧を取得しました。', type: [RoleDTO_1.RoleDTO] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegisterUserController.prototype, "getAvailableRoles", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })) // class-transformer + validator対応
    ,
    (0, swagger_1.ApiOperation)({ summary: 'ユーザー登録' }),
    (0, swagger_1.ApiBody)({ type: RegisterUserParam_1.RegisterUserParam }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ユーザーが正常に登録されました。' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterUserParam_1.RegisterUserParam]),
    __metadata("design:returntype", Promise)
], RegisterUserController.prototype, "registerUser", null);
exports.RegisterUserController = RegisterUserController = __decorate([
    (0, swagger_1.ApiTags)('ユーザー登録'),
    (0, common_1.Controller)('users/register'),
    __param(0, (0, common_1.Inject)('RegisterUserUsecase')),
    __param(1, (0, common_1.Inject)('RegisterUserParamConverter')),
    __metadata("design:paramtypes", [Object, Object])
], RegisterUserController);
