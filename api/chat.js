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

**重要**：
- ✅ `export default` で始まり、最後の `}` で終わる
- ✅ このJavaScriptコードだけ
- ❌ 説明文、マークダウン、コメント欄の説明は一切含めない

---

### ステップ4: 保存

1. 下にスクロール
2. **「Commit changes」** をクリック
3. ポップアップが出たら再度 **「Commit changes」**

---

### ステップ5: Vercelの自動再デプロイを待つ

保存すると、**Vercelが自動的に再デプロイ**します。

**待ち時間**: 1-2分

---

### ステップ6: 動作確認

1. **1-2分待つ**

2. **アプリのページをリロード**（F5）
```
   https://english-buddy-zeta.vercel.app/
