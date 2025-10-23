// ui-renderer.js - カード表示ロジックを担当
// このファイルはカードを画面に表示するためのレンダリング関数を提供する

/**
 * すべてのカラムのカードを表示する
 * 各カラムに対してrenderColumnCards()を呼び出す
 * アプリ初期化時とデータ変更時（D&D移動時）に呼ばれる
 *
 * 実装の考え方:
 * - COLUMNS配列をループして、各カラムIDでrenderColumnCards()を呼び出す
 * - これにより、すべてのカラムを一括で再描画できる
 *
 * 使用例:
 * renderAllCards();
 * // すべてのカラムにカードが表示される
 *
 * 注意:
 * - この関数はアプリ初期化時（app.js）とD&D移動時（Task 7で実装）に呼ばれる
 */
function renderAllCards() {
  // COLUMNS配列をループして、各カラムに対してrenderColumnCards()を呼び出す
  // forEach()で各カラムを順次処理
  COLUMNS.forEach(column => {
    // column.id は \"todo\", \"inprogress\", \"done\" のいずれか
    renderColumnCards(column.id);
  });
}

/**
 * 指定されたカラムのカードを表示する
 * 既存の内容をクリアしてから、カードデータを元に再描画する
 *
 * @param {string} columnId - カラムID（\"todo\" | \"inprogress\" | \"done\"）
 *
 * 実装フロー:
 * 1. getCardsByColumn(columnId) でデータ取得
 * 2. カラムのコンテナ要素を取得
 * 3. コンテナの既存の内容をクリア
 * 4. DocumentFragmentを作成（パフォーマンス最適化）
 * 5. カードデータをループして、createCardElement()でカード要素を作成
 * 6. DocumentFragmentに追加
 * 7. コンテナにDocumentFragmentを追加（一度のDOM操作で済む）
 *
 * 使用例:
 * renderColumnCards('todo');
 * // ToDoカラムにカードが表示される
 *
 * 注意:
 * - この関数はカード追加・削除・編集後の再描画に使用される
 * - DocumentFragmentを使用することで、DOM操作を最小化してパフォーマンスを向上
 * - 既存の内容をクリアするため、idempotent（何度呼んでも同じ結果）
 */
function renderColumnCards(columnId) {
  // 1. getCardsByColumn(columnId) でデータ取得
  // このカラムに属するカードのみを取得（filter済み）
  const cards = getCardsByColumn(columnId);

  // 2. カラムのコンテナ要素を取得
  // querySelector()で data-column-id 属性が一致する .card-list 要素を取得
  // HTMLの構造: <div class="card-body card-list" data-column-id="todo">
  const container = document.querySelector(`.card-list[data-column-id="${columnId}"]`);

  // 3. コンテナが見つからない場合はエラーを出して処理を中断
  // これはプログラミングエラー（HTMLとJSの不整合）なので、早期に検出する
  if (!container) {
    console.error(`カラム "${columnId}" のコンテナが見つかりません`);
    return;
  }

  // 4. コンテナの既存の内容をクリア
  // innerHTML = '' で既存のカード要素をすべて削除
  // これにより、古いカードと新しいカードが混在しない
  container.innerHTML = '';

  // 5. DocumentFragmentを作成（パフォーマンス最適化）
  // DocumentFragment: メモリ上に一時的なDOMツリーを作成
  // 複数の要素を一度にDOMに追加できるため、パフォーマンスが向上
  const fragment = document.createDocumentFragment();

  // 6. カードデータをループして、createCardElement()でカード要素を作成
  // forEach()で各カードを順次処理
  cards.forEach(card => {
    // createCardElement()でカードのHTML要素を作成
    const cardElement = createCardElement(card);

    // DocumentFragmentに追加（まだDOMには追加されない）
    fragment.appendChild(cardElement);
  });

  // 7. コンテナにDocumentFragmentを追加（一度のDOM操作で済む）
  // appendChild()で一度にすべてのカードをDOMに追加
  // これにより、リフロー（再描画）が1回で済む
  container.appendChild(fragment);
}

/**
 * カードオブジェクトからカードのDOM要素を作成する
 * テンプレート要素をクローンして、カードの内容とIDを設定する
 *
 * @param {Object} card - カードオブジェクト
 * @param {string} card.id - カードID
 * @param {string} card.content - カードの内容
 * @param {string} card.columnId - カラムID
 * @returns {HTMLElement} カード要素
 *
 * 実装フロー:
 * 1. テンプレート要素を取得
 * 2. テンプレートの内容をクローン
 * 3. クローンからカード要素を取得
 * 4. カード内容を設定（textContentでXSS対策）
 * 5. data属性でカードIDを設定
 * 6. draggable属性を設定（Task 7で使用）
 * 7. カード要素を返す
 *
 * 使用例:
 * const card = { id: 'card-123', content: 'タスク', columnId: 'todo' };
 * const cardElement = createCardElement(card);
 * document.querySelector('.card-list').appendChild(cardElement);
 *
 * 注意:
 * - textContentを使用することで、HTMLタグが自動的にエスケープされる（XSS対策）
 * - 例: `<script>alert('XSS')</script>` → そのまま文字列として表示
 */
function createCardElement(card) {
  // 1. テンプレート要素を取得
  // querySelector()で#card-template要素を取得
  const template = document.querySelector('#card-template');

  // 2. テンプレートの内容をクローン
  // template.content.cloneNode(true) で深いクローンを作成
  // true: 子要素も含めてクローン
  const clone = template.content.cloneNode(true);

  // 3. クローンからカード要素を取得
  // querySelector()で.kanban-card要素を取得
  // これが実際のカード要素（div.card.kanban-card）
  const cardElement = clone.querySelector('.kanban-card');

  // 4. カード内容を設定（textContentでXSS対策）
  // querySelector()で.card-content要素を取得してtextContentを設定
  // textContent: HTMLタグをエスケープするため、XSS対策になる
  cardElement.querySelector('.card-content').textContent = card.content;

  // 5. data属性でカードIDを設定
  // dataset.cardId でdata-card-id属性を設定
  // これにより、イベントハンドラーでカードIDを取得できる
  // 例: <div class="kanban-card" data-card-id="card-123">
  cardElement.dataset.cardId = card.id;

  // 6. draggable属性を設定（Task 7のD&Dで使用）
  // draggable = true でドラッグ可能にする
  // テンプレートでも設定されているが、明示的に設定することで意図を明確にする
  cardElement.draggable = true;

  // 7. カード要素を返す
  return cardElement;
}

/**
 * 画面上部にメッセージを表示する（Bootstrap alert）
 * 3秒後に自動的に非表示になる
 *
 * @param {string} message - 表示するメッセージ
 * @param {string} type - メッセージタイプ（\"success\" | \"danger\" | \"warning\" | \"info\"）
 *
 * 実装フロー:
 * 1. メッセージ表示エリアを取得
 * 2. Bootstrap alertのHTML要素を作成
 * 3. メッセージテキストを設定（textContentでXSS対策）
 * 4. 閉じるボタンを追加
 * 5. メッセージエリアにalert要素を追加
 * 6. 3秒後にalert要素を削除
 *
 * 使用例:
 * showMessage('カードを追加しました', 'success');
 * showMessage('カードの追加に失敗しました', 'danger');
 *
 * Bootstrapのalertタイプ:
 * - success: 緑色（成功メッセージ）
 * - danger: 赤色（エラーメッセージ）
 * - warning: 黄色（警告メッセージ）
 * - info: 青色（情報メッセージ）
 *
 * 注意:
 * - Bootstrap 5のalertコンポーネントを使用
 * - alert-dismissibleでユーザーが手動で閉じることも可能
 * - setTimeout()で3秒後に自動削除
 */
function showMessage(message, type) {
  // 1. メッセージ表示エリアを取得
  // querySelector()で#message-area要素を取得
  const messageArea = document.querySelector('#message-area');

  // メッセージエリアが見つからない場合はエラーを出して処理を中断
  if (!messageArea) {
    console.error('メッセージ表示エリアが見つかりません');
    return;
  }

  // 2. Bootstrap alertのHTML要素を作成
  // div要素を作成してBootstrapのalertクラスを設定
  const alertElement = document.createElement('div');

  // Bootstrapのalertクラスを設定
  // - alert: 基本のalertスタイル
  // - alert-${type}: タイプに応じた色（success, danger, warning, info）
  // - alert-dismissible: 閉じるボタンを表示
  // - fade: フェードアニメーション
  // - show: 表示状態
  alertElement.className = `alert alert-${type} alert-dismissible fade show`;

  // role属性を設定（アクセシビリティ）
  alertElement.setAttribute('role', 'alert');

  // 3. メッセージテキストを設定（textContentでXSS対策）
  // textContent: HTMLタグをエスケープするため、XSS対策になる
  alertElement.textContent = message;

  // 4. 閉じるボタンを追加
  // Bootstrapの標準的な閉じるボタンを作成
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'btn-close';
  closeButton.setAttribute('data-bs-dismiss', 'alert');
  closeButton.setAttribute('aria-label', 'Close');

  // 閉じるボタンをalertElementに追加
  alertElement.appendChild(closeButton);

  // 5. メッセージエリアにalert要素を追加
  messageArea.appendChild(alertElement);

  // 6. 3秒後にalert要素を削除
  // setTimeout()で3秒（3000ミリ秒）後に実行
  setTimeout(() => {
    // alert要素をDOMから削除
    // remove()メソッドで要素を削除
    alertElement.remove();
  }, 3000);
}
