// 登録ユーザーの共有ストレージ（インメモリ）
// Vercelのサーバーレス環境では、各リクエストで異なるインスタンスが使われる可能性があるため
// 本番環境ではGASまたはデータベースを使用することを推奨

export interface RegisteredUser {
  email: string;
  registeredAt: string;
  layer?: string;
  answers?: Record<string, string>;
  result?: { rank1: string; rank2: string; rank3: string };
}

// グローバルスコープでストレージを保持（Vercelのウォームスタート時に再利用される）
declare global {
  // eslint-disable-next-line no-var
  var userStorage: RegisteredUser[] | undefined;
}

// シングルトンパターンでストレージを取得
function getStorage(): RegisteredUser[] {
  if (!global.userStorage) {
    global.userStorage = [];
  }
  return global.userStorage;
}

export const userStorage = {
  // 全ユーザーを取得
  getAll(): RegisteredUser[] {
    return getStorage();
  },

  // ユーザーを追加または更新
  upsert(userData: {
    email: string;
    layer?: string;
    answers?: Record<string, string>;
    result?: { rank1: string; rank2: string; rank3: string };
  }): RegisteredUser {
    const storage = getStorage();
    const existingIndex = storage.findIndex(u => u.email === userData.email);

    if (existingIndex >= 0) {
      // 既存ユーザーを更新
      storage[existingIndex] = {
        ...storage[existingIndex],
        layer: userData.layer || storage[existingIndex].layer,
        answers: userData.answers || storage[existingIndex].answers,
        result: userData.result || storage[existingIndex].result,
      };
      return storage[existingIndex];
    } else {
      // 新規ユーザー
      const newUser: RegisteredUser = {
        email: userData.email,
        registeredAt: new Date().toISOString(),
        layer: userData.layer,
        answers: userData.answers,
        result: userData.result,
      };
      storage.push(newUser);
      return newUser;
    }
  },

  // メールアドレスでユーザーを検索
  findByEmail(email: string): RegisteredUser | undefined {
    return getStorage().find(u => u.email === email);
  },

  // ユーザー数を取得
  count(): number {
    return getStorage().length;
  },
};
