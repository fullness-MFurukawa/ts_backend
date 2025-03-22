import { Injectable } from "@nestjs/common";
import { User } from "@src/application/domain/model/user/User";
import { Converter } from "@src/shared/adapter/Converter";
import { UserModel } from "../model/UserModel";

/**
 * UserエンティティをUserModelに変換する
 * @author Fullness,Inc.
 * @date 2025-03-22
 * @version 1.0.0
 */
@Injectable()
export class UserModelConverter implements Converter<User, UserModel> {
    /**
     * UserからUserModelに変換する
     * @param source Userンティティ
     * @returns UserModel
     */
    async convert(source: User): Promise<UserModel> {
        const model = new UserModel();
        model.id = source.getId().getValue();
        model.username = source.getUsername().getValue();
        model.password = source.getPassword().getValue();
        model.email = source.getEmail().getValue();
        model.isActive = source.isUserActive();
        model.createdAt = source.getCreatedAt().getValue();
        model.updatedAt = source.getUpdatedAt().getValue();
        // userRoles は中間テーブル経由で別途設定するため、ここでは設定しない
        // model.userRoles = [];
        return model;
    }
    /**
     * Userの配列をUserModelに配列に変換する
     * @param sources Userエンティティの配列
     * @returns UserModelの配列
     */
    convertAll(sources: User[]): Promise<UserModel[]> {
        return Promise.all(sources.map(user => this.convert(user)));
    }
}