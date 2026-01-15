# 🕸️ Personal Intelligence ETL GraphRAG

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Neo4j](https://img.shields.io/badge/GraphDB-Neo4j-008CC1.svg)](https://neo4j.com/)
[![Redis](https://img.shields.io/badge/Queue-BullMQ-FF4438.svg)](https://bullmq.io/)

Open-source ETL pipeline designed to ingest unstructured personal data (text, social media, videos, images, PDFs) and transform it into a **Knowledge Graph** for advanced Retrieval-Augmented Generation (RAG).

---

## 📖 Table of Contents
- [Project Overview](#project-overview)
- [Design Decisions](#design-decisions)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Consent & Security](#consent--security)

---

## 🚀 Project Overview
This system solves the "context gap" in standard RAG by building explicit relationships between entities. Unlike flat vector databases, this system understands that **Person A** met **Person B** at **Location C** on **Date D**, allowing for complex multi-hop queries about an individual's history and events.

## 🧠 Design Decisions

### 1. The "Express-Way" Producer-Consumer Model
We avoided monolithic processing. **Express.js** acts as a lightweight API Gateway that validates requests and offloads heavy processing to **BullMQ** workers.
* **Why?** Extraction (LLMs) and transformation (Graph logic) are time-consuming. This decoupling ensures the API never times out and tasks are retried automatically upon failure.

### 2. Adapter-Based Extraction Layer
Instead of hardcoding file logic, we use an **Adapter Pattern** for extraction.
* **Why?** It allows the system to scale to new data sources (Slack, WhatsApp, LinkedIn) by simply adding a new adapter class in `src/services/extractors/` without modifying the core pipeline.

### 3. Schema-Driven Knowledge Extraction
We utilize **Instructor-JS** + **Zod** to force LLMs into producing strictly typed Graph Triplets ($Subject \to Predicate \to Object$).
* **Why?** To ensure Graph integrity. Without strict schemas, LLM-generated relationships become inconsistent, leading to a "knowledge hairball" that is impossible to query.

### 4. Hybrid Storage (Vector + Graph)
The system uses **Neo4j** as a unified store for both relational data and vector embeddings.
* **Why?** This enables **Hybrid Search**. We can find a starting node via vector similarity and then traverse the graph edges to pull in contextually relevant neighboring information.

---

## 🏗️ Architecture



1. **Ingest:** Express API receives raw file/data + consent token.
2. **Queue:** BullMQ pushes an `ETL_JOB` to Redis.
3. **Extract:** The `ExtractorManager` selects the correct adapter (PDF, Mail, etc.).
4. **Transform:** LLM extracts entities and relationships; embedding models generate vectors.
5. **Load:** Cypher queries `MERGE` data into Neo4j.

---

## 🛠️ Tech Stack
* **Language:** TypeScript (Node.js)
* **API:** Express.js
* **Task Queue:** BullMQ + Redis
* **Graph DB:** Neo4j (Community Edition)
* **Schema/Validation:** Zod
* **LLM Tooling:** Instructor-JS
* **Embeddings:** Transformers.js / OpenAI

---

## 📂 Project Structure
```text
src/
├── api/             # API Routes & Controllers
├── workers/         # BullMQ Worker logic
├── services/        # Extractors, Graph & LLM logic
├── schema/          # Zod definitions for Triplets
├── queue/           # Redis/BullMQ connection config
└── index.ts         # Server entry point