export class AgentCard {
  constructor({ id, name, role, description, skills = [] }) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.description = description;
    this.skills = skills;
  }

  // Google A2A Standardı JSON çıktısı
  toJSON() {
    return {
      protocol: "A2A/1.0",
      agent: {
        id: this.id,
        name: this.name,
        role: this.role,
        description: this.description
      },
      capabilities: {
        skills: this.skills
      }
    };
  }
}

export class A2AMessageBus {
  constructor() {
    this.registeredAgents = new Map();
  }

  register(agentCard) {
    this.registeredAgents.set(agentCard.id, agentCard);
    console.log(`[A2A BUS] Registered Agent: ${agentCard.name} (${agentCard.role})`);
  }

  getAgentCards() {
    return Array.from(this.registeredAgents.values()).map(agent => agent.toJSON());
  }
}