import { useState, useRef, useEffect } from 'react'
import './App.css'

interface ChineseCharacter {
  char: string
}

function App() {
  // 默认的汉字数组
  const [characters, setCharacters] = useState<ChineseCharacter[]>([
    { char: '人' },
    { char: '头' },
    { char: '目' },
    { char: '眉' },
    { char: '鼻' },
    { char: '耳' },
    { char: '口' },
    { char: '舌' },
    { char: '田' },
    { char: '牙' },
    { char: '心' },
    { char: '开' },
    { char: '手' },
    { char: '足' },
    { char: '身' },
    { char: '一' },
    { char: '二' },
    { char: '三' },
    { char: '四' },
    { char: '五' },
    { char: '六' },
    { char: '七' },
    { char: '八' },
    { char: '九' },
    { char: '十' },
    { char: '个' },
    { char: '零' },
    { char: '大' },
    { char: '月' },
    { char: '日' },
    { char: '丁' },
    { char: '木' },
    { char: '水' },
    { char: '土' },
    { char: '屁' },
    { char: '火' },
    { char: '电' },
    { char: '有' },
    { char: '朋' },
    { char: '友' },
    { char: '中' },
    { char: '多' },
    { char: '少' },
    { char: '长' },
    { char: '短' },
    { char: '豆' },
    { char: '知' },
    { char: '东' },
    { char: '西' },
    { char: '南' },
    { char: '北' },
    { char: '上' },
    { char: '下' },
    { char: '左' },
    { char: '右' },
    { char: '工' },
    { char: '车' },
    { char: '女' },
    { char: '妈' },
    { char: '爸' },
    { char: '儿' },
    { char: '子' },
    { char: '石' },
    { char: '王' },
    { char: '白' },
    { char: '黑' },
    { char: '门' },
    { char: '问' },
    { char: '无' },
    { char: '公' },
    { char: '弯' },
    { char: '厂' },
    { char: '前' },
    { char: '后' }
  ])

  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(6) // 默认为移动端显示数量
  const [userDefinedPageSize, setUserDefinedPageSize] = useState<number | null>(null) // 用户自定义页面大小
  const [showAll, setShowAll] = useState(false) // 是否显示全部内容
  const containerRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const currentX = useRef(0)
  const isSwiping = useRef(false)
  
  // 根据屏幕宽度动态设置每页显示数量（如果用户没有自定义）
  useEffect(() => {
    const handleResize = () => {
      // 如果用户没有自定义页面大小，则根据屏幕宽度设置
      if (userDefinedPageSize === null) {
        if (window.innerWidth >= 768) {
          setItemsPerPage(10) // PC端显示10个（5×2布局）
        } else {
          // 移动端根据屏幕宽度自适应
          const screenWidth = window.innerWidth;
          if (screenWidth >= 480) {
            setItemsPerPage(6); // 平板或大屏手机显示6个
          } else {
            setItemsPerPage(4); // 小屏手机显示4个
          }
        }
      }
    }
    
    // 初始设置
    handleResize()
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
    
    // 清理函数
    return () => window.removeEventListener('resize', handleResize)
  }, [userDefinedPageSize])

  // 处理页面大小变化
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value)
    if (value > 0) {
      setUserDefinedPageSize(value)
      setItemsPerPage(value)
      setCurrentPage(0) // 重置到第一页
    } else {
      // 重置为自动模式
      setUserDefinedPageSize(null)
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setItemsPerPage(10)
        } else {
          setItemsPerPage(6)
        }
      }
      handleResize()
      setCurrentPage(0)
    }
  }

  // 计算总页数
  const totalPages = showAll ? 1 : Math.ceil(characters.length / itemsPerPage)

  // 获取当前显示的字符
  const getDisplayedCharacters = () => {
    if (showAll) {
      return characters // 显示全部内容
    }
    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return characters.slice(startIndex, endIndex)
  }

  // 切换显示全部/分页显示
  const toggleShowAll = () => {
    setShowAll(!showAll)
    setCurrentPage(0) // 重置到第一页
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
      
      {/* 添加新汉字的表单和页面大小设置 */}
      {/* 显示控制 */}
      <div className="display-control">
        <button 
          onClick={toggleShowAll} 
          className="show-all-button"
        >
          {showAll ? '分页' : '全部'}
        </button>
        
        {!showAll && (
          <div className="page-size-control">
            <label htmlFor="pageSize">个数：</label>
            <select 
              id="pageSize" 
              value={userDefinedPageSize === null ? 'auto' : userDefinedPageSize}
              onChange={handlePageSizeChange}
              className="page-size-select"
            >
              <option value="auto">自动</option>
              <option value="4">4个</option>
              <option value="6">6个</option>
              <option value="8">8个</option>
              <option value="10">10个</option>
              <option value="12">12个</option>
              <option value="16">16个</option>
            </select>
           
          </div>
        )}
      </div>

      {/* 汉字显示区域 */}
      <div 
        className={`characters-container ${showAll ? 'show-all' : ''}`}
        ref={containerRef}
        onTouchStart={!showAll ? handleTouchStart : undefined}
        onTouchMove={!showAll ? handleTouchMove : undefined}
        onTouchEnd={!showAll ? handleTouchEnd : undefined}
      >
        <div className={`characters-grid ${showAll ? 'show-all' : ''}`}>
          {getDisplayedCharacters().map((item, index) => (
            <div 
              key={`${item.char}-${index}`} 
              className="character-card"
            >
              <div className="character">{item.char}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 分页控制 - 仅在非显示全部模式下显示 */}
      {!showAll && (
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
      )}
    </div>
  )
}

export default App
