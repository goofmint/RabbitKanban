# Task 8: カード検索・フィルタリング機能の実装

## 概要

カンバンボードに表示されているカードを検索し、特定のキーワードやカラムで絞り込む機能を実装します。ユーザーが検索バーに文字を入力すると、該当するカードのみが表示され、検索キーワードがハイライト表示されます。また、カラムフィルターボタンで特定のカラムのみを表示できます。

## 目的

- カード内容で検索可能にする
- 検索キーワードをハイライト表示して視認性を向上
- カラムごとにフィルタリング可能にする
- 検索とフィルターを組み合わせて使用可能にする
- リアルタイム検索でユーザー体験を向上

## 実装範囲

### 1. 状態管理層（`js/search-filter.js`）

#### モジュール内部state

**概要**: 検索キーワードとアクティブフィルターの状態を管理します。

```javascript
let searchKeyword = '';
let activeFilter = 'all';
```

---

#### `setSearchKeyword(keyword)`

**概要**: 検索キーワードを設定します。

**引数**:
- `keyword` (string): 検索キーワード

**戻り値**: なし

**処理内容**:
1. 引数の`keyword`を小文字に変換（大文字小文字を区別しない検索のため）
2. `searchKeyword`変数に設定
3. トリムして前後の空白を削除

---

#### `setActiveFilter(columnId)`

**概要**: アクティブなカラムフィルターを設定します。

**引数**:
- `columnId` (string): フィルター対象のカラムID（'all' | 'todo' | 'inprogress' | 'done'）

**戻り値**: なし

**処理内容**:
1. 引数の`columnId`をバリデーション（'all', 'todo', 'inprogress', 'done'のいずれか）
2. `activeFilter`変数に設定

---

#### `getSearchKeyword()`

**概要**: 現在の検索キーワードを取得します。

**引数**: なし

**戻り値**: (string) 検索キーワード

**処理内容**:
1. `searchKeyword`変数を返す

---

#### `getActiveFilter()`

**概要**: 現在のアクティブフィルターを取得します。

**引数**: なし

**戻り値**: (string) アクティブフィルター

**処理内容**:
1. `activeFilter`変数を返す

---

#### `shouldShowCard(card)`

**概要**: カードを表示すべきかどうかを判定します。

**引数**:
- `card` (Object): カードオブジェクト

**戻り値**: (boolean) 表示する場合true、非表示の場合false

**処理内容**:
1. 検索キーワードが空でない場合:
   - カードの内容を小文字に変換
   - 検索キーワードが含まれているかチェック
   - 含まれていない場合はfalseを返す
2. アクティブフィルターが'all'でない場合:
   - カードのcolumnIdとアクティブフィルターが一致するかチェック
   - 一致しない場合はfalseを返す
3. すべての条件を満たす場合はtrueを返す

---

### 2. UI層の更新（`js/ui-renderer.js`）

#### `renderColumnCards(columnId)`の更新

**概要**: 指定されたカラムのカードを表示する際に、検索・フィルター条件を適用します。

**更新内容**:
- カードのループ処理内で`shouldShowCard(card)`を呼び出し
- 表示すべきでないカードは`.d-none`クラスを追加して非表示
- 表示すべきカードは`.d-none`クラスを削除

---

#### `highlightSearchText(text, keyword)`

**概要**: テキスト内の検索キーワードをハイライト表示します。

**引数**:
- `text` (string): 元のテキスト
- `keyword` (string): ハイライトするキーワード

**戻り値**: (string) ハイライト処理後のHTML文字列

**処理内容**:
1. keywordが空の場合は元のテキストをそのまま返す
2. テキストをエスケープしてXSS対策
3. 大文字小文字を区別せずにキーワードを検索
4. 一致する部分を`<mark>`タグで囲む
5. HTMLエスケープされたテキストを返す

**注意**: XSS対策のため、必ずテキストをエスケープしてから`<mark>`タグを追加

---

#### `createCardElement(card)`の更新

**概要**: カード要素を作成する際に、検索キーワードがある場合はハイライト表示します。

**更新内容**:
- `getSearchKeyword()`で現在の検索キーワードを取得
- 検索キーワードが空でない場合、`highlightSearchText()`を使用
- `.card-content`要素に`innerHTML`で設定（`textContent`ではなく`innerHTML`を使用）

---

### 3. イベントハンドラー層（`js/event-handler.js`）

#### `setupSearchListener()`

**概要**: 検索バーの入力イベントリスナーを設定します。

**引数**: なし

**戻り値**: なし

**処理内容**:
1. 検索入力欄を取得（`#searchInput`）
2. デバウンス用のタイマーIDを保持する変数を定義
3. `input`イベントリスナーを設定:
   - 既存のタイマーをクリア
   - 300ms後に`handleSearch()`を呼び出すタイマーを設定

**デバウンス処理**: ユーザーの入力が止まってから300ms後に検索を実行することで、パフォーマンスを最適化

---

#### `setupFilterListeners()`

**概要**: フィルターボタンのクリックイベントリスナーを設定します。

**引数**: なし

**戻り値**: なし

**処理内容**:
1. すべてのフィルターボタンを取得（`.filter-btn`）
2. 各ボタンに`click`イベントリスナーを設定:
   - ボタンの`data-filter`属性からフィルターIDを取得
   - `handleFilter(filterId)`を呼び出す

---

#### `handleSearch(keyword)`

**概要**: 検索処理を実行します。

**引数**:
- `keyword` (string): 検索キーワード

**戻り値**: なし

**処理内容**:
1. `setSearchKeyword(keyword)`で検索キーワードを設定
2. `renderAllCards()`で全カラムを再描画
3. 検索結果が0件の場合、メッセージを表示（オプション）

---

#### `handleFilter(filterId)`

**概要**: フィルター処理を実行します。

**引数**:
- `filterId` (string): フィルターID（'all' | 'todo' | 'inprogress' | 'done'）

**戻り値**: なし

**処理内容**:
1. `setActiveFilter(filterId)`でアクティブフィルターを設定
2. すべてのフィルターボタンから`.active`クラスを削除
3. クリックされたボタンに`.active`クラスを追加（視覚的フィードバック）
4. `renderAllCards()`で全カラムを再描画

---

#### `setupEventListeners()`の更新

**概要**: すべてのイベントリスナーを設定します。

**更新内容**:
- 既存の関数呼び出しに加えて、以下を追加:
  - `setupSearchListener()`
  - `setupFilterListeners()`

---

### 4. HTMLの更新（`index.html`）

#### 検索バーの追加

**配置**: ヘッダーの下、3カラムレイアウトの上

```html
<div class="mb-3">
  <div class="row g-2">
    <div class="col-md-6">
      <div class="input-group">
        <input type="text"
               class="form-control"
               id="searchInput"
               placeholder="カードを検索..."
               aria-label="カードを検索">
        <button class="btn btn-outline-secondary"
                type="button"
                id="clearSearchBtn">
          クリア
        </button>
      </div>
    </div>
    <div class="col-md-6">
      <!-- フィルターボタンエリア -->
    </div>
  </div>
</div>
```

---

#### フィルターボタンの追加

```html
<div class="btn-group" role="group" aria-label="カラムフィルター">
  <button type="button"
          class="btn btn-outline-primary filter-btn active"
          data-filter="all">
    全て
  </button>
  <button type="button"
          class="btn btn-outline-primary filter-btn"
          data-filter="todo">
    To Do
  </button>
  <button type="button"
          class="btn btn-outline-primary filter-btn"
          data-filter="inprogress">
    In Progress
  </button>
  <button type="button"
          class="btn btn-outline-primary filter-btn"
          data-filter="done">
    Done
  </button>
</div>
```

---

#### スクリプトタグの追加

`js/search-filter.js`を他のスクリプトの前に読み込む（`event-handler.js`の前）:

```html
<script src="js/search-filter.js"></script>
```

---

## データフロー

### 検索フロー

```text
ユーザー操作
    ↓
1. 検索バーに文字を入力
    ↓
2. setupSearchListener()がinputイベントをキャッチ
    ↓
3. デバウンス処理（300ms待機）
    ↓
4. handleSearch(keyword)が実行される
    - setSearchKeyword(keyword)で検索キーワードを設定
    ↓
5. renderAllCards()で全カラムを再描画
    ↓
6. renderColumnCards(columnId)内で各カードをループ
    - shouldShowCard(card)でカードの表示判定
    - 表示すべきでないカードに.d-noneクラスを追加
    - 表示すべきカードの.d-noneクラスを削除
    ↓
7. createCardElement(card)でカード要素を作成
    - getSearchKeyword()で検索キーワードを取得
    - highlightSearchText()でキーワードをハイライト
    ↓
8. 画面に表示（該当カードのみ表示、キーワードがハイライト）
```

### フィルターフロー

```text
ユーザー操作
    ↓
1. フィルターボタンをクリック
    ↓
2. setupFilterListeners()がclickイベントをキャッチ
    ↓
3. handleFilter(filterId)が実行される
    - setActiveFilter(filterId)でアクティブフィルターを設定
    - フィルターボタンの.activeクラスを更新
    ↓
4. renderAllCards()で全カラムを再描画
    ↓
5. renderColumnCards(columnId)内で各カードをループ
    - shouldShowCard(card)でカードの表示判定
    - フィルター条件を満たさないカードに.d-noneクラスを追加
    ↓
6. 画面に表示（フィルター条件を満たすカードのみ表示）
```

## 修正ファイル一覧

1. `js/search-filter.js`（新規作成）
   - `setSearchKeyword(keyword)` 関数を追加
   - `setActiveFilter(columnId)` 関数を追加
   - `getSearchKeyword()` 関数を追加
   - `getActiveFilter()` 関数を追加
   - `shouldShowCard(card)` 関数を追加

2. `js/ui-renderer.js`
   - `renderColumnCards(columnId)` 関数を更新
   - `highlightSearchText(text, keyword)` 関数を追加
   - `createCardElement(card)` 関数を更新

3. `js/event-handler.js`
   - `setupSearchListener()` 関数を追加
   - `setupFilterListeners()` 関数を追加
   - `handleSearch(keyword)` 関数を追加
   - `handleFilter(filterId)` 関数を追加
   - `setupEventListeners()` 関数を更新

4. `index.html`
   - 検索バーのHTMLを追加
   - フィルターボタンのHTMLを追加
   - `js/search-filter.js`のスクリプトタグを追加

## 動作確認項目

- [ ] 検索バーに文字を入力すると該当カードのみ表示される
- [ ] 検索キーワードがハイライト表示される
- [ ] 検索は大文字小文字を区別しない
- [ ] デバウンス処理が機能している（入力中は検索が実行されない）
- [ ] クリアボタンで検索がリセットされる
- [ ] フィルターボタンで特定のカラムのみ表示される
- [ ] フィルターボタンのアクティブ状態が視覚的にわかる
- [ ] 検索とフィルターを組み合わせて使用できる
- [ ] 検索結果が0件の時も正常に動作する
- [ ] カードの追加・編集・削除・移動後も検索・フィルターが維持される

## 注意事項

1. **XSS対策**:
   - `highlightSearchText()`でテキストを必ずエスケープ
   - `<mark>`タグのみを安全に挿入

2. **パフォーマンス**:
   - デバウンス処理で検索頻度を制限（300ms）
   - DOM操作を最小限に（`.d-none`クラスの追加/削除のみ）

3. **大文字小文字の扱い**:
   - 検索キーワードとカード内容を両方小文字に変換して比較
   - ユーザーフレンドリーな検索体験

4. **状態管理**:
   - 検索キーワードとフィルターはモジュールスコープの変数で管理
   - 他の機能（カード追加等）実行後も状態を維持

5. **視覚的フィードバック**:
   - フィルターボタンに`.active`クラスで現在の状態を表示
   - 検索キーワードを`<mark>`タグでハイライト

6. **デグレーション防止**:
   - 既存のカード追加・編集・削除・移動機能が正常に動作することを確認
   - 検索・フィルター機能が他の機能に影響を与えないことを確認

## 完了条件

- すべての動作確認項目がチェック済みであること
- 検索・フィルタリング機能が完全に動作すること
- 既存のすべての機能が正常に動作し続けること
- パフォーマンスが良好であること（デバウンス処理が機能）
- XSS対策が適切に実装されていること
