# Task 5: カード編集機能の実装

## 概要

カンバンボードに表示されているカードの内容を編集する機能を実装します。ユーザーがカードの編集ボタン（✏️）をクリックすると、モーダルが開き、カードの内容を編集できます。

## 目的

- 既存カードの内容を変更可能にする
- 編集内容をlocalStorageに永続化する
- 編集後の内容を即座に画面に反映する

## 実装範囲

### 1. データ管理層（`js/data-manager.js`）

#### `updateCard(cardId, newContent)`

**概要**: 指定されたカードの内容を更新します。

**引数**:
- `cardId` (string): 更新対象のカードID
- `newContent` (string): 新しいカード内容

**戻り値**: 更新されたカードオブジェクト（`columnId`を含む）

**処理内容**:
1. `newContent`のバリデーションを実施
   - 空文字列チェック
   - 500文字制限チェック
2. `cardsData`配列から`cardId`に一致するカードを検索
3. カードが見つからない場合はエラーをスロー
4. カードの`content`プロパティを`newContent`で更新
5. カードの`updatedAt`プロパティを現在日時で更新
6. `saveToStorage(cardsData)`を呼び出して永続化
7. 更新されたカードオブジェクトを返す
8. エラーが発生した場合は`throw new Error()`でエラーメッセージを投げる

**エラーケース**:
- カード内容が空文字列の場合
- カード内容が500文字を超える場合
- 指定されたカードIDが存在しない場合

---

### 2. モーダル管理層（`js/modal.js`）

#### `openEditModal(cardId)`

**概要**: 編集モード用にモーダルを開きます。

**引数**:
- `cardId` (string): 編集対象のカードID

**戻り値**: なし

**処理内容**:
1. `currentMode`を`'edit'`に設定
2. `currentCardId`に`cardId`を保存
3. `getAllCards()`を呼び出してすべてのカードデータを取得
4. 取得したカードデータから`cardId`に一致するカードを検索
5. カードが見つかった場合、モーダルのタイトルを「カード編集」に設定
6. モーダルの入力欄にカードの現在の`content`を設定
7. モーダルの保存ボタンのテキストを「更新」に設定
8. Bootstrap Modalの`show()`メソッドを呼び出してモーダルを表示

#### `getCurrentCardId()`

**概要**: 現在編集中のカードIDを取得します。

**引数**: なし

**戻り値**:
- (string | null): 現在のカードID、または編集モードでない場合は`null`

**処理内容**:
1. `currentCardId`の値を返す

---

### 3. イベントハンドラー層（`js/event-handler.js`）

#### `handleModalSubmit()`の更新

**概要**: モーダルフォームの送信を処理します（追加モードと編集モードの両方に対応）。

**引数**: なし

**戻り値**: なし

**処理内容**:
1. `getModalInput()`でユーザーが入力した内容を取得
2. `getModalMode()`で現在のモード（`'add'`または`'edit'`）を取得
3. モードが`'add'`の場合は`handleAddCard(content)`を呼び出す
4. モードが`'edit'`の場合は`handleEditCard(content)`を呼び出す

#### `handleEditCard(newContent)`

**概要**: カード編集処理を実行します。

**引数**:
- `newContent` (string): 編集後のカード内容

**戻り値**: なし

**処理内容**:
1. `getCurrentCardId()`で編集対象のカードIDを取得
2. カードIDが`null`の場合、エラーメッセージを表示して早期リターン
   - `showMessage('カードが選択されていません', 'danger')`を呼び出す
   - 処理を終了
3. `try-catch`ブロック内で以下を実行:
   - `updateCard(cardId, newContent)`を呼び出してカードを更新し、更新されたカードオブジェクトを取得
   - 更新されたカードの`columnId`を使用して`renderColumnCards(columnId)`を呼び出し、該当カラムを再描画
   - `closeModal()`でモーダルを閉じる
   - `showMessage('カードを更新しました', 'success')`で成功メッセージを表示
4. エラーが発生した場合:
   - `showMessage(error.message, 'danger')`でエラーメッセージを表示

#### `setupCardActionListeners()`

**概要**: カードのアクションボタン（編集ボタン）のイベントリスナーを設定します。

**引数**: なし

**戻り値**: なし

**処理内容**:
1. イベントデリゲーションを使用して、各カラムコンテナに`click`イベントリスナーを設定
2. クリックされた要素が編集ボタン（`.btn-edit-card`）かどうかを判定
3. 編集ボタンの場合、`data-card-id`属性からカードIDを取得
4. `openEditModal(cardId)`を呼び出してモーダルを開く

**実装パターン**:
- 各カラムコンテナ（`.column-cards`）に対してイベントデリゲーションを実装
- 動的に追加されるカードにも対応できるようにする

#### `setupEventListeners()`の更新

**概要**: すべてのイベントリスナーをセットアップします。

**処理内容**:
- 既存の関数に加えて`setupCardActionListeners()`を呼び出す

---

## データフロー

```
ユーザー操作
    ↓
1. カードの編集ボタン（✏️）クリック
    ↓
2. setupCardActionListeners() がイベントをキャッチ
    ↓
3. openEditModal(cardId) でモーダルを開く
    - モーダルに現在のカード内容を表示
    ↓
4. ユーザーが内容を編集して保存ボタンをクリック
    ↓
5. handleModalSubmit() が呼ばれる
    ↓
6. handleEditCard(newContent) が実行される
    - getCurrentCardId() でカードIDを取得
    - カードIDがnullの場合は早期リターン
    ↓
7. updateCard(cardId, newContent) でデータを更新
    - バリデーション
    - cardsData配列内のカードを更新
    - updatedAtを更新
    - localStorageに保存
    - 更新されたカードオブジェクト（columnIdを含む）を返す
    ↓
8. 返されたカードの columnId を使用して renderColumnCards(columnId) で該当カラムを再描画
    ↓
9. closeModal() でモーダルを閉じる
    ↓
10. showMessage() で成功メッセージを表示
```

## 修正ファイル一覧

1. `js/data-manager.js`
   - `updateCard(cardId, newContent)` 関数を追加

2. `js/modal.js`
   - `openEditModal(cardId)` 関数を追加
   - `getCurrentCardId()` 関数を追加

3. `js/event-handler.js`
   - `handleModalSubmit()` 関数を更新（editモード対応）
   - `handleEditCard(newContent)` 関数を追加
   - `setupCardActionListeners()` 関数を追加
   - `setupEventListeners()` 関数を更新

## 動作確認項目

- [ ] カードの「✏️」ボタンをクリックしてモーダルが開く
- [ ] モーダルに現在のカード内容が表示されている
- [ ] モーダルのタイトルが「カード編集」になっている
- [ ] 保存ボタンのテキストが「更新」になっている
- [ ] 内容を編集して保存すると、カードの内容が更新される
- [ ] 画面に更新された内容が即座に反映される
- [ ] 成功メッセージ「カードを更新しました」が表示される
- [ ] ページをリロードしても編集内容が保持されている
- [ ] 空文字列で保存しようとするとエラーメッセージが表示される
- [ ] 500文字を超える内容で保存しようとするとエラーメッセージが表示される

## 注意事項

1. **既存機能への影響を最小限に**:
   - 既存の`handleModalSubmit()`関数は、addモードとeditモードの両方に対応するよう更新しますが、addモードの動作は維持します
   - モーダルの構造は変更せず、モードに応じて表示内容を切り替えます

2. **エラーハンドリング**:
   - すべてのエラーは`throw new Error()`で投げます
   - エラーメッセージは具体的でわかりやすいものにします

3. **イベントデリゲーション**:
   - 動的に追加されるカードの編集ボタンにも対応できるよう、イベントデリゲーションを使用します

4. **デグレーション防止**:
   - 既存のカード追加機能が正常に動作することを確認します
   - 既存のモーダル動作（追加モード）が影響を受けないことを確認します

## 完了条件

- すべての動作確認項目がチェック済みであること
- カード編集機能が完全に動作すること
- 既存のカード追加機能が正常に動作し続けること
- エラーケースが適切に処理されること
