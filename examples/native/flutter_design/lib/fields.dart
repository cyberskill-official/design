import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'controls.dart';
import 'surfaces.dart';

class CsCalendarDate {
  const CsCalendarDate(this.year, this.month, this.day);
  final int year;
  final int month;
  final int day;
}

CsCalendarDate? csDateParse(String text, String language) {
  final trimmed = text.trim();
  if (trimmed.isEmpty) return null;
  if (language == 'vi' || language.isEmpty) {
    final parts = trimmed.split('/');
    if (parts.length != 3) return null;
    final day = int.tryParse(parts[0]);
    final month = int.tryParse(parts[1]);
    final year = int.tryParse(parts[2]);
    if (day == null || month == null || year == null || month < 1 || month > 12) return null;
    final index = month - 1;
    if (day < 1 || day > csCalendarDays(year, index)) return null;
    return CsCalendarDate(year, index, day);
  }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  final parts = trimmed.split(' ');
  if (parts.length != 3) return null;
  final day = int.tryParse(parts[0]);
  final year = int.tryParse(parts[2]);
  final index = months.indexOf(parts[1]);
  if (day == null || year == null || index < 0 || day < 1 || day > csCalendarDays(year, index)) return null;
  return CsCalendarDate(year, index, day);
}

String csCalendarDayLanguage(String? language) {
  if (language == null) return 'en';
  final trimmed = language.trim();
  if (trimmed.isEmpty) return 'en';
  final lower = trimmed.toLowerCase().replaceAll('_', '-');
  if (lower == 'tiếng việt' || lower == 'tieng viet') return 'vi';
  if (lower == 'english') return 'en';
  if (lower == '日本語' || lower == 'japanese') return 'ja';
  final primary = lower.split('-').first;
  if (primary == 'vi' || primary == 'ja') return primary;
  return 'en';
}
String csCalendarDayName(int year, int month, int day, String? language) {
  final code = csCalendarDayLanguage(language);
  final index = csCalendarWeekday(year, month, day);
  const enDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const viDays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const jaDays = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
  final safeMonth = month < 0 ? 0 : (month > 11 ? 11 : month);
  if (code == 'vi') return '${viDays[index]}, $day tháng ${safeMonth + 1}, $year';
  if (code == 'ja') return '$year年${safeMonth + 1}月$day日${jaDays[index]}';
  const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return '${enDays[index]}, ${enMonths[safeMonth]} $day, $year';
}
bool csCalendarCurrent(int year, int month, int day, int nowYear, int nowMonth, int nowDay) {
  return year == nowYear && month == nowMonth && day == nowDay;
}
int csCalendarTabStop(int day, int focused, int monthDays) {
  final limit = monthDays < 1 ? 1 : monthDays;
  final active = focused < 1 ? 1 : (focused > limit ? limit : focused);
  return day == active ? 0 : -1;
}
(int, int) csCalendarShift(int year, int month, int delta) {
  var nextYear = year;
  var nextMonth = month + delta;
  while (nextMonth > 11) {
    nextMonth -= 12;
    nextYear += 1;
  }
  while (nextMonth < 0) {
    nextMonth += 12;
    nextYear -= 1;
  }
  return (nextYear, nextMonth);
}
bool csCalendarLeap(int year) => year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);

int csCalendarDays(int year, int month) {
  switch (month + 1) {
    case 2:
      return csCalendarLeap(year) ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
}

int csCalendarWeekday(int year, int month, int day) {
  var y = year;
  final monthNumber = month + 1;
  const table = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  if (monthNumber < 3) y -= 1;
  return (y + y ~/ 4 - y ~/ 100 + y ~/ 400 + table[monthNumber - 1] + day) % 7;
}

List<int?> csCalendarGrid(int year, int month) {
  final lead = (csCalendarWeekday(year, month, 1) + 6) % 7;
  final cells = List<int?>.filled(lead, null);
  final days = [for (var day = 1; day <= csCalendarDays(year, month); day++) day];
  final out = [...cells, ...days];
  while (out.length % 7 != 0) {
    out.add(null);
  }
  return out;
}

CsCalendarDate csCalendarAddDays(CsCalendarDate date, int delta) {
  var year = date.year;
  var month = date.month;
  var day = date.day + delta;
  while (true) {
    final count = csCalendarDays(year, month);
    if (day > count) {
      day -= count;
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
    } else if (day < 1) {
      month -= 1;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
      day += csCalendarDays(year, month);
    } else {
      return CsCalendarDate(year, month, day);
    }
  }
}
CsCalendarDate csCalendarFocus(int year, int month, int day, String key, {bool shift = false}) {
  if (key == 'home') return CsCalendarDate(year, month, 1);
  if (key == 'end') return CsCalendarDate(year, month, csCalendarDays(year, month));
  if (key == 'pageUp' || key == 'pageDown') {
    final offset = (key == 'pageUp' ? -1 : 1) * (shift ? 12 : 1);
    final moved = csCalendarAddMonths(CsCalendarDate(year, month, 1), offset);
    final count = csCalendarDays(moved.year, moved.month);
    return CsCalendarDate(moved.year, moved.month, day < count ? day : count);
  }
  final delta = key == 'left' ? -1 : key == 'right' ? 1 : key == 'up' ? -7 : 7;
  return csCalendarAddDays(CsCalendarDate(year, month, day), delta);
}
CsCalendarDate csCalendarAddMonths(CsCalendarDate date, int delta) {
  var year = date.year;
  var month = date.month + delta;
  while (month > 11) {
    month -= 12;
    year += 1;
  }
  while (month < 0) {
    month += 12;
    year -= 1;
  }
  final count = csCalendarDays(year, month);
  return CsCalendarDate(year, month, date.day < count ? date.day : count);
}

const csComboboxEmpty = 'No results';
String? csComboboxListName(String? label, String? labelledBy, String fallback) {
  if (label != null && label.isNotEmpty) return label;
  if (labelledBy != null && labelledBy.isNotEmpty) return null;
  return fallback;
}
String? csComboboxEmptyText(int count, String fallback) => count == 0 ? fallback : null;
String csComboboxDisplay(bool open, String query, String? selected) => open ? query : (selected ?? query);
bool csComboboxAllowsOpen(bool requested, bool disabled) => requested && !disabled;
bool csComboboxMessage(String? value) => value != null && value.isNotEmpty;
bool csComboboxUsesWindow(bool inForm, [bool inFieldset = false]) => !(inForm || inFieldset);
bool csComboboxComposing(TextRange range) => range.isValid && !range.isCollapsed;
const csComboboxCaret = '▾';
String? csComboboxPrimaryLanguage(String? tag) {
  if (tag == null) return null;
  final raw = tag.trim();
  if (raw.isEmpty) return null;
  final lower = raw.toLowerCase().replaceAll('_', '-');
  if (lower == 'tiếng việt' || lower == 'tieng viet') return 'vi';
  if (lower == 'english') return 'en';
  if (lower == '日本語' || lower == 'japanese') return 'ja';
  final primary = lower.split('-').first;
  return primary.isEmpty ? null : primary;
}
String csComboboxCopy(String key, String? language) {
  final want = csComboboxPrimaryLanguage(language) ?? 'vi';
  const vi = {'placeholder': 'Chọn hoặc nhập…', 'label': 'Chọn mục', 'empty': 'Không có kết quả'};
  const en = {'placeholder': 'Select or type…', 'label': 'Choose an option', 'empty': 'No results'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csComboboxPlaceholder(String? text, String fallback) => text ?? fallback;
String? csComboboxResolvedLanguage(String? explicit, String? ancestor) => csComboboxPrimaryLanguage(explicit) ?? csComboboxPrimaryLanguage(ancestor);
class CsComboboxOption {
  const CsComboboxOption(this.value, this.label);
  const CsComboboxOption.text(String text) : value = text, label = text;
  final String value;
  final String label;
}
List<CsComboboxOption> csComboboxShownOptions(List<CsComboboxOption> options, String query) {
  final needle = query.trim().toLowerCase();
  if (needle.isEmpty) return options;
  return options.where((option) => option.label.toLowerCase().contains(needle)).toList();
}
String csComboboxDisplayValue(bool open, String query, String? value, List<CsComboboxOption> options) {
  if (open) return query;
  for (final option in options) {
    if (option.value == value) return option.label;
  }
  return query;
}
List<String> csComboboxShown(List<String> labels, String query) {
  final needle = query.trim().toLowerCase();
  if (needle.isEmpty) return labels;
  return labels.where((label) => label.toLowerCase().contains(needle)).toList();
}

String csCalendarMonthLanguage(String? language) {
  if (language == null) return 'vi';
  final trimmed = language.trim();
  if (trimmed.isEmpty) return 'vi';
  final lower = trimmed.toLowerCase().replaceAll('_', '-');
  if (lower == 'tiếng việt' || lower == 'tieng viet') return 'vi';
  if (lower == 'english') return 'en';
  if (lower == '日本語' || lower == 'japanese') return 'ja';
  final primary = lower.split('-').first;
  return primary.isEmpty ? 'vi' : primary;
}
String csCalendarCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'prev': 'Tháng trước', 'next': 'Tháng sau'};
  const en = {'prev': 'Previous month', 'next': 'Next month'};
  const ja = {'prev': '前の月', 'next': '次の月'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'ja' ? ja : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csCalendarHeading(int month, int year, String? language) {
  final code = csCalendarMonthLanguage(language);
  final safe = month < 0 ? 0 : (month > 11 ? 11 : month);
  final String title;
  if (code == 'en') {
    title = const ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][safe];
  } else if (code == 'ja') {
    title = '${safe + 1}月';
  } else {
    title = 'Tháng ${safe + 1}';
  }
  return '$title $year';
}
int csComboboxHighlight(int current, int count, bool down) {
  if (count <= 0) return 0;
  return down ? (current + 1 > count - 1 ? count - 1 : current + 1) : (current - 1 < 0 ? 0 : current - 1);
}

class CsCalendar extends StatefulWidget {
  const CsCalendar({super.key, required this.monthLabel, required this.year, required this.month, required this.selected, required this.onSelect, required this.dark, required this.highContrast, required this.compact, this.language, this.onChoose});
  final String monthLabel;
  final int year;
  final int month;
  final int? selected;
  final ValueChanged<int> onSelect;
  final ValueChanged<CsCalendarDate>? onChoose;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final String? language;

  @override
  State<CsCalendar> createState() => _CsCalendarState();
}

class _CsCalendarState extends State<CsCalendar> {
  late int viewYear;
  late int viewMonth;
  late int focusedDay;
  final dayNodes = List<FocusNode>.generate(31, (_) => FocusNode());

  @override
  void dispose() {
    for (var index = 0; index < dayNodes.length; index++) {
      CsFocusRegistry.disconnect('calendar-day-${index + 1}');
      dayNodes[index].dispose();
    }
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    viewYear = widget.year;
    viewMonth = widget.month;
    focusedDay = widget.selected ?? 1;
    for (var index = 0; index < dayNodes.length; index++) {
      final day = index + 1;
      final node = dayNodes[index];
      node.addListener(() {
        if (node.hasFocus) CsFocusRegistry.claim('calendar-day-$day', node.requestFocus);
      });
    }
  }

  @override
  void didUpdateWidget(CsCalendar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.year != widget.year) viewYear = widget.year;
    if (oldWidget.month != widget.month) viewMonth = widget.month;
    if (oldWidget.selected != widget.selected && widget.selected != null) focusedDay = widget.selected!;
  }

  KeyEventResult _key(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final String? key = switch (event.logicalKey) {
      LogicalKeyboardKey.arrowLeft => 'left',
      LogicalKeyboardKey.arrowRight => 'right',
      LogicalKeyboardKey.arrowUp => 'up',
      LogicalKeyboardKey.arrowDown => 'down',
      LogicalKeyboardKey.home => 'home',
      LogicalKeyboardKey.end => 'end',
      LogicalKeyboardKey.pageUp => 'pageUp',
      LogicalKeyboardKey.pageDown => 'pageDown',
      _ => null,
    };
    if (key == null) return KeyEventResult.ignored;
    final shift = HardwareKeyboard.instance.isShiftPressed;
    final count = csCalendarDays(viewYear, viewMonth);
    final active = focusedDay < count ? focusedDay : count;
    final next = csCalendarFocus(viewYear, viewMonth, active, key, shift: shift);
    final landed = next.day;
    setState(() {
      viewYear = next.year;
      viewMonth = next.month;
      focusedDay = next.day;
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final index = landed - 1;
      if (index >= 0 && index < dayNodes.length) dayNodes[index].requestFocus();
    });
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final spoken = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final now = DateTime.now();
    final count = csCalendarDays(viewYear, viewMonth);
    final active = focusedDay < count ? focusedDay : count;
    return Focus(
      onKeyEvent: _key,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Semantics(
            label: csCalendarCopy('prev', spoken),
            button: true,
            child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () {
              claim();
              final next = csCalendarShift(viewYear, viewMonth, -1);
              setState(() { viewYear = next.$1; viewMonth = next.$2; });
            }, child: const Text('‹'))),
          ),
          Text(csCalendarHeading(viewMonth, viewYear, spoken), style: TextStyle(color: csColor(pack.colorTextPrimary))),
          Semantics(
            label: csCalendarCopy('next', spoken),
            button: true,
            child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () {
              claim();
              final next = csCalendarShift(viewYear, viewMonth, 1);
              setState(() { viewYear = next.$1; viewMonth = next.$2; });
            }, child: const Text('›'))),
          ),
        ]),
        for (final day in csCalendarGrid(viewYear, viewMonth))
          if (day != null)
            Focus(
              focusNode: dayNodes[day - 1],
              canRequestFocus: csCalendarTabStop(day, focusedDay, count) == 0,
              skipTraversal: csCalendarTabStop(day, focusedDay, count) != 0,
              child: Semantics(
              label: csCalendarDayName(viewYear, viewMonth, day, widget.language),
              value: csCalendarCurrent(viewYear, viewMonth, day, now.year, now.month - 1, now.day) ? 'date' : '',
              selected: widget.selected == day,
              button: true,
              child: TextButton(
                onPressed: () {
                  CsFocusRegistry.claim('calendar-day-$day', dayNodes[day - 1].requestFocus);
                  setState(() => focusedDay = day);
                  widget.onSelect(day);
                  widget.onChoose?.call(CsCalendarDate(viewYear, viewMonth, day));
                },
                child: Text('$day', style: TextStyle(color: csColor(widget.selected == day ? pack.colorBrandOchre : pack.colorTextPrimary), fontWeight: day == active ? FontWeight.bold : FontWeight.normal)),
              ),
            ),
            ),
      ]),
    );
  }
}

class CsCombobox extends StatefulWidget {
  const CsCombobox({super.key, required this.label, required this.options, required this.query, required this.highlight, required this.onQuery, required this.onSelect, required this.dark, required this.highContrast, required this.compact, this.onHighlight, this.value, this.disabled = false, this.description, this.error, this.required = false, this.language, this.placeholder});
  final String label;
  final List<CsComboboxOption> options;
  final String query;
  final int highlight;
  final ValueChanged<String> onQuery;
  final ValueChanged<String> onSelect;
  final ValueChanged<int>? onHighlight;
  final String? value;
  final bool disabled;
  final String? description;
  final String? error;
  final bool required;
  final String? language;
  final String? placeholder;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsCombobox> createState() => _CsComboboxState();
}

class _CsComboboxState extends State<CsCombobox> {
  var listOpen = false;
  var blurToken = 0;
  var optionDown = false;
  var panelHeight = 0.0;
  final fieldKey = GlobalKey();
  final fieldController = TextEditingController();
  final listKey = GlobalKey();
  late final listId = 'combobox-${identityHashCode(this)}-list';
  OverlayEntry? portal;
  String? spoken;
  var portalOn = false;
  var portalLeft = 0.0;
  var portalTop = 0.0;
  var portalWidth = 0.0;

  void pickOption(CsComboboxOption option) {
    if (widget.disabled || optionDown || !listOpen) return;
    optionDown = true;
    setState(() => listOpen = false);
    widget.onSelect(option.value);
    widget.onQuery('');
    optionDown = false;
  }

  bool get composing => csComboboxComposing(fieldController.value.composing);

  void syncFieldText(String shownText) {
    if (composing || fieldController.text == shownText) return;
    fieldController.value = TextEditingValue(text: shownText, selection: TextSelection.collapsed(offset: shownText.length));
  }

  @override
  void dispose() {
    fieldController.dispose();
    portal?.remove();
    portal = null;
    super.dispose();
  }

  void syncPortal() {
    if (CsFormAncestor.of(context) || !csComboboxAllowsOpen(listOpen, widget.disabled) || portalWidth <= 0) {
      portal?.remove();
      portal = null;
      portalOn = false;
      return;
    }
    final overlay = Overlay.maybeOf(context);
    if (overlay == null) return;
    portal ??= OverlayEntry(builder: (context) {
      final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
      final shown = csComboboxShownOptions(widget.options, widget.query);
      return Positioned(left: portalLeft, top: portalTop, width: portalWidth, child: Material(type: MaterialType.transparency, child: comboboxList(shown, pack)));
    });
    if (!portalOn) {
      overlay.insert(portal!);
      portalOn = true;
    } else {
      portal!.markNeedsBuild();
    }
  }

  Widget comboboxList(List<CsComboboxOption> shown, pack) {
    return Semantics(container: true, explicitChildNodes: true, label: csComboboxListName(widget.label, null, csComboboxCopy('label', spoken)) ?? '', identifier: listId, hint: 'list', child: Column(key: listKey, crossAxisAlignment: CrossAxisAlignment.start, children: [
      for (var index = 0; index < shown.length; index++)
        Semantics(selected: widget.value == shown[index].value, identifier: '${widget.label}-$index', child: MouseRegion(onEnter: (_) => widget.onHighlight?.call(index), child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTapDown: (_) => pickOption(shown[index]),
          child: SizedBox(width: double.infinity, height: 44, child: Align(alignment: Alignment.centerLeft, child: Text(shown[index].label, style: TextStyle(color: csColor(index == widget.highlight ? pack.colorBrandOchre : pack.colorTextPrimary))))),
        ))),
      if (csComboboxEmptyText(shown.length, csComboboxCopy('empty', spoken)) case final empty?) Semantics(liveRegion: true, child: Text(empty, style: TextStyle(color: csColor(pack.colorTextMuted)))),
    ]));
  }

  @override
  Widget build(BuildContext context) {
    spoken = csComboboxResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final shown = csComboboxShownOptions(widget.options, widget.query);
    final open = csComboboxAllowsOpen(listOpen, widget.disabled);
    syncFieldText(csComboboxDisplayValue(open, widget.query, widget.value, widget.options));
    if (widget.disabled && listOpen) listOpen = false;
    final fieldBox = fieldKey.currentContext?.findRenderObject() as RenderBox?;
    final fieldSize = fieldBox?.hasSize == true ? fieldBox!.size : Size.zero;
    final fieldOrigin = fieldBox?.hasSize == true ? fieldBox!.localToGlobal(Offset.zero) : Offset.zero;
    final screen = MediaQuery.sizeOf(context);
    final viewportWidth = screen.width - 16;
    final matched = fieldSize.width <= 0 ? 0.0 : (fieldSize.width < viewportWidth ? fieldSize.width : viewportWidth);
    final anchor = CsFloatingRect(fieldOrigin.dx, fieldOrigin.dy, fieldOrigin.dx + fieldSize.width, fieldOrigin.dy + fieldSize.height, fieldSize.width, fieldSize.height);
    final viewport = CsFloatingRect(8, 8, screen.width - 8, screen.height - 8, screen.width, screen.height);
    final placed = fieldSize.width <= 0 || panelHeight <= 0 ? null : csFloatingPlace(anchor, matched, panelHeight, viewport, placement: 'bottom-start', gap: 6);
    final panelWidth = placed == null ? matched : (placed.maxWidth < matched ? placed.maxWidth : matched);
    final inForm = CsFormAncestor.of(context);
    final inlineLeft = placed == null ? 0.0 : placed.left - fieldOrigin.dx;
    final inlineTop = placed == null ? fieldSize.height + 6 : placed.top - fieldOrigin.dy;
    portalLeft = placed?.left ?? fieldOrigin.dx;
    portalTop = placed?.top ?? fieldOrigin.dy + fieldSize.height + 6;
    portalWidth = panelWidth;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      syncPortal();
      final listBox = listKey.currentContext?.findRenderObject() as RenderBox?;
      if (listBox == null || !listBox.hasSize) return;
      if ((listBox.size.height - panelHeight).abs() > 0.5) setState(() => panelHeight = listBox.size.height);
    });
    return TapRegion(
      onTapOutside: open ? (_) { setState(() => listOpen = false); } : null,
      child: Focus(
      onKeyEvent: (node, event) {
        if (widget.disabled || composing || event is! KeyDownEvent) return KeyEventResult.ignored;
        if (event.logicalKey == LogicalKeyboardKey.escape) {
          setState(() => listOpen = false);
          return KeyEventResult.handled;
        }
        final down = event.logicalKey == LogicalKeyboardKey.arrowDown;
        if (!down && event.logicalKey != LogicalKeyboardKey.arrowUp) return KeyEventResult.ignored;
        if (down) setState(() => listOpen = true);
        widget.onHighlight?.call(csComboboxHighlight(widget.highlight, shown.length, down));
        return KeyEventResult.handled;
      },
      onFocusChange: (hasFocus) {
        if (hasFocus && !widget.disabled) {
          setState(() { blurToken += 1; listOpen = true; });
          widget.onHighlight?.call(0);
        } else {
          final token = blurToken;
          Future.microtask(() { if (mounted && token == blurToken) setState(() => listOpen = false); });
        }
      },
      child: Stack(clipBehavior: Clip.none, children: [
      Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
      KeyedSubtree(key: fieldKey, child: Stack(children: [CsOwnFocus(builder: (node, claim) => Semantics(textField: true, expanded: open, hint: open && widget.highlight >= 0 && widget.highlight < shown.length ? shown[widget.highlight].label : null, child: TextField(
        focusNode: node,
        enabled: !widget.disabled,
        controller: fieldController,
        decoration: InputDecoration(labelText: widget.label, hintText: csComboboxPlaceholder(widget.placeholder, csComboboxCopy('placeholder', spoken))),
        onChanged: (next) { if (widget.disabled) return; claim(); setState(() => listOpen = true); widget.onQuery(next); widget.onHighlight?.call(0); },
        onTap: () { if (widget.disabled) return; setState(() { blurToken += 1; listOpen = true; }); widget.onHighlight?.call(0); },
        onSubmitted: (_) {
          claim();
          if (composing || !listOpen || widget.highlight < 0 || widget.highlight >= shown.length) return;
          setState(() => listOpen = false);
          widget.onSelect(shown[widget.highlight].value);
          widget.onQuery('');
        },
      ))),
      Positioned(right: 10, top: 0, bottom: 0, child: IgnorePointer(child: ExcludeSemantics(child: Align(alignment: Alignment.centerRight, child: Text(csComboboxCaret, style: TextStyle(color: csColor(pack.colorTextMuted))))))),
    ]))
      if (csComboboxMessage(widget.description)) Text(widget.description!, style: TextStyle(color: csColor(pack.colorTextMuted))),
      if (csComboboxMessage(widget.error)) Text(widget.error!, style: TextStyle(color: csColor(pack.colorSemanticDangerText))),
      ]),
      if (inForm && open && fieldSize.width > 0) Positioned(left: inlineLeft, top: inlineTop, width: panelWidth, child: comboboxList(shown, pack)),
    ]),
    ),
    );
  }
}

const csAlertConfirm = 'Confirm';
const csAlertCancel = 'Cancel';
bool csAlertOpen(bool? open, bool internalOpen) => open ?? internalOpen;
bool csAlertDestructive(String? tone, String? variant) => (tone ?? variant) == 'destructive';
String csAlertLabel(String? label, String fallback) => label ?? fallback;
String csAlertCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'confirm': 'Xác nhận', 'cancel': 'Hủy'};
  const en = {'confirm': csAlertConfirm, 'cancel': csAlertCancel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool csAlertHasDescription(String? description, String? children) => (description ?? children)?.isNotEmpty == true;
String csAlertInitialFocus(bool destructive) => destructive ? 'cancel' : 'confirm';
List<String> csAlertDismiss() => const ['open-false', 'cancel'];
List<String> csAlertConfirmOrder() => const ['open-false', 'confirm'];

class CsAlertDialog extends StatefulWidget {
  const CsAlertDialog({super.key, required this.title, required this.message, this.confirmLabel, this.cancelLabel, required this.onConfirm, required this.onCancel, required this.onOpenChange, required this.dark, required this.highContrast, required this.compact, this.destructive = false, this.language});
  final String title;
  final String message;
  final String? confirmLabel;
  final String? cancelLabel;
  final String? language;
  final VoidCallback onConfirm;
  final VoidCallback onCancel;
  final ValueChanged<bool> onOpenChange;
  final bool destructive;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsAlertDialog> createState() => _CsAlertDialogState();
}

class _CsAlertDialogState extends State<CsAlertDialog> {
  final cancelNode = FocusNode();
  final confirmNode = FocusNode();
  final layerId = csOverlayFreshId('alert');
  late int trap = widget.destructive ? 0 : 1;
  String? restoreId;

  @override
  void initState() {
    super.initState();
    restoreId = CsFocusRegistry.activeId;
    CsOverlayRegistry.push(layerId);
    cancelNode.addListener(() {
      if (cancelNode.hasFocus) CsFocusRegistry.claim('alert-cancel-$layerId', cancelNode.requestFocus);
    });
    confirmNode.addListener(() {
      if (confirmNode.hasFocus) CsFocusRegistry.claim('alert-confirm-$layerId', confirmNode.requestFocus);
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      (trap == 0 ? cancelNode : confirmNode).requestFocus();
    });
  }

  @override
  void dispose() {
    CsOverlayRegistry.remove(layerId);
    cancelNode.dispose();
    confirmNode.dispose();
    super.dispose();
  }

  KeyEventResult _tab(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent || event.logicalKey != LogicalKeyboardKey.tab) return KeyEventResult.ignored;
    final stack = CsOverlayRegistry.resolved(layerId, [CsOverlayLayer(layerId, 'modal', true)]);
    if (!csOverlayOwns(layerId, stack)) return KeyEventResult.ignored;
    final next = csFocusNext(trap, 2, HardwareKeyboard.instance.isShiftPressed, true);
    if (next == null) return KeyEventResult.ignored;
    setState(() => trap = next);
    (next == 0 ? cancelNode : confirmNode).requestFocus();
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    return Focus(
      onKeyEvent: _tab,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(widget.title, style: TextStyle(color: csColor(pack.colorTextPrimary))),
        Text(widget.message, style: TextStyle(color: csColor(pack.colorTextMuted))),
        TextButton(focusNode: cancelNode, onPressed: () { CsFocusRegistry.claim('alert-cancel-$layerId', cancelNode.requestFocus); widget.onOpenChange(false); widget.onCancel(); csReturnFocus(restoreId, null, layerId, CsOverlayRegistry.resolved(layerId, [CsOverlayLayer(layerId, 'modal', true)])); }, child: Text(csAlertLabel(widget.cancelLabel, csAlertCopy('cancel', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)))))),
        TextButton(focusNode: confirmNode, onPressed: () { CsFocusRegistry.claim('alert-confirm-$layerId', confirmNode.requestFocus); widget.onOpenChange(false); widget.onConfirm(); csReturnFocus(restoreId, null, layerId, CsOverlayRegistry.resolved(layerId, [CsOverlayLayer(layerId, 'modal', true)])); }, child: Text(csAlertLabel(widget.confirmLabel, csAlertCopy('confirm', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)))), style: TextStyle(color: csColor(widget.destructive ? pack.colorSemanticDanger : pack.colorBrandOchre)))),
      ]),
    );
  }
}

const csPopoverPanel = 'Details';
const csPopoverGap = 8.0;
bool csPopoverOpen(bool? controlled, bool internalOpen) => controlled ?? internalOpen;
String csPopoverPlacement(String? placement, String align) => placement ?? (align == 'end' ? 'bottom-end' : 'bottom-start');
String? csPopoverLabel(String? ariaLabel, bool hasLabelledBy, String fallback) => ariaLabel ?? (hasLabelledBy ? null : fallback);
String csPopoverCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'panel': 'Chi tiết'};
  const en = {'panel': csPopoverPanel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool? csPopoverToggle(bool open, bool defaultPrevented) => defaultPrevented ? null : !open;
bool csPopoverDismissOutside(bool open, bool inside) => open && !inside;

class CsPopover extends StatefulWidget {
  const CsPopover({super.key, required this.label, required this.open, required this.onOpenChange, required this.dark, required this.highContrast, required this.compact, required this.child, this.ariaLabel, this.hasLabelledBy = false, this.language, this.align = 'start'});
  final String label;
  final String? ariaLabel;
  final bool hasLabelledBy;
  final String? language;
  final bool open;
  final ValueChanged<bool> onOpenChange;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final Widget child;
  final String align;

  @override
  State<CsPopover> createState() => _CsPopoverState();
}

class _CsPopoverState extends State<CsPopover> {
  final triggerKey = GlobalKey();
  final panelKey = GlobalKey();
  Size? natural;
  Size? fitted;
  Offset? layoutOrigin;
  Offset panelScale = const Offset(1, 1);
  Offset applied = Offset.zero;
  var measureTries = 0;

  void _measure() {
    if (!mounted || !widget.open) return;
    final menu = panelKey.currentContext?.findRenderObject() as RenderBox?;
    if (menu == null || menu.size.width <= 0 || menu.size.height <= 0) {
      if (measureTries < 3) {
        measureTries += 1;
        WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
      }
      return;
    }
    final visual = menu.localToGlobal(Offset.zero);
    final far = menu.localToGlobal(Offset(menu.size.width, menu.size.height));
    final span = far - visual;
    final scaleX = menu.size.width == 0 || span.dx == 0 ? 1.0 : span.dx / menu.size.width;
    final scaleY = menu.size.height == 0 || span.dy == 0 ? 1.0 : span.dy / menu.size.height;
    final origin = visual - Offset(applied.dx * scaleX, applied.dy * scaleY);
    if (natural == null) {
      setState(() {
        natural = menu.size;
        layoutOrigin = origin;
        panelScale = Offset(scaleX, scaleY);
      });
      WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
      return;
    }
    final next = menu.size;
    if (fitted == null || next.width != fitted!.width || next.height != fitted!.height || layoutOrigin != origin) {
      setState(() {
        fitted = next;
        layoutOrigin = origin;
        panelScale = Offset(scaleX, scaleY);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.open && (natural != null || fitted != null || applied != Offset.zero)) {
      natural = null;
      fitted = null;
      layoutOrigin = null;
      panelScale = const Offset(1, 1);
      applied = Offset.zero;
      measureTries = 0;
    }
    if (widget.open && fitted == null) WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
    final box = triggerKey.currentContext?.findRenderObject() as RenderBox?;
    final origin = box?.localToGlobal(Offset.zero) ?? Offset.zero;
    final screen = MediaQuery.sizeOf(context);
    final viewport = CsFloatingRect(8, 8, screen.width - 8, screen.height - 8, screen.width, screen.height);
    final anchor = box == null ? null : CsFloatingRect(origin.dx, origin.dy, origin.dx + box.size.width, origin.dy + box.size.height, box.size.width, box.size.height);
    final side = csPopoverPlacement(null, widget.align);
    final initial = anchor == null || natural == null ? null : csFloatingPlace(anchor, natural!.width, natural!.height, viewport, placement: side, gap: csPopoverGap);
    final placed = anchor == null || fitted == null || initial == null ? null : csFloatingPlace(anchor, fitted!.width, fitted!.height, viewport, placement: initial.placement, gap: csPopoverGap);
    final desired = placed == null || layoutOrigin == null ? Offset.zero : Offset((placed.left - layoutOrigin!.dx) / (panelScale.dx == 0 ? 1 : panelScale.dx), (placed.top - layoutOrigin!.dy) / (panelScale.dy == 0 ? 1 : panelScale.dy));
    if (placed != null && (desired - applied).distance > 0.5) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) setState(() => applied = desired); });
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      CsOwnFocus(builder: (node, claim) => TextButton(key: triggerKey, focusNode: node, onPressed: () { claim(); widget.onOpenChange(!widget.open); }, child: Text(widget.label))),
      if (widget.open) Transform.translate(
        offset: applied,
        child: Opacity(
        opacity: placed == null ? 0 : 1,
        child: ConstrainedBox(
          key: panelKey,
          constraints: BoxConstraints(maxWidth: initial?.maxWidth ?? placed?.maxWidth ?? double.infinity, maxHeight: initial?.maxHeight ?? placed?.maxHeight ?? double.infinity),
          child: Semantics(container: true, explicitChildNodes: true, label: csPopoverLabel(widget.ariaLabel, widget.hasLabelledBy, csPopoverCopy('panel', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)))), child: widget.child),
        ),
      ),
      ),
    ]);
  }
}

class CsList extends StatelessWidget {
  const CsList({super.key, required this.items, required this.dark, required this.highContrast, required this.compact});
  final List<(String, String)> items;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      for (final item in items) ...[
        Text(item.$1, style: TextStyle(color: csColor(pack.colorTextPrimary))),
        if (item.$2.isNotEmpty) Text(item.$2, style: TextStyle(color: csColor(pack.colorTextMuted))),
      ],
    ]);
  }
}

class CsComment extends StatelessWidget {
  const CsComment({super.key, required this.author, required this.meta, required this.bodyText, required this.dark, required this.highContrast, required this.compact, this.actions = const [], this.replies, this.language});
  final String author;
  final String meta;
  final String bodyText;
  final List<String> actions;
  final String? replies;
  final String? language;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(author, style: TextStyle(color: csColor(pack.colorTextPrimary))),
      if (csCommentShows(meta)) Text(meta, style: TextStyle(color: csColor(pack.colorTextMuted))),
      Text(bodyText, style: TextStyle(color: csColor(pack.colorTextPrimary))),
      Wrap(children: [for (final label in csCommentReplyActions(actions, csCommentCopy('reply', csSelectResolvedLanguage(language, CsLanguageScope.of(context))))) CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: claim, child: Text(label)))]),
      if (csCommentShows(replies)) Text(replies!, style: TextStyle(color: csColor(pack.colorTextMuted))),
    ]);
  }
}

const csCodeLabel = 'code';
const csCodeCopy = 'Copy';
const csCodeCopied = 'Copied ✓';
String csCodeText(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'code': 'mã', 'copy': 'Sao chép', 'copied': 'Đã sao chép ✓'};
  const en = {'code': csCodeLabel, 'copy': csCodeCopy, 'copied': csCodeCopied};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
const csCodeCopiedMs = 1400;
const csCommentReply = 'Reply';
bool csCommentShows(String? value) => value != null && value.isNotEmpty;
List<String> csCommentReplyActions(List<String>? labels, String fallback) => labels == null || labels.isEmpty ? [fallback] : labels;
String csCommentCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'reply': 'Trả lời'};
  const en = {'reply': csCommentReply};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csCodeBarLabel(String? filename, String? language, String fallback) => filename != null && filename.isNotEmpty ? filename : (language ?? fallback);
String csCodeButton(bool copied, String copy, String copiedLabel) => copied ? copiedLabel : copy;
int csCodeBegin(int attempt) => attempt + 1;
bool csCodeSucceeded(int current, int attempt, bool wrote) => wrote && current == attempt;
class CsCodeBlock extends StatefulWidget {
  const CsCodeBlock({super.key, this.filename, required this.code, required this.dark, required this.highContrast, required this.compact, this.language, this.showBar = true, this.lang});
  final String? filename;
  final String? language;
  final bool showBar;
  final String? lang;
  final String code;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsCodeBlock> createState() => _CsCodeBlockState();
}

class _CsCodeBlockState extends State<CsCodeBlock> {
  var attempt = 0;
  var copied = false;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final spoken = csSelectResolvedLanguage(widget.lang, CsLanguageScope.of(context));
    final title = csCodeBarLabel(widget.filename, widget.language, csCodeText('code', spoken));
    final copyLabel = csCodeButton(copied, csCodeText('copy', spoken), csCodeText('copied', spoken));
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (widget.showBar) Row(children: [
        Expanded(child: Text(title, style: TextStyle(color: csColor(pack.colorTextMuted)))),
        CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () {
          claim();
          setState(() { attempt = csCodeBegin(attempt); copied = false; });
        }, child: Text(copyLabel))),
      ]),
      Text(widget.code, style: TextStyle(fontFamily: 'monospace', color: csColor(pack.colorTextPrimary))),
    ]);
  }
}

class CsSidebar extends StatelessWidget {
  const CsSidebar({super.key, required this.label, required this.items, required this.active, required this.onSelect, required this.dark, required this.highContrast, required this.compact});
  final String label;
  final List<String> items;
  final String active;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Semantics(
      label: label,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        for (final item in items)
          CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); onSelect(item); }, child: Text(item, style: TextStyle(color: csColor(item == active ? pack.colorBrandOchre : pack.colorTextPrimary))))),
      ]),
    );
  }
}
