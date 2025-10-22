// data-manager.js - カードデータのCRUD操作を担当
// このファイルはカードデータをメモリ上で管理し、localStorage と同期する

/**
 * カードデータの内部state
 * アプリケーション起動時にlocalStorageから読み込み、メモリ上に保持
 * すべてのカード操作はこの配列に対して行われる
 *
 * データ構造:
 * [
 *   {
 *     id: "card-1634567890123-abc",
 *     content: "タスクの内容",
 *     columnId: "todo",
 *     createdAt: 1634567890123,
 *     updatedAt: 1634567890123
 *   },
 *   ...
 * ]
 *
 * 注意:
 * - この変数はモジュール内でのみアクセス可能（プライベート）
 * - 外部からは getAllCards(), getCardsByColumn() 等のゲッター関数経由でアクセス（Task 4で実装）
 * - データの変更は必ず saveToStorage(cardsData) を呼んで永続化する
 */
let cardsData = [];

/**
 * カードデータを初期化する
 * アプリケーション起動時に1度だけ呼ばれる
 * localStorageからデータを読み込んでcardsDataに格納する
 *
 * 実装の考え方:
 * 1. loadFromStorage() を呼び出してlocalStorageからデータを読み込む
 * 2. 読み込んだデータを cardsData に代入
 * 3. これ以降、cardsData に対してすべての操作を行う
 *
 * 使用例:
 * // app.js の初期化フローで呼ばれる（Task 4で実装）
 * initializeData();
 * console.log('データ初期化完了:', cardsData);
 *
 * 注意:
 * - この関数は起動時に1度だけ呼ばれ、それ以降は呼ばれない
 * - loadFromStorage() はエラー時に空配列を返すので、この関数でエラー処理は不要
 */
function initializeData() {
  // localStorageからデータを読み込んでcardsDataに代入
  cardsData = loadFromStorage();
}

/**
 * ユニークなカードIDを生成する
 * フォーマット: "card-{タイムスタンプ}-{ランダム文字列}"
 *
 * 実装の考え方:
 * 1. Date.now() で現在のタイムスタンプを取得（ミリ秒単位）
 * 2. Math.random() でランダムな数値を生成（0.0 ～ 1.0）
 * 3. toString(36) で36進数文字列に変換（0-9, a-z の36文字を使用）
 * 4. slice(2, 11) で先頭2文字（"0."）を削除し、9文字取得
 * 5. "card-{timestamp}-{random}" のフォーマットで結合
 *
 * @returns {string} 生成されたカードID（例: "card-1634567890123-abc123def"）
 *
 * 生成例:
 * - Date.now() → 1634567890123
 * - Math.random() → 0.123456789
 * - Math.random().toString(36) → "0.4fzyo82mvyr"
 * - Math.random().toString(36).slice(2, 11) → "4fzyo82mv"
 * - 最終結果: "card-1634567890123-4fzyo82mv"
 *
 * 使用例:
 * const newCardId = generateCardId();
 * console.log(newCardId); // "card-1634567890123-abc123def"
 *
 * 注意:
 * - タイムスタンプとランダム文字列の組み合わせで、IDの衝突はほぼ起こらない
 * - この関数は addCard() で新規カード作成時に呼ばれる（Task 3で実装）
 */
function generateCardId() {
  // 現在のタイムスタンプを取得（ミリ秒単位）
  const timestamp = Date.now();

  // ランダムな文字列を生成（9文字）
  // Math.random() → 0.123456789
  // .toString(36) → "0.4fzyo82mvyr"（36進数文字列）
  // .slice(2, 11) → "4fzyo82mv"（先頭の "0." を削除し、9文字取得）
  const randomString = Math.random().toString(36).slice(2, 11);

  // "card-{timestamp}-{random}" のフォーマットで結合
  return `card-${timestamp}-${randomString}`;
}

/**
 * カラムIDが有効かチェックする
 * COLUMNS配列に定義されているIDのみ有効とする
 *
 * 実装の考え方:
 * 1. COLUMNS 配列をループして、columnId が存在するかチェック
 * 2. COLUMNS.some() を使用して、条件に一致する要素があるか確認
 * 3. 存在すれば true、存在しなければ false を返す
 *
 * @param {string} columnId - チェックするカラムID（例: "todo", "inprogress", "done"）
 * @returns {boolean} 有効なカラムIDの場合true、そうでない場合false
 *
 * 使用例:
 * isValidColumnId('todo');        // true
 * isValidColumnId('inprogress');  // true
 * isValidColumnId('invalid');     // false
 *
 * 注意:
 * - この関数は addCard(), moveCard() 等でバリデーションに使用される（Task 3以降で実装）
 * - 不正なカラムIDの場合、呼び出し側でエラーを投げる
 */
function isValidColumnId(columnId) {
  // COLUMNS 配列をループして、columnId が存在するかチェック
  // some() は条件に一致する要素が1つでもあれば true を返す
  return COLUMNS.some(col => col.id === columnId);
}
