# Task 1: HTML構造とBootstrapの適用

## 概要

カンバンボードの基本的なHTML構造を作成し、Bootstrap 5.3を適用して見た目を整える。このタスクではJavaScriptの実装は行わず、静的なHTMLとCSSのみで視覚的に確認できる状態を作る。

## 実装内容

### 1. `index.html` を作成

基本的なHTML5のボイルプレートを作成する。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kanban Board</title>
</head>
<body>
  <!-- 以降の項目で内容を追加 -->
</body>
</html>
```

**目的**: HTML文書の基本構造を定義し、日本語対応とレスポンシブ対応の設定を行う。

---

### 2. Bootstrap 5.3 CDNを読み込み

`<head>` タグ内にBootstrap 5.3のCSSを読み込む。

```html
<head>
  <!-- 前略 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
        crossorigin="anonymous">
  <link rel="stylesheet" href="style.css">
</head>
```

**目的**: Bootstrapのスタイルを適用し、グリッドシステムやコンポーネントを使用可能にする。

---

### 3. 3カラムのレイアウトを作成（To Do / In Progress / Done）

Bootstrapのグリッドシステムを使用して3カラムレイアウトを作成する。

```html
<body>
  <div class="container-fluid py-4">
    <h1 class="text-center mb-4">Kanban Board</h1>

    <div class="row g-3">
      <!-- To Do カラム -->
      <div class="col-12 col-md-4">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">To Do</h5>
          </div>
          <div class="card-body card-list" data-column-id="todo">
            <!-- カードがここに追加される -->
          </div>
        </div>
      </div>

      <!-- In Progress カラム -->
      <div class="col-12 col-md-4">
        <div class="card">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">In Progress</h5>
          </div>
          <div class="card-body card-list" data-column-id="inprogress">
            <!-- カードがここに追加される -->
          </div>
        </div>
      </div>

      <!-- Done カラム -->
      <div class="col-12 col-md-4">
        <div class="card">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">Done</h5>
          </div>
          <div class="card-body card-list" data-column-id="done">
            <!-- カードがここに追加される -->
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
```

**目的**: 3つのカラムを横並びで配置し、スマホでは縦積みになるレスポンシブレイアウトを実現する。`data-column-id` 属性で各カラムを識別可能にする。

---

### 4. 各カラムに「＋追加」ボタンを配置

各カラムのヘッダーに「＋追加」ボタンを追加する。

```html
<div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
  <h5 class="mb-0">To Do</h5>
  <button class="btn btn-sm btn-light add-card-btn" data-column-id="todo">＋追加</button>
</div>
```

**目的**: 各カラムにカードを追加するためのボタンを配置する。`data-column-id` 属性でどのカラムに追加するかを識別する。

**注意**: このタスクではボタンのクリックイベントは実装しない（Task 4で実装）。

---

### 5. カードテンプレート（`<template id="card-template">`）を定義

JavaScriptでカードを動的に生成するための `<template>` 要素を定義する。

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

**目的**: HTMLテンプレートを定義し、JavaScriptから `cloneNode()` で複製してカードを生成できるようにする。`draggable="true"` でドラッグ可能にする。

**注意**: `<template>` 内の要素はブラウザに表示されない。JavaScriptで複製して使用する。

---

### 6. モーダル（`id="cardModal"`）を配置

カード追加・編集用のBootstrapモーダルを配置する。

```html
<!-- Modal -->
<div class="modal fade" id="cardModal" tabindex="-1" aria-labelledby="cardModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="cardModalLabel">カードを追加</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="cardForm">
          <div class="mb-3">
            <label for="cardInput" class="form-label">タスク内容</label>
            <textarea class="form-control" id="cardInput" rows="3" maxlength="500" required></textarea>
            <div class="form-text">最大500文字</div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
        <button type="submit" form="cardForm" class="btn btn-primary" id="modalSaveBtn">保存</button>
      </div>
    </div>
  </div>
</div>
```

**目的**: カード追加・編集のための入力フォームをモーダルで提供する。500文字の文字数制限を設定する。

**注意**: このタスクではモーダルの開閉イベントは実装しない（Task 4で実装）。

---

### 7. メッセージ表示エリア（`id="message-area"`）を配置

成功・エラーメッセージを表示するエリアを配置する。

```html
<div class="container-fluid">
  <div id="message-area" class="position-fixed top-0 start-50 translate-middle-x p-3"
       style="z-index: 9999; max-width: 500px;">
    <!-- メッセージがここに動的に追加される -->
  </div>

  <h1 class="text-center mb-4">Kanban Board</h1>
  <!-- 以降、カラムなど -->
</div>
```

**目的**: Bootstrap Alertを動的に追加するための領域を確保する。画面上部中央に固定表示する。

**注意**: このタスクではメッセージの表示ロジックは実装しない（Task 4で実装）。

---

### 8. Bootstrap JS CDNを読み込み

`</body>` の直前にBootstrap 5.3のJavaScriptを読み込む。

```html
  <!-- 他のコンテンツ -->

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossorigin="anonymous"></script>
</body>
</html>
```

**目的**: Bootstrapのモーダル、ドロップダウンなどのJavaScript機能を使用可能にする。

---

### 9. `style.css` を作成（カスタムCSS）

プロジェクトルートに `style.css` を作成する。

```css
/* style.css - カスタムスタイル */

/* 将来の実装で使用するスタイルの基本構造を定義 */
```

**目的**: Bootstrapで不足する部分を補うカスタムCSSを記述するファイルを用意する。

---

### 10. カードのドラッグスタイル、最小高さ等を定義

`style.css` にカンバンボード固有のスタイルを追加する。

```css
/* カラムの最小高さ */
.card-list {
  min-height: 400px;
  background-color: #f8f9fa;
}

/* カードのドラッグ時のスタイル */
.kanban-card {
  cursor: move;
  transition: opacity 0.2s;
}

.kanban-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* ドラッグ中の透明度 */
.kanban-card.dragging {
  opacity: 0.5;
}

/* ドロップ可能エリアのハイライト */
.card-list.drag-over {
  background-color: #e7f3ff;
  border: 2px dashed #0d6efd;
}
```

**目的**:
- カラムに最小高さを設定してカードが少ない時も見た目を保つ
- ドラッグ可能であることを視覚的に示す（カーソル変更）
- ドラッグ中とドロップ先のハイライト表示

**注意**: ドラッグ&ドロップのイベントハンドラはTask 7で実装する。ここではスタイルのみ。

---

### 11. ダミーカードを2-3枚手動で配置

動作確認用に各カラムにダミーカードを手動で配置する。

```html
<div class="card-body card-list" data-column-id="todo">
  <!-- ダミーカード1 -->
  <div class="card mb-2 kanban-card" draggable="true">
    <div class="card-body p-2">
      <p class="card-content mb-2 small">ダミータスク1: デザインを確認する</p>
      <div class="d-flex justify-content-end gap-1">
        <button class="btn btn-sm btn-outline-secondary edit-btn">✏️</button>
        <button class="btn btn-sm btn-outline-danger delete-btn">🗑️</button>
      </div>
    </div>
  </div>

  <!-- ダミーカード2 -->
  <div class="card mb-2 kanban-card" draggable="true">
    <div class="card-body p-2">
      <p class="card-content mb-2 small">ダミータスク2: レイアウトを確認する</p>
      <div class="d-flex justify-content-end gap-1">
        <button class="btn btn-sm btn-outline-secondary edit-btn">✏️</button>
        <button class="btn btn-sm btn-outline-danger delete-btn">🗑️</button>
      </div>
    </div>
  </div>
</div>
```

**目的**: ブラウザで開いた時にカンバンボードの見た目を確認できるようにする。

**注意**: このダミーカードはTask 4の実装時に削除する。

---

### 12. 動作確認: ブラウザで開いて3カラムとダミーカードが表示される

`index.html` をブラウザで開いて以下を確認する：

**確認項目:**
- [ ] 3つのカラム（To Do / In Progress / Done）が横並びで表示される
- [ ] 各カラムのヘッダーに「＋追加」ボタンが表示される
- [ ] 各カラムにダミーカードが表示される
- [ ] カードにマウスカーソルを合わせるとカーソルが move アイコンになる
- [ ] カードにホバーすると影が表示される
- [ ] スマホサイズ（幅を狭める）で3カラムが縦積みになる
- [ ] ブラウザのコンソールにエラーが出ない

**確認方法:**
1. `index.html` をダブルクリックしてブラウザで開く
2. 開発者ツール（F12）を開いてコンソールを確認
3. ブラウザの幅を変更してレスポンシブを確認

## 完了条件

- `index.html` がブラウザで正常に表示される
- 3カラムのレイアウトが完成している
- ダミーカードが表示されている
- Bootstrap 5.3が正しく読み込まれている
- `style.css` が読み込まれている
- レスポンシブデザインが動作している
- コンソールにエラーが出ていない

## 次のタスク

Task 2: インフラ整備（constants, storage, 初期化）
