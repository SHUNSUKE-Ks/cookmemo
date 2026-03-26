# CookMemo（レシピPWA）エディタ引継ぎ資料

---

## 1. プロジェクト概要

**アプリ名**: CookMemo
**コンセプト**: レシピをJSONデータとして管理するPWAアプリ

---

## 2. 技術構成

* React + Vite（TSX推奨）
* LocalStorage（初期）
* PWA対応（manifest + service worker）

---

## 3. ディレクトリ構成

```
src/
 ├─ App.jsx
 ├─ components/
 │   ├─ RecipeList.jsx
 │   ├─ RecipeDetail.jsx
 │   ├─ RecipeForm.jsx
 │   ├─ TagFilter.jsx
 │
 ├─ hooks/
 │   └─ useRecipes.js
 │
 ├─ utils/
 │   └─ storage.js
 │
public/
 ├─ icon-192.png
 ├─ icon-512.png
 ├─ manifest.json
 ├─ sw.js
```

---

## 4. データ構造

```json
{
  "id": 123456,
  "title": "ビソワーズ",
  "ingredients": "じゃがいも...",
  "steps": "煮る...",
  "tags": ["スープ", "簡単"],
  "image": "base64"
}
```

---

## 5. 状態管理

useState + カスタムHook

```js
const [recipes, setRecipes] = useState([])
```

---

## 6. 機能一覧

### 6.1 レシピ管理

* 追加
* 削除
* 一覧表示
* 詳細表示

### 6.2 検索

* タイトル検索

### 6.3 タグ

* 追加（カンマ区切り）
* フィルター

### 6.4 画像

* base64保存

---

## 7. PWA設定

### manifest.json

```json
{
  "name": "CookMemo",
  "short_name": "CookMemo",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#facc15"
}
```

---

### service worker

```js
self.addEventListener("install", () => self.skipWaiting())

self.addEventListener("fetch", (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
})
```

---

## 8. 今後の拡張

### 優先度 高

* 編集機能
* タグ削除UI
* JSONエクスポート

### 優先度 中

* ステップ分割
* お気に入り
* 並び替え

### 優先度 低

* クラウド同期
* Notion連携

---

## 9. 設計思想

* レシピ = データ
* データ = JSON
* JSON = 再利用可能

---

## 10. 注意点

* LocalStorageは容量制限あり
* 画像は圧縮推奨
* ID重複禁止（Date.now使用）

---

## 11. 開発フロー

1. コンポーネント分割
2. UI実装
3. 状態接続
4. PWA化

---

## 12. ゴール

* オフラインで使える
* 軽量
* JSONとして再利用可能

---

以上
