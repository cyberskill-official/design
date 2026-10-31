import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'controls.dart';
import 'surfaces.dart';

enum CsRovingKey { right, left, up, down, home, end }

const csMenuLabel = 'Menu';
const csMenuGap = 6.0;
String csMenuPlacement(String? explicit, String align) => explicit ?? (align == 'end' ? 'bottom-end' : 'bottom-start');
class CsMenuPlace {
  const CsMenuPlace(this.x, this.y, this.maxWidth, this.maxHeight, this.placement);
  final double x;
  final double y;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsMenuPlace? csMenuShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY, String placement) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: placement, gap: csMenuGap);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: csMenuGap);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsMenuPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}
String csMenuCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'menu': 'Trình đơn'};
  const en = {'menu': csMenuLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}

const csFabMain = 56.0;
String csFabPlacement(String? explicit) => explicit ?? 'top-end';
const csFabGap = 10.0;
class CsFabPlace {
  const CsFabPlace(this.x, this.y, this.maxWidth, this.maxHeight, this.placement);
  final double x;
  final double y;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsFabPlace? csFabShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY, String placement) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: placement, gap: csFabGap);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: csFabGap);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsFabPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}
bool? csFabNextOpen(int actionCount, bool open) => actionCount > 0 ? !open : null;
const csBackTopLabel = 'Back to top';
String csBackTopLabelText(String? label, String fallback) => label ?? fallback;
String csBackTopCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Về đầu trang'};
  const en = {'label': csBackTopLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csBackTopBehavior(bool reducedMotion) => reducedMotion ? 'instant' : 'smooth';
int csNonnegative(int value, int count) {
  final remainder = value % count;
  return remainder >= 0 ? remainder : remainder + count;
}

int? csMenuIndex(int current, int count, CsRovingKey key) {
  if (count <= 0) return null;
  switch (key) {
    case CsRovingKey.down:
      return csNonnegative(current + 1, count);
    case CsRovingKey.up:
      return csNonnegative(current - 1 + count, count);
    case CsRovingKey.home:
      return 0;
    case CsRovingKey.end:
      return count - 1;
    default:
      return null;
  }
}

String csMenuNeedle(String previous, String character, int elapsedMs) {
  final letter = character.toLowerCase();
  final text = elapsedMs < 500 ? previous.toLowerCase() + letter : letter;
  return text.split('').every((part) => part == letter) ? letter : text;
}

int? csMenuTypeahead(List<String> labels, int from, String needle) {
  if (labels.isEmpty || needle.isEmpty) return null;
  final lowered = needle.toLowerCase();
  for (var step = 0; step < labels.length; step++) {
    final index = csNonnegative(from + 1 + step, labels.length);
    if (labels[index].trim().toLowerCase().startsWith(lowered)) return index;
  }
  return null;
}

class CsMenubarState {
  const CsMenubarState(this.top, this.open, this.item);
  final int top;
  final int? open;
  final int item;
}

const csMenubarLabelDefault = 'Application menu';
const csMenubarGap = 5.0;
String? csMenubarLabel(String? ariaLabel, bool hasLabelledBy, String fallback) => ariaLabel ?? (hasLabelledBy ? null : fallback);
String csMenubarCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Trình đơn ứng dụng'};
  const en = {'label': csMenubarLabelDefault};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csMenubarPlacement(String? explicit) => explicit ?? 'bottom-start';
class CsMenubarPlace {
  const CsMenubarPlace(this.x, this.y, this.maxWidth, this.maxHeight, this.placement);
  final double x;
  final double y;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsMenubarPlace? csMenubarShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY, String placement) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: placement, gap: csMenubarGap);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: csMenubarGap);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsMenubarPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}
int? csMenubarClick(int? open, int index) => open == index ? null : index;
int? csMenubarHover(int? open, int index) => open == null ? null : (open == index ? open : index);
List<String> csMenubarActionable(List<String> items) => items.where((item) => item != '-').toList();
int csMenubarTabStop(int index, int focus) => index == focus ? 0 : -1;
CsMenubarState? csMenubarBar(int top, int? open, int menuCount, int itemCount, CsRovingKey key) {
  if (menuCount <= 0) return null;
  if (key == CsRovingKey.down || key == CsRovingKey.up) {
    return CsMenubarState(top, top, key == CsRovingKey.up ? (itemCount - 1 < 0 ? 0 : itemCount - 1) : 0);
  }
  final int? next = switch (key) {
    CsRovingKey.right => csNonnegative(top + 1, menuCount),
    CsRovingKey.left => csNonnegative(top - 1 + menuCount, menuCount),
    CsRovingKey.home => 0,
    CsRovingKey.end => menuCount - 1,
    _ => null,
  };
  if (next == null) return null;
  return CsMenubarState(next, open == null ? null : next, 0);
}

bool csBackTopVisible(double offset, {double threshold = 320}) => offset > threshold;

double? csAspectHeight(String ratio, double width) {
  final parts = ratio.split('/').map((part) => part.trim()).toList();
  if (parts.length == 2) {
    final across = double.tryParse(parts[0]);
    final down = double.tryParse(parts[1]);
    if (across != null && down != null && across > 0) return width * down / across;
  }
  final number = double.tryParse(ratio.trim());
  if (number != null && number > 0) return width / number;
  return null;
}

class CsMenu extends StatefulWidget {
  const CsMenu({super.key, required this.label, required this.items, required this.open, required this.onOpenChange, required this.onSelect, required this.dark, required this.highContrast, required this.compact, this.language, this.align = 'start', this.placement});
  final String? language;
  final String align;
  final String? placement;
  final String label;
  final List<String> items;
  final bool open;
  final ValueChanged<bool> onOpenChange;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsMenu> createState() => _CsMenuState();
}

class _CsMenuState extends State<CsMenu> {
  var focus = -1;
  final fieldKey = GlobalKey();
  final listKey = GlobalKey();
  Size? natural;
  Size? fitted;
  CsMenuPlace? place;

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
    final next = csMenuShift(
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
      csMenuPlacement(widget.placement, widget.align),
    );
    setState(() { fitted = listBox.size; place = next; });
  }

  KeyEventResult _key(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final CsRovingKey? key = switch (event.logicalKey) {
      LogicalKeyboardKey.arrowDown => CsRovingKey.down,
      LogicalKeyboardKey.arrowUp => CsRovingKey.up,
      LogicalKeyboardKey.arrowLeft => CsRovingKey.left,
      LogicalKeyboardKey.arrowRight => CsRovingKey.right,
      LogicalKeyboardKey.home => CsRovingKey.home,
      LogicalKeyboardKey.end => CsRovingKey.end,
      _ => null,
    };
    if (key == null) return KeyEventResult.ignored;
    if (!widget.open && (key == CsRovingKey.down || key == CsRovingKey.up)) {
      widget.onOpenChange(true);
      setState(() => focus = key == CsRovingKey.up ? (widget.items.isEmpty ? 0 : widget.items.length - 1) : 0);
      return KeyEventResult.handled;
    }
    final next = csMenuIndex(focus, widget.items.length, key);
    if (next == null) return KeyEventResult.ignored;
    setState(() => focus = next);
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    if (!widget.open) { natural = null; fitted = null; }
    if (widget.open) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && widget.open) measure(); });
    return Focus(
      onKeyEvent: _key,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CsOwnFocus(builder: (node, claim) => TextButton(key: fieldKey, focusNode: node, onPressed: () { claim(); widget.onOpenChange(!widget.open); }, child: Text(widget.label, style: TextStyle(color: csColor(pack.colorTextPrimary))))),
          if (widget.open) Opacity(opacity: place == null ? 0 : 1, child: Transform.translate(offset: Offset(place?.x ?? 0, place?.y ?? 0), child: Semantics(
            container: true,
            explicitChildNodes: true,
            label: csMenuCopy('menu', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context))),
            child: Column(key: listKey, crossAxisAlignment: CrossAxisAlignment.start, children: [
            for (var index = 0; index < widget.items.length; index++)
              CsOwnFocus(builder: (node, claim) => TextButton(
                focusNode: node,
                onPressed: () {
                  claim();
                  setState(() => focus = index);
                  widget.onOpenChange(false);
                  widget.onSelect(widget.items[index]);
                },
                child: Text(widget.items[index], style: TextStyle(color: csColor(focus == index ? pack.colorBrandOchre : pack.colorTextPrimary))),
              )),
            ]),
          ))),
        ],
      ),
    );
  }
}

class CsMenubarMenu {
  const CsMenubarMenu(this.label, this.items);
  final String label;
  final List<String> items;
}

class CsMenubar extends StatefulWidget {
  const CsMenubar({super.key, this.label, required this.menus, required this.onSelect, required this.dark, required this.highContrast, required this.compact, this.hasLabelledBy = false, this.language});
  final String? label;
  final bool hasLabelledBy;
  final String? language;
  final List<CsMenubarMenu> menus;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsMenubar> createState() => _CsMenubarState();
}

class _CsMenubarState extends State<CsMenubar> {
  var state = const CsMenubarState(0, null, 0);
  final buttons = <int, GlobalKey>{};
  final listKey = GlobalKey();
  Size? natural;
  Size? fitted;
  CsMenubarPlace? place;

  GlobalKey buttonKey(int index) => buttons.putIfAbsent(index, GlobalKey.new);

  void measure(int open) {
    final fieldBox = buttonKey(open).currentContext?.findRenderObject() as RenderBox?;
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
    final next = csMenubarShift(
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
      csMenubarPlacement(null),
    );
    setState(() { fitted = listBox.size; place = next; });
  }

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final open = state.open;
    if (open == null) { natural = null; fitted = null; }
    if (open != null) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && state.open == open) measure(open); });
    return Semantics(
      label: csMenubarLabel(widget.label, widget.hasLabelledBy, csMenubarCopy('label', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            for (var index = 0; index < widget.menus.length; index++)
              CsOwnFocus(builder: (node, claim) => TextButton(
                key: buttonKey(index),
                focusNode: node,
                onPressed: () {
                  claim();
                  setState(() => state = CsMenubarState(index, state.open == index ? null : index, 0));
                },
                child: Text(widget.menus[index].label, style: TextStyle(color: csColor(state.top == index ? pack.colorBrandOchre : pack.colorTextPrimary))),
              )),
          ]),
          if (open != null)
            Opacity(opacity: place == null ? 0 : 1, child: Transform.translate(key: listKey, offset: Offset(place?.x ?? 0, place?.y ?? 0), child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                for (var index = 0; index < widget.menus[open].items.length; index++)
                  CsOwnFocus(builder: (node, claim) => TextButton(
                    focusNode: node,
                    onPressed: () {
                      claim();
                      widget.onSelect(widget.menus[open].items[index]);
                      setState(() => state = CsMenubarState(state.top, null, state.item));
                    },
                    child: Text(widget.menus[open].items[index]),
                  )),
              ],
            ))),
        ],
      ),
    );
  }
}

class CsBackTop extends StatelessWidget {
  const CsBackTop({super.key, this.label, required this.offset, required this.onPress, required this.dark, required this.highContrast, required this.compact, this.threshold = 320, this.language});
  final String? label;
  final String? language;
  final double offset;
  final VoidCallback onPress;
  final double threshold;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    if (!csBackTopVisible(offset, threshold: threshold)) return const SizedBox.shrink();
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final name = csBackTopLabelText(label, csBackTopCopy('label', csSelectResolvedLanguage(language, CsLanguageScope.of(context))));
    return CsOwnFocus(builder: (node, claim) => Semantics(label: name, button: true, child: TextButton(focusNode: node, onPressed: () { claim(); onPress(); }, child: ExcludeSemantics(child: Text(name, style: TextStyle(color: csColor(pack.colorSemanticInfoFg)))))));
  }
}

class CsFab extends StatefulWidget {
  const CsFab({super.key, required this.label, required this.onPress, required this.dark, required this.highContrast, required this.compact, this.actions = const []});
  final String label;
  final List<String> actions;
  final VoidCallback onPress;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsFab> createState() => _CsFabState();
}

class _CsFabState extends State<CsFab> {
  var open = false;
  final fieldKey = GlobalKey();
  final listKey = GlobalKey();
  Size? natural;
  Size? fitted;
  CsFabPlace? place;

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
    final next = csFabShift(
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
      csFabPlacement(null),
    );
    setState(() { fitted = listBox.size; place = next; });
  }

  @override
  Widget build(BuildContext context) {
    if (!open) { natural = null; fitted = null; }
    if (open && widget.actions.isNotEmpty) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && open) measure(); });
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        if (open && widget.actions.isNotEmpty)
          Opacity(opacity: place == null ? 0 : 1, child: Transform.translate(key: listKey, offset: Offset(place?.x ?? 0, place?.y ?? 0), child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              for (final action in widget.actions) CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); setState(() => open = false); }, child: Text(action))),
            ],
          ))),
        CsOwnFocus(builder: (node, claim) => TextButton(
          key: fieldKey,
          focusNode: node,
          onPressed: () {
            claim();
            if (widget.actions.isEmpty) {
              widget.onPress();
            } else {
              setState(() => open = !open);
            }
          },
          child: Text(widget.label, style: TextStyle(color: csColor(pack.colorSemanticInfoFg))),
        )),
      ],
    );
  }
}

const csDisclosureLabel = 'AI assisted';
const csDisclosurePlacement = 'bottom-start';
String csDisclosureLabelText(String? label, String fallback) => label ?? fallback;
const csDisclosureDetails = 'This content was generated or transformed with AI assistance.';
const csDisclosureSources = 'Sources';
String csDisclosureCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {
    'label': 'Có AI hỗ trợ',
    'details': 'Nội dung này được tạo hoặc chuyển đổi với sự hỗ trợ của AI.',
    'sources': 'Nguồn',
  };
  const en = {'label': csDisclosureLabel, 'details': csDisclosureDetails, 'sources': csDisclosureSources};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csDisclosurePlacementText(String? placement, String fallback) => placement ?? fallback;
String? csDisclosureSourceLine(List<String?> sources, String prefix) {
  final kept = sources.whereType<String>().where((item) => item.isNotEmpty).toList();
  return kept.isEmpty ? null : '$prefix: ${kept.join(', ')}';
}
String? csDisclosureControls(bool open, String id) => open ? id : null;
const csDisclosureGap = 8.0;
class CsDisclosurePlace {
  const CsDisclosurePlace(this.x, this.y, this.maxWidth, this.maxHeight, this.placement);
  final double x;
  final double y;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsDisclosurePlace? csDisclosureShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY, String placement) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: placement, gap: csDisclosureGap);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: csDisclosureGap);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsDisclosurePlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}
class CsAIDisclosure extends StatefulWidget {
  const CsAIDisclosure({super.key, this.label, this.details, required this.sources, required this.expandedLabel, required this.collapsedLabel, required this.open, required this.onOpenChange, required this.dark, required this.highContrast, required this.compact, this.language});
  final String? label;
  final String? details;
  final String? language;
  final List<String> sources;
  final String expandedLabel;
  final String collapsedLabel;
  final bool open;
  final ValueChanged<bool> onOpenChange;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  State<CsAIDisclosure> createState() => _CsAIDisclosureState();
}

class _CsAIDisclosureState extends State<CsAIDisclosure> {
  final fieldKey = GlobalKey();
  final listKey = GlobalKey();
  Size? natural;
  Size? fitted;
  CsDisclosurePlace? place;

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
    final next = csDisclosureShift(
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
      csDisclosurePlacementText(null, csDisclosurePlacement),
    );
    setState(() { fitted = listBox.size; place = next; });
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.open) { natural = null; fitted = null; }
    if (widget.open) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && widget.open) measure(); });
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final spoken = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final badge = csDisclosureLabelText(widget.label, csDisclosureCopy('label', spoken));
    final explanation = widget.details ?? csDisclosureCopy('details', spoken);
    final line = csDisclosureSourceLine(widget.sources, csDisclosureCopy('sources', spoken));
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CsOwnFocus(builder: (node, claim) => Semantics(label: badge, value: widget.open ? widget.expandedLabel : widget.collapsedLabel, button: true, child: TextButton(key: fieldKey, focusNode: node, onPressed: () { claim(); widget.onOpenChange(!widget.open); }, child: ExcludeSemantics(child: Text(badge, style: TextStyle(color: csColor(pack.colorTextPrimary))))))),
        if (widget.open) Opacity(opacity: place == null ? 0 : 1, child: Transform.translate(key: listKey, offset: Offset(place?.x ?? 0, place?.y ?? 0), child: Semantics(liveRegion: true, container: true, child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(explanation, style: TextStyle(color: csColor(pack.colorTextPrimary))),
            if (line != null) Text(line, style: TextStyle(color: csColor(pack.colorTextMuted))),
          ],
        )))),
      ],
    );
  }
}

class CsAspectRatio extends StatelessWidget {
  const CsAspectRatio({super.key, required this.ratio, required this.width, required this.child});
  final String ratio;
  final double width;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final height = csAspectHeight(ratio, width) ?? width;
    return SizedBox(width: width, height: height, child: child);
  }
}

String csWatermarkEscape(String text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');

List<Offset> csWatermarkCenters(double width, double height, double gap) {
  if (gap <= 0 || width <= 0 || height <= 0) return const [];
  final points = <Offset>[];
  var y = gap / 2;
  while (y < height) {
    var x = gap / 2;
    while (x < width) {
      points.add(Offset(x, y));
      x += gap;
    }
    y += gap;
  }
  return points;
}

class CsWatermark extends StatelessWidget {
  const CsWatermark({super.key, this.text = 'CyberSkill', required this.child, this.opacity = 0.09, this.gap = 140, this.rotate = -22, this.dark = false, this.highContrast = false, this.compact = false});
  final String text;
  final Widget child;
  final double opacity;
  final double gap;
  final double rotate;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final ink = csColor(csModePack(dark: dark, highContrast: highContrast, compact: compact).colorTextPrimary).withOpacity(opacity);
    return Stack(children: [
      child,
      Positioned.fill(child: ExcludeSemantics(child: IgnorePointer(child: CustomPaint(painter: _WatermarkPainter(text, ink, gap, rotate))))),
    ]);
  }
}

class _WatermarkPainter extends CustomPainter {
  _WatermarkPainter(this.text, this.ink, this.gap, this.rotate);
  final String text;
  final Color ink;
  final double gap;
  final double rotate;
  @override
  void paint(Canvas canvas, Size size) {
    final painter = TextPainter(
      text: TextSpan(text: text, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: ink)),
      textDirection: TextDirection.ltr,
    )..layout();
    for (final point in csWatermarkCenters(size.width, size.height, gap)) {
      canvas.save();
      canvas.translate(point.dx, point.dy);
      canvas.rotate(rotate * 3.141592653589793 / 180);
      painter.paint(canvas, Offset(-painter.width / 2, -painter.height / 2));
      canvas.restore();
    }
  }
  @override
  bool shouldRepaint(covariant _WatermarkPainter oldDelegate) => oldDelegate.text != text || oldDelegate.ink != ink || oldDelegate.gap != gap || oldDelegate.rotate != rotate;
}
