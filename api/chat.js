export default async function handler(req, res) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // プリフライトリクエストに対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiKey, messages, model, max_tokens, system } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    // Anthropic APIを呼び出し
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-haiku-20241022',
        max_tokens: max_tokens || 100,
        system: system || '',
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
```

**コピー方法**：
1. 上のコードブロック全体を選択（`export` から最後の `}` まで）
2. **Ctrl+C**（Windowsの場合）または **Cmd+C**（Macの場合）
3. GitHubの編集エリアをクリック
4. **Ctrl+V**（または **Cmd+V**）で貼り付け

---

### ステップ5: 保存

1. 下にスクロール
2. **「Commit new file」** という緑のボタンをクリック

---

### ステップ6: 確認

リポジトリのメインページに戻ると、以下のようになっているはずです：
```
📁 api/                  ← フォルダが作成された！
  └─ 📄 chat.js         ← この中にファイルがある
📄 vercel.json
📄 english-buddy.html
📄 README.md
