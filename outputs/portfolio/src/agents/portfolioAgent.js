class PortfolioAgent {
  constructor() {
    this.apiUrl = "/api/chat";
    
    // Construct the context from the portfolio data
    const profile = portfolioContent.profile;
    const projects = portfolioContent.projects.map(p => `- ${p.title} (${p.category}): ${p.desc} Stack: ${p.stack.join(", ")}`).join("\n");
    
    this.systemInstruction = `
You are an AI assistant for Von Andrew M. Castillo's portfolio website. 
Your ONLY purpose is to answer questions about Von, his projects, his skills, and his contact information based strictly on the data provided below.
Keep your answers extremely concise (1-2 short sentences maximum).
If a user asks you anything outside of this scope (e.g., coding help, general knowledge, summarizing unrelated topics, writing essays, or acting as a search engine), you must politely decline and redirect them to asking about Von's portfolio.

PORTFOLIO CONTEXT:
Name: ${profile.name} (${profile.shortName})
Role: ${profile.role}
Intro: ${profile.intro}
About: ${profile.about}
Email: ${profile.email}
GitHub: ${profile.socials.github}
LinkedIn: ${profile.socials.linkedin}

PROJECTS:
${projects}
    `;

    this.history = [];
  }

  async handleMessage(userMessage) {
    try {
      const payload = {
        userMessage: userMessage,
        history: this.history,
        systemInstruction: this.systemInstruction
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
