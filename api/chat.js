export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: "No message provided" });
      return;
    }

    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // نموذج مجاني قوي
        messages: [
          { 
            role: "system", 
            content: "You are a professional conversational AI specialized in contextual marketing. 
Your goal is to engage visitors coming from pop-under traffic, who may have random or unrelated interests.

Start the chat in an open, curiosity-driven, and friendly way without assuming anything about the visitor’s intent. Your main job is to:
1. Spark curiosity and keep the visitor engaged.
2. Ask **neutral**, **open-ended** questions to discover their current mood or interest.
3. Gradually guide the conversation based on their answers toward introducing a **personal discovery experience** related to **protecting online privacy and secure browsing**.
4. Only AFTER they express any slight interest in staying safe or improving something in their online experience, you may introduce a **smart VPN app** as a natural suggestion, **NOT as a sales pitch**, but as the logical result of their interaction.
" 
          },
          { 
            role: "user", 
            content: message 
          }
        ]
      })
    });

    const data = await response.json();

    console.log("Together AI Response:", JSON.stringify(data));

    if (!data.choices || !data.choices[0]) {
      res.status(500).json({ error: "Invalid response from Together AI", details: data });
      return;
    }

    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
