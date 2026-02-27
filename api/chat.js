export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiKey, messages, system } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    // メッセージを整形（最新のユーザーメッセージのみ使用）
    const userMessage = messages[messages.length - 1].content;
    
    // システムプロンプトとユーザーメッセージを結合
    const fullPrompt = system 
      ? `${system}\n\nUser: ${userMessage}\nAssistant:`
      : userMessage;

    // Google Gemini APIを呼び出し
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 100,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    
    // Geminiのレスポンスを整形
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not understand.';
    
    // Claude互換のレスポンス形式に変換
    const claudeFormat = {
      content: [{
        type: 'text',
        text: text.trim()
      }]
    };

    return res.status(200).json(claudeFormat);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}



