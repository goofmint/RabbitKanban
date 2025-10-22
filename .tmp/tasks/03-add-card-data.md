# Task 3: カード追加のデータ処理

## 概要

カード追加機能のデータ処理部分を実装する。このタスクでは、UIとの連携はまだ行わず、コンソールから `addCard()` 関数を呼び出してカードを追加し、localStorageに保存されることを確認する。

## 実装内容

### 1. `js/data-manager.js` に追加 - `addCard(content, columnId)` 実装

`js/data-manager.js` に、カードを追加する関数 `addCard()` を実装する。

```javascript
/**
 * カードを追加する
 * バリデーションを行い、カードオブジェクトを作成してcardsDataに追加し、localStorageに保存する
 *
 * @param {string} content - カードの内容（タスク内容）
 * @param {string} columnId - 追加先のカラムID（"todo" | "inprogress" | "done"）
 * @throws {Error} バリデーションエラーまたは保存エラー
 *
 * @example
 * addCard('新しいタスク', 'todo');
 * // cardsDataに追加され、localStorageに保存される
 */
function addCard(content, columnId) {
  // 1. バリデーション（空文字チェック）
  // 2. バリデーション（500文字制限チェック）
  // 3. バリデーション（カラムIDチェック）
  // 4. カードオブジェクトを作成
  // 5. cardsData.push(card) でメモリ上の配列に追加
  // 6. saveToStorage(cardsData) でlocalStorageに保存
  // エラー時は throw new Error() で例外を投げる
}
```

**目的**:
- カードをメモリ上の `cardsData` 配列に追加する
- localStorageに永続化する
- バリデーションを行い、不正なデータの追加を防ぐ

---

#### 1-1. バリデーション（空文字チェック）

カード内容が空文字または空白文字のみの場合、エラーを投げる。

```javascript
// 実装イメージ
if (!content || content.trim().length === 0) {
  throw new Error('カードの内容を入力してください');
}
```

**バリデーションの考え方**:
- `!content`: contentがnull、undefined、空文字の場合
- `content.trim().length === 0`: 空白文字のみの場合（例: "   "）
- エラーメッセージは日本語で明確に記述

**目的**:
- 空のカードが作成されるのを防ぐ
- ユーザーに明確なエラーメッセージを提供

---

#### 1-2. バリデーション（500文字制限チェック）

カード内容が500文字を超える場合、エラーを投げる。

```javascript
// 実装イメージ
if (content.length > 500) {
  throw new Error('カードの内容は500文字以内で入力してください');
}
```

**バリデーションの考え方**:
- `content.length > 500`: 文字数が500を超える場合
- 500文字という制限はHTML側の `maxlength="500"` と一致させる
- エラーメッセージで具体的な文字数制限を伝える

**目的**:
- 過度に長いテキストによるUI崩れを防ぐ
- localStorageの容量を節約する
- ユーザーに簡潔なタスク記述を促す

---

#### 1-3. バリデーション（カラムIDチェック）

カラムIDが有効かチェックし、不正な場合はエラーを投げる。

```javascript
// 実装イメージ
if (!isValidColumnId(columnId)) {
  throw new Error('カラムIDが不正です');
}
```

**バリデーションの考え方**:
- `isValidColumnId(columnId)` は既にTask 2で実装済み
- COLUMNS配列に定義されているIDのみ有効
- 不正なカラムIDでのカード追加を防ぐ

**目的**:
- 存在しないカラムへのカード追加を防ぐ
- データの整合性を保つ

---

#### 1-4. カードオブジェクトを作成

バリデーションを通過したら、カードオブジェクトを作成する。

```javascript
// 実装イメージ
const now = Date.now();
const card = {
  id: generateCardId(),
  content: content.trim(),
  columnId: columnId,
  createdAt: now,
  updatedAt: now
};
```

**カードオブジェクトの構造**:
- `id`: ユニークなカードID（`generateCardId()` で生成、Task 2で実装済み）
- `content`: カードの内容（trim()で前後の空白を削除）
- `columnId`: 追加先のカラムID
- `createdAt`: 作成日時（Unixタイムスタンプ、ミリ秒単位）
- `updatedAt`: 更新日時（作成時は createdAt と同じ値）

**実装の考え方**:
- `Date.now()` で現在のタイムスタンプを取得（ミリ秒単位）
- `content.trim()` で前後の空白を削除して保存
- `createdAt` と `updatedAt` は最初は同じ値

**目的**:
- 構造化されたデータを作成する
- 作成日時・更新日時を記録する（将来的なソート機能等で使用可能）

---

#### 1-5. `cardsData.push(card)` でメモリ上の配列に追加

作成したカードオブジェクトを `cardsData` 配列に追加する。

```javascript
// 実装イメージ
cardsData.push(card);
```

**実装の考え方**:
- `push()` メソッドで配列の末尾に追加
- `cardsData` はモジュールスコープの変数（Task 2で定義済み）

**目的**:
- メモリ上のデータを更新する
- 次のステップでlocalStorageに保存する準備

---

#### 1-6. `saveToStorage(cardsData)` でlocalStorageに保存

メモリ上の `cardsData` をlocalStorageに保存する。

```javascript
// 実装イメージ
saveToStorage(cardsData);
```

**実装の考え方**:
- `saveToStorage()` はTask 2で実装済み
- JSON.stringify()でJSON文字列に変換してlocalStorage.setItem()を呼ぶ
- 容量制限超過時は例外が発生する（そのまま投げる）

**目的**:
- データを永続化する
- ページリロード後もデータが残るようにする

**注意**:
- この関数は例外を投げる可能性がある
- 呼び出し側（UI側、Task 4で実装）でtry-catchでエラーハンドリングを行う
- このタスクではコンソールから呼び出すため、エラーはコンソールに表示される

---

#### 1-7. エラーは `throw new Error()` で投げる

すべてのバリデーションエラーや保存エラーは、`throw new Error()` で例外を投げる。

```javascript
// 実装イメージ（バリデーションエラー例）
if (!content || content.trim().length === 0) {
  throw new Error('カードの内容を入力してください');
}

if (content.length > 500) {
  throw new Error('カードの内容は500文字以内で入力してください');
}

if (!isValidColumnId(columnId)) {
  throw new Error('カラムIDが不正です');
}

// 実装イメージ（保存エラー例）
saveToStorage(cardsData); // 例外が発生する可能性がある（そのまま投げる）
```

**エラーハンドリングの考え方**:
- バリデーションエラーは明確な日本語メッセージで投げる
- `saveToStorage()` の例外はそのまま投げる（再スローしない）
- 呼び出し側でtry-catchでキャッチする（Task 4で実装）

**目的**:
- エラーを早期に検出する
- 呼び出し側で適切にエラー処理できるようにする
- コードをシンプルに保つ（if文のネストを浅くする）

---

### 2. 動作確認: コンソールで `addCard('テスト1', 'todo')` を実行

ブラウザで `index.html` を開き、開発者ツールのコンソールで動作確認を行う。

```javascript
// ブラウザのコンソールで実行
addCard('テスト1', 'todo')
// 期待される結果: undefinedが返り、エラーが出ない
```

**確認方法**:
1. `index.html` をブラウザで開く
2. 開発者ツール（F12）を開く
3. コンソールタブに移動
4. `addCard('テスト1', 'todo')` を入力してEnter
5. エラーが出ないことを確認（`undefined` が返る）

**確認項目**:
- [ ] エラーが出ない
- [ ] `undefined` が返る（関数が正常に終了）
- [ ] コンソールにエラーメッセージが表示されない

**目的**:
- `addCard()` 関数が正しく実装されているか確認
- バリデーションが通ることを確認
- エラーが発生しないことを確認

---

### 3. 動作確認: コンソールで `addCard('テスト2', 'inprogress')` を実行

同じくブラウザのコンソールで別のカラムにカードを追加する。

```javascript
// ブラウザのコンソールで実行
addCard('テスト2', 'inprogress')
// 期待される結果: undefinedが返り、エラーが出ない
```

**確認方法**:
1. コンソールで `addCard('テスト2', 'inprogress')` を入力してEnter
2. エラーが出ないことを確認（`undefined` が返る）

**確認項目**:
- [ ] エラーが出ない
- [ ] `undefined` が返る
- [ ] 異なるカラムID（'inprogress'）でも正常に動作する

**目的**:
- 複数のカラムにカードを追加できることを確認
- カラムIDのバリデーションが正しく動作することを確認

---

### 4. 動作確認: localStorage を開いて `kanban_data` にデータが保存されている

開発者ツールでlocalStorageを確認し、データが保存されていることを確認する。

**確認方法**:
1. 開発者ツール（F12）を開く
2. 「Application」タブ（Chromeの場合）または「Storage」タブ（Firefoxの場合）に移動
3. 左側のメニューから「Local Storage」を展開
4. 現在のURLを選択
5. `kanban_data` キーを探す
6. 値がJSON形式で保存されていることを確認

**期待される値の例**:
```json
[
  {
    "id": "card-1634567890123-abc123def",
    "content": "テスト1",
    "columnId": "todo",
    "createdAt": 1634567890123,
    "updatedAt": 1634567890123
  },
  {
    "id": "card-1634567890456-xyz789ghi",
    "content": "テスト2",
    "columnId": "inprogress",
    "createdAt": 1634567890456,
    "updatedAt": 1634567890456
  }
]
```

**確認項目**:
- [ ] `kanban_data` キーが存在する
- [ ] 値が配列のJSON文字列である
- [ ] 配列に2つのカードオブジェクトが含まれている
- [ ] 各カードに `id`, `content`, `columnId`, `createdAt`, `updatedAt` が含まれている
- [ ] `content` が "テスト1", "テスト2" である
- [ ] `columnId` が "todo", "inprogress" である

**目的**:
- `saveToStorage()` が正しく動作していることを確認
- データが永続化されていることを確認

---

### 5. 動作確認: ページリロードして `cardsData` にデータが残っている

ページをリロードして、データが保持されていることを確認する。

**確認方法**:
1. ブラウザでページをリロード（F5 または Cmd+R）
2. 開発者ツール（F12）を開く
3. コンソールタブに移動
4. `initializeData()` を実行（アプリ起動時に自動で呼ばれるが、手動で確認）
5. `cardsData` を入力してEnter
6. 配列に2つのカードが含まれていることを確認

**期待される結果**:
```javascript
cardsData
// 出力例:
// [
//   {
//     id: "card-1634567890123-abc123def",
//     content: "テスト1",
//     columnId: "todo",
//     createdAt: 1634567890123,
//     updatedAt: 1634567890123
//   },
//   {
//     id: "card-1634567890456-xyz789ghi",
//     content: "テスト2",
//     columnId: "inprogress",
//     createdAt: 1634567890456,
//     updatedAt: 1634567890456
//   }
// ]
```

**確認項目**:
- [ ] ページリロード後も `cardsData` にデータが存在する
- [ ] 配列に2つのカードオブジェクトが含まれている
- [ ] カードの内容が "テスト1", "テスト2" である
- [ ] カードのカラムIDが "todo", "inprogress" である

**目的**:
- `loadFromStorage()` が正しく動作していることを確認
- `initializeData()` が起動時にデータを読み込んでいることを確認
- データが永続化されていることを確認

---

## 追加のテスト（任意）

実装後、以下のテストも実行して、バリデーションが正しく動作することを確認する。

### バリデーションエラーのテスト

```javascript
// 空文字のテスト
addCard('', 'todo')
// 期待される結果: Error: カードの内容を入力してください

// 空白文字のみのテスト
addCard('   ', 'todo')
// 期待される結果: Error: カードの内容を入力してください

// 500文字超えのテスト
addCard('a'.repeat(501), 'todo')
// 期待される結果: Error: カードの内容は500文字以内で入力してください

// 不正なカラムIDのテスト
addCard('テスト', 'invalid')
// 期待される結果: Error: カラムIDが不正です
```

**確認項目**:
- [ ] 空文字でエラーが投げられる
- [ ] 空白文字のみでエラーが投げられる
- [ ] 500文字超えでエラーが投げられる
- [ ] 不正なカラムIDでエラーが投げられる
- [ ] エラーメッセージが明確でわかりやすい

---

## 完了条件

- `js/data-manager.js` に `addCard(content, columnId)` 関数が実装されている
- バリデーション（空文字、500文字制限、カラムID）が実装されている
- カードオブジェクトが正しく作成されている
- `cardsData.push()` でメモリ上の配列に追加されている
- `saveToStorage()` でlocalStorageに保存されている
- エラーは `throw new Error()` で投げられている
- コンソールで `addCard('テスト1', 'todo')` を実行してエラーが出ない
- コンソールで `addCard('テスト2', 'inprogress')` を実行してエラーが出ない
- localStorageに `kanban_data` が保存されている
- ページリロード後も `cardsData` にデータが残っている
- バリデーションエラーのテストが通る（任意）

## 次のタスク

Task 4: カード表示機能とカード追加UI実装 → ボタンで追加して画面に表示される
