// event-handler.js - イベント処理を担当
// このファイルはユーザーの操作（ボタンクリック、フォーム送信等）に対するイベントハンドラーを提供する

/**
 * 「＋追加」ボタンのクリックイベントリスナーを設定する
 * すべての「＋追加」ボタンに対して、クリック時にモーダルを開く処理を設定
 *
 * 実装フロー:
 * 1. すべての「＋追加」ボタンを取得
 * 2. 各ボタンにクリックイベントリスナーを設定
 * 3. ボタンのdata-column-id属性からカラムIDを取得
 * 4. openAddModal(columnId) を呼び出してモーダルを開く
 *
 * 使用例:
 * setupAddCardListeners();
 * // すべての「＋追加」ボタンにイベントリスナーが設定される
 *
 * 注意:
 * - この関数はアプリ初期化時（app.js）に1度だけ呼ばれる
 * - 各ボタンに個別のイベントリスナーを設定
 */
function setupAddCardListeners() {
  // 1. すべての「＋追加」ボタンを取得
  // querySelectorAll()で.add-card-btnクラスを持つすべてのボタンを取得
  const addButtons = document.querySelectorAll('.add-card-btn');

  // 2. 各ボタンにクリックイベントリスナーを設定
  // forEach()で各ボタンを順次処理
  addButtons.forEach(button => {
    // clickイベントリスナーを設定
    button.addEventListener('click', () => {
      // 3. ボタンのdata-column-id属性からカラムIDを取得
      // dataset.columnId で data-column-id 属性の値を取得
      // 例: <button data-column-id="todo"> → columnId = "todo"
      const columnId = button.dataset.columnId;

      // 4. openAddModal(columnId) を呼び出してモーダルを開く
      // modal.jsで定義されている関数を呼び出す
      openAddModal(columnId);
    });
  });
}

/**
 * モーダルのフォーム送信イベントリスナーを設定する
 * フォーム送信時にデフォルトのページリロードを防止し、handleModalSubmit()を呼び出す
 *
 * 実装フロー:
 * 1. フォーム要素を取得
 * 2. submitイベントリスナーを設定
 * 3. event.preventDefault() でデフォルトのフォーム送信を防止
 * 4. handleModalSubmit() を呼び出す
 *
 * 使用例:
 * setupModalFormListener();
 * // フォーム送信時にhandleModalSubmit()が呼ばれる
 *
 * 注意:
 * - preventDefault()でページリロードを防止
 * - フォーム送信の実際の処理はhandleModalSubmit()に委譲
 */
function setupModalFormListener() {
  // 1. フォーム要素を取得
  // querySelector()で#cardForm要素を取得
  const form = document.querySelector('#cardForm');

  // フォーム要素が見つからない場合はエラーを出して処理を中断
  if (!form) {
    console.error('フォーム要素が見つかりません');
    return;
  }

  // 2. submitイベントリスナーを設定
  form.addEventListener('submit', (event) => {
    // 3. event.preventDefault() でデフォルトのフォーム送信を防止
    // これにより、ページリロードが発生しない
    event.preventDefault();

    // 4. handleModalSubmit() を呼び出す
    // モーダルのフォーム送信を処理する
    handleModalSubmit();
  });
}

/**
 * モーダルのフォーム送信を処理する
 * 現時点ではaddモードのみ対応（editモードはTask 5で実装）
 *
 * 実装フロー:
 * 1. getModalInput() で入力内容を取得
 * 2. getModalMode() でモードを取得
 * 3. モードが'add'の場合、handleAddCard(content)を呼び出す
 * 4. モードが'edit'の場合、何もしない（Task 5で実装）
 *
 * 使用例:
 * handleModalSubmit();
 * // モーダルの内容に応じてカードを追加
 *
 * 注意:
 * - モードに応じて処理を分岐
 * - editモードはTask 5で実装するため、現時点では何もしない
 */
function handleModalSubmit() {
  // 1. getModalInput() で入力内容を取得
  // modal.jsで定義されている関数を呼び出す
  const content = getModalInput();

  // 2. getModalMode() でモードを取得
  // modal.jsで定義されている関数を呼び出す
  const mode = getModalMode();

  // 3. モードが'add'の場合、handleAddCard(content)を呼び出す
  if (mode === 'add') {
    // カード追加処理を実行
    handleAddCard(content);
  } else if (mode === 'edit') {
    // 4. モードが'edit'の場合、何もしない（Task 5で実装）
    // Task 5でhandleEditCard(content)を呼び出す
    // handleEditCard(content);
  }
}

/**
 * カード追加処理を実行する
 * try-catchでエラーハンドリングを行い、成功/失敗メッセージを表示する
 *
 * @param {string} content - カードの内容
 *
 * 実装フロー:
 * 1. try-catch でエラーハンドリング
 * 2. try内:
 *    - getCurrentColumnId() でカラムIDを取得
 *    - addCard(content, columnId) を呼び出し（データ層でバリデーション+保存）
 *    - renderColumnCards(columnId) でカラムを再描画
 *    - closeModal() でモーダルを閉じる
 *    - showMessage('カードを追加しました', 'success') で成功メッセージ表示
 * 3. catch内:
 *    - showMessage(error.message, 'danger') でエラーメッセージ表示
 *    - モーダルは開いたまま（ユーザーが修正できるように）
 *
 * 使用例:
 * handleAddCard('新しいタスク');
 * // カードが追加され、画面に表示される
 *
 * エラー例:
 * - バリデーションエラー: 「カードの内容を入力してください」
 * - 保存エラー: localStorage容量超過等
 *
 * 注意:
 * - データ層（addCard()）とUI層を接続
 * - 成功時はモーダルを閉じて成功メッセージ表示
 * - エラー時はモーダルを開いたままエラーメッセージ表示
 */
function handleAddCard(content) {
  // 1. try-catch でエラーハンドリング
  try {
    // 2. try内: カード追加処理

    // getCurrentColumnId() でカラムIDを取得
    // modal.jsで定義されている関数を呼び出す
    const columnId = getCurrentColumnId();

    // addCard(content, columnId) を呼び出し
    // data-manager.jsで定義されている関数を呼び出す
    // この関数内でバリデーション+保存が行われる
    // バリデーションエラーや保存エラーが発生した場合、例外が投げられる
    addCard(content, columnId);

    // renderColumnCards(columnId) でカラムを再描画
    // ui-renderer.jsで定義されている関数を呼び出す
    // 追加したカードが画面に表示される
    renderColumnCards(columnId);

    // closeModal() でモーダルを閉じる
    // modal.jsで定義されている関数を呼び出す
    closeModal();

    // showMessage('カードを追加しました', 'success') で成功メッセージ表示
    // ui-renderer.jsで定義されている関数を呼び出す
    // 緑色のBootstrap alertが3秒間表示される
    showMessage('カードを追加しました', 'success');

  } catch (error) {
    // 3. catch内: エラー処理

    // showMessage(error.message, 'danger') でエラーメッセージ表示
    // ui-renderer.jsで定義されている関数を呼び出す
    // 赤色のBootstrap alertが3秒間表示される
    showMessage(error.message, 'danger');

    // モーダルは開いたまま（ユーザーが修正できるように）
    // closeModal()は呼ばない
  }
}

/**
 * モーダルのキャンセルボタンのクリックイベントリスナーを設定する
 * キャンセルボタンクリック時にモーダルを閉じる
 *
 * 実装フロー:
 * 1. キャンセルボタンを取得
 * 2. クリックイベントリスナーを設定
 * 3. closeModal() を呼び出してモーダルを閉じる
 *
 * 使用例:
 * setupModalCancelListener();
 * // キャンセルボタンクリック時にモーダルが閉じる
 *
 * 注意:
 * - Bootstrapの data-bs-dismiss="modal" でも閉じられるが、明示的に設定
 * - ユーザーがカード追加をキャンセルできるようにする
 */
function setupModalCancelListener() {
  // 1. キャンセルボタンを取得
  // querySelector()でdata-bs-dismiss="modal"属性を持つボタンを取得
  // 複数ある場合は最初の要素を取得（モーダル内のキャンセルボタン）
  const cancelButton = document.querySelector('#cardModal [data-bs-dismiss="modal"]');

  // キャンセルボタンが見つからない場合はエラーを出して処理を中断
  if (!cancelButton) {
    console.error('キャンセルボタンが見つかりません');
    return;
  }

  // 2. クリックイベントリスナーを設定
  cancelButton.addEventListener('click', () => {
    // 3. closeModal() を呼び出してモーダルを閉じる
    // modal.jsで定義されている関数を呼び出す
    // ※ data-bs-dismiss="modal" でも閉じられるが、明示的に呼び出す
    closeModal();
  });
}

/**
 * すべてのイベントリスナーを設定する
 * アプリケーション起動時に1度だけ呼ばれる
 *
 * 実装の考え方:
 * - すべてのイベントリスナー設定関数を一箇所にまとめる
 * - アプリ初期化時に1度だけ呼ばれる
 * - イベントリスナーの設定を一元管理
 *
 * 使用例:
 * setupEventListeners();
 * // すべてのイベントリスナーが設定される
 *
 * 注意:
 * - app.jsからシンプルに呼び出せるようにする
 * - setupCardActionListeners(), setupDragAndDropListeners() は今後のタスクで追加
 */
function setupEventListeners() {
  // 以下の関数を順次呼び出す:

  // 「＋追加」ボタンのイベントリスナー設定
  setupAddCardListeners();

  // モーダルのフォーム送信イベントリスナー設定
  setupModalFormListener();

  // モーダルのキャンセルボタンイベントリスナー設定
  setupModalCancelListener();

  // 注: 以下のイベントリスナーは今後のタスクで追加
  // - setupCardActionListeners() (Task 5, 6で実装: 編集・削除ボタン)
  // - setupDragAndDropListeners() (Task 7で実装: D&D)
}
