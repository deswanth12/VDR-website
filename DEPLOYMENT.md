# Production Deployment & Operations Manual
**Client**: Vijaya Durga Refrigeration, Ravulapalem  
**Architecture**: Next.js Standalone Docker + Persistent SQLite + Cloud Storage Abstraction

---

## 1. Quick Start with Docker Compose

### Prerequisites
- Docker Engine 24+ & Docker Compose v2+
- A VPS (e.g. Hetzner, DigitalOcean Droplet, AWS EC2, or Coolify host)

### Launch Commands
```bash
# 1. Clone repository
git clone <repo-url> /opt/vdr-showroom
cd /opt/vdr-showroom

# 2. Configure environment
cp .env.example .env
nano .env   # Set ADMIN_SESSION_SECRET and domain

# 3. Build & Run
docker compose up -d --build

# 4. View logs
docker compose logs -f vdr-web
```

The application will be live at `http://<your-server-ip>:3000`.

---

## 2. Coolify Deployment Guide (Recommended)

Coolify is an open-source, self-hosted PaaS alternative to Heroku/Vercel that runs on your VPS.

### Steps in Coolify Dashboard:
1. **Create New Project**: Select **Application** -> **Docker Compose** (or **Dockerfile**).
2. **Repository**: Connect your GitHub repository.
3. **Build Pack**: Select **Docker Compose** (pointing to `docker-compose.yml`) or **Dockerfile**.
4. **Persistent Storage (Critical Step)**:
   Navigate to **Storages** tab and configure:
   - **Source (Host Path or Named Volume)**: `vdr-db-data`
   - **Destination Path (Inside Container)**: `/app/data`
   - **Uploads Volume**: `vdr-uploads-data` -> `/app/public/uploads`
   > ⚠️ **CRITICAL**: If `/app/data` is not configured as persistent storage in Coolify, redeploying the container will reset SQLite to initial seed state!
5. **Environment Variables**:
   Add all variables from `.env.example`:
   - `DATABASE_URL=file:/app/data/vdr.db`
   - `ADMIN_SESSION_SECRET=<random-32-chars>`
   - `STORAGE_PROVIDER=local` (or `cloudinary`)
6. **Domain & SSL**:
   - Set Domain: `https://vijayadurgarefrigeration.com`
   - Enable automated Let's Encrypt SSL certificate.
7. **Deploy**: Click **Deploy**.

---

## 3. SQLite Persistence Verification

To verify that your database survives container restarts:

```bash
# 1. Exec into container and verify file exists
docker exec -it vdr-showroom-production ls -la /app/data

# 2. Restart container
docker restart vdr-showroom-production

# 3. Check that products and tables remain intact
docker exec -it vdr-showroom-production ls -la /app/data/vdr.db
```

---

## 4. Point-in-Time Snapshot & Backup Procedures

### A. Inside Admin Settings (No Terminal Needed)
1. Log in to the Admin Portal at `https://your-domain.com/admin/login`.
2. Navigate to **Security & Settings** (`/admin/settings`).
3. Under **Database Health & Snapshot Center**:
   - Click **[Export SQLite (.db)]** to download an immediate raw SQLite backup.
   - Click **[Export Full JSON]** to download a portable JSON dump.
   - Enter a label (e.g. `Pre-Onboarding-Client-Data`) and click **Create Point-in-Time Snapshot**.

### B. Command-Line Backup
```bash
# Copy live database from running container to host
docker cp vdr-showroom-production:/app/data/vdr.db ./backup_$(date +%F).db

# Copy all snapshots
docker cp vdr-showroom-production:/app/data/snapshots ./snapshots_backup/
```

---

## 5. Safe Disaster Recovery & Restore

### A. Web UI Restore with Automated Safety Rollback
1. Go to `/admin/settings`.
2. Find the desired snapshot in the **Available Point-in-Time Snapshots** table.
3. Click the **Restore** button.
4. An explicit confirmation dialog appears detailing the snapshot date and inventory count.
5. Click **Confirm & Restore Now**.
   - The system automatically captures a `Pre_Restore_Safety_Backup` first.
   - If any corruption is detected, it automatically reverts to the pre-restore state.
   - On success, public routes (`/`, `/catalogue`, `/compare`) are revalidated immediately.

### B. Emergency Terminal Recovery
If the web UI is unreachable:
```bash
# 1. Stop container
docker compose down

# 2. Replace database file on host
cp /path/to/backup.db /var/lib/docker/volumes/vdr_production_db/_data/vdr.db

# 3. Remove lingering lock files
rm -f /var/lib/docker/volumes/vdr_production_db/_data/vdr.db-wal
rm -f /var/lib/docker/volumes/vdr_production_db/_data/vdr.db-shm

# 4. Restart container
docker compose up -d
```

---

## 6. Client Onboarding Staging Protocol

When Vijaya Durga Refrigeration sends their official catalogue:

```
CLIENT DATA RECEIVED (.xlsx / .csv)
         │
         ▼
[ Step 1: Open /admin/settings ]
   -> Click "Create Point-in-Time Snapshot"
   -> Click "Export SQLite (.db)" for local backup
         │
         ▼
[ Step 2: Open /admin/import ]
   -> Upload client CSV
   -> Review Intelligent Normalizer column mappings
   -> Inspect "Net New" vs "Existing Updates" vs "Errors"
         │
         ▼
[ Step 3: Test & Validate in Staging ]
   -> Verify 100% specs, images, and mobile touch targets
   -> Confirm showroom contact & WhatsApp enquiry messages
         │
         ▼
[ Step 4: Final Admin Confirmation ]
   -> Click "Execute Import"
   -> Public catalogue revalidates automatically!
```
