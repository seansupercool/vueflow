# Tiptap 文字編輯器使用說明

## 取得內容的方法

### 1. 純文字內容
```javascript
const text = editor.value?.getText()
console.log('純文字內容:', text)
```
- 取得所有文字內容，不包含格式
- 適合用於搜尋或分析

### 2. HTML 內容
```javascript
const html = editor.value?.getHTML()
console.log('HTML 內容:', html)
```
- 取得包含格式的 HTML 內容
- 適合用於顯示或儲存

### 3. JSON 內容
```javascript
const json = editor.value?.getJSON()
console.log('JSON 內容:', json)
```
- 取得結構化的 JSON 資料
- 適合用於資料處理或 API 傳送

## 在程式碼中使用

### 監聽內容變更
```javascript
import { watch } from 'vue'

// 監聽內容變更
watch(() => editor.value?.getHTML(), (newContent) => {
  console.log('內容已變更:', newContent)
  // 在這裡處理內容變更
})
```

### 自動儲存功能
```javascript
import { onMounted, onUnmounted } from 'vue'

let saveInterval: number

onMounted(() => {
  // 每 30 秒自動儲存
  saveInterval = setInterval(() => {
    const content = editor.value?.getHTML()
    if (content) {
      localStorage.setItem('tiptap-draft', content)
      console.log('已自動儲存')
    }
  }, 30000)
})

onUnmounted(() => {
  if (saveInterval) {
    clearInterval(saveInterval)
  }
})
```

### 載入已儲存的內容
```javascript
onMounted(() => {
  const savedContent = localStorage.getItem('tiptap-draft')
  if (savedContent) {
    editor.value?.commands.setContent(savedContent)
  }
})
```

## 按鈕功能說明

### 匯出 HTML
- 將內容匯出為 HTML 檔案
- 檔案會自動下載到您的下載資料夾

### 複製純文字
- 複製所有文字內容到剪貼簿
- 不包含任何格式

### 複製 HTML
- 複製包含格式的 HTML 內容到剪貼簿
- 可以貼到其他支援 HTML 的編輯器

### 複製 JSON
- 複製結構化的 JSON 資料到剪貼簿
- 適合用於資料處理或 API 整合

## 進階功能

### 取得選取的內容
```javascript
const selectedContent = editor.value?.state.selection.content()
```

### 取得游標位置
```javascript
const position = editor.value?.state.selection.from
```

### 插入內容
```javascript
// 在游標位置插入文字
editor.value?.chain().focus().insertContent('要插入的文字').run()

// 在游標位置插入 HTML
editor.value?.chain().focus().insertContent('<p>HTML 內容</p>').run()
```

### 清空內容
```javascript
editor.value?.chain().focus().clearContent().run()
```

## 注意事項

1. **剪貼簿 API** 需要 HTTPS 環境或 localhost
2. **自動儲存** 使用 localStorage，資料會保存在瀏覽器中
3. **內容格式** 會保留在 HTML 和 JSON 中，但不會在純文字中
4. **大型內容** 建議使用 JSON 格式，效能較好 