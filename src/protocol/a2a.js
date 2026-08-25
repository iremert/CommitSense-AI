// Google A2A Görev Durumları, ajan hangi aşamada anlarız
export const TaskStatus = {
  SUBMITTED: "submitted",
  WORKING: "working",
  COMPLETED: "completed",
  FAILED: "failed"
};

// 1. Agent Kimlik Kartı
export class AgentCard {
  constructor({ id, name, role, description, skills = [] }) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.description = description;
    this.skills = skills;
  }

  toJSON() { //diğer ajanların anlayacağı şekle soktuk
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

// 2. A2A Artifact (Ajan Analiz Çıktı Zarfı) , ajanın analiz sonucu ürettiği çıktıyı paketer
export class Artifact {
  constructor({ type = "analysis_result", data = {} }) {
    this.type = type;
    this.data = data;
    this.createdAt = new Date().toISOString();
  }
}

// 3. A2A Görev & Mesaj Zarfı, ajanın yaşam döngüsü
export class Task {
  constructor({ taskId, agentId, inputData }) {
    this.taskId = taskId || `task_${Date.now()}`;
    this.agentId = agentId;
    this.inputData = inputData;
    this.status = TaskStatus.SUBMITTED;
    this.artifacts = [];
    this.error = null;
  }

  markWorking() {
    this.status = TaskStatus.WORKING;
  }

  complete(artifactData) {
    this.status = TaskStatus.COMPLETED;
    this.artifacts.push(new Artifact({ data: artifactData }));
  }

  fail(errorMessage) {
    this.status = TaskStatus.FAILED;
    this.error = errorMessage;
  }
}

// 4. A2A Santrali (Message Bus & Agent Registry)
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