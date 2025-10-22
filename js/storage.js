// storage.js - localStorage操作を担当
// このファイルはlocalStorageへの読み書きを安全に行うための関数を提供する

/**
 * localStorageが利用可能かチェックする
 * プライベートモード等でlocalStorageが無効な場合、例外が発生する
 *
 * 実装の考え方:
 * 1. try-catchでlocalStorageへのアクセスを試行
 * 2. テストデータを書き込んで読み込めるか確認
 * 3. テストデータを削除
 * 4. すべて成功したら true を返す
 *
 * @returns {boolean} localStorageが利用可能な場合true、そうでない場合false
 *
 * 使用例:
 * if (isStorageAvailable()) {
 *   console.log('localStorageが使えます');
 * } else {
 *   console.warn('localStorageが使えません');
 * }
 */
function isStorageAvailable() {
  try {
    // テスト用のキーと値を定義
    const testKey = '__storage_test__';
    const testValue = 'test';

    // localStorageに書き込みを試行
    localStorage.setItem(testKey, testValue);

    // 書き込んだ値を読み込んで確認
    const retrievedValue = localStorage.getItem(testKey);

    // テストデータを削除（クリーンアップ）
    localStorage.removeItem(testKey);

    // 書き込んだ値と読み込んだ値が一致すればlocalStorageは利用可能
    return retrievedValue === testValue;
  } catch (error) {
    // プライベートモードや設定で無効化されている場合、例外が発生する
    // SecurityError, QuotaExceededError などが発生する可能性がある
    return false;
  }
}

/**
 * localStorageからカンバンデータを読み込む
 * データが存在しない場合や、JSON解析に失敗した場合は空配列を返す
 *
 * 実装の考え方:
 * 1. localStorage.getItem() でデータを取得
 * 2. データが null の場合（初回起動時）は空配列を返す
 * 3. JSON.parse() でパース
 * 4. パースに失敗したら空配列を返す
 *
 * @returns {Array} カードオブジェクトの配列。データがない場合は空配列
 *
 * カードオブジェクトの形式:
 * {
 *   id: "card-1634567890123-abc",
 *   content: "タスクの内容",
 *   columnId: "todo",
 *   createdAt: 1634567890123,
 *   updatedAt: 1634567890123
 * }
 *
 * 使用例:
 * const cards = loadFromStorage();
 * console.log(cards); // [{ id: '...', content: '...' }, ...]
 */
function loadFromStorage() {
  try {
    // localStorageから STORAGE_KEY に対応するデータを取得
    const data = localStorage.getItem(STORAGE_KEY);

    // データが存在しない場合（初回起動時）は null が返る
    // この場合は空配列を返す
    if (data === null) {
      return [];
    }

    // JSON文字列をJavaScriptオブジェクトに変換
    const cards = JSON.parse(data);

    // パースに成功した場合、配列を返す
    // 万が一、配列でない場合は空配列を返す（データ破損対策）
    return Array.isArray(cards) ? cards : [];
  } catch (error) {
    // JSON.parse() が失敗した場合（データが壊れている場合）
    // またはlocalStorageへのアクセスに失敗した場合
    console.error('localStorageからのデータ読み込みに失敗しました:', error);
    return [];
  }
}

/**
 * カンバンデータをlocalStorageに保存する
 *
 * 実装の考え方:
 * 1. JSON.stringify() でオブジェクトをJSON文字列に変換
 * 2. localStorage.setItem() で保存
 *
 * @param {Array} cards - カードオブジェクトの配列
 *
 * 注意:
 * - この関数は例外を投げる可能性がある（localStorage容量制限超過時など）
 * - 呼び出し側でtry-catchでエラーハンドリングを行うこと（Task 4以降で実装）
 *
 * 使用例:
 * try {
 *   saveToStorage(cardsData);
 *   console.log('保存成功');
 * } catch (error) {
 *   console.error('保存失敗:', error);
 * }
 */
function saveToStorage(cards) {
  // カードデータの配列をJSON文字列に変換
  const jsonString = JSON.stringify(cards);

  // localStorageに保存
  // 容量制限超過時は QuotaExceededError が発生する（呼び出し側でハンドリング）
  localStorage.setItem(STORAGE_KEY, jsonString);
}
