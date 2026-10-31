import 'dart:convert';

import 'package:flutter/material.dart';

import 'grid_column_file.dart';
import 'catalog.dart';
import 'controls.dart';
import 'primitives.dart';
import 'surfaces.dart';
import 'cs_modes.dart';

List<String> csToggleSelection(List<String> selected, String key) =>
    selected.contains(key) ? selected.where((item) => item != key).toList() : [...selected, key];

List<String> csToggleAllSelection(List<String> keys, List<String> selected) {
  final all = keys.isNotEmpty && keys.every(selected.contains);
  return all ? <String>[] : keys;
}

class CsTagEdit {
  const CsTagEdit(this.tags, this.query);
  final List<String> tags;
  final String query;
}

CsTagEdit csAddTag(List<String> tags, String query, int? max) {
  final text = query.trim();
  if (text.isEmpty) return CsTagEdit(tags, query);
  if (tags.contains(text)) return CsTagEdit(tags, '');
  if (max != null && tags.length >= max) return CsTagEdit(tags, query);
  return CsTagEdit([...tags, text], '');
}

List<String> csBackspaceTag(List<String> tags, String query) =>
    query.isEmpty && tags.isNotEmpty ? tags.sublist(0, tags.length - 1) : tags;

class CsConfidenceMeasurement {
  const CsConfidenceMeasurement(this.tone, this.filled, this.segments);
  final String tone;
  final int filled;
  final int segments;
}

const csConfidenceLabel = 'Confidence';
String csConfidenceLabelText(String? label, String fallback) => label ?? fallback;
String csConfidenceCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Độ tin cậy', 'low': 'Thấp', 'medium': 'Trung bình', 'high': 'Cao'};
  const en = {'label': csConfidenceLabel, 'low': 'Low', 'medium': 'Medium', 'high': 'High'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csConfidenceToneWord(String tone, String low, String medium, String high) => tone == 'low' ? low : tone == 'high' ? high : medium;
String csConfidenceName(String label, String word) => label.isEmpty ? word : '$label $word';
CsConfidenceMeasurement csConfidenceMeasure(double? value, String? level, double segments) {
  final source = segments.isFinite && segments != 0 ? segments : double.nan;
  final segs = csRenderCount(source, 5, minimum: 1);
  if (value != null) {
    final numeric = value.isFinite ? value : 0.0;
    final clamped = numeric < 0 ? 0.0 : (numeric > 1 ? 1.0 : numeric);
    final tone = clamped < 0.4 ? 'low' : clamped < 0.75 ? 'medium' : 'high';
    final filled = (clamped * segs).round().clamp(0, segs);
    return CsConfidenceMeasurement(tone, filled, segs);
  }
  final tone = level == 'low' || level == 'medium' || level == 'high' ? level! : 'medium';
  final fill = tone == 'low' ? 2 : tone == 'high' ? 5 : 3;
  final filled = (fill / 5 * segs).round().clamp(0, segs);
  return CsConfidenceMeasurement(tone, filled, segs);
}

class CsDataColumn {
  const CsDataColumn(this.key, this.header);
  final String key;
  final String header;
}

class CsDataGrid extends StatefulWidget {
  const CsDataGrid({super.key, required this.columns, required this.rows, required this.selectable, required this.selected, required this.selectAllLabel, required this.clearLabel, required this.onSelect, required this.dark, required this.highContrast, required this.compact, this.persistKey});
  final List<CsDataColumn> columns;
  final List<Map<String, String>> rows;
  final bool selectable;
  final List<String> selected;
  final String selectAllLabel;
  final String clearLabel;
  final ValueChanged<List<String>> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final String? persistKey;

  @override
  State<CsDataGrid> createState() => _CsDataGridState();
}

class _CsDataGridState extends State<CsDataGrid> {
  final scroll = ScrollController();
  var scrollTop = 0.0;
  List<String>? columnOrder;
  String? sort;

  @override
  void initState() {
    super.initState();
    final key = csGridStorageKey(widget.persistKey);
    columnOrder = key == null ? null : csGridDecodeOrder(csGridColumnStore[key]);
    if (key != null) {
      csGridFileLoad(key).then((raw) {
        final decoded = csGridDecodeOrder(raw);
        if (!mounted || decoded == null) return;
        setState(() => columnOrder = decoded);
      });
    }
    scroll.addListener(() {
      if (!mounted) return;
      setState(() => scrollTop = scroll.offset);
    });
  }

  @override
  void dispose() {
    scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final rows = csGridSorted(widget.rows, sort);
    final columns = widget.columns;
    final selected = widget.selected;
    final onSelect = widget.onSelect;
    final selectable = widget.selectable;
    final clearLabel = widget.clearLabel;
    final selectAllLabel = widget.selectAllLabel;
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final keys = [for (var index = 0; index < rows.length; index++) csGridRowKey(rows[index]['id'], index)];
    final allSelected = keys.isNotEmpty && keys.every(selected.contains);
    final useVirtual = csGridVirtual(false, rows.length);
    final window = csGridWindow(rows.length, 280, 36, scrollTop, useVirtual);
    final painted = csGridPainted(rows.length, window[0], window[1]);
    final ordered = [
      for (final key in csGridOrderedKeys(columnOrder, columns.map((column) => column.key).toList()))
        columns.firstWhere((column) => column.key == key),
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(children: [
          for (final column in ordered)
            CsOwnFocus(builder: (node, claim) => TextButton(
              focusNode: node,
              onPressed: () {
                claim();
                setState(() => sort = csGridNextSort(sort, column.key));
              },
              child: Text('${column.header} ${csGridSortAria(sort, column.key) == 'ascending' ? '▲' : csGridSortAria(sort, column.key) == 'descending' ? '▼' : '↕'}'),
            )),
        ]),
        if (selectable)
          CsCheckbox(label: selectAllLabel, value: allSelected, onChanged: (next) { if (next == null || next == allSelected) return; onSelect(csToggleAllSelection(keys, selected)); }, dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact),
        if (widget.persistKey != null)
          Row(children: [
            for (final column in ordered)
              CsOwnFocus(builder: (node, claim) => TextButton(
                focusNode: node,
                onPressed: () {
                  claim();
                  final next = csGridPinOrder(ordered.map((column) => column.key).toList(), column.key, true);
                  setState(() => columnOrder = next);
                  csGridSaveOrder(csGridColumnStore, widget.persistKey, next);
                  final key = csGridStorageKey(widget.persistKey);
                  if (key != null && next != null) csGridFileSave(key, csGridEncodeOrder(next));
                },
                child: Text(csGridCopy('pin', null)),
              )),
          ]),
        if (useVirtual)
          SizedBox(
            height: 240,
            child: SingleChildScrollView(
              controller: scroll,
              child: Column(children: [
                if (window[0] > 0) SizedBox(height: window[0] * 36),
                for (final index in painted) _gridRow(rows[index], pack, ordered, selected, onSelect, selectable, index),
                if (rows.length > window[1]) SizedBox(height: (rows.length - window[1]) * 36),
              ]),
            ),
          )
        else
          for (final index in painted) _gridRow(rows[index], pack, ordered, selected, onSelect, selectable, index),
      ],
    );
  }

  Widget _gridRow(Map<String, String> row, CSTokenModePack pack, List<CsDataColumn> columns, List<String> selected, ValueChanged<List<String>> onSelect, bool selectable, int index) {
    final key = csGridRowKey(row['id'], index);
    return ConstrainedBox(
      constraints: BoxConstraints(minHeight: csPoints(pack.componentButtonMdMinHeight)),
      child: Semantics(
        selected: selectable && selected.contains(key),
        child: Row(
        children: [
          if (selectable)
            CsCheckbox(
              label: '${csGridCopy('selectRow', null)}: ${csGridRowName(columns.map((column) => row[column.key]).toList(), key)}',
              value: selected.contains(key),
              onChanged: (next) {
                if (next == null || next == selected.contains(key)) return;
                onSelect(csToggleSelection(selected, key));
              },
              dark: widget.dark,
              highContrast: widget.highContrast,
              compact: widget.compact,
            ),
          for (final column in columns) Text(row[column.key] ?? '', style: TextStyle(color: csColor(pack.colorTextPrimary))),
        ],
        ),
      ),
    );
  }
}

class CsTagInput extends StatelessWidget {
  const CsTagInput({super.key, this.label, required this.tags, required this.query, this.removeLabel, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.max, this.placeholder, this.language});
  final String? label;
  final String? removeLabel;
  final String? placeholder;
  final String? language;
  final List<String> tags;
  final String query;
  final void Function(List<String> tags, String query) onChange;
  final int? max;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final hint = csTagPlaceholderShown(placeholder, const [], csTagCopy('placeholder', locale));
    final visible = csTagPlaceholderShown(placeholder, tags, csTagCopy('placeholder', locale));
    final fieldName = (label == null || label!.isEmpty) ? hint : label!;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null && label!.isNotEmpty) ExcludeSemantics(child: Text(label!, style: TextStyle(color: csColor(pack.colorTextPrimary)))),
        Wrap(children: [
          for (final tag in tags)
            CsOwnFocus(builder: (node, claim) => Semantics(label: csTagRemoveName(removeLabel, tag, csTagCopy('remove', locale)), button: true, child: TextButton(focusNode: node, onPressed: () { claim(); onChange(tags.where((item) => item != tag).toList(), query); }, child: ExcludeSemantics(child: Text(csTagRemoveName(removeLabel, tag, csTagCopy('remove', locale))))))),
        ]),
        CsOwnFocus(builder: (node, claim) => Semantics(label: fieldName, textField: true, child: TextField(
          focusNode: node,
          controller: TextEditingController(text: query),
          decoration: InputDecoration(hintText: visible.isEmpty ? null : visible),
          onChanged: (next) {
            claim();
            if (next.contains(',')) {
              final edit = csAddTag(tags, next.replaceAll(',', ''), max);
              onChange(edit.tags, edit.query);
            } else {
              onChange(tags, next);
            }
          },
          onSubmitted: (_) {
            claim();
            final edit = csAddTag(tags, query, max);
            onChange(edit.tags, edit.query);
          },
        ))),
      ],
    );
  }
}

class CsConfidenceMeter extends StatelessWidget {
  const CsConfidenceMeter({super.key, this.label, required this.dark, required this.highContrast, required this.compact, this.value, this.level, this.segments = 5, this.language});
  final String? label;
  final String? language;
  final double? value;
  final String? level;
  final double segments;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final measurement = csConfidenceMeasure(value, level, segments);
    final spoken = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final shown = csConfidenceLabelText(label, csConfidenceCopy('label', spoken));
    final word = csConfidenceToneWord(measurement.tone, csConfidenceCopy('low', spoken), csConfidenceCopy('medium', spoken), csConfidenceCopy('high', spoken));
    final color = switch (measurement.tone) {
      'low' => pack.colorSemanticDanger,
      'high' => pack.colorSemanticSuccess,
      _ => pack.colorSemanticWarning,
    };
    final ink = switch (measurement.tone) {
      'low' => pack.colorSemanticDangerText,
      'high' => pack.colorSemanticSuccessText,
      _ => pack.colorSemanticWarningText,
    };
    return Semantics(
      label: csConfidenceName(shown, word),
      value: '${measurement.filled}',
      child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ExcludeSemantics(child: Text(shown, style: TextStyle(color: csColor(pack.colorTextPrimary)))),
        ExcludeSemantics(child: Text(word, style: TextStyle(color: csColor(ink)))),
        Row(children: [
          for (var index = 0; index < measurement.segments; index++)
            Container(
              width: 16,
              height: 8,
              margin: const EdgeInsets.only(right: 4),
              decoration: BoxDecoration(color: csColor(index < measurement.filled ? color : pack.colorBorderDefault), borderRadius: BorderRadius.circular(2)),
            ),
        ]),
      ],
      ),
    );
  }
}

class CsCollapsible extends StatelessWidget {
  const CsCollapsible({super.key, required this.title, required this.content, required this.expandedLabel, required this.collapsedLabel, required this.isOpen, required this.onOpenChange, required this.dark, required this.highContrast, required this.compact});
  final String title;
  final String content;
  final String expandedLabel;
  final String collapsedLabel;
  final bool isOpen;
  final ValueChanged<bool> onOpenChange;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ConstrainedBox(
          constraints: BoxConstraints(minHeight: csPoints(pack.componentButtonMdMinHeight)),
          child: CsOwnFocus(builder: (node, claim) => TextButton(
            focusNode: node,
            onPressed: () { claim(); onOpenChange(!isOpen); },
            child: Align(alignment: Alignment.centerLeft, child: Text(title, style: TextStyle(color: csColor(pack.colorTextPrimary)))),
          )),
        ),
        Semantics(label: isOpen ? expandedLabel : collapsedLabel, child: const SizedBox.shrink()),
        if (isOpen) Text(content, style: TextStyle(color: csColor(pack.colorTextMuted))),
      ],
    );
  }
}

const csGridSelectAll = 'Select all rows';
const csGridSelectRow = 'Select row';
const csGridEmpty = 'No results';
String csGridRowName(List<String?> cells, String key) {
  for (final cell in cells) {
    if (cell != null && cell.trim().isNotEmpty) return cell;
  }
  return key;
}
bool csGridAllSelected(bool selectable, List<String> keys, List<String> selected) => selectable && keys.isNotEmpty && keys.every(selected.contains);
bool csGridShowsCaption(String? caption) => caption != null && caption.isNotEmpty;
String csGridEmptyText(String? empty, String fallback) => empty ?? fallback;
List<String> csGridFilterKeys(List<String>? requested, List<String> columns) => requested == null || requested.isEmpty ? columns : requested;
const csGridPin = 'Pin column {name}';
List<String> csGridOrderedKeys(List<String>? order, List<String> columns) {
  if (order == null || order.isEmpty) return columns;
  final remaining = [...columns];
  final out = <String>[];
  for (final key in order) {
    if (remaining.remove(key)) out.add(key);
  }
  out.addAll(remaining);
  return out;
}
List<String>? csGridPinOrder(List<String> order, String key, bool canPersist) => canPersist ? [key, ...order.where((item) => item != key)] : null;
String? csGridStorageKey(String? persistKey) => persistKey == null || persistKey.isEmpty ? null : 'cs:datagrid:cols:$persistKey';
List<String>? csGridDecodeOrder(String? raw) {
  if (raw == null) return null;
  try {
    final value = jsonDecode(raw);
    if (value is! List || value.any((item) => item is! String)) return null;
    return value.cast<String>();
  } catch (_) {
    return null;
  }
}
String csGridEncodeOrder(List<String> order) => jsonEncode(order);
final csGridColumnStore = <String, String>{};
void csGridSaveOrder(Map<String, String> store, String? persistKey, List<String>? order) {
  final key = csGridStorageKey(persistKey);
  if (key == null || order == null) return;
  store[key] = csGridEncodeOrder(order);
}
String csGridPinName(String? header, String key, [String? template]) => (template ?? csGridPin).replaceAll('{name}', header ?? key);
String csGridCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'selectAll': 'Chọn tất cả', 'selectRow': 'Chọn dòng', 'empty': 'Không có kết quả', 'pin': 'Ghim cột này', 'pinNamed': 'Ghim cột {name}'};
  const en = {'selectAll': csGridSelectAll, 'selectRow': csGridSelectRow, 'empty': 'No results', 'pin': 'Pin this column', 'pinNamed': csGridPin};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
const csTagPlaceholder = 'Add a tag…';
List<String> csTagValues(List<String>? value, List<String> inner) => value ?? inner;
String csTagPlaceholderShown(String? text, List<String> tags, String fallback) => tags.isNotEmpty ? '' : (text ?? fallback);
String csTagRemoveName(String? label, String tag, String fallback) => '${label ?? fallback} $tag';
String csTagCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'placeholder': 'Thêm thẻ…', 'remove': 'Gỡ'};
  const en = {'placeholder': 'Add a tag…', 'remove': 'Remove'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool csTagCanEdit(bool disabled, bool composing) => !disabled && !composing;
const csToolbarMore = 'More actions';
int csToolbarCut(int count, int? overflowAfter) => overflowAfter == null ? count : (overflowAfter < 0 ? 0 : (overflowAfter > count ? count : overflowAfter));
String csToolbarPlacement(String? explicit) => explicit ?? 'bottom-end';
const csToolbarGap = 6.0;
class CsToolbarPlace {
  const CsToolbarPlace(this.x, this.y, this.maxWidth, this.maxHeight, this.placement);
  final double x;
  final double y;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsToolbarPlace? csToolbarShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY, String placement) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: placement, gap: csToolbarGap);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: csToolbarGap);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsToolbarPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}
String csToolbarCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'more': 'Thao tác khác'};
  const en = {'more': 'More actions'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
List<String> csToolbarTail(List<String> items, int? overflowAfter) => items.skip(csToolbarCut(items.length, overflowAfter)).where((item) => item != '-').toList();
int csToolbarMove(int current, int count, int delta) => count <= 0 ? 0 : (current + delta < 0 ? 0 : (current + delta > count - 1 ? count - 1 : current + delta));
String csGridRowKey(String? value, int index) => value ?? '$index';
int? csGridRowIndex(bool virtual, int position, {bool header = false}) => virtual ? (header ? 1 : position + 2) : null;
int? csGridRowCount(bool virtual, int count) => virtual ? (count + 1 > 2 ? count + 1 : 2) : null;
double csGridRowHeight(double requested, double measured) {
  final estimate = requested.isFinite && requested > 0 ? requested : 36.0;
  final known = measured.isFinite ? measured : estimate;
  return estimate > known ? estimate : known;
}
bool csGridVirtual(bool enabled, int count, {int threshold = 80}) => enabled || count >= threshold;
List<int> csGridWindow(int count, double height, double rowHeight, double scrollTop, bool virtual) {
  if (!virtual) return [0, count];
  final safeRow = rowHeight.isFinite && rowHeight > 0 ? rowHeight : 36.0;
  final body = height - 40 > 0 ? height - 40 : 0.0;
  final visible = (body / safeRow).ceil() + 8;
  final fromScroll = (scrollTop / safeRow).floor() - 4;
  final startLimit = count - visible > 0 ? count - visible : 0;
  final start = startLimit < (fromScroll > 0 ? fromScroll : 0) ? startLimit : (fromScroll > 0 ? fromScroll : 0);
  final end = count < start + visible ? count : start + visible;
  return [start, end];
}
List<int> csGridPainted(int count, int start, int end) {
  final safeStart = start < 0 ? 0 : (start > count ? count : start);
  final safeEnd = end < safeStart ? safeStart : (end > count ? count : end);
  return [for (var index = safeStart; index < safeEnd; index++) index];
}
List<Map<String, String>> csGridFiltered(List<Map<String, String>> rows, String? query, List<String> keys) {
  final needle = (query ?? '').trim().toLowerCase();
  if (needle.isEmpty) return rows;
  return rows.where((row) => keys.any((key) => (row[key] ?? '').toLowerCase().contains(needle))).toList();
}
List<Map<String, String>> csGridSorted(List<Map<String, String>> rows, String? sort) {
  if (sort == null || !sort.contains(':')) return rows;
  final descending = sort.startsWith('desc:');
  final key = sort.substring(sort.indexOf(':') + 1);
  final sorted = [...rows]..sort((a, b) => (a[key] ?? '').compareTo(b[key] ?? ''));
  return descending ? sorted.reversed.toList() : sorted;
}
String? csGridNextSort(String? current, String key) => current == 'asc:$key' ? 'desc:$key' : current == 'desc:$key' ? null : 'asc:$key';
String? csGridSortAria(String? current, String key) => current == 'asc:$key' ? 'ascending' : current == 'desc:$key' ? 'descending' : null;
String csTimelineMarker(String state) => state == 'todo' ? '' : state == 'now' ? '→' : '✓';
bool csTimelineShowsDetail(String? text) => text != null && text.isNotEmpty;

class CsTimelineItem {
  const CsTimelineItem(this.title, {this.state = 'done', this.meta, this.body});
  final String title;
  final String state;
  final String? meta;
  final String? body;
}

class CsTimeline extends StatelessWidget {
  const CsTimeline({super.key, required this.items, required this.dark, required this.highContrast, required this.compact});
  final List<CsTimelineItem> items;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (final item in items)
          Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
              width: 26,
              height: 26,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: csColor(item.state == 'now' ? pack.colorBrandOchre : item.state == 'todo' ? pack.colorSurfaceRaised : pack.colorSemanticSuccess),
                shape: BoxShape.circle,
                border: item.state == 'todo' ? Border.all(color: csColor(pack.colorBorderDefault)) : null,
              ),
              child: ExcludeSemantics(child: Text(csTimelineMarker(item.state), style: TextStyle(color: csColor(item.state == 'now' ? pack.colorBrandUmber : item.state == 'todo' ? pack.colorTextMuted : pack.colorSemanticSuccessFg), fontWeight: FontWeight.w700, fontSize: 12))),
            ),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(item.title, style: TextStyle(color: csColor(pack.colorTextPrimary))),
              if (csTimelineShowsDetail(item.meta)) Text(item.meta!, style: TextStyle(color: csColor(pack.colorTextMuted))),
              if (csTimelineShowsDetail(item.body)) Text(item.body!, style: TextStyle(color: csColor(pack.colorTextMuted))),
            ]),
          ]),
      ],
    );
  }
}

class CsToolbar extends StatefulWidget {
  const CsToolbar({super.key, this.label, required this.items, required this.onSelect, required this.dark, required this.highContrast, required this.compact, this.overflowAfter, this.language});
  final String? label;
  final int? overflowAfter;
  final String? language;
  final List<String> items;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsToolbar> createState() => _CsToolbarState();
}

class _CsToolbarState extends State<CsToolbar> {
  var focus = 0;
  var open = false;
  final moreKey = GlobalKey();
  final listKey = GlobalKey();
  Size? natural;
  Size? fitted;
  CsToolbarPlace? place;

  void measure() {
    final fieldBox = moreKey.currentContext?.findRenderObject() as RenderBox?;
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
    final next = csToolbarShift(
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
      csToolbarPlacement(null),
    );
    setState(() { fitted = listBox.size; place = next; });
  }

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final moreName = csToolbarCopy('more', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)));
    final cut = csToolbarCut(widget.items.length, widget.overflowAfter);
    final head = widget.items.take(cut).toList();
    final extra = csToolbarTail(widget.items, widget.overflowAfter);
    if (!open) { natural = null; fitted = null; }
    if (open && extra.isNotEmpty) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && open) measure(); });
    return Semantics(
      label: widget.label ?? '',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            for (var index = 0; index < head.length; index++)
              if (head[index] == '-')
                ExcludeSemantics(child: Container(width: 1, height: 24, color: csColor(pack.colorBorderDefault)))
              else
                CsOwnFocus(builder: (node, claim) => TextButton(
                  focusNode: node,
                  onPressed: () {
                    claim();
                    setState(() => focus = index);
                    widget.onSelect(head[index]);
                  },
                  child: Text(head[index], style: TextStyle(color: csColor(focus == index ? pack.colorBrandOchre : pack.colorTextPrimary))),
                )),
            if (extra.isNotEmpty) CsOwnFocus(builder: (node, claim) => Semantics(label: moreName, value: open ? 'true' : 'false', button: true, child: TextButton(key: moreKey,
              focusNode: node,
              onPressed: () { claim(); setState(() => open = !open); },
              child: ExcludeSemantics(child: Text(moreName)),
            ))),
          ]),
          if (open) Opacity(opacity: place == null ? 0 : 1, child: Transform.translate(key: listKey, offset: Offset(place?.x ?? 0, place?.y ?? 0), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          for (final item in extra) CsOwnFocus(builder: (node, claim) => TextButton(
            focusNode: node,
            onPressed: () { claim(); setState(() => open = false); widget.onSelect(item); },
            child: Text(item),
          )),
          ]))),
        ],
      ),
    );
  }
}
