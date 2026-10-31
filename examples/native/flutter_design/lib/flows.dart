import 'package:flutter/material.dart';

import 'catalog.dart';
import 'controls.dart';
import 'surfaces.dart';

const csTimeLabel = 'Time';
String csTimeCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Giờ'};
  const en = {'label': csTimeLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String? csTimeName(String? label, String? labelledBy, String fallback) {
  if (label != null) return label;
  if (labelledBy != null && labelledBy.isNotEmpty) return null;
  return fallback;
}
List<String> csTimeSlots(double step) {
  final whole = step.truncateToDouble();
  final safe = step.isFinite && step == whole && whole >= 1 && whole <= 1440 ? whole.toInt() : 30;
  final out = <String>[];
  for (var minute = 0; minute < 24 * 60; minute += safe) {
    final hour = (minute ~/ 60).toString().padLeft(2, '0');
    final rest = (minute % 60).toString().padLeft(2, '0');
    out.add('$hour:$rest');
  }
  return out;
}

String? csMentionQuery(String text, int caret) {
  final end = caret < 0 ? 0 : (caret > text.length ? text.length : caret);
  final head = text.substring(0, end);
  final at = head.lastIndexOf('@');
  if (at < 0) return null;
  if (at > 0 && head[at - 1].trim().isNotEmpty) return null;
  final after = head.substring(at + 1);
  if (after.contains(RegExp(r'[^A-Za-z0-9_]'))) return null;
  return after.toLowerCase();
}

String csMentionPick(String text, int caret, String user) {
  final end = caret < 0 ? 0 : (caret > text.length ? text.length : caret);
  final head = text.substring(0, end);
  final tail = text.substring(end);
  final at = head.lastIndexOf('@');
  if (at < 0) return text;
  return '${head.substring(0, at)}@$user $tail';
}
List<String> csMentionHits(List<String> users, String? query) {
  if (query == null) return const [];
  return users.where((user) => user.toLowerCase().contains(query)).take(6).toList();
}

List<String> csReorder(List<String> items, int from, int to) {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length || from == to) return items;
  final next = [...items];
  final moved = next.removeAt(from);
  next.insert(to, moved);
  return next;
}

int csTourClamp(int index, int count) => count <= 0 ? 0 : (index < 0 ? 0 : (index > count - 1 ? count - 1 : index));
String csTourCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'skip': 'Bỏ qua', 'back': 'Quay lại', 'next': 'Tiếp', 'done': 'Xong'};
  const en = {'skip': 'Skip', 'back': 'Back', 'next': 'Next', 'done': 'Done'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csTourLabel(String? text, String fallback) => text ?? fallback;
bool csTourLast(int index, int count) => count > 0 && index == count - 1;
String csTourCount(int index, int count) => '${index + 1} / $count';

class CsTimePicker extends StatefulWidget {
  const CsTimePicker({super.key, this.label, required this.value, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.step = 30, this.labelledBy, this.language});
  final String? label;
  final String? labelledBy;
  final String? language;
  final String value;
  final ValueChanged<String> onChange;
  final double step;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsTimePicker> createState() => _CsTimePickerState();
}

class _CsTimePickerState extends State<CsTimePicker> {
  var open = false;

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      CsOwnFocus(builder: (node, claim) => Semantics(label: csTimeName(widget.label, widget.labelledBy, csTimeCopy('label', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)))) ?? '', button: true, child: TextButton(focusNode: node, onPressed: () { claim(); setState(() => open = !open); }, child: ExcludeSemantics(child: Text(widget.value))))),
      if (open) for (final slot in csTimeSlots(widget.step)) CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); widget.onChange(slot); }, child: Text(slot))),
    ]);
  }
}

const csMentionPlaceholder = 'Add a note — @ to mention';
String csMentionCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'placeholder': 'Thêm ghi chú — gõ @ để nhắc tên'};
  const en = {'placeholder': csMentionPlaceholder};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csMentionPlaceholderText(String? text, String fallback) => text ?? fallback;
String csMentionName(String? ariaLabel, String placeholder) => ariaLabel != null && ariaLabel.isNotEmpty ? ariaLabel : placeholder;
String csMentionOption(String user) => '@$user';
bool csMentionDismissOutside(bool open, bool inside) => open && !inside;
class CsMentionPlace {
  const CsMentionPlace(this.x, this.y, this.maxWidth, this.maxHeight, this.placement);
  final double x;
  final double y;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsMentionPlace? csMentionShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: 'bottom-start', gap: 0);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: 0);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsMentionPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}

class CsMentions extends StatefulWidget {
  const CsMentions({super.key, required this.text, required this.users, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.ariaLabel, this.placeholder, this.language});
  final String? ariaLabel;
  final String? placeholder;
  final String? language;
  final String text;
  final List<String> users;
  final ValueChanged<String> onChange;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  State<CsMentions> createState() => _CsMentionsState();
}

class _CsMentionsState extends State<CsMentions> {
  var dismissed = false;
  final fieldKey = GlobalKey();
  final listKey = GlobalKey();
  CsMentionPlace? place;

  void measure() {
    final fieldBox = fieldKey.currentContext?.findRenderObject() as RenderBox?;
    final listBox = listKey.currentContext?.findRenderObject() as RenderBox?;
    if (fieldBox == null || !fieldBox.hasSize || listBox == null || !listBox.hasSize || !fieldBox.attached || !listBox.attached) return;
    final field = fieldBox.localToGlobal(Offset.zero);
    final list = listBox.localToGlobal(Offset.zero);
    final view = View.of(context);
    final width = view.physicalSize.width / view.devicePixelRatio;
    final height = view.physicalSize.height / view.devicePixelRatio;
    final next = csMentionShift(
      CsFloatingRect(field.dx, field.dy, field.dx + fieldBox.size.width, field.dy + fieldBox.size.height, fieldBox.size.width, fieldBox.size.height),
      listBox.size.width,
      listBox.size.height,
      listBox.size.width,
      listBox.size.height,
      CsFloatingRect(8, 8, width - 8, height - 8, 0, 0),
      list.dx,
      list.dy,
      1,
      1,
    );
    if (next == null || (place?.x == next.x && place?.y == next.y && place?.placement == next.placement)) return;
    setState(() => place = next);
  }

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final hint = csMentionPlaceholderText(widget.placeholder, csMentionCopy('placeholder', locale));
    final spoken = csMentionName(widget.ariaLabel, hint);
    final hits = dismissed ? <String>[] : csMentionHits(widget.users, csMentionQuery(widget.text, widget.text.length));
    return TapRegion(
      onTapOutside: hits.isNotEmpty && csMentionDismissOutside(true, false) ? (_) { setState(() => dismissed = true); } : null,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        CsOwnFocus(builder: (node, claim) => Semantics(textField: true, label: spoken, child: TextField(key: fieldKey, focusNode: node, controller: TextEditingController(text: widget.text), minLines: 3, maxLines: 3, decoration: InputDecoration(hintText: hint.isEmpty ? null : hint), onChanged: (next) { claim(); setState(() => dismissed = false); widget.onChange(next); }))),
        if (hits.isNotEmpty) Transform.translate(offset: Offset(place?.x ?? 0, place?.y ?? 0), child: Column(key: listKey, crossAxisAlignment: CrossAxisAlignment.start, children: [
          for (final user in hits) CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); widget.onChange(csMentionPick(widget.text, widget.text.length, user)); setState(() => dismissed = true); }, child: Text(csMentionOption(user)))),
        ])),
      ]),
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!dismissed) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) measure(); });
  }
}

String csSortCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'moveUp': 'Di chuyển lên', 'moveDown': 'Di chuyển xuống'};
  const en = {'moveUp': 'Move up', 'moveDown': 'Move down'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csSortLabel(String? text, String fallback) => text ?? fallback;
bool csSortCanMoveUp(int index) => index > 0;
bool csSortCanMoveDown(int index, int count) => index >= 0 && index < count - 1;

class CsSortable extends StatelessWidget {
  const CsSortable({super.key, required this.items, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.upLabel, this.downLabel, this.language});
  final List<String> items;
  final String? upLabel;
  final String? downLabel;
  final String? language;
  final ValueChanged<List<String>> onChange;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final up = csSortLabel(upLabel, csSortCopy('moveUp', locale));
    final down = csSortLabel(downLabel, csSortCopy('moveDown', locale));
    return Column(children: [
      for (var index = 0; index < items.length; index++)
        Row(children: [
          const ExcludeSemantics(child: Text('⠿')),
          Text(items[index]),
          Semantics(button: true, label: up, enabled: csSortCanMoveUp(index), child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: csSortCanMoveUp(index) ? () { claim(); onChange(csReorder(items, index, index - 1)); } : null, child: const ExcludeSemantics(child: Text('↑'))))),
          Semantics(button: true, label: down, enabled: csSortCanMoveDown(index, items.length), child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: csSortCanMoveDown(index, items.length) ? () { claim(); onChange(csReorder(items, index, index + 1)); } : null, child: const ExcludeSemantics(child: Text('↓'))))),
        ]),
    ]);
  }
}

class CsTour extends StatefulWidget {
  const CsTour({super.key, required this.steps, required this.index, required this.onIndex, required this.onOpenChange, required this.dark, required this.highContrast, required this.compact, this.backLabel, this.nextLabel, this.doneLabel, this.skipLabel, this.language, this.open = true});
  final List<String> steps;
  final int index;
  final String? backLabel;
  final String? nextLabel;
  final String? doneLabel;
  final String? skipLabel;
  final String? language;
  final bool open;
  final ValueChanged<int> onIndex;
  final ValueChanged<bool> onOpenChange;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  State<CsTour> createState() => _CsTourState();
}

class _CsTourState extends State<CsTour> {
  @override
  void initState() {
    super.initState();
    if (widget.open) widget.onIndex(0);
  }

  @override
  void didUpdateWidget(CsTour oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.open && !oldWidget.open) widget.onIndex(0);
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.open || widget.steps.isEmpty) return const SizedBox.shrink();
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final skip = csTourLabel(widget.skipLabel, csTourCopy('skip', locale));
    final back = csTourLabel(widget.backLabel, csTourCopy('back', locale));
    final next = csTourLabel(widget.nextLabel, csTourCopy('next', locale));
    final done = csTourLabel(widget.doneLabel, csTourCopy('done', locale));
    final active = csTourClamp(widget.index, widget.steps.length);
    final last = csTourLast(active, widget.steps.length);
    return Semantics(
      namesRoute: true,
      label: widget.steps[active],
      child: Focus(
        onKeyEvent: (node, event) {
          if (event is! KeyDownEvent || event.logicalKey != LogicalKeyboardKey.escape) return KeyEventResult.ignored;
          widget.onOpenChange(false);
          return KeyEventResult.handled;
        },
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(widget.steps[active]),
          Text(csTourCount(active, widget.steps.length)),
          CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); widget.onOpenChange(false); }, child: Text(skip))),
          if (active > 0) CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); widget.onIndex(active - 1); }, child: Text(back))),
          CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); last ? widget.onOpenChange(false) : widget.onIndex(active + 1); }, child: Text(last ? done : next))),
        ]),
      ),
    );
  }
}

String csTableCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'empty': 'Không có kết quả', 'loading': 'Đang tải bảng', 'error': 'Không tải được bảng này', 'errorHint': 'Kiểm tra kết nối, rồi thử lại.'};
  const en = {'empty': 'No results', 'loading': 'Loading table', 'error': "We couldn't load this table", 'errorHint': 'Check your connection, then try again.'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csTableText(String? text, String fallback) => text ?? fallback;
bool csTableShowsCaption(String? caption) => caption != null && caption.isNotEmpty;

class CsDataTable extends StatelessWidget {
  const CsDataTable({super.key, required this.rows, required this.state, required this.dark, required this.highContrast, required this.compact, this.caption, this.emptyLabel, this.errorLabel, this.loadingRows = 5, this.language});
  final String? caption;
  final List<String> rows;
  final String state;
  final String? emptyLabel;
  final String? errorLabel;
  final double loadingRows;
  final String? language;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final count = csRenderCount(loadingRows, 5, minimum: 1);
    final empty = csTableText(emptyLabel, csTableCopy('empty', locale));
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (csTableShowsCaption(caption)) Text(caption!),
      if (state == 'loading')
        Semantics(label: csTableCopy('loading', locale), value: 'true', child: ExcludeSemantics(child: Column(children: [for (var index = 0; index < count; index++) const Text(' ')])))
      else if (state == 'error')
        if (errorLabel != null) Text(errorLabel!) else Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(csTableCopy('error', locale)), Text(csTableCopy('errorHint', locale))])
      else if (rows.isEmpty)
        Text(empty)
      else
        for (final row in rows) Text(row),
    ]);
  }
}

class CsPopconfirm extends StatelessWidget {
  const CsPopconfirm({super.key, required this.title, this.confirmLabel, this.cancelLabel, required this.open, required this.onOpenChange, required this.onConfirm, required this.onCancel, required this.dark, required this.highContrast, required this.compact, this.language});
  final String title;
  final String? confirmLabel;
  final String? cancelLabel;
  final String? language;
  final bool open;
  final ValueChanged<bool> onOpenChange;
  final VoidCallback onConfirm;
  final VoidCallback onCancel;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); onOpenChange(!open); }, child: Text(title))),
      if (open) ...[
        CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); onOpenChange(false); onCancel(); }, child: Text(csPopconfirmOkText(cancelLabel, csPopconfirmCopy('cancel', csSelectResolvedLanguage(language, CsLanguageScope.of(context))))))),
        CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); onOpenChange(false); onConfirm(); }, child: Text(csPopconfirmOkText(confirmLabel, csPopconfirmCopy('ok', csSelectResolvedLanguage(language, CsLanguageScope.of(context))))))),
      ],
    ]);
  }
}

const csToggleLabel = 'Toggle';
bool csToggleValue(bool? pressed, bool inner) => pressed ?? inner;
bool csToggleHasContent(String? text, {bool hasNode = false}) => hasNode || (text != null && text.trim().isNotEmpty);
String? csToggleName(String? ariaLabel, bool hasContent, String fallback) {
  if (ariaLabel != null) return ariaLabel;
  return hasContent ? null : fallback;
}
bool? csToggleFlip(bool on, bool disabled, bool defaultPrevented) => disabled || defaultPrevented ? null : !on;
String csToggleCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Nút bật tắt'};
  const en = {'label': csToggleLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
const csPopconfirmOk = 'Confirm';
const csPopconfirmCancel = 'Cancel';
String csPopconfirmOkText(String? label, String fallback) => label ?? fallback;
String csPopconfirmCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'ok': 'Xác nhận', 'cancel': 'Hủy'};
  const en = {'ok': csPopconfirmOk, 'cancel': csPopconfirmCancel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
List<String> csPopconfirmSteps() => ['close', 'confirm'];
class CsToggle extends StatelessWidget {
  const CsToggle({super.key, this.label = '', required this.pressed, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.disabled = false, this.ariaLabel, this.language});
  final String label;
  final bool disabled;
  final String? ariaLabel;
  final String? language;
  final bool pressed;
  final ValueChanged<bool> onChange;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final spoken = csToggleCopy('label', csSelectResolvedLanguage(language, CsLanguageScope.of(context)));
    final content = csToggleHasContent(label);
    final name = csToggleName(ariaLabel, content, spoken);
    final next = csToggleFlip(pressed, disabled, false);
    return CsOwnFocus(builder: (node, claim) => Semantics(
      label: name ?? label,
      selected: pressed,
      child: TextButton(
        focusNode: node,
        onPressed: next == null ? null : () { claim(); onChange(next); },
        child: content ? ExcludeSemantics(child: Text(label, style: TextStyle(color: csColor(pressed ? pack.colorBrandOchre : pack.colorTextPrimary)))) : const SizedBox.shrink(),
      ),
    ));
  }
}
