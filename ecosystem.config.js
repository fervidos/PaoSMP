module.exports = {
  apps: [
    {
      name: "pao-minecraft",
      cwd: __dirname,
      script: "java",
      args: [
        "-Xms2G",
        "-Xmx4G",
        "-XX:+UseG1GC",
        "-XX:+ParallelRefProcEnabled",
        "-XX:MaxGCPauseMillis=200",
        "-XX:+UnlockExperimentalVMOptions",
        "-XX:+DisableExplicitGC",
        "-XX:+AlwaysPreTouch",
        "-XX:G1NewSizePercent=30",
        "-XX:G1MaxNewSizePercent=40",
        "-XX:G1HeapRegionSize=8M",
        "-XX:G1ReservePercent=20",
        "-XX:G1HeapWastePercent=5",
        "-XX:G1MixedGCCountTarget=4",
        "-XX:G1MixedGCLiveThresholdPercent=90",
        "-XX:G1RSetUpdatingPauseTimePercent=5",
        "-XX:SurvivorRatio=32",
        "-Dcom.mojang.eula.agree=true",
        "-jar",
        "paper.jar",
        "nogui"
      ].join(" "),
      interpreter: "none",
      autorestart: true,
      stop_signal: "SIGINT",
      kill_timeout: 30000,
      // keep pm2 from restarting too fast on crash
      min_uptime: 10000,
      max_restarts: 10,
      // logs
      out_file: "./logs/pm2-out.log",
      error_file: "./logs/pm2-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
    },
    {
      name: "pao-pack-host",
      cwd: __dirname,
      script: "./pack-host.js",
      interpreter: "node",
      autorestart: true,
      watch: false,
      out_file: "./logs/pack-host-out.log",
      error_file: "./logs/pack-host-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    }
  ]
};
