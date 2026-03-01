# Cloudflare + Vercel Domain Setup (Aliyun Transfer Included)

This guide configures `hellosleep.net` so traffic goes through Cloudflare DNS and resolves to your Vercel deployment.

## Goal

- Keep domain registration on Aliyun
- Move DNS hosting from Aliyun to Cloudflare
- Point root/apex and `www` to Vercel
- Keep downtime as close to zero as possible

---

## 1) Prepare in Vercel First

In your Vercel project:

1. Open `Settings -> Domains`
2. Add both:
   - `hellosleep.net`
   - `www.hellosleep.net`
3. Vercel will show required DNS records (the "DNS instructions")

Typical values:

- Apex/root (`@`): `A -> 76.76.21.21`
- `www`: `CNAME -> cname.vercel-dns.com`

Do not worry if Vercel shows "Invalid Configuration" before DNS is updated.

---

## 2) Add Site to Cloudflare

1. In Cloudflare, click `Add a site`
2. Enter `hellosleep.net`
3. Pick a plan (Free is fine to start)
4. Cloudflare scans current DNS records
5. Review imported records carefully

Important:

- Keep email-related records (`MX`, `TXT` SPF/DKIM/DMARC) if they exist
- Remove old web records that will conflict with Vercel target

---

## 3) Configure DNS in Cloudflare for Vercel

In Cloudflare `DNS -> Records`, ensure:

1. Root domain
   - Type: `A`
   - Name: `@`
   - IPv4: `76.76.21.21`
   - Proxy status: `DNS only` (gray cloud) during initial validation

2. WWW subdomain
   - Type: `CNAME`
   - Name: `www`
   - Target: `cname.vercel-dns.com`
   - Proxy status: `DNS only` (gray cloud) during initial validation

If old `A/AAAA/CNAME` for `@` or `www` exists, delete/replace to avoid conflicts.

---

## 4) Switch Nameservers at Aliyun (DNS Hosting Transfer)

This step makes Cloudflare authoritative DNS for your domain.

1. In Cloudflare, copy the two assigned nameservers (example: `xxx.ns.cloudflare.com`, `yyy.ns.cloudflare.com`)
2. Go to Aliyun domain console for `hellosleep.net`
3. Find Nameserver settings
4. Replace existing NS with Cloudflare NS
5. Save

Propagation usually takes minutes to several hours (sometimes up to 24-48h globally).

---

## 5) Validate the NS Switch

Use terminal checks:

```bash
dig NS hellosleep.net +short
```

Expected: only Cloudflare nameservers.

Then verify web records:

```bash
dig A hellosleep.net +short
dig CNAME www.hellosleep.net +short
```

Expected:

- `hellosleep.net` resolves to `76.76.21.21`
- `www.hellosleep.net` points to `cname.vercel-dns.com`

---

## 6) Cloudflare SSL/TLS Settings

In Cloudflare:

1. `SSL/TLS -> Overview`
2. Set encryption mode to `Full`

Do not use `Flexible`.

After everything is stable, you can evaluate `Full (strict)` if origin cert chain is fully valid end-to-end.

---

## 7) Confirm in Vercel

Back in Vercel `Settings -> Domains`:

- Wait until both domains show `Valid`
- Set preferred primary domain (apex or `www`)
- Enable redirect between apex and `www` as needed

---

## 8) Zero/Low-Downtime Cutover Strategy

If you want safer transition:

1. 24h before cutover, lower TTL on old Aliyun DNS records (if manageable)
2. Pre-create matching records in Cloudflare
3. Switch NS at Aliyun during low-traffic window
4. Monitor both DNS resolution and website health

---

## 9) Common Issues and Fixes

1. Vercel still says invalid
   - NS not fully propagated yet
   - Record mismatch (`@`, `www`, wrong target)
   - Conflicting `A/AAAA/CNAME` records still present

2. Website opens intermittently
   - Local/ISP DNS cache
   - Wait propagation; test using public resolvers

3. Redirect loop after enabling proxy
   - Check Cloudflare SSL mode is `Full`
   - Avoid mixed redirect rules in both Cloudflare and Vercel

4. Email stops working
   - Missing `MX/TXT` records in Cloudflare after migration
   - Re-add required mail provider records

---

## 10) Post-Cutover Checklist

- `https://hellosleep.net` loads correctly
- `https://www.hellosleep.net` loads and redirects as expected
- Vercel domain status is `Valid`
- Cloudflare SSL mode is `Full`
- API calls from frontend still work
- Email DNS records still present

---

## Optional: Enable Cloudflare Proxy Later

After the setup is stable:

- You can switch `@` and `www` from `DNS only` to `Proxied` (orange cloud)
- Re-test:
  - SSL
  - Redirects
  - Caching behavior
  - Any bot/protection rules

If issues appear, revert to `DNS only` first for quick recovery.
