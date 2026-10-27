// Ad-hoc signs the whole .app before dmg/zip are made. Without it Apple Silicon sees a
// broken signature and Gatekeeper reports a downloaded ACAS.app as "damaged".
const { execFileSync } = require('child_process');
const path = require('path');

exports.default = async function(context) {
    if(context.electronPlatformName !== 'darwin') return;

    const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);
    execFileSync('codesign', ['--force', '--deep', '--sign', '-', appPath], { stdio: 'inherit' });
};
