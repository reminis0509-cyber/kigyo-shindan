'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  '登録日時'?: string;
  'メールアドレス'?: string;
  '層'?: string;
  '回答'?: string;
  '診断結果'?: string;
  'ステータス'?: string;
  // インメモリ形式
  email?: string;
  registeredAt?: string;
  layer?: string;
  answers?: Record<string, string>;
  result?: { rank1: string; rank2: string; rank3: string };
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState('');

  useEffect(() => {
    // 認証チェック
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/');
      return;
    }

    // ユーザーリストを取得
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (data.success) {
        setUsers(data.users || []);
        setSource(data.source || '');
        if (data.message) {
          setError(data.message);
        }
      } else {
        setError(data.message || 'データの取得に失敗しました');
      }
    } catch (err) {
      setError('データの取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  const getEmail = (user: User) => user['メールアドレス'] || user.email || '';
  const getDate = (user: User) => user['登録日時'] || user.registeredAt || '';
  const getLayer = (user: User) => user['層'] || user.layer || '';
  const getResult = (user: User) => {
    if (user['診断結果']) return user['診断結果'];
    if (user.result) return `${user.result.rank1}, ${user.result.rank2}, ${user.result.rank3}`;
    return '';
  };
  const getStatus = (user: User) => user['ステータス'] || '未購入';

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">管理画面</h1>
              <p className="text-sm text-gray-500 mt-1">診断登録者の一覧</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">登録者数</p>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">データソース</p>
            <p className="text-lg font-semibold text-gray-700">
              {source === 'gas' ? 'Google Sheets' : 'メモリ（一時）'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Stripe管理</p>
            <a
              href="https://dashboard.stripe.com/payments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              決済一覧を見る →
            </a>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6">
            <p className="text-yellow-800 text-sm">{error}</p>
            {source !== 'gas' && (
              <p className="text-yellow-700 text-xs mt-2">
                Google Sheetsと連携するには、GAS_EMAIL_COLLECTOR_URL環境変数を設定してください。
              </p>
            )}
          </div>
        )}

        {/* ユーザーリスト */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">登録者リスト</h2>
            <button
              onClick={fetchUsers}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              更新
            </button>
          </div>

          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              まだ登録者がいません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">登録日時</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">メールアドレス</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">層</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">診断結果</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">ステータス</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{getDate(user)}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{getEmail(user)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          getLayer(user) === 'A'
                            ? 'bg-green-100 text-green-700'
                            : getLayer(user) === 'B'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {getLayer(user) || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                        {getResult(user) || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          getStatus(user) === '購入済み'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {getStatus(user)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>診断システムの管理画面</p>
        </div>
      </div>
    </main>
  );
}
