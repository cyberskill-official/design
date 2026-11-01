import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'controls.dart';
import 'cs_modes.dart';
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
const csPaginationPreviousGlyph = '‹';
const csPaginationNextGlyph = '›';
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
const csRatingStarPath = 'M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.5L12 16.9 6.1 20l1.3-6.5L2.5 9l6.6-.8z';
double csRatingStarSize() => 22;
double csRatingStarStrokeWidth() => 1.6;
int csRatingMove(int from, int delta, int max) => max <= 0 ? 0 : (from + delta).clamp(0, max - 1) + 1;
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
double csStepRowGap() => 0;
double csStepGap() => 8;
double csStepPaddingEnd() => 12;
bool csStepShowsRail(int index, int count) => index >= 0 && index < count - 1;
double csStepRailTop() => 13;
double csStepRailStart() => 34;
double csStepRailEnd() => 12;
double csStepRailInsetDeduction() => 46;
double csStepRailHeight() => 2;
bool csStepRailUsesUmber(CsStepState state) => state == CsStepState.done;
double csStepMarkerSize() => 28;
int csStepMarkerFontWeight() => 700;
double csStepMarkerBorderWidth(CsStepState state) => state == CsStepState.todo ? 1 : 0;
double csStepActiveRingWidth() => 4;
const double csStepActiveRingOchreAlpha = 0.28;
bool csStepShowsActiveRing(CsStepState state) => state == CsStepState.active;
int csStepTitleFontWeight() => 700;
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
String? csStepCurrentValue(CsStepState state) => state == CsStepState.active ? 'step' : null;
bool csStepShowsBody(String? body) => body != null;

double csAccordionBorderWidth() => 1;
bool csAccordionShowsDivider(int index) => index > 0;
double csAccordionTriggerPaddingY() => 15;
double csAccordionTriggerPaddingX() => 18;
bool csAccordionShowsTriggerHover(bool hovered) => hovered;
double csAccordionChevronDegrees(bool opened) => opened ? 180 : 0;
double csAccordionPanelPaddingX() => 18;
double csAccordionPanelPaddingBottom() => 16;
String csAccordionTriggerId(String prefix, int index) => '$prefix-trigger-$index';
String csAccordionPanelId(String prefix, int index) => '$prefix-panel-$index';
String? csAccordionAriaControls(String prefix, int index, bool opened) => opened ? csAccordionPanelId(prefix, index) : null;
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
bool csTextareaAlert(String? error) => csTextareaShows(error);
String? csTextareaLabelId(String id, String? label) => csTextareaShows(label) ? '$id-label' : null;
String? csTextareaDescId(String id, String? description) => csTextareaShows(description) ? '$id-desc' : null;
String? csTextareaErrId(String id, String? error) => csTextareaShows(error) ? '$id-err' : null;
String? csTextareaLabelledBy(String? ariaLabelledBy, String? ariaLabel, String id, String? label) => ariaLabelledBy ?? (ariaLabel == null ? csTextareaLabelId(id, label) : null);
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
  const CsTextarea({super.key, required this.label, required this.value, required this.onChanged, required this.dark, required this.highContrast, required this.compact, this.description, this.rows = 4, this.disabled = false, this.error, this.placeholder, this.readOnly = false, this.required = false});
  final String label;
  final String? description;
  final String value;
  final ValueChanged<String> onChanged;
  final int rows;
  final bool disabled;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final String? error;
  final String? placeholder;
  final bool readOnly;
  final bool required;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final invalid = csTextareaAlert(error);
    final described = csTextareaDescribedBy([description, error]);
    final borderStroke = csColor(csTextFieldBorderColor(invalid, pack));
    final field = CsOwnFocus(builder: (node, claim) => Semantics(
      hint: described,
      child: TextField(
        focusNode: node,
        enabled: !disabled,
        readOnly: readOnly,
        controller: TextEditingController(text: value),
        onChanged: (next) { if (disabled || readOnly) return; claim(); onChanged(next); },
        minLines: rows,
        maxLines: rows,
        style: TextStyle(color: csColor(pack.colorTextPrimary)),
        decoration: InputDecoration(
          labelText: csTextareaShows(label) ? label : null,
          hintText: placeholder,
          filled: true,
          fillColor: csColor(pack.colorSurfacePanel),
          contentPadding: EdgeInsets.symmetric(horizontal: csTextFieldPaddingX(pack), vertical: csTextFieldPaddingY(pack)),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(csTextFieldRadius(pack)),
            borderSide: BorderSide(color: borderStroke, width: csTextFieldBorderWidth()),
          ),
          constraints: BoxConstraints(minHeight: csFormsStyleTextareaMinHeight()),
        ),
      ),
    ));
    return Opacity(
      opacity: csTextFieldOpacity(disabled),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (csTextareaShows(description)) ...[
            Text(description!, style: TextStyle(fontSize: csTextFieldDescriptionFontSize(), color: csColor(pack.colorTextMuted))),
            SizedBox(height: csTextFieldGap()),
          ],
          field,
          if (invalid) ...[
            SizedBox(height: csTextFieldGap()),
            Semantics(liveRegion: true, child: Text(error!, style: TextStyle(fontSize: csTextFieldErrorFontSize(), color: csColor(pack.colorSemanticDangerText)))),
          ],
        ],
      ),
    );
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

class _SearchIconPainter extends CustomPainter {
  const _SearchIconPainter(this.color);
  final Color color;
  @override
  void paint(Canvas canvas, Size size) {
    final scale = size.shortestSide / 24;
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2 * scale
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    canvas.drawCircle(Offset(11 * scale, 11 * scale), csSearchIconRadius * scale, paint);
    canvas.drawPath(csIconPathData(csSearchIconLine, size.shortestSide), paint);
  }
  @override
  bool shouldRepaint(covariant _SearchIconPainter oldDelegate) => oldDelegate.color != color;
}

class CsSearchField extends StatelessWidget {
  const CsSearchField({super.key, this.label, required this.value, required this.onChanged, required this.dark, required this.highContrast, required this.compact, this.placeholder, this.clearLabel, this.ariaLabel, this.hasLabelledBy = false, this.disabled = false, this.readOnly = false, this.language, this.onClear});
  final String? label;
  final String? placeholder;
  final String? clearLabel;
  final String? ariaLabel;
  final bool hasLabelledBy;
  final String? language;
  final String value;
  final ValueChanged<String> onChanged;
  final VoidCallback? onClear;
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
        contentPadding: EdgeInsets.symmetric(horizontal: csControlsWaveStyleSearchPaddingX(), vertical: csControlsWaveStyleSearchGap(pack)),
        constraints: BoxConstraints(minHeight: csControlsWaveStyleSearchMinHeight()),
        prefixIcon: ExcludeSemantics(
          child: Center(
            widthFactor: 1,
            child: CustomPaint(size: const Size(18, 18), painter: _SearchIconPainter(csColor(pack.colorTextMuted))),
          ),
        ),
        suffixIcon: csSearchShowsClear(value)
            ? Padding(
                padding: EdgeInsets.all(csControlsWaveStyleSearchClearPadding()),
                child: CsOwnFocus(builder: (node, claim) => Semantics(label: clearName, button: true, child: IconButton(
                  focusNode: node,
                  onPressed: csSearchCommit(value, '', disabled, readOnly) == null ? null : () { claim(); onChanged(''); onClear?.call(); },
                  constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
                  icon: ExcludeSemantics(child: CsIcon(name: 'close', label: '', dark: dark, highContrast: highContrast, compact: compact)),
                ))),
              )
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
  const CsNumberField({super.key, this.label, this.description, this.error, this.required = false, required this.value, required this.onChanged, required this.dark, required this.highContrast, required this.compact, this.minimum, this.maximum, this.step = 1, this.disabled = false, this.language});
  final String? label;
  final String? description;
  final String? error;
  final bool required;
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
    final btnWidth = math.max(44.0, csControlsWaveStyleStepperButtonWidth());
    final btnHeight = math.max(44.0, csControlsWaveStyleStepperInputMinHeight());
    final invalid = csTextareaAlert(error);
    return Opacity(
      opacity: csTextFieldOpacity(disabled),
      child: Semantics(
        label: valueName,
        value: shown,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (csNumberShowsLabel(label)) ...[
              ExcludeSemantics(child: Text(label!, style: TextStyle(fontSize: csPoints(pack.fontSizeBase), fontWeight: FontWeight.w700, color: csColor(pack.colorTextPrimary)))),
              SizedBox(height: csTextFieldGap()),
            ],
            DecoratedBox(
              decoration: BoxDecoration(
                color: csColor(pack.colorSurfacePanel),
                borderRadius: BorderRadius.circular(csPoints(pack.radiusMd)),
                border: Border.all(color: csColor(csTextFieldBorderColor(invalid, pack))),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Opacity(opacity: down ? 1.0 : csControlsWaveStyleStepperButtonDisabledOpacity, child: CsOwnFocus(builder: (node, claim) => Semantics(label: downName, button: true, child: IconButton(focusNode: node, onPressed: down ? () { claim(); onChanged(csClampNumber(value - step, minimum, maximum)); } : null, constraints: BoxConstraints(minWidth: btnWidth, minHeight: btnHeight), icon: const ExcludeSemantics(child: Text('−')))))),
                  ConstrainedBox(constraints: BoxConstraints(minWidth: csControlsWaveStyleStepperInputWidth(), minHeight: csControlsWaveStyleStepperInputMinHeight()), child: Center(child: Text(shown, style: TextStyle(color: csColor(pack.colorTextPrimary))))),
                  Opacity(opacity: up ? 1.0 : csControlsWaveStyleStepperButtonDisabledOpacity, child: CsOwnFocus(builder: (node, claim) => Semantics(label: upName, button: true, child: IconButton(focusNode: node, onPressed: up ? () { claim(); onChanged(csClampNumber(value + step, minimum, maximum)); } : null, constraints: BoxConstraints(minWidth: btnWidth, minHeight: btnHeight), icon: const ExcludeSemantics(child: Text('+')))))),
                ],
              ),
            ),
            if (csTextareaShows(description)) ...[
              SizedBox(height: csTextFieldGap()),
              Text(description!, style: TextStyle(fontSize: csTextFieldDescriptionFontSize(), color: csColor(pack.colorTextMuted))),
            ],
            if (invalid) ...[
              SizedBox(height: csTextFieldGap()),
              Semantics(liveRegion: true, child: Text(error!, style: TextStyle(fontSize: csTextFieldErrorFontSize(), color: csColor(pack.colorSemanticDangerText)))),
            ],
          ],
        ),
      ),
    );
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
      decoration: BoxDecoration(border: Border.all(color: csColor(pack.colorBorderDefault), width: csControlsWaveStyleKbdBorderBottomWidth()), borderRadius: BorderRadius.circular(csControlsWaveStyleKbdRadius()), color: csColor(pack.colorSurfacePanel)),
      child: Padding(padding: EdgeInsets.symmetric(horizontal: csControlsWaveStyleKbdPaddingX(), vertical: csControlsWaveStyleKbdPaddingY()), child: Text(keys, style: TextStyle(fontFamily: 'monospace', color: csColor(pack.colorTextPrimary)))),
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
double csEmptyPaddingY() => 48;
double csEmptyPaddingX() => 24;
double csEmptyGap() => 8;
double csEmptyIconBoxSize() => 56;
double csEmptyIconSize() => 26;
double csEmptyIconStrokeWidth() => 1.8;
double csEmptyIconMarginBottom() => 6;
int csEmptyTitleFontWeight() => 700;
double csEmptyBodyMaxWidth() => 380;
double csEmptyActionsMarginTop() => 12;
double csEmptyActionsGap() => 10;
List<String> csEmptyResolvedActions(String? action, List<String> actions) {
  final list = actions.where(csEmptyShows).toList();
  if (list.isNotEmpty) return list;
  if (csEmptyShows(action)) return [action!];
  return const [];
}
const csEmptyIconOchrePortion = 0.24;
CSColorValue csEmptyIconBgColor(CSTokenModePack pack) {
  final lead = _csEmptyOklab(pack.colorBrandOchre);
  final base = _csEmptyOklab(pack.colorSurfacePanel);
  return CSColorValue(CSColorSpace.oklab, [for (var i = 0; i < 3; i++) csEmptyIconOchrePortion * lead[i] + (1 - csEmptyIconOchrePortion) * base[i]], 1);
}
bool csEmptyIconUsesOchreForeground(bool dark) => dark;
CSColorValue csEmptyIconFgColor(bool dark, CSTokenModePack pack) => csEmptyIconUsesOchreForeground(dark) ? pack.colorBrandOchre : pack.colorBrandUmber;
List<double> _csEmptyOklab(CSColorValue color) => color.colorSpace == CSColorSpace.oklab ? color.components.take(3).toList() : _csEmptySrgbToOklab(color.components);
double _csEmptyLinear(double channel) => channel <= 0.04045 ? channel / 12.92 : math.pow((channel + 0.055) / 1.055, 2.4).toDouble();
List<double> _csEmptySrgbToOklab(List<double> rgb) {
  final r = _csEmptyLinear(rgb[0]);
  final g = _csEmptyLinear(rgb[1]);
  final b = _csEmptyLinear(rgb[2]);
  final l = math.pow(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b, 1 / 3).toDouble();
  final m = math.pow(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b, 1 / 3).toDouble();
  final s = math.pow(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b, 1 / 3).toDouble();
  return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
}
const csEmptyTray = 'M3 8l2-4h14l2 4M3 8v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8h6l1 3h4l1-3h6';

class CsEmptyState extends StatelessWidget {
  const CsEmptyState({super.key, required this.dark, required this.highContrast, required this.compact, this.title, this.message, this.action, this.actions = const [], this.icon, this.fallbackTitle, this.language});
  final String? title;
  final String? message;
  final String? action;
  final List<String> actions;
  final String? icon;
  final String? fallbackTitle;
  final String? language;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final iconInk = csColor(csEmptyIconFgColor(dark, pack));
    final actionItems = csEmptyResolvedActions(action, actions);
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: csEmptyPaddingX(), vertical: csEmptyPaddingY()),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: csEmptyIconBoxSize(),
            height: csEmptyIconBoxSize(),
            margin: EdgeInsets.only(bottom: csEmptyIconMarginBottom() + csEmptyGap()),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: csColor(csEmptyIconBgColor(pack)),
              shape: BoxShape.circle,
            ),
            child: csEmptyUsesDefaultIcon(icon)
                ? CustomPaint(size: Size(csEmptyIconSize(), csEmptyIconSize()), painter: _EmptyTrayPainter(iconInk))
                : (icon != null && icon!.isNotEmpty ? CsIcon(name: icon!, dark: dark, highContrast: highContrast, compact: compact) : null),
          ),
          Text(csEmptyTitle(title, fallbackTitle ?? csEmptyCopy('title', csSelectResolvedLanguage(language, CsLanguageScope.of(context)))), textAlign: TextAlign.center, style: TextStyle(fontSize: csPoints(pack.textH4), fontWeight: FontWeight.w700, color: csColor(pack.colorTextPrimary))),
          if (csEmptyShows(message)) ...[
            SizedBox(height: csEmptyGap()),
            ConstrainedBox(
              constraints: BoxConstraints(maxWidth: csEmptyBodyMaxWidth()),
              child: Text(message!, textAlign: TextAlign.center, style: TextStyle(color: csColor(pack.colorTextMuted))),
            ),
          ],
          if (actionItems.isNotEmpty) ...[
            SizedBox(height: csEmptyGap() + csEmptyActionsMarginTop()),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                for (var i = 0; i < actionItems.length; i++) ...[
                  if (i > 0) SizedBox(width: csEmptyActionsGap()),
                  Text(actionItems[i], textAlign: TextAlign.center, style: TextStyle(color: csColor(pack.colorBrandOchre))),
                ],
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _ResultMarkPainter extends CustomPainter {
  const _ResultMarkPainter(this.color, this.wash, this.mark, {this.isInfo = false});
  final Color color;
  final Color wash;
  final String mark;
  final bool isInfo;
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.2
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    canvas.drawCircle(size.center(Offset.zero), 32, Paint()..color = wash);
    if (isInfo) {
      canvas.drawCircle(size.center(Offset.zero), 11, paint);
    }
    canvas.drawPath(csIconPathData(mark, 28), paint);
  }
  @override
  bool shouldRepaint(covariant _ResultMarkPainter oldDelegate) =>
      oldDelegate.color != color || oldDelegate.wash != wash || oldDelegate.mark != mark || oldDelegate.isInfo != isInfo;
}

class _ToastMarkPainter extends CustomPainter {
  const _ToastMarkPainter(this.color, this.mark);
  final Color color;
  final String mark;
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    canvas.drawPath(csIconPathData(mark, size.shortestSide), paint);
  }
  @override
  bool shouldRepaint(covariant _ToastMarkPainter oldDelegate) => oldDelegate.color != color || oldDelegate.mark != mark;
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
    final fontSize = csNavigationStyleBreadcrumbFontSize(pack);
    return Semantics(
      label: navName,
      child: Wrap(
        spacing: csNavigationStyleBreadcrumbGap(),
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          for (var index = 0; index < items.length; index++) ...[
            Text(items[index].label, style: TextStyle(fontSize: fontSize, fontWeight: index == items.length - 1 ? FontWeight.w600 : FontWeight.w400, color: csColor(index == items.length - 1 ? csNavigationStyleBreadcrumbCurrentColor(pack) : csNavigationStyleBreadcrumbLinkColor(pack)))),
            if (index != items.length - 1) ExcludeSemantics(child: Text('/', style: TextStyle(fontSize: fontSize, color: csColor(csNavigationStyleBreadcrumbSeparatorColor(pack))))),
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
    final btnSize = math.max(44.0, csNavigationStylePaginationButtonSize());
    final btnPadding = EdgeInsets.symmetric(horizontal: csNavigationStylePaginationButtonPaddingX());
    return Semantics(
      label: navName,
      child: Wrap(
        spacing: csNavigationStylePaginationGap(),
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          Opacity(opacity: csNavigationStylePaginationButtonOpacity(disabled: page <= 1), child: ConstrainedBox(constraints: BoxConstraints(minWidth: btnSize, minHeight: btnSize), child: Semantics(label: previousName, button: true, child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, style: TextButton.styleFrom(padding: btnPadding), onPressed: page > 1 ? () { claim(); onChange(page - 1); } : null, child: const Text(csPaginationPreviousGlyph)))))),
          for (final token in tokens)
            if (token.ellipsis)
              Padding(padding: EdgeInsets.symmetric(horizontal: csNavigationStylePaginationEllipsisPaddingX()), child: Text('…', style: TextStyle(color: csColor(pack.colorTextMuted))))
            else
              ConstrainedBox(
                constraints: BoxConstraints(minWidth: btnSize, minHeight: btnSize),
                child: CsOwnFocus(builder: (node, claim) {
                  final current = csPaginationCurrent(token.number!, page);
                  return TextButton(
                    focusNode: node,
                    style: TextButton.styleFrom(
                      padding: btnPadding,
                      backgroundColor: csColor(csNavigationStylePaginationButtonBackground(pack, current: current, dark: dark)),
                    ),
                    onPressed: current ? null : () { claim(); onChange(token.number!); },
                    child: Text('${token.number}', style: TextStyle(fontSize: csNavigationStylePaginationButtonFontSize(pack), fontWeight: FontWeight.w600, color: csColor(csNavigationStylePaginationButtonForeground(pack, current: current, dark: dark)))),
                  );
                }),
              ),
          Opacity(opacity: csNavigationStylePaginationButtonOpacity(disabled: page >= pageCount), child: ConstrainedBox(constraints: BoxConstraints(minWidth: btnSize, minHeight: btnSize), child: Semantics(label: nextName, button: true, child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, style: TextButton.styleFrom(padding: btnPadding), onPressed: page < pageCount ? () { claim(); onChange(page + 1); } : null, child: const Text(csPaginationNextGlyph)))))),
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (var index = 0; index < steps.length; index++)
            Expanded(
              child: Stack(
                children: [
                  if (csStepShowsRail(index, steps.length))
                    Positioned(
                      top: csStepRailTop(),
                      left: csStepRailStart(),
                      right: csStepRailEnd(),
                      height: csStepRailHeight(),
                      child: ExcludeSemantics(
                        child: ColoredBox(
                          color: csColor(csStepRailUsesUmber(csStepState(index, current)) ? pack.colorBrandUmber : pack.colorBorderDefault),
                        ),
                      ),
                    ),
                  Padding(
                    padding: EdgeInsets.only(right: csStepPaddingEnd()),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Builder(
                          builder: (context) {
                            final state = csStepState(index, current);
                            final markerFill = state == CsStepState.done
                                ? csColor(pack.colorBrandUmber)
                                : state == CsStepState.active
                                    ? csColor(pack.colorBrandOchre)
                                    : csColor(pack.colorSurfaceRaised);
                            final markerInk = state == CsStepState.done
                                ? const Color(0xFFFFFFFF)
                                : state == CsStepState.active
                                    ? csColor(pack.colorBrandUmber)
                                    : csColor(pack.colorTextMuted);
                            return Container(
                              width: csStepMarkerSize(),
                              height: csStepMarkerSize(),
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: markerFill,
                                shape: BoxShape.circle,
                                border: csStepMarkerBorderWidth(state) > 0
                                    ? Border.all(color: csColor(pack.colorBorderDefault), width: csStepMarkerBorderWidth(state))
                                    : null,
                                boxShadow: csStepShowsActiveRing(state)
                                    ? [
                                        BoxShadow(
                                          color: csColor(pack.colorBrandOchre).withOpacity(csStepActiveRingOchreAlpha),
                                          spreadRadius: csStepActiveRingWidth(),
                                        ),
                                      ]
                                    : null,
                              ),
                              child: Text(
                                csStepMarker(state, index, steps[index].number),
                                style: TextStyle(
                                  color: markerInk,
                                  fontFamily: 'monospace',
                                  fontWeight: FontWeight.w700,
                                  fontSize: csPoints(pack.fontSizeSm),
                                ),
                              ),
                            );
                          },
                        ),
                        SizedBox(height: csStepGap()),
                        Text(
                          steps[index].title,
                          style: TextStyle(
                            color: csColor(pack.colorTextPrimary),
                            fontWeight: FontWeight.w700,
                            fontSize: csPoints(pack.fontSizeSm),
                          ),
                        ),
                        if (csStepShowsBody(steps[index].body)) ...[
                          SizedBox(height: csStepGap()),
                          Text(
                            steps[index].body ?? '',
                            style: TextStyle(
                              color: csColor(pack.colorTextMuted),
                              fontSize: csPoints(pack.fontSizeXs),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
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
const csKbdPadX = 7.0;
String csKbdKeyFace(String text) => text;
const csButtonGroupOverlap = -1.0;
String? csButtonGroupLabel(String? label) => label;
enum CsStatusKind { online, busy, offline, error }

class CsStatusIndicator extends StatelessWidget {
  const CsStatusIndicator({super.key, required this.title, required this.dark, required this.highContrast, required this.compact, this.status = CsStatusKind.offline, this.pulse = false, this.reducedMotion = false});
  final String title;
  final CsStatusKind status;
  final bool pulse;
  final bool reducedMotion;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final tone = switch (status) {
      CsStatusKind.online => 'online',
      CsStatusKind.busy => 'busy',
      CsStatusKind.offline => 'offline',
      CsStatusKind.error => 'error',
    };
    final color = csColor(csControlsWaveStyleStatusDotColor(tone, pack));
    final dot = csControlsWaveStyleStatusDotSize();
    final pulsing = csStatusPulses(pulse, reducedMotion);
    return Row(children: [
      Container(
        width: dot,
        height: dot,
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
          boxShadow: pulsing ? [BoxShadow(color: color.withOpacity(0.35), spreadRadius: 2)] : null,
        ),
      ),
      SizedBox(width: csControlsWaveStyleStatusGap()),
      Text(title, style: TextStyle(fontSize: csPoints(pack.fontSizeSm), color: csColor(pack.colorTextPrimary))),
    ]);
  }
}

class _RatingStarPainter extends CustomPainter {
  const _RatingStarPainter({required this.filled, required this.fillColor, required this.strokeColor});
  final bool filled;
  final Color fillColor;
  final Color strokeColor;

  @override
  void paint(Canvas canvas, Size size) {
    final path = csIconPathData(csRatingStarPath, size.shortestSide);
    if (filled) {
      canvas.drawPath(path, Paint()..color = fillColor..style = PaintingStyle.fill);
    }
    canvas.drawPath(
      path,
      Paint()
        ..color = strokeColor
        ..style = PaintingStyle.stroke
        ..strokeWidth = csRatingStarStrokeWidth() * (size.shortestSide / 24)
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round,
    );
  }

  @override
  bool shouldRepaint(covariant _RatingStarPainter oldDelegate) =>
      oldDelegate.filled != filled || oldDelegate.fillColor != fillColor || oldDelegate.strokeColor != strokeColor;
}

class CsRating extends StatelessWidget {
  const CsRating({super.key, this.label, required this.value, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.requestedMax = 5, this.readOnly = false, this.language, this.description, this.error, this.required = false});
  final String? label;
  final String? language;
  final String? description;
  final String? error;
  final bool required;
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
    final starDim = csRatingStarSize();
    return Semantics(
      label: csRatingGroupName(label, value, max, null, false, csRatingCopy('label', csSelectResolvedLanguage(language, CsLanguageScope.of(context)))) ?? '',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (description != null && description!.isNotEmpty) ...[
            Text(description!, style: TextStyle(fontSize: csTextFieldDescriptionFontSize(), color: csColor(pack.colorTextMuted))),
            SizedBox(height: csTextFieldGap()),
          ],
          Row(
            children: [
              for (var star = 1; star <= max; star++) ...[
                if (star > 1) SizedBox(width: csControlsWaveStyleRatingGap()),
                Padding(
                  padding: EdgeInsets.all(csControlsWaveStyleRatingButtonPadding()),
                  child: CsOwnFocus(builder: (node, claim) {
                    node.onKeyEvent = readOnly
                        ? null
                        : (_, event) {
                            if (event is! KeyDownEvent) return KeyEventResult.ignored;
                            final idx = star - 1;
                            if (event.logicalKey == LogicalKeyboardKey.arrowRight || event.logicalKey == LogicalKeyboardKey.arrowUp) {
                              onChange(csRatingMove(idx, 1, max));
                              return KeyEventResult.handled;
                            }
                            if (event.logicalKey == LogicalKeyboardKey.arrowLeft || event.logicalKey == LogicalKeyboardKey.arrowDown) {
                              onChange(csRatingMove(idx, -1, max));
                              return KeyEventResult.handled;
                            }
                            if (event.logicalKey == LogicalKeyboardKey.home) {
                              onChange(1);
                              return KeyEventResult.handled;
                            }
                            if (event.logicalKey == LogicalKeyboardKey.end) {
                              onChange(max);
                              return KeyEventResult.handled;
                            }
                            return KeyEventResult.ignored;
                          };
                    final filled = star <= value;
                    final starColor = csColor(filled ? pack.colorBrandOchre : pack.colorBorderDefault);
                    return IconButton(
                      focusNode: node,
                      onPressed: readOnly ? null : () { claim(); onChange(csRatingCommit(value, star)); },
                      constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
                      icon: CustomPaint(
                        size: Size(starDim, starDim),
                        painter: _RatingStarPainter(filled: filled, fillColor: starColor, strokeColor: starColor),
                      ),
                    );
                  }),
                ),
              ],
            ],
          ),
          if (error != null && error!.isNotEmpty) ...[
            SizedBox(height: csTextFieldGap()),
            Semantics(liveRegion: true, child: Text(error!, style: TextStyle(fontSize: csTextFieldErrorFontSize(), color: csColor(pack.colorSemanticDangerText)))),
          ],
        ],
      ),
    );
  }
}

String csSegmentedEffectiveMode(String? mode, [String? role]) => mode == 'tabs' || role == 'tablist' ? 'tabs' : 'radio';
String csSegmentedGroupRole(String? mode, [String? role]) => role ?? (csSegmentedEffectiveMode(mode, role) == 'tabs' ? 'tablist' : 'radiogroup');
String csSegmentedItemRole(String? mode, [String? role]) => csSegmentedEffectiveMode(mode, role) == 'tabs' ? 'tab' : 'radio';

class CsSegmentedControl extends StatelessWidget {
  const CsSegmentedControl({super.key, required this.label, required this.options, required this.selection, required this.onSelect, required this.dark, required this.highContrast, required this.compact, this.mode, this.role, this.vertical = false});
  final String label;
  final List<CsTabItem> options;
  final String selection;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final String? mode;
  final String? role;
  final bool vertical;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final items = <Widget>[
      for (var index = 0; index < options.length; index++) ...[
        if (index > 0)
          vertical
              ? SizedBox(height: csControlsWaveStyleSegmentedGap())
              : SizedBox(width: csControlsWaveStyleSegmentedGap()),
        ConstrainedBox(
          constraints: BoxConstraints(minHeight: csPoints(pack.componentButtonMdMinHeight)),
          child: CsOwnFocus(builder: (node, claim) {
            final option = options[index];
            final selected = selection == option.value;
            node.onKeyEvent = (_, event) {
              if (event is! KeyDownEvent || options.isEmpty) return KeyEventResult.ignored;
              final forward = vertical ? LogicalKeyboardKey.arrowDown : LogicalKeyboardKey.arrowRight;
              final backward = vertical ? LogicalKeyboardKey.arrowUp : LogicalKeyboardKey.arrowLeft;
              if (event.logicalKey == forward) {
                onSelect(options[csTabsMove(index, 'ArrowRight', options.length) ?? index].value);
                return KeyEventResult.handled;
              }
              if (event.logicalKey == backward) {
                onSelect(options[csTabsMove(index, 'ArrowLeft', options.length) ?? index].value);
                return KeyEventResult.handled;
              }
              if (event.logicalKey == LogicalKeyboardKey.home) {
                onSelect(options.first.value);
                return KeyEventResult.handled;
              }
              if (event.logicalKey == LogicalKeyboardKey.end) {
                onSelect(options.last.value);
                return KeyEventResult.handled;
              }
              return KeyEventResult.ignored;
            };
            return TextButton(
              focusNode: node,
              style: TextButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: csControlsWaveStyleSegmentedButtonPaddingX(), vertical: csControlsWaveStyleSegmentedButtonPaddingY()),
                backgroundColor: selected ? csColor(pack.colorSurfacePanel) : null,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(csPoints(pack.radiusMd))),
              ),
              onPressed: () { claim(); onSelect(option.value); },
              child: Text(option.label, style: TextStyle(fontSize: csPoints(pack.fontSizeSm), fontWeight: FontWeight.w600, color: csColor(selected ? pack.colorTextPrimary : pack.colorTextMuted))),
            );
          }),
        ),
      ],
    ];
    return Semantics(
      label: label,
      child: DecoratedBox(
        decoration: BoxDecoration(color: csColor(pack.colorSurfaceRaised), border: Border.all(color: csColor(pack.colorBorderDefault)), borderRadius: BorderRadius.circular(csPoints(pack.radiusLg))),
        child: Padding(
          padding: EdgeInsets.all(csControlsWaveStyleSegmentedPadding()),
          child: vertical
              ? Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: items)
              : Row(children: [for (final item in items) item is SizedBox ? item : Expanded(child: item)]),
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

double csDescriptionColumnMin() => 160;
double csDescriptionColumnGap() => 24;
double csDescriptionRowGap() => 14;
double csDescriptionValueGap() => 2;
double csDescriptionTermTracking() => 0.08;
String csDescriptionSpoken(String term) => term;

class CsDescriptionList extends StatelessWidget {
  const CsDescriptionList({super.key, required this.items, required this.dark, required this.highContrast, required this.compact});
  final List<CsDescriptionItem> items;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final termSize = csPoints(pack.fontSizeXs);
    return Wrap(
      spacing: csDescriptionColumnGap(),
      runSpacing: csDescriptionRowGap(),
      children: [
        for (final item in items)
          ConstrainedBox(
            constraints: BoxConstraints(minWidth: csDescriptionColumnMin()),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Semantics(
                  label: csDescriptionSpoken(item.term),
                  child: ExcludeSemantics(
                    child: Text(
                      item.term.toUpperCase(),
                      style: TextStyle(
                        color: csColor(pack.colorTextMuted),
                        fontSize: termSize,
                        letterSpacing: termSize * csDescriptionTermTracking(),
                      ),
                    ),
                  ),
                ),
                SizedBox(height: csDescriptionValueGap()),
                Text(item.value, style: TextStyle(color: csColor(pack.colorTextPrimary), fontSize: csPoints(pack.fontSizeSm))),
              ],
            ),
          ),
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
    return Semantics(label: label, child: Wrap(spacing: csControlsWaveStyleButtonGroupOverlapOffset(), children: children));
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
          padding: EdgeInsets.only(left: index == 0 ? 0 : csDataStyleAvatarGroupOverlapOffset()),
          child: DecoratedBox(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: csColor(pack.colorSurfacePanel), width: csDataStyleAvatarGroupRingWidth()),
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
  const CsResult({super.key, required this.message, required this.dark, required this.highContrast, required this.compact, this.title, this.action, this.status = CsResultStatus.info, this.language});
  final String? title;
  final String? action;
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
    final wash = name == 'info'
        ? csColor(pack.accentTint)
        : csColor(tone).withOpacity(name == 'error' ? csControlsWaveStyleResultErrorMixPortion : csControlsWaveStyleResultSuccessMixPortion);
    final heading = csResultTitle(title, name, csSelectResolvedLanguage(language, CsLanguageScope.of(context)));
    final iconDim = csControlsWaveStyleResultIconSize();
    return Semantics(
      liveRegion: true,
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: csControlsWaveStyleResultPaddingX(), vertical: csControlsWaveStyleResultPaddingY()),
        child: Column(children: [
          CustomPaint(size: Size(iconDim, iconDim), painter: _ResultMarkPainter(csColor(tone), wash, csResultMark(name), isInfo: name == 'info')),
          SizedBox(height: csControlsWaveStyleResultGap()),
          Text(heading, style: TextStyle(fontSize: csControlsWaveStyleResultTitleFontSize(), fontWeight: FontWeight.w800, color: csColor(pack.colorTextPrimary))),
          if (csResultShows(message)) ...[
            SizedBox(height: csControlsWaveStyleResultGap()),
            Text(message, style: TextStyle(color: csColor(pack.colorTextMuted))),
          ],
          if (csResultShows(action)) ...[
            SizedBox(height: csControlsWaveStyleResultActionsMarginTop()),
            Text(action!, style: TextStyle(color: csColor(pack.colorTextPrimary))),
          ],
        ]),
      ),
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
String csTooltipPlacement(String? placement) => placement != null && placement.isNotEmpty ? placement : 'top';
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
  const CsTooltip({super.key, required this.dark, required this.highContrast, required this.compact, required this.child, this.label, this.fallbackLabel, this.language, this.placement, this.portal = true});
  final String? label;
  final String? fallbackLabel;
  final String? language;
  final String? placement;
  final bool portal;
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
    final initial = anchor == null || natural == null ? null : csFloatingPlace(anchor, natural!.width, natural!.height, viewport, placement: csTooltipPlacement(widget.placement), gap: csTooltipGap);
    final placed = anchor == null || fitted == null || initial == null ? null : csFloatingPlace(anchor, fitted!.width, fitted!.height, viewport, placement: initial.placement, gap: csTooltipGap);
    final desired = placed == null || layoutOrigin == null ? Offset.zero : Offset((placed.left - layoutOrigin!.dx) / (panelScale.dx == 0 ? 1 : panelScale.dx), (placed.top - layoutOrigin!.dy) / (panelScale.dy == 0 ? 1 : panelScale.dy));
    if (placed != null && (desired - applied).distance > 0.5) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) setState(() => applied = desired); });
    final tipMax = csDataStyleTooltipMaxWidth();
    final maxWidth = initial == null ? tipMax : (initial.maxWidth < tipMax ? initial.maxWidth : tipMax);
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
                child: ExcludeSemantics(child: Opacity(opacity: placed == null ? 0 : 1, child: Transform.translate(offset: applied, child: ConstrainedBox(key: panelKey, constraints: BoxConstraints(maxWidth: maxWidth, maxHeight: initial?.maxHeight ?? placed?.maxHeight ?? double.infinity), child: Container(color: csColor(pack.colorBrandUmber), padding: EdgeInsets.symmetric(horizontal: csDataStyleTooltipPaddingX(), vertical: csDataStyleTooltipPaddingY()), child: Text(spoken, style: TextStyle(fontSize: csDataStyleTooltipFontSize(pack), fontWeight: FontWeight.w600, color: const Color(0xFFFFFFFF)))))))),
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
  const CsToast({super.key, required this.dark, required this.highContrast, required this.compact, this.title, this.message, this.icon, this.variant = 'default', this.dismissLabel, this.onOpenChange, this.onClose, this.language});
  final String? title;
  final String? message;
  final String? icon;
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
    return ClipRRect(
      borderRadius: BorderRadius.circular(csPoints(pack.radiusMd)),
      child: Material(
        color: csColor(pack.colorSurfacePanel),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(csPoints(pack.radiusMd)), side: BorderSide(color: csColor(pack.colorBorderDefault), width: csFeedbackStyleToastBorderWidth())),
        child: Container(
          decoration: edge != 'none' ? BoxDecoration(border: Border(left: BorderSide(color: csColor(ink), width: csFeedbackStyleToastAccentBorderWidth()))) : null,
          padding: EdgeInsets.symmetric(horizontal: csFeedbackStyleToastPaddingX(), vertical: csFeedbackStyleToastPaddingY()),
          child: Row(
            children: [
              if (icon != null && icon!.isNotEmpty)
                ExcludeSemantics(child: CsIcon(name: icon!, label: '', dark: dark, highContrast: highContrast, compact: compact))
              else
                CustomPaint(size: const Size(18, 18), painter: _ToastMarkPainter(csColor(ink), csToastMark(variant))),
              SizedBox(width: csFeedbackStyleToastGap()),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                if (title != null && csToastShows(title)) Text(title!, style: TextStyle(fontSize: csFeedbackStyleToastTitleFontSize(pack), fontWeight: FontWeight.w700, color: csColor(pack.colorTextPrimary))),
                if (message != null && csToastShows(message)) Padding(padding: EdgeInsets.only(top: csFeedbackStyleToastBodyMarginTop()), child: Text(message!, style: TextStyle(fontSize: csFeedbackStyleToastBodyFontSize(pack), color: csColor(pack.colorTextMuted)))),
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
                  icon: ExcludeSemantics(child: CsIcon(name: 'close', label: '', dark: dark, highContrast: highContrast, compact: compact)),
                ))),
            ],
          ),
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
  int? hoverIndex;

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
    return ClipRRect(
      borderRadius: BorderRadius.circular(csPoints(pack.radiusLg)),
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: csColor(pack.colorSurfacePanel),
          borderRadius: BorderRadius.circular(csPoints(pack.radiusLg)),
          border: Border.all(color: csColor(pack.colorBorderDefault), width: csAccordionBorderWidth()),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            for (var index = 0; index < widget.items.length; index++) ...[
              if (csAccordionShowsDivider(index))
                Container(height: csAccordionBorderWidth(), color: csColor(pack.colorBorderDefault)),
              MouseRegion(
                onEnter: (_) => setState(() => hoverIndex = index),
                onExit: (_) => setState(() => hoverIndex = hoverIndex == index ? null : hoverIndex),
                child: ColoredBox(
                  color: csAccordionShowsTriggerHover(hoverIndex == index) ? csColor(pack.colorSurfaceRaised) : Colors.transparent,
                  child: ConstrainedBox(
                    constraints: BoxConstraints(minHeight: csPoints(pack.componentButtonMdMinHeight)),
                    child: CsOwnFocus(builder: (node, claim) => TextButton(
                      focusNode: node,
                      onPressed: () {
                        claim();
                        setState(() => open = csAccordionToggle(open, index, widget.allowMultiple));
                      },
                      child: Padding(
                        padding: EdgeInsets.symmetric(horizontal: csAccordionTriggerPaddingX(), vertical: csAccordionTriggerPaddingY()),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                widget.items[index].title,
                                textAlign: TextAlign.start,
                                style: TextStyle(color: csColor(pack.colorTextPrimary), fontWeight: FontWeight.w600),
                              ),
                            ),
                            SizedBox(width: csPoints(pack.space3)),
                            Transform.rotate(
                              angle: csAccordionChevronDegrees(csAccordionPanel(open, index, widget.allowMultiple)) * 3.141592653589793 / 180,
                              child: CsIcon(name: 'chevron-down', label: '', dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact),
                            ),
                          ],
                        ),
                      ),
                    )),
                  ),
                ),
              ),
              if (csAccordionPanel(open, index, widget.allowMultiple))
                Padding(
                  padding: EdgeInsets.fromLTRB(csAccordionPanelPaddingX(), 0, csAccordionPanelPaddingX(), csAccordionPanelPaddingBottom()),
                  child: Text(
                    widget.items[index].content,
                    style: TextStyle(
                      color: csColor(pack.colorTextMuted),
                      fontSize: csPoints(pack.fontSizeSm),
                      height: pack.fontLineHeightBody,
                    ),
                  ),
                ),
            ],
          ],
        ),
      ),
    );
  }
}
