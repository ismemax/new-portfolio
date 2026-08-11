class PortfolioAgent {
  constructor() {
    this.apiUrl = "/api/chat";
    this.history = [];
  }

  async handleMessage(userMessage) {
    try {
      const payload = {
        userMessage: userMessage,
        history: this.history
      };

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 500) {
          const errorData = await response.json();
          if (errorData.detail.includes("GEMINI_API_KEY not configured")) {
            return "⚠️ The AI is currently offline. Please configure the GEMINI_API_KEY in the `.env` file and restart the server.";
          }
        }
        return "Sorry, I encountered an error connecting to my brain. Please try again later.";
      }

      const data = await response.json();
      const aiText = data.response;
      
      // Update local history
      this.history.push({ role: "user", parts: [{ text: userMessage }] });
      this.history.push({ role: "model", parts: [{ text: aiText }] });
      
      // Keep only the last 10 messages (5 turns)
      if (this.history.length > 10) {
        this.history = this.history.slice(this.history.length - 10);
      }

      return data;
      
    } catch (error) {
      console.error("AI Assistant Error:", error);
      return "Sorry, something went wrong while processing your request. Is the backend server running?";
    }
  }
}
