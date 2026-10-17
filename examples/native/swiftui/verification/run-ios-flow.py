#!/usr/bin/env python3
"""Run the sample's real Root app in an owned disposable iOS simulator."""
from pathlib import Path
import argparse
import datetime
import hashlib
import json
import os
import shutil
import subprocess
import sys


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def snapshot(source):
    files = {}
    for base, directories, names in os.walk(source):
        directories[:] = sorted(name for name in directories
                                if name not in {'.build', '.swiftpm', 'native-evidence'}
                                and not (Path(base) / name).is_symlink())
        for name in sorted(names):
            path = Path(base) / name
            if not path.is_symlink():
                files[path.relative_to(source).as_posix()] = digest(path)
    return files


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--runtime', required=True)
    parser.add_argument('--device-type', required=True)
    args = parser.parse_args()
    source = args.source.resolve()
    output = args.output.resolve()
    if output == source or source in output.parents or output.exists():
        parser.error('--output must be a fresh directory outside the sample')
    before = snapshot(source)
    verification = source / 'verification'
    for name in ['RootFlowTests.swift', 'NativeSample.pbxproj', 'NativeSample.xcscheme', 'run-ios-flow.py']:
        if not (verification / name).is_file():
            parser.error('Missing verification input: ' + name)
    output.mkdir(parents=True)
    write = lambda name, value: (output / name).write_text(json.dumps(value, indent=2) + '\n')
    write('source-inputs.json', before)
    shutil.copytree(source / 'Sources', output / 'Sources')
    shutil.copytree(source / 'Sources/CyberSkillSample/Fonts', output / 'Fonts')
    shutil.copy2(verification / 'RootFlowTests.swift', output / 'RootFlowTests.swift')
    project = output / 'NativeSample.xcodeproj'
    project.mkdir()
    shutil.copy2(verification / 'NativeSample.pbxproj', project / 'project.pbxproj')
    schemes = project / 'xcshareddata/xcschemes'
    schemes.mkdir(parents=True)
    shutil.copy2(verification / 'NativeSample.xcscheme', schemes / 'NativeSample.xcscheme')
    # The disposable Xcode target uses the same font files through its main bundle.
    (output / 'BundleModule.swift').write_text('import Foundation\nextension Bundle { static var module: Bundle { .main } }\n')
    env = os.environ.copy()
    for key in ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']:
        env.pop(key, None)
    receipts = []
    stamp = lambda: datetime.datetime.now(datetime.timezone.utc).isoformat()

    def run(command, name):
        started = stamp()
        log_path = output / (name + '.log')
        with log_path.open('w') as log:
            child = subprocess.Popen(command, cwd=output, env=env,
                                     stdout=log, stderr=subprocess.STDOUT)
            write(name + '-start.json', {'startedAt': started, 'pid': child.pid, 'command': command})
            print(name, 'PID', child.pid, flush=True)
            code = child.wait()
        receipts.append({'name': name, 'command': command, 'exitCode': code,
                         'startedAt': started, 'endedAt': stamp(), 'logSha256': digest(log_path)})
        write('command-receipts.json', receipts)
        print(name, 'exit', code, flush=True)
        return code

    owned = None
    code = 1
    error = None
    try:
        for command, name in [(['xcodebuild', '-version'], 'xcode-version'),
                              (['xcrun', 'simctl', 'list', 'runtimes', '--json'], 'runtimes'),
                              (['xcrun', 'simctl', 'create', 'CyberSkill owned Root flow',
                                args.device_type, args.runtime], 'create-device')]:
            if run(command, name) != 0:
                raise RuntimeError(name + ' failed')
        owned = (output / 'create-device.log').read_text().strip()
        for command, name in [(['xcrun', 'simctl', 'boot', owned], 'boot-device'),
                              (['xcrun', 'simctl', 'bootstatus', owned, '-b'], 'bootstatus')]:
            if run(command, name) != 0:
                raise RuntimeError(name + ' failed')
        code = run(['xcodebuild', '-project', str(project), '-scheme', 'NativeSample',
                    '-configuration', 'Debug', '-destination', 'platform=iOS Simulator,id=' + owned,
                    '-derivedDataPath', str(output / 'derived-data'),
                    '-resultBundlePath', str(output / 'root-flow.xcresult'),
                    '-parallel-testing-enabled', 'NO', 'CODE_SIGNING_ALLOWED=YES',
                    'CODE_SIGN_IDENTITY=-', '-collect-test-diagnostics', 'never', 'test'], 'root-ui-tests')
        if (output / 'root-flow.xcresult').exists():
            run(['xcrun', 'xcresulttool', 'get', 'test-results', 'summary',
                 '--path', str(output / 'root-flow.xcresult')], 'test-summary')
            run(['xcrun', 'xcresulttool', 'export', 'attachments',
                 '--path', str(output / 'root-flow.xcresult'),
                 '--output-path', str(output / 'attachments')], 'export-attachments')
    except Exception as exc:
        error = str(exc)
    finally:
        if owned:
            run(['xcrun', 'simctl', 'shutdown', owned], 'cleanup-shutdown')
            run(['xcrun', 'simctl', 'delete', owned], 'cleanup-delete')
        after = snapshot(source)
        changes = [name for name in sorted(set(before) | set(after)) if before.get(name) != after.get(name)]
        cleanup = [entry for entry in receipts if entry['name'].startswith('cleanup-')]
        reports = [entry for entry in receipts if entry['name'] in {'test-summary', 'export-attachments'}]
        summary = json.loads((output / 'test-summary.log').read_text()) if any(entry['name'] == 'test-summary' and entry['exitCode'] == 0 for entry in reports) else {}
        expected_tests = summary.get('passedTests') == 7 and summary.get('failedTests') == 0 and summary.get('skippedTests') == 0
        passed = code == 0 and error is None and not changes and expected_tests and len(cleanup) == 2 and len(reports) == 2 and all(entry['exitCode'] == 0 for entry in cleanup + reports)
        write('completion.json', {'passed': passed, 'exitCode': code, 'error': error,
                                  'sourceFiles': len(before), 'sourceChanges': changes,
                                  'ownedDevice': owned, 'completedAt': stamp(),
                                  'scope': 'Seven Root navigation, EN/VI field-name, keyboard-action and caption-reflow XCTest methods. The action check requires the keyboard to remain present until activation. No VoiceOver, physical device, all-axis coverage or human acceptance.'})
    return 0 if passed else 1


if __name__ == '__main__':
    sys.exit(main())
