#!/usr/bin/env -S pnpm tsx

/**
 * Interactive Development CLI
 *
 * A menu-driven interface for common development tasks.
 *
 * Usage:
 *   pnpm dev
 */

import { select, checkbox } from '@inquirer/prompts';
import { spawn, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const WORKSPACE_ROOT = process.cwd();

/**
 * Set terminal tab title
 */
function setTabTitle(title: string): void {
  process.stdout.write(`\x1b]0;${title}\x07`);
}

/**
 * Get list of available apps in the workspace
 */
function getAvailableApps(): { name: string; type: 'expo' | 'astro' }[] {
  const appsDir = path.join(WORKSPACE_ROOT, 'apps');
  if (!fs.existsSync(appsDir)) return [];

  return fs
    .readdirSync(appsDir)
    .filter((entry) => {
      const appPath = path.join(appsDir, entry);
      return fs.statSync(appPath).isDirectory();
    })
    .map((entry) => {
      const appPath = path.join(appsDir, entry);
      if (fs.existsSync(path.join(appPath, 'app.json'))) {
        return { name: entry, type: 'expo' as const };
      }
      if (fs.existsSync(path.join(appPath, 'astro.config.mjs'))) {
        return { name: entry, type: 'astro' as const };
      }
      return null;
    })
    .filter((app): app is { name: string; type: 'expo' | 'astro' } => app !== null);
}

/**
 * Run a command with inherited stdio (interactive)
 */
function runCommand(
  command: string,
  args: string[],
  cwd?: string,
  env?: Record<string, string>
): Promise<number> {
  const fullCommand = `${command} ${args.join(' ')}`;
  console.log(`${colors.dim}Running: ${fullCommand}${colors.reset}\n`);

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: cwd || WORKSPACE_ROOT,
      env: env ? { ...process.env, ...env } : process.env,
    });

    child.on('close', (code) => {
      resolve(code ?? 0);
    });
  });
}

/**
 * Environment variables for local builds
 */
const LOCAL_BUILD_ENV = {
  SENTRY_DISABLE_AUTO_UPLOAD: 'true',
};

type RootAction = 'app-dev' | 'maestro' | 'status-checks';

/**
 * Status check types
 */
type StatusCheck = 'typecheck' | 'lint' | 'test' | 'all';

/**
 * Run a status check command and display results
 */
async function runStatusCheck(
  name: string,
  command: string,
  args: string[]
): Promise<boolean> {
  console.log(`\n${colors.cyan}Running ${name}...${colors.reset}\n`);
  const startTime = Date.now();

  const exitCode = await runCommand(command, args);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  if (exitCode === 0) {
    console.log(
      `\n${colors.green}✓ ${name} passed${colors.reset} ${colors.dim}(${duration}s)${colors.reset}\n`
    );
    return true;
  } else {
    console.log(
      `\n${colors.red}✗ ${name} failed${colors.reset} ${colors.dim}(${duration}s)${colors.reset}\n`
    );
    return false;
  }
}

/**
 * Handle status checks flow
 */
async function handleStatusChecks(): Promise<void> {
  setTabTitle('Status Checks');

  const checkType = await select<StatusCheck>({
    message: 'What do you want to check?',
    choices: [
      { name: 'TypeScript', value: 'typecheck' },
      { name: 'Lint', value: 'lint' },
      { name: 'Tests', value: 'test' },
      { name: 'All checks', value: 'all' },
    ],
  });

  const checks: Array<{ name: string; command: string; args: string[] }> = [];

  switch (checkType) {
    case 'typecheck':
      checks.push({
        name: 'TypeScript',
        command: 'pnpm',
        args: ['tsc', '-p', 'tsconfig.typecheck.json', '--noEmit'],
      });
      break;
    case 'lint':
      checks.push({
        name: 'ESLint',
        command: 'pnpm',
        args: ['nx', 'run-many', '--target=lint', '--all'],
      });
      break;
    case 'test':
      checks.push({
        name: 'Jest',
        command: 'pnpm',
        args: ['nx', 'run-many', '--target=test', '--all', '--passWithNoTests'],
      });
      break;
    case 'all':
      checks.push(
        {
          name: 'TypeScript',
          command: 'pnpm',
          args: ['tsc', '-p', 'tsconfig.typecheck.json', '--noEmit'],
        },
        {
          name: 'ESLint',
          command: 'pnpm',
          args: ['nx', 'run-many', '--target=lint', '--all'],
        },
        {
          name: 'Jest',
          command: 'pnpm',
          args: ['nx', 'run-many', '--target=test', '--all', '--passWithNoTests'],
        }
      );
      break;
  }

  console.log(`\n${colors.bold}${colors.cyan}Status Checks${colors.reset}`);
  console.log(
    `${colors.dim}Running ${checks.length} check(s)...${colors.reset}\n`
  );

  const results: Array<{ name: string; passed: boolean }> = [];
  const overallStartTime = Date.now();

  for (const check of checks) {
    const passed = await runStatusCheck(check.name, check.command, check.args);
    results.push({ name: check.name, passed });
  }

  // Summary
  const overallDuration = ((Date.now() - overallStartTime) / 1000).toFixed(1);
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`\n${colors.bold}Summary${colors.reset}`);
  console.log(`${colors.dim}${'─'.repeat(40)}${colors.reset}`);

  for (const result of results) {
    const icon = result.passed ? colors.green + '✓' : colors.red + '✗';
    console.log(`${icon} ${result.name}${colors.reset}`);
  }

  console.log(`${colors.dim}${'─'.repeat(40)}${colors.reset}`);
  console.log(
    `${colors.dim}Total: ${passed} passed, ${failed} failed (${overallDuration}s)${colors.reset}\n`
  );
}

type ExpoAction =
  | 'start-packager'
  | 'start-packager-clean'
  | 'build-ios'
  | 'build-ios-clean'
  | 'build-android'
  | 'build-android-clean';

/**
 * Check if Maestro is installed
 */
function isMaestroInstalled(): boolean {
  try {
    execSync('which maestro', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the UDID of the booted iOS simulator
 */
function getBootedSimulatorUdid(): string | null {
  try {
    const output = execSync('xcrun simctl list devices booted', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    // Extract UUID pattern from output
    const match = output.match(/\(([A-F0-9-]{36})\)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Discover Maestro test files in the .maestro directory
 */
function discoverMaestroTests(): Array<{ name: string; path: string; description: string }> {
  const maestroDir = path.join(WORKSPACE_ROOT, '.maestro');
  if (!fs.existsSync(maestroDir)) return [];

  const tests: Array<{ name: string; path: string; description: string }> = [];

  function scanDirectory(dir: string, prefix = ''): void {
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const relativePath = path.relative(WORKSPACE_ROOT, fullPath);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip certain directories
        if (['screenshots', 'profiles', 'flows'].includes(entry)) continue;
        scanDirectory(fullPath, prefix ? `${prefix}/${entry}` : entry);
      } else if (entry.endsWith('.yaml') || entry.endsWith('.yml')) {
        // Read file to extract description from comments
        let description = '';
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const lines = content.split('\n');
          for (const line of lines) {
            if (line.startsWith('#') && !line.startsWith('#!')) {
              const comment = line.replace(/^#\s*/, '').trim();
              if (comment && !comment.startsWith('@') && comment.length > 10) {
                description = comment;
                break;
              }
            }
          }
        } catch {
          // Ignore read errors
        }

        // Create a friendly name from the filename
        const name = entry
          .replace(/\.(yaml|yml)$/, '')
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const displayName = prefix ? `${prefix}/${name}` : name;

        tests.push({
          name: displayName,
          path: relativePath,
          description: description || `Run ${relativePath}`,
        });
      }
    }
  }

  scanDirectory(maestroDir);
  return tests;
}

/**
 * Get bundle identifier for an Expo app
 */
function getBundleId(appName: string): string {
  const appJsonPath = path.join(WORKSPACE_ROOT, 'apps', appName, 'app.json');
  try {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
    return appJson.expo?.ios?.bundleIdentifier || `com.example.${appName.replace(/-/g, '')}`;
  } catch {
    return `com.example.${appName.replace(/-/g, '')}`;
  }
}

/**
 * Handle Maestro E2E testing flow
 */
async function handleMaestroTests(): Promise<void> {
  // Check if Maestro is installed
  if (!isMaestroInstalled()) {
    console.log(`${colors.red}Maestro is not installed.${colors.reset}`);
    console.log(
      `${colors.dim}Install with: curl -Ls "https://get.maestro.mobile.dev" | bash${colors.reset}`
    );
    console.log(
      `${colors.dim}Or via Homebrew: brew install maestro${colors.reset}\n`
    );
    return;
  }

  // Check for booted simulator
  const udid = getBootedSimulatorUdid();
  if (!udid) {
    console.log(`${colors.yellow}No iOS simulator is running.${colors.reset}`);
    console.log(`${colors.dim}Start a simulator first, then try again.${colors.reset}\n`);
    return;
  }

  // Discover available tests
  const tests = discoverMaestroTests();
  if (tests.length === 0) {
    console.log(`${colors.yellow}No Maestro tests found in .maestro directory.${colors.reset}\n`);
    return;
  }

  console.log(`${colors.green}Found ${tests.length} Maestro test(s)${colors.reset}`);
  console.log(`${colors.dim}Simulator UDID: ${udid}${colors.reset}\n`);

  // Let user select tests to run
  const selectedTests = await checkbox({
    message: 'Select tests to run (space to select, enter to confirm):',
    choices: tests.map((test) => ({
      name: `${test.name} ${colors.dim}- ${test.description}${colors.reset}`,
      value: test,
    })),
  });

  if (selectedTests.length === 0) {
    console.log(`${colors.yellow}No tests selected.${colors.reset}\n`);
    return;
  }

  // Run selected tests
  console.log(
    `\n${colors.cyan}Running ${selectedTests.length} Maestro test(s)${colors.reset}\n`
  );

  const results: Array<{ name: string; passed: boolean }> = [];
  const overallStartTime = Date.now();

  for (let i = 0; i < selectedTests.length; i++) {
    const test = selectedTests[i];
    console.log(
      `\n${colors.bold}[${i + 1}/${selectedTests.length}] ${test.name}${colors.reset}`
    );
    console.log(`${colors.dim}Path: ${test.path}${colors.reset}\n`);

    const startTime = Date.now();
    const exitCode = await runCommand('maestro', ['--udid', udid, 'test', test.path]);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    const passed = exitCode === 0;
    results.push({ name: test.name, passed });

    if (passed) {
      console.log(
        `\n${colors.green}✓ ${test.name} passed${colors.reset} ${colors.dim}(${duration}s)${colors.reset}`
      );
    } else {
      console.log(
        `\n${colors.red}✗ ${test.name} failed${colors.reset} ${colors.dim}(${duration}s)${colors.reset}`
      );
    }
  }

  // Summary
  const overallDuration = ((Date.now() - overallStartTime) / 1000).toFixed(1);
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`\n${colors.bold}Test Summary${colors.reset}`);
  console.log(`${colors.dim}${'─'.repeat(40)}${colors.reset}`);

  for (const result of results) {
    const icon = result.passed ? colors.green + '✓' : colors.red + '✗';
    console.log(`${icon} ${result.name}${colors.reset}`);
  }

  console.log(`${colors.dim}${'─'.repeat(40)}${colors.reset}`);
  console.log(
    `${colors.dim}Total: ${passed} passed, ${failed} failed (${overallDuration}s)${colors.reset}\n`
  );
}

type AstroAction = 'dev' | 'build' | 'preview';

async function main(): Promise<void> {
  console.log(`\n${colors.bold}${colors.cyan}Dev CLI${colors.reset}\n`);

  // Check if there are Maestro tests available
  const hasMaestroTests = fs.existsSync(path.join(WORKSPACE_ROOT, '.maestro'));

  // Root menu: choose between app development, Maestro tests, and status checks
  const rootAction = await select<RootAction>({
    message: 'What do you want to do?',
    choices: [
      { name: 'App development', value: 'app-dev' },
      { name: 'Status checks', value: 'status-checks' },
      ...(hasMaestroTests
        ? [{ name: 'Run Maestro E2E tests', value: 'maestro' as const }]
        : []),
    ],
  });

  if (rootAction === 'maestro') {
    await handleMaestroTests();
    return;
  }

  if (rootAction === 'status-checks') {
    await handleStatusChecks();
    return;
  }

  const apps = getAvailableApps();

  if (apps.length === 0) {
    console.log(`${colors.red}No apps found in apps/ directory.${colors.reset}`);
    process.exit(1);
  }

  // Select app (skip if only one app)
  let selectedApp: { name: string; type: 'expo' | 'astro' };
  if (apps.length === 1) {
    selectedApp = apps[0];
    console.log(`${colors.dim}Using app: ${selectedApp.name}${colors.reset}\n`);
  } else {
    selectedApp = await select({
      message: 'Select app:',
      choices: apps.map((a) => ({
        name: `${a.name} ${colors.dim}(${a.type})${colors.reset}`,
        value: a,
      })),
    });
  }

  const appDir = path.join(WORKSPACE_ROOT, 'apps', selectedApp.name);

  // Handle Astro apps
  if (selectedApp.type === 'astro') {
    const action = await select<AstroAction>({
      message: 'What do you want to do?',
      choices: [
        { name: 'Start dev server', value: 'dev' },
        { name: 'Build', value: 'build' },
        { name: 'Preview build', value: 'preview' },
      ],
    });

    switch (action) {
      case 'dev': {
        setTabTitle(`Astro: ${selectedApp.name}`);
        console.log(
          `\n${colors.cyan}Starting Astro dev server for ${selectedApp.name}...${colors.reset}\n`
        );
        await runCommand('pnpm', ['astro', 'dev'], appDir);
        break;
      }
      case 'build': {
        setTabTitle(`Build: ${selectedApp.name}`);
        console.log(
          `\n${colors.cyan}Building ${selectedApp.name}...${colors.reset}\n`
        );
        await runCommand('pnpm', ['astro', 'build'], appDir);
        break;
      }
      case 'preview': {
        setTabTitle(`Preview: ${selectedApp.name}`);
        console.log(
          `\n${colors.cyan}Previewing ${selectedApp.name}...${colors.reset}\n`
        );
        await runCommand('pnpm', ['astro', 'preview'], appDir);
        break;
      }
    }
    return;
  }

  // Handle Expo apps
  const action = await select<ExpoAction>({
    message: 'What do you want to do?',
    choices: [
      { name: 'Start packager', value: 'start-packager' },
      { name: 'Start packager (clean)', value: 'start-packager-clean' },
      { name: 'Build iOS', value: 'build-ios' },
      { name: 'Build iOS (clean)', value: 'build-ios-clean' },
      { name: 'Build Android', value: 'build-android' },
      { name: 'Build Android (clean)', value: 'build-android-clean' },
    ],
  });

  switch (action) {
    case 'start-packager': {
      setTabTitle(`Packager: ${selectedApp.name}`);
      console.log(
        `\n${colors.cyan}Starting Metro for ${selectedApp.name}...${colors.reset}\n`
      );
      await runCommand('npx', ['expo', 'start'], appDir);
      break;
    }

    case 'start-packager-clean': {
      setTabTitle(`Packager (clean): ${selectedApp.name}`);
      console.log(
        `\n${colors.cyan}Starting Metro for ${selectedApp.name} (clearing cache)...${colors.reset}\n`
      );
      await runCommand('npx', ['expo', 'start', '--clear'], appDir);
      break;
    }

    case 'build-ios': {
      setTabTitle(`Build iOS: ${selectedApp.name}`);
      console.log(
        `\n${colors.cyan}Building ${selectedApp.name} for iOS...${colors.reset}\n`
      );
      await runCommand(
        'pnpm',
        ['nx', 'run', `${selectedApp.name}:run-ios`],
        undefined,
        LOCAL_BUILD_ENV
      );
      break;
    }

    case 'build-ios-clean': {
      setTabTitle(`Build iOS (clean): ${selectedApp.name}`);
      const iosDir = path.join(appDir, 'ios');
      const expoDir = path.join(appDir, '.expo');

      console.log(
        `\n${colors.cyan}Clean iOS rebuild for ${selectedApp.name}...${colors.reset}\n`
      );
      console.log(
        `${colors.dim}This regenerates native iOS project and clears caches.${colors.reset}\n`
      );

      // Step 1: Reset Nx cache
      console.log(`${colors.dim}Resetting Nx cache...${colors.reset}`);
      try {
        execSync('pnpm nx reset', { stdio: 'pipe', cwd: WORKSPACE_ROOT });
        console.log(`${colors.green}  Done${colors.reset}`);
      } catch {
        console.log(`${colors.yellow}  Could not reset Nx cache${colors.reset}`);
      }

      // Step 2: Remove ios folder
      if (fs.existsSync(iosDir)) {
        console.log(`${colors.dim}Removing ios folder...${colors.reset}`);
        fs.rmSync(iosDir, { recursive: true, force: true });
        console.log(`${colors.green}  Done${colors.reset}`);
      }

      // Step 3: Remove .expo folder
      if (fs.existsSync(expoDir)) {
        console.log(`${colors.dim}Removing .expo folder...${colors.reset}`);
        fs.rmSync(expoDir, { recursive: true, force: true });
        console.log(`${colors.green}  Done${colors.reset}`);
      }

      // Step 4: Clear Xcode DerivedData for this app
      const derivedDataPath = path.join(
        os.homedir(),
        'Library/Developer/Xcode/DerivedData'
      );
      if (fs.existsSync(derivedDataPath)) {
        console.log(`${colors.dim}Clearing Xcode DerivedData...${colors.reset}`);
        const appJsonPath = path.join(appDir, 'app.json');
        let targetName = selectedApp.name.replace(/-/g, '');
        if (fs.existsSync(appJsonPath)) {
          try {
            const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
            const name = appJson.expo?.name || appJson.name;
            if (name) {
              targetName = name.replace(/[\s-]/g, '');
            }
          } catch {
            // Ignore parse errors
          }
        }

        const entries = fs.readdirSync(derivedDataPath);
        let cleared = 0;
        for (const entry of entries) {
          if (entry.toLowerCase().startsWith(targetName.toLowerCase())) {
            try {
              fs.rmSync(path.join(derivedDataPath, entry), {
                recursive: true,
                force: true,
              });
              cleared++;
            } catch {
              // Ignore permission errors
            }
          }
        }
        console.log(
          `${colors.green}  Cleared ${cleared} DerivedData folder(s)${colors.reset}`
        );
      }

      // Step 5: Run expo prebuild for iOS
      console.log(
        `\n${colors.dim}Regenerating native iOS project...${colors.reset}\n`
      );
      await runCommand('npx', ['expo', 'prebuild', '--platform', 'ios'], appDir);

      console.log(`\n${colors.green}Clean iOS rebuild complete!${colors.reset}`);
      console.log(
        `${colors.dim}You can now run 'Build iOS' to build and launch the app.${colors.reset}\n`
      );
      break;
    }

    case 'build-android': {
      setTabTitle(`Build Android: ${selectedApp.name}`);
      console.log(
        `\n${colors.cyan}Building ${selectedApp.name} for Android...${colors.reset}\n`
      );
      await runCommand(
        'pnpm',
        ['nx', 'run', `${selectedApp.name}:run-android`],
        undefined,
        LOCAL_BUILD_ENV
      );
      break;
    }

    case 'build-android-clean': {
      setTabTitle(`Build Android (clean): ${selectedApp.name}`);
      const androidDir = path.join(appDir, 'android');
      const expoDir = path.join(appDir, '.expo');

      console.log(
        `\n${colors.cyan}Clean Android rebuild for ${selectedApp.name}...${colors.reset}\n`
      );
      console.log(
        `${colors.dim}This regenerates native Android project and clears caches.${colors.reset}\n`
      );

      // Step 1: Reset Nx cache
      console.log(`${colors.dim}Resetting Nx cache...${colors.reset}`);
      try {
        execSync('pnpm nx reset', { stdio: 'pipe', cwd: WORKSPACE_ROOT });
        console.log(`${colors.green}  Done${colors.reset}`);
      } catch {
        console.log(`${colors.yellow}  Could not reset Nx cache${colors.reset}`);
      }

      // Step 2: Remove android folder
      if (fs.existsSync(androidDir)) {
        console.log(`${colors.dim}Removing android folder...${colors.reset}`);
        fs.rmSync(androidDir, { recursive: true, force: true });
        console.log(`${colors.green}  Done${colors.reset}`);
      }

      // Step 3: Remove .expo folder
      if (fs.existsSync(expoDir)) {
        console.log(`${colors.dim}Removing .expo folder...${colors.reset}`);
        fs.rmSync(expoDir, { recursive: true, force: true });
        console.log(`${colors.green}  Done${colors.reset}`);
      }

      // Step 4: Run expo prebuild for Android
      console.log(
        `\n${colors.dim}Regenerating native Android project...${colors.reset}\n`
      );
      await runCommand('npx', ['expo', 'prebuild', '--platform', 'android'], appDir);

      console.log(`\n${colors.green}Clean Android rebuild complete!${colors.reset}`);
      console.log(
        `${colors.dim}You can now run 'Build Android' to build and launch the app.${colors.reset}\n`
      );
      break;
    }
  }
}

main().catch((error) => {
  if (error.message?.includes('User force closed')) {
    console.log(`\n${colors.dim}Cancelled.${colors.reset}\n`);
    process.exit(0);
  }
  console.error(`${colors.red}Error:${colors.reset}`, error.message);
  process.exit(1);
});
