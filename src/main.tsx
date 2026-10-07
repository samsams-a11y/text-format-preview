import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { parseColorMarkers, toEscapedNewlines, toPreviewText, type TextColor } from './formatter'
import './style.css'

const sample = String.raw`@下賽季去留調查@\n\n各位兄弟大家好，因為目前正在討論下賽季的盟組安排與人員規劃，想先調查大家下賽季的意願，@請大家抽空回覆一下。@\n\n&請依照自己的情況選擇：&\n\n@① 繼續活躍

* 下賽季會繼續玩
* 可以正常上線、參與活動
* 願意配合盟的戰略與作戰安排@`

const markers: { syntax: string; color: TextColor }[] = [
  { syntax: '@藍色@', color: 'blue' },
  { syntax: '#黃色#', color: 'yellow' },
  { syntax: '$綠色$', color: 'green' },
  { syntax: '&紅色&', color: 'red' },
]

function App() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)
  const formatted = toEscapedNewlines(input)
  const runs = parseColorMarkers(toPreviewText(input))

  async function copyText() {
    try {
      await navigator.clipboard.writeText(formatted)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div className="eyebrow"><span className="eyebrow-dot" />文字小工具</div>
        <h1>文字格式化工具</h1>
        <p>將換行轉換成 <code>\n</code>，並預覽文字顏色標記</p>
      </header>

      <section className="input-panel" aria-labelledby="input-title">
        <div className="section-heading">
          <div>
            <h2 id="input-title">原始文字</h2>
            <p>輸入或貼上內容，預覽會即時更新</p>
          </div>
          <button className="button button-subtle" onClick={() => setInput(sample)} type="button">
            載入範例
          </button>
        </div>
        <label className="sr-only" htmlFor="source-text">原始文字</label>
        <textarea
          id="source-text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={'在這裡輸入或貼上文字…\n\n試試 @藍色@、#黃色#、$綠色$、&紅色& 標記'}
          spellCheck={false}
        />
        <div className="input-footer">
          <div className="marker-legend" aria-label="顏色標記語法">
            {markers.map(({ syntax, color }) => <code className={`color-text ${color}`} key={color}>{syntax}</code>)}
          </div>
          <span className="character-count">{input.length.toLocaleString('zh-Hant')} 字元</span>
        </div>
      </section>

      <section className="preview-grid" aria-label="即時預覽">
        <article className="preview-panel">
          <div className="preview-heading">
            <div>
              <h2>文字與顏色預覽</h2>
              <p>實際換行或 \n 都會另起一行；複製時保留顏色標記</p>
            </div>
            <button className="button button-copy" onClick={copyText} type="button" disabled={!input}>
              {copied ? '✓ 已複製' : '複製'}
            </button>
          </div>
          <div className={`preview-content combined-preview${input ? '' : ' is-empty'}`} aria-live="polite">
            {input
              ? runs.map((run, index) => run.color
                ? <span className={`color-text ${run.color}`} key={index}>{run.text}</span>
                : <React.Fragment key={index}>{run.text}</React.Fragment>)
              : '轉換後的文字與顏色效果會顯示在這裡'}
          </div>
        </article>
      </section>

      <footer className="page-footer">所有處理都在此裝置的瀏覽器中完成</footer>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
