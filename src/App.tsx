import { useState, useRef, useEffect } from 'react'
import './App.css'

interface ChineseCharacter {
  char: string
  meaning?: string
}

function App() {
  // 默认的汉字数组
  const [characters, setCharacters] = useState<ChineseCharacter[]>([
    { char: '你', meaning: 'you' },
    { char: '好', meaning: 'good' },
    { char: '世', meaning: 'world' },
    { char: '界', meaning: 'boundary' },
    { char: '汉', meaning: 'Chinese' },
    { char: '字', meaning: 'character' },
    { char: '学', meaning: 'study' },
    { char: '习', meaning: 'learn' },
    { char: '美', meaning: 'beautiful' },
    { char: '丽', meaning: 'pretty' },
    { char: '朋', meaning: 'friend' },
    { char: '友', meaning: 'friend' }
  ])

  const [currentPage, setCurrentPage] = useState(0)
  const [newChar, setNewChar] = useState('')
  const [newMeaning, setNewMeaning] = useState('')
  const itemsPerPage = 6 // 每页显示的字符数
  const containerRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const currentX = useRef(0)
  const isSwiping = useRef(false)

  // 计算总页数
  const totalPages = Math.ceil(characters.length / itemsPerPage)

  // 获取当前页的字符
  const getCurrentPageCharacters = () => {
    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return characters.slice(startIndex, endIndex)
  }

  // 添加新汉字
  const addCharacter = () => {
    if (newChar.trim()) {
      setCharacters([...characters, { char: newChar.trim(), meaning: newMeaning.trim() || undefined }])
      setNewChar('')
      setNewMeaning('')
    }
  }

  // 翻页处理
  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }

  // 触摸事件处理 - 开始
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    isSwiping.current = true
  }

  // 触摸事件处理 - 移动
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return
    currentX.current = e.touches[0].clientX
  }

  // 触摸事件处理 - 结束
  const handleTouchEnd = () => {
    if (!isSwiping.current) return
    
    const diff = startX.current - currentX.current
    // 如果滑动距离大于50px，则翻页
    if (diff > 50 && currentPage < totalPages - 1) {
      goToPage(currentPage + 1)
    } else if (diff < -50 && currentPage > 0) {
      goToPage(currentPage - 1)
    }
    
    isSwiping.current = false
  }

  return (
    <div className="app-container">
      <h1 className="app-title">汉字显示</h1>
      
      {/* 添加新汉字的表单 */}
      <div className="add-form">
        <input
          type="text"
          placeholder="输入汉字"
          value={newChar}
          onChange={(e) => setNewChar(e.target.value)}
          maxLength={1}
          className="char-input"
        />
        <input
          type="text"
          placeholder="含义（可选）"
          value={newMeaning}
          onChange={(e) => setNewMeaning(e.target.value)}
          className="meaning-input"
        />
        <button onClick={addCharacter} className="add-button">添加</button>
      </div>

      {/* 汉字显示区域 */}
      <div 
        className="characters-container"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="characters-grid">
          {getCurrentPageCharacters().map((item, index) => (
            <div 
              key={`${item.char}-${index}`} 
              className="character-card"
            >
              <div className="character">{item.char}</div>
              {item.meaning && <div className="meaning">{item.meaning}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 分页控制 */}
      <div className="pagination">
        <button 
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="page-button"
        >
          上一页
        </button>
        <span className="page-info">
          {currentPage + 1} / {totalPages}
        </span>
        <button 
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="page-button"
        >
          下一页
        </button>
      </div>

      {/* 提示信息 */}
      <div className="swipe-hint">
        在移动设备上，可左右滑动翻页
      </div>
    </div>
  )
}

export default App
