<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { ref } from 'vue'

const editor = useEditor({
  content: `
    <h1>歡迎使用 Tiptap 編輯器</h1>
    <p>這是一個功能豐富的文字編輯器，支援以下功能：</p>
    <ul>
      <li>文字格式化（粗體、斜體、底線）</li>
      <li>文字顏色和背景色</li>
      <li>文字對齊</li>
      <li>表格功能</li>
      <li>連結和圖片</li>
    </ul>
    <p>請開始編輯您的內容！</p>
  `,
  extensions: [
    StarterKit.configure({
      bold: {
        HTMLAttributes: {
          class: 'font-bold',
        },
      },
      italic: {
        HTMLAttributes: {
          class: 'italic',
        },
      },
      strike: {
        HTMLAttributes: {
          class: 'line-through',
        },
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Color,
    TextStyle,
    Highlight.configure({
      multicolor: true,
    }),
    Underline,
    Link.configure({
      openOnClick: false,
    }),
    Image,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
})

const isLinkMenuOpen = ref(false)
const linkUrl = ref('')
const imageUrl = ref('')

const setLink = () => {
  if (linkUrl.value) {
    editor.value?.chain().focus().setLink({ href: linkUrl.value }).run()
    linkUrl.value = ''
    isLinkMenuOpen.value = false
  }
}

const setImage = () => {
  if (imageUrl.value) {
    editor.value?.chain().focus().setImage({ src: imageUrl.value, alt: '圖片' }).run()
    imageUrl.value = ''
  }
}

const addTable = () => {
  editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}

const addColumnBefore = () => {
  editor.value?.chain().focus().addColumnBefore().run()
}

const addColumnAfter = () => {
  editor.value?.chain().focus().addColumnAfter().run()
}

const deleteColumn = () => {
  editor.value?.chain().focus().deleteColumn().run()
}

const addRowBefore = () => {
  editor.value?.chain().focus().addRowBefore().run()
}

const addRowAfter = () => {
  editor.value?.chain().focus().addRowAfter().run()
}

const deleteRow = () => {
  editor.value?.chain().focus().deleteRow().run()
}

const deleteTable = () => {
  editor.value?.chain().focus().deleteTable().run()
}

const exportContent = () => {
  console.log("exportContent", editor)
  const content = editor.value?.getHTML()
  console.log("content", content)
  const blob = new Blob([content || ''], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'tiptap-content.html'
  a.click()
  URL.revokeObjectURL(url)
}

// 新增：取得純文字內容
const getTextContent = () => {
  const text = editor.value?.getText()
  console.log('純文字內容:', text)
  return text
}

// 新增：取得 HTML 內容
const getHtmlContent = () => {
  const html = editor.value?.getHTML()
  console.log('HTML 內容:', html)
  return html
}

// 新增：取得 JSON 內容
const getJsonContent = () => {
  const json = editor.value?.getJSON()
  console.log('JSON 內容:', json)
  return json
}

// 新增：複製內容到剪貼簿
const copyToClipboard = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    alert('內容已複製到剪貼簿！')
  } catch (err) {
    console.error('複製失敗:', err)
    alert('複製失敗，請手動複製')
  }
}
</script>

<template>
  <div class="tiptap-page">
    <div class="header">
      <h1>Tiptap 文字編輯器</h1>
      <div class="actions">
        <button @click="exportContent" class="btn export-btn">
          <i class="mdi mdi-download"></i>
          匯出 HTML
        </button>
        <button @click="() => copyToClipboard(getTextContent() || '')" class="btn copy-btn">
          <i class="mdi mdi-content-copy"></i>
          複製純文字
        </button>
        <button @click="() => copyToClipboard(getHtmlContent() || '')" class="btn copy-btn">
          <i class="mdi mdi-code-tags"></i>
          複製 HTML
        </button>
        <button @click="() => copyToClipboard(JSON.stringify(getJsonContent(), null, 2))" class="btn copy-btn">
          <i class="mdi mdi-code-json"></i>
          複製 JSON
        </button>
      </div>
    </div>

    <div class="editor-container">
      <!-- 文字格式化工具列 -->
      <div class="toolbar">
        <!-- 基本格式化 -->
        <div class="toolbar-group">
          <button
            @click="() => {
              console.log('粗體按鈕被點擊')
              editor?.chain().focus().toggleBold().run()
              console.log('粗體狀態:', editor?.isActive('bold'))
            }"
            :class="{ 'is-active': editor?.isActive('bold') }"
            class="btn"
            title="粗體"
          >
            <i class="mdi mdi-format-bold"></i>
          </button>
          <button
            @click="() => {
              console.log('斜體按鈕被點擊')
              editor?.chain().focus().toggleItalic().run()
              console.log('斜體狀態:', editor?.isActive('italic'))
            }"
            :class="{ 'is-active': editor?.isActive('italic') }"
            class="btn"
            title="斜體"
          >
            <i class="mdi mdi-format-italic"></i>
          </button>
          <button
            @click="() => {
              console.log('底線按鈕被點擊')
              editor?.chain().focus().toggleUnderline().run()
              console.log('底線狀態:', editor?.isActive('underline'))
            }"
            :class="{ 'is-active': editor?.isActive('underline') }"
            class="btn"
            title="底線"
          >
            <i class="mdi mdi-format-underline"></i>
          </button>
          <button
            @click="() => {
              console.log('刪除線按鈕被點擊')
              editor?.chain().focus().toggleStrike().run()
              console.log('刪除線狀態:', editor?.isActive('strike'))
            }"
            :class="{ 'is-active': editor?.isActive('strike') }"
            class="btn"
            title="刪除線"
          >
            <i class="mdi mdi-format-strikethrough"></i>
          </button>
        </div>

        <!-- 標題 -->
        <div class="toolbar-group">
          <button
            @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }"
            class="btn"
            title="標題 1"
          >
            <i class="mdi mdi-format-header-1"></i>
            H1
          </button>
          <button
            @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }"
            class="btn"
            title="標題 2"
          >
            <i class="mdi mdi-format-header-2"></i>
            H2
          </button>
          <button
            @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }"
            class="btn"
            title="標題 3"
          >
            <i class="mdi mdi-format-header-3"></i>
            H3
          </button>
        </div>

        <!-- 文字對齊 -->
        <div class="toolbar-group">
          <button
            @click="editor?.chain().focus().setTextAlign('left').run()"
            :class="{ 'is-active': editor?.isActive({ textAlign: 'left' }) }"
            class="btn"
            title="靠左對齊"
          >
            <i class="mdi mdi-format-align-left"></i>
          </button>
          <button
            @click="editor?.chain().focus().setTextAlign('center').run()"
            :class="{ 'is-active': editor?.isActive({ textAlign: 'center' }) }"
            class="btn"
            title="置中對齊"
          >
            <i class="mdi mdi-format-align-center"></i>
          </button>
          <button
            @click="editor?.chain().focus().setTextAlign('right').run()"
            :class="{ 'is-active': editor?.isActive({ textAlign: 'right' }) }"
            class="btn"
            title="靠右對齊"
          >
            <i class="mdi mdi-format-align-right"></i>
          </button>
          <button
            @click="editor?.chain().focus().setTextAlign('justify').run()"
            :class="{ 'is-active': editor?.isActive({ textAlign: 'justify' }) }"
            class="btn"
            title="兩端對齊"
          >
            <i class="mdi mdi-format-align-justify"></i>
          </button>
        </div>

        <!-- 文字顏色 -->
        <div class="toolbar-group">
          <input
            type="color"
            @input="(event) => editor?.chain().focus().setColor((event.target as HTMLInputElement).value).run()"
            class="color-picker"
            title="文字顏色"
          />
          <button
            @click="editor?.chain().focus().toggleHighlight().run()"
            :class="{ 'is-active': editor?.isActive('highlight') }"
            class="btn"
            title="背景高亮"
          >
            <i class="mdi mdi-format-color-highlight"></i>
          </button>
        </div>

        <!-- 列表 -->
        <div class="toolbar-group">
          <button
            @click="editor?.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor?.isActive('bulletList') }"
            class="btn"
            title="項目符號列表"
          >
            <i class="mdi mdi-format-list-bulleted"></i>
          </button>
          <button
            @click="editor?.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor?.isActive('orderedList') }"
            class="btn"
            title="編號列表"
          >
            <i class="mdi mdi-format-list-numbered"></i>
          </button>
        </div>

        <!-- 表格 -->
        <div class="toolbar-group">
          <button @click="addTable" class="btn" title="插入表格">
            <i class="mdi mdi-table"></i>
          </button>
          <button @click="addColumnBefore" class="btn" title="在左側插入欄">
            <i class="mdi mdi-arrow-left"></i>
          </button>
          <button @click="addColumnAfter" class="btn" title="在右側插入欄">
            <i class="mdi mdi-arrow-right"></i>
          </button>
          <button @click="deleteColumn" class="btn" title="刪除欄">
            <i class="mdi mdi-minus-box"></i>
          </button>
          <button @click="addRowBefore" class="btn" title="在上方插入列">
            <i class="mdi mdi-arrow-up"></i>
          </button>
          <button @click="addRowAfter" class="btn" title="在下方插入列">
            <i class="mdi mdi-arrow-down"></i>
          </button>
          <button @click="deleteRow" class="btn" title="刪除列">
            <i class="mdi mdi-minus-box"></i>
          </button>
          <button @click="deleteTable" class="btn" title="刪除表格">
            <i class="mdi mdi-delete"></i>
          </button>
        </div>

        <!-- 連結和圖片 -->
        <div class="toolbar-group">
          <button @click="isLinkMenuOpen = !isLinkMenuOpen" class="btn" title="插入連結">
            <i class="mdi mdi-link"></i>
          </button>
          <button @click="setImage" class="btn" title="插入圖片">
            <i class="mdi mdi-image"></i>
          </button>
        </div>
      </div>

      <!-- 連結輸入框 -->
      <div v-if="isLinkMenuOpen" class="link-menu">
        <input
          v-model="linkUrl"
          type="url"
          placeholder="輸入連結網址"
          class="link-input"
        />
        <button @click="setLink" class="btn">
          <i class="mdi mdi-check"></i>
          插入
        </button>
        <button @click="isLinkMenuOpen = false" class="btn">
          <i class="mdi mdi-close"></i>
          取消
        </button>
      </div>

      <!-- 圖片輸入框 -->
      <div class="image-input">
        <input
          v-model="imageUrl"
          type="url"
          placeholder="輸入圖片網址"
          class="image-url-input"
        />
        <button @click="setImage" class="btn">
          <i class="mdi mdi-image"></i>
          插入圖片
        </button>
      </div>

      <!-- 編輯器內容區域 -->
      <div class="editor-content">
        <EditorContent :editor="editor" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tiptap-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;

  h1 {
    margin: 0;
    color: #333;
    font-size: 2rem;
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .export-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    
    &:hover {
      background-color: #45a049;
    }
  }
  
  .copy-btn {
    background-color: #2196F3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
    
    &:hover {
      background-color: #1976D2;
    }
  }
}

.editor-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
}

.toolbar-group {
  display: flex;
  gap: 2px;
  padding: 0 5px;
  border-right: 1px solid #ddd;
  
  &:last-child {
    border-right: none;
  }
}

  .btn {
    background: white;
    border: 1px solid #ddd;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 4px;
    
    &:hover {
      background: #f0f0f0;
      border-color: #999;
    }
    
    &.is-active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }
    
    i {
      font-size: 12px;
    }
  }

.color-picker {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
}

.link-menu {
  display: flex;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
}

.link-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.image-input {
  display: flex;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
}

.image-url-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

  .editor-content {
    padding: 20px;
    min-height: 500px;
    
    :deep(.ProseMirror) {
      outline: none;
      font-size: 16px;
      line-height: 1.6;
      
      h1, h2, h3 {
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        font-weight: 600;
      }
      
      h1 { font-size: 2em; }
      h2 { font-size: 1.5em; }
      h3 { font-size: 1.25em; }
      
      p {
        margin-bottom: 1em;
      }
      
      ul, ol {
        margin-bottom: 1em;
        padding-left: 2em;
      }
      
      // 格式化樣式
      strong, b {
        font-weight: bold !important;
      }
      
      em, i {
        font-style: italic !important;
      }
      
      u {
        text-decoration: underline !important;
      }
      
      s, strike {
        text-decoration: line-through !important;
      }
      
      mark {
        background-color: yellow !important;
      }
      
      table {
        border-collapse: collapse;
        margin: 1em 0;
        width: 100%;
        
        td, th {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: left;
        }
        
        th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
      }
      
      a {
        color: #007bff;
        text-decoration: underline;
        
        &:hover {
          color: #0056b3;
        }
      }
      
      img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
      }
    }
  }

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-group {
    justify-content: center;
    border-right: none;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
    margin-bottom: 5px;
    
    &:last-child {
      border-bottom: none;
    }
  }
}
</style> 