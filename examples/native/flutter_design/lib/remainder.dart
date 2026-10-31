import 'dart:async';

import 'package:flutter/material.dart';

import 'controls.dart';
import 'surfaces.dart';
import 'icon_paths.dart';
import 'qr_encode.dart';
import 'structures.dart';

class CsKeyEvent {
  const CsKeyEvent(this.key, {this.ctrl = false, this.meta = false, this.shift = false, this.alt = false});
  final String key;
  final bool ctrl;
  final bool meta;
  final bool shift;
  final bool alt;
}

bool csHotKeyMatches(String combo, CsKeyEvent event) {
  final parts = combo.toLowerCase().split('+').map((part) => part.trim()).toList();
  if (parts.isEmpty) return false;
  final key = parts.removeLast();
  if (key.isEmpty) return false;
  const allowed = {'mod', 'ctrl', 'meta', 'shift', 'alt'};
  if (parts.any((part) => !allowed.contains(part))) return false;
  final control = parts.contains('mod')
      ? (event.meta || event.ctrl) && (!parts.contains('ctrl') || event.ctrl) && (!parts.contains('meta') || event.meta)
      : event.ctrl == parts.contains('ctrl') && event.meta == parts.contains('meta');
  return control && event.shift == parts.contains('shift') && event.alt == parts.contains('alt') && event.key.toLowerCase() == key;
}
const csHotKeyTitle = 'Keyboard shortcuts';
const csHotKeyToggle = 'Toggle this sheet';
String csHotKeyCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'title': 'Phím tắt', 'toggle': 'Bật/tắt bảng này'};
  const en = {'title': csHotKeyTitle, 'toggle': csHotKeyToggle};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool csHotKeyIgnored({required bool composing, required int keyCode, required bool inField}) => composing || keyCode == 229 || inField;
bool csHotKeyHelp(String key, {required bool ctrl, required bool meta, required bool alt, required bool help}) => help && key == '?' && !ctrl && !meta && !alt;
bool? csHotKeyNextOpen({required bool open, required bool helpKey, required bool otherModal}) {
  if (!helpKey) return null;
  if (!open && otherModal) return null;
  return !open;
}

double csChartMax(List<double> values) => values.isEmpty ? 1 : (values.reduce((a, b) => a > b ? a : b) < 1 ? 1 : values.reduce((a, b) => a > b ? a : b));

String csChartKind(String type) => type == 'pie' || type == 'line' || type == 'spark' ? type : 'bar';

int csChartSliceSlot(int index) {
  const count = 5;
  return ((index % count) + count) % count;
}

String csChartNumber(double value) {
  if (value.isNaN) return 'NaN';
  if (value.isInfinite) return value > 0 ? 'Infinity' : '-Infinity';
  if (value == 0) return '0';
  final rounded = value.roundToDouble();
  if (value == rounded && value.abs() < 1e21) return rounded.toInt().toString();
  return value.toString();
}

List<String>? csChartLegend(String type, List<String> labels, List<double> values, bool showValues) {
  if (csChartKind(type) == 'spark') return null;
  return [
    for (var index = 0; index < labels.length; index++)
      showValues && index < values.length ? '${labels[index]} ${csChartNumber(values[index])}' : labels[index]
  ];
}

String csChartCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'empty': 'Biểu đồ chưa có dữ liệu'};
  const en = {'empty': 'Chart with no data'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csChartEmpty(String text, String fallback) => text.isEmpty ? fallback : text;
String csChartAccessibleName(String? label, List<(String, double)> points, String empty) {
  if (label != null && label.trim().isNotEmpty) return label;
  if (points.isEmpty) return empty;
  return points.map((point) => '${point.$1}: ${csChartNumber(point.$2)}').join(', ');
}

class CsChartBar {
  const CsChartBar(this.x, this.y, this.width, this.height);
  final double x;
  final double y;
  final double width;
  final double height;
}

class CsChartPoint {
  const CsChartPoint(this.x, this.y);
  final double x;
  final double y;
}

class CsChartSlice {
  const CsChartSlice(this.start, this.end, this.large, this.full);
  final double start;
  final double end;
  final bool large;
  final bool full;
}

List<CsChartBar> csChartBars(List<double> values, {double height = 160}) {
  final numbers = [for (final value in values) value.isNaN ? 0.0 : value];
  if (numbers.isEmpty) return [];
  final peak = csChartMax(numbers);
  final floor = numbers.reduce((a, b) => a < b ? a : b);
  final low = floor < 0 ? floor : 0.0;
  final span = peak - low == 0 ? 1.0 : peak - low;
  final band = (320 - 8) / numbers.length;
  final zeroY = low < 0 ? 6 + (peak / span) * (height - 26) : height - 20;
  return [
    for (var index = 0; index < numbers.length; index++)
      () {
        final value = numbers[index];
        final double barHeight;
        final double y;
        if (low < 0) {
          barHeight = value.abs() / span * (height - 26);
          y = value >= 0 ? zeroY - barHeight : zeroY;
        } else {
          barHeight = (value < 0 ? 0 : value) / peak * (height - 26);
          y = height - 20 - (barHeight < 0 ? 0 : barHeight);
        }
        return CsChartBar(4 + index * band + band * 0.14, y, band * 0.72, barHeight < 0 ? 0 : barHeight);
      }()
  ];
}

List<CsChartPoint> csChartLine(List<double> values, {double height = 160}) {
  final numbers = [for (final value in values) value.isNaN ? 0.0 : value];
  final peak = csChartMax(numbers);
  final step = (numbers.length - 1) < 1 ? 1 : numbers.length - 1;
  return [
    for (var index = 0; index < numbers.length; index++)
      CsChartPoint((index / step) * (320 - 8) + 4, height - 6 - (numbers[index] / peak) * (height - 24))
  ];
}

List<CsChartSlice?> csChartPie(List<double> values) {
  final numbers = [for (final value in values) value.isNaN ? 0.0 : value];
  final total = numbers.fold<double>(0, (sum, value) => sum + value);
  final safe = total == 0 ? 1.0 : total;
  var angle = -3.141592653589793 / 2;
  return [
    for (final value in numbers)
      () {
        if (value == 0) return null;
        if (value == total) return CsChartSlice(angle, angle, false, true);
        final next = angle + (value / safe) * 3.141592653589793 * 2;
        final slice = CsChartSlice(angle, next, next - angle > 3.141592653589793, false);
        angle = next;
        return slice;
      }()
  ];
}

class CsTerminalLine {
  const CsTerminalLine({this.command, this.output});
  final String? command;
  final String? output;
}

List<CsTerminalLine>? csTerminalRun(List<CsTerminalLine> history, String command, String? output) {
  if (command.trim().isEmpty) return null;
  return [...history, CsTerminalLine(command: command), if (output != null && output.isNotEmpty) CsTerminalLine(output: output)];
}
const csTerminalTitle = 'cyberskill — zsh';
const csTerminalInput = 'Terminal input';
String csTerminalCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'input': 'Ô nhập lệnh', 'title': csTerminalTitle};
  const en = {'input': csTerminalInput, 'title': csTerminalTitle};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csTerminalBarTitle(String? title, String fallback) => title ?? fallback;
bool csTerminalSubmits({required bool composing, required int keyCode}) => !composing && keyCode != 229;

class CsCascaderNode {
  const CsCascaderNode(this.key, this.label, [this.children = const []]);
  final String key;
  final String label;
  final List<CsCascaderNode> children;
}

class CsCascaderPick {
  const CsCascaderPick(this.path, this.commit);
  final List<String> path;
  final bool commit;
}

class CsCascaderBack {
  const CsCascaderBack(this.path, this.close);
  final List<String> path;
  final bool close;
}

class CsDockScale {
  const CsDockScale(this.scale, this.lift);
  final double scale;
  final double lift;
}

bool csCascaderOpen(bool requested, bool disabled) => requested && !disabled;
bool csCascaderDismissOutside(bool open, bool inside) => open && !inside;
const csCascaderGap = 6.0;
class CsCascaderPlace {
  const CsCascaderPlace(this.x, this.y, this.maxWidth, this.maxHeight, this.placement);
  final double x;
  final double y;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsCascaderPlace? csCascaderShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: 'bottom-start', gap: csCascaderGap);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: csCascaderGap);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsCascaderPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}

List<List<CsCascaderNode>> csCascaderColumns(List<CsCascaderNode> nodes, List<String> path) {
  final columns = <List<CsCascaderNode>>[];
  var level = nodes;
  var depth = 0;
  while (level.isNotEmpty) {
    columns.add(level);
    CsCascaderNode? picked;
    final key = depth < path.length ? path[depth] : null;
    for (final node in level) {
      if (node.key == key) picked = node;
    }
    level = picked?.children ?? const [];
    depth++;
  }
  return columns;
}

List<String> csCascaderLabels(List<CsCascaderNode> nodes, List<String> value) {
  final labels = <String>[];
  var level = nodes;
  for (final key in value) {
    CsCascaderNode? picked;
    for (final node in level) {
      if (node.key == key) picked = node;
    }
    if (picked == null) break;
    labels.add(picked.label);
    level = picked.children;
  }
  return labels;
}

CsCascaderPick csCascaderSelect(List<String> path, int depth, String key, bool hasChildren) => CsCascaderPick([...path.take(depth), key], !hasChildren);

int? csCascaderMove(int index, int count, String key) {
  if (count <= 0) return null;
  if (key == 'down') return index < 0 ? 0 : (index + 1 > count - 1 ? count - 1 : index + 1);
  if (key == 'up') return index < 0 ? count - 1 : (index - 1 < 0 ? 0 : index - 1);
  if (key == 'home') return 0;
  if (key == 'end') return count - 1;
  return null;
}

CsCascaderBack csCascaderArrowLeft(List<String> path, int depth) {
  if (path.isEmpty) return CsCascaderBack(path, true);
  final parent = depth > 0 ? depth - 1 : (path.length - 1 < 0 ? 0 : path.length - 1);
  return CsCascaderBack(path.take(parent).toList(), false);
}
int csCascaderSlot(List<List<CsCascaderNode>> columns, int depth, int offset) {
  var seen = offset;
  for (var level = 0; level < depth && level < columns.length; level++) seen += columns[level].length;
  return seen;
}
(int, CsCascaderNode)? csCascaderLocate(int index, List<List<CsCascaderNode>> columns) {
  var seen = 0;
  for (var depth = 0; depth < columns.length; depth++) {
    final column = columns[depth];
    if (index >= seen && index < seen + column.length) return (depth, column[index - seen]);
    seen += column.length;
  }
  return null;
}
int? csCascaderIndex(List<List<CsCascaderNode>> columns, int depth, String key) {
  if (depth < 0 || depth >= columns.length) return null;
  final offset = columns[depth].indexWhere((node) => node.key == key);
  return offset < 0 ? null : csCascaderSlot(columns, depth, offset);
}
class CsCascaderPress {
  const CsCascaderPress(this.index, this.path, this.commit, this.close);
  final int index;
  final List<String> path;
  final bool commit;
  final bool close;
}
CsCascaderPress? csCascaderPress(String key, int index, List<List<CsCascaderNode>> columns, List<String> path) {
  if (key == 'down' || key == 'up' || key == 'home' || key == 'end') {
    final next = csCascaderMove(index, columns.fold<int>(0, (sum, column) => sum + column.length), key);
    return next == null ? null : CsCascaderPress(next, path, false, false);
  }
  if (key == 'right') {
    final place = csCascaderLocate(index, columns);
    if (place == null) return null;
    final next = csCascaderSelect(path, place.$1, place.$2.key, place.$2.children.isNotEmpty);
    return CsCascaderPress(index, next.path, next.commit, next.commit);
  }
  if (key == 'left') {
    final depth = csCascaderLocate(index, columns)?.$1 ?? -1;
    final back = csCascaderArrowLeft(path, depth);
    if (back.close) return CsCascaderPress(index, path, false, true);
    final parentDepth = depth > 0 ? depth - 1 : (path.length - 1 < 0 ? 0 : path.length - 1);
    final parentKey = parentDepth < path.length ? path[parentDepth] : null;
    final nextIndex = parentKey == null ? index : (csCascaderIndex(columns, parentDepth, parentKey) ?? index);
    return CsCascaderPress(nextIndex, back.path, false, false);
  }
  return null;
}

String csCascaderText(String label, List<String> path, List<CsCascaderNode> nodes) {
  final names = csCascaderLabels(nodes, path);
  if (names.isNotEmpty) return names.join(' / ');
  if (path.isEmpty) return label;
  return path.join(' / ');
}
const csCascaderPlaceholder = 'Select…';
String csCascaderCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'placeholder': 'Chọn…'};
  const en = {'placeholder': csCascaderPlaceholder};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csCascaderPlaceholderText(String? text, String fallback) => text ?? fallback;
String csCascaderFace(List<String> labels, String placeholder) => labels.isEmpty ? placeholder : labels.join(' / ');
String? csCascaderFieldName(String? label, String? labelledBy) => labelledBy != null && labelledBy.isNotEmpty ? null : label;

CsDockScale csDockScale(int index, int? hover) {
  final distance = hover == null ? 3 : (index - hover).abs();
  if (distance == 0) return const CsDockScale(1.35, -6);
  if (distance == 1) return const CsDockScale(1.15, -2);
  return const CsDockScale(1, 0);
}

class CsCascader extends StatefulWidget {
  const CsCascader({super.key, required this.path, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.nodes = const [], this.label, this.labelledBy, this.placeholder, this.disabled = false, this.language});
  final String? label;
  final String? labelledBy;
  final List<String> path;
  final List<CsCascaderNode> nodes;
  final String? placeholder;
  final bool disabled;
  final String? language;
  final ValueChanged<List<String>> onChange;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  State<CsCascader> createState() => _CsCascaderState();
}

class _CsCascaderState extends State<CsCascader> {
  var requested = false;
  var highlight = -1;
  late List<String> draft = widget.path;
  final fieldKey = GlobalKey();
  final listKey = GlobalKey();
  Size? natural;
  Size? fitted;
  CsCascaderPlace? place;

  void measure() {
    final fieldBox = fieldKey.currentContext?.findRenderObject() as RenderBox?;
    final listBox = listKey.currentContext?.findRenderObject() as RenderBox?;
    if (fieldBox == null || !fieldBox.hasSize || listBox == null || !listBox.hasSize || !fieldBox.attached || !listBox.attached) return;
    final field = fieldBox.localToGlobal(Offset.zero);
    final list = listBox.localToGlobal(Offset.zero);
    if (natural == null) {
      setState(() => natural = listBox.size);
      return;
    }
    if (fitted == listBox.size && place != null) return;
    final view = View.of(context);
    final width = view.physicalSize.width / view.devicePixelRatio;
    final height = view.physicalSize.height / view.devicePixelRatio;
    final next = csCascaderShift(
      CsFloatingRect(field.dx, field.dy, field.dx + fieldBox.size.width, field.dy + fieldBox.size.height, fieldBox.size.width, fieldBox.size.height),
      natural!.width,
      natural!.height,
      listBox.size.width,
      listBox.size.height,
      CsFloatingRect(8, 8, width - 8, height - 8, 0, 0),
      list.dx,
      list.dy,
      1,
      1,
    );
    setState(() { fitted = listBox.size; place = next; });
  }

  @override
  void didUpdateWidget(CsCascader oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.path.join('\u0000') != oldWidget.path.join('\u0000')) { draft = widget.path; highlight = -1; }
    if (widget.disabled && !oldWidget.disabled) { requested = false; highlight = -1; }
  }

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final hint = csCascaderPlaceholderText(widget.placeholder, csCascaderCopy('placeholder', locale));
    final shown = csCascaderFace(csCascaderLabels(widget.nodes, widget.path), hint);
    final opened = csCascaderOpen(requested, widget.disabled);
    final name = csCascaderFieldName(widget.label, widget.labelledBy);
    final columns = csCascaderColumns(widget.nodes, draft);
    if (!opened) { natural = null; fitted = null; }
    if (opened) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && requested) measure(); });
    return TapRegion(
      onTapOutside: opened && csCascaderDismissOutside(true, false) ? (_) { setState(() { requested = false; highlight = -1; }); } : null,
      child: Focus(
      onKeyEvent: (node, event) {
        if (event is! KeyDownEvent) return KeyEventResult.ignored;
        if (event.logicalKey == LogicalKeyboardKey.escape && opened) {
          setState(() { requested = false; highlight = -1; });
          return KeyEventResult.handled;
        }
        final key = event.logicalKey == LogicalKeyboardKey.arrowDown ? 'down'
          : event.logicalKey == LogicalKeyboardKey.arrowUp ? 'up'
          : event.logicalKey == LogicalKeyboardKey.arrowLeft ? 'left'
          : event.logicalKey == LogicalKeyboardKey.arrowRight ? 'right'
          : event.logicalKey == LogicalKeyboardKey.home ? 'home'
          : event.logicalKey == LogicalKeyboardKey.end ? 'end'
          : null;
        if (key == null) return KeyEventResult.ignored;
        if (!opened) {
          if (key != 'down' || widget.disabled) return KeyEventResult.ignored;
          setState(() { requested = true; highlight = -1; });
          return KeyEventResult.handled;
        }
        final next = csCascaderPress(key, highlight, columns, draft);
        if (next == null) return KeyEventResult.ignored;
        setState(() {
          highlight = next.index;
          draft = next.path;
          if (next.close) { requested = false; highlight = -1; }
        });
        if (next.commit) widget.onChange(next.path);
        return KeyEventResult.handled;
      },
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Semantics(
        button: true,
        label: name,
        toggled: opened,
        child: CsOwnFocus(builder: (node, claim) => TextButton(key: fieldKey, focusNode: node, onPressed: widget.disabled ? null : () { claim(); setState(() => requested = !requested); }, child: name == null ? Text('$shown ▾') : ExcludeSemantics(child: Text('$shown ▾')))),
      ),
      if (opened) Transform.translate(offset: Offset(place?.x ?? 0, place?.y ?? 0), child: Row(key: listKey, crossAxisAlignment: CrossAxisAlignment.start, children: [
          for (var depth = 0; depth < columns.length; depth++)
            Column(children: [
              for (var offset = 0; offset < columns[depth].length; offset++)
                Builder(builder: (context) {
                  final node = columns[depth][offset];
                  final slot = csCascaderSlot(columns, depth, offset);
                  return Semantics(
                    button: true,
                    selected: depth < draft.length && draft[depth] == node.key,
                    label: node.label,
                    child: CsOwnFocus(builder: (focusNode, claim) => TextButton(focusNode: focusNode, onPressed: () {
                      claim();
                      final next = csCascaderSelect(draft, depth, node.key, node.children.isNotEmpty);
                      setState(() { highlight = slot; draft = next.path; if (next.commit) { requested = false; highlight = -1; } });
                      if (next.commit) widget.onChange(next.path);
                    }, child: ExcludeSemantics(child: Text(node.children.isEmpty ? node.label : '${node.label} ›', style: TextStyle(color: slot == highlight ? csColor(csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact).colorBrandOchre) : null))))),
                  );
                }),
            ]),
        ])),
    ]),
    ),
    );
  }
}

class CsChart extends StatelessWidget {
  const CsChart({super.key, required this.label, required this.values, required this.dark, required this.highContrast, required this.compact, this.type = 'bar', this.pointLabels = const [], this.showValues = false, this.emptyLabel = '', this.language});
  final String label;
  final List<double> values;
  final String type;
  final List<String> pointLabels;
  final bool showValues;
  final String emptyLabel;
  final String? language;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final fills = [pack.accent, pack.accentStrong, pack.accentGradB, pack.colorTextMuted, pack.colorBorderDefault].map(csColor).toList();
    final points = [for (var index = 0; index < pointLabels.length; index++) (pointLabels[index], index < values.length ? values[index] : 0.0)];
    final rows = csChartLegend(type, pointLabels, values, showValues);
    return Semantics(
      label: csChartAccessibleName(label, points, csChartEmpty(emptyLabel, csChartCopy('empty', csSelectResolvedLanguage(language, CsLanguageScope.of(context))))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        CustomPaint(size: const Size(320, 160), painter: _ChartPainter(csChartKind(type), values, fills)),
        if (rows != null) Row(children: [for (final row in rows) Text(row)]),
      ]),
    );
  }
}

class CsDock extends StatefulWidget {
  const CsDock({super.key, required this.label, required this.items, required this.onSelect});
  final String label;
  final List<String> items;
  final ValueChanged<String> onSelect;
  @override
  State<CsDock> createState() => _CsDockState();
}

class _CsDockState extends State<CsDock> {
  int? hover;
  @override
  Widget build(BuildContext context) => Semantics(
    label: widget.label,
    child: MouseRegion(
      onExit: (_) => setState(() => hover = null),
      child: Row(children: [
        for (var index = 0; index < widget.items.length; index++)
          MouseRegion(
            onEnter: (_) => setState(() => hover = index),
            child: CsOwnFocus(builder: (node, claim) => Transform.translate(
                offset: Offset(0, csDockScale(index, hover).lift),
                child: Transform.scale(
                  scale: csDockScale(index, hover).scale,
                  child: TextButton(
                    focusNode: node,
                    onFocusChange: (focused) => setState(() => hover = focused ? index : (hover == index ? null : hover)),
                    onPressed: () { claim(); widget.onSelect(widget.items[index]); },
                    child: Text(widget.items[index]),
                  ),
                ),
              )),
          ),
      ]),
    ),
  );
}

enum CsEditorMark { off, on, mixed }

String csEditorEscape(String text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

String csEditorPlainInsert(String text) => csEditorEscape(text).replaceAll('\r\n', '\n').replaceAll('\n', '<br>');

CsEditorMark csEditorMark(List<bool> samples, CsEditorMark fallback) {
  if (samples.isEmpty) return fallback;
  if (samples.every((sample) => sample)) return CsEditorMark.on;
  if (samples.any((sample) => sample)) return CsEditorMark.mixed;
  return CsEditorMark.off;
}
String csEditorCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'toolbar': 'Định dạng', 'bold': 'Đậm', 'italic': 'Nghiêng', 'list': 'Danh sách', 'area': 'Văn bản'};
  const en = {'toolbar': 'Formatting', 'bold': 'Bold', 'italic': 'Italic', 'list': 'Bullet list', 'area': 'Rich text'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csEditorName(String? label, String fallback) => label ?? fallback;
bool csEditorPressed(bool current) => !current;

class CsEditor extends StatefulWidget {
  const CsEditor({super.key, required this.text, required this.onChange, this.label, this.language});
  final String? label;
  final String? language;
  final String text;
  final ValueChanged<String> onChange;
  @override
  State<CsEditor> createState() => _CsEditorState();
}

class _CsEditorState extends State<CsEditor> {
  var bold = false;
  var italic = false;
  var list = false;

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final spoken = csEditorName(widget.label, csEditorCopy('area', locale));
    Widget mark(String glyph, String name, bool pressed, VoidCallback toggle) => Semantics(
      button: true,
      label: name,
      toggled: pressed,
      child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); toggle(); }, child: ExcludeSemantics(child: Text(glyph)))),
    );
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Semantics(container: true, label: csEditorCopy('toolbar', locale), child: Row(children: [
        mark('B', csEditorCopy('bold', locale), bold, () => setState(() => bold = csEditorPressed(bold))),
        mark('I', csEditorCopy('italic', locale), italic, () => setState(() => italic = csEditorPressed(italic))),
        mark('≔', csEditorCopy('list', locale), list, () => setState(() => list = csEditorPressed(list))),
      ])),
      CsOwnFocus(builder: (node, claim) => TextField(focusNode: node, controller: TextEditingController(text: widget.text), onChanged: (next) { claim(); widget.onChange(next); }, decoration: InputDecoration(labelText: spoken.isEmpty ? null : spoken))),
    ]);
  }
}

class CsForm extends StatelessWidget {
  const CsForm({super.key, required this.children});
  final List<Widget> children;
  @override
  Widget build(BuildContext context) => CsFormAncestor(inForm: true, child: Column(children: children));
}

class CsFieldset extends StatelessWidget {
  const CsFieldset({super.key, required this.children, this.legend, this.disabled = false});
  final List<Widget> children;
  final String? legend;
  final bool disabled;
  @override
  Widget build(BuildContext context) {
    return CsFormAncestor(inForm: true, child: IgnorePointer(ignoring: disabled, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (legend != null && legend!.isNotEmpty) Text(legend!),
      ...children,
    ])));
  }
}

bool csFormFieldShowsLabel(String label) => label.trim().isNotEmpty;
bool csFormFieldShowsHint(String? hint) => hint != null && hint.isNotEmpty;
String csFormFieldCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'required': 'bắt buộc'};
  const en = {'required': 'required'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}

class CsFormField extends StatelessWidget {
  const CsFormField({super.key, required this.label, required this.dark, required this.highContrast, required this.compact, required this.child, this.hint, this.error, this.required = false, this.language});
  final String label;
  final String? hint;
  final String? error;
  final bool required;
  final String? language;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final Widget child;
  @override
  Widget build(BuildContext context) {
    final mark = csFormFieldCopy('required', csSelectResolvedLanguage(language, CsLanguageScope.of(context)));
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        if (csFormFieldShowsLabel(label)) Text(label),
        if (required) Semantics(label: mark, child: const ExcludeSemantics(child: Text('*'))),
      ]),
      child,
      if (error != null && error!.isNotEmpty) Text(error!) else if (csFormFieldShowsHint(hint)) Text(hint!),
    ]);
  }
}

String csFormArrayCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'addRow': 'Thêm dòng', 'arrayContext': 'FormFieldArray phải được đặt bên trong Form'};
  const en = {'addRow': 'Add row', 'arrayContext': 'FormFieldArray must be used inside Form'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csFormArrayAdd(String? text, String fallback) => text != null && text.isNotEmpty ? text : fallback;
bool csFormArrayShowsLabel(String? label) => label != null && label.isNotEmpty;
bool csFormArrayCanAdd(int count, int max) => count < max;
bool csFormArrayCanRemove(int count, int min) => count > min;

class CsFormFieldArray extends StatelessWidget {
  const CsFormFieldArray({super.key, required this.rows, required this.removeLabel, required this.onChange, this.label, this.addLabel, this.min = 0, this.max = 50, this.language});
  final String? label;
  final List<String> rows;
  final String? addLabel;
  final String removeLabel;
  final int min;
  final int max;
  final String? language;
  final ValueChanged<List<String>> onChange;
  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final add = csFormArrayAdd(addLabel, csFormArrayCopy('addRow', locale));
    if (!CsFormAncestor.of(context)) return Text(csFormArrayCopy('arrayContext', locale));
    return Column(children: [
      if (csFormArrayShowsLabel(label)) Text(label!),
      for (var i = 0; i < rows.length; i++)
        Row(children: [
          Text(rows[i]),
          CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: csFormArrayCanRemove(rows.length, min) ? () { claim(); onChange([...rows]..removeAt(i)); } : null, child: Text(removeLabel))),
        ]),
      CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: csFormArrayCanAdd(rows.length, max) ? () { claim(); onChange([...rows, '']); } : null, child: Text(add))),
    ]);
  }
}

String csFormWizardCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'back': 'Quay lại', 'next': 'Tiếp', 'finish': 'Hoàn tất', 'step': 'Bước', 'summary': 'Vui lòng sửa các mục sau:', 'requiredField': 'Vui lòng nhập giá trị'};
  const en = {'back': 'Back', 'next': 'Next', 'finish': 'Finish', 'step': 'Step', 'summary': 'Please fix the following:', 'requiredField': 'Enter a value'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csFormWizardButton(String? text, String fallback) => text != null && text.isNotEmpty ? text : fallback;
String csFormWizardStep(String title, int index, String fallback) => '${index + 1}. ${title.isEmpty ? '$fallback ${index + 1}' : title}';
bool csFormWizardCanBack(int index, {required bool pending}) => index > 0 && !pending;
bool csFormWizardLast(int index, int count) => count > 0 && index >= count - 1;
String? csFormWizardRequired(String? value, String fallback) => value == null || value.trim().isEmpty ? fallback : null;

class CsFormWizard extends StatelessWidget {
  const CsFormWizard({super.key, required this.steps, required this.index, required this.onIndex, this.backLabel, this.nextLabel, this.finishLabel, this.errors = const [], this.pending = false, this.language, this.onComplete});
  final List<String> steps;
  final int index;
  final String? backLabel;
  final String? nextLabel;
  final String? finishLabel;
  final List<String> errors;
  final bool pending;
  final String? language;
  final ValueChanged<int> onIndex;
  final VoidCallback? onComplete;
  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final active = steps.isEmpty ? 0 : (index < 0 ? 0 : (index > steps.length - 1 ? steps.length - 1 : index));
    final last = csFormWizardLast(active, steps.length);
    final back = csFormWizardButton(backLabel, csFormWizardCopy('back', locale));
    final next = csFormWizardButton(nextLabel, csFormWizardCopy('next', locale));
    final finish = csFormWizardButton(finishLabel, csFormWizardCopy('finish', locale));
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      for (var offset = 0; offset < steps.length; offset++)
        Semantics(selected: offset == active, value: offset == active ? 'step' : null, child: Text(csFormWizardStep(steps[offset], offset, csFormWizardCopy('step', locale)))),
      if (errors.isNotEmpty) ...[Text(csFormWizardCopy('summary', locale)), for (final error in errors) Text(error)],
      if (steps.isNotEmpty) Row(children: [
        CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: csFormWizardCanBack(active, pending: pending) ? () { claim(); onIndex(active - 1); } : null, child: Text(back))),
        CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: pending ? null : () { claim(); if (last) { onComplete?.call(); } else { onIndex(active + 1); } }, child: Text(last ? finish : next))),
      ]),
    ]);
  }
}

class CsHotKeys extends StatefulWidget {
  const CsHotKeys({super.key, required this.bindings, required this.onTrigger, this.help = true, this.language});
  final List<(String, String)> bindings;
  final ValueChanged<String> onTrigger;
  final bool help;
  final String? language;
  @override
  State<CsHotKeys> createState() => _CsHotKeysState();
}

class _CsHotKeysState extends State<CsHotKeys> {
  var open = false;

  @override
  void initState() {
    super.initState();
    HardwareKeyboard.instance.addHandler(_onKey);
  }

  @override
  void dispose() {
    HardwareKeyboard.instance.removeHandler(_onKey);
    super.dispose();
  }

  bool _inField() {
    final context = FocusManager.instance.primaryFocus?.context;
    if (context == null) return false;
    return context.widget is EditableText || context.findAncestorWidgetOfExactType<EditableText>() != null;
  }

  bool _onKey(KeyEvent event) {
    if (event is! KeyDownEvent) return false;
    final characters = event.character ?? '';
    final question = event.logicalKey == LogicalKeyboardKey.question || (event.logicalKey == LogicalKeyboardKey.slash && HardwareKeyboard.instance.isShiftPressed);
    final key = question ? '?' : characters;
    if (csHotKeyIgnored(composing: false, keyCode: 0, inField: _inField())) return false;
    if (event.logicalKey == LogicalKeyboardKey.escape) {
      if (!open) return false;
      setState(() => open = false);
      return true;
    }
    final next = csHotKeyNextOpen(open: open, helpKey: csHotKeyHelp(key, ctrl: HardwareKeyboard.instance.isControlPressed, meta: HardwareKeyboard.instance.isMetaPressed, alt: HardwareKeyboard.instance.isAltPressed, help: widget.help), otherModal: false);
    if (next != null) {
      setState(() => open = next);
      return true;
    }
    if (question) {
      for (final binding in widget.bindings) {
        if (csHotKeyMatches(binding.$1, CsKeyEvent('?', ctrl: HardwareKeyboard.instance.isControlPressed, meta: HardwareKeyboard.instance.isMetaPressed, shift: HardwareKeyboard.instance.isShiftPressed, alt: HardwareKeyboard.instance.isAltPressed))) {
          widget.onTrigger(binding.$1);
          return true;
        }
      }
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    final spoken = csHotKeyCopy('title', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)));
    final toggle = csHotKeyCopy('toggle', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)));
    return Column(children: [
      for (final binding in widget.bindings) CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); widget.onTrigger(binding.$1); }, child: Text('${binding.$1} ${binding.$2}'))),
      if (open) Semantics(namesRoute: true, label: spoken, child: Column(children: [Text(spoken), for (final binding in widget.bindings) Text('${binding.$2} ${binding.$1}'), Text(toggle), const Text('?')])),
    ]);
  }
}

bool csHoverOpen(bool hovered, bool focused) => hovered || focused;
int csHoverDelay(bool opening, {int openDelay = 150, int closeDelay = 200}) => opening ? openDelay : closeDelay;
bool csHoverSyncAfterLeave(bool focused) => !focused;
bool csHoverSyncAfterBlur(bool hovered) => !hovered;

class CsHoverCard extends StatefulWidget {
  const CsHoverCard({super.key, required this.label, required this.child, this.openDelay = 150, this.closeDelay = 200});
  final String label;
  final Widget child;
  final int openDelay;
  final int closeDelay;
  @override
  State<CsHoverCard> createState() => _CsHoverCardState();
}

class _CsHoverCardState extends State<CsHoverCard> {
  var hovered = false;
  var focused = false;
  var open = false;
  Timer? timer;

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  void sync() {
    timer?.cancel();
    final next = csHoverOpen(hovered, focused);
    timer = Timer(Duration(milliseconds: csHoverDelay(next, openDelay: widget.openDelay, closeDelay: widget.closeDelay)), () {
      if (mounted) setState(() => open = next);
    });
  }

  void dismiss() {
    timer?.cancel();
    timer = null;
    setState(() => open = false);
  }

  @override
  Widget build(BuildContext context) => MouseRegion(
    onEnter: (_) { hovered = true; sync(); },
    onExit: (_) { hovered = false; if (csHoverSyncAfterLeave(focused)) sync(); },
    child: Focus(
      onFocusChange: (entering) { focused = entering; if (entering || csHoverSyncAfterBlur(hovered)) sync(); },
      onKeyEvent: (node, event) {
        if (event is! KeyDownEvent || event.logicalKey != LogicalKeyboardKey.escape) return KeyEventResult.ignored;
        dismiss();
        return KeyEventResult.handled;
      },
      child: Column(children: [widget.child, if (open) Text(widget.label)]),
    ),
  );
}

enum CsPresence { absent, zero, text }

bool csPresenceShown(CsPresence kind, [String text = '']) {
  if (kind == CsPresence.absent) return false;
  if (kind == CsPresence.zero) return true;
  return text.isNotEmpty;
}

String? csNativeLabelId(String id, bool shown) => shown ? '$id-label' : null;
String? csNativeErrorId(String id, bool shown) => shown ? '$id-err' : null;
String? csNativeLabelledBy(String? explicit, bool hasAriaLabel, String? labelId) => explicit ?? (hasAriaLabel ? null : labelId);
bool? csNativeInvalid(bool hasError, bool? passed) => hasError ? true : passed;
const csSelectPlaceholder = 'Select…';
bool csSelectShowsPlaceholder(String? placeholder, bool hasChildren) => placeholder != null || !hasChildren;
String csSelectPlaceholderText(String? placeholder, String fallback) => placeholder ?? fallback;
String csSelectControlId(String? id, String generated) => id ?? generated;
const csInputGroupInput = 'Input';
String csInputGroupText(String? controlled, String inner) => controlled ?? inner;
String? csInputGroupAddonName(String? ariaLabel, bool hasLabel, bool hasLabelledBy, String? placeholder, String fallback) {
  if (ariaLabel != null) return ariaLabel;
  if (hasLabel || hasLabelledBy) return null;
  if (placeholder != null && placeholder.isNotEmpty) return placeholder;
  return fallback;
}

const csReviewRegion = 'Human review gate';
const csReviewRisk = 'review required';
const csReviewerPrefix = 'Reviewer';
String csReviewRiskText(String? risk, String fallback) => risk ?? fallback;
String csReviewAction(String? label, String fallback) => label ?? fallback;
String? csReviewerLine(String? reviewer, String prefix) => reviewer == null || reviewer.isEmpty ? null : '$prefix: $reviewer';
String csReviewCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {
    'aria': 'Cổng kiểm duyệt của con người',
    'risk': 'cần xem xét',
    'approve': 'Phê duyệt',
    'reject': 'Từ chối',
    'reviewer': 'Người duyệt',
  };
  const en = {'aria': csReviewRegion, 'risk': csReviewRisk, 'approve': 'Approve', 'reject': 'Reject', 'reviewer': csReviewerPrefix};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
class CsHumanReviewGate extends StatelessWidget {
  const CsHumanReviewGate({super.key, this.risk, required this.summary, this.approveLabel, this.rejectLabel, required this.onApprove, required this.onReject, this.reviewer, this.language});
  final String? risk;
  final String summary;
  final String? reviewer;
  final String? approveLabel;
  final String? rejectLabel;
  final String? language;
  final VoidCallback onApprove;
  final VoidCallback onReject;
  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final riskText = csReviewRiskText(risk, csReviewCopy('risk', locale));
    final rejectName = csReviewAction(rejectLabel, csReviewCopy('reject', locale));
    final approveName = csReviewAction(approveLabel, csReviewCopy('approve', locale));
    final line = csReviewerLine(reviewer, csReviewCopy('reviewer', locale));
    return Semantics(label: csReviewCopy('aria', locale), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(riskText),
      Text(summary),
      if (line != null) Text(line),
      CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); onReject(); }, child: Text(rejectName))),
      CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); onApprove(); }, child: Text(approveName))),
    ]));
  }
}

String? csInlineCommit(String draft, String value, [bool cancelling = false]) => cancelling || draft == value ? null : draft;
String csInlineText(String value, String empty) => value.isEmpty ? empty : value;
String csInlineControlled(String? value, String inner) => value ?? inner;
bool csInlineEnter(bool composing, int keyCode) => !composing && keyCode != 229;
String csInlineEditLabel(String action, String label) => label.isEmpty ? action : '$action: $label';
String csInlineFieldName(String label, String edit) => label.isEmpty ? edit : label;
String csInlineCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'edit': 'Sửa', 'empty': 'Thêm nội dung'};
  const en = {'edit': 'Edit', 'empty': 'Add text'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}

class CsInlineEdit extends StatefulWidget {
  const CsInlineEdit({super.key, required this.label, required this.value, required this.onChange, this.editAction = '', this.emptyLabel = '', this.language});
  final String label;
  final String value;
  final String editAction;
  final String emptyLabel;
  final String? language;
  final ValueChanged<String> onChange;
  @override
  State<CsInlineEdit> createState() => _CsInlineEditState();
}

class _CsInlineEditState extends State<CsInlineEdit> {
  var editing = false;
  var cancelling = false;
  var closed = false;
  var sawFocus = false;
  final draft = TextEditingController();
  final editNode = FocusNode();
  final draftNode = FocusNode();
  late final editId = csOverlayFreshId('inline-edit');
  late final draftId = csOverlayFreshId('inline-draft');

  @override
  void initState() {
    super.initState();
    editNode.addListener(() {
      if (editNode.hasFocus) claimEdit();
    });
  }

  void claimEdit() => CsFocusRegistry.claim(editId, editNode.requestFocus);
  void claimDraft() => CsFocusRegistry.claim(draftId, draftNode.requestFocus);

  @override
  void dispose() {
    CsFocusRegistry.disconnect(editId);
    CsFocusRegistry.disconnect(draftId);
    editNode.dispose();
    draftNode.dispose();
    draft.dispose();
    super.dispose();
  }

  void begin() {
    claimEdit();
    setState(() {
      closed = false;
      sawFocus = false;
      cancelling = false;
      draft.text = widget.value;
      editing = true;
    });
  }

  void finish() {
    if (closed) return;
    claimEdit();
    closed = true;
    final next = csInlineCommit(draft.text, widget.value, cancelling);
    setState(() {
      cancelling = false;
      editing = false;
    });
    if (next != null) widget.onChange(next);
  }

  void cancel() {
    cancelling = true;
    draft.text = widget.value;
    finish();
  }

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final edit = widget.editAction.isEmpty ? csInlineCopy('edit', locale) : widget.editAction;
    final empty = widget.emptyLabel.isEmpty ? csInlineCopy('empty', locale) : widget.emptyLabel;
    final shown = csInlineText(widget.value, empty);
    final field = csInlineFieldName(widget.label, edit);
    if (!editing) return TextButton(focusNode: editNode, onPressed: begin, child: Text(shown, semanticsLabel: csInlineEditLabel(edit, widget.label)));
    return Focus(
      onFocusChange: (hasFocus) {
        if (hasFocus) { sawFocus = true; claimDraft(); }
        else if (sawFocus) finish();
      },
      onKeyEvent: (node, event) {
        if (event is! KeyDownEvent || event.logicalKey != LogicalKeyboardKey.escape) return KeyEventResult.ignored;
        cancel();
        return KeyEventResult.handled;
      },
      child: Semantics(textField: true, label: field, child: TextField(focusNode: draftNode, controller: draft, decoration: const InputDecoration(), onChanged: (_) => claimDraft(), onSubmitted: (_) => finish())),
    );
  }
}

bool csInputShowsClear(bool clearable, String value) => clearable && value.isNotEmpty;
bool csInputCanClear(bool disabled, bool readOnly) => !disabled && !readOnly;
bool csInputCanReveal(bool disabled) => !disabled;
String csInputRevealLabel(bool revealed, [String show = 'Show password', String hide = 'Hide password']) => revealed ? hide : show;
String csInputCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'input': 'Ô nhập', 'clear': 'Xóa', 'show': 'Hiện mật khẩu', 'hide': 'Ẩn mật khẩu'};
  const en = {'input': 'Input', 'clear': 'Clear', 'show': 'Show password', 'hide': 'Hide password'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}

class CsInputGroup extends StatelessWidget {
  const CsInputGroup({super.key, required this.label, required this.child, this.text = '', this.onText, this.clearable = false, this.password = false, this.revealed = false, this.onReveal, this.disabled = false, this.readOnly = false, this.language});
  final String label;
  final Widget child;
  final String text;
  final ValueChanged<String>? onText;
  final bool clearable;
  final bool password;
  final bool revealed;
  final ValueChanged<bool>? onReveal;
  final bool disabled;
  final bool readOnly;
  final String? language;
  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final fieldName = csInputGroupAddonName(null, label.isNotEmpty, false, null, csInputCopy('input', locale)) ?? label;
    final clearName = csInputCopy('clear', locale);
    final revealName = csInputRevealLabel(revealed, csInputCopy('show', locale), csInputCopy('hide', locale));
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    if (label.isNotEmpty) ExcludeSemantics(child: Text(label)),
    Row(children: [
      Expanded(child: CsOwnFocus(builder: (node, claim) => Semantics(label: fieldName, textField: true, child: TextField(focusNode: node, controller: TextEditingController(text: text), obscureText: password && !revealed, onChanged: (next) { claim(); if (!disabled && !readOnly) onText?.call(next); })))),
      child,
      if (csInputShowsClear(clearable, text)) CsOwnFocus(builder: (node, claim) => Semantics(label: clearName, button: true, child: TextButton(focusNode: node, onPressed: csInputCanClear(disabled, readOnly) ? () { claim(); onText?.call(''); } : null, child: ExcludeSemantics(child: Text(clearName))))),
      if (password) CsOwnFocus(builder: (node, claim) => Semantics(label: revealName, toggled: revealed, button: true, child: TextButton(focusNode: node, onPressed: csInputCanReveal(disabled) ? () { claim(); onReveal?.call(!revealed); } : null, child: ExcludeSemantics(child: Text(revealName))))),
    ]),
  ]);
  }
}

class CsItem extends StatelessWidget {
  const CsItem({super.key, required this.title, this.subtitle = ''});
  final String title;
  final String subtitle;
  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(title), if (subtitle.isNotEmpty) Text(subtitle)]);
}

class CsLocaleProvider extends StatelessWidget {
  const CsLocaleProvider({super.key, required this.language, required this.child});
  final String language;
  final Widget child;
  @override
  Widget build(BuildContext context) => child;
}

class CsLumiAvatar extends StatelessWidget {
  const CsLumiAvatar({super.key, required this.dark, required this.highContrast, required this.compact, this.alt = 'Lumi'});
  final String alt;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  Widget build(BuildContext context) => CsIcon(name: 'sparkle', label: alt, dark: dark, highContrast: highContrast, compact: compact);
}

class CsMasonry extends StatelessWidget {
  const CsMasonry({super.key, required this.children, this.columns = 3});
  final int columns;
  final List<Widget> children;
  @override
  Widget build(BuildContext context) => Column(children: children);
}

class CsMenuItem extends StatelessWidget {
  const CsMenuItem({super.key, required this.title, required this.onSelect});
  final String title;
  final VoidCallback onSelect;
  @override
  Widget build(BuildContext context) => CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); onSelect(); }, child: Text(title)));
}

class CsNativeSelect extends StatelessWidget {
  const CsNativeSelect({super.key, required this.label, required this.options, required this.selection, required this.onSelect, this.error, this.disabled = false, this.disabledOptions = const {}, this.dark = false, this.highContrast = false, this.compact = false});
  final String label;
  final List<String> options;
  final String selection;
  final String? error;
  final bool disabled;
  final Set<String> disabledOptions;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final ValueChanged<String> onSelect;
  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (csPresenceShown(CsPresence.text, label)) Text(label),
      Stack(children: [
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          for (final option in options) CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: !disabled && !disabledOptions.contains(option) ? () { claim(); onSelect(option); } : null, child: Text(option))),
        ]),
        Positioned(right: 12, top: 0, bottom: 0, child: IgnorePointer(child: ExcludeSemantics(child: Align(alignment: Alignment.centerRight, child: CsIcon(name: 'chevron-down', label: '', dark: dark, highContrast: highContrast, compact: compact))))),
      ]),
      if (error != null && csPresenceShown(CsPresence.text, error!)) Semantics(liveRegion: true, child: Text(error!, style: TextStyle(color: csColor(pack.colorSemanticDangerText)))),
    ]);
  }
}

class CsNavItem extends StatelessWidget {
  const CsNavItem({super.key, required this.title, required this.active, required this.onSelect});
  final String title;
  final bool active;
  final VoidCallback onSelect;
  @override
  Widget build(BuildContext context) => CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); onSelect(); }, child: Text(title)));
}

class CsOverlayProvider extends StatelessWidget {
  const CsOverlayProvider({super.key, required this.child});
  final Widget child;
  @override
  Widget build(BuildContext context) => child;
}

const csPromptPlaceholder = 'Type your wish…';
const csPromptSend = 'Send';
const csPromptHint = 'Lumi replies, then hands clear wishes to a human.';
String csPromptCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {
    'placeholder': 'Nhập điều ước của bạn…',
    'send': 'Gửi',
    'hint': 'Lumi trả lời, rồi chuyển điều ước rõ ràng cho con người.',
  };
  const en = {'placeholder': csPromptPlaceholder, 'send': csPromptSend, 'hint': csPromptHint};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csPromptText(String? controlled, String inner) => controlled ?? inner;
String csPromptPlaceholderText(String? text, String fallback) => text ?? fallback;
String csPromptSpoken(String? ariaLabel, String placeholder) => ariaLabel != null && ariaLabel.isNotEmpty ? ariaLabel : placeholder;
String? csPromptHintText(String? hint, String fallback) => csPromptShowsHint(hint) ? (hint ?? fallback) : null;
bool csPromptCanType(bool disabled) => !disabled;
bool csPromptCanSend(bool disabled, bool busy) => !disabled && !busy;
String? csPromptSubmit(String value, bool disabled, bool busy) {
  if (disabled || busy || value.trim().isEmpty) return null;
  return value;
}

bool csPromptEnter(bool shift, bool composing, int keyCode) => !shift && !composing && keyCode != 229;

bool csPromptShowsHint(String? hint) => hint == null || hint.isNotEmpty;

class CsPromptInput extends StatelessWidget {
  const CsPromptInput({super.key, this.submitLabel, required this.text, required this.onSubmit, this.onText, this.placeholder, this.hint, this.ariaLabel, this.disabled = false, this.busy = false, this.language});
  final String? submitLabel;
  final String? placeholder;
  final String? hint;
  final String? ariaLabel;
  final bool disabled;
  final bool busy;
  final String? language;
  final String text;
  final ValueChanged<String> onSubmit;
  final ValueChanged<String>? onText;
  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final prompt = csPromptPlaceholderText(placeholder, csPromptCopy('placeholder', locale));
    final name = csPromptSpoken(ariaLabel, prompt);
    final sendName = submitLabel ?? csPromptCopy('send', locale);
    final hintLine = csPromptHintText(hint, csPromptCopy('hint', locale));
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      CsOwnFocus(builder: (node, claim) => Semantics(label: name, textField: true, child: TextField(focusNode: node, enabled: csPromptCanType(disabled), controller: TextEditingController(text: text), decoration: InputDecoration(hintText: prompt.isEmpty ? null : prompt), onChanged: (next) { claim(); onText?.call(next); }))),
      if (hintLine != null) Text(hintLine),
      CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: !csPromptCanSend(disabled, busy) ? null : () { claim(); final value = csPromptSubmit(text, disabled, busy); if (value != null) onSubmit(value); }, child: Text(sendName))),
    ]);
  }
}

class CsPromptSuggestion {
  const CsPromptSuggestion(this.label, {this.icon});
  final String label;
  final String? icon;
}

String csPromptIcon(String? icon) => icon ?? 'sparkle';
String? csPromptChosen(String label, bool hasHandler) => hasHandler ? label : null;
String csPromptSelected(CsPromptSuggestion suggestion) => suggestion.label;

class CsPromptSuggestions extends StatelessWidget {
  const CsPromptSuggestions({super.key, required this.suggestions, required this.onSelect, this.dark = false, this.highContrast = false, this.compact = false});
  final List<CsPromptSuggestion> suggestions;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  Widget build(BuildContext context) => Column(children: [
    for (final item in suggestions)
      CsOwnFocus(builder: (node, claim) => TextButton(
        focusNode: node,
        onPressed: () { claim(); onSelect(csPromptSelected(item)); },
        child: Row(children: [CsIcon(name: csPromptIcon(item.icon), dark: dark, highContrast: highContrast, compact: compact), Text(item.label)]),
      )),
  ]);
}

class CsQRCode extends StatelessWidget {
  const CsQRCode({super.key, required this.value, required this.label});
  final String value;
  final String label;
  @override
  Widget build(BuildContext context) {
    final modules = csQrMatrix(value);
    return Semantics(
      label: label.isEmpty ? value : label,
      child: modules == null
          ? const Text('—')
          : CustomPaint(size: const Size(128, 128), painter: _QrPainter(modules)),
    );
  }
}

class CsTerminal extends StatefulWidget {
  const CsTerminal({super.key, required this.history, required this.dark, required this.highContrast, required this.compact, this.title, this.prompt = '➜', this.language, this.onCommand});
  final String? title;
  final List<CsTerminalLine> history;
  final String prompt;
  final String? language;
  final String? Function(String command)? onCommand;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  State<CsTerminal> createState() => _CsTerminalState();
}

class _CsTerminalState extends State<CsTerminal> {
  late List<CsTerminalLine> lines = widget.history;
  final draft = TextEditingController();

  @override
  void dispose() {
    draft.dispose();
    super.dispose();
  }

  void _submit(String value) {
    if (!csTerminalSubmits(composing: false, keyCode: 0)) return;
    final trimmed = value.trim();
    if (trimmed.isEmpty) return;
    final next = csTerminalRun(lines, value, widget.onCommand?.call(trimmed));
    if (next == null) return;
    setState(() => lines = next);
    draft.clear();
  }

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final bar = csTerminalBarTitle(widget.title, csTerminalCopy('title', locale));
    final inputName = csTerminalCopy('input', locale);
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(bar),
      for (final line in lines) ...[if (line.command != null) Text('${widget.prompt} ${line.command}'), if (line.output != null) Text(line.output!)],
      Row(children: [
        Text(widget.prompt),
        Expanded(child: Semantics(textField: true, label: inputName, child: TextField(controller: draft, onSubmitted: _submit, decoration: const InputDecoration(border: InputBorder.none)))),
      ]),
    ]);
  }
}

const csTreeSelectPlaceholder = 'Select…';
String csTreeSelectCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'placeholder': 'Chọn…'};
  const en = {'placeholder': csTreeSelectPlaceholder};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csTreeSelectPlaceholderText(String? text, String fallback) => text ?? fallback;
CsTreeNode? csTreeSelectFind(List<CsTreeNode> nodes, String? key) {
  if (key == null) return null;
  for (final node in nodes) {
    if (node.key == key) return node;
    final nested = csTreeSelectFind(node.children, key);
    if (nested != null) return nested;
  }
  return null;
}
String csTreeSelectFace(String? found, String placeholder) => found ?? placeholder;
bool csTreeSelectCommits(CsTreeNode node) => node.children.isEmpty;
bool csTreeSelectShown({required bool requested, required bool disabled}) => requested && !disabled;
bool csTreeSelectDismissOutside(bool open, bool inside) => open && !inside;
String? csTreeSelectFieldName(String? label, String? labelledBy) => labelledBy != null && labelledBy.isNotEmpty ? null : label;
String? csTreeSelectTreeName(String? label, String? labelledBy, String placeholder) {
  if (labelledBy != null && labelledBy.isNotEmpty) return null;
  if (label != null && label.isNotEmpty) return label;
  return placeholder;
}

class CsTreeSelect extends StatefulWidget {
  const CsTreeSelect({super.key, required this.nodes, required this.selected, required this.onSelect, required this.dark, required this.highContrast, required this.compact, this.label, this.labelledBy, this.open = const {}, this.placeholder, this.disabled = false, this.language});
  final String? label;
  final String? labelledBy;
  final List<CsTreeNode> nodes;
  final Map<String, bool> open;
  final String? selected;
  final String? placeholder;
  final bool disabled;
  final String? language;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  State<CsTreeSelect> createState() => _CsTreeSelectState();
}

class _CsTreeSelectState extends State<CsTreeSelect> {
  var requested = false;

  @override
  void didUpdateWidget(CsTreeSelect oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.disabled && !oldWidget.disabled) requested = false;
  }

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final hint = csTreeSelectPlaceholderText(widget.placeholder, csTreeSelectCopy('placeholder', locale));
    final found = csTreeSelectFind(widget.nodes, widget.selected);
    final shown = csTreeSelectFace(found?.label, hint);
    final opened = csTreeSelectShown(requested: requested, disabled: widget.disabled);
    final name = csTreeSelectFieldName(widget.label, widget.labelledBy);
    final tree = csTreeSelectTreeName(widget.label, widget.labelledBy, hint) ?? '';
    return TapRegion(
      onTapOutside: opened && csTreeSelectDismissOutside(true, false) ? (_) { setState(() => requested = false); } : null,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Semantics(
        button: true,
        label: name,
        toggled: opened,
        child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: widget.disabled ? null : () { claim(); setState(() => requested = !requested); }, child: ExcludeSemantics(child: Text('$shown ▾')))),
      ),
      if (opened) Focus(
        onKeyEvent: (node, event) {
          if (event is! KeyDownEvent || event.logicalKey != LogicalKeyboardKey.escape) return KeyEventResult.ignored;
          setState(() => requested = false);
          return KeyEventResult.handled;
        },
        child: CsTree(label: tree, nodes: widget.nodes, open: widget.open, selected: widget.selected, onSelect: (key) {
          final node = csTreeSelectFind(widget.nodes, key);
          if (node == null || !csTreeSelectCommits(node)) return;
          widget.onSelect(key);
          setState(() => requested = false);
        }, dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact),
      ),
    ]),
    );
  }
}

class CsTreeTableNode {
  const CsTreeTableNode(this.key, {this.label = '', this.children = const []});
  final String key;
  final String label;
  final List<CsTreeTableNode> children;
}

class CsTreeTableRow {
  const CsTreeTableRow(this.key, this.label, this.depth, this.expandable, this.open);
  final String key;
  final String label;
  final int depth;
  final bool expandable;
  final bool open;
}

String csTreeRowId(String prefix, String key) => '$prefix-row-${key.codeUnits.map((unit) => unit.toRadixString(16).padLeft(4, '0')).join()}';

List<String> csTreeToggle(List<String> expanded, String key) => expanded.contains(key) ? expanded.where((item) => item != key).toList() : [...expanded, key];

List<CsTreeTableRow> csTreeRows(List<CsTreeTableNode> nodes, List<String> expanded, [int depth = 0]) {
  final rows = <CsTreeTableRow>[];
  for (final node in nodes) {
    final open = expanded.contains(node.key);
    rows.add(CsTreeTableRow(node.key, node.label, depth, node.children.isNotEmpty, open));
    if (open) rows.addAll(csTreeRows(node.children, expanded, depth + 1));
  }
  return rows;
}

int csTreeIndent(int depth) => depth * 18;

String? csTreeControls(String prefix, List<String> children, bool open) => !open || children.isEmpty ? null : children.map((child) => csTreeRowId(prefix, child)).join(' ');
String csTreeTableCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'empty': 'Không có kết quả', 'expand': 'Mở rộng', 'collapse': 'Thu gọn'};
  const en = {'empty': 'No results', 'expand': 'Expand', 'collapse': 'Collapse'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csTreeTableWord(String text, String fallback) => text.isEmpty ? fallback : text;
bool csTreeTableShowsCaption(String? caption) => caption != null && caption.isNotEmpty;
String csTreeTableTwist(String action, String cell) => '$action $cell';

class CsTreeTable extends StatelessWidget {
  const CsTreeTable({super.key, required this.columns, required this.nodes, this.expanded = const [], this.emptyLabel = '', this.expandLabel = '', this.collapseLabel = '', this.caption, this.language, this.onExpanded});
  final List<String> columns;
  final List<CsTreeTableNode> nodes;
  final List<String> expanded;
  final String emptyLabel;
  final String expandLabel;
  final String collapseLabel;
  final String? caption;
  final String? language;
  final ValueChanged<List<String>>? onExpanded;
  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final empty = csTreeTableWord(emptyLabel, csTreeTableCopy('empty', locale));
    final expand = csTreeTableWord(expandLabel, csTreeTableCopy('expand', locale));
    final collapse = csTreeTableWord(collapseLabel, csTreeTableCopy('collapse', locale));
    final visible = csTreeRows(nodes, expanded);
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (csTreeTableShowsCaption(caption)) Text(caption!),
      Text(columns.join(' ')),
      if (visible.isEmpty) Text(empty),
      for (final row in visible)
        Padding(
          padding: EdgeInsets.only(left: csTreeIndent(row.depth).toDouble()),
          child: Row(children: [
            if (row.expandable)
              CsOwnFocus(builder: (node, claim) => TextButton(
                focusNode: node,
                onPressed: () { claim(); onExpanded?.call(csTreeToggle(expanded, row.key)); },
                child: Text(row.open ? '▾' : '▸', semanticsLabel: csTreeTableTwist(row.open ? collapse : expand, row.label.isEmpty ? row.key : row.label)),
              )),
            Text(row.label.isEmpty ? row.key : row.label),
          ]),
        ),
    ]);
  }
}

const csTypingLabel = 'Lumi is typing';
const csTypingDots = 3;
String csTypingLabelText(String? label, String fallback) => label ?? fallback;
String csTypingCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Lumi đang nhập'};
  const en = {'label': csTypingLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
class CsTypingIndicator extends StatelessWidget {
  const CsTypingIndicator({super.key, this.label, this.language});
  final String? label;
  final String? language;
  @override
  Widget build(BuildContext context) {
    final spoken = csTypingLabelText(label, csTypingCopy('label', csSelectResolvedLanguage(language, CsLanguageScope.of(context))));
    return Semantics(
      label: spoken,
      liveRegion: true,
      child: Row(children: [
        for (var i = 0; i < csTypingDots; i++) const ExcludeSemantics(child: SizedBox(width: 6, height: 6)),
      ]),
    );
  }
}

class _ChartPainter extends CustomPainter {
  const _ChartPainter(this.kind, this.values, this.fills);
  final String kind;
  final List<double> values;
  final List<Color> fills;
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = fills[0];
    final scaleX = size.width / 320;
    final scaleY = size.height / 160;
    if (kind == 'pie') {
      final slices = csChartPie(values);
      for (var index = 0; index < slices.length; index++) {
        final slice = slices[index];
        if (slice == null) continue;
        final fill = Paint()..color = fills[csChartSliceSlot(index)];
        if (slice.full) {
          canvas.drawCircle(Offset(60 * scaleY, 60 * scaleY), 50 * scaleY, fill);
        } else {
          canvas.drawArc(Rect.fromCircle(center: Offset(60 * scaleY, 60 * scaleY), radius: 50 * scaleY), slice.start, slice.end - slice.start, true, fill);
        }
      }
      return;
    }
    if (kind == 'line' || kind == 'spark') {
      final points = csChartLine(values);
      final stroke = Paint()
        ..color = fills[0]
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.4;
      for (var index = 1; index < points.length; index++) {
        canvas.drawLine(Offset(points[index - 1].x * scaleX, points[index - 1].y * scaleY), Offset(points[index].x * scaleX, points[index].y * scaleY), stroke);
      }
      if (kind == 'line') {
        for (final point in points) {
          canvas.drawCircle(Offset(point.x * scaleX, point.y * scaleY), 3.4, paint);
        }
      }
      return;
    }
    for (final bar in csChartBars(values)) {
      if (bar.height <= 0) continue;
      canvas.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromLTWH(bar.x * scaleX, bar.y * scaleY, bar.width * scaleX, bar.height * scaleY),
          const Radius.circular(3),
        ),
        paint,
      );
    }
  }
  @override
  bool shouldRepaint(covariant _ChartPainter oldDelegate) => oldDelegate.kind != kind || oldDelegate.values != values || oldDelegate.fills != fills;
}

class _QrPainter extends CustomPainter {
  const _QrPainter(this.modules);
  final List<List<bool>> modules;
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFF111111);
    final cell = size.width / modules.length;
    for (var y = 0; y < modules.length; y++) {
      for (var x = 0; x < modules[y].length; x++) {
        if (modules[y][x]) canvas.drawRect(Rect.fromLTWH(x * cell, y * cell, cell, cell), paint);
      }
    }
  }
  @override
  bool shouldRepaint(covariant _QrPainter oldDelegate) => oldDelegate.modules != modules;
}
