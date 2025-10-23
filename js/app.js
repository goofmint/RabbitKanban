// app.js - アプリケーションのエントリーポイント
// このファイルはアプリケーション全体の初期化フローを管理する

/**
 * アプリケーションのエントリーポイント
 * IIFE（即時実行関数式）でグローバルスコープを汚染しない
 *
 * 実装の考え方:
 * - IIFE（Immediately Invoked Function Expression）でモジュールパターンを実現
 * - 'use strict' でストリクトモードを有効化
 * - グローバルスコープを汚染しない（変数の衝突を防ぐ）
 *
 * 注意:
 * - モダンなJavaScriptのベストプラクティスに従う
 * - このファイルは最後に読み込まれる（他のモジュールに依存するため）
 */
(function() {
  'use strict';

  /**
   * アプリケーション全体を初期化する
   * DOMContentLoadedイベント発火時に呼ばれる
   *
   * 実装フロー:
   * 1. initializeData() - localStorageからデータを読み込む
   * 2. initializeModal() - Bootstrap Modalを初期化
   * 3. renderAllCards() - すべてのカードを画面に表示
   * 4. setupEventListeners() - すべてのイベントリスナーを設定
   *
   * 実装の考え方:
   * - データ初期化 → UI初期化 → イベント設定の順で実行
   * - 依存関係を考慮した初期化順序
   *
   * 注意:
   * - この関数はDOMContentLoadedイベント発火時に1度だけ呼ばれる
   * - すべての準備が整った状態でユーザーに提供
   */
  function initializeApp() {
    // 1. initializeData() - localStorageからデータを読み込む
    // data-manager.jsで定義されている関数を呼び出す
    // loadFromStorage()を呼び出してlocalStorageからデータを読み込み、cardsDataに代入
    initializeData();

    // 2. initializeModal() - Bootstrap Modalを初期化
    // modal.jsで定義されている関数を呼び出す
    // new bootstrap.Modal()でModalインスタンスを作成し、イベントリスナーを設定
    initializeModal();

    // 3. renderAllCards() - すべてのカードを画面に表示
    // ui-renderer.jsで定義されている関数を呼び出す
    // 各カラムに対してrenderColumnCards()を呼び出し、カードを描画
    renderAllCards();

    // 4. setupEventListeners() - すべてのイベントリスナーを設定
    // event-handler.jsで定義されている関数を呼び出す
    // 「＋追加」ボタン、モーダルのフォーム送信、キャンセルボタンのイベントリスナーを設定
    setupEventListeners();
  }

  /**
   * DOMが完全に読み込まれた後、アプリを初期化する
   *
   * 実装の考え方:
   * - DOMContentLoadedイベントをリスン
   * - DOMが完全に構築された後に初期化処理を実行
   * - スクリプトの読み込み位置に依存しない
   *
   * 注意:
   * - DOM要素が存在することを保証してから初期化
   * - 確実にアプリケーションを起動
   */
  document.addEventListener('DOMContentLoaded', initializeApp);

})();
