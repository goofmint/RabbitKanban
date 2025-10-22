# Task 2: 基礎インフラの実装

## 概要

カンバンアプリの基礎となるインフラを実装する。このタスクでは、定数定義、localStorage操作、データ管理の初期化を行う。UIとの連携はまだ行わず、コンソールから動作確認できる状態を作る。

## 実装内容

### 1. `js/` ディレクトリを作成

プロジェクトルートに `js/` ディレクトリを作成する。

```bash
mkdir js
```

**目的**: JavaScriptファイルを整理し、プロジェクト構造を明確にする。

---

### 2. `js/constants.js` を作成 - `STORAGE_KEY = 'kanban_data'` 定義

`js/constants.js` ファイルを作成し、localStorageのキー名を定義する。

```javascript
// constants.js - アプリケーション全体で使用する定数

/**
 * localStorageのキー名
 * カンバンボードのデータを保存する際のキーとして使用
 */
const STORAGE_KEY = 'kanban_data';
```

**目的**: localStorageのキー名を一箇所で管理し、複数箇所で同じ文字列を書くのを避ける。

**注意**:
- この定数は `storage.js` で使用される
- 変更する場合はこのファイルのみを修正すれば良い

---

### 3. `js/constants.js` を作成 - `COLUMNS` 配列定義

同じく `js/constants.js` に、カラムの定義を配列で定義する。

```javascript
/**
 * カラム定義
 * カンバンボードの3つのカラムを定義
 * id: カラムを識別するための一意な文字列（data-column-id属性と対応）
 * name: カラムの表示名（現時点では未使用だが、将来的な拡張のために定義）
 */
const COLUMNS = [
  { id: 'todo', name: 'To Do' },
  { id: 'inprogress', name: 'In Progress' },
  { id: 'done', name: 'Done' }
];
```

**目的**:
- カラムIDの一覧を一箇所で管理
- カラムIDのバリデーションに使用（`isValidColumnId()`関数で使用）
- 将来的なカラムの追加・削除を容易にする

**注意**:
- `id` は `index.html` の `data-column-id` 属性と完全に一致する必要がある
- `name` は現時点では使用しないが、将来的な拡張のために定義

---

### 4. `js/storage.js` を作成 - `isStorageAvailable()` 実装

`js/storage.js` ファイルを作成し、localStorageが利用可能かチェックする関数を実装する。

```javascript
// storage.js - localStorage操作を担当

/**
 * localStorageが利用可能かチェックする
 * プライベートモード等でlocalStorageが無効な場合、例外が発生する
 *
 * @returns {boolean} localStorageが利用可能な場合true、そうでない場合false
 */
function isStorageAvailable() {
  // try-catchでlocalStorageへのアクセスを試行
  // プライベートモードや設定で無効化されている場合、例外が発生する
  // 実際にデータを書き込み・読み込み・削除してテストする
  // 戻り値: 利用可能ならtrue、不可能ならfalse
}
```

**目的**:
- localStorageが利用可能か安全に確認する
- プライベートモード等でエラーが発生するのを防ぐ

**実装の考え方**:
1. `try-catch` で例外をキャッチ
2. テストデータを書き込んで読み込めるか確認
3. テストデータを削除
4. すべて成功したら `true` を返す

**注意**:
- この関数は `app.js` の初期化時に呼ばれる（Task 4で実装）
- localStorage無効時は警告を表示してメモリ上で動作継続する（Task 8で実装）

---

### 5. `js/storage.js` を作成 - `loadFromStorage()` 実装

同じく `js/storage.js` に、localStorageからデータを読み込む関数を実装する。

```javascript
/**
 * localStorageからカンバンデータを読み込む
 * データが存在しない場合や、JSON解析に失敗した場合は空配列を返す
 *
 * @returns {Array} カードオブジェクトの配列。データがない場合は空配列
 */
function loadFromStorage() {
  // localStorage.getItem()でSTORAGE_KEYに対応するデータを取得
  // データが存在しない場合（初回起動時）はnullが返る → 空配列を返す
  // JSON.parse()でJSON文字列をオブジェクトに変換
  // JSON解析に失敗した場合（データが壊れている場合）は空配列を返す
  // 戻り値: カードオブジェクトの配列 or []
}
```

**目的**:
- localStorageに保存されたカンバンデータを読み込む
- エラーが発生しても安全に空配列を返す

**実装の考え方**:
1. `localStorage.getItem(STORAGE_KEY)` でデータ取得
2. データが `null` の場合（初回起動時）は `[]` を返す
3. `JSON.parse()` でパース
4. パースに失敗したら `[]` を返す

**データ形式**:
```javascript
// localStorage保存形式（JSON文字列）
[
  {
    id: "card-1634567890123-abc",
    content: "タスクの内容",
    columnId: "todo",
    createdAt: 1634567890123,
    updatedAt: 1634567890123
  },
  // ...
]
```

**注意**:
- この関数は `data-manager.js` の `initializeData()` で呼ばれる
- エラー時も必ず配列を返すことで、呼び出し側のエラーハンドリングを簡略化

---

### 6. `js/storage.js` を作成 - `saveToStorage(cards)` 実装

同じく `js/storage.js` に、localStorageにデータを保存する関数を実装する。

```javascript
/**
 * カンバンデータをlocalStorageに保存する
 *
 * @param {Array} cards - カードオブジェクトの配列
 */
function saveToStorage(cards) {
  // JSON.stringify()でオブジェクトをJSON文字列に変換
  // localStorage.setItem()でSTORAGE_KEYに保存
  // 例外が発生する可能性があるため、呼び出し側でtry-catchが必要（Task 4以降で実装）
}
```

**目的**:
- カンバンデータをlocalStorageに保存する
- カードの追加・編集・削除・移動時に呼ばれる

**実装の考え方**:
1. `JSON.stringify(cards)` でJSON文字列に変換
2. `localStorage.setItem(STORAGE_KEY, jsonString)` で保存

**注意**:
- この関数は `data-manager.js` の各操作関数（`addCard()`, `updateCard()`, etc.）で呼ばれる
- localStorage容量制限超過時は例外が発生する（呼び出し側でハンドリング）
- この関数自体は例外を投げることがあるので、呼び出し側でtry-catchが必要

---

### 7. `js/data-manager.js` を作成 - `cardsData = []` 内部state定義

`js/data-manager.js` ファイルを作成し、カードデータを保持する内部stateを定義する。

```javascript
// data-manager.js - カードデータのCRUD操作を担当

/**
 * カードデータの内部state
 * アプリケーション起動時にlocalStorageから読み込み、メモリ上に保持
 * すべてのカード操作はこの配列に対して行われる
 */
let cardsData = [];
```

**目的**:
- カードデータをメモリ上に保持する
- 毎回localStorageから読み込む必要をなくし、パフォーマンスを向上

**注意**:
- この変数はモジュール内でのみアクセス可能（プライベート）
- 外部からは `getAllCards()`, `getCardsByColumn()` 等のゲッター関数経由でアクセス
- データの変更は必ず `saveToStorage(cardsData)` を呼んで永続化する

---

### 8. `js/data-manager.js` を作成 - `initializeData()` 実装（loadFromStorageを呼ぶだけ）

同じく `js/data-manager.js` に、データを初期化する関数を実装する。

```javascript
/**
 * カードデータを初期化する
 * アプリケーション起動時に1度だけ呼ばれる
 * localStorageからデータを読み込んでcardsDataに格納する
 */
function initializeData() {
  // loadFromStorage()を呼び出してlocalStorageからデータを読み込む
  // 読み込んだデータをcardsDataに代入
  // これ以降、cardsDataに対してすべての操作を行う
}
```

**目的**:
- アプリケーション起動時にlocalStorageからデータを読み込む
- cardsDataを初期化する

**実装の考え方**:
1. `loadFromStorage()` を呼び出す
2. 戻り値を `cardsData` に代入

**注意**:
- この関数は `app.js` の初期化フローで呼ばれる（Task 4で実装）
- 起動時に1度だけ呼ばれ、それ以降は呼ばれない

---

### 9. `js/data-manager.js` を作成 - `generateCardId()` 実装

同じく `js/data-manager.js` に、カードIDを生成する関数を実装する。

```javascript
/**
 * ユニークなカードIDを生成する
 * フォーマット: "card-{タイムスタンプ}-{ランダム文字列}"
 *
 * @returns {string} 生成されたカードID
 */
function generateCardId() {
  // Date.now()で現在のタイムスタンプを取得
  // Math.random()でランダムな数値を生成
  // toString(36)で36進数文字列に変換（0-9, a-z）
  // substr(2, 9)で先頭2文字（"0."）を削除し、9文字取得
  // フォーマット: "card-1634567890123-abc123def"
  // 戻り値: ユニークなID文字列
}
```

**目的**:
- 各カードに一意なIDを付与する
- タイムスタンプとランダム文字列の組み合わせで衝突を防ぐ

**実装の考え方**:
1. `Date.now()` でタイムスタンプ取得
2. `Math.random().toString(36).substr(2, 9)` でランダム文字列生成
3. `"card-{timestamp}-{random}"` のフォーマットで結合

**注意**:
- この関数は `addCard()` で新規カード作成時に呼ばれる（Task 3で実装）
- IDはHTML要素の `data-card-id` 属性として使用される

---

### 10. `js/data-manager.js` を作成 - `isValidColumnId(columnId)` 実装

同じく `js/data-manager.js` に、カラムIDが有効かチェックする関数を実装する。

```javascript
/**
 * カラムIDが有効かチェックする
 * COLUMNS配列に定義されているIDのみ有効とする
 *
 * @param {string} columnId - チェックするカラムID
 * @returns {boolean} 有効なカラムIDの場合true、そうでない場合false
 */
function isValidColumnId(columnId) {
  // COLUMNS配列をループして、columnIdが存在するかチェック
  // COLUMNS.some()やCOLUMNS.find()を使用
  // 戻り値: 有効ならtrue、無効ならfalse
}
```

**目的**:
- カラムIDのバリデーションを行う
- 不正なカラムIDでのカード操作を防ぐ

**実装の考え方**:
1. `COLUMNS.some(col => col.id === columnId)` で存在チェック
2. 存在すれば `true`、存在しなければ `false` を返す

**注意**:
- この関数は `addCard()`, `moveCard()` 等でバリデーションに使用される（Task 3以降で実装）
- 不正なカラムIDの場合、呼び出し側でエラーを投げる

---

### 11. `index.html` に `<script>` タグを追加（constants, storage, data-manager）

`index.html` の `</body>` 直前に、作成したJavaScriptファイルを読み込む `<script>` タグを追加する。

```html
  <!-- Iconify -->
  <script src="https://code.iconify.design/3/3.1.0/iconify.min.js"></script>

  <!-- Kanban App JavaScript -->
  <!-- 読み込み順序が重要: constants → storage → data-manager -->
  <script src="js/constants.js"></script>
  <script src="js/storage.js"></script>
  <script src="js/data-manager.js"></script>
</body>
</html>
```

**目的**:
- 作成したJavaScriptファイルをブラウザで読み込めるようにする
- 依存関係に従って正しい順序で読み込む

**読み込み順序の理由**:
1. `constants.js`: 他のファイルで使用する定数を定義（依存なし）
2. `storage.js`: `STORAGE_KEY` を使用（`constants.js` に依存）
3. `data-manager.js`: `COLUMNS` を使用し、`loadFromStorage()`, `saveToStorage()` を呼び出す（`constants.js`, `storage.js` に依存）

**注意**:
- 順序を間違えると、未定義エラーが発生する
- 将来的に他のJavaScriptファイルを追加する際も、依存関係を考慮する

---

### 12. 動作確認: コンソールで `isStorageAvailable()` を実行してtrueが返る

ブラウザで `index.html` を開き、開発者ツールのコンソールで動作確認を行う。

```javascript
// ブラウザのコンソールで実行
isStorageAvailable()
// 期待される結果: true
```

**確認方法**:
1. `index.html` をブラウザで開く
2. 開発者ツール（F12）を開く
3. コンソールタブに移動
4. `isStorageAvailable()` を入力してEnter
5. `true` が返ることを確認

**目的**:
- `isStorageAvailable()` 関数が正しく実装されているか確認
- localStorageが利用可能な環境であることを確認

**注意**:
- プライベートモードで実行すると `false` が返る場合がある（正常な動作）

---

### 13. 動作確認: コンソールで `initializeData()` を実行してエラーが出ない

同じくブラウザのコンソールで `initializeData()` を実行し、エラーが出ないことを確認する。

```javascript
// ブラウザのコンソールで実行
initializeData()
// 期待される結果: undefinedが返り、エラーが出ない

// cardsDataの中身を確認（空配列が表示される）
cardsData
// 期待される結果: []
```

**確認方法**:
1. コンソールで `initializeData()` を入力してEnter
2. エラーが出ないことを確認（`undefined` が返る）
3. `cardsData` を入力してEnter
4. 空配列 `[]` が表示されることを確認

**目的**:
- `initializeData()` 関数が正しく実装されているか確認
- localStorageからのデータ読み込みが動作することを確認
- 初回起動時は空配列が返ることを確認

**追加確認**:
```javascript
// テストデータを手動でlocalStorageに保存
localStorage.setItem('kanban_data', JSON.stringify([
  { id: 'test-1', content: 'テスト', columnId: 'todo', createdAt: Date.now(), updatedAt: Date.now() }
]))

// 再度初期化
initializeData()

// cardsDataにデータが読み込まれているか確認
cardsData
// 期待される結果: [{ id: 'test-1', content: 'テスト', ... }]
```

**注意**:
- この時点ではUIには何も表示されない（UIの実装はTask 4）
- コンソールから直接 `cardsData` にアクセスできることを確認

---

## 完了条件

- `js/` ディレクトリが作成されている
- `js/constants.js` が作成され、`STORAGE_KEY` と `COLUMNS` が定義されている
- `js/storage.js` が作成され、3つの関数が実装されている
  - `isStorageAvailable()`
  - `loadFromStorage()`
  - `saveToStorage(cards)`
- `js/data-manager.js` が作成され、以下が実装されている
  - `cardsData` 変数
  - `initializeData()` 関数
  - `generateCardId()` 関数
  - `isValidColumnId(columnId)` 関数
- `index.html` に `<script>` タグが追加されている
- コンソールで `isStorageAvailable()` を実行して `true` が返る
- コンソールで `initializeData()` を実行してエラーが出ない
- コンソールで `cardsData` を確認して配列が表示される

## 次のタスク

Task 3: カード追加（データ処理）→localStorage確認
