<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import Checklist from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import Table from '@editorjs/table'
import Image from '@editorjs/image'
import LinkTool from '@editorjs/link'
import Embed from '@editorjs/embed'
import Paragraph from '@editorjs/paragraph'
import Raw from '@editorjs/raw'
import TextColorPlugin from 'editorjs-text-color-plugin'
// import Underline from 'editorjs-underline' // 改用 window.Underline

const editorRef = ref<HTMLDivElement>()
const editor = ref<EditorJS>()

const initialData = {
  time: Date.now(),
  blocks: [
    {
      type: 'header',
      data: {
        text: '歡迎使用 Editor.js',
        level: 1
      }
    },
    {
      type: 'paragraph',
      data: {
        text: '這是一個功能豐富的區塊式文字編輯器，支援多種內容類型：'
      }
    },
    {
      type: 'list',
      data: {
        style: 'unordered',
        items: [
          '標題和段落',
          '列表和檢查清單',
          '引用和標記',
          '表格和圖片',
          '連結和嵌入內容',
          '粗體、斜體、底線、刪除線',
          '文字顏色、背景色'
        ]
      }
    },
    {
      type: 'paragraph',
      data: {
        text: '請開始編輯您的內容！'
      }
    }
  ]
}

const saveData = async () => {
  if (editor.value) {
    try {
      const outputData = await editor.value.save()
      const jsonString = JSON.stringify(outputData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'editorjs-content.json'
      a.click()
      URL.revokeObjectURL(url)
      alert('內容已匯出為 JSON 檔案！')
    } catch (error) {
      alert('儲存失敗，請檢查控制台')
    }
  }
}

const exportHtml = async () => {
  if (editor.value) {
    try {
      const data = await editor.value.save()
      let html = ''
      data.blocks.forEach(block => {
        switch (block.type) {
          case 'header':
            html += `<h${block.data.level}>${block.data.text}</h${block.data.level}>\n`
            break
          case 'paragraph':
            html += `<p>${block.data.text}</p>\n`
            break
          case 'list':
            html += `<${block.data.style === 'ordered' ? 'ol' : 'ul'}>`
            block.data.items.forEach(item => {
              html += `<li>${item}</li>`
            })
            html += `</${block.data.style === 'ordered' ? 'ol' : 'ul'}>\n`
            break
          case 'checklist':
            html += '<ul>'
            block.data.items.forEach(item => {
              html += `<li><input type='checkbox' ${item.checked ? 'checked' : ''}/> ${item.text}</li>`
            })
            html += '</ul>\n'
            break
          case 'delimiter':
            html += '<hr />\n'
            break
          case 'quote':
            html += `<blockquote>${block.data.text}<footer>${block.data.caption || ''}</footer></blockquote>\n`
            break
          case 'table':
            html += '<table>'
            block.data.content.forEach(row => {
              html += '<tr>'
              row.forEach(cell => {
                html += `<td>${cell}</td>`
              })
              html += '</tr>'
            })
            html += '</table>\n'
            break
          case 'image':
            html += `<img src='${block.data.file.url}' alt='${block.data.caption || ''}' />\n`
            break
          case 'linkTool':
            html += `<a href='${block.data.link}' target='_blank'>${block.data.link}</a>\n`
            break
          case 'embed':
            html += `<iframe src='${block.data.embed}' width='${block.data.width}' height='${block.data.height}' frameborder='0' allowfullscreen></iframe>\n`
            break
          case 'raw':
            html += block.data.html + '\n'
            break
          default:
            break
        }
      })
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'editorjs-content.html'
      a.click()
      URL.revokeObjectURL(url)
      alert('內容已匯出為 HTML 檔案！')
    } catch (error) {
      alert('匯出 HTML 失敗，請檢查控制台')
    }
  }
}

const exportText = async () => {
  if (editor.value) {
    try {
      const data = await editor.value.save()
      let text = ''
      data.blocks.forEach(block => {
        switch (block.type) {
          case 'header':
          case 'paragraph':
            text += block.data.text + '\n'
            break
          case 'list':
            block.data.items.forEach(item => {
              text += '- ' + item + '\n'
            })
            break
          case 'checklist':
            block.data.items.forEach(item => {
              text += (item.checked ? '[x] ' : '[ ] ') + item.text + '\n'
            })
            break
          case 'quote':
            text += '"' + block.data.text + '" ' + (block.data.caption || '') + '\n'
            break
          case 'table':
            block.data.content.forEach(row => {
              text += row.join(' | ') + '\n'
            })
            break
          case 'image':
            text += '[圖片] ' + (block.data.caption || '') + ' ' + block.data.file.url + '\n'
            break
          case 'linkTool':
            text += '[連結] ' + block.data.link + '\n'
            break
          case 'embed':
            text += '[嵌入] ' + block.data.embed + '\n'
            break
          case 'raw':
            text += block.data.html + '\n'
            break
          default:
            break
        }
      })
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'editorjs-content.txt'
      a.click()
      URL.revokeObjectURL(url)
      alert('內容已匯出為純文字檔案！')
    } catch (error) {
      alert('匯出純文字失敗，請檢查控制台')
    }
  }
}

const loadData = async () => {
  if (editor.value) {
    try {
      await editor.value.render(initialData)
      alert('已載入範例內容！')
    } catch (error) {
      alert('載入失敗，請檢查控制台')
    }
  }
}

const clearData = async () => {
  if (editor.value) {
    try {
      await editor.value.clear()
      alert('內容已清空！')
    } catch (error) {
      alert('清空失敗，請檢查控制台')
    }
  }
}

const getData = async () => {
  if (editor.value) {
    try {
      const data = await editor.value.save()
      console.log('目前內容:', data)
      alert('內容已輸出到控制台，請按 F12 查看')
    } catch (error) {
      alert('取得資料失敗，請檢查控制台')
    }
  }
}

onMounted(() => {
  console.log('editorRef', editorRef.value)
  if (editorRef.value) {
    editor.value = new EditorJS({
      holder: editorRef.value,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: '輸入標題',
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 1
          }
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: '輸入引用文字',
            captionPlaceholder: '引用來源'
          }
        },
        delimiter: Delimiter,
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3
          }
        },
        image: {
          class: Image,
          config: {
            uploader: {
              uploadByFile(file: File) {
                return new Promise((resolve) => {
                  const reader = new FileReader()
                  reader.onload = () => {
                    resolve({
                      success: 1,
                      file: {
                        url: reader.result as string
                      }
                    })
                  }
                  reader.readAsDataURL(file)
                })
              }
            }
          }
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: 'https://api.linkpreview.net/',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              coub: true,
              vimeo: true
            }
          }
        },
        raw: {
          class: Raw,
          config: {
            placeholder: '輸入 HTML 程式碼'
          }
        }
      }
    })
    console.log('EditorJS loaded', editor.value)
  }
})

onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<template>
  <div class="editorjs-page">
    <div class="header">
      <h1>Editor.js 區塊編輯器</h1>
      <div class="actions">
        <button @click="saveData" class="btn save-btn">
          <i class="mdi mdi-download"></i>
          匯出 JSON
        </button>
        <button @click="exportHtml" class="btn export-btn">
          <i class="mdi mdi-code-tags"></i>
          匯出 HTML
        </button>
        <button @click="exportText" class="btn copy-btn">
          <i class="mdi mdi-content-copy"></i>
          匯出純文字
        </button>
        <button @click="loadData" class="btn load-btn">
          <i class="mdi mdi-upload"></i>
          載入範例
        </button>
        <button @click="clearData" class="btn clear-btn">
          <i class="mdi mdi-delete"></i>
          清空內容
        </button>
        <button @click="getData" class="btn data-btn">
          <i class="mdi mdi-eye"></i>
          查看資料
        </button>
      </div>
    </div>
    <div class="editor-container">
      <div class="toolbar-info">
        <h3>編輯器功能說明</h3>
        <div class="features">
          <div class="feature-item">
            <i class="mdi mdi-format-header-1"></i>
            <span>標題：使用 / 或點擊 + 按鈕</span>
          </div>
          <div class="feature-item">
            <i class="mdi mdi-format-list-bulleted"></i>
            <span>列表：支援有序和無序列表</span>
          </div>
          <div class="feature-item">
            <i class="mdi mdi-format-quote"></i>
            <span>引用：突出顯示重要內容</span>
          </div>
          <div class="feature-item">
            <i class="mdi mdi-format-color-highlight"></i>
            <span>標記：CMD+SHIFT+M 快捷鍵</span>
          </div>
          <div class="feature-item">
            <i class="mdi mdi-checkbox-marked"></i>
            <span>檢查清單：任務管理</span>
          </div>
          <div class="feature-item">
            <i class="mdi mdi-table"></i>
            <span>表格：資料展示</span>
          </div>
          <div class="feature-item">
            <i class="mdi mdi-image"></i>
            <span>圖片：拖拽或點擊上傳</span>
          </div>
          <div class="feature-item">
            <i class="mdi mdi-link"></i>
            <span>連結：自動預覽</span>
          </div>
          <div class="feature-item">
            <i class="mdi mdi-play-circle"></i>
            <span>嵌入：YouTube、Vimeo 等</span>
          </div>
          <div class="feature-item">
            <i class="mdi mdi-format-bold"></i>
            <span>粗體、斜體、底線、刪除線、顏色、背景色</span>
          </div>
        </div>
      </div>
      <div class="editor-wrapper">
        <div ref="editorRef" class="editor-content"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editorjs-page {
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
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  i {
    font-size: 14px;
  }
}

.save-btn {
  background-color: #4CAF50;
  color: white;
  
  &:hover {
    background-color: #45a049;
  }
}

.export-btn {
  background-color: #2196F3;
  color: white;
  
  &:hover {
    background-color: #1976D2;
  }
}

.copy-btn {
  background-color: #FF9800;
  color: white;
  
  &:hover {
    background-color: #F57C00;
  }
}

.load-btn {
  background-color: #2196F3;
  color: white;
  
  &:hover {
    background-color: #1976D2;
  }
}

.clear-btn {
  background-color: #f44336;
  color: white;
  
  &:hover {
    background-color: #d32f2f;
  }
}

.data-btn {
  background-color: #607d8b;
  color: white;
  
  &:hover {
    background-color: #455a64;
  }
}

.editor-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.toolbar-info {
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  
  h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 1.2rem;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 10px;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: white;
    border-radius: 6px;
    font-size: 14px;
    color: #666;
    
    i {
      color: #2196F3;
      width: 16px;
    }
  }
}

.editor-wrapper {
  padding: 20px;
  min-height: 600px;
  
  .editor-content {
    :deep(.codex-editor) {
      .codex-editor__redactor {
        padding-bottom: 100px;
      }
      
      .ce-block__content {
        max-width: 100%;
        margin: 0;
      }
      
      .ce-toolbar__content {
        max-width: 100%;
        margin: 0;
      }
      
      .ce-header {
        padding: 0.6em 0;
        margin: 0;
        line-height: 1.25em;
        outline: none;
      }
      
      .ce-paragraph {
        line-height: 1.6em;
        outline: none;
      }
      
      .ce-quote {
        padding: 0.6em 0;
        margin: 0;
        line-height: 1.6em;
        outline: none;
        border-left: 3px solid #ddd;
        padding-left: 1em;
      }
      
      .ce-list {
        margin: 0;
        padding-left: 2em;
        outline: none;
      }
      
      .ce-checklist {
        margin: 0;
        padding-left: 2em;
        outline: none;
      }
      
      .ce-table {
        margin: 1em 0;
        border-collapse: collapse;
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
      
      .ce-image {
        margin: 1em 0;
        
        img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
      }
      
      .ce-link {
        color: #2196F3;
        text-decoration: underline;
        
        &:hover {
          color: #1976D2;
        }
      }
      
      .ce-embed {
        margin: 1em 0;
        
        iframe {
          max-width: 100%;
          border-radius: 8px;
        }
      }
      
      .ce-raw {
        background: #f8f9fa;
        padding: 1em;
        border-radius: 6px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.4;
        overflow-x: auto;
      }
    }
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    
    h1 {
      font-size: 1.5rem;
    }
    
    .actions {
      justify-content: center;
    }
  }
  
  .toolbar-info {
    .features {
      grid-template-columns: 1fr;
    }
  }
}
</style> 