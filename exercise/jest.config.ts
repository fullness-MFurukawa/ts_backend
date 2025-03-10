// ts-jestのモジュール名をマッピングするためのユーティリティをインポート
import { pathsToModuleNameMapper } from 'ts-jest';
// TypeScriptのコンパイルオプションをインポート
import { compilerOptions } from './tsconfig.json';

export default {
  preset: 'ts-jest', // TypeScriptを扱うためのJestプリセットを指定
  testEnvironment: 'node',// テストをNode.js環境で実行する設定
  rootDir: '.',// プロジェクトのルートディレクトリを指定
  // TypeScriptのパスエイリアスをJestで解釈可能にするためのマッピング
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/', // ルートディレクトリを基準にしたパスを解釈するためのプレフィックス
  }),
  transform: {
    '^.+\\.tsx?$': 'ts-jest',// TypeScriptファイル（.tsや.tsx）をts-jestを使ってトランスパイル
  },
  // モジュール検索時に探索するディレクトリを指定
  moduleDirectories: ['node_modules', '<rootDir>'],// node_modulesとプロジェクトルートを検索
};