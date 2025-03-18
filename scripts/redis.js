import { execSync } from "child_process";
import fs from "fs";
import os from "os";

/**
 * Check if running as admin
 */
const isAdmin = () => {
  try {
    execSync("net session", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Relaunch the script with admin privileges (Windows only)
 */
const runAsAdmin = () => {
  if (!isAdmin()) {
    console.log("⚠️ This script requires administrator privileges. Relaunching as admin...");
    execSync(`powershell Start-Process node -ArgumentList "'${process.argv[1]}'" -Verb RunAs`, {
      stdio: "inherit",
    });
    process.exit(0);
  }
};

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
  return runCommand("choco -v") !== null;
};

/**
 * Install Chocolatey
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
 * Add a directory to the system PATH (if not already included)
 */
const addToSystemPath = (dir) => {
  if (!process.env.PATH.includes(dir)) {
    console.log(`🔧 Adding ${dir} to system PATH...`);
    execSync(`setx PATH "%PATH%;${dir}" /M`, { stdio: "inherit" });
    console.log(`✅ ${dir} added to system PATH.`);
  } else {
    console.log(`✅ ${dir} is already in system PATH.`);
  }
};

/**
 * Check if Memurai (Redis for Windows) is installed
 */
const isMemuraiInstalled = () => {
  return fs.existsSync("C:\\Program Files\\Memurai\\memurai.exe");
};

/**
 * Install Memurai Developer Edition using Chocolatey
 */
const installMemurai = () => {
  console.log("🟡 Memurai not found. Installing...");
  try {
    execSync("choco install memurai-developer -y", { stdio: "inherit" });
    console.log("✅ Memurai Developer Edition installed successfully.");
  } catch (error) {
    console.error("❌ Failed to install Memurai:", error.message);
    process.exit(1);
  }
};

/**
 * Check if Redis CLI is installed
 */
const isRedisCLIInstalled = () => {
  return runCommand("redis-cli --version") !== null;
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
  if (os.platform() !== "win32") {
    console.error("❌ This script is designed for Windows only.");
    process.exit(1);
  }

  // Ensure the script runs with admin privileges
  runAsAdmin();

  console.log("🔍 Checking dependencies...");

  if (!isChocolateyInstalled()) {
    installChocolatey();
  } else {
    console.log("✅ Chocolatey is already installed.");
  }

  // Ensure Chocolatey is in the system PATH
  addToSystemPath("C:\\ProgramData\\chocolatey\\bin");

  if (!isMemuraiInstalled()) {
    installMemurai();
  } else {
    console.log("✅ Memurai is already installed.");
  }

  // Ensure Memurai is in the system PATH
  addToSystemPath("C:\\Program Files\\Memurai");

  if (!isRedisCLIInstalled()) {
    installRedisCLI();
  } else {
    console.log("✅ Redis CLI is already installed.");
  }

  console.log("🎉 All dependencies are installed and ready to use!");
};

// Run the installation process
installDependencies();
