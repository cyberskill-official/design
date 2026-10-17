#!/usr/bin/env python3
"""Render the current sample screens in a disposable iOS simulator fixture."""
import argparse
import datetime
import hashlib
import json
import pathlib
import plistlib
import shutil
import subprocess
import time
import uuid


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=pathlib.Path, required=True)
    parser.add_argument('--runtime', required=True, help='Installed simctl runtime identifier')
    parser.add_argument('--device-type', required=True, help='Installed simctl device type identifier')
    parser.add_argument('--source', type=pathlib.Path, default=pathlib.Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    source, output = args.source.resolve(), args.output.resolve()
    if output == source or source in output.parents:
        parser.error('Output must be outside the sample source directory')
    output.mkdir(parents=True, exist_ok=False)
    inputs = {str(p.relative_to(source)): digest(p) for p in sorted(source.rglob('*'))
              if p.is_file() and not p.is_symlink()
              and not any(x in p.relative_to(source).parts for x in ('.build', '.swiftpm', 'native-evidence'))}
    (output/'source-before.json').write_text(json.dumps(inputs, indent=2)+'\n')
    shutil.copytree(source/'Sources', output/'source/Sources')
    shutil.copy2(pathlib.Path(__file__).with_name('main.swift'), output/'main.swift')
    (output/'resource-bundle.swift').write_text('import Foundation\nextension Bundle { static let module = Bundle.main }\n')
    app = output/'IOSLayoutProbe.app'
    app.mkdir()
    shutil.copytree(output/'source/Sources/CyberSkillSample/Fonts', app/'Fonts')
    identifier = 'world.cyberskill.codex.layout.'+uuid.uuid4().hex
    info = {'CFBundleIdentifier': identifier, 'CFBundleExecutable': 'IOSLayoutProbe',
            'CFBundleName': 'IOSLayoutProbe', 'CFBundlePackageType': 'APPL',
            'CFBundleVersion': '1', 'CFBundleShortVersionString': '1.0',
            'MinimumOSVersion': '16.4', 'UIDeviceFamily': [1, 2], 'UILaunchScreen': {},
            'UIApplicationSceneManifest': {'UIApplicationSupportsMultipleScenes': False,
                'UISceneConfigurations': {'UIWindowSceneSessionRoleApplication': [
                    {'UISceneConfigurationName': 'Probe', 'UISceneDelegateClassName': 'IOSLayoutProbe.ProbeSceneDelegate'}]}}}
    (app/'Info.plist').write_bytes(plistlib.dumps(info))
    receipts = []

    def run(name, command, check=True):
        started = datetime.datetime.now(datetime.timezone.utc).isoformat()
        result = subprocess.run(command, capture_output=True, text=True)
        log = output/(name+'.log')
        log.write_text(result.stdout+result.stderr)
        receipts.append({'name': name, 'command': command, 'startedAt': started,
                         'exitCode': result.returncode, 'logSha256': digest(log)})
        (output/'command-receipts.json').write_text(json.dumps(receipts, indent=2)+'\n')
        print(name, result.returncode, flush=True)
        if check and result.returncode:
            raise RuntimeError(name+' failed; see '+str(log))
        return result.stdout.strip()

    device = None
    passed = False
    try:
        run('xcode-version', ['/usr/bin/xcodebuild', '-version'])
        sdk = run('sdk-path', ['/usr/bin/xcrun', '--sdk', 'iphonesimulator', '--show-sdk-path'])
        sources = sorted(p for p in (output/'source/Sources/CyberSkillSample').rglob('*.swift')
                         if p.name != 'CyberSkillSampleApp.swift')
        run('compile', ['/usr/bin/xcrun', 'swiftc', '-sdk', sdk, '-target', 'arm64-apple-ios16.4-simulator',
                        '-module-name', 'IOSLayoutProbe', *map(str, sources), str(output/'resource-bundle.swift'),
                        str(output/'main.swift'), '-o', str(app/'IOSLayoutProbe')])
        platform = run('binary-platform', ['/usr/bin/xcrun', 'vtool', '-show-build', str(app/'IOSLayoutProbe')])
        assert 'platform IOSSIMULATOR' in platform
        run('sign-fixture', ['/usr/bin/codesign', '--force', '--sign', '-', str(app)])
        device = run('create-device', ['/usr/bin/xcrun', 'simctl', 'create', 'Codex SwiftUI layout '+identifier[-8:], args.device_type, args.runtime])
        uuid.UUID(device)
        run('boot-device', ['/usr/bin/xcrun', 'simctl', 'boot', device])
        run('boot-status', ['/usr/bin/xcrun', 'simctl', 'bootstatus', device, '-b'])
        run('install-fixture', ['/usr/bin/xcrun', 'simctl', 'install', device, str(app)])
        rendered = output/'rendered'
        rendered.mkdir()
        launch = run('launch-fixture', ['/usr/bin/xcrun', 'simctl', 'launch',
                     '--stdout='+str(output/'app-stdout.log'), '--stderr='+str(output/'app-stderr.log'),
                     device, identifier, str(rendered)])
        pid = int(launch.rsplit(':', 1)[-1])
        for second in range(120):
            if (rendered/'failure.txt').exists():
                raise RuntimeError((rendered/'failure.txt').read_text())
            if (rendered/'render-contexts.json').exists():
                break
            if second % 10 == 0:
                run('process-'+str(second), ['/usr/bin/xcrun', 'simctl', 'spawn', device, 'launchctl', 'procinfo', str(pid)])
                print('captures', len(list(rendered.glob('*.png'))), flush=True)
            time.sleep(1)
        rows = json.loads((rendered/'render-contexts.json').read_text())
        assert len(rows) == 112
        assert len(list(rendered.glob('*.png'))) == 112
        controls = [r for r in rows if r['screen'] == 'font-control']
        for dark in (False, True):
            for language in ('en', 'vi'):
                for width in (360, 800):
                    pair = [r for r in controls if r['dark'] == dark and r['language'] == language and r['width'] == width]
                    normal = next(r for r in pair if r['dynamicType'] == 'large')
                    large = next(r for r in pair if r['dynamicType'] == 'accessibility5')
                    assert large['fittingHeight'] > normal['fittingHeight']
        for row in rows:
            if row['screen'] in ('home', 'settings'):
                assert row['scrollViews'], row['key']
                for scroll in row['scrollViews']:
                    if row['snapshot'] == 'bottom' and scroll['contentHeight'] > scroll['viewportHeight']:
                        assert scroll['offsetY'] > 0, row['key']
        assert all(digest(source/p) == value for p, value in inputs.items()), 'Source changed during capture'
        result = {'state': 'ios_screen_capture_scaling_and_scroll_checks_pass_acceptance_pending',
                  'sourceInputsUnchanged': len(inputs), 'captures': 112, 'screenCaptures': 96,
                  'fontControlCaptures': 16, 'dynamicTypeGrowthControls': 8,
                  'scope': 'Three screen fixtures; EN/VI; Light/Dark; 360x800/800x600; large/accessibility5; top/bottom snapshots. Default comfortable spacing and Standard contrast.',
                  'limitations': 'No Root navigation, keyboard/selection interaction, OS preference transition, High/compact matrix, pixel contrast, VoiceOver or human acceptance.',
                  'sourceHash': hashlib.sha256(json.dumps(inputs, sort_keys=True).encode()).hexdigest()}
        (output/'result.json').write_text(json.dumps(result, indent=2)+'\n')
        passed = True
    finally:
        if device:
            run('terminate-fixture', ['/usr/bin/xcrun', 'simctl', 'terminate', device, identifier], check=False)
            run('shutdown-device', ['/usr/bin/xcrun', 'simctl', 'shutdown', device], check=False)
            run('delete-device', ['/usr/bin/xcrun', 'simctl', 'delete', device], check=False)
        (output/'completion.json').write_text(json.dumps({'passed': passed, 'ownedDevice': device,
            'cleanupCommands': receipts[-3:] if device else [], 'completedAt': datetime.datetime.now(datetime.timezone.utc).isoformat()}, indent=2)+'\n')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
