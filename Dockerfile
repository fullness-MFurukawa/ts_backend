# Node.jsの公式Ubuntuベースイメージを使用
FROM node:23-bullseye

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    sudo curl git bash protobuf-compiler build-essential libssl-dev wget \
    && apt-get clean

# grpcurlをインストール
RUN wget -O grpcurl.tar.gz https://github.com/fullstorydev/grpcurl/releases/download/v1.8.7/grpcurl_1.8.7_linux_x86_64.tar.gz \
    && tar -xvzf grpcurl.tar.gz -C /usr/local/bin \
    && chmod +x /usr/local/bin/grpcurl \
    && rm -f grpcurl.tar.gz

# npmグローバルパスの設定 (root ではなく node ユーザーで実行)
USER node
RUN mkdir -p /home/node/.npm-global \
    && npm config set prefix /home/node/.npm-global \
    && echo "export PATH=/home/node/.npm-global/bin:\$PATH" >> /home/node/.bashrc

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH="/home/node/.npm-global/bin:$PATH"

# TypeScriptとts-protoをグローバルにインストール
RUN npm install -g typescript ts-proto

# 作業ディレクトリを作成
WORKDIR /app/exercise

# アプリケーションファイルをコピー
COPY --chown=node:node ./exercise /app/exercise

# 確実に TypeScript のコードがあるか確認
RUN ls -R /app/exercise/src /app/exercise/test || true

# npm依存関係をインストール
RUN npm install --legacy-peer-deps

RUN npm install --save-dev @types/jest @types/node @types/uuid

RUN npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier

# TypeScriptファイルをビルド
RUN tsc

# シンボリックリンクを作成
RUN ln -sf /app/exercise/dist/src/main.js /app/exercise/main.js

# デフォルトのコマンド
CMD ["bash"]