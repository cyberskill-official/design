import 'package:flutter/material.dart';

import 'controls.dart';

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
CsColorPlace? csColorShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: 'bottom-start', gap: csColorGap);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: csColorGap);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsColorPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}

double csSplitterClamp(double value, {double lower = 20, double upper = 80}) =>
    value < lower ? lower : (value > upper ? upper : value);

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

const csDatePlaceholder = 'Select a date';
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
CsDatePlace? csDateShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: 'bottom-start', gap: csDateGap);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: csDateGap);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsDatePlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}

String csDateFormat(int day, int month, int year, String language) {
  final dd = day.toString().padLeft(2, '0');
  final mm = (month + 1).toString().padLeft(2, '0');
  if (language == 'vi' || language.isEmpty) return '$dd/$mm/$year';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return '$dd ${months[month]} $year';
}

const csChatYou = 'You';
const csChatLumi = 'Lumi';
bool csChatIsUser(String role) => role == 'user';
String csChatSpeaker(String? name, String role, String you, String lumi) => name ?? (csChatIsUser(role) ? you : lumi);
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
String csImageDialogName(String alt, String fallback) => alt.isEmpty ? fallback : alt;

class CsColorPicker extends StatefulWidget {
  const CsColorPicker({super.key, required this.value, required this.swatches, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.label, this.labelledBy, this.language});
  final String? label;
  final String? labelledBy;
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
                child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); final next = csColorCommit(swatch); if (next != null) { widget.onChange(next); setState(() => open = false); } }, child: ExcludeSemantics(child: Text(swatch)))),
              ),
            Semantics(
              textField: true,
              label: csColorCopy('hex', locale),
              child: TextField(controller: hex, onSubmitted: (_) { if (!csColorSubmits(composing: false, keyCode: 0)) return; _commit(); setState(() => open = false); }, onEditingComplete: _commit),
            ),
          ])),
        ),
      ),
    ]),
    );
  }
}

class CsSplitter extends StatefulWidget {
  const CsSplitter({super.key, required this.start, required this.end, required this.percent, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.label, this.language});
  final String start;
  final String end;
  final double percent;
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
    return Focus(
      onKeyEvent: (node, event) {
        if (event is! KeyDownEvent) return KeyEventResult.ignored;
        if (event.logicalKey == LogicalKeyboardKey.arrowRight) {
          widget.onChange(csSplitterNudge(widget.percent, right: true, rtl: rtl));
          return KeyEventResult.handled;
        }
        if (event.logicalKey == LogicalKeyboardKey.arrowLeft) {
          widget.onChange(csSplitterNudge(widget.percent, right: false, rtl: rtl));
          return KeyEventResult.handled;
        }
        return KeyEventResult.ignored;
      },
      child: LayoutBuilder(builder: (context, constraints) {
        final nextWrap = constraints.maxWidth.isFinite ? constraints.maxWidth : wrapWidth;
        return Row(children: [
          Text(widget.start),
          Semantics(
            button: true,
            label: spoken,
            value: widget.percent.round().toString(),
            child: GestureDetector(
              onHorizontalDragStart: (details) { dragStart = widget.percent; grabX = details.globalPosition.dx; },
              onHorizontalDragUpdate: (details) {
                final start = dragStart;
                final grab = grabX;
                if (start == null || grab == null) return;
                final box = handleKey.currentContext?.findRenderObject() as RenderBox?;
                final next = csSplitterDrag(start, grab, details.globalPosition.dx, nextWrap, box?.size.width ?? 0, rtl);
                if (next != null) widget.onChange(next);
              },
              onHorizontalDragEnd: (_) { dragStart = null; grabX = null; },
              onHorizontalDragCancel: () { dragStart = null; grabX = null; },
              child: CsOwnFocus(builder: (node, claim) => TextButton(key: handleKey, focusNode: node, onPressed: () { claim(); widget.onChange(csSplitterNudge(widget.percent, right: true, rtl: rtl)); }, child: ExcludeSemantics(child: Text(spoken)))),
            ),
          ),
          Text(widget.end),
        ]);
      }),
    );
  }
}

class CsDatePicker extends StatefulWidget {
  const CsDatePicker({super.key, this.label, required this.text, required this.requestedOpen, required this.disabled, required this.onOpenChange, required this.dark, required this.highContrast, required this.compact, this.placeholder, this.language});
  final String? label;
  final String? placeholder;
  final String? language;
  final String text;
  final bool requestedOpen;
  final bool disabled;
  final ValueChanged<bool> onOpenChange;
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
    );
    setState(() { fitted = listBox.size; place = next; });
  }

  @override
  Widget build(BuildContext context) {
    final open = csDateOpen(requested: widget.requestedOpen, disabled: widget.disabled);
    final hint = csDatePlaceholderText(widget.placeholder, csDateCopy('placeholder', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context))));
    final face = widget.text.isEmpty ? hint : widget.text;
    final name = (widget.label == null || widget.label!.isEmpty) ? face : widget.label!;
    if (!open) { natural = null; fitted = null; }
    if (open) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && widget.requestedOpen && !widget.disabled) measure(); });
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      CsOwnFocus(builder: (node, claim) => Semantics(label: name, button: true, child: TextButton(key: fieldKey, focusNode: node, onPressed: widget.disabled ? null : () { claim(); widget.onOpenChange(!open); }, child: ExcludeSemantics(child: Text(face))))),
      if (open) Opacity(opacity: place == null ? 0 : 1, child: Transform.translate(key: listKey, offset: Offset(place?.x ?? 0, place?.y ?? 0), child: Text(widget.text))),
    ]);
  }
}

class CsChatMessage extends StatelessWidget {
  const CsChatMessage({super.key, required this.role, this.name, required this.bodyText, required this.dark, required this.highContrast, required this.compact, this.language});
  final String role;
  final String? name;
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
    return Column(crossAxisAlignment: user ? CrossAxisAlignment.end : CrossAxisAlignment.start, children: [
      Text(speaker, style: TextStyle(color: csColor(pack.colorTextMuted))),
      Text(bodyText, style: TextStyle(color: csColor(user ? pack.colorSemanticInfoFg : pack.colorTextPrimary))),
    ]);
  }
}

class CsAnchor extends StatelessWidget {
  const CsAnchor({super.key, required this.title, required this.items, required this.visibleIds, required this.dark, required this.highContrast, required this.compact});
  final String title;
  final List<(String, String)> items;
  final List<String> visibleIds;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final active = visibleIds.isEmpty ? null : visibleIds.first;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title),
      for (final item in items) Text(item.$2, style: TextStyle(fontWeight: item.$1 == active ? FontWeight.w700 : FontWeight.w400)),
    ]);
  }
}

const csCitationLabel = 'Sources';
const csCitationRel = 'noreferrer';
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
  const CsCitationList({super.key, this.label, required this.items, required this.dark, required this.highContrast, required this.compact, this.language});
  final String? label;
  final String? language;
  final List<String> items;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final heading = csCitationHeading(label, label == null, csCitationCopy('sources', csSelectResolvedLanguage(language, CsLanguageScope.of(context))));
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (heading != null) Text(heading),
      for (var index = 0; index < items.length; index++) Text('${index + 1} ${items[index]}'),
    ]);
  }
}

class CsScrollArea extends StatelessWidget {
  const CsScrollArea({super.key, required this.maxHeight, required this.child});
  final double maxHeight;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(constraints: BoxConstraints(maxHeight: maxHeight), child: SingleChildScrollView(child: child));
  }
}

class CsImage extends StatelessWidget {
  const CsImage({super.key, this.alt = '', required this.dark, required this.highContrast, required this.compact, this.ratio = '16 / 9', this.preview = false, this.state = 'loading', this.language});
  final String alt;
  final bool preview;
  final String state;
  final String? language;
  final String ratio;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final previewWord = csImageCopy('preview', csSelectResolvedLanguage(language, CsLanguageScope.of(context)));
    final name = csImageCanPreview(preview, state) ? csImagePreviewName(alt, previewWord) : alt;
    return Semantics(label: name, child: const SizedBox(width: 160, height: 90));
  }
}

class CsLogo extends StatelessWidget {
  const CsLogo({super.key, required this.dark, required this.highContrast, required this.compact, this.title = 'CyberSkill', this.decorative = false, this.size = 32});
  final String title;
  final bool decorative;
  final double size;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final text = Text(title);
    return SizedBox(width: size, height: size, child: decorative ? ExcludeSemantics(child: text) : text);
  }
}

const csContextMenu = 'Context menu';
int? csContextFirst(List<String> items) {
  final index = items.indexWhere((item) => item != '-');
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
  const CsContextMenu({super.key, this.label, required this.items, required this.onSelect, required this.dark, required this.highContrast, required this.compact, this.language});
  final String? label;
  final String? language;
  final List<String> items;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsContextMenu> createState() => _CsContextMenuState();
}

class _CsContextMenuState extends State<CsContextMenu> {
  (double, double)? raw;
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
    final next = csContextPoint(local.dx, local.dy, 0, 0);
    setState(() {
      raw = next;
      natural = null;
      fitted = null;
      measureTries = 0;
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
  }

  KeyEventResult _key(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final shiftF10 = event.logicalKey == LogicalKeyboardKey.f10 && HardwareKeyboard.instance.isShiftPressed;
    final menuKey = event.logicalKey == LogicalKeyboardKey.contextMenu;
    if (!shiftF10 && !menuKey) return KeyEventResult.ignored;
    final next = csContextKeyboardPoint(zoneHeight);
    setState(() {
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
    final initial = point == null || natural == null ? null : _placeResult(point, natural!, 'bottom-start');
    final shown = point == null || fitted == null || initial == null ? null : _placeResult(point, fitted!, initial.placement);
    return Focus(
      onKeyEvent: _key,
      child: GestureDetector(
      onSecondaryTapDown: (details) => _open(details.localPosition),
      onLongPressStart: (details) => _open(details.localPosition),
      child: Stack(children: [
        const SizedBox(width: double.infinity, height: zoneHeight),
        if (point != null)
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
                  child: Semantics(container: true, explicitChildNodes: true, label: csContextLabel(widget.label, csContextCopy('menu', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)))), child: Column(key: panelKey, crossAxisAlignment: CrossAxisAlignment.start, children: [
                    if (widget.label != null) ExcludeSemantics(child: Text(widget.label!)),
                    for (final item in widget.items)
                      CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); widget.onSelect(item); setState(() { raw = null; natural = null; fitted = null; }); }, child: Text(item))),
                  ]),
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

const csNavGap = 8.0;
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

class CsNavigationMenu extends StatelessWidget {
  const CsNavigationMenu({super.key, required this.items, required this.active, required this.onSelect, required this.dark, required this.highContrast, required this.compact});
  final List<String> items;
  final String active;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    return Row(children: [for (final item in items) CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); onSelect(item); }, child: Text(item)))]);
  }
}

class CsCardHeader extends StatelessWidget {
  const CsCardHeader({super.key, required this.title, required this.dark, required this.highContrast, required this.compact});
  final String title;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  Widget build(BuildContext context) => Text(title, style: const TextStyle(fontWeight: FontWeight.w700));
}

class CsCardBody extends StatelessWidget {
  const CsCardBody({super.key, required this.text, required this.dark, required this.highContrast, required this.compact});
  final String text;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  Widget build(BuildContext context) => Text(text);
}

class CsCardFooter extends StatelessWidget {
  const CsCardFooter({super.key, required this.text, required this.dark, required this.highContrast, required this.compact});
  final String text;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  Widget build(BuildContext context) => Text(text);
}

String csToastStackName(String? label, String? language) {
  if (label != null) return label;
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  return want == 'vi' ? 'Thông báo' : 'Notifications';
}

class CsToastStack extends StatelessWidget {
  const CsToastStack({super.key, this.label, required this.children, this.language});
  final String? label;
  final String? language;
  final List<Widget> children;
  @override
  Widget build(BuildContext context) => Semantics(label: csToastStackName(label, csSelectResolvedLanguage(language, CsLanguageScope.of(context))), child: Column(children: children));
}
