import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'controls.dart';
import 'icon_paths.dart';
import 'surfaces.dart';

enum CsRovingKey { right, left, up, down, home, end }

const csMenuLabel = 'Menu';
const csMenuGap = 6.0;
bool csMenuEscapeClose() => false;
bool csMenuTabClose() => false;
bool csMenuIsSeparator(String item) => item == '-';
List<String> csMenuActionable(List<String> items) => items.where((item) => !csMenuIsSeparator(item)).toList();
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
bool csFabEscapeClose() => false;
bool csFabIsStatic(String? position) => position == 'static';
String csFabRootClass(String? position) => csFabIsStatic(position) ? 'cs-fab cs-fab--static' : 'cs-fab';
String csFabDialClass(String? position) => csFabIsStatic(position) ? 'cs-fab__dial cs-fab__dial--static' : 'cs-fab__dial';
String csFabMainGlyph(String? icon, String label) => icon ?? label;
int? csFabSelectAction(int index, int count) => index >= 0 && index < count ? index : null;
bool? csFabExpanded(int actionCount, bool open) => actionCount > 0 ? open : null;
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
const csBackTopArrow = 'M12 19V5M5 12l7-7 7 7';
const csBackTopIconSize = 18.0;
const csBackTopStrokeWidth = 2.0;
double csBackTopScrollTopTarget() => 0.0;
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
CsMenubarState csMenubarTabClose(int top) => CsMenubarState(top, null, 0);
CsMenubarState csMenubarEscapeClose(int top) => CsMenubarState(top, null, 0);
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

CsMenubarState? csMenubarItem(int menu, int item, int menuCount, int itemCount, CsRovingKey key) {
  if (menuCount <= 0) return null;
  if (key == CsRovingKey.right || key == CsRovingKey.left) {
    final next = csNonnegative(menu + (key == CsRovingKey.right ? 1 : -1 + menuCount), menuCount);
    return CsMenubarState(next, next, 0);
  }
  final moved = csMenuIndex(item, itemCount, key);
  if (moved == null) return null;
  return CsMenubarState(menu, menu, moved);
}

bool csBackTopVisible(double offset, {double threshold = 320}) => offset > threshold;

const csAspectDefaultRatio = '16 / 9';
String csAspectNormalizedRatio(String ratio) => ratio.trim();
double? csAspectHeightFromNumber(double ratio, double width) => ratio > 0 ? width / ratio : null;
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
  const CsMenu({super.key, required this.label, required this.items, required this.open, required this.onOpenChange, required this.onSelect, required this.dark, required this.highContrast, required this.compact, this.language, this.align = 'start', this.placement, this.portal = true, this.dangerItems = const <String>{}});
  final String? language;
  final String align;
  final String? placement;
  final bool portal;
  final Set<String> dangerItems;
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
  var typed = '';
  var typedAt = 0;
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
    if (widget.open && event.logicalKey == LogicalKeyboardKey.escape) {
      widget.onOpenChange(csMenuEscapeClose());
      return KeyEventResult.handled;
    }
    if (widget.open && event.logicalKey == LogicalKeyboardKey.tab) {
      widget.onOpenChange(csMenuTabClose());
      return KeyEventResult.ignored;
    }
    final enabled = csMenuActionable(widget.items);
    final CsRovingKey? key = switch (event.logicalKey) {
      LogicalKeyboardKey.arrowDown => CsRovingKey.down,
      LogicalKeyboardKey.arrowUp => CsRovingKey.up,
      LogicalKeyboardKey.arrowLeft => CsRovingKey.left,
      LogicalKeyboardKey.arrowRight => CsRovingKey.right,
      LogicalKeyboardKey.home => CsRovingKey.home,
      LogicalKeyboardKey.end => CsRovingKey.end,
      _ => null,
    };
    if (key == null) {
      final ch = event.character;
      if (widget.open && ch != null && ch.length == 1 && ch != ' ') {
        final now = DateTime.now().millisecondsSinceEpoch;
        final needle = csMenuNeedle(typed, ch, now - typedAt);
        typed = needle;
        typedAt = now;
        final hit = csMenuTypeahead(enabled, focus, needle);
        if (hit != null) {
          setState(() => focus = hit);
          return KeyEventResult.handled;
        }
      }
      return KeyEventResult.ignored;
    }
    if (!widget.open && (key == CsRovingKey.down || key == CsRovingKey.up)) {
      widget.onOpenChange(true);
      setState(() => focus = key == CsRovingKey.up ? (enabled.isEmpty ? 0 : enabled.length - 1) : 0);
      return KeyEventResult.handled;
    }
    final next = csMenuIndex(focus, enabled.length, key);
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
          CsOwnFocus(builder: (node, claim) => TextButton(key: fieldKey, focusNode: node, onPressed: () { claim(); final nextOpen = !widget.open; setState(() => focus = nextOpen ? 0 : -1); widget.onOpenChange(nextOpen); }, child: Text(widget.label, style: TextStyle(color: csColor(pack.colorTextPrimary))))),
          if (widget.open) Opacity(opacity: place == null ? 0 : 1, child: Transform.translate(offset: Offset(place?.x ?? 0, place?.y ?? 0), child: Semantics(
            container: true,
            explicitChildNodes: true,
            label: csMenuCopy('menu', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context))),
            child: ConstrainedBox(
              constraints: BoxConstraints(minWidth: csNavigationStyleMenuListMinWidth()),
              child: Container(
                key: listKey,
                padding: EdgeInsets.all(csNavigationStyleMenuListPadding()),
                decoration: BoxDecoration(
                  color: csColor(pack.colorSurfacePanel),
                  borderRadius: BorderRadius.circular(csPoints(pack.radiusMd)),
                  border: Border.all(color: csColor(pack.colorBorderDefault), width: csNavigationStyleMenuListBorderWidth()),
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  for (var index = 0; index < widget.items.length; index++) ...[
                    if (index > 0) SizedBox(height: csNavigationStyleMenuListGap()),
                    if (csMenuIsSeparator(widget.items[index]))
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: csNavigationStyleMenuSeparatorMarginX(), vertical: csNavigationStyleMenuSeparatorMarginY()),
                        child: SizedBox(height: csNavigationStyleMenuSeparatorHeight(), width: double.infinity, child: ColoredBox(color: csColor(pack.colorBorderDefault))),
                      )
                    else
                      CsOwnFocus(builder: (node, claim) {
                        final actionIndex = csMenuActionable(widget.items.take(index + 1).toList()).length - 1;
                        return Padding(
                          padding: EdgeInsets.symmetric(horizontal: csNavigationStyleMenuItemPaddingX(), vertical: csNavigationStyleMenuItemPaddingY()),
                          child: TextButton(
                            focusNode: node,
                            onPressed: () {
                              claim();
                              setState(() => focus = actionIndex);
                              widget.onOpenChange(false);
                              widget.onSelect(widget.items[index]);
                            },
                            child: Text(widget.items[index], style: TextStyle(fontSize: csNavigationStyleMenuItemFontSize(pack), color: csColor(focus == actionIndex ? pack.colorBrandOchre : (widget.dangerItems.contains(widget.items[index]) ? pack.colorSemanticDangerFg : pack.colorTextPrimary)))),
                          ),
                        );
                      }),
                  ],
                ]),
              ),
            ),
          ))),
        ],
      ),
    );
  }
}

class CsMenubarMenu {
  const CsMenubarMenu(this.label, this.items, {this.dangerItems = const <String>{}});
  final String label;
  final List<String> items;
  final Set<String> dangerItems;
}

class CsMenubar extends StatefulWidget {
  const CsMenubar({super.key, this.label, required this.menus, required this.onSelect, required this.dark, required this.highContrast, required this.compact, this.hasLabelledBy = false, this.language, this.placement, this.portal = true});
  final String? label;
  final bool hasLabelledBy;
  final String? language;
  final String? placement;
  final bool portal;
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

  KeyEventResult _key(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    if (state.open != null && event.logicalKey == LogicalKeyboardKey.escape) {
      setState(() => state = csMenubarEscapeClose(state.top));
      return KeyEventResult.handled;
    }
    if (state.open != null && event.logicalKey == LogicalKeyboardKey.tab) {
      setState(() => state = csMenubarTabClose(state.top));
      return KeyEventResult.handled;
    }
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
    if (state.open == null) {
      final count = state.top >= 0 && state.top < widget.menus.length ? csMenubarActionable(widget.menus[state.top].items).length : 0;
      final next = csMenubarBar(state.top, state.open, widget.menus.length, count, key);
      if (next == null) return KeyEventResult.ignored;
      setState(() => state = next);
      return KeyEventResult.handled;
    }
    final menu = state.open ?? state.top;
    final count = menu >= 0 && menu < widget.menus.length ? csMenubarActionable(widget.menus[menu].items).length : 0;
    final next = csMenubarItem(menu, state.item, widget.menus.length, count, key);
    if (next == null) return KeyEventResult.ignored;
    setState(() => state = next);
    return KeyEventResult.handled;
  }

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
      csMenubarPlacement(widget.placement),
    );
    setState(() { fitted = listBox.size; place = next; });
  }

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final open = state.open;
    if (open == null) { natural = null; fitted = null; }
    if (open != null) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && state.open == open) measure(open); });
    return Focus(
      onKeyEvent: _key,
      child: Semantics(
      label: csMenubarLabel(widget.label, widget.hasLabelledBy, csMenubarCopy('label', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.all(csControlsBatchStyleMenubarPadding()),
            child: Row(children: [
              for (var index = 0; index < widget.menus.length; index++) ...[
                if (index > 0) SizedBox(width: csControlsBatchStyleMenubarGap()),
                MouseRegion(
                  onEnter: (_) {
                    if (state.open != null && state.open != index) {
                      setState(() => state = CsMenubarState(state.top, csMenubarHover(state.open, index), 0));
                    }
                  },
                  child: CsOwnFocus(builder: (node, claim) => TextButton(
                  key: buttonKey(index),
                  focusNode: node,
                  onPressed: () {
                    claim();
                    setState(() => state = CsMenubarState(index, state.open == index ? null : index, 0));
                  },
                  child: Text(widget.menus[index].label, style: TextStyle(fontSize: csControlsBatchStyleMenubarTopFontSize, fontWeight: FontWeight.w600, color: csColor(state.top == index ? pack.colorBrandOchre : pack.colorTextPrimary))),
                )),
                ),
              ],
            ]),
          ),
          if (open != null)
            Opacity(opacity: place == null ? 0 : 1, child: Transform.translate(key: listKey, offset: Offset(place?.x ?? 0, place?.y ?? 0), child: ConstrainedBox(
              constraints: BoxConstraints(minWidth: csNavigationStyleMenuListMinWidth()),
              child: Container(
                padding: EdgeInsets.all(csNavigationStyleMenuListPadding()),
                decoration: BoxDecoration(
                  color: csColor(pack.colorSurfacePanel),
                  borderRadius: BorderRadius.circular(csPoints(pack.radiusMd)),
                  border: Border.all(color: csColor(pack.colorBorderDefault), width: csNavigationStyleMenuListBorderWidth()),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (var index = 0; index < widget.menus[open].items.length; index++) ...[
                      if (index > 0) SizedBox(height: csNavigationStyleMenuListGap()),
                      if (widget.menus[open].items[index] == '-')
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: csNavigationStyleMenuSeparatorMarginX(), vertical: csNavigationStyleMenuSeparatorMarginY()),
                          child: SizedBox(height: csNavigationStyleMenuSeparatorHeight(), width: double.infinity, child: ColoredBox(color: csColor(pack.colorBorderDefault))),
                        )
                      else
                        CsOwnFocus(builder: (node, claim) {
                          final actionIndex = csMenubarActionable(widget.menus[open].items.take(index + 1).toList()).length - 1;
                          return Padding(
                            padding: EdgeInsets.symmetric(horizontal: csNavigationStyleMenuItemPaddingX(), vertical: csNavigationStyleMenuItemPaddingY()),
                            child: TextButton(
                              focusNode: node,
                              onPressed: () {
                                claim();
                                widget.onSelect(widget.menus[open].items[index]);
                                setState(() => state = CsMenubarState(state.top, null, state.item));
                              },
                              child: Text(widget.menus[open].items[index], style: TextStyle(fontSize: csNavigationStyleMenuItemFontSize(pack), color: csColor(state.item == actionIndex ? pack.colorBrandOchre : (widget.menus[open].dangerItems.contains(widget.menus[open].items[index]) ? pack.colorSemanticDangerFg : pack.colorTextPrimary)))),
                            ),
                          );
                        }),
                    ],
                  ],
                ),
              ),
            ))),
        ],
      ),
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
    return Container(
      width: csControlsBatchStyleBackTopSize(),
      height: csControlsBatchStyleBackTopSize(),
      decoration: BoxDecoration(
        color: csColor(pack.colorSurfacePanel),
        shape: BoxShape.circle,
        border: Border.all(color: csColor(pack.colorBorderDefault), width: 1),
      ),
      child: CsOwnFocus(builder: (node, claim) => Semantics(label: name, button: true, child: TextButton(focusNode: node, onPressed: () { claim(); onPress(); }, child: ExcludeSemantics(child: CsIcon(name: 'arrow-up', label: '', dark: dark, highContrast: highContrast, compact: compact, size: 'sm'))))),
    );
  }
}

class CsFab extends StatefulWidget {
  const CsFab({super.key, required this.label, required this.onPress, required this.dark, required this.highContrast, required this.compact, this.icon, this.actions = const [], this.position = 'fixed', this.placement, this.portal = true, this.onSelectAction});
  final String label;
  final String? icon;
  final List<String> actions;
  final String position;
  final String? placement;
  final bool portal;
  final VoidCallback onPress;
  final ValueChanged<int>? onSelectAction;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsFab> createState() => _CsFabState();
}

class CsFloatingActionButton extends StatelessWidget {
  const CsFloatingActionButton({super.key, required this.label, required this.onPress, required this.dark, required this.highContrast, required this.compact, this.icon, this.actions = const [], this.position = 'fixed', this.placement, this.portal = true, this.onSelectAction});
  final String label;
  final String? icon;
  final List<String> actions;
  final String position;
  final String? placement;
  final bool portal;
  final VoidCallback onPress;
  final ValueChanged<int>? onSelectAction;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    return CsFab(label: label, icon: icon, actions: actions, position: position, placement: placement, portal: portal, onPress: onPress, onSelectAction: onSelectAction, dark: dark, highContrast: highContrast, compact: compact);
  }
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
      csFabPlacement(widget.placement),
    );
    setState(() { fitted = listBox.size; place = next; });
  }

  @override
  Widget build(BuildContext context) {
    if (!open) { natural = null; fitted = null; }
    if (open && widget.actions.isNotEmpty) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && open) measure(); });
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    return Focus(
      onKeyEvent: (node, event) {
        if (open && event is KeyDownEvent && event.logicalKey == LogicalKeyboardKey.escape) {
          setState(() => open = csFabEscapeClose());
          return KeyEventResult.handled;
        }
        return KeyEventResult.ignored;
      },
      child: Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        if (open && widget.actions.isNotEmpty)
          Opacity(opacity: place == null ? 0 : 1, child: Transform.translate(key: listKey, offset: Offset(place?.x ?? 0, place?.y ?? 0), child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              for (var i = 0; i < widget.actions.length; i++) ...[
                if (i > 0) SizedBox(height: csControlsWaveStyleFabDialGap()),
                SizedBox(
                  width: csControlsWaveStyleFabMiniSize(),
                  height: csControlsWaveStyleFabMiniSize(),
                  child: CsOwnFocus(builder: (node, claim) => TextButton(
                    focusNode: node,
                    onPressed: () {
                      claim();
                      setState(() => open = false);
                      final chosen = csFabSelectAction(i, widget.actions.length);
                      if (chosen != null) widget.onSelectAction?.call(chosen);
                    },
                    child: Text(widget.actions[i]),
                  )),
                ),
              ],
            ],
          ))),
        SizedBox(
          width: csControlsWaveStyleFabMainSize(),
          height: csControlsWaveStyleFabMainSize(),
          child: CsOwnFocus(builder: (node, claim) => Semantics(
            label: widget.label,
            value: csFabExpanded(widget.actions.length, open)?.toString(),
            button: true,
            child: TextButton(
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
              child: Text(csFabMainGlyph(widget.icon, widget.label), style: TextStyle(color: csColor(pack.colorSemanticInfoFg))),
            ),
          )),
        ),
      ],
    ),
    );
  }
}

const csDisclosureLabel = 'AI assisted';
const csDisclosurePlacement = 'bottom-start';
const csDisclosurePanelRole = 'status';
bool csDisclosureEscapeClose() => false;
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
  const CsAIDisclosure({super.key, this.label, this.details, this.sources = const [], this.expandedLabel = 'true', this.collapsedLabel = 'false', required this.open, required this.onOpenChange, required this.dark, required this.highContrast, required this.compact, this.language, this.placement, this.portal = true});
  final String? label;
  final String? details;
  final String? language;
  final String? placement;
  final bool portal;
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

class CsAIDisclosureBadge extends StatelessWidget {
  const CsAIDisclosureBadge({super.key, this.label, this.details, this.sources = const [], this.expandedLabel = 'true', this.collapsedLabel = 'false', required this.open, required this.onOpenChange, required this.dark, required this.highContrast, required this.compact, this.language, this.placement, this.portal = true});
  final String? label;
  final String? details;
  final String? language;
  final String? placement;
  final bool portal;
  final List<String> sources;
  final String expandedLabel;
  final String collapsedLabel;
  final bool open;
  final ValueChanged<bool> onOpenChange;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    return CsAIDisclosure(label: label, details: details, sources: sources, expandedLabel: expandedLabel, collapsedLabel: collapsedLabel, open: open, onOpenChange: onOpenChange, dark: dark, highContrast: highContrast, compact: compact, language: language, placement: placement, portal: portal);
  }
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
      csDisclosurePlacementText(widget.placement, csDisclosurePlacement),
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
    return Focus(
      onKeyEvent: (node, event) {
        if (widget.open && event is KeyDownEvent && event.logicalKey == LogicalKeyboardKey.escape) {
          widget.onOpenChange(csDisclosureEscapeClose());
          return KeyEventResult.handled;
        }
        return KeyEventResult.ignored;
      },
      child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CsOwnFocus(builder: (node, claim) => Semantics(
          label: badge,
          value: widget.open ? widget.expandedLabel : widget.collapsedLabel,
          button: true,
          child: TextButton(
            key: fieldKey,
            focusNode: node,
            onPressed: () { claim(); widget.onOpenChange(!widget.open); },
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: csDisclosureStyleBadgePaddingX(), vertical: csDisclosureStyleBadgePaddingY()),
              decoration: BoxDecoration(
                color: csColor(pack.colorSurfaceRaised),
                borderRadius: BorderRadius.circular(csDisclosureStyleBadgeRadius()),
              ),
              child: ExcludeSemantics(child: Text(badge, style: TextStyle(fontSize: csDisclosureStyleBadgeFontSize(), fontWeight: FontWeight.w700, color: csColor(pack.colorTextPrimary)))),
            ),
          ),
        )),
        if (widget.open) ...[
          SizedBox(height: csDisclosureStylePanelTopOffset()),
          Opacity(opacity: place == null ? 0 : 1, child: Transform.translate(key: listKey, offset: Offset(place?.x ?? 0, place?.y ?? 0), child: Semantics(liveRegion: true, container: true, child: ConstrainedBox(
            constraints: BoxConstraints(minWidth: csDisclosureStylePanelMinWidth()),
            child: Container(
              padding: EdgeInsets.all(csDisclosureStylePanelPadding()),
              decoration: BoxDecoration(
                color: csColor(pack.colorSurfacePanel),
                borderRadius: BorderRadius.circular(csPoints(pack.radiusMd)),
                border: Border.all(color: csColor(pack.colorBorderDefault).withOpacity(csDisclosureStylePanelBorderAlpha), width: csDisclosureStylePanelBorderWidth()),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(explanation, style: TextStyle(color: csColor(pack.colorTextPrimary))),
                  if (line != null) ...[
                    SizedBox(height: csDisclosureStylePanelGap()),
                    Text(line, style: TextStyle(fontSize: csDisclosureStyleSourcesFontSize(), color: csColor(pack.colorTextMuted))),
                  ],
                ],
              ),
            ),
          )))),
        ],
      ],
    ),
    );
  }
}

class CsAspectRatio extends StatelessWidget {
  const CsAspectRatio({super.key, this.ratio = '16 / 9', required this.width, required this.child, this.dark = false, this.highContrast = false, this.compact = false});
  final String ratio;
  final double width;
  final Widget child;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final height = csAspectHeight(ratio, width) ?? width;
    return ClipRRect(
      borderRadius: BorderRadius.circular(csDataStyleAspectRatioRadius(pack)),
      child: SizedBox(width: width, height: height, child: child),
    );
  }
}

const csWatermarkFontSize = 14.0;
const csWatermarkFontWeight = 700;
String csWatermarkEscape(String text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
String csWatermarkSvgMarkup({String text = 'CyberSkill', double opacity = 0.09, int gap = 140, int rotate = -22}) {
  final half = gap ~/ 2;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="$gap" height="$gap"><text x="50%" y="50%" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="700" fill="black" fill-opacity="$opacity" text-anchor="middle" transform="rotate($rotate $half $half)">${csWatermarkEscape(text)}</text></svg>';
}

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
