import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class ServerManager {
  constructor() {
    this.commonPorts = [3000, 5173, 8080, 3001, 4000];
    this.serverProcess = null;
  }
  async checkPort(port) {
    return new Promise((resolve) => {
      const command = process.platform === 'win32' 
        ? `netstat -ano | findstr :${port}`
        : `lsof -i :${port}`;
      exec(command, (error, stdout) => {
        resolve(stdout.includes(`:${port}`));
      });
    });
  }
  async killPort(port) {
    return new Promise((resolve) => {
      const command = process.platform === 'win32'
        ? `for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port}') do taskkill /f /pid %a`
        : `lsof -ti :${port} | xargs kill -9`;
      exec(command, (error) => {
        console.log(error ? `⚠️  No process found on port ${port}` : `✅ Killed process on port ${port}`);
        resolve(!error);
      });
    });
  }
  async testServer(url) {
    return new Promise((resolve) => {
      const command = process.platform === 'win32'
        ? `powershell -Command "try { (Invoke-WebRequest -Uri '${url}' -UseBasicParsing).StatusCode } catch { 0 }"`
        : `curl -s -o /dev/null -w "%{http_code}" ${url}`;
      exec(command, (error, stdout) => {
        const statusCode = parseInt(stdout.trim());
        resolve(statusCode === 200);
      });
    });
  }
  detectProjectType() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      return { type: 'unknown', scripts: {} };
    }
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = packageJson.scripts || {};
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    if (dependencies.vite || scripts.dev?.includes('vite')) {
      return { type: 'vite', scripts, command: 'npm run dev', port: 3000 };
    }
    if (dependencies.react || scripts.start?.includes('react-scripts')) {
      return { type: 'react', scripts, command: 'npm start', port: 3000 };
    }
    if (dependencies.express || scripts.start?.includes('node')) {
      return { type: 'express', scripts, command: 'npm start', port: 3000 };
    }
    return { type: 'unknown', scripts, command: 'npm start', port: 3000 };
  }
  async findRunningServer() {
    for (const port of this.commonPorts) {
      const isRunning = await this.checkPort(port);
      if (isRunning) {
        const isResponding = await this.testServer(`http://localhost:${port}`);
        if (isResponding) {
          return { port, status: 'responding' };
        } else {
          return { port, status: 'not_responding' };
        }
      }
    }
    return null;
  }
  async startServer(command, port) {
    return new Promise((resolve, reject) => {
      console.log(`🚀 Starting server with: ${command}`);
      const isWindows = process.platform === 'win32';
      const shell = isWindows ? 'cmd' : 'bash';
      const shellFlag = isWindows ? '/c' : '-c';
      this.serverProcess = spawn(shell, [shellFlag, command], {
        stdio: 'pipe',
        cwd: process.cwd()
      });
      let serverStarted = false;
      const startTimeout = setTimeout(() => {
        if (!serverStarted) {
          console.log('⏰ Server start timeout, but process may still be starting...');
          resolve({ success: true, port: port });
        }
      }, 15000);
      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(output);
        if (output.includes('ready') || 
            output.includes('Local:') || 
            output.includes('localhost') ||
            output.includes('server started') ||
            output.includes('compiled successfully')) {
          if (!serverStarted) {
            serverStarted = true;
            clearTimeout(startTimeout);
            const portMatch = output.match(/localhost:(\d+)/);
            const actualPort = portMatch ? parseInt(portMatch[1]) : port;
            resolve({ success: true, port: actualPort });
          }
        }
      });
      this.serverProcess.stderr.on('data', (data) => {
        const output = data.toString();
        console.error(output);
        if (output.includes('EADDRINUSE') || output.includes('port') && output.includes('already')) {
          console.log(`⚠️  Port ${port} is already in use`);
        }
      });
      this.serverProcess.on('error', (error) => {
        clearTimeout(startTimeout);
        reject(error);
      });
    });
  }
  openBrowser(url) {
    const command = process.platform === 'win32' ? 'start' :
                   process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${command} ${url}`, (error) => {
      if (error) {
        console.log(`❌ Could not open browser automatically. Please open: ${url}`);
      } else {
        console.log(`🌐 Opened browser at: ${url}`);
      }
    });
  }
  async run() {
    console.log('🔍 GoAdventureGo Server Diagnostics\n');
    console.log('1️⃣  Checking for running servers...');
    const runningServer = await this.findRunningServer();
    if (runningServer) {
      const url = `http://localhost:${runningServer.port}/`;
      console.log(`✅ Found server on port ${runningServer.port} - Status: ${runningServer.status}`);
      if (runningServer.status === 'responding') {
        console.log(`🎉 Server is working! Opening: ${url}`);
        this.openBrowser(url);
        return;
      } else {
        console.log(`⚠️  Server on port ${runningServer.port} is not responding properly`);
        console.log('🧹 Attempting to kill unresponsive process...');
        await this.killPort(runningServer.port);
      }
    }
    console.log('\n2️⃣  Detecting project type...');
    const project = this.detectProjectType();
    console.log(`📦 Project type: ${project.type.toUpperCase()}`);
    console.log(`🔧 Command: ${project.command}`);
    console.log(`\n3️⃣  Checking port ${project.port}...`);
    const portInUse = await this.checkPort(project.port);
    if (portInUse) {
      console.log(`⚠️  Port ${project.port} is in use. Attempting to free it...`);
      await this.killPort(project.port);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    console.log(`\n4️⃣  Starting development server...`);
    try {
      const result = await this.startServer(project.command, project.port);
      if (result.success) {
        const url = `http://localhost:${result.port}/`;
        console.log(`\n🎉 SUCCESS! Server running at: ${url}`);
        console.log(`🌐 Opening browser...`);
        setTimeout(() => {
          this.openBrowser(url);
        }, 2000);
        console.log('\n💡 Press Ctrl+C to stop the server');
        process.on('SIGINT', () => {
          console.log('\n👋 Shutting down server...');
          if (this.serverProcess) {
            this.serverProcess.kill();
          }
          process.exit(0);
        });
        return new Promise(() => {});
      }
    } catch (error) {
      console.error(`❌ Failed to start server: ${error.message}`);
      console.log('\n🔧 Manual troubleshooting steps:');
      console.log('1. Run: npm install');
      console.log('2. Run: npm run dev');
      console.log('3. Check if dependencies are properly installed');
      console.log('4. Verify package.json scripts');
    }
  }
}
const manager = new ServerManager();
manager.run().catch(console.error);
