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
 * addモードとeditモードの両方に対応
 *
 * 実装フロー:
 * 1. getModalInput() で入力内容を取得
 * 2. getModalMode() でモードを取得
 * 3. モードが'add'の場合、handleAddCard(content)を呼び出す
 * 4. モードが'edit'の場合、handleEditCard(content)を呼び出す
 *
 * 使用例:
 * handleModalSubmit();
 * // モーダルの内容に応じてカードを追加または編集
 *
 * 注意:
 * - モードに応じて処理を分岐
 * - addモード: 新規カード追加（Task 4で実装済み）
 * - editモード: 既存カード編集（Task 5で実装）
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
    // 4. モードが'edit'の場合、handleEditCard(content)を呼び出す
    // カード編集処理を実行（Task 5で実装）
    handleEditCard(content);
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
 * カード編集処理を実行する
 * try-catchでエラーハンドリングを行い、成功/失敗メッセージを表示する
 *
 * @param {string} newContent - 編集後のカード内容
 *
 * 実装フロー:
 * 1. getCurrentCardId()で編集対象のカードIDを取得
 * 2. カードIDがnullの場合、エラーメッセージを表示して早期リターン
 * 3. try-catch でエラーハンドリング
 * 4. try内:
 *    - updateCard(cardId, newContent)を呼び出してカードを更新し、更新されたカードオブジェクトを取得
 *    - 更新されたカードのcolumnIdを使用してrenderColumnCards(columnId)でカラムを再描画
 *    - closeModal()でモーダルを閉じる
 *    - showMessage('カードを更新しました', 'success')で成功メッセージ表示
 * 5. catch内:
 *    - showMessage(error.message, 'danger')でエラーメッセージ表示
 *    - モーダルは開いたまま（ユーザーが修正できるように）
 *
 * 使用例:
 * handleEditCard('更新後のタスク');
 * // カードが更新され、画面に反映される
 *
 * エラー例:
 * - カードIDがnull: 「カードが選択されていません」
 * - バリデーションエラー: 「カードの内容を入力してください」
 * - 保存エラー: localStorage容量超過等
 *
 * 注意:
 * - データ層（updateCard()）とUI層を接続
 * - 成功時はモーダルを閉じて成功メッセージ表示
 * - エラー時はモーダルを開いたままエラーメッセージ表示
 * - updateCard()が更新されたカードオブジェクトを返すため、getAllCards()で再検索不要
 * - これにより、効率的なカード再描画が可能
 */
function handleEditCard(newContent) {
  // 1. getCurrentCardId()で編集対象のカードIDを取得
  // modal.jsで定義されている関数を呼び出す
  const cardId = getCurrentCardId();

  // 2. カードIDがnullの場合、エラーメッセージを表示して早期リターン
  // editモードではないか、カードIDが設定されていない場合に発生
  // この状態でupdateCard()を呼ぶとnullが渡されてしまうため、早期にチェック
  if (!cardId) {
    // エラーメッセージを表示
    // ui-renderer.jsで定義されている関数を呼び出す
    showMessage('カードが選択されていません', 'danger');
    // 処理を中断
    return;
  }

  // 3. try-catch でエラーハンドリング
  try {
    // 4. try内: カード編集処理

    // updateCard(cardId, newContent)を呼び出してカードを更新し、更新されたカードオブジェクトを取得
    // data-manager.jsで定義されている関数を呼び出す
    // この関数内でバリデーション+保存が行われる
    // バリデーションエラーや保存エラーが発生した場合、例外が投げられる
    // 更新されたカードオブジェクト（columnIdを含む）が返される
    const updatedCard = updateCard(cardId, newContent);

    // 更新されたカードのcolumnIdを使用してrenderColumnCards(columnId)でカラムを再描画
    // ui-renderer.jsで定義されている関数を呼び出す
    // 更新されたカードが画面に即座に反映される
    // updatedCard.columnIdを使用することで、getAllCards()で再検索する必要がない（効率的）
    renderColumnCards(updatedCard.columnId);

    // closeModal()でモーダルを閉じる
    // modal.jsで定義されている関数を呼び出す
    closeModal();

    // showMessage('カードを更新しました', 'success')で成功メッセージ表示
    // ui-renderer.jsで定義されている関数を呼び出す
    // 緑色のBootstrap alertが3秒間表示される
    showMessage('カードを更新しました', 'success');

  } catch (error) {
    // 5. catch内: エラー処理

    // showMessage(error.message, 'danger')でエラーメッセージ表示
    // ui-renderer.jsで定義されている関数を呼び出す
    // 赤色のBootstrap alertが3秒間表示される
    showMessage(error.message, 'danger');

    // モーダルは開いたまま（ユーザーが修正できるように）
    // closeModal()は呼ばない
  }
}

/**
 * カード削除処理を実行する
 * 確認ダイアログを表示し、OKの場合のみカードを削除する
 *
 * @param {string} cardId - 削除対象のカードID
 *
 * 実装フロー:
 * 1. window.confirm()で確認ダイアログを表示
 * 2. ユーザーがキャンセルした場合は処理を終了（早期リターン）
 * 3. try-catch でエラーハンドリング
 * 4. try内:
 *    - deleteCard(cardId)を呼び出してカードを削除し、削除されたカードオブジェクトを取得
 *    - 削除されたカードのcolumnIdを使用してrenderColumnCards(columnId)でカラムを再描画
 *    - showMessage('カードを削除しました', 'success')で成功メッセージ表示
 * 5. catch内:
 *    - showMessage(error.message, 'danger')でエラーメッセージ表示
 *
 * 使用例:
 * handleDeleteCard('card-123-abc');
 * // 確認ダイアログが表示され、OKをクリックするとカードが削除される
 *
 * エラー例:
 * - カードが見つからない: 「カードが見つかりません」
 * - 保存エラー: localStorage容量超過等
 *
 * 注意:
 * - データ層（deleteCard()）とUI層を接続
 * - 確認ダイアログでキャンセルした場合は何もしない
 * - 成功時は成功メッセージ表示
 * - エラー時はエラーメッセージ表示
 * - deleteCard()が削除されたカードオブジェクトを返すため、getAllCards()で再検索不要
 * - これにより、効率的なカード再描画が可能
 */
function handleDeleteCard(cardId) {
  // 1. window.confirm()で確認ダイアログを表示
  // ユーザーに削除の意図を確認する
  // confirm()は、OKをクリックすると true、キャンセルをクリックすると false を返す
  const confirmed = window.confirm('このカードを削除しますか？');

  // 2. ユーザーがキャンセルした場合は処理を終了（早期リターン）
  // confirmed が false の場合、カードを削除せずに処理を終了
  if (!confirmed) {
    // 何もせずに処理を終了
    return;
  }

  // 3. try-catch でエラーハンドリング
  try {
    // 4. try内: カード削除処理

    // deleteCard(cardId)を呼び出してカードを削除し、削除されたカードオブジェクトを取得
    // data-manager.jsで定義されている関数を呼び出す
    // カードが見つからない場合やlocalStorage保存エラーが発生した場合、例外が投げられる
    // 削除されたカードオブジェクト（columnIdを含む）が返される
    const deletedCard = deleteCard(cardId);

    // 削除されたカードのcolumnIdを使用してrenderColumnCards(columnId)でカラムを再描画
    // ui-renderer.jsで定義されている関数を呼び出す
    // 削除されたカードが画面から消える
    // deletedCard.columnIdを使用することで、getAllCards()で再検索する必要がない（効率的）
    renderColumnCards(deletedCard.columnId);

    // showMessage('カードを削除しました', 'success')で成功メッセージ表示
    // ui-renderer.jsで定義されている関数を呼び出す
    // 緑色のBootstrap alertが3秒間表示される
    showMessage('カードを削除しました', 'success');

  } catch (error) {
    // 5. catch内: エラー処理

    // showMessage(error.message, 'danger')でエラーメッセージ表示
    // ui-renderer.jsで定義されている関数を呼び出す
    // 赤色のBootstrap alertが3秒間表示される
    showMessage(error.message, 'danger');
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
 * カードのアクションボタン（編集・削除）のイベントリスナーを設定する
 * イベントデリゲーションを使用して、動的に追加されるカードにも対応
 *
 * 実装フロー:
 * 1. すべてのカラムコンテナ（.card-list）を取得
 * 2. 各カラムコンテナにclickイベントリスナーを設定（イベントデリゲーション）
 * 3. クリックされた要素またはその親が編集ボタン（.edit-btn）かチェック
 * 4. 編集ボタンの場合:
 *    - カード要素（.kanban-card）を取得
 *    - data-card-id属性からカードIDを取得
 *    - openEditModal(cardId)を呼び出してモーダルを開く
 * 5. クリックされた要素またはその親が削除ボタン（.delete-btn）かチェック
 * 6. 削除ボタンの場合:
 *    - カード要素（.kanban-card）を取得
 *    - data-card-id属性からカードIDを取得
 *    - handleDeleteCard(cardId)を呼び出す
 *
 * 使用例:
 * setupCardActionListeners();
 * // すべてのカードの編集・削除ボタンにイベントリスナーが設定される
 *
 * 注意:
 * - イベントデリゲーションを使用（親要素にイベントリスナーを設定）
 * - 動的に追加されるカードにも対応できる
 * - closest()メソッドで最も近い親要素を取得
 * - 編集ボタン（Task 5）と削除ボタン（Task 6）の両方に対応
 */
function setupCardActionListeners() {
  // 1. すべてのカラムコンテナ（.card-list）を取得
  // querySelectorAll()で.card-listクラスを持つすべての要素を取得
  const columnContainers = document.querySelectorAll('.card-list');

  // 2. 各カラムコンテナにclickイベントリスナーを設定（イベントデリゲーション）
  // forEach()で各カラムコンテナを順次処理
  columnContainers.forEach(container => {
    // clickイベントリスナーを設定
    // イベントデリゲーション: 親要素にイベントリスナーを設定し、子要素のクリックをキャッチ
    container.addEventListener('click', (event) => {
      // クリックされた要素を取得
      const target = event.target;

      // 3. クリックされた要素またはその親が編集ボタン（.edit-btn）かチェック
      // closest()メソッドで最も近い親要素を取得
      // ボタン内のアイコンがクリックされた場合も、closest()で親のボタン要素を取得できる
      const editButton = target.closest('.edit-btn');

      // 4. 編集ボタンの場合の処理
      if (editButton) {
        // カード要素（.kanban-card）を取得
        // closest()メソッドで最も近い親の.kanban-card要素を取得
        const cardElement = editButton.closest('.kanban-card');

        // カード要素が見つからない場合は処理を中断
        if (!cardElement) {
          console.error('カード要素が見つかりません');
          return;
        }

        // data-card-id属性からカードIDを取得
        // dataset.cardId で data-card-id 属性の値を取得
        const cardId = cardElement.dataset.cardId;

        // カードIDが取得できない場合は処理を中断
        if (!cardId) {
          console.error('カードIDが取得できません');
          return;
        }

        // openEditModal(cardId)を呼び出してモーダルを開く
        // modal.jsで定義されている関数を呼び出す
        openEditModal(cardId);

        // 処理を終了（他のイベントハンドラーに伝播しない）
        return;
      }

      // 5. クリックされた要素またはその親が削除ボタン（.delete-btn）かチェック
      // closest()メソッドで最も近い親要素を取得
      // ボタン内のアイコンがクリックされた場合も、closest()で親のボタン要素を取得できる
      const deleteButton = target.closest('.delete-btn');

      // 6. 削除ボタンの場合の処理
      if (deleteButton) {
        // カード要素（.kanban-card）を取得
        // closest()メソッドで最も近い親の.kanban-card要素を取得
        const cardElement = deleteButton.closest('.kanban-card');

        // カード要素が見つからない場合は処理を中断
        if (!cardElement) {
          console.error('カード要素が見つかりません');
          return;
        }

        // data-card-id属性からカードIDを取得
        // dataset.cardId で data-card-id 属性の値を取得
        const cardId = cardElement.dataset.cardId;

        // カードIDが取得できない場合は処理を中断
        if (!cardId) {
          console.error('カードIDが取得できません');
          return;
        }

        // handleDeleteCard(cardId)を呼び出す
        // 確認ダイアログを表示し、OKの場合のみカードを削除する
        handleDeleteCard(cardId);

        // 処理を終了（他のイベントハンドラーに伝播しない）
        return;
      }
    });
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
 * - setupDragAndDropListeners()は今後のタスクで追加
 */
function setupEventListeners() {
  // 以下の関数を順次呼び出す:

  // 「＋追加」ボタンのイベントリスナー設定
  setupAddCardListeners();

  // モーダルのフォーム送信イベントリスナー設定
  setupModalFormListener();

  // モーダルのキャンセルボタンイベントリスナー設定
  setupModalCancelListener();

  // カードのアクションボタン（編集・削除）のイベントリスナー設定（Task 5で実装）
  setupCardActionListeners();

  // 注: 以下のイベントリスナーは今後のタスクで追加
  // - setupDragAndDropListeners() (Task 7で実装: D&D)
}
