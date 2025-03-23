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
exports.RegisterUserInteractor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Username_1 = require("../../domain/model/user/Username");
const ExistsException_1 = require("../../../shared/exceptions/ExistsException");
const Email_1 = require("../../domain/model/user/Email");
const RoleName_1 = require("../../domain/model/role/RoleName");
const NotFoundException_1 = require("../../../shared/exceptions/NotFoundException");
const InternalException_1 = require("../../../shared/exceptions/InternalException");
/**
 * RegisterUserUsecaseインターフェイスの実装
 * - ユーザーの存在チェック、ロール確認、永続化を担う
 * @author Fullness,Inc.
 * @date 2025-03-23
 * @version 1.0.0
 */
let RegisterUserInteractor = class RegisterUserInteractor {
    /**
     * コンストラクタ
     * @param manager TypeORMのEntityManager
     * @param userRestorer UserDTOからUserエンティティを復元
     * @param userRepository UserRepositoryインターフェイス
     * @param roleRepository RoleRepositoryインターフェイス
     */
    constructor(entityManager, userRestorer, userRepository, roleRepository) {
        this.entityManager = entityManager;
        this.userRestorer = userRestorer;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.logger = new common_1.Logger('RegisterUserInteractor');
    }
    /**
     * ユーザーを新規登録する
     * @param dto UserDTO（入力データ）
     * @throws ExistsException ユーザー名またはメールアドレスが既に存在する
     * @throws NotFoundException 指定されたロールが存在しない
     * @throws InternalException その他内部エラー
     */
    async register(dto) {
        await this.entityManager.transaction(async (manager) => {
            try {
                // ユーザー名とメールアドレスの重複チェック
                await this.checkUserConflicts(dto, manager);
                // 指定されたロールが存在するかを検証する
                await this.verifyRolesExist(dto, manager);
                // UserDTOからUserエンティティを復元
                const user = await this.userRestorer.restore(dto);
                // ユーザーを永続化する
                await this.userRepository.create(user, manager);
            }
            catch (error) {
                if (error instanceof ExistsException_1.ExistsException || error instanceof NotFoundException_1.NotFoundException) {
                    throw error;
                }
                this.logger.error(`ユーザー登録失敗: ${error}`, error.stack);
                throw new InternalException_1.InternalException(`ユーザーの登録処理中に予期せぬエラーが発生しました。`);
            }
        });
    }
    /**
     * ユーザー名とメールアドレスの重複チェック
     * @param dto UserDTO
     * @param manager TypeORMのEntityManager
     */
    async checkUserConflicts(dto, manager) {
        const username = Username_1.Username.fromString(dto.username);
        if (await this.userRepository.existsByUsername(username, manager)) {
            throw new ExistsException_1.ExistsException(`ユーザー名「${dto.username}」は既に存在しています。`);
        }
        const email = Email_1.Email.fromString(dto.email);
        if (await this.userRepository.existsByEmail(email, manager)) {
            throw new ExistsException_1.ExistsException(`メールアドレス「${dto.email}」は既に使用されています。`);
        }
    }
    /**
     * 指定されたロールが存在するかを検証する
     * @param dto UserDTO
     * @param manager TypeORMのEntityManager
     */
    async verifyRolesExist(dto, manager) {
        if (!dto.roles)
            return;
        for (const role of dto.roles) {
            const roleName = RoleName_1.RoleName.fromString(role.name);
            const exists = await this.roleRepository.exists(roleName, manager);
            if (!exists) {
                throw new NotFoundException_1.NotFoundException(`ロール「${role.name}」は存在しません。`);
            }
        }
    }
};
exports.RegisterUserInteractor = RegisterUserInteractor;
exports.RegisterUserInteractor = RegisterUserInteractor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectEntityManager)()),
    __param(1, (0, common_1.Inject)('UserDTORestorer')),
    __param(2, (0, common_1.Inject)('UserRepository')),
    __param(3, (0, common_1.Inject)('RoleRepository')),
    __metadata("design:paramtypes", [typeorm_2.EntityManager, Object, Object, Object])
], RegisterUserInteractor);
