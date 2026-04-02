exports.handler = async (event) => {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  try {
    const { messages } = JSON.parse(event.body);
    const lastMessage = messages[messages.length-1]?.content || "";
    
    if (!API_KEY) {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          response: "🌿 Add your Gemini API key in Netlify environment variables to enable AI features. For now, I'm here to help with sustainable engineering! 💚" 
        })
      };
    }
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "You are Eco Green AI, a sustainable engineering mentor. Be helpful and encouraging.\n\nUser: " + lastMessage + "\n\nAssistant:"
            }]
          }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
        })
      }
    );
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      return {
        statusCode: 200,
        body: JSON.stringify({ response: data.candidates[0].content.parts[0].text })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ response: "🌿 I'm here to help with sustainable engineering! What would you like to know?" })
      };
    }
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({ response: "🌿 Welcome to ECO GREEN! Ask me about sustainable engineering projects! 💚" })
    };
  }
};
