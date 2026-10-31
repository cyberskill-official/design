import 'dart:convert';
import 'dart:io';

Directory? _csGridColumnDir() {
  if (Platform.isAndroid) {
    try {
      final bytes = File('/proc/self/cmdline').readAsBytesSync();
      final end = bytes.indexOf(0);
      final name = String.fromCharCodes(end < 0 ? bytes : bytes.sublist(0, end)).trim();
      if (name.isNotEmpty) {
        final data = Directory('/data/data/$name');
        if (data.existsSync()) {
          final files = Directory('${data.path}/files');
          if (!files.existsSync()) files.createSync();
          return files;
        }
      }
    } catch (_) {}
  }
  final home = Platform.environment['HOME'];
  if (home == null || home.isEmpty) return null;
  if (Platform.isMacOS || Platform.isIOS) return Directory('$home/Library/Application Support/CyberSkill');
  final xdg = Platform.environment['XDG_DATA_HOME'];
  if (xdg != null && xdg.isNotEmpty) return Directory(xdg);
  return Directory('$home/.local/share/cyberskill');
}

File? _csGridColumnFile() {
  final dir = _csGridColumnDir();
  if (dir == null) return null;
  return File('${dir.path}/.cyberskill-datagrid-columns.json');
}

Map<String, dynamic> _csGridColumnRead() {
  final file = _csGridColumnFile();
  if (file == null || !file.existsSync()) return {};
  try {
    final value = jsonDecode(file.readAsStringSync());
    if (value is Map) return Map<String, dynamic>.from(value);
  } catch (_) {}
  return {};
}

Future<String?> csGridFileLoad(String key) async {
  final value = _csGridColumnRead()[key];
  return value is String ? value : null;
}

Future<void> csGridFileSave(String key, String value) async {
  final file = _csGridColumnFile();
  if (file == null) return;
  final data = _csGridColumnRead();
  data[key] = value;
  try {
    final parent = file.parent;
    if (!parent.existsSync()) parent.createSync(recursive: true);
    await file.writeAsString(jsonEncode(data));
  } catch (_) {}
}
