# タスクリスト - ブラウザベースカンバンアプリ

## 概要

- **総タスク数**: 8タスク
- **推定作業時間**: 4-6時間
- **優先度**: 高
- **実装方針**: **機能単位で縦に実装・各タスク完了時点で必ず動作確認**

## 🚨 最重要方針

- **追加と表示は別**: 追加したいのか、表示したいのか、常に明確に
- **各機能が完全に動く状態を作ってから次へ**
- **確認方法は柔軟に**: localStorage、コンソール、画面、何でもOK

---

## Phase 1: 基礎UI（見た目を先に確認）

### Task 1: HTML構造とBootstrapの適用

**番号**: #1

- [x] `index.html` を作成
- [x] Bootstrap 5.3 CDNを読み込み
- [x] 3カラムのレイアウトを作成（To Do / In Progress / Done）
- [x] 各カラムに「＋追加」ボタンを配置
- [x] カードテンプレート（`<template id="card-template">`）を定義
- [x] モーダル（`id="cardModal"`）を配置
- [x] メッセージ表示エリア（`id="message-area"`）を配置
- [x] Bootstrap JS CDNを読み込み
- [x] `style.css` を作成（カスタムCSS）
- [x] カードのドラッグスタイル、最小高さ等を定義
- [x] ダミーカードを2-3枚手動で配置
- [x] **動作確認**: ブラウザで開いて3カラムとダミーカードが表示される

**完了条件**: ブラウザで開いて、カンバンボードの見た目が完成している

**依存**: なし

**推定時間**: 45分

---

## Phase 2: インフラ整備

### Task 2: 基礎インフラの実装

**番号**: #2

- [ ] `js/` ディレクトリを作成
- [ ] `js/constants.js` を作成
  - [ ] `STORAGE_KEY = 'kanban_data'` 定義
  - [ ] `COLUMNS` 配列定義
- [ ] `js/storage.js` を作成
  - [ ] `isStorageAvailable()` 実装
  - [ ] `loadFromStorage()` 実装
  - [ ] `saveToStorage(cards)` 実装
- [ ] `js/data-manager.js` を作成
  - [ ] `cardsData = []` 内部state定義
  - [ ] `initializeData()` 実装（loadFromStorageを呼ぶだけ）
  - [ ] `generateCardId()` 実装
  - [ ] `isValidColumnId(columnId)` 実装
- [ ] `index.html` に `<script>` タグを追加（constants, storage, data-manager）
- [ ] **動作確認**: コンソールで `isStorageAvailable()` を実行してtrueが返る
- [ ] **動作確認**: コンソールで `initializeData()` を実行してエラーが出ない

**完了条件**: 基礎インフラが動作する

**依存**: Task 1

**推定時間**: 30分

---

## Phase 3: カード追加機能

### Task 3: カード追加のデータ処理

**番号**: #3

- [ ] `js/data-manager.js` に追加
  - [ ] `addCard(content, columnId)` 実装
    - バリデーション（空文字、500文字制限）
    - カードオブジェクト作成
    - `cardsData.push(card)`
    - `saveToStorage(cardsData)` 呼び出し
    - エラーは `throw new Error()` で投げる
- [ ] **動作確認**: コンソールで `addCard('テスト1', 'todo')` を実行
- [ ] **動作確認**: コンソールで `addCard('テスト2', 'inprogress')` を実行
- [ ] **動作確認**: localStorage を開いて `kanban_data` にデータが保存されている
- [ ] **動作確認**: ページリロードして `cardsData` にデータが残っている

**完了条件**: カードがlocalStorageに保存される

**依存**: Task 2

**推定時間**: 20分

---

### Task 4: カード表示機能とカード追加UI実装

**番号**: #4

- [ ] `js/data-manager.js` に追加
  - [ ] `getAllCards()` 実装
  - [ ] `getCardsByColumn(columnId)` 実装
- [ ] `js/ui-renderer.js` を作成
  - [ ] `renderAllCards()` 実装（全カラムをループ）
  - [ ] `renderColumnCards(columnId)` 実装
    - `getCardsByColumn()` でデータ取得
    - DocumentFragment使用
    - `createCardElement()` でカード生成
    - カラムに追加
  - [ ] `createCardElement(card)` 実装
    - `<template>` をclone
    - `textContent` でカード内容設定
    - data属性でID設定
  - [ ] `showMessage(message, type)` 実装（Bootstrap alert、3秒後非表示）
- [ ] `js/modal.js` を作成
  - [ ] `modalInstance`, `currentMode`, `currentCardId`, `currentColumnId` 定義
  - [ ] `initializeModal()` 実装（Bootstrap Modal初期化）
  - [ ] `openAddModal(columnId)` 実装
  - [ ] `closeModal()` 実装
  - [ ] `getModalInput()` 実装
  - [ ] `getModalMode()`, `getCurrentColumnId()` 実装
- [ ] `js/event-handler.js` を作成
  - [ ] `setupAddCardListeners()` 実装（「＋追加」ボタン）
  - [ ] `setupModalFormListener()` 実装（フォーム送信）
  - [ ] `handleModalSubmit()` 実装（addモードのみ）
  - [ ] `handleAddCard(content)` 実装（try-catch、addCard + renderColumnCards + closeModal + showMessage）
  - [ ] `setupModalCancelListener()` 実装
  - [ ] `setupEventListeners()` 実装（上記を呼び出し）
- [ ] `js/app.js` を作成
  - [ ] IIFE構造
  - [ ] `initializeApp()` 実装（initializeData, initializeModal, renderAllCards, setupEventListeners）
  - [ ] `DOMContentLoaded` で初期化
- [ ] `index.html` に `<script>` タグを追加（ui-renderer, modal, event-handler, app）
- [ ] `index.html` からダミーカードを削除
- [ ] **動作確認**: 「＋追加」ボタンをクリックしてモーダルが開く
- [ ] **動作確認**: テキストを入力して保存するとカードが追加され、画面に表示される
- [ ] **動作確認**: ページリロード後もカードが残っている

**完了条件**: 「＋追加」ボタンでカードが追加され、画面に表示される

**依存**: Task 3

**推定時間**: 1時間45分

---

## Phase 4: カード編集機能

### Task 5: カード編集機能の実装

**番号**: #5

- [ ] `js/data-manager.js` に追加
  - [ ] `updateCard(cardId, newContent)` 実装
    - バリデーション
    - カード検索
    - 内容更新、updatedAt更新
    - `saveToStorage(cardsData)`
    - エラーは `throw new Error()`
- [ ] `js/modal.js` に追加
  - [ ] `openEditModal(cardId)` 実装（getAllCards→カード検索→入力欄に設定）
  - [ ] `getCurrentCardId()` 実装
- [ ] `js/event-handler.js` に追加
  - [ ] `handleModalSubmit()` を更新（editモードに対応）
  - [ ] `handleEditCard(newContent)` 実装（try-catch、updateCard + renderColumnCards + closeModal + showMessage）
  - [ ] `setupCardActionListeners()` 実装（イベントデリゲーション、編集ボタンのみ）
  - [ ] `setupEventListeners()` に `setupCardActionListeners()` 追加
- [ ] **動作確認**: カードの「✏️」ボタンをクリックしてモーダルが開く
- [ ] **動作確認**: 内容を編集して保存すると更新される
- [ ] **動作確認**: リロード後も編集内容が保持されている

**完了条件**: カード編集機能が完全に動作する

**依存**: Task 4

**推定時間**: 45分

---

## Phase 5: カード削除機能

### Task 6: カード削除機能の実装

**番号**: #6

- [ ] `js/data-manager.js` に追加
  - [ ] `deleteCard(cardId)` 実装
    - カード検索
    - `cardsData.splice()`で削除
    - `saveToStorage(cardsData)`
    - エラーは `throw new Error()`
- [ ] `js/event-handler.js` に追加
  - [ ] `handleDeleteCard(cardId)` 実装（confirm + try-catch、getAllCards→カード検索→deleteCard + renderColumnCards + showMessage）
  - [ ] `setupCardActionListeners()` を更新（削除ボタンに対応）
- [ ] **動作確認**: カードの「🗑️」ボタンをクリックして確認ダイアログが表示される
- [ ] **動作確認**: OKをクリックするとカードが削除される
- [ ] **動作確認**: リロード後も削除されたまま

**完了条件**: カード削除機能が完全に動作する

**依存**: Task 5

**推定時間**: 30分

---

## Phase 6: ドラッグ&ドロップ機能

### Task 7: ドラッグ&ドロップ機能の実装

**番号**: #7

- [ ] `js/data-manager.js` に追加
  - [ ] `moveCard(cardId, newColumnId)` 実装
    - カード検索
    - columnId更新、updatedAt更新
    - `saveToStorage(cardsData)`
    - エラーは `throw new Error()`
- [ ] `js/event-handler.js` に追加
  - [ ] `setupDragAndDropListeners()` 実装
  - [ ] `handleDragStart(event)` 実装（dataTransfer.setData('text/plain', cardId)）
  - [ ] `handleDragOver(event)` 実装（event.preventDefault()）
  - [ ] `handleDrop(event)` 実装（try-catch、dataTransfer.getData + moveCard + renderAllCards + showMessage）
  - [ ] `setupEventListeners()` に `setupDragAndDropListeners()` 追加
- [ ] **動作確認**: カードをドラッグできる（カーソルが変わる）
- [ ] **動作確認**: カードを別カラムにドロップすると移動する
- [ ] **動作確認**: リロード後も移動先に残っている

**完了条件**: ドラッグ&ドロップでカード移動が完全に動作する

**依存**: Task 6

**推定時間**: 45分

---

## Phase 7: 最終調整

### Task 8: エラーハンドリングの実装とコメント追加

**番号**: #8

- [ ] `js/app.js` を更新
  - [ ] localStorage利用可否チェック（isStorageAvailable）
  - [ ] 利用不可の場合は警告表示（showMessage）
- [ ] すべてのJSファイルに学習ポイントのコメントを追加
- [ ] 関数に適切なコメントを追加
- [ ] **動作確認**: プライベートモードで起動してエラーメッセージが表示される
- [ ] **動作確認**: レスポンシブデザイン（スマホサイズ）で表示が崩れない

**完了条件**: エラーハンドリングが実装され、コードが理解しやすい

**注意**: カード追加・編集・削除・D&Dの動作確認は各タスクで既に完了済み

**依存**: Task 7

**推定時間**: 45分

---

## 実装順序（機能単位で縦に切る）

```
Task 1: HTML + CSS + ダミーカード
  → 見た目確認 ✅

Task 2: インフラ（constants, storage, 初期化）
  → コンソールで動作確認 ✅

Task 3: カード追加（データ処理のみ）
  → localStorage確認 ✅

Task 4: カード表示 + カード追加（UI統合）
  → ボタンで追加できて画面に表示される ✅✅✅

Task 5: カード編集
  → ボタンで編集できる ✅✅✅

Task 6: カード削除
  → ボタンで削除できる ✅✅✅

Task 7: ドラッグ&ドロップ
  → D&Dで移動できる ✅✅✅

Task 8: 最終確認
  → 完成 🎉
```

---

## リスクと対策

- **リスク**: 追加と表示を混同する
  - **対策**: Task 3はデータ処理のみ、Task 4でUIと統合して動作確認
- **リスク**: localStorage無効環境での動作
  - **対策**: Task 8でエラーハンドリングを確認

---

## 注意事項

- **機能単位で縦に実装**: Task 3でデータ処理、Task 4でUIと統合して動作確認
- **各タスク完了時にブラウザで動作確認必須**
- JavaScriptファイルを追加したら `index.html` に `<script>` タグを追加
- エラーは `throw new Error()` で投げる
- メッセージは関数内に直接書く

---

## 実装開始ガイド

1. **Task 1から順次実装**（飛ばさない）
2. 各タスクの開始時にTodoWriteで`in_progress`に更新
3. **完了時は必ずブラウザで動作確認してから`completed`に更新**
4. 問題発生時は速やかに報告

**最重要**: 各タスクで何を確認するか明確に！localStorageでもコンソールでも画面でもOK！
