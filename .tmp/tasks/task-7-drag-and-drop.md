# Task 7: ドラッグ&ドロップ機能の実装

## 概要

カンバンボードのカードをドラッグ&ドロップで別のカラムに移動できる機能を実装します。ユーザーがカードをドラッグして別のカラムにドロップすると、カードが移動し、その変更がlocalStorageに保存されます。

## 目的

- カードをドラッグ&ドロップで別のカラムに移動可能にする
- カードの移動状態をlocalStorageに永続化する
- 移動後の状態を即座に画面に反映する
- 視覚的なフィードバックを提供する（ドラッグ中のスタイル変更など）

## 実装範囲

### 1. データ管理層（`js/data-manager.js`）

#### `moveCard(cardId, newColumnId)`

**概要**: 指定されたカードを別のカラムに移動します。

**引数**:
- `cardId` (string): 移動対象のカードID
- `newColumnId` (string): 移動先のカラムID（'todo', 'inprogress', 'done'のいずれか）

**戻り値**: 移動されたカードオブジェクト

**処理内容**:
1. `isValidColumnId(newColumnId)`でカラムIDの妥当性を検証
2. カラムIDが不正な場合はエラーをスロー
3. `cardsData`配列から`cardId`に一致するカードを検索
4. カードが見つからない場合はエラーをスロー
5. カードの`columnId`を`newColumnId`に更新
6. カードの`updatedAt`を現在日時に更新
7. `saveToStorage(cardsData)`を呼び出して永続化
8. 更新されたカードオブジェクトを返す
9. エラーが発生した場合は`throw new Error()`でエラーメッセージを投げる

**エラーケース**:
- カラムIDが不正な場合（'todo', 'inprogress', 'done'以外）
- 指定されたカードIDが存在しない場合

---

### 2. イベントハンドラー層（`js/event-handler.js`）

#### `handleDragStart(event)`

**概要**: カードのドラッグ開始時の処理を実行します。

**引数**:
- `event` (DragEvent): ドラッグイベントオブジェクト

**戻り値**: なし

**処理内容**:
1. イベントターゲットから最も近い`.kanban-card`要素を取得
2. カード要素が見つからない場合は早期リターン
3. カード要素から`data-card-id`属性を取得してカードIDを取得
4. `event.dataTransfer.effectAllowed = 'move'`を設定
5. `event.dataTransfer.setData('text/plain', cardId)`でカードIDを転送データに設定
6. カード要素に`.dragging`クラスを追加（視覚的フィードバック用）

---

#### `handleDragOver(event)`

**概要**: カードがドロップ可能な領域上にある時の処理を実行します。

**引数**:
- `event` (DragEvent): ドラッグオーバーイベントオブジェクト

**戻り値**: なし

**処理内容**:
1. `event.preventDefault()`を呼び出してデフォルトの動作をキャンセル（ドロップを許可）
2. `event.dataTransfer.dropEffect = 'move'`を設定
3. イベントターゲットから最も近い`.kanban-column`要素を取得
4. カラム要素が見つかった場合、`.drag-over`クラスを追加（視覚的フィードバック用）

---

#### `handleDragEnd(event)`

**概要**: カードのドラッグ終了時の処理を実行します。

**引数**:
- `event` (DragEvent): ドラッグエンドイベントオブジェクト

**戻り値**: なし

**処理内容**:
1. イベントターゲットから最も近い`.kanban-card`要素を取得
2. カード要素が見つかった場合、`.dragging`クラスを削除
3. すべての`.kanban-column`要素から`.drag-over`クラスを削除

---

#### `handleDrop(event)`

**概要**: カードがドロップされた時の処理を実行します。

**引数**:
- `event` (DragEvent): ドロップイベントオブジェクト

**戻り値**: なし

**処理内容**:
1. `event.preventDefault()`を呼び出してデフォルトの動作をキャンセル
2. イベントターゲットから最も近い`.kanban-column`要素を取得
3. カラム要素が見つからない場合は早期リターン
4. カラム要素から`data-column-id`属性を取得して移動先カラムIDを取得
5. `event.dataTransfer.getData('text/plain')`でカードIDを取得
6. カード要素とすべてのカラム要素から`.dragging`と`.drag-over`クラスを削除
7. `try-catch`ブロック内で以下を実行:
   - `moveCard(cardId, newColumnId)`を呼び出してカードを移動
   - `renderAllCards()`を呼び出して全カラムを再描画
   - `showMessage('カードを移動しました', 'success')`で成功メッセージを表示
8. エラーが発生した場合:
   - `showMessage(error.message, 'danger')`でエラーメッセージを表示

---

#### `setupDragAndDropListeners()`

**概要**: ドラッグ&ドロップのイベントリスナーを設定します。

**引数**: なし

**戻り値**: なし

**処理内容**:
1. すべての`.kanban-column`要素を取得
2. 各カラム要素に以下のイベントリスナーを設定:
   - `dragstart`イベント: `handleDragStart`をバインド（イベントデリゲーション）
   - `dragover`イベント: `handleDragOver`をバインド
   - `dragend`イベント: `handleDragEnd`をバインド（イベントデリゲーション）
   - `drop`イベント: `handleDrop`をバインド

**実装パターン**:
- イベントデリゲーションを使用して、カラム要素にリスナーを設定
- `dragstart`と`dragend`は`.kanban-card`から発生するイベントをキャッチ
- `dragover`と`drop`は`.kanban-column`自体で処理

---

#### `setupEventListeners()`の更新

**概要**: すべてのイベントリスナーを設定します。

**更新内容**:
- 既存の`setupAddCardListeners()`, `setupModalFormListener()`, `setupModalCancelListener()`, `setupCardActionListeners()`に加えて、`setupDragAndDropListeners()`を呼び出すように更新

---

### 3. UI層の更新（`js/ui-renderer.js`）

#### `createCardElement(card)`の更新

**概要**: カード要素を作成する際に、`draggable`属性を設定します。

**更新内容**:
- カード要素に`draggable="true"`属性を設定

---

## データフロー

```text
ユーザー操作
    ↓
1. カードをドラッグ開始
    ↓
2. handleDragStart(event) が実行される
    - カードIDをdataTransferに設定
    - カード要素に.draggingクラスを追加
    ↓
3. カードを別のカラムの上にドラッグ
    ↓
4. handleDragOver(event) が実行される（繰り返し）
    - event.preventDefault()でドロップを許可
    - カラム要素に.drag-overクラスを追加
    ↓
5. カードをカラムにドロップ
    ↓
6. handleDrop(event) が実行される
    - dataTransferからカードIDを取得
    - カラムIDを取得
    - .draggingと.drag-overクラスを削除
    ↓
7. moveCard(cardId, newColumnId) でデータを更新
    - カード検索
    - columnIdとupdatedAtを更新
    - localStorageに保存
    - 更新されたカードオブジェクトを返す
    ↓
8. renderAllCards() で全カラムを再描画
    ↓
9. showMessage() で成功メッセージを表示
    ↓
10. handleDragEnd(event) が実行される
    - .draggingと.drag-overクラスを削除（クリーンアップ）
```

## 修正ファイル一覧

1. `js/data-manager.js`
   - `moveCard(cardId, newColumnId)` 関数を追加

2. `js/event-handler.js`
   - `handleDragStart(event)` 関数を追加
   - `handleDragOver(event)` 関数を追加
   - `handleDragEnd(event)` 関数を追加
   - `handleDrop(event)` 関数を追加
   - `setupDragAndDropListeners()` 関数を追加
   - `setupEventListeners()` 関数を更新（`setupDragAndDropListeners()`追加）

3. `js/ui-renderer.js`
   - `createCardElement(card)` 関数を更新（`draggable="true"`属性追加）

## 動作確認項目

- [ ] カードをドラッグできる（カーソルが変わる）
- [ ] ドラッグ中にカードに視覚的変化がある（`.dragging`クラス適用）
- [ ] カードを別のカラムの上に持っていくと、カラムに視覚的変化がある（`.drag-over`クラス適用）
- [ ] カードを別のカラムにドロップすると移動する
- [ ] 画面が即座に更新される（カードが新しいカラムに表示される）
- [ ] 成功メッセージ「カードを移動しました」が表示される
- [ ] ページをリロードしても移動先に残っている
- [ ] To Do → In Progress、In Progress → Done、Done → To Doなど、すべての組み合わせで移動できる
- [ ] 同じカラム内でドロップしても問題なく動作する
- [ ] 存在しないカラムIDでエラーメッセージが表示される

## 注意事項

1. **既存機能への影響を最小限に**:
   - 既存のカード追加・編集・削除機能が正常に動作し続けることを確認

2. **エラーハンドリング**:
   - すべてのエラーは`throw new Error()`で投げます
   - エラーメッセージは具体的でわかりやすいものにします

3. **視覚的フィードバック**:
   - ドラッグ中のカードには`.dragging`クラスを適用
   - ドロップ可能なカラムには`.drag-over`クラスを適用
   - これらのクラスのスタイルは`style.css`で定義済み

4. **draggable属性**:
   - カード要素に`draggable="true"`属性を設定してドラッグ可能にする
   - この属性がないとドラッグできない

5. **イベントデリゲーション**:
   - カード要素は動的に追加・削除されるため、イベントデリゲーションを使用
   - カラム要素にリスナーを設定し、カード要素からのイベントをキャッチ

6. **クリーンアップ**:
   - ドラッグ終了時に`.dragging`と`.drag-over`クラスを必ず削除
   - ドロップ成功時と失敗時の両方でクリーンアップを実行

7. **デグレーション防止**:
   - 既存のカード追加機能が正常に動作することを確認
   - 既存のカード編集機能が正常に動作することを確認
   - 既存のカード削除機能が正常に動作することを確認

## 完了条件

- すべての動作確認項目がチェック済みであること
- ドラッグ&ドロップ機能が完全に動作すること
- 既存のすべての機能が正常に動作し続けること
- エラーケースが適切に処理されること
