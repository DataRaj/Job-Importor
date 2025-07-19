# 🚀 Scalable Job Importer System

A robust job import system that fetches job data from external APIs, processes them efficiently using a Redis-backed queue, stores them in MongoDB, and provides an admin interface for monitoring.

## ✨ Features

-   **Multi-source Data Fetching**: Integrates with various external RSS job feeds (Jobicy, HigherEdJobs).
-   **Queue-based Processing**: Utilizes **Redis & BullMQ** for reliable, asynchronous background job handling.
-   **Automated & Manual Imports**: Supports hourly cron-scheduled and on-demand manual import triggers.
-   **Comprehensive History Tracking**: Logs `totalFetched`, `newJobs`, `updatedJobs`, and `failedJobs` for each import run in a dedicated MongoDB collection.
-   **Searchable Job Listings**: Provides an admin UI to search and filter all imported jobs.
-   **Scalable Architecture**: Designed for modularity (NestJS modules, services, DTOs) to enable future microservice evolution.
-   **Robust Error Handling**: Includes retry logic for jobs and comprehensive logging for import failures.
-   **Interactive Admin UI**: Built with Next.js (Shadcn UI, Tailwind CSS) for monitoring import history and job data.

## 🏗️ Architecture

The system employs a decoupled, event-driven architecture to ensure scalability and responsiveness.

```mermaid
graph TD
    %% Define Nodes with Icons
    subgraph Admin User
        A[Admin User <br/> fa:fa-user]
    end

    subgraph Frontend (Next.js App)
        B[Admin UI <br/> fa:fa-laptop-code]
        B1(Import History <br/> Screen)
        B2(Job Search <br/> Screen)
        B3(Trigger Import <br/> Button)
        B --> B1
        B --> B2
        B --> B3
    end

    subgraph Backend (Nest.js Server)
        direction LR
        C[API Gateway <br/> fa:fa-server]
        subgraph Controllers
            C1(JobImportController)
            C2(JobController)
        end
        subgraph Services
            S1(JobService <br/> fa:fa-cloud-arrow-down)
            S2(ImportLogService <br/> fa:fa-file-lines)
            S3(JobSearchService <br/> fa:fa-magnifying-glass)
        end
        subgraph Queue Management
            QM1(Queue Producer <br/> fa:fa-upload)
        end
        subgraph Background Processing
            BG1(Scheduler <br/> fa:fa-clock)
            BG2(JobProcessor <br/> fa:fa-gears)
        end

        C --- C1
        C --- C2
        C1 --- S1
        C1 --- S2
        C2 --- S3
        S1 --- QM1
        BG1 --- S1
    end

    subgraph Queue (Redis + BullMQ)
        Q[Redis <br/> fa:fa-microchip]
        Q1(Job Queue)
        Q --> Q1
    end

    subgraph Databases (MongoDB + Mongoose)
        DB1[Jobs Collection <br/> fa:fa-database]
        DB2[Import Logs Collection <br/> fa:fa-database]
    end

    subgraph External Job APIs
        E1[Jobicy.com <br/> fa:fa-rss]
        E2[HigherEdJobs.com <br/> fa:fa-rss]
    end

    %% Define Flows
    A -- Interacts With --> B
    B3 -- Triggers POST API --> C1
    B1 -- GET Import Logs --> C1
    B2 -- GET/Search Jobs --> C2

    C1 -- Calls --> S1
    S1 -- Fetches Data --> E1
    S1 -- Fetches Data --> E2
    E1 -- XML Response --> S1
    E2 -- XML Response --> S1

    S1 -- Adds Jobs --> Q1
    BG1 -- Periodically Triggers --> S1

    Q1 -- Consumed By --> BG2
    BG2 -- Processes Jobs --> DB1
    BG2 -- Logs Import Status --> DB2

    C1 -- Reads Logs From --> DB2
    C2 -- Reads Jobs From --> DB1

    %% Optional: Async Nature & Error Reporting
    BG2 -- Reports Status/Errors --> S2
    S2 -- Updates --> DB2

    %% Styles for pleasing visuals
    classDef user fill:#D0F0C0,stroke:#333,stroke-width:2px,color:#000;
    classDef frontend fill:#E6FBFF,stroke:#333,stroke-width:2px,color:#000;
    classDef backend fill:#FFFBE6,stroke:#333,stroke-width:2px,color:#000;
    classDef queue fill:#FFE0B2,stroke:#333,stroke-width:2px,color:#000;
    classDef database fill:#C2E0FF,stroke:#333,stroke-width:2px,color:#000;
    classDef external fill:#F0F0F0,stroke:#333,stroke-width:2px,color:#000;
    classDef controller fill:#FFEFF0,stroke:#333,stroke-width:2px,color:#000;
    classDef service fill:#E0FFD4,stroke:#333,stroke-width:2px,color:#000;
    classDef queue_mgmt fill:#D4F0FF,stroke:#333,stroke-width:2px,color:#000;
    classDef background_proc fill:#F4E6FF,stroke:#333,stroke-width:2px,color:#000;

    class A user;
    class B frontend;
    class C backend;
    class Q queue;
    class DB1 database;
    class DB2 database;
    class E1 external;
    class E2 external;
    class C1,C2 controller;
    class S1,S2,S3 service;
    class QM1 queue_mgmt;
    class BG1,BG2 background_proc;