import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const isMac = process.platform === 'darwin';

// Engines picked as a .app bundle are launched through the binary inside it.
export function resolveEnginePath(enginePath) {
    if(!isMac || !enginePath.endsWith('.app')) return enginePath;

    const contents = path.join(enginePath, 'Contents');
    let executableName = path.basename(enginePath, '.app');

    try {
        executableName = execFileSync('/usr/bin/defaults',
            ['read', path.join(contents, 'Info'), 'CFBundleExecutable'], { encoding: 'utf8' }).trim() || executableName;
    } catch {}

    return path.join(contents, 'MacOS', executableName);
}

// Downloaded engines arrive without the exec bit and with the Gatekeeper quarantine flag,
// either of which makes spawn() fail with EACCES or get the process killed on launch.
export function prepareEngineFile(enginePath) {
    if(process.platform === 'win32') return;

    try {
        const { mode } = fs.statSync(enginePath);
        if((mode & 0o111) !== 0o111) fs.chmodSync(enginePath, mode | 0o755);
    } catch {}

    if(isMac) {
        try {
            execFileSync('/usr/bin/xattr', ['-d', 'com.apple.quarantine', enginePath], { stdio: 'ignore' });
        } catch {} // not quarantined
    }
}

// Turns raw spawn errors into something the user can act on.
export function describeSpawnError(err, enginePath) {
    const name = path.basename(enginePath);

    if(err?.code === 'ENOENT') return `Engine file not found: ${enginePath}`;
    if(err?.code === 'EACCES') return `No permission to run ${name}. Try: chmod +x "${enginePath}"`;
    if(err?.code === 'ENOEXEC' || err?.code === 'EBADARCH' || err?.errno === -86) {
        if(/\.(exe|bat|cmd)$/i.test(enginePath))
            return `${name} is a Windows program. Download the macOS build of the engine instead.`;
        return `${name} is not a macOS executable for this CPU (${process.arch}). `
            + (process.arch === 'arm64' ? 'Use an Apple Silicon (arm64) build, or install Rosetta for x86-64 builds.'
                : 'Use an x86-64 build of the engine.');
    }

    return `Engine error: ${err?.message}`;
}
