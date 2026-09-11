# Vijaya Durga Refrigeration (VDR)
## Production Deployment, Container Persistence & Client Onboarding Runbook

This document is the authoritative engineering specification for deploying the **Vijaya Durga Refrigeration Sales Showroom & Operations Platform** into production using Docker, Coolify, or a Linux VPS, and onboarding real client catalogue data.

---

## 1. System Architecture Overview

```text
                                Internet (Clients & Showroom Walk-ins)
                                                  │
                                                  ▼
                                      Reverse Proxy (Caddy / Traefik)
                                           [SSL / Let's Encrypt]
                                                  │
                                                  ▼
                         ┌─────────────────────────────────────────────────┐
                         │   Next.js 16 Standalone Container (Alpine Linux) │
                         │   Node.js 20 Runner                             │
                         │   Non-root user: nextjs (UID 1001)              │
                         │   Port: 3000                                    │
                         └──────────────────────┬──────────────────────────┘
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       ▼                                                 ▼
          Persistent Volume: /app/data                     Persistent Volume: /app/public/uploads
          ┌───────────────────────────────┐               ┌──────────────────────────────────────┐
          │ • SQLite Database: vdr.db     │               │ • Uploaded product photos (local)    │
          │ • Point-in-time snapshots:    │               │ • Dynamic route: /uploads/[filename] │
          │   /app/data/snapshots/*.db    │               │ • Or Cloud Object Store (Cloudinary) │
          └───────────────────────────────┘               └──────────────────────────────────────┘
```

### Key Architectural Invariants
1. **Zero Database Overwrites**: The SQLite database (`vdr.db`) lives inside `/app/data` mounted to a Docker persistent volume (`vdr_production_db`). Container destructions, updates, and image rebuilds do not touch the volume.
2. **Dynamic Media Asset Serving**: Uploaded product images are served via the Next.js runtime route handler (`/uploads/[filename]`), guaranteeing that newly added photos are instantly accessible over HTTP without rebuilding or restarting the container.
3. **Automated Cold-Start Provisioning**: If deployed onto a brand new server with an empty volume, `scripts/docker-init.mjs` automatically executes `CREATE TABLE IF NOT EXISTS` and creates the primary administrator account. If an existing database is detected, it retains all records without modification.

---

## 2. Server Sizing & Prerequisites

| Resource | Minimum Requirement | Recommended Specification |
| :--- | :--- | :--- |
| **Provider** | Any Linux VPS (Hetzner, DigitalOcean, Linode, AWS EC2) | Hetzner Cloud (CPX11 / CX22) or DigitalOcean ($6/mo) |
| **CPU** | 1 vCPU (x86_64 or ARM64) | 2 vCPU |
| **RAM** | 1 GB | 2 GB |
| **Disk** | 15 GB SSD / NVMe | 25 GB NVMe |
| **OS** | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| **Platform** | Docker Engine 24+ & Docker Compose v2 | Coolify v4 (Self-hosted PaaS) |

---

## 3. Coolify Deployment Guide (Recommended)

Coolify provides automated Git deployments, Traefik reverse proxying, free Let's Encrypt SSL certificates, and persistent volume management.

### Step 1: Create Application in Coolify
1. In your Coolify dashboard, select your server and click **+ New Resource** → **Application** → **Public/Private Repository**.
2. Connect your Git repository (`c:\VR sales` or GitHub/GitLab remote).
3. Select branch: `main` (or `production`).
4. Set Build Pack: **Dockerfile**.

### Step 2: Configure Persistent Storage Volumes
Under **Configuration → Storage**, ensure the following two persistent volume mounts are configured:

| Source (Host / Named Volume) | Destination (Container Path) | Purpose |
| :--- | :--- | :--- |
| `vdr_production_db` | `/app/data` | Persists SQLite database (`vdr.db`) and snapshots |
| `vdr_production_uploads` | `/app/public/uploads` | Persists locally uploaded catalogue product images |

> [!CAUTION]
> If you do not mount `/app/data` to a persistent volume, all catalogue modifications, admin credentials, and customer enquiries will be destroyed whenever Coolify rebuilds the container!

### Step 3: Configure Environment Variables
Under **Configuration → Environment Variables**, add:

```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
DATABASE_URL=file:/app/data/vdr.db
ADMIN_SESSION_SECRET=GENERATE_A_64_CHARACTER_RANDOM_HEX_STRING
ADMIN_INITIAL_EMAIL=admin@vijayadurgarefrigeration.com
ADMIN_INITIAL_PASSWORD=GENERATE_A_HIGH_ENTROPY_PASSPHRASE
STORAGE_PROVIDER=local
NEXT_PUBLIC_APP_URL=https://vijayadurgarefrigeration.com
```

*(Optional: If using Cloudinary for media storage, set `STORAGE_PROVIDER=cloudinary` and supply `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`).*

### Step 4: Configure Domain & SSL
1. Set Domain: `https://vijayadurgarefrigeration.com` (and `https://www.vijayadurgarefrigeration.com`).
2. Point your DNS A-record to your VPS IP address.
3. Coolify will automatically provision Let's Encrypt SSL certificates.
4. Click **Deploy**.

---

## 4. Manual VPS Deployment via Docker Compose

If deploying directly on a VPS without Coolify:

```bash
# 1. Clone repository onto VPS
git clone https://github.com/your-org/vdr-sales.git /opt/vdr-sales
cd /opt/vdr-sales

# 2. Create production environment file
cp .env.example .env.production

# 3. Build and launch container in background
docker compose -f docker-compose.yml --env-file .env.production up -d --build

# 4. Verify container health
docker compose ps
docker compose logs -f vdr-web
```

---

## 5. Persistence & Disaster Recovery Protocol

### Automated Safety Mechanism
Every time an administrator performs a point-in-time restore in `/admin/settings`, the system automatically executes a **Pre-Restore Safety Backup** (`snap_<timestamp>_Pre_Restore_Safety_Backup.db`). If any SQLite error occurs, the previous state is preserved.

### Host-Level Snapshotting (Cron Job)
Add a root cron job on your VPS to archive the persistent database volume weekly:

```bash
# /etc/cron.weekly/vdr-db-backup
#!/bin/bash
BACKUP_DIR="/var/backups/vdr"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

# Safe atomic copy of the live SQLite database
docker exec vdr-showroom-production sqlite3 /app/data/vdr.db ".backup '$BACKUP_DIR/vdr_$TIMESTAMP.db'"
gzip "$BACKUP_DIR/vdr_$TIMESTAMP.db"

# Retain backups for 30 days
find "$BACKUP_DIR" -type f -name "*.db.gz" -mtime +30 -delete
```

---

## 6. Real Client Catalogue Onboarding Protocol

When the Vijaya Durga Refrigeration team provides their real product inventory spreadsheet, execute this controlled 5-stage onboarding sequence:

```text
STAGE 1: RECEIVE & AUDIT
       ↓
STAGE 2: PREVIEW & NORMALIZE (/admin/import)
       ↓
STAGE 3: DUPLICATE & SKU RESOLUTION
       ↓
STAGE 4: ATOMIC COMMIT
       ↓
STAGE 5: IMAGE MATCHING & PUBLIC VERIFICATION
```

### Stage 1: File Reception & Format Normalization
1. Request catalogue in `.xlsx` or `.csv`.
2. Ensure columns correspond to standard product attributes:
   - `name` / `product_title` (e.g., *Daikin 1.5 Ton 5-Star Inverter Split AC*)
   - `brand` (e.g., *Daikin*, *Lloyd*, *Mitsubishi Electric*, *Samsung*)
   - `category` (e.g., *Split AC*, *Washing Machine*, *AC Spares*)
   - `model` / `sku` (e.g., *FTKM50*, *GLS18I52WBA*)
   - `capacity` / `tonnage` (e.g., *1.5 Ton*, *7.0 kg*)
   - `star_rating` (e.g., *5*, *3*)
   - `features` (pipe-separated `|` or comma-separated)
   - `specs` (key:value format)
   - `suitable_for` (e.g., *Bedrooms 110 - 150 sq.ft*)

### Stage 2: Upload to Admin Ingestion Pipeline
1. Log into `/admin/import`.
2. Download standard reference template: `vdr_catalogue_template.csv` to compare.
3. Upload client CSV or paste raw spreadsheet text into the editor.
4. Click **Validate & Preview Rows**.

### Stage 3: Duplicate Strategy Selection
The system automatically compares each row against existing database models and SKUs:
- **Strategy A: Update Existing Items (Recommended)**: If a model matches an existing item, its specifications, star rating, and features are updated with the real client spreadsheet.
- **Strategy B: Skip Existing Items**: Only inserts brand new models.

### Stage 4: Atomic Commit to Production Database
1. Review the preview metrics:
   - Total Rows
   - Valid Ready
   - Net New Items
   - Existing Updates
   - Validation Errors
2. Click **Execute Import (X Items)**.
3. The server writes records atomically into the persistent SQLite database in a single database transaction.

### Stage 5: Image Matching & Quality Assurance
1. Navigate to `/admin/products`.
2. Inspect imported products.
3. For items requiring specific showroom photographs:
   - Click **Edit**.
   - Navigate to **Section 4: Media & Image Gallery**.
   - Drag and drop real showroom photos (JPEG/PNG/WebP, max 5MB).
   - Reorder primary image.
   - Click **Save Product**.
4. Test live storefront at `/catalogue` and click **Enquire on WhatsApp** on mobile to verify customer conversion routing.

---

## 7. Emergency Runbook & Troubleshooting

### Container Won't Start
```bash
# Check startup logs
docker logs vdr-showroom-production

# Common issues:
# 1. Port 3000 already bound -> Change HOST_PORT in compose file
# 2. Permissions on /app/data -> Ensure UID 1001 (nextjs) owns /app/data
docker exec -u 0 vdr-showroom-production chown -R 1001:1001 /app/data /app/public/uploads
```

### Database Locked (`SQLITE_BUSY`)
The `@libsql/client` driver uses WAL (Write-Ahead Logging) mode. If locks occur:
```bash
docker exec vdr-showroom-production sqlite3 /app/data/vdr.db "PRAGMA wal_checkpoint(TRUNCATE);"
```

### Reset Admin Password from Host
If administrator credentials are forgotten:
```bash
# Run cold start init with override
docker exec -e ADMIN_INITIAL_PASSWORD="NewPass@2026!" vdr-showroom-production node scripts/docker-init.mjs
```
