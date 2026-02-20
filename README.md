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

## ⚡ Real-Time Communication

* REST APIs → Initial state retrieval & transactions
* WebSockets → Live stock updates & news events
* Updates broadcast every ~2 seconds
* Server-side validation ensures consistent state across clients

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** FastAPI
* **Real-Time:** WebSockets
* **Database:** PostgreSQL
* **Caching:** Redis
* **Containerization:** Docker

---

## 📊 Design Tradeoffs

* Optimized for event-based vertical scaling rather than distributed microservices
* Prioritized consistency and correctness over horizontal scalability
* Accepted limitations on large-scale socket handling due to time constraints

---

## 💻 Local Setup

* Setup Docker and Docker Compose cli on your system
* Clone the repo using `git clone https://github.com/V-Srivatsan/marketflow.git`
* Open Powershell (Windows) / Terminal (MacOS / Linux) in the project directory
* Run the following commands to setup the testing environment
  - Setup the containers
    ```
    docker compose up
    docker compose exec -it server sh 
    ```
  - Once in the server instance, you can run the following to setup the database
    ```
    python3
    >>> from data.init_test import *
    >>> create_test_data()
    ```
* That's it! You can open `http://localhost:3000` to view the site
