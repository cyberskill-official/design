import 'package:flutter/material.dart';

import 'controls.dart';
import 'surfaces.dart';
import 'icon_paths.dart';
import 'primitives.dart';

class CsPageToken {
  const CsPageToken.page(this.number) : ellipsis = false;
  const CsPageToken.ellipsis() : number = null, ellipsis = true;
  final int? number;
  final bool ellipsis;
}

List<CsPageToken> csPaginationTokens(int page, int count) {
  if (count <= 7) {
    return [for (var number = 1; number <= (count < 0 ? 0 : count); number++) CsPageToken.page(number)];
  }
  final out = <CsPageToken>[CsPageToken.page(1)];
  final lo = page - 1 < 2 ? 2 : page - 1;
  final hi = page + 1 > count - 1 ? count - 1 : page + 1;
  if (lo > 2) out.add(const CsPageToken.ellipsis());
  if (lo <= hi) {
    for (var number = lo; number <= hi; number++) {
      out.add(CsPageToken.page(number));
    }
  }
  if (hi < count - 1) out.add(const CsPageToken.ellipsis());
  out.add(CsPageToken.page(count));
  return out;
}
const csPaginationPrevious = 'Previous page';
const csPaginationNext = 'Next page';
const csPaginationLabel = 'Pagination';
String csPaginationCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Phân trang', 'prev': 'Trang trước', 'next': 'Trang sau'};
  const en = {'label': 'Pagination', 'prev': csPaginationPrevious, 'next': csPaginationNext};
  const ja = {'label': 'ページネーション', 'prev': '前のページ', 'next': '次のページ'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : locale == 'ja' ? ja : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
int? csPaginationDestination(int page, int target, int count, bool hasHandler) => hasHandler && target >= 1 && target <= count && target != page ? target : null;
bool csPaginationCurrent(int number, int page) => number == page;

double csClampNumber(double value, double? lower, double? upper) {
  var number = value;
  if (lower != null && number < lower) number = lower;
  if (upper != null && number > upper) number = upper;
  return number;
}

int csRenderCount(double value, int fallback, {int minimum = 0}) {
  if (!value.isFinite || value >= 4294967296) return fallback;
  final truncated = value.truncate();
  return truncated < minimum ? minimum : truncated;
}

int csRatingCommit(int current, int tapped) => tapped == current ? 0 : tapped;
const csRatingLabel = 'Rating';
int csRatingValue(int? controlled, int inner) => controlled ?? inner;
String? csRatingGroupName(String? label, int value, int max, String? explicit, bool hasLabelledBy, [String word = csRatingLabel]) {
  if (explicit != null) return explicit;
  if (hasLabelledBy) return null;
  if (label == null) return '$word: $value / $max';
  if (label.isEmpty) return ': $value / $max';
  return '$label: $value / $max';
}
String csRatingCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Đánh giá'};
  const en = {'label': csRatingLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csRatingStar(int index, int max) => '$index / $max';
int csRatingFocus(int value, int max) => value > 0 ? (value < max ? value : max) - 1 : 0;
int csRatingStop(int index, int focus, bool readOnly) => readOnly ? -1 : (index == focus ? 0 : -1);

enum CsStepState { done, active, todo }

CsStepState csStepState(int index, int current) {
  if (index < current) return CsStepState.done;
  if (index == current) return CsStepState.active;
  return CsStepState.todo;
}

String csStepMarker(CsStepState state, int index, int? number) => state == CsStepState.done ? '✓' : (number ?? index + 1).toString();
bool csStepCurrent(CsStepState state) => state == CsStepState.active;
const csStepLabel = 'Steps';
String csStepListName(String? explicit, String fallback) => fallback;
String csStepCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Các bước'};
  const en = {'label': csStepLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csStepListName(String? explicit, String fallback) => fallback;
String? csStepCurrentValue(CsStepState state) => state == CsStepState.active ? 'step' : null;
bool csStepShowsBody(String? body) => body != null;

List<int> csAccordionInitial(int? defaultOpen) => defaultOpen != null && defaultOpen >= 0 ? [defaultOpen] : <int>[];
bool csAccordionPanel(List<int> open, int index, bool allowMultiple) => allowMultiple ? open.contains(index) : open.isNotEmpty && open.first == index;
List<int> csAccordionCollapse(List<int> open, bool allowMultiple) => allowMultiple || open.length <= 1 ? open : open.sublist(0, 1);
List<int> csAccordionToggle(List<int> open, int index, bool allowMultiple) {
  if (allowMultiple) {
    return open.contains(index) ? open.where((item) => item != index).toList() : [...open, index];
  }
  return open.isNotEmpty && open.first == index ? <int>[] : <int>[index];
}

const csTextareaRows = 4;
const csTextareaMinHeight = 96.0;
bool csTextareaShows(String? value) => value != null && value.isNotEmpty;
String? csTextareaDescribedBy(List<String?> parts) {
  final seen = <String>[];
  for (final part in parts) {
    if (part == null || part.isEmpty) continue;
    for (final token in part.trim().split(RegExp(r'\s+')).where((token) => token.isNotEmpty)) {
      if (!seen.contains(token)) seen.add(token);
    }
  }
  return seen.isEmpty ? null : seen.join(' ');
}

class CsTextarea extends StatelessWidget {
  const CsTextarea({super.key, required this.label, required this.value, required this.onChanged, required this.dark, required this.highContrast, required this.compact, this.rows = 4});
  final String label;
  final String value;
  final ValueChanged<String> onChanged;
  final int rows;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return CsOwnFocus(builder: (node, claim) => TextField(
      focusNode: node,
      controller: TextEditingController(text: value),
      onChanged: (next) { claim(); onChanged(next); },
      minLines: rows,
      maxLines: rows,
      style: TextStyle(color: csColor(pack.colorTextPrimary)),
      decoration: InputDecoration(
        labelText: csTextareaShows(label) ? label : null,
        filled: true,
        fillColor: csColor(pack.colorSurfacePanel),
        constraints: const BoxConstraints(minHeight: csTextareaMinHeight),
      ),
    ));
  }
}

const csSearchPlaceholder = 'Search…';
const csSearchClear = 'Clear search';
const csSearchIconRadius = 7.0;
const csSearchIconLine = 'M21 21l-4.3-4.3';
String csSearchText(String? value, String inner) => value ?? inner;
String csSearchInitial(String? defaultValue) => defaultValue ?? '';
String csSearchPlaceholderText(String? placeholder, String fallback) => placeholder ?? fallback;
String csSearchClearText(String? label, String fallback) => label ?? fallback;
String csSearchCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'placeholder': 'Tìm kiếm…', 'clear': 'Xóa tìm kiếm'};
  const en = {'placeholder': csSearchPlaceholder, 'clear': csSearchClear};
  const ja = {'placeholder': '検索…', 'clear': '検索をクリア'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'ja' ? ja : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool csSearchShowsClear(String value) => value.isNotEmpty;
bool csSearchCanEdit(bool disabled, bool readOnly) => !disabled && !readOnly;
String? csSearchCommit(String current, String next, bool disabled, bool readOnly) => csSearchCanEdit(disabled, readOnly) ? next : null;
String? csSearchSpoken(String? ariaLabel, bool hasLabelledBy, String placeholder) => ariaLabel != null && ariaLabel.isNotEmpty ? ariaLabel : (hasLabelledBy ? null : placeholder);

class CsSearchField extends StatelessWidget {
  const CsSearchField({super.key, this.label, required this.value, required this.onChanged, required this.dark, required this.highContrast, required this.compact, this.placeholder, this.clearLabel, this.ariaLabel, this.hasLabelledBy = false, this.disabled = false, this.readOnly = false, this.language});
  final String? label;
  final String? placeholder;
  final String? clearLabel;
  final String? ariaLabel;
  final bool hasLabelledBy;
  final String? language;
  final String value;
  final ValueChanged<String> onChanged;
  final bool disabled;
  final bool readOnly;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final hint = csSearchPlaceholderText(placeholder, csSearchCopy('placeholder', locale));
    final name = csSearchSpoken(ariaLabel ?? label, hasLabelledBy, hint) ?? '';
    final clearName = csSearchClearText(clearLabel, csSearchCopy('clear', locale));
    return CsOwnFocus(builder: (node, claim) => Semantics(label: name, textField: true, child: TextField(
      focusNode: node,
      enabled: csSearchCanEdit(disabled, readOnly),
      controller: TextEditingController(text: value),
      onChanged: (next) { claim(); if (csSearchCommit(value, next, disabled, readOnly) != null) onChanged(next); },
      decoration: InputDecoration(
        hintText: hint.isEmpty ? null : hint,
        suffixIcon: csSearchShowsClear(value)
            ? CsOwnFocus(builder: (node, claim) => Semantics(label: clearName, button: true, child: IconButton(
                focusNode: node,
                onPressed: csSearchCommit(value, '', disabled, readOnly) == null ? null : () { claim(); onChanged(''); },
                constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
                icon: ExcludeSemantics(child: const Text('×')),
              )))
            : null,
      ),
      style: TextStyle(color: csColor(pack.colorTextPrimary)),
    )));
  }
}

const csNumberDecrease = 'Decrease';
const csNumberIncrease = 'Increase';
const csNumberValue = 'Value';
bool csNumberShowsLabel(String? label) => label != null && label.isNotEmpty;
String csNumberCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'decrease': 'Giảm', 'increase': 'Tăng', 'value': 'Giá trị'};
  const en = {'decrease': csNumberDecrease, 'increase': csNumberIncrease, 'value': csNumberValue};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool csNumberCanDecrease(bool disabled, String value, double? min) {
  if (disabled) return false;
  if (value == '' || min == null) return true;
  final number = double.tryParse(value);
  return number == null || number > min;
}
bool csNumberCanIncrease(bool disabled, String value, double? max) {
  if (disabled) return false;
  if (value == '' || max == null) return true;
  final number = double.tryParse(value);
  return number == null || number < max;
}
double? csNumberCommit(String raw) => raw == '' ? null : double.tryParse(raw);
double? csNumberBlurEmpty(bool uncontrolled, bool empty, double? min, double? max) => uncontrolled && empty ? csClampNumber(0, min, max) : null;

class CsNumberField extends StatelessWidget {
  const CsNumberField({super.key, this.label, required this.value, required this.onChanged, required this.dark, required this.highContrast, required this.compact, this.minimum, this.maximum, this.step = 1, this.disabled = false, this.language});
  final String? label;
  final bool disabled;
  final String? language;
  final double value;
  final ValueChanged<double> onChanged;
  final double? minimum;
  final double? maximum;
  final double step;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final shown = '$value';
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final down = csNumberCanDecrease(disabled, shown, minimum);
    final up = csNumberCanIncrease(disabled, shown, maximum);
    final downName = csNumberCopy('decrease', locale);
    final upName = csNumberCopy('increase', locale);
    final valueName = csNumberShowsLabel(label) ? label! : csNumberCopy('value', locale);
    return Semantics(label: valueName, value: shown, child: Row(
      children: [
        CsOwnFocus(builder: (node, claim) => Semantics(label: downName, button: true, child: IconButton(focusNode: node, onPressed: down ? () { claim(); onChanged(csClampNumber(value - step, minimum, maximum)); } : null, constraints: const BoxConstraints(minWidth: 44, minHeight: 44), icon: const ExcludeSemantics(child: Text('−'))))),
        if (csNumberShowsLabel(label)) ExcludeSemantics(child: Text(label!, style: TextStyle(color: csColor(pack.colorTextPrimary)))),
        Text(shown, style: TextStyle(color: csColor(pack.colorTextPrimary))),
        CsOwnFocus(builder: (node, claim) => Semantics(label: upName, button: true, child: IconButton(focusNode: node, onPressed: up ? () { claim(); onChanged(csClampNumber(value + step, minimum, maximum)); } : null, constraints: const BoxConstraints(minWidth: 44, minHeight: 44), icon: const ExcludeSemantics(child: Text('+'))))),
      ],
    ));
  }
}

class CsKbd extends StatelessWidget {
  const CsKbd(this.keys, {super.key, required this.dark, required this.highContrast, required this.compact});
  final String keys;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return DecoratedBox(
      decoration: BoxDecoration(border: Border.all(color: csColor(pack.colorBorderDefault)), borderRadius: BorderRadius.circular(4), color: csColor(pack.colorSurfacePanel)),
      child: Padding(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), child: Text(keys, style: TextStyle(fontFamily: 'monospace', color: csColor(pack.colorTextPrimary)))),
    );
  }
}

String csEmptyTitle(String? title, String fallback) => title ?? fallback;
String csEmptyCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'title': 'Chưa có gì ở đây', 'action': 'Tạo mục đầu tiên'};
  const en = {'title': 'Nothing here yet', 'action': 'Create your first item'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool csEmptyShows(String? value) => value != null && value.isNotEmpty;
bool csEmptyUsesDefaultIcon(String? icon) => icon == null;
const csEmptyTray = 'M3 8l2-4h14l2 4M3 8v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8h6l1 3h4l1-3h6';

class CsEmptyState extends StatelessWidget {
  const CsEmptyState({super.key, required this.dark, required this.highContrast, required this.compact, this.title, this.message, this.action, this.icon, this.fallbackTitle, this.language});
  final String? title;
  final String? message;
  final String? action;
  final String? icon;
  final String? fallbackTitle;
  final String? language;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Column(children: [
      if (csEmptyUsesDefaultIcon(icon))
        CustomPaint(size: const Size(26, 26), painter: _EmptyTrayPainter(csColor(pack.colorTextMuted)))
      else if (icon != null)
        CsIcon(name: icon!, dark: dark, highContrast: highContrast, compact: compact),
      Text(csEmptyTitle(title, fallbackTitle ?? csEmptyCopy('title', csSelectResolvedLanguage(language, CsLanguageScope.of(context)))), style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: csColor(pack.colorTextPrimary))),
      if (csEmptyShows(message)) Text(message!, style: TextStyle(color: csColor(pack.colorTextMuted))),
      if (csEmptyShows(action)) Text(action!, style: TextStyle(color: csColor(pack.colorBrandOchre))),
    ]);
  }
}

class _ResultMarkPainter extends CustomPainter {
  const _ResultMarkPainter(this.color, this.mark);
  final Color color;
  final String mark;
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.2
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    canvas.drawCircle(size.center(Offset.zero), 32, Paint()..color = color.withValues(alpha: 0.14));
    canvas.drawPath(csIconPathData(mark, 28), paint);
  }
  @override
  bool shouldRepaint(covariant _ResultMarkPainter oldDelegate) => oldDelegate.color != color || oldDelegate.mark != mark;
}

class _EmptyTrayPainter extends CustomPainter {
  const _EmptyTrayPainter(this.color);
  final Color color;
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.8
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    canvas.drawPath(csIconPathData(csEmptyTray, size.width), paint);
  }
  @override
  bool shouldRepaint(covariant _EmptyTrayPainter oldDelegate) => oldDelegate.color != color;
}

const csBreadcrumbLabel = 'Breadcrumb';
String csBreadcrumbHref(String? href) => href == null || href.isEmpty ? '#' : href;
bool csBreadcrumbCurrent(int index, int count) => count > 0 && index == count - 1;
bool csBreadcrumbSeparator(int index, int count) => count > 1 && index < count - 1;
String csBreadcrumbNavLabel(String? explicit, bool hasExplicit, String fallback) => hasExplicit ? (explicit ?? '') : fallback;
String csBreadcrumbCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Đường dẫn'};
  const en = {'label': csBreadcrumbLabel};
  const ja = {'label': 'パンくずリスト'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : locale == 'ja' ? ja : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}

class CsBreadcrumbItem {
  const CsBreadcrumbItem(this.label, {this.href = ''});
  final String label;
  final String href;
}

class CsBreadcrumb extends StatelessWidget {
  const CsBreadcrumb({super.key, this.label, required this.items, required this.dark, required this.highContrast, required this.compact, this.language});
  final String? label;
  final String? language;
  final List<CsBreadcrumbItem> items;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final navName = csBreadcrumbNavLabel(label, label != null, csBreadcrumbCopy('label', csSelectResolvedLanguage(language, CsLanguageScope.of(context))));
    return Semantics(
      label: navName,
      child: Wrap(
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          for (var index = 0; index < items.length; index++) ...[
            Text(items[index].label, style: TextStyle(color: csColor(index == items.length - 1 ? pack.colorTextPrimary : pack.colorBrandOchre))),
            if (index != items.length - 1) ExcludeSemantics(child: Text(' / ', style: TextStyle(color: csColor(pack.colorTextMuted)))),
          ],
        ],
      ),
    );
  }
}

class CsPagination extends StatelessWidget {
  const CsPagination({super.key, required this.page, required this.pageCount, this.label, this.previousLabel, this.nextLabel, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.language});
  final int page;
  final int pageCount;
  final String? label;
  final String? previousLabel;
  final String? nextLabel;
  final String? language;
  final ValueChanged<int> onChange;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final tokens = csPaginationTokens(page, pageCount);
    final spoken = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final navName = label ?? csPaginationCopy('label', spoken);
    final previousName = previousLabel ?? csPaginationCopy('prev', spoken);
    final nextName = nextLabel ?? csPaginationCopy('next', spoken);
    return Semantics(
      label: navName,
      child: Wrap(
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: page > 1 ? () { claim(); onChange(page - 1); } : null, child: Text(previousName))),
          for (final token in tokens)
            if (token.ellipsis)
              Text('…', style: TextStyle(color: csColor(pack.colorTextMuted)))
            else
              CsOwnFocus(builder: (node, claim) => TextButton(
                focusNode: node,
                onPressed: token.number == page ? null : () { claim(); onChange(token.number!); },
                child: Text('${token.number}', style: TextStyle(color: csColor(token.number == page ? pack.colorBrandOchre : pack.colorTextPrimary))),
              )),
          CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: page < pageCount ? () { claim(); onChange(page + 1); } : null, child: Text(nextName))),
        ],
      ),
    );
  }
}

class CsStepItem {
  const CsStepItem(this.title, {this.number, this.body});
  final String title;
  final int? number;
  final String? body;
}

class CsSteps extends StatelessWidget {
  const CsSteps({super.key, required this.label, required this.steps, required this.current, required this.dark, required this.highContrast, required this.compact, this.language});
  final String? language;
  final String label;
  final List<CsStepItem> steps;
  final int current;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Semantics(
      label: csStepListName(label, csStepCopy('label', csSelectResolvedLanguage(language, CsLanguageScope.of(context)))),
      child: Row(
        children: [
          for (var index = 0; index < steps.length; index++)
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: Column(
                children: [
                  Text(csStepMarker(csStepState(index, current), index, steps[index].number), style: TextStyle(color: csColor(csStepState(index, current) == CsStepState.todo ? pack.colorTextMuted : pack.colorBrandOchre))),
                  Text(steps[index].title, style: TextStyle(color: csColor(pack.colorTextPrimary))),
                  if (steps[index].body != null) Text(steps[index].body!, style: TextStyle(color: csColor(pack.colorTextMuted))),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

String csStatusKind(String name) => name == 'online' || name == 'busy' || name == 'error' ? name : 'offline';
bool csStatusPulses(bool pulse, bool reducedMotion) => pulse && !reducedMotion;
const csDescriptionColumnMin = 160.0;
String csDescriptionSpoken(String term) => term;
const csKbdPadX = 7.0;
String csKbdKeyFace(String text) => text;
const csButtonGroupOverlap = -1.0;
String? csButtonGroupLabel(String? label) => label;
enum CsStatusKind { online, busy, offline, error }

class CsStatusIndicator extends StatelessWidget {
  const CsStatusIndicator({super.key, required this.title, required this.dark, required this.highContrast, required this.compact, this.status = CsStatusKind.offline});
  final String title;
  final CsStatusKind status;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final color = switch (status) {
      CsStatusKind.online => pack.colorSemanticSuccess,
      CsStatusKind.busy => pack.colorBrandOchre,
      CsStatusKind.offline => pack.colorTextMuted,
      CsStatusKind.error => pack.colorSemanticDanger,
    };
    return Row(children: [
      Container(width: 8, height: 8, decoration: BoxDecoration(color: csColor(color), shape: BoxShape.circle)),
      const SizedBox(width: 8),
      Text(title, style: TextStyle(color: csColor(pack.colorTextPrimary))),
    ]);
  }
}

class CsRating extends StatelessWidget {
  const CsRating({super.key, this.label, required this.value, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.requestedMax = 5, this.readOnly = false, this.language});
  final String? label;
  final String? language;
  final int value;
  final ValueChanged<int> onChange;
  final double requestedMax;
  final bool readOnly;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final max = csRenderCount(requestedMax, 5);
    return Semantics(
      label: csRatingGroupName(label, value, max, null, false, csRatingCopy('label', csSelectResolvedLanguage(language, CsLanguageScope.of(context)))) ?? '',
      child: Row(
        children: [
          for (var star = 1; star <= max; star++)
            CsOwnFocus(builder: (node, claim) => IconButton(
              focusNode: node,
              onPressed: readOnly ? null : () { claim(); onChange(csRatingCommit(value, star)); },
              constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
              icon: Text(star <= value ? '★' : '☆', style: TextStyle(color: csColor(pack.colorBrandOchre))),
            )),
        ],
      ),
    );
  }
}

class CsSegmentedControl extends StatelessWidget {
  const CsSegmentedControl({super.key, required this.label, required this.options, required this.selection, required this.onSelect, required this.dark, required this.highContrast, required this.compact});
  final String label;
  final List<CsTabItem> options;
  final String selection;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Semantics(
      label: label,
      child: DecoratedBox(
        decoration: BoxDecoration(border: Border.all(color: csColor(pack.colorBorderDefault)), borderRadius: BorderRadius.circular(csPoints(pack.radiusMd))),
        child: Row(
          children: [
            for (final option in options)
              Expanded(
                child: ConstrainedBox(
                  constraints: BoxConstraints(minHeight: csPoints(pack.componentButtonMdMinHeight)),
                  child: CsOwnFocus(builder: (node, claim) => TextButton(
                    focusNode: node,
                    style: TextButton.styleFrom(backgroundColor: selection == option.value ? csColor(pack.colorBrandUmber) : null),
                    onPressed: () { claim(); onSelect(option.value); },
                    child: Text(option.label, style: TextStyle(color: csColor(selection == option.value ? pack.colorSurfacePage : pack.colorTextPrimary))),
                  )),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class CsDescriptionItem {
  const CsDescriptionItem(this.term, this.value);
  final String term;
  final String value;
}

class CsDescriptionList extends StatelessWidget {
  const CsDescriptionList({super.key, required this.items, required this.dark, required this.highContrast, required this.compact});
  final List<CsDescriptionItem> items;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Column(
      children: [
        for (final item in items)
          Row(children: [
            Expanded(child: Text(item.term, style: TextStyle(color: csColor(pack.colorTextMuted)))),
            Text(item.value, style: TextStyle(color: csColor(pack.colorTextPrimary))),
          ]),
      ],
    );
  }
}

class CsButtonGroup extends StatelessWidget {
  const CsButtonGroup({super.key, required this.label, required this.children});
  final String label;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Semantics(label: label, child: Row(children: children));
  }
}

const csAvatarOverlap = 10.0;
const csAvatarRing = 2.0;

class CsAvatarGroup extends StatelessWidget {
  const CsAvatarGroup({super.key, required this.names, required this.dark, required this.highContrast, required this.compact});
  final List<String> names;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Row(children: [
      for (var index = 0; index < names.length; index++)
        Padding(
          padding: EdgeInsets.only(left: index == 0 ? 0 : -csAvatarOverlap),
          child: DecoratedBox(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: csColor(pack.colorSurfacePanel), width: csAvatarRing),
            ),
            child: CsAvatar(name: names[index], size: 'sm', dark: dark, highContrast: highContrast, compact: compact),
          ),
        ),
    ]);
  }
}

enum CsResultStatus { info, success, warning, error }
String csResultCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'success': 'Hoàn tất', 'error': 'Chúng tôi chưa hoàn tất được', 'warning': 'Vui lòng kiểm tra', 'info': 'Đây là điều đã xảy ra'};
  const en = {'success': 'Done', 'error': "We couldn't complete that", 'warning': 'Please check', 'info': "Here's what happened"};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csResultTitle(String? title, String status, [String? language]) => title ?? csResultCopy(status, language);
String csResultFallback(String status) => csResultCopy(status, 'en');
String csResultIcon(String status) => status == 'success' || status == 'error' || status == 'warning' || status == 'info' ? status : 'info';
bool csResultShows(String? value) => value != null && value.isNotEmpty;
String csResultMark(String status) {
  switch (csResultIcon(status)) {
    case 'success':
      return 'M4 12.5l5 5 11-11';
    case 'error':
      return 'M6 6l12 12M18 6L6 18';
    case 'warning':
      return 'M12 3l10 18H2zM12 10v5M12 18.2v.1';
    default:
      return 'M12 11v6M12 7.2v.1';
  }
}

class CsResult extends StatelessWidget {
  const CsResult({super.key, required this.message, required this.dark, required this.highContrast, required this.compact, this.title, this.status = CsResultStatus.info, this.language});
  final String? title;
  final String? language;
  final String message;
  final CsResultStatus status;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final name = switch (status) {
      CsResultStatus.info => 'info',
      CsResultStatus.success => 'success',
      CsResultStatus.warning => 'warning',
      CsResultStatus.error => 'error',
    };
    final tone = switch (name) {
      'success' => pack.colorSemanticSuccessText,
      'error' => pack.colorSemanticDangerText,
      'warning' => pack.colorSemanticWarningText,
      _ => pack.colorSemanticInfoText,
    };
    final heading = csResultTitle(title, name, csSelectResolvedLanguage(language, CsLanguageScope.of(context)));
    return Semantics(
      liveRegion: true,
      child: Column(children: [
        CustomPaint(size: const Size(64, 64), painter: _ResultMarkPainter(csColor(tone), csResultMark(name))),
        Text(heading, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: csColor(pack.colorTextPrimary))),
        if (csResultShows(message)) Text(message, style: TextStyle(color: csColor(pack.colorTextMuted))),
      ]),
    );
  }
}

const csLinkNewContext = 'noopener noreferrer';
String csLinkHref(String? href) => href ?? '#';
bool csLinkOpensNew(bool external) => external;
String csLinkSuffix(bool external, String variant) => external ? ' ↗' : (variant == 'standalone' ? ' →' : '');
String csLinkTone(String variant) => variant == 'muted' ? 'muted' : 'link';
String csLinkWeight(String variant) => variant == 'standalone' ? 'bold' : 'regular';
double csLinkMinTarget(bool coarse) => coarse ? 44 : 0;

class CsLink extends StatelessWidget {
  const CsLink({super.key, required this.title, required this.dark, required this.highContrast, required this.compact, this.href, this.variant = 'default', this.external = false, this.coarse = false});
  final String title;
  final String? href;
  final String variant;
  final bool external;
  final bool coarse;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final destination = csLinkHref(href);
    final extra = csLinkSuffix(external, variant);
    final ink = csColor(csLinkTone(variant) == 'muted' ? pack.colorTextMuted : pack.colorLink);
    return Semantics(
      label: title,
      link: true,
      excludeSemantics: true,
      child: CsOwnFocus(builder: (node, claim) => Focus(
        focusNode: node,
        child: ConstrainedBox(
        key: ValueKey(destination),
        constraints: BoxConstraints(minWidth: csLinkMinTarget(coarse), minHeight: csLinkMinTarget(coarse)),
        child: Text.rich(TextSpan(children: [
          TextSpan(text: title),
          if (extra.isNotEmpty) TextSpan(text: extra),
        ]), style: TextStyle(color: ink, fontWeight: csLinkWeight(variant) == 'bold' ? FontWeight.w700 : FontWeight.w400, decoration: variant == 'standalone' ? TextDecoration.none : TextDecoration.underline)),
      ),
      )),
    );
  }
}

class CsTooltipState {
  const CsTooltipState({this.hovered = false, this.focused = false, this.dismissed = false});
  final bool hovered;
  final bool focused;
  final bool dismissed;
  bool get open => (hovered || focused) && !dismissed;
}
const csTooltipGap = 8.0;
String csTooltipLabel(String? label, String fallback) => label ?? fallback;
const csTooltipDefault = 'Tooltip';
String csTooltipCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Chú thích'};
  const en = {'label': csTooltipDefault};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
CsTooltipState csTooltipEnter(CsTooltipState state) => CsTooltipState(hovered: true, focused: state.focused);
CsTooltipState csTooltipLeave(CsTooltipState state) => CsTooltipState(focused: state.focused, dismissed: state.dismissed);
CsTooltipState csTooltipFocus(CsTooltipState state) => CsTooltipState(hovered: state.hovered, focused: true);
CsTooltipState csTooltipBlur(CsTooltipState state, bool inside) => inside ? state : CsTooltipState(hovered: state.hovered, dismissed: state.dismissed);
CsTooltipState csTooltipEscape(CsTooltipState state) => CsTooltipState(hovered: state.hovered, focused: state.focused, dismissed: true);

class CsTooltip extends StatefulWidget {
  const CsTooltip({super.key, required this.dark, required this.highContrast, required this.compact, required this.child, this.label, this.fallbackLabel, this.language});
  final String? label;
  final String? fallbackLabel;
  final String? language;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final Widget child;

  @override
  State<CsTooltip> createState() => _CsTooltipState();
}

class _CsTooltipState extends State<CsTooltip> {
  var state = const CsTooltipState();
  final triggerKey = GlobalKey();
  final panelKey = GlobalKey();
  Size? natural;
  Size? fitted;
  Offset? layoutOrigin;
  Offset panelScale = const Offset(1, 1);
  Offset applied = Offset.zero;
  var measureTries = 0;

  void _measure() {
    if (!mounted || !state.open) return;
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
    if (!state.open && (natural != null || fitted != null || applied != Offset.zero)) {
      natural = null;
      fitted = null;
      layoutOrigin = null;
      panelScale = const Offset(1, 1);
      applied = Offset.zero;
      measureTries = 0;
    }
    if (state.open && fitted == null) WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final spoken = csTooltipLabel(widget.label, widget.fallbackLabel ?? csTooltipCopy('label', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context))));
    final box = triggerKey.currentContext?.findRenderObject() as RenderBox?;
    final origin = box?.localToGlobal(Offset.zero) ?? Offset.zero;
    final screen = MediaQuery.sizeOf(context);
    final viewport = CsFloatingRect(8, 8, screen.width - 8, screen.height - 8, screen.width, screen.height);
    final anchor = box == null ? null : CsFloatingRect(origin.dx, origin.dy, origin.dx + box.size.width, origin.dy + box.size.height, box.size.width, box.size.height);
    final initial = anchor == null || natural == null ? null : csFloatingPlace(anchor, natural!.width, natural!.height, viewport, placement: 'top', gap: csTooltipGap);
    final placed = anchor == null || fitted == null || initial == null ? null : csFloatingPlace(anchor, fitted!.width, fitted!.height, viewport, placement: initial.placement, gap: csTooltipGap);
    final desired = placed == null || layoutOrigin == null ? Offset.zero : Offset((placed.left - layoutOrigin!.dx) / (panelScale.dx == 0 ? 1 : panelScale.dx), (placed.top - layoutOrigin!.dy) / (panelScale.dy == 0 ? 1 : panelScale.dy));
    if (placed != null && (desired - applied).distance > 0.5) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) setState(() => applied = desired); });
    final maxWidth = initial == null ? 240.0 : (initial.maxWidth < 240 ? initial.maxWidth : 240.0);
    return Focus(
      onFocusChange: (focused) => setState(() => state = focused ? csTooltipFocus(state) : csTooltipBlur(state, false)),
      onKeyEvent: (node, event) {
        if (event is KeyDownEvent && event.logicalKey == LogicalKeyboardKey.escape) {
          setState(() => state = csTooltipEscape(state));
          return KeyEventResult.handled;
        }
        return KeyEventResult.ignored;
      },
      child: MouseRegion(
        onEnter: (_) => setState(() => state = csTooltipEnter(state)),
        onExit: (_) => setState(() => state = csTooltipLeave(state)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (state.open)
              Padding(
                padding: const EdgeInsets.only(bottom: csTooltipGap),
                child: ExcludeSemantics(child: Opacity(opacity: placed == null ? 0 : 1, child: Transform.translate(offset: applied, child: ConstrainedBox(key: panelKey, constraints: BoxConstraints(maxWidth: maxWidth, maxHeight: initial?.maxHeight ?? placed?.maxHeight ?? double.infinity), child: Container(color: csColor(pack.colorBrandUmber), padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6), child: Text(spoken, style: const TextStyle(color: Color(0xFFFFFFFF)))))))),
              ),
            Container(key: triggerKey, child: widget.child),
          ],
        ),
      ),
    );
  }
}

enum CsToastVariant { standard, success, danger }
const csToastStackGap = 10.0;
const csToastDismiss = 'Close';
const csToastStackLabel = 'Notifications';
String csToastCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'notifications': 'Thông báo', 'dismiss': 'Đóng'};
  const en = {'notifications': csToastStackLabel, 'dismiss': csToastDismiss};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csToastIcon(String? name) => name == 'success' || name == 'danger' || name == 'default' ? (name ?? 'default') : 'default';
String csToastBorder(String? name) {
  switch (name) {
    case 'success':
      return 'success';
    case 'danger':
      return 'danger';
    case 'default':
    case null:
      return 'info';
    default:
      return 'none';
  }
}
String csToastMark(String? name) {
  switch (csToastIcon(name)) {
    case 'success':
      return 'M4 12.5l5 5 11-11';
    case 'danger':
      return 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6';
    default:
      return 'M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z';
  }
}
bool csToastShows(String? value) => value != null && value.isNotEmpty;
bool csToastShowsClose(bool hasOpenChange, bool hasClose) => hasOpenChange || hasClose;
List<String> csToastNotify(bool hasOpenChange, bool hasClose) => [if (hasOpenChange) 'open-false', if (hasClose) 'close'];

class CsToast extends StatelessWidget {
  const CsToast({super.key, required this.dark, required this.highContrast, required this.compact, this.title, this.message, this.variant = 'default', this.dismissLabel, this.onOpenChange, this.onClose, this.language});
  final String? title;
  final String? message;
  final String variant;
  final String? dismissLabel;
  final String? language;
  final void Function(bool open)? onOpenChange;
  final VoidCallback? onClose;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final edge = csToastBorder(variant);
    final closeName = dismissLabel ?? csToastCopy('dismiss', csSelectResolvedLanguage(language, CsLanguageScope.of(context)));
    final ink = edge == 'success' ? pack.colorSemanticSuccessText : edge == 'danger' ? pack.colorSemanticDangerText : edge == 'info' ? pack.colorSemanticInfoText : pack.colorTextAccent;
    return Material(
      color: csColor(pack.colorSurfacePanel),
      borderRadius: BorderRadius.circular(csPoints(pack.radiusMd)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            CustomPaint(size: const Size(18, 18), painter: _ResultMarkPainter(csColor(ink), csToastMark(variant))),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              if (title != null && csToastShows(title)) Text(title!, style: TextStyle(fontWeight: FontWeight.w700, color: csColor(pack.colorTextPrimary))),
              if (message != null && csToastShows(message)) Text(message!, style: TextStyle(color: csColor(pack.colorTextMuted))),
            ])),
            if (csToastShowsClose(onOpenChange != null, onClose != null))
              CsOwnFocus(builder: (node, claim) => Semantics(label: closeName, button: true, child: IconButton(
                focusNode: node,
                onPressed: () {
                  claim();
                  onOpenChange?.call(false);
                  onClose?.call();
                },
                constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
                icon: const ExcludeSemantics(child: Text('×')),
              ))),
          ],
        ),
      ),
    );
  }
}

class CsAccordionItem {
  const CsAccordionItem(this.title, this.content);
  final String title;
  final String content;
}

class CsAccordion extends StatefulWidget {
  const CsAccordion({super.key, required this.items, required this.dark, required this.highContrast, required this.compact, this.defaultOpen = 0, this.allowMultiple = false});
  final List<CsAccordionItem> items;
  final int? defaultOpen;
  final bool allowMultiple;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsAccordion> createState() => _CsAccordionState();
}

class _CsAccordionState extends State<CsAccordion> {
  late List<int> open = csAccordionInitial(widget.defaultOpen);

  @override
  void didUpdateWidget(covariant CsAccordion oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.allowMultiple != widget.allowMultiple) {
      open = csAccordionCollapse(open, widget.allowMultiple);
    }
  }

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var index = 0; index < widget.items.length; index++) ...[
          ConstrainedBox(
            constraints: BoxConstraints(minHeight: csPoints(pack.componentButtonMdMinHeight)),
            child: CsOwnFocus(builder: (node, claim) => TextButton(
              focusNode: node,
              onPressed: () {
                claim();
                setState(() => open = csAccordionToggle(open, index, widget.allowMultiple));
              },
              child: Align(alignment: Alignment.centerLeft, child: Text(widget.items[index].title, style: TextStyle(color: csColor(pack.colorTextPrimary)))),
            )),
          ),
          if (csAccordionPanel(open, index, widget.allowMultiple)) Text(widget.items[index].content, style: TextStyle(color: csColor(pack.colorTextMuted))),
        ],
      ],
    );
  }
}
