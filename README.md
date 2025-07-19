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
```
+---------------------+       +---------------------------+       +---------------------+
|  Next.js Frontend   |<----->|     Nest.js Backend       |<----->|  External Job APIs  |
| (Admin Dashboard)   |       |    (API Server)           |       | (Job Feeds: RSS)    |
|                     |       |                           |       |                     |
| - View Import Logs  |       | - REST API Endpoints      |       |                     |
| - Trigger Imports   |       | - Cron Scheduler          |       |                     |
| - Search Jobs       |       | - XML Parser              |       |                     |
+---------------------+       | - Queue Producer          |       +---------------------+
          ^ |                 +---------------------------+
          | |                              |
          | |                              | (Adds Jobs to Queue)
          | |                              v
          | |                      +---------------------+
          | +--------------------->|     Redis Queue     |
          |                        |     (BullMQ)        |
          |                        +---------------------+
          |                                  ^
          |                                  |
          |                                  | (Pulls Jobs for Processing)
          |                                  |
          |                        +---------------------+
          |                        |  BullMQ Job Worker  |
          |                        |  (JobProcessor)     |
          |                        | - Processes Job Data|
          |                        | - Handles Upserts   |
          |                        | - Logs Failures     |
          |                        +---------------------+
          |                                  |
          |                                  | (Stores Processed Jobs & Logs History)
          |                                  v
          +-----------------------------------------------------+
            |           MongoDB Database (Mongoose)           |
            |                                                   |
            | - 'jobs' Collection (Processed Job Data)          |
            | - 'import_logs' Collection (Import History Tracking)|
            +-----------------------------------------------------+
```