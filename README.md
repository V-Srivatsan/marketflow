# 📈 MarketFlow – Real-Time Stock Market Simulation

A real-time, multi-user stock market simulation platform designed for live event usage.
The system models dynamic stock behavior influenced by user transactions and synthetic market events, while ensuring consistent global state across concurrent users.

---

## 🚀 Overview

MarketFlow simulates a live trading environment where multiple users can:

* Buy and sell stocks in real time
* View dynamic price changes
* React to synthetic news events triggered by administrators
* Track portfolio holdings and transaction history

The system was tested during a live event with **100+ concurrent users**, requiring careful handling of real-time updates, state consistency, and transaction validation.

---

## 🏗️ Architecture

MarketFlow uses a two-service architecture:

* **API Service** – A stateless REST API built with FastAPI. Handles all client-facing requests (transactions, state retrieval, and real-time updates). Being stateless, it can be scaled horizontally without coordination overhead.
* **Engine Service** – A separate containerized service responsible for running the market simulation logic. It computes price changes, processes market events, and publishes updates to the API via Redis Pub-Sub.

Real-time updates flow as follows:

```
Engine → Redis Pub-Sub → API Service → FastChannels (WebSocket) → Client
```

This decoupling keeps the API layer clean and scalable while centralizing simulation logic in the Engine.

---

## ⚡ Real-Time Communication

* **REST APIs** → Initial state retrieval & transaction submission
* **FastChannels** → Live stock price updates & news event broadcasts
* Updates broadcast every ~2 seconds
* Server-side validation ensures consistent state across clients
* The stateless API service allows seamless horizontal scaling under load

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** FastAPI
* **Real-Time:** FastChannels (WebSocket library)
* **Database:** PostgreSQL
* **Caching:** Redis
* **Pub-Sub / Inter-Service Events:** Redis Pub-Sub
* **Containerization:** Docker

---

## 📊 Design Tradeoffs

* **Stateless API for horizontal scalability** – The API service holds no local state, allowing multiple instances to run in parallel without consistency issues. All shared state lives in PostgreSQL and Redis.
* **Centralized Engine for simulation correctness** – Market logic runs in a single Engine service, avoiding the complexity of distributed simulation state. This prioritizes correctness over Engine-level scalability.
* **Redis Pub-Sub for loose coupling** – The Engine and API communicate exclusively through Redis, meaning neither service needs direct knowledge of the other. This also makes it straightforward to swap or scale either service independently.
* **FastChannels over native WebSockets** – Using FastChannels instead of FastAPI's native WebSocket support gives better broadcast performance to multiple clients simultaneously.
* **Accepted tradeoff:** The Engine remains a single instance. Scaling it horizontally would require partitioning simulation state, which was out of scope for the current event-driven use case.

---

## 💻 Local Setup

* Setup Docker and Docker Compose CLI on your system
* Clone the repo using `git clone https://github.com/V-Srivatsan/marketflow.git`
* Open Powershell (Windows) / Terminal (macOS / Linux) in the project directory
* Run the following commands to set up the testing environment
  - Start the containers
    ```
    docker compose up
    docker compose exec -it server sh 
    ```
  - Once in the server instance, initialize the database
    ```
    python3
    >>> from data.init_test import *
    >>> create_test_data()
    ```
* That's it! Open `http://localhost:3000` to view the site