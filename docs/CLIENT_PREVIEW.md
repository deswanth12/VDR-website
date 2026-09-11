# Vijaya Durga Refrigeration (VDR)
## Client Preview Architecture & Operational Runbook

**Status**: Ready for Tunnel Connection  
**Target Environment**: Isolated Local / Staging (Port 3000)  
**Security Posture**: Frozen Production Codebase, Admin Protected, Zero Database Mutations

---

## 1. Preview Architecture

```text
┌──────────────────────────────┐
│   VDR Local Application      │
│   http://localhost:3000      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     cloudflared tunnel       │
│  (Cloudflare Edge Ingress)   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Temporary HTTPS Endpoint    │
│  https://<slug>.trycloudflare│
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Client Smartphone / Desktop  │
│ (Zero software installation) │
└──────────────────────────────┘
```

---

## 2. Prerequisites & Tunnel Installation

`cloudflared` is the approved, secure zero-trust tunneling tool by Cloudflare. It exposes `localhost:3000` via Cloudflare's encrypted global edge without opening inbound router ports or using unvetted public proxies.

### Windows Installation Command

To install `cloudflared` via Windows Package Manager:

```powershell
winget install --id Cloudflare.cloudflared --accept-package-agreements --accept-source-agreements
```

*Alternative direct download:* Download `cloudflared-windows-amd64.exe` from [Cloudflare's official releases](https://github.com/cloudflare/cloudflared/releases/latest) and place it in your `PATH`.

---

## 3. Launching the Preview

### Step 1: Verify Local Application Server
Ensure the existing VDR server is running on port 3000:
```powershell
npm run dev
# or for production build:
npm start
```
Verify locally: `http://localhost:3000`

### Step 2: Launch the Cloudflare Tunnel
In a new terminal window, execute:
```powershell
cloudflared tunnel --url http://localhost:3000
```

Cloudflare establishes the tunnel and exposes a temporary HTTPS preview URL:
```text
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
|  https://proposition-opinion-depend-josh.trycloudflare.com                               |
+--------------------------------------------------------------------------------------------+
```

---

## 4. Security & Production Isolation

1. **Production Isolation**: This preview serves strictly from the local environment. It does **not** connect to production VPS hosting, does not alter production DNS, and does not alter production database volumes.
2. **Admin Portal Protection**: `/admin` routes require the signed `vdr_admin_session` cookie. Unauthenticated requests to `/admin/*` are automatically redirected (HTTP 307) to `/admin/login`.
3. **No Secret Exposure**: Zero API keys, passwords, database filepaths, or session secrets are leaked in network responses or page source.
4. **Demo Data Disclosures**: All catalogue models display active "Demo Preview" and "Sample Catalogue" disclosures informing the client that real inventory will be ingested upon receipt of their files.

---

## 5. How to Stop the Tunnel & Server

- **Stop Cloudflare Tunnel**: In the terminal running `cloudflared`, press `Ctrl + C`. The tunnel terminates instantly and the preview URL becomes unreachable.
- **Stop Local Server**: In the terminal running Next.js, press `Ctrl + C`.

---

## 6. Client Review Checklist

Share the generated `https://*.trycloudflare.com` URL with the client. Instruct them to verify:
- [ ] Showroom address and landmark display (Opposite Pothamsetty Rammi Reddy Park)
- [ ] Brand listings (Daikin, Lloyd, Mitsubishi Electric, Samsung)
- [ ] AC Tonnage Calculator flow
- [ ] Mobile navigation and sticky bottom conversion dock (`WhatsApp Enquiry` / `Call Desk`)
- [ ] Spares trade counter overview
- [ ] Showroom contact form and Google Maps embed
