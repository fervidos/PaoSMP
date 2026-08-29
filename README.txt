PaoSMP Paper 1.21.11 Server - PM2 Setup
========================================
Location: C:\Users\sales\Downloads\PaoSMP-Server
Paper Version: 1.21.11 build 132 (2026-05-11) - paper-1.21.11-132.jar (54MB)
Java: Temurin 25.0.2 (requires Java 21+, using 25)
RAM: -Xms2G -Xmx4G (adjust in ecosystem.config.js if need)

Nexora Resource Pack:
- Source: C:\Users\sales\Downloads\PaoSMP (53MB unpacked, 6994 files)
- Zipped: PaoSMP.zip (17.48MB, sha1 a6f0c23f9dd076ec61c6a3d4413d1855323ee74d) hosted via pack-host.js
- URL: http://192.168.1.240:8123/PaoSMP.zip (also http://localhost:8123/PaoSMP.zip)
- SHA1 set in server.properties for client verification
- pack.mcmeta supports 1.21.1 -> 26.2 via overlays (nexo_26_1, nexo_26_2)

Nexo Plugin:
- Version: 1.19.1 (fully supports 1.21.11 - NMS v1_21_R10 detected)
- Config: plugins/Nexo/settings.yml -> Pack.server.type changed from POLYMATH to selfhost (port 8082)
- Generated pack at plugins/Nexo/pack/pack.zip (selfhost)
- Warnings about block-updates.disable-* are fixed for noteblock/tripwire/chorus in config/paper-global.yml (ignored if still show due to outdated plugin check)

Ports (firewall - run as Admin if needed):
 25565 = Minecraft (TCP)
 8123  = PaoSMP pack-host (node http)
 8082  = Nexo selfhost pack server

PM2 Apps:
 pao-minecraft = Paper server (java -jar paper.jar nogui)
 pao-pack-host = Node HTTP server serving PaoSMP.zip

Commands (PowerShell/CMD):
 pm2 list                              - show status
 pm2 logs pao-minecraft --lines 100   - server logs
 pm2 logs pao-pack-host --lines 50    - pack host logs
 pm2 restart pao-minecraft            - restart MC only
 pm2 restart pao-pack-host            - restart pack host
 pm2 stop pao-minecraft pao-pack-host - stop both
 pm2 start ecosystem.config.js        - start both (from server dir)
 pm2 save                             - save current list for reboot
 pm2-startup install                  - installed, enables auto-start on Windows boot

Files:
 ecosystem.config.js = PM2 config (adjust RAM args there)
 pack-host.js        = static http server for resource pack
 server.properties   = motd, resource-pack, resource-pack-sha1, prompt
 eula.txt            = eula=true
 start.bat / stop.bat / logs.bat / manage.bat = helper scripts (double-click)
 logs/pm2-*.log      = PM2 logs
 logs/latest.log     = Minecraft logs

Connect:
 Local: localhost:25565 or 127.0.0.1:25565
 LAN:   192.168.1.240:25565 (share this IP to others on same WiFi)
 Public: need port forward 25565+8123 (and 8082 if using Nexo selfhost) on router and use public IP

Resource Pack Notes:
 - Client will be prompted: "Welcome to PaoSMP! This server uses the Nexora resource pack..."
 - Fixed server.properties prompt to valid JSON: "Welcome..." (previously plain text caused MalformedJsonException)
 - If you update PaoSMP folder contents, rezipped:
   python -c "import zipfile, pathlib, os; ..." (or run pack-host update script)
   then restart pao-minecraft to update sha1 if needed

Updating pack SHA1:
 1. Re-zip: python zipping script (see pack-host.js header)
 2. Get sha1: python -c "import hashlib, pathlib; print(hashlib.sha1(pathlib.Path('PaoSMP.zip').read_bytes()).hexdigest())"
 3. Edit server.properties resource-pack-sha1 line and pm2 restart pao-minecraft

Firewall (Admin):
 netsh advfirewall firewall add rule name="PaoSMP Minecraft 25565" dir=in action=allow protocol=TCP localport=25565
 netsh advfirewall firewall add rule name="PaoSMP PackHost 8123" dir=in action=allow protocol=TCP localport=8123
 netsh advfirewall firewall add rule name="PaoSMP Nexo 8082" dir=in action=allow protocol=TCP localport=8082

Status: Verified online 2026-08-29 09:25:43 Done (25.997s) on 1.21.11, listening on 0.0.0.0:25565, 0.0.0.0:8123, 0.0.0.0:8082 - world reset for 1.21.11 (old 26.1.2 world backed up to world_26.1.2_backup_20260829_0924)

