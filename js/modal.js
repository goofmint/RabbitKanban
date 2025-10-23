// modal.js - モーダル管理を担当
// このファイルはカード追加・編集用のモーダルを管理する

/**
 * Bootstrap Modalインスタンス
 * initializeModal()で初期化される
 * show()やhide()メソッドでモーダルの表示・非表示を制御
 */
let modalInstance = null;

/**
 * モーダルの現在のモード（\"add\" | \"edit\"）
 * openAddModal()で\"add\"、openEditModal()で\"edit\"に設定される（Task 5で実装）
 * handleModalSubmit()でモードに応じた処理を分岐する
 */
let currentMode = 'add';

/**
 * 編集中のカードID（editモードの場合のみ）
 * openEditModal()で設定される（Task 5で実装）
 * handleEditCard()でこのIDを使用してカードを更新する
 */
let currentCardId = null;

/**
 * 追加先のカラムID（addモードの場合のみ）
 * openAddModal()で設定される
 * handleAddCard()でこのIDを使用してカードを追加する
 */
let currentColumnId = null;

/**
 * Bootstrap Modalを初期化する
 * アプリケーション起動時に1度だけ呼ばれる
 *
 * 実装フロー:
 * 1. モーダル要素を取得
 * 2. new bootstrap.Modal()でModalインスタンスを作成
 * 3. modalInstanceに代入
 * 4. モーダルが閉じられた時のイベントリスナーを設定（'hidden.bs.modal'）
 *
 * 使用例:
 * initializeModal();
 * // modalInstanceが作成される
 *
 * 注意:
 * - Bootstrap 5のModalコンポーネントをJavaScript APIで操作
 * - hidden.bs.modalイベントでフォームをリセット（クリーンアップ）
 */
function initializeModal() {
  // 1. モーダル要素を取得
  // querySelector()で#cardModal要素を取得
  const modalElement = document.querySelector('#cardModal');

  // モーダル要素が見つからない場合はエラーを出して処理を中断
  if (!modalElement) {
    console.error('モーダル要素が見つかりません');
    return;
  }

  // 2. new bootstrap.Modal()でModalインスタンスを作成
  // Bootstrap 5のJavaScript APIを使用
  modalInstance = new bootstrap.Modal(modalElement);

  // 4. モーダルが閉じられた時のイベントリスナーを設定
  // 'hidden.bs.modal': モーダルが完全に閉じられた後に発火するイベント
  modalElement.addEventListener('hidden.bs.modal', () => {
    // フォームをリセット
    // querySelector()でフォーム要素を取得してreset()を呼び出す
    const form = document.querySelector('#cardForm');
    if (form) {
      // reset()メソッドでフォームの入力内容をクリア
      form.reset();
    }

    // モード変数をリセット（念のため）
    // currentMode = 'add';
    // currentCardId = null;
    // currentColumnId = null;
    // ※ これらはopenAddModal()やopenEditModal()で設定されるため、
    //    ここでリセットする必要はない（次回開く時に必ず設定される）
  });
}

/**
 * カード追加モードでモーダルを開く
 *
 * @param {string} columnId - 追加先のカラムID
 *
 * 実装フロー:
 * 1. currentMode = 'add' に設定
 * 2. currentColumnId = columnId に設定
 * 3. currentCardId = null に設定（addモードではカードIDは不要）
 * 4. モーダルのタイトルを設定
 * 5. テキストエリアをクリア
 * 6. modalInstance.show() でモーダルを表示
 * 7. テキストエリアにフォーカス
 *
 * 使用例:
 * openAddModal('todo');
 * // モーダルが「カード追加」モードで開く
 *
 * 注意:
 * - 「＋追加」ボタンクリック時にevent-handler.jsから呼ばれる
 * - カラムIDを保持することで、どのカラムに追加するかを判定
 */
function openAddModal(columnId) {
  // 1. currentMode = 'add' に設定
  // handleModalSubmit()でこのモードを参照してaddCard()を呼び出す
  currentMode = 'add';

  // 2. currentColumnId = columnId に設定
  // handleAddCard()でこのIDを使用してカードを追加する
  currentColumnId = columnId;

  // 3. currentCardId = null に設定（addモードではカードIDは不要）
  // editモードの場合のみカードIDが必要（Task 5で実装）
  currentCardId = null;

  // 4. モーダルのタイトルを設定
  // querySelector()でモーダルのタイトル要素を取得してtextContentを設定
  const modalTitle = document.querySelector('#cardModalLabel');
  if (modalTitle) {
    modalTitle.textContent = 'カード追加';
  }

  // 5. テキストエリアをクリア
  // querySelector()でテキストエリアを取得してvalueを空文字に設定
  const textarea = document.querySelector('#cardInput');
  if (textarea) {
    textarea.value = '';
  }

  // 6. modalInstance.show() でモーダルを表示
  // Bootstrap ModalのJavaScript APIを使用
  modalInstance.show();

  // 7. テキストエリアにフォーカス
  // モーダルが表示された後にフォーカスを設定するため、setTimeout()を使用
  // Bootstrap Modalのアニメーションが完了してからフォーカスを設定
  setTimeout(() => {
    if (textarea) {
      // focus()メソッドでテキストエリアにフォーカス
      textarea.focus();
    }
  }, 200); // 200ミリ秒後にフォーカス（モーダルのアニメーションが完了するまで待つ）
}

/**
 * モーダルを閉じる
 *
 * 実装の考え方:
 * - modalInstance.hide() を呼び出すだけ
 * - フォームリセットは hidden.bs.modal イベントで行われる（initializeModal()で設定済み）
 *
 * 使用例:
 * closeModal();
 * // モーダルが閉じる
 *
 * 注意:
 * - カード保存後やキャンセル時に呼ばれる
 * - hidden.bs.modalイベントでフォームがリセットされる
 */
function closeModal() {
  // modalInstance.hide() でモーダルを非表示
  // Bootstrap ModalのJavaScript APIを使用
  modalInstance.hide();

  // フォームリセットは hidden.bs.modal イベントで行われる
  // （initializeModal()で設定済み）
}

/**
 * モーダルの入力内容を取得する
 *
 * @returns {string} 入力されたカードの内容
 *
 * 実装の考え方:
 * - テキストエリアの値をそのまま返す
 * - trim()は呼び出し側で行う（ここでは生の入力値を返す）
 *
 * 使用例:
 * const content = getModalInput();
 * console.log(content); // 'タスクの内容'
 *
 * 注意:
 * - イベントハンドラーから入力値にアクセスできるようにする
 * - trim()は呼び出し側（event-handler.js）で行う
 */
function getModalInput() {
  // querySelector()でテキストエリアを取得
  const textarea = document.querySelector('#cardInput');

  // テキストエリアが見つからない場合は空文字を返す
  if (!textarea) {
    console.error('テキストエリアが見つかりません');
    return '';
  }

  // テキストエリアの値をそのまま返す
  // trim()は呼び出し側で行う（ここでは生の入力値を返す）
  return textarea.value;
}

/**
 * モーダルの現在のモードを取得する
 *
 * @returns {string} モード（\"add\" | \"edit\"）
 *
 * 実装の考え方:
 * - モジュールスコープの変数にアクセスするゲッター関数
 * - イベントハンドラーから現在の状態を参照できるようにする
 *
 * 使用例:
 * const mode = getModalMode();
 * if (mode === 'add') {
 *   // カード追加処理
 * } else if (mode === 'edit') {
 *   // カード編集処理（Task 5で実装）
 * }
 *
 * 注意:
 * - handleModalSubmit()でモードに応じた処理を分岐
 */
function getModalMode() {
  // currentMode を返す
  return currentMode;
}

/**
 * 追加先のカラムIDを取得する（addモードの場合のみ）
 *
 * @returns {string|null} カラムID
 *
 * 実装の考え方:
 * - モジュールスコープの変数にアクセスするゲッター関数
 * - handleAddCard()でこのIDを使用してカードを追加する
 *
 * 使用例:
 * const columnId = getCurrentColumnId();
 * addCard(content, columnId);
 *
 * 注意:
 * - addモードの場合のみ使用される
 * - editモードの場合はnullが返る
 */
function getCurrentColumnId() {
  // currentColumnId を返す
  return currentColumnId;
}

/**
 * 編集中のカードIDを取得する（editモードの場合のみ）
 *
 * @returns {string|null} カードID
 *
 * 実装の考え方:
 * - モジュールスコープの変数にアクセスするゲッター関数
 * - handleEditCard()でこのIDを使用してカードを更新する（Task 5で実装）
 *
 * 使用例:
 * const cardId = getCurrentCardId();
 * updateCard(cardId, newContent);
 *
 * 注意:
 * - editモードの場合のみ使用される（Task 5で実装）
 * - addモードの場合はnullが返る
 */
function getCurrentCardId() {
  // currentCardId を返す
  return currentCardId;
}
