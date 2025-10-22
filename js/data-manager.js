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

/**
 * カードを追加する
 * バリデーションを行い、カードオブジェクトを作成してcardsDataに追加し、localStorageに保存する
 *
 * 実装フロー:
 * 1. バリデーション（空文字チェック）
 * 2. バリデーション（500文字制限チェック）
 * 3. バリデーション（カラムIDチェック）
 * 4. カードオブジェクトを作成
 * 5. cardsData.push(card) でメモリ上の配列に追加
 * 6. saveToStorage(cardsData) でlocalStorageに保存
 *
 * @param {string} content - カードの内容（タスク内容）
 * @param {string} columnId - 追加先のカラムID（"todo" | "inprogress" | "done"）
 * @throws {Error} バリデーションエラーまたは保存エラー
 *
 * カードオブジェクトの構造:
 * {
 *   id: "card-1634567890123-abc123def",  // generateCardId()で生成
 *   content: "タスクの内容",               // trim()で前後の空白削除
 *   columnId: "todo",                     // 追加先のカラムID
 *   createdAt: 1634567890123,            // 作成日時（Unixタイムスタンプ）
 *   updatedAt: 1634567890123             // 更新日時（作成時は同じ値）
 * }
 *
 * 使用例:
 * try {
 *   addCard('新しいタスク', 'todo');
 *   console.log('カード追加成功');
 * } catch (error) {
 *   console.error('カード追加失敗:', error.message);
 * }
 *
 * エラー例:
 * - Error: カードの内容を入力してください（空文字の場合）
 * - Error: カードの内容は500文字以内で入力してください（500文字超過の場合）
 * - Error: カラムIDが不正です（不正なカラムIDの場合）
 *
 * 注意:
 * - この関数は例外を投げる可能性がある（バリデーションエラー、localStorage保存エラー）
 * - 呼び出し側でtry-catchでエラーハンドリングを行うこと（Task 4で実装）
 * - このタスク（Task 3）ではコンソールから呼び出すため、エラーはコンソールに表示される
 */
function addCard(content, columnId) {
  // 1. バリデーション（空文字チェック）
  // contentがnull、undefined、空文字、または空白文字のみの場合はエラー
  // trim()で前後の空白を削除してから長さをチェック
  if (!content || content.trim().length === 0) {
    throw new Error('カードの内容を入力してください');
  }

  // 2. バリデーション（500文字制限チェック）
  // カード内容が500文字を超える場合はエラー
  // HTML側の maxlength="500" と一致させる
  if (content.length > 500) {
    throw new Error('カードの内容は500文字以内で入力してください');
  }

  // 3. バリデーション（カラムIDチェック）
  // COLUMNS配列に定義されているIDのみ有効
  // isValidColumnId() はTask 2で実装済み
  if (!isValidColumnId(columnId)) {
    throw new Error('カラムIDが不正です');
  }

  // 4. カードオブジェクトを作成
  // 現在のタイムスタンプを取得（作成日時と更新日時の両方に使用）
  const now = Date.now();

  // カードオブジェクトを作成
  // - id: generateCardId()でユニークなIDを生成（Task 2で実装済み）
  // - content: trim()で前後の空白を削除して保存
  // - columnId: 追加先のカラムID
  // - createdAt: 作成日時（Unixタイムスタンプ、ミリ秒単位）
  // - updatedAt: 更新日時（作成時は createdAt と同じ値）
  const card = {
    id: generateCardId(),
    content: content.trim(),
    columnId: columnId,
    createdAt: now,
    updatedAt: now
  };

  // 5. cardsData.push(card) でメモリ上の配列に追加
  // push()メソッドで配列の末尾に追加
  cardsData.push(card);

  // 6. saveToStorage(cardsData) でlocalStorageに保存
  // saveToStorage() はTask 2で実装済み
  // localStorage容量制限超過時は例外が発生する（そのまま投げる）
  saveToStorage(cardsData);

  // 正常に追加・保存された場合、何も返さない（undefinedを返す）
  // エラーが発生した場合は、上記のthrow文で例外を投げる
}
