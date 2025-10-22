// constants.js - アプリケーション全体で使用する定数

/**
 * localStorageのキー名
 * カンバンボードのデータを保存する際のキーとして使用
 *
 * このキーでlocalStorageにカードデータの配列をJSON形式で保存する
 * 例: localStorage.getItem('kanban_data') → "[{id: 'card-1', content: '...', ...}]"
 */
const STORAGE_KEY = 'kanban_data';

/**
 * カラム定義
 * カンバンボードの3つのカラムを定義
 *
 * @property {string} id - カラムを識別するための一意な文字列（data-column-id属性と対応）
 * @property {string} name - カラムの表示名（現時点では未使用だが、将来的な拡張のために定義）
 *
 * 注意:
 * - `id` は index.html の data-column-id 属性と完全に一致する必要がある
 * - カラムを追加・削除する場合は、この配列を編集する
 * - `isValidColumnId()` 関数でバリデーションに使用される
 */
const COLUMNS = [
  { id: 'todo', name: 'To Do' },
  { id: 'inprogress', name: 'In Progress' },
  { id: 'done', name: 'Done' }
];
