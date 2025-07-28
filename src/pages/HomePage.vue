<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToVueFlow = () => {
  router.push('/vueflow')
}

const goToTiptap = () => {
  router.push('/tiptap')
}

const goToEditorJs = () => {
  router.push('/editorjs')
}
</script>

<template>
  <div class="home-page">
    <h1>歡迎來到 ICP Dashboard</h1>
    <p>這是一個功能豐富的開發平台，包含多種實用工具</p>
    
    <div class="tools-grid">
      <div class="tool-card">
        <h3>VueFlow 編輯器</h3>
        <p>視覺化決策樹流程圖編輯器，支援節點和連接線的編輯功能</p>
        <button @click="goToVueFlow" class="btn">
          <i class="mdi mdi-sitemap"></i>
          進入 VueFlow 編輯器
        </button>
      </div>
      
      <div class="tool-card">
        <h3>Tiptap 文字編輯器</h3>
        <p>功能豐富的文字編輯器，支援格式化、表格、顏色設定等功能</p>
        <button @click="goToTiptap" class="btn">
          <i class="mdi mdi-pencil"></i>
          進入 Tiptap 編輯器
        </button>
      </div>
      
      <div class="tool-card">
        <h3>Editor.js 區塊編輯器</h3>
        <p>現代化的區塊式編輯器，支援多種內容類型和結構化資料</p>
        <button @click="goToEditorJs" class="btn">
          <i class="mdi mdi-cube-outline"></i>
          進入 Editor.js 編輯器
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
  
  h1 {
    margin-bottom: 1rem;
    color: #333;
    font-size: 2.5rem;
  }
  
  p {
    margin-bottom: 3rem;
    color: #666;
    font-size: 1.2rem;
    max-width: 600px;
  }
  
  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 800px;
    width: 100%;
  }
  
  .tool-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }
    
    h3 {
      margin-bottom: 1rem;
      color: #333;
      font-size: 1.5rem;
    }
    
    p {
      margin-bottom: 1.5rem;
      color: #666;
      font-size: 1rem;
      line-height: 1.6;
    }
  }
  
  .btn {
    padding: 12px 24px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    
    &:hover {
      background-color: #45a049;
    }
    
    i {
      font-size: 14px;
    }
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 1rem;
    
    h1 {
      font-size: 2rem;
    }
    
    .tools-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
}
</style> 