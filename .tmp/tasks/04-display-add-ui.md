# Task 4: カード表示機能とカード追加UI実装

## 概要

カード表示機能とカード追加UIを統合し、「＋追加」ボタンでカードを追加して画面に表示できるようにする。このタスクでは、データ層（Task 3で実装済み）とUI層を接続し、ユーザーがブラウザ上で実際にカードを追加・表示できるようにする。

## 実装内容

### 1. `js/data-manager.js` に追加 - データゲッター関数

#### 1-1. `getAllCards()` 実装

すべてのカードデータを取得する関数。

```javascript
/**
 * すべてのカードデータを取得する
 *
 * @returns {Array} すべてのカードオブジェクトの配列
 *
 * @example
 * const cards = getAllCards();
 * console.log(cards); // [{ id: '...', content: '...', columnId: '...' }, ...]
 */
function getAllCards() {
  // cardsData配列をそのまま返す
  // 注意: 配列の参照を返すため、呼び出し側で変更すると元データも変わる
  // 現時点ではパフォーマンスを優先して参照を返す（将来的にコピーを返すことも検討可能）
}
```

**実装の考え方**:
- `cardsData` 配列をそのまま返す
- モジュールスコープの変数にアクセスするゲッター関数
- 配列の参照を返すため、呼び出し側での変更に注意

**目的**:
- UI層からすべてのカードデータにアクセスできるようにする
- カード検索（編集・削除時）に使用

---

#### 1-2. `getCardsByColumn(columnId)` 実装

指定されたカラムのカードデータのみを取得する関数。

```javascript
/**
 * 指定されたカラムのカードデータを取得する
 *
 * @param {string} columnId - カラムID（\"todo\" | \"inprogress\" | \"done\"）
 * @returns {Array} 指定されたカラムのカードオブジェクトの配列
 *
 * @example
 * const todoCards = getCardsByColumn('todo');
 * console.log(todoCards); // [{ id: '...', content: '...', columnId: 'todo' }, ...]
 */
function getCardsByColumn(columnId) {
  // cardsData.filter()でcolumnIdが一致するカードのみを抽出
  // 新しい配列を返すため、呼び出し側での変更は元データに影響しない
}
```

**実装の考え方**:
- `cardsData.filter()` でカラムIDが一致するカードを抽出
- `filter()` は新しい配列を返すため、元データは変更されない
- バリデーションは行わない（呼び出し側で適切なIDを渡す前提）

**目的**:
- 特定のカラムに表示するカードのみを取得
- カード表示時（`renderColumnCards()`）に使用

---

### 2. `js/ui-renderer.js` を作成 - カード表示ロジック

カードを画面に表示するためのレンダリング関数を提供する。

#### 2-1. `renderAllCards()` 実装

すべてのカラムのカードを表示する関数。アプリ初期化時とデータ変更時に呼ばれる。

```javascript
/**
 * すべてのカラムのカードを表示する
 * 各カラムに対してrenderColumnCards()を呼び出す
 *
 * @example
 * renderAllCards();
 * // すべてのカラムにカードが表示される
 */
function renderAllCards() {
  // COLUMNS配列をループして、各カラムに対してrenderColumnCards()を呼び出す
  // COLUMNS.forEach(column => renderColumnCards(column.id))
}
```

**実装の考え方**:
- `COLUMNS` 配列をループ
- 各カラムIDで `renderColumnCards()` を呼び出す
- アプリ初期化時とデータ変更時（D&D移動時）に呼ばれる

**目的**:
- すべてのカラムを一括で再描画
- データとUIの同期を保つ

---

#### 2-2. `renderColumnCards(columnId)` 実装

指定されたカラムのカードを表示する関数。

```javascript
/**
 * 指定されたカラムのカードを表示する
 *
 * @param {string} columnId - カラムID（\"todo\" | \"inprogress\" | \"done\"）
 *
 * @example
 * renderColumnCards('todo');
 * // ToDoカラムにカードが表示される
 */
function renderColumnCards(columnId) {
  // 1. getCardsByColumn(columnId) でデータ取得
  // 2. カラムのコンテナ要素を取得（querySelector(`[data-column-id="${columnId}"] .card-container`)）
  // 3. コンテナの既存の内容をクリア（innerHTML = ''）
  // 4. DocumentFragmentを作成（パフォーマンス最適化）
  // 5. カードデータをループして、createCardElement()でカード要素を作成
  // 6. DocumentFragmentに追加
  // 7. コンテナにDocumentFragmentを追加（一度のDOM操作で済む）
}
```

**実装の考え方**:
- `getCardsByColumn()` でデータ取得
- DocumentFragmentを使用してDOM操作を最小化
- 既存の内容をクリアしてから再描画（idempotent）

**目的**:
- 特定のカラムのカードを効率的に描画
- カード追加・削除・編集後の再描画に使用

**DocumentFragmentについて**:
- メモリ上に一時的なDOMツリーを作成
- 複数の要素を一度にDOMに追加できる（パフォーマンス向上）
- `document.createDocumentFragment()` で作成

---

#### 2-3. `createCardElement(card)` 実装

カードオブジェクトからカードのDOM要素を作成する関数。

```javascript
/**
 * カードオブジェクトからカードのDOM要素を作成する
 *
 * @param {Object} card - カードオブジェクト
 * @param {string} card.id - カードID
 * @param {string} card.content - カードの内容
 * @param {string} card.columnId - カラムID
 * @returns {HTMLElement} カード要素
 *
 * @example
 * const card = { id: 'card-123', content: 'タスク', columnId: 'todo' };
 * const cardElement = createCardElement(card);
 * document.querySelector('.card-container').appendChild(cardElement);
 */
function createCardElement(card) {
  // 1. テンプレート要素を取得（querySelector('#card-template')）
  // 2. テンプレートの内容をクローン（template.content.cloneNode(true)）
  // 3. クローンからカード要素を取得（querySelector('.kanban-card')）
  // 4. カード内容を設定（querySelector('.card-content').textContent = card.content）
  // 5. data属性でカードIDを設定（cardElement.dataset.cardId = card.id）
  // 6. draggable属性を設定（cardElement.draggable = true、Task 7で使用）
  // 7. カード要素を返す
}
```

**実装の考え方**:
- `<template>` 要素をクローンして再利用
- `textContent` でXSS対策（HTMLタグをエスケープ）
- `dataset.cardId` でカードIDを保持（編集・削除・D&Dで使用）
- `draggable` 属性を設定（Task 7のD&Dで使用）

**目的**:
- カードのHTML構造を動的に生成
- テンプレートを活用してコードを簡潔に保つ

**XSS対策について**:
- `textContent` を使用することで、HTMLタグが自動的にエスケープされる
- 例: `<script>alert('XSS')</script>` → そのまま文字列として表示

---

#### 2-4. `showMessage(message, type)` 実装

画面上部にメッセージを表示する関数（Bootstrap alert使用）。

```javascript
/**
 * 画面上部にメッセージを表示する（Bootstrap alert）
 * 3秒後に自動的に非表示になる
 *
 * @param {string} message - 表示するメッセージ
 * @param {string} type - メッセージタイプ（\"success\" | \"danger\" | \"warning\" | \"info\"）
 *
 * @example
 * showMessage('カードを追加しました', 'success');
 * showMessage('カードの追加に失敗しました', 'danger');
 */
function showMessage(message, type) {
  // 1. メッセージ表示エリアを取得（querySelector('#message-area')）
  // 2. Bootstrap alertのHTML要素を作成（div要素、class="alert alert-${type} alert-dismissible fade show"）
  // 3. メッセージテキストを設定（textContentでXSS対策）
  // 4. 閉じるボタンを追加（<button type="button" class="btn-close" data-bs-dismiss="alert">）
  // 5. メッセージエリアにalert要素を追加
  // 6. 3秒後にalert要素を削除（setTimeout + remove()）
}
```

**実装の考え方**:
- Bootstrap 5のalertコンポーネントを使用
- `alert-dismissible` でユーザーが手動で閉じることも可能
- `setTimeout()` で3秒後に自動削除

**目的**:
- ユーザーに操作結果をフィードバック
- 成功・エラーメッセージを視覚的に表示

**Bootstrapのalertタイプ**:
- `success`: 緑色（成功メッセージ）
- `danger`: 赤色（エラーメッセージ）
- `warning`: 黄色（警告メッセージ）
- `info`: 青色（情報メッセージ）

---

### 3. `js/modal.js` を作成 - モーダル管理

カード追加・編集用のモーダルを管理する。

#### 3-1. モジュールスコープの変数定義

```javascript
/**
 * Bootstrap Modalインスタンス
 * initializeModal()で初期化される
 */
let modalInstance = null;

/**
 * モーダルの現在のモード（\"add\" | \"edit\"）
 * openAddModal()で\"add\"、openEditModal()で\"edit\"に設定される
 */
let currentMode = 'add';

/**
 * 編集中のカードID（editモードの場合のみ）
 * openEditModal()で設定される
 */
let currentCardId = null;

/**
 * 追加先のカラムID（addモードの場合のみ）
 * openAddModal()で設定される
 */
let currentColumnId = null;
```

**目的**:
- モーダルの状態を管理
- addモードとeditモードを切り替え
- 現在の操作対象（カラムIDまたはカードID）を保持

---

#### 3-2. `initializeModal()` 実装

Bootstrap Modalを初期化する関数。

```javascript
/**
 * Bootstrap Modalを初期化する
 * アプリケーション起動時に1度だけ呼ばれる
 *
 * @example
 * initializeModal();
 * // modalInstanceが作成される
 */
function initializeModal() {
  // 1. モーダル要素を取得（querySelector('#cardModal')）
  // 2. new bootstrap.Modal()でModalインスタンスを作成
  // 3. modalInstanceに代入
  // 4. モーダルが閉じられた時のイベントリスナーを設定（'hidden.bs.modal'）
  //    - モーダルが完全に閉じられた後、フォームをリセット
}
```

**実装の考え方**:
- Bootstrap 5のModalコンポーネントをJavaScript APIで操作
- `new bootstrap.Modal(element)` でインスタンス作成
- `hidden.bs.modal` イベントでクリーンアップ

**目的**:
- モーダルを初期化してshow/hideできるようにする
- モーダルが閉じられた時にフォームをリセット

---

#### 3-3. `openAddModal(columnId)` 実装

カード追加モードでモーダルを開く関数。

```javascript
/**
 * カード追加モードでモーダルを開く
 *
 * @param {string} columnId - 追加先のカラムID
 *
 * @example
 * openAddModal('todo');
 * // モーダルが「カード追加」モードで開く
 */
function openAddModal(columnId) {
  // 1. currentMode = 'add' に設定
  // 2. currentColumnId = columnId に設定
  // 3. currentCardId = null に設定（addモードではカードIDは不要）
  // 4. モーダルのタイトルを設定（querySelector('#cardModalLabel').textContent = 'カード追加'）
  // 5. テキストエリアをクリア（querySelector('#cardContent').value = ''）
  // 6. modalInstance.show() でモーダルを表示
  // 7. テキストエリアにフォーカス（querySelector('#cardContent').focus()）
}
```

**実装の考え方**:
- モードを `'add'` に設定
- カラムIDを保持（どのカラムに追加するか）
- モーダルのタイトルと入力欄をリセット

**目的**:
- 「＋追加」ボタンクリック時にモーダルを開く
- ユーザーに新しいカードを入力させる

---

#### 3-4. `closeModal()` 実装

モーダルを閉じる関数。

```javascript
/**
 * モーダルを閉じる
 *
 * @example
 * closeModal();
 * // モーダルが閉じる
 */
function closeModal() {
  // modalInstance.hide() でモーダルを非表示
  // hidden.bs.modalイベントでフォームがリセットされる（initializeModal()で設定済み）
}
```

**実装の考え方**:
- `modalInstance.hide()` を呼び出すだけ
- フォームリセットは `hidden.bs.modal` イベントで行われる

**目的**:
- カード保存後やキャンセル時にモーダルを閉じる

---

#### 3-5. `getModalInput()` 実装

モーダルの入力内容を取得する関数。

```javascript
/**
 * モーダルの入力内容を取得する
 *
 * @returns {string} 入力されたカードの内容
 *
 * @example
 * const content = getModalInput();
 * console.log(content); // 'タスクの内容'
 */
function getModalInput() {
  // querySelector('#cardContent').value を返す
  // trim()は呼び出し側で行う（ここでは生の入力値を返す）
}
```

**実装の考え方**:
- テキストエリアの値をそのまま返す
- `trim()` は呼び出し側（event-handler.js）で行う

**目的**:
- イベントハンドラーから入力値にアクセスできるようにする

---

#### 3-6. `getModalMode()`, `getCurrentColumnId()`, `getCurrentCardId()` 実装

モーダルの現在の状態を取得するゲッター関数。

```javascript
/**
 * モーダルの現在のモードを取得する
 *
 * @returns {string} モード（\"add\" | \"edit\"）
 */
function getModalMode() {
  // currentMode を返す
}

/**
 * 追加先のカラムIDを取得する（addモードの場合のみ）
 *
 * @returns {string|null} カラムID
 */
function getCurrentColumnId() {
  // currentColumnId を返す
}

/**
 * 編集中のカードIDを取得する（editモードの場合のみ）
 *
 * @returns {string|null} カードID
 */
function getCurrentCardId() {
  // currentCardId を返す
}
```

**実装の考え方**:
- モジュールスコープの変数にアクセスするゲッター関数
- イベントハンドラーから現在の状態を参照できるようにする

**目的**:
- モーダルの状態をカプセル化
- イベントハンドラーがaddモードかeditモードかを判定

---

### 4. `js/event-handler.js` を作成 - イベント処理

ユーザーの操作（ボタンクリック、フォーム送信等）に対するイベントハンドラーを提供する。

#### 4-1. `setupAddCardListeners()` 実装

「＋追加」ボタンのクリックイベントリスナーを設定する関数。

```javascript
/**
 * 「＋追加」ボタンのクリックイベントリスナーを設定する
 *
 * @example
 * setupAddCardListeners();
 * // すべての「＋追加」ボタンにイベントリスナーが設定される
 */
function setupAddCardListeners() {
  // 1. すべての「＋追加」ボタンを取得（querySelectorAll('.add-card-btn')）
  // 2. 各ボタンにクリックイベントリスナーを設定
  // 3. ボタンのdata-column-id属性からカラムIDを取得
  // 4. openAddModal(columnId) を呼び出してモーダルを開く
}
```

**実装の考え方**:
- `querySelectorAll()` ですべての追加ボタンを取得
- 各ボタンに個別のイベントリスナーを設定
- `dataset.columnId` でカラムIDを取得

**目的**:
- ユーザーが「＋追加」ボタンをクリックしたらモーダルを開く

---

#### 4-2. `setupModalFormListener()` 実装

モーダルのフォーム送信イベントリスナーを設定する関数。

```javascript
/**
 * モーダルのフォーム送信イベントリスナーを設定する
 *
 * @example
 * setupModalFormListener();
 * // フォーム送信時にhandleModalSubmit()が呼ばれる
 */
function setupModalFormListener() {
  // 1. フォーム要素を取得（querySelector('#cardForm')）
  // 2. submitイベントリスナーを設定
  // 3. event.preventDefault() でデフォルトのフォーム送信を防止
  // 4. handleModalSubmit() を呼び出す
}
```

**実装の考え方**:
- `submit` イベントをリスン
- `preventDefault()` でページリロードを防止
- フォーム送信の実際の処理は `handleModalSubmit()` に委譲

**目的**:
- フォーム送信時にカードを追加する処理を実行

---

#### 4-3. `handleModalSubmit()` 実装

モーダルのフォーム送信を処理する関数（addモードのみ対応）。

```javascript
/**
 * モーダルのフォーム送信を処理する
 * 現時点ではaddモードのみ対応（editモードはTask 5で実装）
 *
 * @example
 * handleModalSubmit();
 * // モーダルの内容に応じてカードを追加
 */
function handleModalSubmit() {
  // 1. getModalInput() で入力内容を取得
  // 2. getModalMode() でモードを取得
  // 3. モードが'add'の場合、handleAddCard(content)を呼び出す
  // 4. モードが'edit'の場合、何もしない（Task 5で実装）
}
```

**実装の考え方**:
- モードに応じて処理を分岐
- addモードの場合のみ `handleAddCard()` を呼び出す
- editモードはTask 5で実装するため、現時点では何もしない

**目的**:
- addモードとeditモードを同じフォームで処理
- 将来の拡張性を確保

---

#### 4-4. `handleAddCard(content)` 実装

カード追加処理を実行する関数。

```javascript
/**
 * カード追加処理を実行する
 * try-catchでエラーハンドリングを行い、成功/失敗メッセージを表示する
 *
 * @param {string} content - カードの内容
 *
 * @example
 * handleAddCard('新しいタスク');
 * // カードが追加され、画面に表示される
 */
function handleAddCard(content) {
  // 1. try-catch でエラーハンドリング
  // 2. try内:
  //    - getCurrentColumnId() でカラムIDを取得
  //    - addCard(content, columnId) を呼び出し（データ層でバリデーション+保存）
  //    - renderColumnCards(columnId) でカラムを再描画
  //    - closeModal() でモーダルを閉じる
  //    - showMessage('カードを追加しました', 'success') で成功メッセージ表示
  // 3. catch内:
  //    - showMessage(error.message, 'danger') でエラーメッセージ表示
  //    - モーダルは開いたまま（ユーザーが修正できるように）
}
```

**実装の考え方**:
- `try-catch` でバリデーションエラーや保存エラーをキャッチ
- 成功時はモーダルを閉じて成功メッセージ表示
- エラー時はモーダルを開いたままエラーメッセージ表示

**目的**:
- データ層（`addCard()`）とUI層を接続
- エラーハンドリングとユーザーフィードバック

**エラー例**:
- バリデーションエラー: 「カードの内容を入力してください」
- 保存エラー: localStorage容量超過等

---

#### 4-5. `setupModalCancelListener()` 実装

モーダルのキャンセルボタンのクリックイベントリスナーを設定する関数。

```javascript
/**
 * モーダルのキャンセルボタンのクリックイベントリスナーを設定する
 *
 * @example
 * setupModalCancelListener();
 * // キャンセルボタンクリック時にモーダルが閉じる
 */
function setupModalCancelListener() {
  // 1. キャンセルボタンを取得（querySelector('#cancelBtn')）
  // 2. クリックイベントリスナーを設定
  // 3. closeModal() を呼び出してモーダルを閉じる
}
```

**実装の考え方**:
- キャンセルボタンのクリックで `closeModal()` を呼び出す
- Bootstrapの `data-bs-dismiss="modal"` でも閉じられるが、明示的に設定

**目的**:
- ユーザーがカード追加をキャンセルできるようにする

---

#### 4-6. `setupEventListeners()` 実装

すべてのイベントリスナーを設定する統合関数。

```javascript
/**
 * すべてのイベントリスナーを設定する
 * アプリケーション起動時に1度だけ呼ばれる
 *
 * @example
 * setupEventListeners();
 * // すべてのイベントリスナーが設定される
 */
function setupEventListeners() {
  // 以下の関数を順次呼び出す:
  // - setupAddCardListeners()
  // - setupModalFormListener()
  // - setupModalCancelListener()
  // 注: setupCardActionListeners(), setupDragAndDropListeners() は今後のタスクで追加
}
```

**実装の考え方**:
- すべてのイベントリスナー設定関数を一箇所にまとめる
- アプリ初期化時に1度だけ呼ばれる

**目的**:
- イベントリスナーの設定を一元管理
- app.jsからシンプルに呼び出せるようにする

---

### 5. `js/app.js` を作成 - アプリ初期化

アプリケーション全体の初期化フローを管理する。

#### 5-1. IIFE構造

```javascript
/**
 * アプリケーションのエントリーポイント
 * IIFE（即時実行関数式）でグローバルスコープを汚染しない
 */
(function() {
  'use strict';

  // 初期化関数とイベントリスナーをここに記述
})();
```

**実装の考え方**:
- IIFE（Immediately Invoked Function Expression）でモジュールパターンを実現
- `'use strict'` でストリクトモードを有効化
- グローバルスコープを汚染しない

**目的**:
- 変数の衝突を防ぐ
- モダンなJavaScriptのベストプラクティスに従う

---

#### 5-2. `initializeApp()` 実装

アプリケーション全体を初期化する関数。

```javascript
/**
 * アプリケーション全体を初期化する
 * DOMContentLoadedイベント発火時に呼ばれる
 */
function initializeApp() {
  // 以下の処理を順次実行:
  // 1. initializeData() - localStorageからデータを読み込む
  // 2. initializeModal() - Bootstrap Modalを初期化
  // 3. renderAllCards() - すべてのカードを画面に表示
  // 4. setupEventListeners() - すべてのイベントリスナーを設定
}
```

**実装の考え方**:
- データ初期化 → UI初期化 → イベント設定の順で実行
- 依存関係を考慮した初期化順序

**目的**:
- アプリケーションを正しい順序で初期化
- すべての準備が整った状態でユーザーに提供

---

#### 5-3. `DOMContentLoaded` で初期化

```javascript
/**
 * DOMが完全に読み込まれた後、アプリを初期化する
 */
document.addEventListener('DOMContentLoaded', initializeApp);
```

**実装の考え方**:
- `DOMContentLoaded` イベントをリスン
- DOMが完全に構築された後に初期化処理を実行
- スクリプトの読み込み位置に依存しない

**目的**:
- DOM要素が存在することを保証してから初期化
- 確実にアプリケーションを起動

---

### 6. `index.html` に `<script>` タグを追加

新しく作成したJavaScriptファイルを読み込む。

```html
<!-- Kanban App JavaScript -->
<!-- 読み込み順序が重要: constants → storage → data-manager → ui-renderer → modal → event-handler → app -->
<script src="js/constants.js"></script>
<script src="js/storage.js"></script>
<script src="js/data-manager.js"></script>
<script src="js/ui-renderer.js"></script>
<script src="js/modal.js"></script>
<script src="js/event-handler.js"></script>
<script src="js/app.js"></script>
```

**実装の考え方**:
- 依存関係を考慮した読み込み順序
- `app.js` を最後に読み込む（他のモジュールに依存するため）

**目的**:
- すべてのモジュールを正しい順序で読み込む

---

### 7. `index.html` からダミーカードを削除

Task 1で追加したダミーカードを削除する。

**実装の考え方**:
- `.card-container` 内のダミーカード（`.kanban-card`）を削除
- 空の `.card-container` のみを残す

**目的**:
- 動的に生成されたカードのみを表示
- ダミーデータと実データの混在を防ぐ

---

## 動作確認

### 1. 「＋追加」ボタンをクリックしてモーダルが開く

**確認方法**:
1. ブラウザで `index.html` を開く
2. いずれかのカラムの「＋追加」ボタンをクリック
3. モーダルが開くことを確認
4. モーダルのタイトルが「カード追加」であることを確認
5. テキストエリアが空であることを確認

**確認項目**:
- [ ] 「＋追加」ボタンをクリックするとモーダルが開く
- [ ] モーダルのタイトルが「カード追加」である
- [ ] テキストエリアが空である
- [ ] テキストエリアにフォーカスが当たっている

---

### 2. テキストを入力して保存するとカードが追加され、画面に表示される

**確認方法**:
1. モーダルのテキストエリアに「テストタスク」と入力
2. 「保存」ボタンをクリック
3. モーダルが閉じることを確認
4. 成功メッセージ「カードを追加しました」が表示されることを確認
5. 該当カラムにカードが表示されることを確認
6. カードの内容が「テストタスク」であることを確認

**確認項目**:
- [ ] テキストを入力して「保存」をクリックするとカードが追加される
- [ ] モーダルが閉じる
- [ ] 成功メッセージが表示される（緑色のalert）
- [ ] カードが該当カラムに表示される
- [ ] カードの内容が正しく表示される
- [ ] 3秒後に成功メッセージが消える

---

### 3. ページリロード後もカードが残っている

**確認方法**:
1. ブラウザでページをリロード（F5 または Cmd+R）
2. カードが表示されたままであることを確認
3. カードの内容が「テストタスク」であることを確認

**確認項目**:
- [ ] ページリロード後もカードが表示される
- [ ] カードの内容が保持されている
- [ ] カードの位置（カラム）が保持されている

---

### 4. バリデーションエラーのテスト

**確認方法**:
1. 「＋追加」ボタンをクリック
2. テキストエリアに何も入力せず「保存」をクリック
3. エラーメッセージ「カードの内容を入力してください」が表示されることを確認
4. モーダルが開いたままであることを確認
5. テキストエリアに空白文字のみ（例: "   "）を入力して「保存」をクリック
6. 同じエラーメッセージが表示されることを確認
7. テキストエリアに501文字以上入力して「保存」をクリック
8. エラーメッセージ「カードの内容は500文字以内で入力してください」が表示されることを確認

**確認項目**:
- [ ] 空文字でエラーメッセージが表示される
- [ ] 空白文字のみでエラーメッセージが表示される
- [ ] 500文字超えでエラーメッセージが表示される
- [ ] エラー時もモーダルが開いたまま（修正できるように）
- [ ] エラーメッセージが赤色のalertで表示される
- [ ] 3秒後にエラーメッセージが消える

---

### 5. キャンセルボタンのテスト

**確認方法**:
1. 「＋追加」ボタンをクリック
2. テキストエリアに「キャンセルテスト」と入力
3. 「キャンセル」ボタンをクリック
4. モーダルが閉じることを確認
5. カードが追加されていないことを確認

**確認項目**:
- [ ] キャンセルボタンでモーダルが閉じる
- [ ] カードが追加されない

---

### 6. 複数カラムへの追加テスト

**確認方法**:
1. 「To Do」カラムの「＋追加」ボタンをクリック
2. 「Todoタスク」と入力して保存
3. 「To Do」カラムにカードが表示されることを確認
4. 「In Progress」カラムの「＋追加」ボタンをクリック
5. 「作業中タスク」と入力して保存
6. 「In Progress」カラムにカードが表示されることを確認
7. 「Done」カラムの「＋追加」ボタンをクリック
8. 「完了タスク」と入力して保存
9. 「Done」カラムにカードが表示されることを確認

**確認項目**:
- [ ] 各カラムに正しくカードが追加される
- [ ] カードが他のカラムに誤って追加されない
- [ ] 複数のカードが同じカラムに追加できる

---

## 完了条件

- `js/data-manager.js` に `getAllCards()` と `getCardsByColumn(columnId)` 関数が実装されている
- `js/ui-renderer.js` が作成され、以下の関数が実装されている:
  - `renderAllCards()`
  - `renderColumnCards(columnId)`
  - `createCardElement(card)`
  - `showMessage(message, type)`
- `js/modal.js` が作成され、以下の関数・変数が実装されている:
  - `modalInstance`, `currentMode`, `currentCardId`, `currentColumnId`
  - `initializeModal()`
  - `openAddModal(columnId)`
  - `closeModal()`
  - `getModalInput()`
  - `getModalMode()`, `getCurrentColumnId()`, `getCurrentCardId()`
- `js/event-handler.js` が作成され、以下の関数が実装されている:
  - `setupAddCardListeners()`
  - `setupModalFormListener()`
  - `handleModalSubmit()`
  - `handleAddCard(content)`
  - `setupModalCancelListener()`
  - `setupEventListeners()`
- `js/app.js` が作成され、以下が実装されている:
  - IIFE構造
  - `initializeApp()`
  - `DOMContentLoaded` イベントリスナー
- `index.html` に新しいJavaScriptファイルの `<script>` タグが追加されている
- `index.html` からダミーカードが削除されている
- 「＋追加」ボタンをクリックするとモーダルが開く
- テキストを入力して保存するとカードが追加され、画面に表示される
- ページリロード後もカードが残っている
- バリデーションエラーが正しく表示される
- キャンセルボタンが正しく動作する
- すべてのカラムにカードを追加できる

## 依存

Task 3: カード追加のデータ処理

## 推定時間

1時間45分

## 次のタスク

Task 5: カード編集機能の実装 → ボタンで編集
