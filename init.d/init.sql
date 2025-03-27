/* カテゴリーテーブル作成 */
CREATE TABLE IF NOT EXISTS category (
    id INT NOT NULL AUTO_INCREMENT, /* カテゴリId(主キー、自動インクリメント) */
    obj_id VARCHAR(36) NOT NULL,    /* カテゴリの一意識別子（UUID)           */
    name VARCHAR(20) NOT NULL,      /* カテゴリ名 */
    PRIMARY KEY (id),
    UNIQUE KEY idx_obj_id (obj_id)
);

/* 商品テーブル作成 */
CREATE TABLE IF NOT EXISTS product (
    id INT NOT NULL AUTO_INCREMENT, /* 商品Id(主キー、自動インクリメント)   */
    obj_id VARCHAR(36) NOT NULL,    /* 商品一意識別子(UUID)                */
    name VARCHAR(30) NOT NULL,      /* 商品名                             */
    price INT NOT NULL,             /* 商品単価                           */
    category_id VARCHAR(36) NOT NULL,/* 商品カテゴリの一意識別子(外部キー)   */
    PRIMARY KEY (id),
    UNIQUE KEY idx_obj_id (obj_id),
    FOREIGN KEY (category_id) REFERENCES category (obj_id)
);

/* 認証・認可に関連するテーブル */
-- ユーザー情報を格納するテーブル
CREATE TABLE users (
    id CHAR(36) NOT NULL PRIMARY KEY COMMENT 'ユーザーID（UUID形式）',
    username VARCHAR(255) NOT NULL UNIQUE COMMENT 'ログイン用ユーザー名（一意制約）',
    password VARCHAR(255) NOT NULL COMMENT 'ハッシュ化されたパスワード',
    email VARCHAR(255) UNIQUE COMMENT 'メールアドレス（NULL許可、一意制約）',
    is_active BOOLEAN DEFAULT TRUE COMMENT '有効フラグ（論理削除用などに利用）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'レコード作成日時',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'レコード更新日時（自動更新）'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ユーザー情報テーブル';
-- ロール情報を格納するテーブル
CREATE TABLE roles (
    id CHAR(36) NOT NULL PRIMARY KEY COMMENT 'ロールID（UUID形式）',
    name VARCHAR(30) NOT NULL UNIQUE COMMENT 'ロール名（Admin, User, Guestなど）',
    description VARCHAR(255) COMMENT 'ロールの説明',
    inherits_from CHAR(36) NULL COMMENT '継承元のロールID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'レコード作成日時',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'レコード更新日時（自動更新）',
    CONSTRAINT fk_inherits_from FOREIGN KEY (inherits_from) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ロール情報テーブル';
-- ユーザーとロールを紐づける中間テーブル
CREATE TABLE user_roles (
    user_id CHAR(36) NOT NULL COMMENT 'ユーザーID（usersテーブルのUUID）',
    role_id CHAR(36) NOT NULL COMMENT 'ロールID（rolesテーブルのUUID）',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'ロールが付与された日時',
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ユーザーとロールの紐づけテーブル';
-- UUIDを使ったリフレッシュトークンテーブル
CREATE TABLE refresh_tokens (
  id CHAR(36) PRIMARY KEY COMMENT '主キー: リフレッシュトークンのUUID',
  user_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '対象のユーザーID(UUID)',
  token VARCHAR(512) NOT NULL UNIQUE COMMENT 'リフレッシュトークンの文字列（JWTなど）',

  issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '発行日時',
  expires_at DATETIME NOT NULL COMMENT '有効期限',
  revoked_at DATETIME DEFAULT NULL COMMENT '無効化された日時（null = 有効）',

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',

  CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ユーザーごとのリフレッシュトークンを管理するテーブル（UUID）';

/*
    商品カテゴリ
*/
INSERT INTO category (obj_id, name) VALUES
('b1524011-b6af-417e-8bf2-f449dd58b5c0', '文房具'),
('762bd1ea-9700-4bab-a28d-6cbebf20ddc2', '雑貨'),
('c05b1952-3bdf-4449-9b83-d0d123a667ce', 'パソコン周辺機器');

/* 
    商品 
*/
INSERT INTO product (obj_id,name,price,category_id) VALUES 
('ac413f22-0cf1-490a-9635-7e9ca810e544','水性ボールペン(黒)',120,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('8f81a72a-58ef-422b-b472-d982e8665292','水性ボールペン(赤)',120,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('d952b98c-a1ea-478d-8380-3b90fde872ea','水性ボールペン(青)',120,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('9959e553-c9da-4646-bd85-8663a3541583','油性ボールペン(黒)',100,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('79023e82-9197-40a5-b236-26487f404be4','油性ボールペン(赤)',100,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('7dfd0fd0-0893-4d20-83ef-6f70aab0ab76','油性ボールペン(青)',100,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('dc7243af-c2ce-4136-bd5d-c6b28ee0a20a','蛍光ペン(黄)',130,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('83fbc81d-2498-4da6-b8c2-54878d3b67ff','蛍光ペン(赤)',130,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('ee4b3752-3fbd-45fc-afb5-8f37c3f701c9','蛍光ペン(青)',130,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('35cb51a7-df79-4771-9939-7f32c19bca45','蛍光ペン(緑)',130,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('e4850253-f363-4e79-8110-7335e4af45be','鉛筆(黒)',100,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('5ca7dbdf-0010-44c5-a001-e4c13c4fe3a1','鉛筆(赤)',100,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('fbc43b9b-90a9-4712-925c-4d66a2a30372','色鉛筆(12色)',400,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('4b3db238-8ada-49b4-bb60-1a034914e528','色鉛筆(48色)',1300,'b1524011-b6af-417e-8bf2-f449dd58b5c0'),
('debdbd8c-5b48-4b1a-9697-98ba321ddd40','レザーネックレス',300,'762bd1ea-9700-4bab-a28d-6cbebf20ddc2'),
('367197c5-32bd-479a-9102-c601145464c4','ワンタッチ開閉傘',3000,'762bd1ea-9700-4bab-a28d-6cbebf20ddc2'),
('657578d2-8820-4490-a6ec-06d9c7cccd0f','金魚風呂敷',500,'762bd1ea-9700-4bab-a28d-6cbebf20ddc2'),
('8c107894-4ebc-445b-9603-c9e8e6524f9d','折畳トートバッグ',600,'762bd1ea-9700-4bab-a28d-6cbebf20ddc2'),
('2f8e074c-d0b1-441b-9dd4-6cf0ec570ce6','アイマスク',900,'762bd1ea-9700-4bab-a28d-6cbebf20ddc2'),
('2fb9fe48-3520-47ef-9e1a-338db7152884','防水スプレー',500,'762bd1ea-9700-4bab-a28d-6cbebf20ddc2'),
('f536311a-b9de-4873-a603-70953a2261be','キーホルダ',800,'762bd1ea-9700-4bab-a28d-6cbebf20ddc2'),
('82014174-6785-4242-b307-a806fd1f8470','ワイヤレスマウス',900,'c05b1952-3bdf-4449-9b83-d0d123a667ce'),
('ddd1e5ae-fb90-4a47-bb87-c91b305c7444','ワイヤレストラックボール',1300,'c05b1952-3bdf-4449-9b83-d0d123a667ce'),
('aa5e07aa-06f9-4037-9755-e1de3c0ad4ac','有線光学式マウス',500,'c05b1952-3bdf-4449-9b83-d0d123a667ce'),
('53cfa873-c86b-48bd-a68c-458d7bb5c844','光学式ゲーミングマウス',4800,'c05b1952-3bdf-4449-9b83-d0d123a667ce'),
('376f7a75-cc99-4428-b35a-889bcb3c90af','有線ゲーミングマウス',3800,'c05b1952-3bdf-4449-9b83-d0d123a667ce'),
('38c6e236-90ca-48a2-b427-acb9d834b591','USB有線式キーボード',1400,'c05b1952-3bdf-4449-9b83-d0d123a667ce'),
('dc2e5a33-a2b7-4414-9a53-f9750e7da8ed','無線式キーボード',1900,'c05b1952-3bdf-4449-9b83-d0d123a667ce');

/* ロール */
-- Guest（最下層、親なし）
INSERT INTO roles (id, name, description, inherits_from)
VALUES ('3d1e446b-06dc-11f0-9fce-6a0ec65304f1', 'Guest', '閲覧専用のゲストユーザー', NULL);
-- User（Guestを継承）
INSERT INTO roles (id, name, description, inherits_from)
VALUES ('3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1', 'User', '標準的なユーザー権限', '3d1e446b-06dc-11f0-9fce-6a0ec65304f1');
-- Admin（Userを継承）
INSERT INTO roles (id, name, description, inherits_from)
VALUES ('3d1de6e4-06dc-11f0-9fce-6a0ec65304f1', 'Admin', '管理者権限を持つユーザー', '3d1e3fd4-06dc-11f0-9fce-6a0ec65304f1');


/* ユーザーの作成（パスワードは事前にハッシュ化） */
/* パスワード:P@ssw0rd123 */
/*
INSERT INTO users (id, username, email, password, is_active, created_at, updated_at)
VALUES
  (
    '3d1e89a4-06dc-11f0-9fce-6a0ec65304f1',
    'testuser',
    'testuser@example.com',
    '$2b$10$4VQ2p4KmMfHRkUl0jiP4qeHlNjK2eNYF9fEoNCwKlY8NyTZAMvl6G', -- bcryptでハッシュ化済みの値
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ); 
*/
/* ユーザーロールの関連付け */
-- Userはadmin権限を持つ
/*
INSERT INTO user_roles (user_id, role_id)
VALUES (
  '3d1e89a4-06dc-11f0-9fce-6a0ec65304f1',  -- testuser の user_id
  '3d1de6e4-06dc-11f0-9fce-6a0ec65304f1'   -- admin の role_id
); 
*/