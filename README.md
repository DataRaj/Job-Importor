%% Frontend Section
A[Next.js Frontend] -->|API Calls| B[Express API Server]

%% Backend API Server
B --> C[Job Creation Logic]
B --> D[Job Queue Manager (BullMQ)]
B --> E[Database Access Layer]

%% Job Creation and Processing
C --> D
D -->|Uses| F[(Redis)]
D --> G[Job Workers]
G -->|Process Jobs| H[MongoDB / PostgreSQL]

%% Scheduled Jobs
I[Cron Scheduler] --> D

%% Realtime Updates
G -->|Emit Status| J[Socket.IO Server]
J --> A

%% Admin Dashboard (Optional)
K[Admin Panel] --> B

%% External Trigger / 3rd Party
L[Webhook / External System] --> B

%% Notes Style
classDef db fill:#fdf6e3,stroke:#657b83,stroke-width:1px;
class F,H db;
