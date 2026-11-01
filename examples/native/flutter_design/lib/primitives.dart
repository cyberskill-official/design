import 'dart:math';

import 'package:flutter/material.dart';

import 'controls.dart';
import 'cs_modes.dart';
import 'icon_paths.dart';

class CsProgressMeasurement {
  const CsProgressMeasurement(this.clamped, this.percent, this.max);
  final double clamped;
  final double percent;
  final double max;
}

CsProgressMeasurement csProgressMeasure(double value, double max) {
  final safeMax = max.isFinite && max > 0 ? max : 100.0;
  final numeric = value.isFinite ? value : 0.0;
  final clamped = safeMax < numeric ? safeMax : (numeric < 0 ? 0.0 : numeric);
  final percent = (clamped / safeMax) * 100;
  return CsProgressMeasurement(clamped, percent > 100 ? 100 : (percent < 0 ? 0 : percent), safeMax);
}

const csProgressLabel = 'Progress';
String csProgressBarName(String? label, String fallback) => label ?? fallback;
String csProgressCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Tiến độ'};
  const en = {'label': csProgressLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool csRadioShowsText(String? value) => value != null && value.isNotEmpty;
String csRadioGroupName(String? name, String generated) => name ?? generated;
bool csRadioChecked(String? value, String option) => value == option;
String? csRadioSelect(String option, bool hasHandler) => hasHandler ? option : null;
bool csCheckShowsText(String? value) => value != null && value.isNotEmpty;
String? csCheckLabelId(String id, String? label) => csCheckShowsText(label) ? '$id-label' : null;
String? csCheckLabelledBy(String? explicit, bool hasAriaLabel, String? labelId) {
  if (explicit != null) return explicit;
  return hasAriaLabel ? null : labelId;
}
String? csCheckDescribedBy(String? explicit, String? descriptionId) {
  final parts = <String>[];
  for (final value in [explicit, descriptionId]) {
    if (value == null) continue;
    for (final word in value.trim().split(RegExp(r'\s+'))) {
      if (word.isNotEmpty && !parts.contains(word)) parts.add(word);
    }
  }
  return parts.isEmpty ? null : parts.join(' ');
}
String csProgressVariant(String? name) => name == 'umber' || name == 'success' ? name! : 'ochre';

String csInitials(String name) {
  final parts = name.trim().split(RegExp(r'\s+')).where((part) => part.isNotEmpty).take(2);
  return parts.map((part) => part[0]).join().toUpperCase();
}

bool csAvatarHasImage(String? src) => src != null && src.isNotEmpty;
String? csAvatarSpoken(String? src, String name) => csAvatarHasImage(src) ? name : (name.isEmpty ? null : name);
String? csAvatarTitle(String name) => name.isEmpty ? null : name;

double csAvatarPoints(String size) {
  switch (size) {
    case 'sm':
      return 28;
    case 'lg':
      return 56;
    default:
      return 40;
  }
}

enum CsAlertVariant { info, success, warning, danger }

CSColorValue csAlertText(CsAlertVariant variant, CSTokenModePack pack) {
  switch (variant) {
    case CsAlertVariant.info:
      return pack.colorSemanticInfoText;
    case CsAlertVariant.success:
      return pack.colorSemanticSuccessText;
    case CsAlertVariant.warning:
      return pack.colorSemanticWarningText;
    case CsAlertVariant.danger:
      return pack.colorSemanticDangerText;
  }
}

const csAlertBannerDismiss = 'Close';
String csAlertBannerCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'dismiss': 'Đóng'};
  const en = {'dismiss': csAlertBannerDismiss};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}

String csAlertBannerVariantName(CsAlertVariant variant) {
  switch (variant) {
    case CsAlertVariant.info:
      return 'info';
    case CsAlertVariant.success:
      return 'success';
    case CsAlertVariant.warning:
      return 'warning';
    case CsAlertVariant.danger:
      return 'danger';
  }
}

String csAlertBannerMark(String? variant) {
  switch (variant) {
    case 'success':
      return 'M4 12.5l5 5 11-11';
    case 'warning':
      return 'M12 3l9 16H3z M12 10v4 M12 17h.01';
    case 'danger':
      return 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6';
    default:
      return 'M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z';
  }
}

bool csAlertBannerShows(String? value) => value != null && value.isNotEmpty;
String csAlertBannerDismissName(String? explicit, String fallback) => explicit ?? fallback;
bool csAlertBannerShowsDismiss(bool hasOpenChange, bool hasClose, bool hasDismiss) =>
    hasOpenChange || hasClose || hasDismiss;
List<String> csAlertBannerNotify(bool hasOpenChange, bool hasClose, bool hasDismiss) {
  final events = <String>[];
  if (hasOpenChange) events.add('open-false');
  if (hasClose) events.add('close');
  if (hasDismiss) events.add('dismiss');
  return events;
}

class _AlertMarkPainter extends CustomPainter {
  const _AlertMarkPainter(this.color, this.data);
  final Color color;
  final String data;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawPath(
      csIconPathData(data, size.shortestSide),
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.9
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round,
    );
  }

  @override
  bool shouldRepaint(covariant _AlertMarkPainter oldDelegate) =>
      oldDelegate.color != color || oldDelegate.data != data;
}

enum CsStatTrend { up, down, flat }

String csStatMark(CsStatTrend trend) {
  switch (trend) {
    case CsStatTrend.up:
      return '↑';
    case CsStatTrend.down:
      return '↓';
    case CsStatTrend.flat:
      return '–';
  }
}

CsStatTrend csStatTrend(String name) {
  if (name == 'up') return CsStatTrend.up;
  if (name == 'down') return CsStatTrend.down;
  return CsStatTrend.flat;
}

bool csStatShowsDelta(String? delta) => delta != null;
String csStatArrowPath(String name) => name == 'up'
    ? 'M12 5v14M6 11l6-6 6 6'
    : name == 'down'
        ? 'M12 5v14M6 13l6 6 6-6'
        : 'M5 12h14';

bool csCheckboxShows(String? value) => value != null && value.isNotEmpty;

class CsCheckbox extends StatelessWidget {
  const CsCheckbox({
    super.key,
    required this.label,
    required this.value,
    required this.onChanged,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.description,
    this.disabled = false,
  });

  final String label;
  final bool value;
  final ValueChanged<bool?> onChanged;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final String? description;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Opacity(
      opacity: csFormsStyleCheckRadioOpacity(disabled),
      child: ConstrainedBox(
        constraints: BoxConstraints(minHeight: csPoints(pack.componentButtonMdMinHeight)),
        child: CsOwnFocus(builder: (node, claim) => Semantics(
          label: csCheckboxShows(label) ? label : '',
          hint: csCheckboxShows(description) ? description : null,
          child: CheckboxListTile(
            focusNode: node,
            value: value,
            onChanged: disabled ? null : (next) { claim(); onChanged(next); },
            title: csCheckboxShows(label) ? ExcludeSemantics(child: Text(label, style: TextStyle(color: csColor(pack.colorTextPrimary)))) : null,
            subtitle: csCheckboxShows(description) ? ExcludeSemantics(child: Text(description!, style: TextStyle(fontSize: csFormsStyleCheckRadioDescriptionFontSize(pack), color: csColor(pack.colorTextMuted)))) : null,
            activeColor: csColor(csFormsStyleCheckRadioAccentColor(dark, pack)),
            controlAffinity: ListTileControlAffinity.leading,
            contentPadding: EdgeInsets.zero,
          ),
        )),
      ),
    );
  }
}

class CsRadioOption {
  const CsRadioOption(this.value, this.label, {this.description, this.disabled = false});
  final String value;
  final String label;
  final String? description;
  final bool disabled;
}

class CsRadioGroup extends StatelessWidget {
  const CsRadioGroup({
    super.key,
    required this.label,
    required this.options,
    required this.selection,
    required this.onSelect,
    required this.dark,
    required this.highContrast,
    required this.compact,
  });

  final String label;
  final List<CsRadioOption> options;
  final String selection;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return CsFormAncestor(inForm: true, child: Semantics(
      container: true,
      explicitChildNodes: true,
      label: csCheckboxShows(label) ? label : null,
      child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (csCheckboxShows(label))
          Padding(
            padding: EdgeInsets.only(bottom: csFormsStyleRadioGroupLegendMarginBottom()),
            child: ExcludeSemantics(child: Text(label, style: TextStyle(fontWeight: FontWeight.w700, color: csColor(pack.colorTextPrimary)))),
          ),
        for (final option in options)
          Opacity(
            opacity: csFormsStyleCheckRadioOpacity(option.disabled),
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: csPoints(pack.componentButtonMdMinHeight)),
              child: CsOwnFocus(builder: (node, claim) => Semantics(
                label: csCheckboxShows(option.label) ? option.label : '',
                hint: csCheckboxShows(option.description) ? option.description : null,
                child: RadioListTile<String>(
                  focusNode: node,
                  value: option.value,
                  groupValue: selection,
                  onChanged: option.disabled ? null : (next) {
                    claim();
                    if (next != null) onSelect(next);
                  },
                  title: csCheckboxShows(option.label) ? ExcludeSemantics(child: Text(option.label, style: TextStyle(color: csColor(pack.colorTextPrimary)))) : null,
                  subtitle: csCheckboxShows(option.description) ? ExcludeSemantics(child: Text(option.description!, style: TextStyle(fontSize: csFormsStyleCheckRadioDescriptionFontSize(pack), color: csColor(pack.colorTextMuted)))) : null,
                  activeColor: csColor(csFormsStyleCheckRadioAccentColor(dark, pack)),
                  contentPadding: EdgeInsets.zero,
                ),
              )),
            ),
          ),
      ],
    )));
  }
}

class CsProgressBar extends StatelessWidget {
  const CsProgressBar({
    super.key,
    required this.value,
    this.label,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.maximum = 100,
    this.variant = 'ochre',
    this.language,
  });

  final double value;
  final double maximum;
  final String variant;
  final String? label;
  final String? language;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final measurement = csProgressMeasure(value, maximum);
    final tone = csProgressVariant(variant);
    final color = tone == 'umber' ? pack.colorBrandUmber : tone == 'success' ? pack.colorSemanticSuccess : pack.colorBrandOchre;
    return Semantics(
      label: csProgressBarName(label, csProgressCopy('label', csSelectResolvedLanguage(language, CsLanguageScope.of(context)))),
      value: '${measurement.clamped}',
      child: ClipRRect(
        borderRadius: BorderRadius.circular(csPoints(pack.radiusFull)),
        child: SizedBox(
          height: csFeedbackStyleProgressHeight(),
          child: LinearProgressIndicator(
            value: measurement.percent / 100,
            color: csColor(color),
            backgroundColor: csColor(pack.colorSurfaceRaised),
          ),
        ),
      ),
    );
  }
}

class CsAvatar extends StatelessWidget {
  const CsAvatar({
    super.key,
    required this.name,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.size = 'md',
    this.square = false,
    this.source,
  });

  final String name;
  final String size;
  final bool square;
  final String? source;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final points = csDataStyleAvatarSize(size);
    final spoken = csAvatarSpoken(source, name);
    return Semantics(
      label: spoken,
      excludeSemantics: true,
      child: Container(
        width: points,
        height: points,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: csColor(pack.colorBrandUmber),
          shape: square ? BoxShape.rectangle : BoxShape.circle,
          borderRadius: square ? BorderRadius.circular(csDataStyleAvatarRadius(pack, square: true, size: size)) : null,
        ),
        child: Text(
          csInitials(name),
          style: TextStyle(
            fontSize: csDataStyleAvatarFontSize(pack, size),
            fontWeight: FontWeight.w700,
            color: csColor(pack.colorBrandOchre),
          ),
        ),
      ),
    );
  }
}

class CsAlert extends StatelessWidget {
  const CsAlert({
    super.key,
    required this.title,
    required this.message,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.variant = CsAlertVariant.info,
    this.icon,
    this.dismissLabel,
    this.language,
    this.onOpenChange,
    this.onClose,
    this.onDismiss,
  });

  final CsAlertVariant variant;
  final String title;
  final String message;
  final String? icon;
  final String? dismissLabel;
  final String? language;
  final void Function(bool open)? onOpenChange;
  final VoidCallback? onClose;
  final VoidCallback? onDismiss;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final tone = csColor(csAlertText(variant, pack));
    final borderColor = csColor(pack.colorBorderDefault);
    final borderWidth = csFeedbackStyleAlertBorderWidth();
    final closeName = csAlertBannerDismissName(
      dismissLabel,
      csAlertBannerCopy('dismiss', csSelectResolvedLanguage(language, CsLanguageScope.of(context))),
    );
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: csFeedbackStyleAlertPaddingX(),
        vertical: csFeedbackStyleAlertPaddingY(),
      ),
      decoration: BoxDecoration(
        color: csColor(pack.colorSurfacePanel),
        border: Border(
          left: BorderSide(color: tone, width: csFeedbackStyleAlertAccentBorderWidth()),
          top: BorderSide(color: borderColor, width: borderWidth),
          right: BorderSide(color: borderColor, width: borderWidth),
          bottom: BorderSide(color: borderColor, width: borderWidth),
        ),
        borderRadius: BorderRadius.circular(csPoints(pack.radiusMd)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ExcludeSemantics(
            child: Padding(
              padding: EdgeInsets.only(top: csFeedbackStyleAlertIconPaddingTop()),
              child: icon != null
                  ? Text(icon!, style: TextStyle(color: tone))
                  : CustomPaint(
                      size: const Size(20, 20),
                      painter: _AlertMarkPainter(tone, csAlertBannerMark(csAlertBannerVariantName(variant))),
                    ),
            ),
          ),
          SizedBox(width: csFeedbackStyleAlertGap()),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (csAlertBannerShows(title))
                  Text(title, style: TextStyle(fontSize: csFeedbackStyleAlertBodyFontSize(pack), fontWeight: FontWeight.w700, color: tone)),
                if (csAlertBannerShows(title) && csAlertBannerShows(message))
                  SizedBox(height: csFeedbackStyleAlertTitleMarginBottom()),
                if (csAlertBannerShows(message))
                  Text(message, style: TextStyle(fontSize: csFeedbackStyleAlertBodyFontSize(pack), color: csColor(pack.colorTextMuted))),
              ],
            ),
          ),
          if (csAlertBannerShowsDismiss(onOpenChange != null, onClose != null, onDismiss != null)) ...[
            SizedBox(width: csFeedbackStyleAlertGap()),
            CsOwnFocus(builder: (node, claim) => IconButton(
              focusNode: node,
              onPressed: () {
                claim();
                onOpenChange?.call(false);
                onClose?.call();
                onDismiss?.call();
              },
              tooltip: closeName,
              constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
              icon: const Text('×'),
            )),
          ],
        ],
      ),
    );
  }
}

class CsSlider extends StatelessWidget {
  const CsSlider({
    super.key,
    this.label,
    required this.value,
    required this.onChanged,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.minimum = 0,
    this.maximum = 100,
    this.disabled = false,
    this.language,
  });

  final String? label;
  final double value;
  final ValueChanged<double> onChanged;
  final double minimum;
  final double maximum;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final bool disabled;
  final String? language;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final lower = minimum < maximum ? minimum : maximum;
    final upper = minimum > maximum ? minimum : maximum;
    final spoken = csSliderCopy('label', csSelectResolvedLanguage(language, CsLanguageScope.of(context)));
    return Semantics(
      label: csSliderLabelText(label, spoken),
      child: ConstrainedBox(
        constraints: BoxConstraints(minHeight: csControlsWaveStyleSliderHeight()),
        child: CsOwnFocus(builder: (node, claim) => Slider(
          focusNode: node,
          value: value.clamp(lower, upper == lower ? lower + 1 : upper),
          min: lower,
          max: upper == lower ? lower + 1 : upper,
          activeColor: csColor(csFormsStyleCheckRadioAccentColor(dark, pack)),
          onChanged: disabled ? null : (next) { claim(); onChanged(next); },
        )),
      ),
    );
  }
}

class CsTabItem {
  const CsTabItem(this.value, this.label);
  final String value;
  final String label;
}

const csSliderLabel = 'Slider';
double csSliderUpper(double min, double max) => max < min ? min : max;
double csSliderSnap(double value, double min, double max, double? step) {
  final limit = csSliderUpper(min, max);
  final numeric = value.isFinite ? value : min;
  final clamped = numeric < min ? min : (numeric > limit ? limit : numeric);
  if (step == null || step <= 0 || !step.isFinite || limit <= min) return clamped;
  final steps = ((clamped - min) / step).round();
  final snapped = min + steps * step;
  return snapped < min ? min : (snapped > limit ? limit : snapped);
}
String csSliderLabelText(String? label, String fallback) => label ?? fallback;
String csSliderCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Thanh trượt'};
  const en = {'label': csSliderLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}

const csTabsList = 'Tabs';
int csTabsIndex(List<String> values, String value) => max(0, values.indexOf(value));
int csTabsStop(int index, int selected) => index == selected ? 0 : -1;
bool csTabsShowsCount(int? count) => count != null;
String csTabsListLabel(String? label, String fallback) => label ?? fallback;
String csTabsCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'list': 'Tab'};
  const en = {'list': csTabsList};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}

class CsTabs extends StatelessWidget {
  const CsTabs({
    super.key,
    this.label,
    required this.tabs,
    required this.selection,
    required this.onSelect,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.language,
  });

  final String? label;
  final String? language;
  final List<CsTabItem> tabs;
  final String selection;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Semantics(
      label: csTabsListLabel(label, csTabsCopy('list', csSelectResolvedLanguage(language, CsLanguageScope.of(context)))),
      child: Row(
        children: [
          for (final tab in tabs)
            Expanded(
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: csPoints(pack.componentButtonMdMinHeight)),
                child: CsOwnFocus(builder: (node, claim) => TextButton(
                  focusNode: node,
                  onPressed: () { claim(); onSelect(tab.value); },
                  child: Text(
                    tab.label,
                    style: TextStyle(
                      fontSize: csNavigationStyleTabFontSize(pack),
                      fontWeight: FontWeight.w600,
                      color: csColor(csNavigationStyleTabTextColor(pack, selected: selection == tab.value, dark: dark)),
                    ),
                  ),
                )),
              ),
            ),
        ],
      ),
    );
  }
}

int csSkeletonLines(double requested) {
  if (!requested.isFinite || requested >= 4294967296) return 0;
  final truncated = requested.truncate();
  return truncated < 0 ? 0 : truncated;
}
double csSkeletonLineWidth(int index, int count) => count > 0 && index == count - 1 ? 0.7 : 1;
bool csSkeletonCircle(String variant, int lines) => lines == 0 && variant == 'circle';
bool csSkeletonShimmer(bool reducedMotion) => !reducedMotion;

class CsSkeleton extends StatelessWidget {
  const CsSkeleton({
    super.key,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.lines = 0,
    this.circle = false,
    this.width = 120,
    this.height = 12,
  });

  final int lines;
  final bool circle;
  final double width;
  final double height;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final color = csColor(pack.colorBorderDefault);
    final radius = BorderRadius.circular(csPoints(pack.radiusSm));
    final count = csSkeletonLines(lines.toDouble());
    if (count > 0) {
      return ExcludeSemantics(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            for (var index = 0; index < count; index++)
              Container(
                margin: const EdgeInsets.only(bottom: 8),
                width: width * csSkeletonLineWidth(index, count),
                height: height,
                decoration: BoxDecoration(color: color, borderRadius: radius),
              ),
          ],
        ),
      );
    }
    final round = csSkeletonCircle(circle ? 'circle' : 'block', count);
    return ExcludeSemantics(
      child: Container(
        width: width,
        height: round ? width : height,
        decoration: BoxDecoration(
          color: color,
          shape: round ? BoxShape.circle : BoxShape.rectangle,
          borderRadius: round ? null : radius,
        ),
      ),
    );
  }
}

String csSpinnerLabel(String? label, String fallback) => label ?? fallback;
String csSpinnerCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Đang tải'};
  const en = {'label': 'Loading'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool csSpinnerSpins(bool reducedMotion) => !reducedMotion;
bool csSpinnerTopOchre(bool dark) => dark;

class CsSpinner extends StatelessWidget {
  const CsSpinner({
    super.key,
    this.label,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.size = 20,
    this.language,
  });

  final String? label;
  final String? language;
  final double size;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final name = csSpinnerLabel(label, csSpinnerCopy('label', csSelectResolvedLanguage(language, CsLanguageScope.of(context))));
    return Semantics(
      label: name,
      liveRegion: true,
      child: SizedBox(
        width: size,
        height: size,
        child: CircularProgressIndicator(
          strokeWidth: csFeedbackStyleSpinnerBorderWidth(),
          color: csColor(csSpinnerTopOchre(dark) ? pack.colorBrandOchre : pack.colorBrandUmber),
        ),
      ),
    );
  }
}

String csTagLabel(String? text, String fallback) => text ?? fallback;
String csTagCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'remove': 'Gỡ'};
  const en = {'remove': 'Remove'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}

class CsTag extends StatelessWidget {
  const CsTag({
    super.key,
    required this.title,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.removeLabel,
    this.onRemove,
    this.language,
  });

  final String title;
  final String? removeLabel;
  final String? language;
  final VoidCallback? onRemove;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final spoken = csTagLabel(removeLabel, csTagCopy('remove', csSelectResolvedLanguage(language, CsLanguageScope.of(context))));
    return DecoratedBox(
      decoration: BoxDecoration(
        color: csColor(pack.colorSurfaceRaised),
        borderRadius: BorderRadius.circular(csPoints(pack.radiusSm)),
        border: Border.all(color: csColor(pack.colorBorderDefault), width: csFeedbackStyleTagBorderWidth()),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: EdgeInsets.symmetric(
              horizontal: csFeedbackStyleTagPaddingX(),
              vertical: csFeedbackStyleTagPaddingY(),
            ),
            child: Text(
              title,
              style: TextStyle(
                fontSize: csFeedbackStyleTagFontSize(pack),
                fontWeight: FontWeight.w600,
                color: csColor(pack.colorTextPrimary),
              ),
            ),
          ),
          if (onRemove != null)
            CsOwnFocus(builder: (node, claim) => Semantics(
              label: spoken,
              button: true,
              child: IconButton(
                focusNode: node,
                onPressed: () { claim(); onRemove!(); },
                tooltip: spoken,
                constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
                icon: const ExcludeSemantics(child: Text('×')),
              ),
            )),
        ],
      ),
    );
  }
}

class CsStat extends StatelessWidget {
  const CsStat({
    super.key,
    required this.label,
    required this.value,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.delta,
    this.trend = CsStatTrend.flat,
  });

  final String label;
  final String value;
  final String? delta;
  final CsStatTrend trend;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final dir = switch (trend) {
      CsStatTrend.up => 'up',
      CsStatTrend.down => 'down',
      CsStatTrend.flat => 'flat',
    };
    final ink = csDataStyleStatDeltaColor(dir, pack);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: TextStyle(
            fontSize: csDataStyleStatLabelFontSize(pack),
            fontWeight: FontWeight.w600,
            color: csColor(pack.colorTextMuted),
          ),
        ),
        SizedBox(height: csDataStyleStatGap()),
        Text(
          value,
          style: TextStyle(
            fontSize: csDataStyleStatValueFontSize(pack),
            fontWeight: FontWeight.w800,
            color: csColor(pack.colorTextPrimary),
          ),
        ),
        if (csStatShowsDelta(delta))
          Row(children: [
            ExcludeSemantics(child: Text(csStatMark(trend), style: TextStyle(fontSize: csDataStyleStatDeltaFontSize(pack), fontWeight: FontWeight.w700, color: csColor(ink)))),
            SizedBox(width: csDataStyleStatDeltaGap()),
            Text(delta ?? '', style: TextStyle(fontSize: csDataStyleStatDeltaFontSize(pack), fontWeight: FontWeight.w700, color: csColor(ink))),
          ]),
      ],
    );
  }
}
