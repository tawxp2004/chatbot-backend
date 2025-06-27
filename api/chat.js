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
      res.status(400).send("No message provided");
      return;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    console.log("OpenAI Response:", JSON.stringify(data));

    if (!data.choices || !data.choices[0]) {
      res.status(500).send("Invalid response from OpenAI");
      return;
    }

    // ✅ هنا الرد نص خام فقط
    res.status(200).send(data.choices[0].message.content);

  } catch (error) {
    console.error("API error:", error);
    res.status(500).send("Internal Server Error");
  }
}
