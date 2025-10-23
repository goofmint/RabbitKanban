// drag-handler.js - ドラッグ&ドロップ処理を担当
// このファイルはカードのドラッグ&ドロップ機能に関するイベントハンドラーを提供する

/**
 * ドラッグ開始時の処理
 * カードIDをdataTransferに設定し、視覚的フィードバックを追加する
 *
 * @param {DragEvent} event - ドラッグイベントオブジェクト
 *
 * 実装フロー:
 * 1. イベントターゲットから最も近い.kanban-card要素を取得
 * 2. カード要素が見つからない場合は早期リターン
 * 3. カード要素からdata-card-id属性を取得してカードIDを取得
 * 4. event.dataTransfer.effectAllowed = 'move'を設定
 * 5. event.dataTransfer.setData('text/plain', cardId)でカードIDを転送データに設定
 * 6. カード要素に.draggingクラスを追加（視覚的フィードバック用）
 *
 * 使用例:
 * columnElement.addEventListener('dragstart', handleDragStart);
 *
 * 注意:
 * - イベントデリゲーションで使用（カラム要素にリスナーを設定）
 * - カード要素は動的に追加・削除されるため、直接リスナーを設定しない
 * - dataTransfer.effectAllowed = 'move'で移動操作であることを明示
 */
function handleDragStart(event) {
  // 1. イベントターゲットから最も近い.kanban-card要素を取得
  // closest()メソッドで最も近い親要素を取得
  // カード要素内のボタンやテキストがドラッグされた場合も、親のカード要素を取得できる
  const cardElement = event.target.closest('.kanban-card');

  // 2. カード要素が見つからない場合は早期リターン
  // ドラッグ開始がカード要素以外から発生した場合、処理を中断
  if (!cardElement) {
    return;
  }

  // 3. カード要素からdata-card-id属性を取得してカードIDを取得
  // dataset.cardId で data-card-id 属性の値を取得
  // 例: <div class="kanban-card" data-card-id="card-123-abc"> → cardId = "card-123-abc"
  const cardId = cardElement.dataset.cardId;

  // カードIDが取得できない場合は処理を中断
  // これはプログラミングエラー（HTMLとJSの不整合）なので、早期に検出する
  if (!cardId) {
    console.error('カードIDが取得できません');
    return;
  }

  // 4. event.dataTransfer.effectAllowed = 'move'を設定
  // ドラッグ操作の種類を指定（move: 移動、copy: コピー、link: リンク）
  // ここではカードの移動なので'move'を指定
  event.dataTransfer.effectAllowed = 'move';

  // 5. event.dataTransfer.setData('text/plain', cardId)でカードIDを転送データに設定
  // ドロップ時にこのデータを取得してカードを移動する
  // 'text/plain'はデータ形式（プレーンテキスト）
  event.dataTransfer.setData('text/plain', cardId);

  // 6. カード要素に.draggingクラスを追加（視覚的フィードバック用）
  // CSSで.draggingクラスに対してスタイルを設定することで、ドラッグ中の視覚的フィードバックを提供
  // 例: opacity: 0.5; で半透明にする
  cardElement.classList.add('dragging');
}

/**
 * ドラッグオーバー時の処理
 * ドロップを許可し、視覚的フィードバックを追加する
 *
 * @param {DragEvent} event - ドラッグオーバーイベントオブジェクト
 *
 * 実装フロー:
 * 1. event.preventDefault()を呼び出してデフォルトの動作をキャンセル（ドロップを許可）
 * 2. event.dataTransfer.dropEffect = 'move'を設定
 * 3. イベントターゲットから最も近い.kanban-column要素を取得
 * 4. カラム要素が見つかった場合、.drag-overクラスを追加（視覚的フィードバック用）
 *
 * 使用例:
 * columnElement.addEventListener('dragover', handleDragOver);
 *
 * 注意:
 * - preventDefault()を呼ばないとドロップイベントが発生しない
 * - このイベントは頻繁に発生する（マウスが移動するたびに）
 * - パフォーマンスを考慮して、重い処理は避ける
 */
function handleDragOver(event) {
  // 1. event.preventDefault()を呼び出してデフォルトの動作をキャンセル（ドロップを許可）
  // デフォルトではドロップが禁止されているため、preventDefault()を呼んでドロップを許可する
  event.preventDefault();

  // 2. event.dataTransfer.dropEffect = 'move'を設定
  // ドロップ時の操作を指定（move: 移動、copy: コピー、link: リンク）
  // カーソルの形状が変わる（移動カーソルになる）
  event.dataTransfer.dropEffect = 'move';

  // 3. イベントターゲットから最も近い.kanban-column要素を取得
  // closest()メソッドで最も近い親要素を取得
  // カラム要素またはその子要素の上にカーソルがある場合、カラム要素を取得できる
  const columnElement = event.target.closest('.kanban-column');

  // 4. カラム要素が見つかった場合、.drag-overクラスを追加（視覚的フィードバック用）
  // CSSで.drag-overクラスに対してスタイルを設定することで、ドロップ可能な領域を視覚的に示す
  // 例: background-color: #f0f0f0; で背景色を変更
  if (columnElement) {
    columnElement.classList.add('drag-over');
  }
}

/**
 * ドラッグ終了時の処理
 * 視覚的フィードバック用のクラスをクリーンアップする
 *
 * @param {DragEvent} event - ドラッグエンドイベントオブジェクト
 *
 * 実装フロー:
 * 1. イベントターゲットから最も近い.kanban-card要素を取得
 * 2. カード要素が見つかった場合、.draggingクラスを削除
 * 3. すべての.kanban-column要素から.drag-overクラスを削除
 *
 * 使用例:
 * columnElement.addEventListener('dragend', handleDragEnd);
 *
 * 注意:
 * - ドロップ成功時と失敗時の両方で呼ばれる
 * - クリーンアップ処理なので、エラーが発生しても問題ない
 * - すべてのカラムから.drag-overクラスを削除することで、確実にクリーンアップ
 */
function handleDragEnd(event) {
  // 1. イベントターゲットから最も近い.kanban-card要素を取得
  // closest()メソッドで最も近い親要素を取得
  const cardElement = event.target.closest('.kanban-card');

  // 2. カード要素が見つかった場合、.draggingクラスを削除
  // ドラッグ終了時には、ドラッグ中の視覚的フィードバックを削除
  if (cardElement) {
    cardElement.classList.remove('dragging');
  }

  // 3. すべての.kanban-column要素から.drag-overクラスを削除
  // querySelectorAll()ですべてのカラム要素を取得
  const columns = document.querySelectorAll('.kanban-column');

  // forEach()で各カラム要素から.drag-overクラスを削除
  // これにより、ドロップ可能な領域の視覚的フィードバックをクリーンアップ
  columns.forEach(column => {
    column.classList.remove('drag-over');
  });
}

/**
 * ドロップ時の処理
 * カードを移動して画面を更新する
 *
 * @param {DragEvent} event - ドロップイベントオブジェクト
 *
 * 実装フロー:
 * 1. event.preventDefault()を呼び出してデフォルトの動作をキャンセル
 * 2. イベントターゲットから最も近い.kanban-column要素を取得
 * 3. カラム要素が見つからない場合は早期リターン
 * 4. カラム要素からdata-column-id属性を取得して移動先カラムIDを取得
 * 5. event.dataTransfer.getData('text/plain')でカードIDを取得
 * 6. カード要素とすべてのカラム要素から.draggingと.drag-overクラスを削除
 * 7. try-catchブロック内で以下を実行:
 *    - moveCard(cardId, newColumnId)を呼び出してカードを移動
 *    - renderAllCards()を呼び出して全カラムを再描画
 *    - showMessage('カードを移動しました', 'success')で成功メッセージを表示
 * 8. エラーが発生した場合:
 *    - showMessage(error.message, 'danger')でエラーメッセージを表示
 *
 * 使用例:
 * columnElement.addEventListener('drop', handleDrop);
 *
 * 注意:
 * - preventDefault()を呼ばないとブラウザのデフォルト動作が実行される
 * - クリーンアップ処理（クラス削除）をtry-catchの外で行うことで、エラー時も確実に実行
 * - renderAllCards()で全カラムを再描画することで、カードの移動を即座に反映
 */
function handleDrop(event) {
  // 1. event.preventDefault()を呼び出してデフォルトの動作をキャンセル
  // デフォルトではブラウザがドロップされたデータを開こうとするため、それを防止
  event.preventDefault();

  // 2. イベントターゲットから最も近い.kanban-column要素を取得
  // closest()メソッドで最も近い親要素を取得
  // カラム要素またはその子要素の上にドロップされた場合、カラム要素を取得できる
  const columnElement = event.target.closest('.kanban-column');

  // 3. カラム要素が見つからない場合は早期リターン
  // カラム要素以外の場所にドロップされた場合、処理を中断
  if (!columnElement) {
    return;
  }

  // 4. カラム要素からdata-column-id属性を取得して移動先カラムIDを取得
  // dataset.columnId で data-column-id 属性の値を取得
  // 例: <div class="kanban-column" data-column-id="inprogress"> → newColumnId = "inprogress"
  const newColumnId = columnElement.dataset.columnId;

  // カラムIDが取得できない場合は処理を中断
  // これはプログラミングエラー（HTMLとJSの不整合）なので、早期に検出する
  if (!newColumnId) {
    console.error('カラムIDが取得できません');
    return;
  }

  // 5. event.dataTransfer.getData('text/plain')でカードIDを取得
  // handleDragStart()で設定したカードIDを取得
  const cardId = event.dataTransfer.getData('text/plain');

  // カードIDが取得できない場合は処理を中断
  // これはドラッグ開始時にカードIDが設定されなかった場合に発生
  if (!cardId) {
    console.error('カードIDが取得できません');
    return;
  }

  // 6. カード要素とすべてのカラム要素から.draggingと.drag-overクラスを削除
  // クリーンアップ処理: ドラッグ&ドロップ終了時に視覚的フィードバックを削除

  // カード要素から.draggingクラスを削除
  // querySelectorAll()ですべてのカード要素を取得
  const cards = document.querySelectorAll('.kanban-card');
  cards.forEach(card => {
    card.classList.remove('dragging');
  });

  // すべてのカラム要素から.drag-overクラスを削除
  // querySelectorAll()ですべてのカラム要素を取得
  const columns = document.querySelectorAll('.kanban-column');
  columns.forEach(column => {
    column.classList.remove('drag-over');
  });

  // 7. try-catchブロック内でカード移動処理を実行
  try {
    // moveCard(cardId, newColumnId)を呼び出してカードを移動
    // data-manager.jsで定義されている関数を呼び出す
    // この関数内でバリデーション+保存が行われる
    // バリデーションエラーや保存エラーが発生した場合、例外が投げられる
    moveCard(cardId, newColumnId);

    // renderAllCards()を呼び出して全カラムを再描画
    // ui-renderer.jsで定義されている関数を呼び出す
    // すべてのカラムを再描画することで、カードの移動を即座に反映
    // 注: renderColumnCards()で個別のカラムのみを再描画することも可能だが、
    //     ドラッグ元とドラッグ先の両方を再描画する必要があるため、renderAllCards()を使用
    renderAllCards();

    // showMessage('カードを移動しました', 'success')で成功メッセージを表示
    // ui-renderer.jsで定義されている関数を呼び出す
    // 緑色のBootstrap alertが3秒間表示される
    showMessage('カードを移動しました', 'success');

  } catch (error) {
    // 8. エラーが発生した場合の処理

    // showMessage(error.message, 'danger')でエラーメッセージを表示
    // ui-renderer.jsで定義されている関数を呼び出す
    // 赤色のBootstrap alertが3秒間表示される
    showMessage(error.message, 'danger');
  }
}

/**
 * ドラッグ&ドロップのイベントリスナーを設定する
 * すべてのカラム要素にイベントリスナーを設定
 *
 * 実装フロー:
 * 1. すべての.kanban-column要素を取得
 * 2. 各カラム要素に以下のイベントリスナーを設定:
 *    - dragstartイベント: handleDragStartをバインド（イベントデリゲーション）
 *    - dragoverイベント: handleDragOverをバインド
 *    - dragendイベント: handleDragEndをバインド（イベントデリゲーション）
 *    - dropイベント: handleDropをバインド
 *
 * 使用例:
 * setupDragAndDropListeners();
 * // すべてのカラムにドラッグ&ドロップのイベントリスナーが設定される
 *
 * 注意:
 * - イベントデリゲーションを使用（カラム要素にリスナーを設定）
 * - カード要素は動的に追加・削除されるため、直接リスナーを設定しない
 * - dragstartとdragendは.kanban-cardから発生するイベントをキャッチ
 * - dragoverとdropは.kanban-column自体で処理
 */
function setupDragAndDropListeners() {
  // 1. すべての.kanban-column要素を取得
  // querySelectorAll()で.kanban-columnクラスを持つすべての要素を取得
  const columns = document.querySelectorAll('.kanban-column');

  // カラム要素が見つからない場合はエラーを出して処理を中断
  // これはプログラミングエラー（HTMLとJSの不整合）なので、早期に検出する
  if (columns.length === 0) {
    console.error('カラム要素が見つかりません');
    return;
  }

  // 2. 各カラム要素に以下のイベントリスナーを設定
  // forEach()で各カラム要素を順次処理
  columns.forEach(column => {
    // dragstartイベント: handleDragStartをバインド
    // カード要素のドラッグ開始時に発生
    // イベントデリゲーション: カラム要素にリスナーを設定し、カード要素からのイベントをキャッチ
    column.addEventListener('dragstart', handleDragStart);

    // dragoverイベント: handleDragOverをバインド
    // カード要素がカラム要素の上にある時に繰り返し発生
    // ドロップを許可するために必須
    column.addEventListener('dragover', handleDragOver);

    // dragendイベント: handleDragEndをバインド
    // カード要素のドラッグ終了時に発生（ドロップ成功時と失敗時の両方）
    // イベントデリゲーション: カラム要素にリスナーを設定し、カード要素からのイベントをキャッチ
    column.addEventListener('dragend', handleDragEnd);

    // dropイベント: handleDropをバインド
    // カード要素がカラム要素にドロップされた時に発生
    // カードの移動処理を実行
    column.addEventListener('drop', handleDrop);
  });
}
