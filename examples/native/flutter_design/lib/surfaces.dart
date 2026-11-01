import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'controls.dart';
import 'cs_modes.dart';
import 'fields.dart';

const csColorDefaultValue = '#f4ba17';
const csColorHexMaxLength = 7;
const csColorTriggerHasPopup = 'dialog';
const csColorListboxRole = 'listbox';
const csColorOptionRole = 'option';
const csColorDefaultSwatches = <String>['#F4BA17', '#C77B4A', '#E0632B', '#C43D1F', '#7A9B57', '#3E5A2E', '#4E8E9B', '#2E5E7E', '#BFB29B', '#45210E'];
String csColorPlacement(String? placement) => placement ?? 'bottom-start';
String? csColorDescriptionId(String id, String? description) =>
    description == null || description.isEmpty ? null : '$id-description';
String? csColorErrorId(String id, String? error) =>
    error == null || error.isEmpty ? null : '$id-error';
String? csColorDescribedBy(String? explicit, String? descriptionId, String? errorId) {
  final parts = <String>[
    if (explicit != null && explicit.isNotEmpty) explicit,
    if (descriptionId != null && descriptionId.isNotEmpty) descriptionId,
    if (errorId != null && errorId.isNotEmpty) errorId,
  ];
  return parts.isEmpty ? null : parts.join(' ');
}
bool csColorInvalid(String? error) => error != null && error.isNotEmpty;
String? csColorCommit(String value) {
  if (value.length != 7 || !value.startsWith('#')) return null;
  final hex = value.substring(1);
  if (RegExp(r'^[0-9a-fA-F]{6}$').hasMatch(hex)) return value;
  return null;
}
const csColorLabel = 'Color';
const csColorHex = 'Hex value';
String csColorCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Màu', 'hex': 'Giá trị hex'};
  const en = {'label': csColorLabel, 'hex': csColorHex};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String? csColorFieldName(String? label, String? labelledBy, String value, String fallback) {
  if (labelledBy != null && labelledBy.isNotEmpty) return null;
  final name = label != null && label.isNotEmpty ? label : fallback;
  return '$name: $value';
}
String? csColorDialogName(String? label, String? labelledBy, String fallback) {
  if (labelledBy != null && labelledBy.isNotEmpty) return null;
  return label != null && label.isNotEmpty ? label : fallback;
}
bool csColorSelected(String swatch, String value) => swatch.toLowerCase() == value.toLowerCase();
bool csColorSubmits({required bool composing, required int keyCode}) => !composing && keyCode != 229;
bool csColorDismissOutside(bool open, bool inside) => open && !inside;
const csColorGap = 6.0;
class CsColorPlace {
  const CsColorPlace(this.x, this.y, this.maxWidth, this.maxHeight, this.placement);
  final double x;
  final double y;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsColorPlace? csColorShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY, {String placement = 'bottom-start'}) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: placement, gap: csColorGap);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: csColorGap);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsColorPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}

const csSplitterDefaultInitial = 50.0;
const csSplitterDefaultMin = 20.0;
const csSplitterDefaultMax = 80.0;
const csSplitterDefaultHeight = 180.0;
const csSplitterSeparatorRole = 'separator';
const csSplitterOrientation = 'vertical';
double csSplitterClamp(double value, {double lower = 20, double upper = 80}) =>
    value < lower ? lower : (value > upper ? upper : value);
double csSplitterRightPercent(double leftPercent, {double lower = 20, double upper = 80}) =>
    100.0 - csSplitterClamp(leftPercent, lower: lower, upper: upper);
bool csSplitterAcceptsKey({required bool composing, required int keyCode}) =>
    !composing && keyCode != 229;

double csSplitterNudge(double value, {required bool right, required bool rtl, double lower = 20, double upper = 80}) {
  final delta = (right ? 2 : -2) * (rtl ? -1 : 1);
  return csSplitterClamp(csSplitterClamp(value, lower: lower, upper: upper) + delta, lower: lower, upper: upper);
}
bool csSplitterAcceptsPointer(int button, int pointerId, int eventPointer) => button == 0 && pointerId == eventPointer;
double? csSplitterDrag(double start, double grabX, double currentX, double wrapWidth, double handleWidth, bool rtl, {double lower = 20, double upper = 80}) {
  final available = wrapWidth - handleWidth;
  if (available <= 0) return null;
  final distance = (currentX - grabX) * (rtl ? -1 : 1);
  return csSplitterClamp(start + (distance / available) * 100, lower: lower, upper: upper);
}
const csSplitterLabel = 'Resize panes';
String csSplitterCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Đổi kích thước khung'};
  const en = {'label': csSplitterLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csSplitterName(String? label, String fallback) => label ?? fallback;
String csSplitterBoundsText(double value, {double lower = 20, double upper = 80}) =>
    '${csSplitterClamp(value, lower: lower, upper: upper).round()} (${lower.round()}-${upper.round()})';

const csDatePlaceholder = 'Select a date';
const csDateTriggerHasPopup = 'dialog';
const csDateDialogRole = 'dialog';
double csDateIconSize() => 16;
double csDateIconStrokeWidth() => 1.8;
String csDatePlacement(String? placement) => placement ?? 'bottom-start';
String? csDateDescriptionId(String id, String? description) =>
    description == null || description.isEmpty ? null : '$id-description';
String? csDateErrorId(String id, String? error) =>
    error == null || error.isEmpty ? null : '$id-error';
String? csDateDescribedBy(String? explicit, String? descriptionId, String? errorId) {
  final parts = <String>[
    if (explicit != null && explicit.isNotEmpty) explicit,
    if (descriptionId != null && descriptionId.isNotEmpty) descriptionId,
    if (errorId != null && errorId.isNotEmpty) errorId,
  ];
  return parts.isEmpty ? null : parts.join(' ');
}
bool csDateInvalid(String? error) => error != null && error.isNotEmpty;
String csDatePlaceholderText(String? text, String fallback) => text ?? fallback;
String csDateCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'placeholder': 'Chọn ngày'};
  const en = {'placeholder': 'Select a date'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csDateDialogLabel(String? label, String? placeholder, String fallback) {
  final name = label?.trim() ?? '';
  if (name.isNotEmpty) return name;
  final hint = placeholder?.trim() ?? '';
  return hint.isEmpty ? fallback : hint;
}
String? csDateDialogName(String? label, String? labelledBy, String dialog) {
  final name = label?.trim() ?? '';
  if (name.isNotEmpty) return dialog;
  if (labelledBy != null && labelledBy.isNotEmpty) return null;
  return dialog;
}
bool csDateOpen({required bool requested, required bool disabled}) => requested && !disabled;
const csDateGap = 6.0;
class CsDatePlace {
  const CsDatePlace(this.x, this.y, this.maxWidth, this.maxHeight, this.placement);
  final double x;
  final double y;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsDatePlace? csDateShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY, {String placement = 'bottom-start'}) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: placement, gap: csDateGap);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: csDateGap);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsDatePlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}

String csDateFormat(int day, int month, int year, String? language) {
  final code = csSelectPrimaryLanguage(language) ?? 'vi';
  final dd = day.toString().padLeft(2, '0');
  final mm = (month + 1).toString().padLeft(2, '0');
  if (code == 'vi') return '$dd/$mm/$year';
  if (code == 'ja') return '$year/$mm/$dd';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return '$dd ${months[month]} $year';
}

const csChatYou = 'You';
const csChatLumi = 'Lumi';
const csChatDefaultRole = 'lumi';
const csChatArticleRole = 'article';
bool csChatIsUser(String role) => role == 'user';
String csChatRootClass(String role) => 'cs-chat cs-chat--$role';
bool csChatShowsSlot(String? value) => value != null && value.isNotEmpty;
String csChatUserInitial(String speaker) => speaker.isEmpty ? '' : speaker.substring(0, 1).toUpperCase();
String csChatSpeaker(String? name, String role, String you, String lumi) => name ?? (csChatIsUser(role) ? you : lumi);
String csChatDefaultAvatar(String role, String you) => csChatIsUser(role) ? you : csAiStyleLumiGlyph;
String csChatCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'you': 'Bạn'};
  const en = {'you': csChatYou};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
const csImagePreview = 'Preview image';
const csImageDialogRole = 'dialog';
const csImageFallbackMark = 'M21 15l-5-5-9 9';
double csImageFallbackIconSize() => 28;
double csImageFallbackIconStrokeWidth() => 1.6;
String csImageRootClass(String state, bool canPreview) {
  final classes = <String>['cs-image'];
  if (state == 'loading') classes.add('is-loading');
  if (canPreview) classes.add('is-zoomable');
  return classes.join(' ');
}
bool csImageAcceptsPreviewKey(String key) => key == 'Enter' || key == ' ';
String csImagePreviewName(String alt, String fallback) => alt.isEmpty ? fallback : '$fallback: $alt';
String csImageCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'preview': 'Xem ảnh', 'close': 'Đóng'};
  const en = {'preview': 'Preview image', 'close': 'Close'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool csImageCanPreview(bool preview, String state) => preview && state == 'ok';
bool csImagePreviewOpen(bool zoom, bool preview, String state) => zoom && csImageCanPreview(preview, state);
String csImageDialogName(String alt, String fallback) => alt.isEmpty ? fallback : alt;
bool csImageShowsFallback(String? fallback) => fallback != null && fallback.isNotEmpty;
const csIconDefaultSize = 'md';
const csIconViewBox = '0 0 24 24';
const csIconDefaultStrokeWidth = 1.75;
bool csIconIsDecorative(String label) => label.isEmpty;
String? csIconRole(String label) => csIconIsDecorative(label) ? null : 'img';
double csIconPoints(String size) {
  switch (size) {
    case 'xs': return 14;
    case 'sm': return 16;
    case 'lg': return 24;
    case 'xl': return 32;
    default: return 20;
  }
}
const csAnchorNavRole = 'navigation';
String? csAnchorActive(List<String> visibleIds) => visibleIds.isEmpty ? null : visibleIds.first;
String? csAnchorResolvedActive(List<String> visibleIds, List<String> itemIds, [String? explicit]) =>
    explicit != null && explicit.isNotEmpty ? explicit : (csAnchorActive(visibleIds) ?? (itemIds.isEmpty ? null : itemIds.first));
bool csAnchorShowsTitle(String? title) => title != null && title.isNotEmpty;
String? csAnchorTitleId(String baseId, String? title) => csAnchorShowsTitle(title) ? '$baseId-title' : null;
String csAnchorItemHref(String id) => '#$id';
String csAnchorLinkClass(bool active) => active ? 'cs-anchor__link is-active' : 'cs-anchor__link';
String? csAnchorAriaCurrent(bool isActive) => isActive ? 'location' : null;

class CsColorPicker extends StatefulWidget {
  const CsColorPicker({super.key, this.value = csColorDefaultValue, this.swatches = csColorDefaultSwatches, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.label, this.labelledBy, this.description, this.error, this.required = false, this.ariaDescribedBy, this.portal = true, this.placement, this.language});
  final String? label;
  final String? labelledBy;
  final String? description;
  final String? error;
  final bool required;
  final String? ariaDescribedBy;
  final bool portal;
  final String? placement;
  final String? language;
  final String value;
  final List<String> swatches;
  final ValueChanged<String> onChange;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  State<CsColorPicker> createState() => _CsColorPickerState();
}

class _CsColorPickerState extends State<CsColorPicker> {
  var open = false;
  final fieldKey = GlobalKey();
  final listKey = GlobalKey();
  Size? natural;
  Size? fitted;
  CsColorPlace? place;

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
    final next = csColorShift(
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
      placement: csColorPlacement(widget.placement),
    );
    setState(() { fitted = listBox.size; place = next; });
  }
  late final hex = TextEditingController(text: widget.value);

  @override
  void didUpdateWidget(CsColorPicker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value && hex.text != widget.value) hex.text = widget.value;
  }

  @override
  void dispose() {
    hex.dispose();
    super.dispose();
  }

  void _commit() {
    final next = csColorCommit(hex.text);
    if (next != null) widget.onChange(next);
  }

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final fallback = csColorCopy('label', locale);
    final name = csColorFieldName(widget.label, widget.labelledBy, widget.value, fallback);
    final dialog = csColorDialogName(widget.label, widget.labelledBy, fallback);
    if (!open) { natural = null; fitted = null; }
    if (open) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && open) measure(); });
    return TapRegion(
      onTapOutside: open && csColorDismissOutside(true, false) ? (_) { setState(() => open = false); } : null,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Semantics(
        button: true,
        label: name,
        toggled: open,
        child: CsOwnFocus(builder: (node, claim) => TextButton(key: fieldKey, focusNode: node, onPressed: () { claim(); setState(() => open = !open); }, child: ExcludeSemantics(child: Text(widget.value)))),
      ),
      if (open) Semantics(
        namesRoute: true,
        label: dialog,
        child: Focus(
          onKeyEvent: (node, event) {
            if (event is! KeyDownEvent || event.logicalKey != LogicalKeyboardKey.escape) return KeyEventResult.ignored;
            setState(() => open = false);
            return KeyEventResult.handled;
          },
          child: Transform.translate(offset: Offset(place?.x ?? 0, place?.y ?? 0), child: Column(key: listKey, crossAxisAlignment: CrossAxisAlignment.start, children: [
            for (final swatch in widget.swatches)
              Semantics(
                button: true,
                label: swatch,
                toggled: csColorSelected(swatch, widget.value),
                child: ConstrainedBox(constraints: BoxConstraints(minWidth: csControlsBatchStyleColorPickerCellSize(), minHeight: csControlsBatchStyleColorPickerCellSize()), child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); final next = csColorCommit(swatch); if (next != null) { widget.onChange(next); setState(() => open = false); } }, child: ExcludeSemantics(child: Text(swatch))))),
              ),
            Semantics(
              textField: true,
              label: csColorCopy('hex', locale),
              child: ConstrainedBox(constraints: BoxConstraints(minWidth: csControlsBatchStyleColorPickerHexInputWidth()), child: TextField(controller: hex, onSubmitted: (_) { if (!csColorSubmits(composing: false, keyCode: 0)) return; _commit(); setState(() => open = false); }, onEditingComplete: _commit)),
            ),
          ])),
        ),
      ),
      if (widget.description != null && widget.description!.isNotEmpty) Text(widget.description!),
      if (widget.error != null && widget.error!.isNotEmpty) Text(widget.error!),
    ]),
    );
  }
}

class CsSplitter extends StatefulWidget {
  const CsSplitter({super.key, required this.start, required this.end, this.percent = csSplitterDefaultInitial, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.initial = csSplitterDefaultInitial, this.min = csSplitterDefaultMin, this.max = csSplitterDefaultMax, this.height = csSplitterDefaultHeight, this.label, this.language});
  final String start;
  final String end;
  final double percent;
  final double initial;
  final double min;
  final double max;
  final double height;
  final String? label;
  final String? language;
  final ValueChanged<double> onChange;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  State<CsSplitter> createState() => _CsSplitterState();
}

class _CsSplitterState extends State<CsSplitter> {
  final handleKey = GlobalKey();
  double wrapWidth = 0;
  double? dragStart;
  double? grabX;

  @override
  Widget build(BuildContext context) {
    final rtl = Directionality.of(context) == TextDirection.rtl;
    final spoken = csSplitterName(widget.label, csSplitterCopy('label', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context))));
    final clampedPercent = csSplitterClamp(widget.percent, lower: widget.min, upper: widget.max);
    return Focus(
      onKeyEvent: (node, event) {
        if (event is! KeyDownEvent) return KeyEventResult.ignored;
        if (event.logicalKey == LogicalKeyboardKey.arrowRight) {
          widget.onChange(csSplitterNudge(clampedPercent, right: true, rtl: rtl, lower: widget.min, upper: widget.max));
          return KeyEventResult.handled;
        }
        if (event.logicalKey == LogicalKeyboardKey.arrowLeft) {
          widget.onChange(csSplitterNudge(clampedPercent, right: false, rtl: rtl, lower: widget.min, upper: widget.max));
          return KeyEventResult.handled;
        }
        return KeyEventResult.ignored;
      },
      child: LayoutBuilder(builder: (context, constraints) {
        final nextWrap = constraints.maxWidth.isFinite ? constraints.maxWidth : wrapWidth;
        return ConstrainedBox(
          constraints: BoxConstraints(minHeight: widget.height),
          child: Row(children: [
            Padding(padding: EdgeInsets.all(csControlsBatchStyleSplitterPanePadding()), child: Text(widget.start)),
            Semantics(
              button: true,
              label: spoken,
              value: clampedPercent.round().toString(),
              child: GestureDetector(
                onHorizontalDragStart: (details) { dragStart = clampedPercent; grabX = details.globalPosition.dx; },
                onHorizontalDragUpdate: (details) {
                  final start = dragStart;
                  final grab = grabX;
                  if (start == null || grab == null) return;
                  final box = handleKey.currentContext?.findRenderObject() as RenderBox?;
                  final next = csSplitterDrag(start, grab, details.globalPosition.dx, nextWrap, box?.size.width ?? 0, rtl, lower: widget.min, upper: widget.max);
                  if (next != null) widget.onChange(next);
                },
                onHorizontalDragEnd: (_) { dragStart = null; grabX = null; },
                onHorizontalDragCancel: () { dragStart = null; grabX = null; },
                child: ConstrainedBox(constraints: BoxConstraints(minWidth: csControlsBatchStyleSplitterBarWidth()), child: CsOwnFocus(builder: (node, claim) => TextButton(key: handleKey, focusNode: node, onPressed: () { claim(); widget.onChange(csSplitterNudge(clampedPercent, right: true, rtl: rtl, lower: widget.min, upper: widget.max)); }, child: ExcludeSemantics(child: Text(spoken))))),
              ),
            ),
            Padding(padding: EdgeInsets.all(csControlsBatchStyleSplitterPanePadding()), child: Text(widget.end)),
          ]),
        );
      }),
    );
  }
}

class CsDatePicker extends StatefulWidget {
  const CsDatePicker({super.key, this.label, this.labelledBy, this.description, this.error, this.required = false, this.ariaDescribedBy, required this.text, required this.requestedOpen, required this.disabled, required this.onOpenChange, required this.dark, required this.highContrast, required this.compact, this.placeholder, this.portal = true, this.placement, this.language, this.onValue});
  final String? label;
  final String? labelledBy;
  final String? description;
  final String? error;
  final bool required;
  final String? ariaDescribedBy;
  final String? placeholder;
  final bool portal;
  final String? placement;
  final String? language;
  final String text;
  final bool requestedOpen;
  final bool disabled;
  final ValueChanged<bool> onOpenChange;
  final ValueChanged<String>? onValue;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  State<CsDatePicker> createState() => _CsDatePickerState();
}

class _CsDatePickerState extends State<CsDatePicker> {
  final fieldKey = GlobalKey();
  final listKey = GlobalKey();
  Size? natural;
  Size? fitted;
  CsDatePlace? place;

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
    final next = csDateShift(
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
      placement: csDatePlacement(widget.placement),
    );
    setState(() { fitted = listBox.size; place = next; });
  }

  @override
  Widget build(BuildContext context) {
    final open = csDateOpen(requested: widget.requestedOpen, disabled: widget.disabled);
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final fallback = csDateCopy('placeholder', locale);
    final hint = csDatePlaceholderText(widget.placeholder, fallback);
    final face = widget.text.isEmpty ? hint : widget.text;
    final name = (widget.labelledBy != null && widget.labelledBy!.isNotEmpty && (widget.label == null || widget.label!.isEmpty))
        ? null
        : ((widget.label == null || widget.label!.isEmpty) ? face : widget.label!);
    final dialogLabel = csDateDialogLabel(widget.label, widget.placeholder, fallback);
    final dialogName = csDateDialogName(widget.label, widget.labelledBy, dialogLabel);
    final parsed = csDateParse(widget.text, locale);
    final now = DateTime.now();
    final seedYear = parsed?.year ?? now.year;
    final seedMonth = parsed?.month ?? now.month - 1;
    if (!open) { natural = null; fitted = null; }
    if (open) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && widget.requestedOpen && !widget.disabled) measure(); });
    return TapRegion(
      onTapOutside: open ? (_) => widget.onOpenChange(false) : null,
      child: Focus(
        onKeyEvent: (node, event) {
          if (event is! KeyDownEvent || event.logicalKey != LogicalKeyboardKey.escape || !open) return KeyEventResult.ignored;
          widget.onOpenChange(false);
          return KeyEventResult.handled;
        },
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          CsOwnFocus(builder: (node, claim) => Semantics(label: name, button: true, child: ConstrainedBox(constraints: BoxConstraints(minWidth: csControlsWaveStyleDatePickerFieldMinWidth()), child: TextButton(key: fieldKey, focusNode: node, onPressed: widget.disabled ? null : () { claim(); widget.onOpenChange(!open); }, child: ExcludeSemantics(child: Text('📅 $face')))))),
          if (open) Opacity(opacity: place == null ? 0 : 1, child: Semantics(namesRoute: true, label: dialogName, child: Transform.translate(key: listKey, offset: Offset(place?.x ?? 0, place?.y ?? 0), child: CsCalendar(
            monthLabel: csCalendarHeading(seedMonth, seedYear, locale),
            year: seedYear,
            month: seedMonth,
            selected: parsed?.day,
            onSelect: (_) {},
            onChoose: (date) {
              widget.onValue?.call(csDateFormat(date.day, date.month, date.year, locale));
              widget.onOpenChange(false);
            },
            dark: widget.dark,
            highContrast: widget.highContrast,
            compact: widget.compact,
            language: locale,
          )))),
          if (widget.description != null && widget.description!.isNotEmpty) Text(widget.description!),
          if (widget.error != null && widget.error!.isNotEmpty) Text(widget.error!),
        ]),
      ),
    );
  }
}

class CsChatMessage extends StatelessWidget {
  const CsChatMessage({super.key, this.role = csChatDefaultRole, this.name, this.meta, this.actions, this.avatar, required this.bodyText, required this.dark, required this.highContrast, required this.compact, this.language});
  final String role;
  final String? name;
  final String? meta;
  final String? actions;
  final String? avatar;
  final String? language;
  final String bodyText;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final user = csChatIsUser(role);
    final you = csChatCopy('you', csSelectResolvedLanguage(language, CsLanguageScope.of(context)));
    final speaker = csChatSpeaker(name, role, you, csChatLumi);
    final avatarText = avatar ?? csChatDefaultAvatar(role, you);
    return Column(crossAxisAlignment: user ? CrossAxisAlignment.end : CrossAxisAlignment.start, children: [
      ExcludeSemantics(child: Text(avatarText, style: TextStyle(color: csColor(pack.colorTextMuted)))),
      Row(mainAxisSize: MainAxisSize.min, children: [
        Text(speaker, style: TextStyle(color: csColor(pack.colorTextMuted), fontSize: csAiStyleChatNameFontSize(pack))),
        if (csChatShowsSlot(meta)) ...[
          const SizedBox(width: 6),
          Text(meta!, style: TextStyle(color: csColor(pack.colorTextMuted), fontSize: csAiStyleChatNameFontSize(pack))),
        ],
      ]),
      SizedBox(height: csAiStyleChatColGap()),
      Padding(
        padding: EdgeInsets.symmetric(horizontal: csAiStyleChatBubblePaddingX(), vertical: csAiStyleChatBubblePaddingY()),
        child: Text(bodyText, style: TextStyle(color: csColor(user ? pack.colorSemanticInfoFg : pack.colorTextPrimary), fontSize: csAiStyleChatBubbleFontSize(pack))),
      ),
      if (csChatShowsSlot(actions)) Text(actions!, style: TextStyle(color: csColor(pack.colorTextMuted))),
    ]);
  }
}

class CsAnchor extends StatelessWidget {
  const CsAnchor({super.key, this.title = '', this.items = const [], this.activeId, this.visibleIds = const [], this.onSelect, required this.dark, required this.highContrast, required this.compact});
  final String title;
  final List<(String, String)> items;
  final String? activeId;
  final List<String> visibleIds;
  final ValueChanged<String>? onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final active = csAnchorResolvedActive(visibleIds, [for (final item in items) item.$1], activeId);
    return ConstrainedBox(
      constraints: BoxConstraints(minWidth: csControlsBatchStyleAnchorMinWidth()),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        if (csAnchorShowsTitle(title)) Text(title, style: const TextStyle(fontSize: csControlsBatchStyleAnchorTitleFontSize)),
        for (final item in items)
          Semantics(
            value: csAnchorAriaCurrent(item.$1 == active),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: csControlsBatchStyleAnchorItemPaddingX(), vertical: csControlsBatchStyleAnchorItemPaddingY()),
              child: Text(item.$2, style: TextStyle(fontWeight: item.$1 == active ? FontWeight.w700 : FontWeight.w400)),
            ),
          ),
      ]),
    );
  }
}

class CsCitation {
  const CsCitation(this.title, {this.source, this.href});
  final String title;
  final String? source;
  final String? href;
}

const csCitationLabel = 'Sources';
const csCitationRootClass = 'cs-citations';
const csCitationItemClass = 'cs-citation';
const csCitationTarget = '_blank';
const csCitationRel = 'noreferrer';
bool csCitationShowsHeading(String? heading) => heading != null && heading.isNotEmpty;
String? csCitationHeading(String? label, bool omitted, String fallback) => omitted ? fallback : (label == null || label.isEmpty ? null : label);
String csCitationCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'sources': 'Nguồn'};
  const en = {'sources': csCitationLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String? csCitationSource(String? source) => source == null || source.isEmpty ? null : ' · $source';
String? csCitationHref(String? href) => href == null || href.isEmpty ? null : href;
String csCitationLine(int index, String title, String? source) => '${index + 1} $title${csCitationSource(source) ?? ''}';
class CsCitationList extends StatelessWidget {
  const CsCitationList({super.key, this.label, this.items = const [], this.citations = const [], required this.dark, required this.highContrast, required this.compact, this.language});
  final String? label;
  final String? language;
  final List<String> items;
  final List<CsCitation> citations;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final heading = csCitationHeading(label, label == null, csCitationCopy('sources', csSelectResolvedLanguage(language, CsLanguageScope.of(context))));
    final rows = citations.isNotEmpty ? citations : [for (final item in items) CsCitation(item)];
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (heading != null) Text(heading, style: TextStyle(fontSize: csAiStyleCitationsLabelFontSize(pack))),
      for (var index = 0; index < rows.length; index++)
        Padding(
          padding: EdgeInsets.only(top: index > 0 ? csAiStyleCitationsGap() : 0),
          child: Semantics(
            link: csCitationHref(rows[index].href) != null,
            hint: csCitationHref(rows[index].href),
            child: Text(csCitationLine(index, rows[index].title, rows[index].source), style: TextStyle(fontSize: csAiStyleCitationFontSize(pack))),
          ),
        ),
    ]);
  }
}

const csScrollAreaRootClass = 'cs-scroll-area';
const csScrollAreaTabIndex = 0;
String? csScrollAreaMaxBlockSize(double? maxHeight) => maxHeight == null ? null : '${maxHeight.round()}px';
class CsScrollArea extends StatelessWidget {
  const CsScrollArea({super.key, this.maxHeight, required this.child});
  final double? maxHeight;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final scrollable = Padding(
      padding: EdgeInsets.all(csDataStyleScrollAreaFocusOutlineWidth(false)),
      child: SingleChildScrollView(child: child),
    );
    return Focus(
      canRequestFocus: csDataStyleScrollAreaTabStop() == 0,
      child: maxHeight == null
          ? scrollable
          : ConstrainedBox(constraints: BoxConstraints(maxHeight: maxHeight!), child: scrollable),
    );
  }
}

class CsImage extends StatefulWidget {
  const CsImage({super.key, this.src, this.alt = '', required this.dark, required this.highContrast, required this.compact, this.ratio = '16 / 9', this.preview = false, this.state = 'loading', this.fallback, this.language});
  final String? src;
  final String alt;
  final bool preview;
  final String state;
  final String? fallback;
  final String? language;
  final String ratio;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsImage> createState() => _CsImageState();
}

class _CsImageState extends State<CsImage> {
  var zoom = false;

  @override
  void didUpdateWidget(CsImage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.src != widget.src || oldWidget.preview != widget.preview) {
      zoom = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final previewWord = csImageCopy('preview', locale);
    final closeWord = csImageCopy('close', locale);
    final canPreview = csImageCanPreview(widget.preview, widget.state);
    final isZoomOpen = csImagePreviewOpen(zoom, widget.preview, widget.state);
    final name = canPreview ? csImagePreviewName(widget.alt, previewWord) : widget.alt;
    return Focus(
      onKeyEvent: (node, event) {
        if (event is! KeyDownEvent || event.logicalKey != LogicalKeyboardKey.escape || !isZoomOpen) return KeyEventResult.ignored;
        setState(() => zoom = false);
        return KeyEventResult.handled;
      },
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        GestureDetector(
          onTap: canPreview ? () => setState(() => zoom = true) : null,
          child: Semantics(
            button: canPreview,
            label: name,
            child: SizedBox(
              width: math.max(160, csControlsBatchStyleImageLoadingMinWidth()),
              height: math.max(90, csControlsBatchStyleImageLoadingMinHeight()),
              child: widget.state == 'error'
                  ? Text(csImageShowsFallback(widget.fallback) ? widget.fallback! : csImageFallbackMark)
                  : null,
            ),
          ),
        ),
        if (isZoomOpen)
          Semantics(
            namesRoute: true,
            label: csImageDialogName(widget.alt, previewWord),
            child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              TextButton(onPressed: () => setState(() => zoom = false), child: Text(closeWord)),
              Text(widget.alt),
            ]),
          ),
      ]),
    );
  }
}

const csLogoViewBox = '0 0 512 512';
const csLogoRootClass = 'cs-logo';
String? csLogoRole(bool decorative) => decorative ? null : 'img';
String csLogoTitleMarkup(bool decorative, String title) =>
    decorative ? '' : '<title>${csLogoStyleEscapeTitle(title)}</title>';
class CsLogo extends StatelessWidget {
  const CsLogo({super.key, required this.dark, required this.highContrast, required this.compact, this.title = csLogoStyleDefaultTitle, this.decorative = false, this.size = 32});
  final String title;
  final bool decorative;
  final double size;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final label = csLogoStyleAriaLabel(title, decorative);
    final text = Text(title);
    final height = csLogoStyleAutoBlockSize() ? size : null;
    return SizedBox(width: size, height: height, child: csLogoStyleAriaHidden(decorative) == true ? ExcludeSemantics(child: text) : Semantics(image: true, label: label, child: ExcludeSemantics(child: text)));
  }
}

const csContextMenu = 'Context menu';
const csContextZoneRole = 'group';
const csContextMenuRole = 'menu';
const csContextItemRole = 'menuitem';
const csContextSeparatorRole = 'separator';
const csContextDefaultPlacement = 'bottom-start';
String csContextResolvedPlacement(String? placement) => placement ?? csContextDefaultPlacement;
String csContextItemClass(bool danger) => danger ? 'cs-menu__item cs-menu__item--danger' : 'cs-menu__item';
bool csContextOpensFromKeyboard(String key, bool shiftKey) => key == 'ContextMenu' || (key == 'F10' && shiftKey);
bool csContextAcceptsKey({required bool composing, required int keyCode}) => !composing && keyCode != 229;
bool csContextEscapeClose() => false;
bool csContextIsSeparator(String item) => item == '-';
int? csContextFirst(List<String> items) {
  final index = items.indexWhere((item) => !csContextIsSeparator(item));
  return index < 0 ? null : index;
}
(double, double) csContextPoint(double clientX, double clientY, double left, double top) => (clientX - left, clientY - top);
(double, double) csContextKeyboardPoint(double height) => (0, height);
class CsFloatingRect {
  const CsFloatingRect(this.left, this.top, this.right, this.bottom, this.width, this.height);
  final double left;
  final double top;
  final double right;
  final double bottom;
  final double width;
  final double height;
}
class CsFloatingResult {
  const CsFloatingResult(this.left, this.top, this.maxWidth, this.maxHeight, {this.placement = 'bottom-start'});
  final double left;
  final double top;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsFloatingResult? csFloatingPlace(CsFloatingRect anchor, double panelWidth, double panelHeight, CsFloatingRect viewport, {String placement = 'bottom-start', double gap = 8, String direction = 'ltr'}) {
  const names = ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'];
  if (!names.contains(placement)) return null;
  final parts = placement.split('-');
  final preferred = parts[0];
  final alignment = parts.length > 1 ? parts[1] : null;
  const opposite = {'top': 'bottom', 'bottom': 'top', 'left': 'right', 'right': 'left'};
  final available = {
    'top': anchor.top - viewport.top - gap,
    'bottom': viewport.bottom - anchor.bottom - gap,
    'left': anchor.left - viewport.left - gap,
    'right': viewport.right - anchor.right - gap,
  };
  final dimension = preferred == 'top' || preferred == 'bottom' ? panelHeight : panelWidth;
  final preferredSpace = available[preferred] ?? 0;
  final oppositeSpace = available[opposite[preferred]] ?? 0;
  final side = dimension > preferredSpace && oppositeSpace > preferredSpace ? opposite[preferred]! : preferred;
  final vertical = side == 'top' || side == 'bottom';
  final String? align = vertical && direction == 'rtl' ? (alignment == 'start' ? 'end' : alignment == 'end' ? 'start' : null) : alignment;
  var left = vertical ? (align == 'start' ? anchor.left : align == 'end' ? anchor.right - panelWidth : anchor.left + (anchor.width - panelWidth) / 2) : (side == 'left' ? anchor.left - gap - panelWidth : anchor.right + gap);
  var top = vertical ? (side == 'top' ? anchor.top - gap - panelHeight : anchor.bottom + gap) : (align == 'start' ? anchor.top : align == 'end' ? anchor.bottom - panelHeight : anchor.top + (anchor.height - panelHeight) / 2);
  double clamp(double value, double start, double end) {
    final limit = start > end ? start : end;
    final bounded = value < limit ? value : limit;
    return start > bounded ? start : bounded;
  }
  left = clamp(left, viewport.left, viewport.right - panelWidth);
  top = clamp(top, viewport.top, viewport.bottom - panelHeight);
  final maxWidth = (vertical ? viewport.right - viewport.left : (available[side] ?? 0)) < 0 ? 0.0 : (vertical ? viewport.right - viewport.left : (available[side] ?? 0));
  final maxHeight = (vertical ? (available[side] ?? 0) : viewport.bottom - viewport.top) < 0 ? 0.0 : (vertical ? (available[side] ?? 0) : viewport.bottom - viewport.top);
  final name = alignment == null ? side : '$side-$alignment';
  return CsFloatingResult(left, top, maxWidth, maxHeight, placement: name);
}
(double, double) csContextPlace(double x, double y, double panelWidth, double panelHeight, double viewportWidth, double viewportHeight) {
  const inset = 8.0;
  final viewport = CsFloatingRect(inset, inset, viewportWidth - inset < inset ? inset : viewportWidth - inset, viewportHeight - inset < inset ? inset : viewportHeight - inset, 0, 0);
  final anchor = CsFloatingRect(x, y, x, y, 0, 0);
  final placed = csFloatingPlace(anchor, panelWidth, panelHeight, viewport, placement: 'bottom-start', gap: 0);
  return placed == null ? (x, y) : (placed.left, placed.top);
}
int? csContextOpen(List<String> items, bool defaultPrevented) => defaultPrevented ? null : csContextFirst(items);
int? csContextMove(int index, int count, String key) {
  if (count <= 0) return null;
  switch (key) {
    case 'down':
      return index + 1 < count ? index + 1 : count - 1;
    case 'up':
      return index < 0 ? count - 1 : (index > 0 ? index - 1 : 0);
    case 'home':
      return 0;
    case 'end':
      return count - 1;
    default:
      return null;
  }
}
String csContextLabel(String? label, String fallback) => label ?? fallback;
String csContextCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'menu': 'Trình đơn ngữ cảnh'};
  const en = {'menu': csContextMenu};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}

class CsContextMenu extends StatefulWidget {
  const CsContextMenu({super.key, this.label, this.items = const [], this.dangerItems = const {}, required this.onSelect, required this.dark, required this.highContrast, required this.compact, this.portal = true, this.placement, this.tabIndex = 0, this.language});
  final String? label;
  final bool portal;
  final String? placement;
  final int tabIndex;
  final String? language;
  final List<String> items;
  final Set<String> dangerItems;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsContextMenu> createState() => _CsContextMenuState();
}

class _CsContextMenuState extends State<CsContextMenu> {
  (double, double)? raw;
  int active = 0;
  Size? natural;
  Size? fitted;
  static const zoneHeight = 44.0;
  final panelKey = GlobalKey();
  var measureTries = 0;

  CsFloatingResult? _placeResult((double, double) point, Size panel, String placement) {
    final box = context.findRenderObject() as RenderBox?;
    final origin = box?.localToGlobal(Offset.zero) ?? Offset.zero;
    final far = box == null ? origin : box.localToGlobal(Offset(box.size.width, box.size.height));
    final scaleX = box == null || box.size.width == 0 || far.dx == origin.dx ? 1.0 : (far.dx - origin.dx) / box.size.width;
    final scaleY = box == null || box.size.height == 0 || far.dy == origin.dy ? 1.0 : (far.dy - origin.dy) / box.size.height;
    final globalPoint = box?.localToGlobal(Offset(point.$1, point.$2)) ?? Offset(origin.dx + point.$1, origin.dy + point.$2);
    final size = MediaQuery.sizeOf(context);
    const inset = 8.0;
    final viewport = CsFloatingRect(inset, inset, size.width - inset < inset ? inset : size.width - inset, size.height - inset < inset ? inset : size.height - inset, 0, 0);
    final anchor = CsFloatingRect(globalPoint.dx, globalPoint.dy, globalPoint.dx, globalPoint.dy, 0, 0);
    final global = csFloatingPlace(anchor, panel.width, panel.height, viewport, placement: placement, gap: 0);
    if (global == null) return null;
    return CsFloatingResult((global.left - origin.dx) / scaleX, (global.top - origin.dy) / scaleY, global.maxWidth, global.maxHeight, placement: global.placement);
  }

  void _measure() {
    if (!mounted || raw == null) return;
    final menu = panelKey.currentContext?.findRenderObject() as RenderBox?;
    if (menu == null || menu.size.width <= 0 || menu.size.height <= 0) {
      if (measureTries < 3) {
        measureTries += 1;
        WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
      }
      return;
    }
    if (natural == null) {
      setState(() => natural = menu.size);
      WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
      return;
    }
    final next = menu.size;
    if (fitted == null || next.width != fitted!.width || next.height != fitted!.height) {
      setState(() => fitted = next);
    }
  }

  void _open(Offset local) {
    if (csContextFirst(widget.items) == null) return;
    final next = csContextPoint(local.dx, local.dy, 0, 0);
    setState(() {
      active = 0;
      raw = next;
      natural = null;
      fitted = null;
      measureTries = 0;
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
  }

  KeyEventResult _key(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final actionableCount = widget.items.where((item) => !csContextIsSeparator(item)).length;
    if (raw != null) {
      if (event.logicalKey == LogicalKeyboardKey.escape) {
        setState(() { raw = null; natural = null; fitted = null; });
        return KeyEventResult.handled;
      }
      final keyName = event.logicalKey == LogicalKeyboardKey.arrowDown
          ? 'down'
          : event.logicalKey == LogicalKeyboardKey.arrowUp
              ? 'up'
              : event.logicalKey == LogicalKeyboardKey.home
                  ? 'home'
                  : event.logicalKey == LogicalKeyboardKey.end
                      ? 'end'
                      : null;
      if (keyName != null) {
        final next = csContextMove(active, actionableCount, keyName);
        if (next != null) setState(() => active = next);
        return KeyEventResult.handled;
      }
      return KeyEventResult.ignored;
    }
    final shiftF10 = event.logicalKey == LogicalKeyboardKey.f10 && HardwareKeyboard.instance.isShiftPressed;
    final menuKey = event.logicalKey == LogicalKeyboardKey.contextMenu;
    if (!shiftF10 && !menuKey || csContextFirst(widget.items) == null) return KeyEventResult.ignored;
    final next = csContextKeyboardPoint(zoneHeight);
    setState(() {
      active = 0;
      raw = next;
      natural = null;
      fitted = null;
      measureTries = 0;
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final point = raw;
    final placeName = widget.placement ?? 'bottom-start';
    final initial = point == null || natural == null ? null : _placeResult(point, natural!, placeName);
    final shown = point == null || fitted == null || initial == null ? null : _placeResult(point, fitted!, initial.placement);
    return Focus(
      onKeyEvent: _key,
      child: GestureDetector(
      onSecondaryTapDown: (details) => _open(details.localPosition),
      onLongPressStart: (details) => _open(details.localPosition),
      child: Stack(children: [
        const SizedBox(width: double.infinity, height: zoneHeight),
        if (point != null && csContextFirst(widget.items) != null)
          Positioned(
            left: shown?.left ?? point.$1,
            top: shown?.top ?? point.$2,
            child: ExcludeSemantics(
              excluding: shown == null,
              child: Opacity(
              opacity: shown == null ? 0 : 1,
              child: IgnorePointer(
                ignoring: shown == null,
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: initial?.maxWidth ?? double.infinity, maxHeight: initial?.maxHeight ?? double.infinity),
                  child: Semantics(container: true, explicitChildNodes: true, label: csContextLabel(widget.label, csContextCopy('menu', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)))), child: Padding(padding: EdgeInsets.all(csNavigationStyleMenuListPadding()), child: Column(key: panelKey, crossAxisAlignment: CrossAxisAlignment.start, children: [
                    if (widget.label != null) ExcludeSemantics(child: Text(widget.label!)),
                    for (final item in widget.items)
                      if (csContextIsSeparator(item))
                        ExcludeSemantics(child: SizedBox(height: csNavigationStyleMenuSeparatorHeight()))
                      else
                        CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); widget.onSelect(item); setState(() { raw = null; natural = null; fitted = null; }); }, child: Text(item))),
                  ]))),
                ),
              ),
            ),
            ),
          ),
      ]),
    ),
    );
  }
}

const csNavRole = 'navigation';
const csNavChevronGlyph = '▾';
const csNavGap = 8.0;
String csNavTopClass(bool open) => open ? 'cs-navmenu__top is-open' : 'cs-navmenu__top';
bool csNavEscapeClose() => false;
String csNavHref(String? href) => href == null || href.isEmpty ? '#' : href;
bool csNavShowsDescription(String? description) => description != null && description.isNotEmpty;
int? csNavClick(int? open, int index) => open == index ? null : index;
int? csNavHover(int? open, int index) => open == null ? null : (open == index ? open : index);
String csNavPlacement(String? placement) => placement ?? 'bottom-start';
class CsNavPlace {
  const CsNavPlace(this.x, this.y, this.maxWidth, this.maxHeight, this.placement);
  final double x;
  final double y;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsNavPlace? csNavShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY, String placement) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: placement, gap: csNavGap);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: csNavGap);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsNavPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}

class CsNavMenuCard {
  const CsNavMenuCard(this.label, {this.href, this.description});
  final String label;
  final String? href;
  final String? description;
}

class CsNavMenuItem {
  const CsNavMenuItem(this.label, {this.href, this.panel = const []});
  final String label;
  final String? href;
  final List<CsNavMenuCard> panel;
}

class CsNavigationMenu extends StatefulWidget {
  const CsNavigationMenu({super.key, this.items = const [], required this.dark, required this.highContrast, required this.compact, this.portal = true, this.placement, this.ariaLabel});
  final List<CsNavMenuItem> items;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final bool portal;
  final String? placement;
  final String? ariaLabel;

  @override
  State<CsNavigationMenu> createState() => _CsNavigationMenuState();
}

class _CsNavigationMenuState extends State<CsNavigationMenu> {
  int? open;
  Size? natural;
  Size? fitted;
  CsNavPlace? place;
  final keys = <int, GlobalKey>{};
  final panelKey = GlobalKey();

  GlobalKey keyFor(int index) => keys.putIfAbsent(index, GlobalKey.new);

  void choose(int? next) {
    if (next == open) return;
    setState(() {
      open = next;
      natural = null;
      fitted = null;
      place = null;
    });
  }

  void measure() {
    final current = open;
    if (current == null) return;
    final button = keys[current]?.currentContext?.findRenderObject() as RenderBox?;
    final panel = panelKey.currentContext?.findRenderObject() as RenderBox?;
    if (button == null || panel == null || !button.hasSize || !panel.hasSize || !button.attached || !panel.attached) return;
    if (natural == null) {
      setState(() => natural = panel.size);
      return;
    }
    if (fitted == panel.size && place != null) return;
    final buttonOrigin = button.localToGlobal(Offset.zero);
    final panelOrigin = panel.localToGlobal(Offset.zero);
    final view = View.of(context);
    final width = view.physicalSize.width / view.devicePixelRatio;
    final height = view.physicalSize.height / view.devicePixelRatio;
    final next = csNavShift(
      CsFloatingRect(buttonOrigin.dx, buttonOrigin.dy, buttonOrigin.dx + button.size.width, buttonOrigin.dy + button.size.height, button.size.width, button.size.height),
      natural!.width,
      natural!.height,
      panel.size.width,
      panel.size.height,
      CsFloatingRect(8, 8, width - 8, height - 8, 0, 0),
      panelOrigin.dx,
      panelOrigin.dy,
      1,
      1,
      csNavPlacement(widget.placement),
    );
    setState(() { fitted = panel.size; place = next; });
  }

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final current = open;
    final cards = current != null && widget.items.asMap().containsKey(current) ? widget.items[current].panel : const <CsNavMenuCard>[];
    if (current != null) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && open == current) measure(); });
    return TapRegion(
      onTapOutside: current == null ? null : (_) => choose(null),
      child: Focus(
        onKeyEvent: (node, event) {
          if (event is! KeyDownEvent || event.logicalKey != LogicalKeyboardKey.escape || open == null) return KeyEventResult.ignored;
          choose(null);
          return KeyEventResult.handled;
        },
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            for (var index = 0; index < widget.items.length; index++)
              if (widget.items[index].panel.isNotEmpty) MouseRegion(
                onEnter: (_) {
                  final next = csNavHover(open, index);
                  if (next != open) choose(next);
                },
                child: Semantics(
                  button: true,
                  expanded: open == index,
                  label: widget.items[index].label,
                  child: TextButton(
                    key: keyFor(index),
                    onPressed: () => choose(csNavClick(open, index)),
                    child: ExcludeSemantics(child: Text('${widget.items[index].label} ▾')),
                  ),
                ),
              ) else Semantics(
                link: true,
                label: widget.items[index].label,
                hint: csNavHref(widget.items[index].href),
                child: ExcludeSemantics(child: Text(widget.items[index].label, style: TextStyle(color: csColor(pack.colorTextPrimary)))),
              ),
          ]),
          if (current != null && cards.isNotEmpty) IgnorePointer(
            ignoring: place == null,
            child: Opacity(
              opacity: place == null ? 0 : 1,
              child: Transform.translate(offset: Offset(place?.x ?? 0, place?.y ?? 0), child: ConstrainedBox(constraints: place == null ? const BoxConstraints() : BoxConstraints(maxWidth: place!.maxWidth, maxHeight: place!.maxHeight), child: Padding(padding: EdgeInsets.only(top: csControlsBatchStyleNavMenuPanelOffset()), child: Column(key: panelKey, crossAxisAlignment: CrossAxisAlignment.start, children: [
                for (final card in cards)
                  Semantics(
                    link: true,
                    hint: csNavHref(card.href),
                    label: card.label,
                    child: TextButton(onPressed: () => choose(null), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(card.label, style: TextStyle(fontWeight: FontWeight.w700, color: csColor(pack.colorTextPrimary))),
                      if (csNavShowsDescription(card.description)) Text(card.description ?? '', style: TextStyle(color: csColor(pack.colorTextMuted))),
                    ])),
                  ),
              ])))),
            ),
          ),
        ]),
      ),
    );
  }
}

const csCardSlotHeaderClass = 'cs-card__header';
const csCardSlotTitleClass = 'cs-card__title';
const csCardSlotSubtitleClass = 'cs-card__subtitle';
const csCardSlotBodyClass = 'cs-card__body';
const csCardSlotFooterClass = 'cs-card__footer';
bool csCardSlotShowsTitle(String? title) => csDataStyleCardShowsSlot(title);
bool csCardSlotShowsSubtitle(String? subtitle) => csDataStyleCardShowsSlot(subtitle);

class CsCardHeader extends StatelessWidget {
  const CsCardHeader({super.key, this.title = '', required this.dark, required this.highContrast, required this.compact, this.subtitle, this.children});
  final String title;
  final String? subtitle;
  final String? children;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Padding(
      padding: EdgeInsets.only(left: csDataStyleCardHeaderPaddingX(), top: csDataStyleCardHeaderPaddingTop(), right: csDataStyleCardHeaderPaddingX(), bottom: csDataStyleCardHeaderPaddingBottom()),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        if (csDataStyleCardShowsSlot(title)) Text(title, style: TextStyle(fontWeight: FontWeight.w700, color: csColor(pack.colorTextPrimary))),
        if (csDataStyleCardShowsSlot(subtitle)) ...[
          SizedBox(height: csDataStyleCardSubtitleMarginTop()),
          Text(subtitle!, style: TextStyle(fontSize: csDataStyleCardSubtitleFontSize(pack), color: csColor(pack.colorTextMuted))),
        ],
        if (csDataStyleCardShowsSlot(children)) Text(children!, style: TextStyle(color: csColor(pack.colorTextPrimary))),
      ]),
    );
  }
}

class CsCardBody extends StatelessWidget {
  const CsCardBody({super.key, this.text = '', required this.dark, required this.highContrast, required this.compact});
  final String text;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  Widget build(BuildContext context) => Padding(
    padding: EdgeInsets.symmetric(horizontal: csDataStyleCardBodyPaddingX(), vertical: csDataStyleCardBodyPaddingY()),
    child: Text(text),
  );
}

class CsCardFooter extends StatelessWidget {
  const CsCardFooter({super.key, this.text = '', required this.dark, required this.highContrast, required this.compact});
  final String text;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  Widget build(BuildContext context) => Padding(
    padding: EdgeInsets.only(left: csDataStyleCardFooterPaddingX(), top: csDataStyleCardFooterPaddingTop(), right: csDataStyleCardFooterPaddingX(), bottom: csDataStyleCardFooterPaddingBottom()),
    child: Text(text),
  );
}

const csToastStackRegionRole = 'region';
const csToastStackRootClass = 'cs-toast-stack';
String csToastStackName(String? label, String? language) {
  if (label != null) return label;
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  return want == 'vi' ? 'Thông báo' : 'Notifications';
}

class CsToastStack extends StatelessWidget {
  const CsToastStack({super.key, this.label, this.children = const [], this.language});
  final String? label;
  final String? language;
  final List<Widget> children;
  @override
  Widget build(BuildContext context) => Semantics(
    label: csToastStackName(label, csSelectResolvedLanguage(language, CsLanguageScope.of(context))),
    child: Padding(
      padding: EdgeInsets.all(csFeedbackStyleToastStackInset()),
      child: Column(children: [
        for (var i = 0; i < children.length; i++) ...[
          if (i > 0) SizedBox(height: csFeedbackStyleToastStackGap()),
          children[i],
        ],
      ]),
    ),
  );
}

enum CsGlassMaterial {
  whisper('cs-surface-whisper'),
  light('cs-surface-light'),
  standard('cs-surface-standard'),
  glassCard('cs-glass-card'),
  heavy('cs-surface-heavy'),
  solid('cs-surface-solid'),
  matte('cs-surface-matte');

  const CsGlassMaterial(this.className);
  final String className;
}

enum CsGlassSurfaceBase { page, panel, raised }
enum CsGlassShadow { none, sm, lg }
enum CsDepthTier {
  bg('cs-depth-bg'),
  section('cs-depth-section'),
  card('cs-depth-card'),
  nav('cs-depth-nav'),
  modal('cs-depth-modal'),
  toast('cs-depth-toast');

  const CsDepthTier(this.className);
  final String className;
}

const List<String> csGlassOverlaySurfacePrecedence = [
  'cs-surface-matte',
  'cs-surface-solid',
  'cs-surface-heavy',
  'cs-surface-standard',
  'cs-glass-card',
  'cs-surface-light',
  'cs-surface-whisper',
];

String csGlassOverlaySurfaceClass(String? className) {
  final classes = (className ?? '').trim().split(RegExp(r'\s+')).where((item) => item.isNotEmpty).toSet();
  for (final name in csGlassOverlaySurfacePrecedence) {
    if (classes.contains(name)) return name;
  }
  return '';
}

CsGlassMaterial? csGlassMaterialFromClassName(String? className) {
  final resolved = csGlassOverlaySurfaceClass(className);
  for (final material in CsGlassMaterial.values) {
    if (material.className == resolved) return material;
  }
  return null;
}

CsGlassSurfaceBase csGlassSurfaceBase(CsGlassMaterial material) {
  switch (material) {
    case CsGlassMaterial.whisper:
      return CsGlassSurfaceBase.page;
    case CsGlassMaterial.light:
    case CsGlassMaterial.standard:
    case CsGlassMaterial.glassCard:
    case CsGlassMaterial.solid:
    case CsGlassMaterial.matte:
      return CsGlassSurfaceBase.panel;
    case CsGlassMaterial.heavy:
      return CsGlassSurfaceBase.raised;
  }
}

double csGlassOpacity(CsGlassMaterial material, CSTokenModePack pack) {
  switch (material) {
    case CsGlassMaterial.whisper:
      return pack.glassWhisperOpacity;
    case CsGlassMaterial.light:
      return pack.glassLightOpacity;
    case CsGlassMaterial.standard:
    case CsGlassMaterial.glassCard:
      return pack.glassStandardOpacity;
    case CsGlassMaterial.heavy:
      return pack.glassHeavyOpacity;
    case CsGlassMaterial.solid:
    case CsGlassMaterial.matte:
      return 1.0;
  }
}

double csGlassBlur(CsGlassMaterial material, CSTokenModePack pack) {
  switch (material) {
    case CsGlassMaterial.whisper:
      return csPoints(pack.glassWhisperBlur);
    case CsGlassMaterial.light:
      return csPoints(pack.glassLightBlur);
    case CsGlassMaterial.standard:
    case CsGlassMaterial.glassCard:
      return csPoints(pack.glassStandardBlur);
    case CsGlassMaterial.heavy:
      return csPoints(pack.glassHeavyBlur);
    case CsGlassMaterial.solid:
    case CsGlassMaterial.matte:
      return 0;
  }
}

double csGlassSaturate(CsGlassMaterial material, CSTokenModePack pack) {
  switch (material) {
    case CsGlassMaterial.whisper:
      return pack.glassWhisperSaturate;
    case CsGlassMaterial.light:
      return pack.glassLightSaturate;
    case CsGlassMaterial.standard:
    case CsGlassMaterial.glassCard:
      return pack.glassStandardSaturate;
    case CsGlassMaterial.heavy:
      return pack.glassHeavySaturate;
    case CsGlassMaterial.solid:
    case CsGlassMaterial.matte:
      return 1.0;
  }
}

double csGlassBorderMix(CsGlassMaterial material) {
  switch (material) {
    case CsGlassMaterial.whisper:
      return 0;
    case CsGlassMaterial.light:
      return 0.50;
    case CsGlassMaterial.standard:
    case CsGlassMaterial.glassCard:
      return 0.60;
    case CsGlassMaterial.heavy:
      return 0.80;
    case CsGlassMaterial.solid:
    case CsGlassMaterial.matte:
      return 1.0;
  }
}

double csGlassBorderWidth(CsGlassMaterial material) => material == CsGlassMaterial.whisper ? 0 : 1;

CsGlassShadow csGlassShadow(CsGlassMaterial material) {
  switch (material) {
    case CsGlassMaterial.whisper:
    case CsGlassMaterial.light:
    case CsGlassMaterial.solid:
    case CsGlassMaterial.matte:
      return CsGlassShadow.none;
    case CsGlassMaterial.standard:
    case CsGlassMaterial.glassCard:
      return CsGlassShadow.sm;
    case CsGlassMaterial.heavy:
      return CsGlassShadow.lg;
  }
}

const double csGlassLensEdgeAngle = 135.0;
double csGlassLensEdgeWidth() => 1.0;
const double csGlassLensHighlightAlpha = 0.30;
const double csGlassLensTransparentStartStop = 0.30;
const double csGlassLensTransparentEndStop = 0.70;
const double csGlassLensUmberAlpha = 0.15;

bool csGlassShowsLensEdge(
  CsGlassMaterial material, {
  bool reducedTransparency = false,
  bool forcedColors = false,
  bool overlaySurface = false,
}) {
  if (reducedTransparency || forcedColors || overlaySurface) return false;
  return material == CsGlassMaterial.standard || material == CsGlassMaterial.heavy || material == CsGlassMaterial.glassCard;
}

double csGlassDepthValue(CsDepthTier tier, CSTokenModePack pack) {
  switch (tier) {
    case CsDepthTier.bg:
      return pack.depthBg;
    case CsDepthTier.section:
      return pack.depthSection;
    case CsDepthTier.card:
      return pack.depthCard;
    case CsDepthTier.nav:
      return pack.depthNav;
    case CsDepthTier.modal:
      return pack.depthModal;
    case CsDepthTier.toast:
      return pack.depthToast;
  }
}

bool csGlassDepthSticky(CsDepthTier tier) => tier == CsDepthTier.nav;

CsGlassSurfaceBase csGlassEffectiveSurfaceBase(
  CsGlassMaterial material, {
  bool reducedTransparency = false,
  bool supportsBackdropFilter = true,
}) => reducedTransparency || !supportsBackdropFilter ? CsGlassSurfaceBase.panel : csGlassSurfaceBase(material);

double csGlassEffectiveOpacity(
  CsGlassMaterial material,
  CSTokenModePack pack, {
  bool reducedTransparency = false,
  bool forcedColors = false,
  bool supportsBackdropFilter = true,
}) => reducedTransparency || forcedColors || !supportsBackdropFilter ? 1.0 : csGlassOpacity(material, pack);

double csGlassEffectiveBlur(
  CsGlassMaterial material,
  CSTokenModePack pack, {
  bool reducedTransparency = false,
  bool forcedColors = false,
  bool overlaySurfaceReady = false,
}) => reducedTransparency || forcedColors || overlaySurfaceReady ? 0.0 : csGlassBlur(material, pack);

double csGlassEffectiveBorderMix(
  CsGlassMaterial material, {
  bool reducedTransparency = false,
  bool forcedColors = false,
}) => reducedTransparency || forcedColors ? 1.0 : csGlassBorderMix(material);

double csGlassEffectiveBorderWidth(
  CsGlassMaterial material, {
  bool reducedTransparency = false,
  bool forcedColors = false,
  bool overlaySurface = false,
}) {
  if (overlaySurface) return 0.0;
  if (reducedTransparency || forcedColors) return 1.0;
  return csGlassBorderWidth(material);
}

const String csAuroraInkHex = '#ffffff';
const double csAuroraOchreAlpha = 0.46;
const double csAuroraOchreCenterX = 0.12;
const double csAuroraOchreCenterY = -0.10;
const double csAuroraOchreRadiusX = 0.90;
const double csAuroraOchreRadiusY = 1.20;
const double csAuroraOchreStop = 0.55;
const String csAuroraGoldHex = '#ffcf5c';
const double csAuroraGoldAlpha = 0.32;
const double csAuroraGoldCenterX = 0.88;
const double csAuroraGoldCenterY = 0.08;
const double csAuroraGoldRadiusX = 0.70;
const double csAuroraGoldRadiusY = 0.90;
const double csAuroraGoldStop = 0.60;
const String csAuroraDeepHex = '#1a1108';
const double csAuroraDeepAlpha = 0.60;
const double csAuroraDeepCenterX = 0.50;
const double csAuroraDeepCenterY = 1.20;
const double csAuroraDeepRadiusX = 1.20;
const double csAuroraDeepRadiusY = 1.20;
const double csAuroraDeepStop = 0.60;

class CsAuroraSurface extends StatelessWidget {
  const CsAuroraSurface({
    super.key,
    required this.child,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.photo = false,
  });

  final Widget child;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final bool photo;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Container(
      decoration: BoxDecoration(
        color: csColor(pack.colorBrandUmber),
        gradient: RadialGradient(
          center: const Alignment(-0.76, -1.20),
          radius: csAuroraOchreRadiusY,
          colors: [
            csColor(pack.colorBrandOchre).withOpacity(csAuroraOchreAlpha),
            Colors.transparent,
          ],
          stops: const [0.0, csAuroraOchreStop],
        ),
      ),
      child: DefaultTextStyle.merge(
        style: const TextStyle(color: Colors.white),
        child: child,
      ),
    );
  }
}
