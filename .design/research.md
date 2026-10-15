# Research and content evidence

Reviewed 15 October 2026 (Asia/Dhaka). Sources were opened through web research; links below are official project/provider documentation unless marked otherwise. Catalog inclusion means an option to scope and assess, not a tested production connector or partnership. This is a curated current set, not every agent framework in existence.

## Bangladesh-facing employee roles

The owner's explicit brief names accountant, customer care, social media, marketing and sales and asks for common company, organization, institution and personal needs. Bangladesh job listings provide directional evidence for these recognizable role families:

- [Bdjobs Dhaka job listings](https://bdjobs.com/h/jobs/?LocationId=1297&locationName=Dhaka): marketing, sales, administration, social media, e-commerce and admissions roles.
- [Bdjobs accounts and finance listings](https://bdjobs.com/h/jobs/?fcatId=1&requestType=new): accounts assistants and finance roles.
- [Customer support employer listing](https://gateway.bdjobs.com/joblist/details/1529984?ln=1): customer support and social media workflow requirements.

Personal Assistant and Academic Coordinator are inferred use-case groupings from the requested Personal and Institutions audiences, not claims of ranked hiring demand. Bangla/English captions, Messenger/WhatsApp inquiries, online-shop listings, cash-on-delivery reconciliation notes and admissions checklists are example workflows to scope; the site does not claim those integrations are already implemented. Accounting drafts do not authorize payments or tax filings; admissions support does not make admission or grading decisions.

## Framework and agent-platform catalog

| Name                      | Class                         | Official source                                                                   |
| ------------------------- | ----------------------------- | --------------------------------------------------------------------------------- |
| OpenAI Agents SDK         | SDK/framework                 | https://developers.openai.com/api/docs/guides/agents/sdk                          |
| Claude Agent SDK          | SDK/framework                 | https://claude.com/resources/articles/building-agents-with-the-claude-agent-sdk   |
| Google ADK                | SDK/framework                 | https://adk.dev/                                                                  |
| LangGraph                 | Orchestration framework       | https://docs.langchain.com/oss/python/langgraph/overview                          |
| LangChain                 | Agent framework               | https://docs.langchain.com/oss/python/langchain/overview                          |
| n8n                       | Workflow automation           | https://docs.n8n.io/advanced-ai/                                                  |
| OpenClaw                  | Agent platform/gateway        | https://docs.openclaw.ai/                                                         |
| Hermes Agent              | Agent platform                | https://github.com/NousResearch/hermes-agent                                      |
| CrewAI                    | Multi-agent framework         | https://docs.crewai.com/                                                          |
| Microsoft Agent Framework | Agent/orchestration framework | https://learn.microsoft.com/en-us/agent-framework/overview/                       |
| Pydantic AI               | Agent framework               | https://ai.pydantic.dev/                                                          |
| Mastra                    | TypeScript agent framework    | https://mastra.ai/docs                                                            |
| Agno                      | Agent framework               | https://docs.agno.com/                                                            |
| LlamaIndex                | Data/agent framework          | https://developers.llamaindex.ai/python/framework/module_guides/deploying/agents/ |
| smolagents                | Agent library                 | https://huggingface.co/docs/smolagents/index                                      |
| ChatGPT dots              | Agent platform, not an SDK    | https://learn.chatgpt.com/docs/dots                                               |

Microsoft's current Agent Framework documentation identifies it as the successor to AutoGen and Semantic Kernel. Those older projects are explained in the current framework's description rather than presented as separate latest recommendations. The user's “Harmes” is resolved to Nous Research's Hermes Agent. “OpenAI Agent Dot” is represented as ChatGPT dots and separated from the OpenAI Agents SDK. No inferred SDK for dots is invented.

## Interoperability

- [A2A official documentation](https://a2a-protocol.org/latest/): independent agents discover, delegate and exchange results; framework-independent agent-to-agent communication is distinct from tool calls.
- [Model Context Protocol introduction](https://modelcontextprotocol.io/docs/getting-started/intro): agent/application connections to tools, resources and external systems.

A2A and MCP are complementary. A protocol badge alone does not establish an end-to-end integration: compatible exposed capabilities, identity/authorization, workflow semantics and actual integration tests are still required. The public service promise is to design and verify those connections during scoping, not that all framework pairings work automatically.
