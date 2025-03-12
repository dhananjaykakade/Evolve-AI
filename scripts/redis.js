import { execSync } from "child_process";
import fs from "fs";
import os from "os";

const isWindows = os.platform() === "win32";

/**
 * Execute a command and return stdout
 */
const runCommand = (cmd) => {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch (error) {
    return null;
  }
};

/**
 * Check if Chocolatey is installed
 */
const isChocolateyInstalled = () => {
  try {
    runCommand("choco -v");
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Install Chocolatey if not installed
 */
const installChocolatey = () => {
  console.log("🟡 Chocolatey not found. Installing...");
  try {
    execSync(
      'powershell -NoProfile -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(\'https://community.chocolatey.org/install.ps1\'))"',
      { stdio: "inherit" }
    );
    console.log("✅ Chocolatey installed successfully.");
  } catch (error) {
    console.error("❌ Failed to install Chocolatey:", error.message);
    process.exit(1);
  }
};

/**
 * Check if Memurai (Redis for Windows) is installed
 */
const isMemuraiInstalled = () => {
  return fs.existsSync("C:\\Program Files\\Memurai\\memurai.exe");
};

/**
 * Install Memurai using Chocolatey
 */
const installMemurai = () => {
  console.log("🟡 Memurai not found. Installing...");
  try {
    execSync("choco install memurai -y", { stdio: "inherit" });
    console.log("✅ Memurai installed successfully.");
  } catch (error) {
    console.error("❌ Failed to install Memurai:", error.message);
    process.exit(1);
  }
};

/**
 * Check if Redis CLI is installed
 */
const isRedisCLIInstalled = () => {
  try {
    runCommand("redis-cli --version");
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Install Redis CLI using Chocolatey
 */
const installRedisCLI = () => {
  console.log("🟡 Redis CLI not found. Installing...");
  try {
    execSync("choco install redis-cli -y", { stdio: "inherit" });
    console.log("✅ Redis CLI installed successfully.");
  } catch (error) {
    console.error("❌ Failed to install Redis CLI:", error.message);
    process.exit(1);
  }
};

/**
 * Main function to install required tools
 */
const installDependencies = () => {
  if (!isWindows) {
    console.error("❌ This script is designed for Windows only.");
    process.exit(1);
  }

  console.log("🔍 Checking dependencies...");

  if (!isChocolateyInstalled()) {
    installChocolatey();
  } else {
    console.log("✅ Chocolatey is already installed.");
  }

  if (!isMemuraiInstalled()) {
    installMemurai();
  } else {
    console.log("✅ Memurai is already installed.");
  }

  if (!isRedisCLIInstalled()) {
    installRedisCLI();
  } else {
    console.log("✅ Redis CLI is already installed.");
  }

  console.log("🎉 All dependencies are installed and ready to use!");
};

// Run the installation
installDependencies();
