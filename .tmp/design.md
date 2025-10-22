# 詳細設計書 - ブラウザベースカンバンアプリ（ハンズオン用）

## 1. アーキテクチャ概要

### 1.1 システム構成

```
index.html (Bootstrap + <template>タグ)
    ↓
JavaScript (7ファイルに分割)
    ↓
localStorage
```

### 1.2 技術スタック

- **言語**: Vanilla JavaScript (ES6+)
- **CSS**: Bootstrap 5.3 (CDN) + 最小限のカスタムCSS
- **ストレージ**: localStorage
- **デプロイ**: HTMLファイルをダブルクリックで起動（file://プロトコル）

### 1.3 ファイル構成

```
kanban-app/
├── index.html              # 構造定義（Bootstrap CDN含む）
├── style.css               # 最小限のカスタムCSS（50-100行）
└── js/
    ├── constants.js        # STORAGE_KEY, COLUMNS のみ（20行）
    ├── storage.js          # localStorage操作（60-80行）
    ├── data-manager.js     # データCRUD（150-200行）
    ├── ui-renderer.js      # UI描画（150-200行）
    ├── modal.js            # モーダル制御（80-100行）
    ├── event-handler.js    # イベント処理（200-250行）
    └── app.js              # 初期化（50-80行）
```

## 2. データ設計

### 2.1 カードオブジェクト

```javascript
{
  id: "card-1634567890123-abc",
  content: "タスクの内容",
  columnId: "todo",  // "todo" | "inprogress" | "done"
  createdAt: 1634567890123,
  updatedAt: 1634567890123
}
```

### 2.2 カラム定義（固定）

```javascript
const COLUMNS = [
  { id: 'todo', name: 'To Do' },
  { id: 'inprogress', name: 'In Progress' },
  { id: 'done', name: 'Done' }
];
```

### 2.3 localStorage保存形式

- **Key**: `"kanban_data"`
- **Value**: カードオブジェクトの配列（JSON文字列）

## 3. 各ファイルの責務

### 3.1 constants.js

**責務**: 複数箇所で使う定数のみ定義

**内容**:
- `STORAGE_KEY`: localStorage のキー名
- `COLUMNS`: カラム定義配列

**重要**: メッセージや数値は各関数内に直接書く（初学者にとって分かりやすい）

### 3.2 storage.js

**責務**: localStorage の読み書き

**主要関数**:
- `isStorageAvailable()`: localStorage が利用可能かチェック
- `loadFromStorage()`: データ読み込み（エラー時は空配列）
- `saveToStorage(cards)`: データ保存

### 3.3 data-manager.js

**責務**: カードデータの CRUD 操作

**内部state**:
- `cardsData`: カードデータの配列

**主要関数**:
- `initializeData()`: 起動時にlocalStorageからデータ読み込み
- `getAllCards()`: すべてのカードを取得
- `getCardsByColumn(columnId)`: 指定カラムのカードを取得
- `addCard(content, columnId)`: カード追加
- `updateCard(cardId, newContent)`: カード更新
- `deleteCard(cardId)`: カード削除
- `moveCard(cardId, newColumnId)`: カード移動
- `isValidColumnId(columnId)`: カラムIDバリデーション
- `generateCardId()`: 一意なID生成

**エラー処理**: `throw new Error()` で即座にエラーを投げる（シンプル）

### 3.4 ui-renderer.js

**責務**: データをDOMに反映

**主要関数**:
- `renderAllCards()`: すべてのカラムを再描画
- `renderColumnCards(columnId)`: 指定カラムのカードを再描画
- `createCardElement(card)`: `<template>` を clone してカード要素を生成
- `showMessage(message, type)`: 成功/エラーメッセージを表示（3秒後に自動非表示）

**重要**:
- `<template id="card-template">` を `cloneNode()` で複製
- **JavaScriptでHTML文字列は書かない**
- `textContent` で XSS 対策
- `DocumentFragment` でパフォーマンス最適化

### 3.5 modal.js

**責務**: カード追加・編集用モーダルの制御

**内部state**:
- `modalInstance`: Bootstrap Modal インスタンス
- `currentMode`: `'add'` or `'edit'`
- `currentCardId`: 編集中のカードID
- `currentColumnId`: 追加先カラムID

**主要関数**:
- `initializeModal()`: Bootstrap Modal 初期化
- `openAddModal(columnId)`: 追加モードで開く
- `openEditModal(cardId)`: 編集モードで開く
- `closeModal()`: モーダルを閉じる
- `getModalInput()`: 入力値を取得
- `getModalMode()`, `getCurrentCardId()`, `getCurrentColumnId()`: 状態取得

### 3.6 event-handler.js

**責務**: ユーザー操作のイベント処理

**主要関数**:
- `setupEventListeners()`: すべてのリスナーを設定
- `setupAddCardListeners()`: 「＋追加」ボタン
- `setupModalFormListener()`: モーダルフォーム送信
- `setupModalCancelListener()`: キャンセルボタン
- `setupCardActionListeners()`: 編集・削除ボタン（イベントデリゲーション）
- `setupDragAndDropListeners()`: ドラッグ&ドロップ
- `handleAddCard(content)`: カード追加処理（try-catch でエラーハンドリング）
- `handleEditCard(newContent)`: カード編集処理
- `handleDeleteCard(cardId)`: カード削除処理（`confirm()` で確認）
- `handleDragStart(event)`, `handleDragOver(event)`, `handleDrop(event)`: D&D処理

**エラーハンドリング**:
- `try { ... } catch (error) { showMessage(error.message, 'error'); }`

### 3.7 app.js

**責務**: アプリケーション初期化

**初期化フロー**:
1. localStorage 利用可否チェック
2. `initializeData()`
3. `initializeModal()`
4. `renderAllCards()`
5. `setupEventListeners()`

**構造**: IIFE でカプセル化、`DOMContentLoaded` で実行

## 4. HTML設計

### 4.1 構造

- Bootstrap のグリッドシステム（`row` / `col-12 col-md-4`）
- 各カラムは Bootstrap の `card` コンポーネント
- `data-column-id` 属性でカラムを識別
- `<template id="card-template">` でカード構造を定義
- Bootstrap Modal (`id="cardModal"`) でカード追加・編集

### 4.2 重要な要素

| 要素 | 用途 |
|------|------|
| `.add-card-btn[data-column-id]` | カード追加ボタン |
| `.card-list[data-column-id]` | カードが追加される領域 |
| `#card-template` | カード構造のテンプレート |
| `#cardModal` | 追加・編集用モーダル |
| `#cardInput` | タスク内容の入力欄 |
| `#message-area` | メッセージ表示エリア |

### 4.3 カードテンプレート

```html
<template id="card-template">
  <div class="card mb-2 kanban-card" draggable="true">
    <div class="card-body p-2">
      <p class="card-content mb-2 small"></p>
      <div class="d-flex justify-content-end gap-1">
        <button class="btn btn-sm btn-outline-secondary edit-btn">✏️</button>
        <button class="btn btn-sm btn-outline-danger delete-btn">🗑️</button>
      </div>
    </div>
  </div>
</template>
```

## 5. データフロー

### 5.1 カード追加
```
ユーザーが「＋追加」クリック
  → openAddModal(columnId)
  → モーダル表示、入力
  → handleAddCard(content)
  → try { addCard(content, columnId) } catch
  → renderColumnCards(columnId)
  → showMessage('成功')
```

### 5.2 カード編集
```
ユーザーが「✏️」クリック
  → openEditModal(cardId)
  → モーダル表示（既存内容表示）、編集
  → handleEditCard(newContent)
  → try { updateCard(cardId, newContent) } catch
  → renderColumnCards(columnId)
  → showMessage('成功')
```

### 5.3 カード削除
```
ユーザーが「🗑️」クリック
  → window.confirm('本当に削除しますか？')
  → handleDeleteCard(cardId)
  → try { deleteCard(cardId) } catch
  → renderColumnCards(columnId)
  → showMessage('成功')
```

### 5.4 ドラッグ&ドロップ
```
dragstart
  → event.dataTransfer.setData('text/plain', cardId)
dragover
  → event.preventDefault() (ドロップ許可)
drop
  → cardId = event.dataTransfer.getData('text/plain')
  → try { moveCard(cardId, newColumnId) } catch
  → renderAllCards()
```

## 6. 設計方針

### 6.1 初学者向けの工夫

1. **メッセージは直接書く**: エラーメッセージは関数内に直接記述（分かりやすい）
2. **throw でシンプルに**: `if (...) throw new Error('...')` で1行（明確）
3. **ファイル分割**: 1ファイル300行以内、役割が明確
4. **Bootstrap活用**: カスタムCSS最小限、すぐに見た目が整う
5. **<template>使用**: JavaScriptでHTML文字列を書かない
6. **早期リターン**: ネストを浅く、読みやすく
7. **ドラッグ&ドロップのみ**: カード移動はD&Dのみ（直感的で分かりやすい）

### 6.2 コーディング規約

| 種類 | 規則 | 例 |
|------|------|-----|
| 変数 | キャメルケース | `cardsData`, `currentMode` |
| 関数 | キャメルケース | `addCard`, `renderAllCards` |
| 定数 | 大文字スネークケース | `STORAGE_KEY`, `COLUMNS` |
| CSSクラス | ケバブケース | `card-list`, `add-card-btn` |

### 6.3 エラーハンドリング

- **data-manager.js**: `throw new Error(...)` で即座にエラーを投げる
- **event-handler.js**: `try-catch` でキャッチして `showMessage(error.message, 'error')`
- **localStorage無効**: 警告表示してメモリ上で動作継続

### 6.4 XSS対策

- **textContent使用**: `innerHTML` は使わない
- **<template>活用**: HTML構造はHTMLファイルで定義
- ユーザー入力はすべて `textContent` で表示

### 6.5 パフォーマンス

- **イベントデリゲーション**: カラム要素でイベントを一括管理
- **DocumentFragment**: 複数カードの一括追加でリフロー削減
- **部分再描画**: 変更があったカラムのみ再描画

## 7. デプロイ

### 7.1 配布方法

1. すべてのファイルをZIP圧縮
2. 受講者がZIPを解凍
3. `index.html` をダブルクリック
4. ブラウザで起動（インターネット接続必要：Bootstrap CDN）

### 7.2 動作要件

- モダンブラウザ（Chrome、Firefox、Safari、Edge）
- インターネット接続（Bootstrap CDN）
- localStorage サポート

## 8. 実装の順序（次のタスク分解フェーズで詳細化）

1. HTML構造 + Bootstrap適用
2. constants.js
3. storage.js
4. data-manager.js
5. ui-renderer.js
6. modal.js
7. event-handler.js（機能ごとに段階的に）
8. app.js
9. style.css（カスタムCSS）
10. 動作確認
