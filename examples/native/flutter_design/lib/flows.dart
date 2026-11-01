import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'catalog.dart';
import 'controls.dart';
import 'surfaces.dart';

const csTimeLabel = 'Time';
const csTimeValueDefault = '09:00';
const csTimeDefaultStep = 30.0;
const csTimeMinStep = 1;
const csTimeMaxStep = 1440;
const csTimeClockGlyph = '🕒';
bool csTimeShowsClockIcon() => true;
double csTimeClockIconSize() => 16;
double csTimeClockIconStrokeWidth() => 1.8;
int csTimeSafeStep(double step) {
  final whole = step.truncateToDouble();
  return step.isFinite && step == whole && whole >= csTimeMinStep && whole <= csTimeMaxStep ? whole.toInt() : csTimeDefaultStep.toInt();
}
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
  final safe = csTimeSafeStep(step);
  final out = <String>[];
  for (var minute = 0; minute < 24 * 60; minute += safe) {
    final hour = (minute ~/ 60).toString().padLeft(2, '0');
    final rest = (minute % 60).toString().padLeft(2, '0');
    out.add('$hour:$rest');
  }
  return out;
}

const csMentionDefaultRows = 3;
const csMentionMaxHits = 6;
String csMentionPlacement(String? placement) => placement ?? 'bottom-start';
int csMentionResolvedRows(int rows) => rows < 1 ? 1 : rows;
String csMentionResolvedValue(String? value, [String defaultValue = '']) => value ?? defaultValue;
String csMentionOptionId(String listId, int index) => '$listId-opt-$index';
String? csMentionActiveDescendantId(String listId, bool open, int activeIndex, int hitCount) =>
    open && activeIndex >= 0 && activeIndex < hitCount ? csMentionOptionId(listId, activeIndex) : null;
String csMentionOptionClass(bool active) => active ? 'hl' : '';
bool csMentionAcceptsKey(bool composing, int keyCode) => !composing && keyCode != 229;
int csMentionActive(int index, int count) => count <= 0 ? 0 : (index < 0 ? 0 : (index > count - 1 ? count - 1 : index));
int csMentionNextIndex(int current, int count, {required bool down}) {
  if (count <= 0) return 0;
  if (down) return current + 1 < count ? current + 1 : count - 1;
  return current > 0 ? current - 1 : 0;
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
  return users.where((user) => user.toLowerCase().contains(query)).take(csMentionMaxHits).toList();
}

const csSortGripGlyph = '⠿';
const csSortUpGlyph = '↑';
const csSortDownGlyph = '↓';
String csSortItemClass(bool dragging, bool over) =>
    [
      'cs-sortable__item',
      if (dragging) 'is-dragging',
      if (over) 'is-over',
    ].join(' ');
String? csSortStartsDrag(bool fromOps, String key) => fromOps ? null : key;
List<String> csReorder(List<String> items, int from, int to) {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length || from == to) return items;
  final next = [...items];
  final moved = next.removeAt(from);
  next.insert(to, moved);
  return next;
}

const csTourDialogRole = 'dialog';
const csTourSkipButtonVariant = 'ghost';
const csTourBackButtonVariant = 'secondary';
const csTourPrimaryButtonVariant = 'primary';
const csTourButtonSize = 'xs';
String csTourTitleId(String baseId) => '$baseId-title';
int csTourResetIndexOnOpen(bool open, int current) => open ? 0 : current;
String csTourPrimaryActionLabel(bool isLast, String next, String done) => isLast ? done : next;
int csTourClamp(int index, int count) => count <= 0 ? 0 : (index < 0 ? 0 : (index > count - 1 ? count - 1 : index));
void csTourNotifyClose(ValueChanged<bool>? onOpenChange, VoidCallback? onClose) {
  onOpenChange?.call(false);
  onClose?.call();
}
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
bool csTourShows(bool open, int count) => open && count > 0;
bool csTourClosesOnBackdrop() => true;
int csTourStops(bool hasBack) => hasBack ? 3 : 2;
bool csTourShowsBody(String? body) => body != null && body.isNotEmpty;
class CsTourTarget {
  const CsTourTarget(this.left, this.top, this.width, this.height);
  final double left;
  final double top;
  final double width;
  final double height;
}
class CsTourHole {
  const CsTourHole(this.x, this.y, this.w, this.h);
  final double x;
  final double y;
  final double w;
  final double h;
}
class CsTourPop {
  const CsTourPop(this.top, this.left);
  final double top;
  final double left;
}
CsTourHole? csTourHole(CsTourTarget? target) => target == null ? null : CsTourHole(target.left - 6, target.top - 6, target.width + 12, target.height + 12);
CsTourPop csTourPop(CsTourHole? hole, double viewWidth, double viewHeight) {
  if (hole == null) return const CsTourPop(80, 40);
  final top = viewHeight - 170 < hole.y + hole.h + 12 ? viewHeight - 170 : hole.y + hole.h + 12;
  final room = viewWidth - 292 < hole.x ? viewWidth - 292 : hole.x;
  final left = room < 12 ? 12.0 : room;
  return CsTourPop(top, left);
}

class CsTimePicker extends StatefulWidget {
  const CsTimePicker({super.key, this.label, this.value = csTimeValueDefault, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.step = csTimeDefaultStep, this.disabled = false, this.labelledBy, this.language});
  final String? label;
  final String? labelledBy;
  final String? language;
  final String value;
  final ValueChanged<String> onChange;
  final double step;
  final bool disabled;
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
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final gap = csControlsWaveStyleTimePickerGap();
    final padX = csControlsWaveStyleTimePickerPaddingX();
    final timeName = csTimeName(widget.label, widget.labelledBy, csTimeCopy('label', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context))));
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(mainAxisSize: MainAxisSize.min, children: [
        if (csTimeShowsClockIcon()) ...[
          ExcludeSemantics(child: Text(csTimeClockGlyph, style: TextStyle(color: csColor(pack.colorTextMuted)))),
          SizedBox(width: gap),
        ],
        Padding(padding: EdgeInsets.symmetric(horizontal: padX), child: CsOwnFocus(builder: (node, claim) => Semantics(label: timeName, button: true, enabled: !widget.disabled, child: TextButton(focusNode: node, onPressed: widget.disabled ? null : () { claim(); setState(() => open = !open); }, child: ExcludeSemantics(child: Text(widget.value, style: TextStyle(color: csColor(pack.colorTextPrimary)))))))),
      ]),
      if (open && !widget.disabled) ...[
        SizedBox(height: gap),
        for (final slot in csTimeSlots(widget.step)) CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); widget.onChange(slot); setState(() => open = false); }, child: Text(slot))),
      ],
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
bool csMentionClearOnBlur(bool relatedInside) => !relatedInside;
class CsMentionPlace {
  const CsMentionPlace(this.x, this.y, this.maxWidth, this.maxHeight, this.placement);
  final double x;
  final double y;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsMentionPlace? csMentionShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY, {String placement = 'bottom-start'}) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: placement, gap: 0);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: 0);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsMentionPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}

class CsMentions extends StatefulWidget {
  const CsMentions({super.key, this.text, this.defaultValue = '', this.users = const [], required this.onChange, required this.dark, required this.highContrast, required this.compact, this.ariaLabel, this.placeholder, this.rows = csMentionDefaultRows, this.portal = true, this.placement, this.language});
  final String? ariaLabel;
  final String? placeholder;
  final String? language;
  final String? text;
  final String defaultValue;
  final List<String> users;
  final int rows;
  final bool portal;
  final String? placement;
  final ValueChanged<String> onChange;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  State<CsMentions> createState() => _CsMentionsState();
}

class _CsMentionsState extends State<CsMentions> {
  late var innerText = widget.defaultValue;
  var dismissed = false;
  var active = 0;
  FocusNode? fieldNode;
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
      placement: csMentionPlacement(widget.placement),
    );
    if (next == null || (place?.x == next.x && place?.y == next.y && place?.placement == next.placement)) return;
    setState(() => place = next);
  }

  bool relatedInsideList() {
    final focusObject = FocusManager.instance.primaryFocus?.context?.findRenderObject();
    final listObject = listKey.currentContext?.findRenderObject();
    if (focusObject == null || listObject == null) return false;
    RenderObject? current = focusObject;
    while (current != null) {
      if (identical(current, listObject)) return true;
      current = current.parent;
    }
    return false;
  }

  void onFieldBlur() {
    final node = fieldNode;
    if (node == null || node.hasFocus || !mounted) return;
    if (csMentionClearOnBlur(relatedInsideList())) setState(() => dismissed = true);
  }

  @override
  void dispose() {
    fieldNode?.removeListener(onFieldBlur);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final hint = csMentionPlaceholderText(widget.placeholder, csMentionCopy('placeholder', locale));
    final spoken = csMentionName(widget.ariaLabel, hint);
    final currentText = csMentionResolvedValue(widget.text, innerText);
    final hits = dismissed ? <String>[] : csMentionHits(widget.users, csMentionQuery(currentText, currentText.length));
    final current = csMentionActive(active, hits.length);
    final lineCount = csMentionResolvedRows(widget.rows);
    final maxW = csControlsBatchStyleMentionsMaxWidth();
    final popupInlineStart = csControlsBatchStyleMentionsPopupInlineStart();
    final popupBlockOffset = csControlsBatchStyleMentionsPopupBlockOffset();
    return TapRegion(
      onTapOutside: hits.isNotEmpty && csMentionDismissOutside(true, false) ? (_) { setState(() => dismissed = true); } : null,
      child: Focus(
        onKeyEvent: (node, event) {
          if (event is! KeyDownEvent || !csMentionAcceptsKey(false, 0)) return KeyEventResult.ignored;
          if (event.logicalKey == LogicalKeyboardKey.escape) {
            setState(() => dismissed = true);
            return KeyEventResult.handled;
          }
          if (hits.isEmpty) return KeyEventResult.ignored;
          if (event.logicalKey == LogicalKeyboardKey.arrowDown) {
            setState(() => active = csMentionNextIndex(current, hits.length, down: true));
            return KeyEventResult.handled;
          }
          if (event.logicalKey == LogicalKeyboardKey.arrowUp) {
            setState(() => active = csMentionNextIndex(current, hits.length, down: false));
            return KeyEventResult.handled;
          }
          if (event.logicalKey == LogicalKeyboardKey.enter && current >= 0 && current < hits.length) {
            final picked = csMentionPick(currentText, currentText.length, hits[current]);
            setState(() {
              if (widget.text == null) innerText = picked;
              dismissed = true;
            });
            widget.onChange(picked);
            return KeyEventResult.handled;
          }
          return KeyEventResult.ignored;
        },
        child: ConstrainedBox(constraints: BoxConstraints(maxWidth: maxW), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          CsOwnFocus(builder: (node, claim) {
            if (fieldNode != node) {
              fieldNode?.removeListener(onFieldBlur);
              fieldNode = node;
              node.addListener(onFieldBlur);
            }
            return Semantics(textField: true, label: spoken, child: TextField(key: fieldKey, focusNode: node, controller: TextEditingController(text: currentText), minLines: lineCount, maxLines: lineCount, decoration: InputDecoration(hintText: hint.isEmpty ? null : hint), onChanged: (next) { claim(); setState(() { if (widget.text == null) innerText = next; dismissed = false; active = 0; }); widget.onChange(next); }));
          }),
          if (hits.isNotEmpty) Transform.translate(offset: Offset(place?.x ?? popupInlineStart, place?.y ?? popupBlockOffset), child: Column(key: listKey, crossAxisAlignment: CrossAxisAlignment.start, children: [
            for (var index = 0; index < hits.length; index++) CsOwnFocus(builder: (node, claim) => Semantics(identifier: csMentionOptionId('mentions', index), selected: index == current, child: TextButton(focusNode: node, onPressed: () { claim(); final picked = csMentionPick(currentText, currentText.length, hits[index]); setState(() { if (widget.text == null) innerText = picked; dismissed = true; }); widget.onChange(picked); }, child: Text(csMentionOption(hits[index]))))),
          ])),
        ])),
      ),
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
double csSortListGap() => 6;
double csSortMaxWidth() => 380;
double csSortItemGap() => 10;
double csSortItemPaddingY() => 10;
double csSortItemPaddingX() => 12;
double csSortItemOpacity(bool dragging) => dragging ? 0.5 : 1;
double csSortItemBorderWidth(bool over) => over ? 2 : 1;
CSColorValue csSortItemBorderColor(bool over, CSColorValue accent, CSColorValue border) => over ? accent : border;
double csSortOpsGap() => 4;
double csSortButtonOpacity(bool enabled) => enabled ? 1 : 0.4;
int? csSortRowAt(double originY, double rowHeight, int count, double pointY) {
  if (count <= 0 || rowHeight <= 0) return null;
  final index = ((pointY - originY) / rowHeight).floor();
  if (index < 0 || index >= count) return null;
  return index;
}
List<String>? csSortDrop(List<String> items, int? from, int? to) {
  if (from == null || to == null) return null;
  final next = csReorder(items, from, to);
  if (next.length == items.length) {
    for (var i = 0; i < next.length; i++) {
      if (next[i] != items[i]) return next;
    }
    return null;
  }
  return next;
}
String? csSortFallbackButtonAfterMove(int to, int count) {
  if (to == 0) return 'down';
  if (count > 0 && to == count - 1) return 'up';
  return null;
}

class CsSortable extends StatefulWidget {
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
  State<CsSortable> createState() => _CsSortableState();
}

class _CsSortableState extends State<CsSortable> {
  final listKey = GlobalKey();
  int? dragFrom;
  double originY = 0;
  double rowHeight = 0;
  double pointY = 0;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final up = csSortLabel(widget.upLabel, csSortCopy('moveUp', locale));
    final down = csSortLabel(widget.downLabel, csSortCopy('moveDown', locale));
    final overIndex = dragFrom == null ? null : csSortRowAt(originY, rowHeight, widget.items.length, pointY);
    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: csSortMaxWidth()),
      child: Column(key: listKey, children: [
        for (var index = 0; index < widget.items.length; index++) ...[
          if (index > 0) SizedBox(height: csSortListGap()),
          Builder(builder: (rowContext) => Opacity(
            opacity: csSortItemOpacity(dragFrom == index),
            child: Container(
            padding: EdgeInsets.symmetric(horizontal: csSortItemPaddingX(), vertical: csSortItemPaddingY()),
            decoration: BoxDecoration(
              color: csColor(pack.colorSurfacePanel),
              border: Border.all(
                color: csColor(csSortItemBorderColor(overIndex == index, pack.accent, pack.colorBorderDefault)),
                width: csSortItemBorderWidth(overIndex == index),
              ),
              borderRadius: BorderRadius.circular(csPoints(pack.radiusMd)),
            ),
            child: Row(crossAxisAlignment: CrossAxisAlignment.center, children: [
          GestureDetector(
            onVerticalDragStart: (_) {
              final box = listKey.currentContext?.findRenderObject() as RenderBox?;
              final row = rowContext.findRenderObject() as RenderBox?;
              setState(() => dragFrom = index);
              originY = box?.localToGlobal(Offset.zero).dy ?? 0;
              rowHeight = row?.size.height ?? 0;
            },
            onVerticalDragUpdate: (details) { setState(() => pointY = details.globalPosition.dy); },
            onVerticalDragEnd: (_) {
              final to = csSortRowAt(originY, rowHeight, widget.items.length, pointY);
              final next = csSortDrop(widget.items, dragFrom, to);
              if (next != null) widget.onChange(next);
              setState(() => dragFrom = null);
            },
            child: ExcludeSemantics(child: Text(csSortGripGlyph, style: TextStyle(color: csColor(pack.colorTextMuted)))),
          ),
          SizedBox(width: csSortItemGap()),
          Expanded(child: Text(widget.items[index], style: TextStyle(color: csColor(pack.colorTextPrimary), fontSize: csPoints(pack.fontSizeSm)))),
          SizedBox(width: csSortItemGap()),
          Row(mainAxisSize: MainAxisSize.min, children: [
            Opacity(opacity: csSortButtonOpacity(csSortCanMoveUp(index)), child: Semantics(button: true, label: up, enabled: csSortCanMoveUp(index), child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: csSortCanMoveUp(index) ? () { claim(); widget.onChange(csReorder(widget.items, index, index - 1)); } : null, child: const ExcludeSemantics(child: Text(csSortUpGlyph)))))),
            SizedBox(width: csSortOpsGap()),
            Opacity(opacity: csSortButtonOpacity(csSortCanMoveDown(index, widget.items.length)), child: Semantics(button: true, label: down, enabled: csSortCanMoveDown(index, widget.items.length), child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: csSortCanMoveDown(index, widget.items.length) ? () { claim(); widget.onChange(csReorder(widget.items, index, index + 1)); } : null, child: const ExcludeSemantics(child: Text(csSortDownGlyph)))))),
          ]),
          ]),
          ))),
        ],
      ]),
    );
  }
}

class CsTour extends StatefulWidget {
  const CsTour({super.key, required this.steps, required this.index, required this.onIndex, required this.onOpenChange, required this.dark, required this.highContrast, required this.compact, this.bodies = const [], this.targets = const [], this.backLabel, this.nextLabel, this.doneLabel, this.skipLabel, this.language, this.open = true, this.onClose});
  final List<String> steps;
  final List<String?> bodies;
  final List<CsTourTarget?> targets;
  final int index;
  final String? backLabel;
  final String? nextLabel;
  final String? doneLabel;
  final String? skipLabel;
  final String? language;
  final bool open;
  final ValueChanged<int> onIndex;
  final ValueChanged<bool> onOpenChange;
  final VoidCallback? onClose;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  State<CsTour> createState() => _CsTourState();
}

class _CsTourState extends State<CsTour> {
  var trap = 0;
  @override
  void initState() {
    super.initState();
    if (widget.open) widget.onIndex(csTourResetIndexOnOpen(true, widget.index));
  }

  @override
  void didUpdateWidget(CsTour oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.open && !oldWidget.open) widget.onIndex(csTourResetIndexOnOpen(true, widget.index));
  }

  void _close() {
    csTourNotifyClose(widget.onOpenChange, widget.onClose);
  }

  @override
  Widget build(BuildContext context) {
    if (!csTourShows(widget.open, widget.steps.length)) return const SizedBox.shrink();
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final skip = csTourLabel(widget.skipLabel, csTourCopy('skip', locale));
    final back = csTourLabel(widget.backLabel, csTourCopy('back', locale));
    final next = csTourLabel(widget.nextLabel, csTourCopy('next', locale));
    final done = csTourLabel(widget.doneLabel, csTourCopy('done', locale));
    final active = csTourClamp(widget.index, widget.steps.length);
    final target = active < widget.targets.length ? widget.targets[active] : null;
    final hole = csTourHole(target);
    final view = View.of(context);
    final pop = csTourPop(hole, view.physicalSize.width / view.devicePixelRatio, view.physicalSize.height / view.devicePixelRatio);
    final body = active < widget.bodies.length ? widget.bodies[active] : null;
    final last = csTourLast(active, widget.steps.length);
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final holeDepth = csControlsBatchStyleTourHoleDepth(pack);
    final popDepth = csControlsBatchStyleTourPopDepth(pack);
    final popWidth = csControlsBatchStyleTourPopWidth();
    return Semantics(
      namesRoute: true,
      label: widget.steps[active],
      child: Focus(
        onKeyEvent: (node, event) {
          if (event is! KeyDownEvent) return KeyEventResult.ignored;
          if (event.logicalKey == LogicalKeyboardKey.escape) {
            _close();
            return KeyEventResult.handled;
          }
          if (event.logicalKey != LogicalKeyboardKey.tab) return KeyEventResult.ignored;
          final stops = csTourStops(active > 0);
          final nextStop = csFocusNext(trap, stops, HardwareKeyboard.instance.isShiftPressed, true);
          if (nextStop == null) return KeyEventResult.ignored;
          setState(() => trap = nextStop);
          return KeyEventResult.handled;
        },
        child: Stack(children: [
          if (csTourClosesOnBackdrop()) Positioned.fill(child: GestureDetector(onTap: _close, child: const ColoredBox(color: Color(0x6B000000)))),
          if (hole != null && holeDepth > 0) Positioned(left: hole.x, top: hole.y, width: hole.w, height: hole.h, child: const IgnorePointer(child: DecoratedBox(decoration: BoxDecoration(border: Border.fromBorderSide(BorderSide(color: Color(0xFFF4BA17), width: 3)), borderRadius: BorderRadius.all(Radius.circular(8)))))),
          if (popDepth > 0) Transform.translate(offset: Offset(pop.left, pop.top), child: ConstrainedBox(constraints: BoxConstraints(maxWidth: popWidth), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(widget.steps[active]),
          if (csTourShowsBody(body)) Text(body ?? ''),
          Text(csTourCount(active, widget.steps.length)),
          CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); _close(); }, child: Text(skip))),
          if (active > 0) CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); widget.onIndex(active - 1); }, child: Text(back))),
          CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); last ? _close() : widget.onIndex(active + 1); }, child: Text(csTourPrimaryActionLabel(last, next, done)))),
          ]))),
        ]),
      ),
    );
  }
}

const csTableDefaultRowKey = 'id';
const csTableDefaultState = 'idle';
bool csTableIsBusy(String state) => state == 'loading';
String csTableWrapClass(String state) => state == 'error' ? 'cs-table-wrap cs-table-wrap--status' : 'cs-table-wrap';
String? csTableRole(String state) => state == 'error' ? 'alert' : null;
bool csTableShowsCustomLoading(String? loadingState) => loadingState != null;
bool csTableShowsCustomError(String? errorState) => errorState != null;
int csTableColumnCount(List<String> columns) => columns.isEmpty ? 1 : columns.length;
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
bool csTableAlert(String state) => state == 'error';

class CsDataTable extends StatelessWidget {
  const CsDataTable({super.key, required this.rows, this.state = csTableDefaultState, required this.dark, required this.highContrast, required this.compact, this.columns = const [], this.rowKey = csTableDefaultRowKey, this.caption, this.emptyLabel, this.errorLabel, this.loadingLabel, this.loadingRows = 5, this.language});
  final String? caption;
  final List<String> columns;
  final List<String> rows;
  final String rowKey;
  final String state;
  final String? emptyLabel;
  final String? errorLabel;
  final String? loadingLabel;
  final double loadingRows;
  final String? language;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final count = csRenderCount(loadingRows, 5, minimum: 1);
    final empty = csTableText(emptyLabel, csTableCopy('empty', locale));
    final captionMargin = csTableStyleCaptionMarginBottom();
    final statusPadY = csTableStyleStatusPaddingY(pack);
    final cellPadX = csTableStyleCellPaddingX();
    final cellPadY = csTableStyleCellPaddingY();
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (csTableShowsCaption(caption)) Padding(padding: EdgeInsets.only(bottom: captionMargin), child: Text(caption!)),
      if (csTableIsBusy(state))
        Padding(padding: EdgeInsets.symmetric(vertical: statusPadY), child: Semantics(label: csTableCopy('loading', locale), value: 'true', child: csTableShowsCustomLoading(loadingLabel) ? Text(loadingLabel!) : ExcludeSemantics(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          if (columns.isNotEmpty) Padding(padding: EdgeInsets.symmetric(horizontal: cellPadX, vertical: cellPadY), child: Text(columns.join(' '))),
          for (var index = 0; index < count; index++) const Text(' '),
        ]))))
      else if (state == 'error')
        Padding(padding: EdgeInsets.symmetric(vertical: statusPadY), child: csTableAlert(state) ? Semantics(liveRegion: true, container: true, child: csTableShowsCustomError(errorLabel) ? Text(errorLabel!) : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(csTableCopy('error', locale)), Text(csTableCopy('errorHint', locale))])) : (csTableShowsCustomError(errorLabel) ? Text(errorLabel!) : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(csTableCopy('error', locale)), Text(csTableCopy('errorHint', locale))])))
      else ...[
        if (columns.isNotEmpty) Padding(padding: EdgeInsets.symmetric(horizontal: cellPadX, vertical: cellPadY), child: Text(columns.join(' '))),
        if (rows.isEmpty)
          Padding(padding: EdgeInsets.symmetric(vertical: statusPadY), child: Text(empty))
        else
          for (final row in rows) Padding(padding: EdgeInsets.symmetric(horizontal: cellPadX, vertical: cellPadY), child: Text(row)),
      ],
    ]);
  }
}

String csPopconfirmPlacement(String? explicit) => explicit ?? 'bottom-start';
String csPopconfirmTriggerText(String? trigger, String title) => trigger ?? title;
const csPopconfirmPanelRole = 'alertdialog';
const csPopconfirmTriggerHasPopup = 'dialog';
const csPopconfirmCancelButtonVariant = 'ghost';
const csPopconfirmOkButtonVariant = 'primary';
const csPopconfirmButtonSize = 'xs';
String csPopconfirmTitleId(String baseId) => '$baseId-title';
bool csPopconfirmEscapeClose() => false;
const csPopconfirmGap = 8.0;
class CsPopconfirmPlace {
  const CsPopconfirmPlace(this.x, this.y, this.maxWidth, this.maxHeight, this.placement);
  final double x;
  final double y;
  final double maxWidth;
  final double maxHeight;
  final String placement;
}
CsPopconfirmPlace? csPopconfirmShift(CsFloatingRect anchor, double naturalWidth, double naturalHeight, double fittedWidth, double fittedHeight, CsFloatingRect viewport, double originX, double originY, double scaleX, double scaleY, String placement) {
  final initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement: placement, gap: csPopconfirmGap);
  if (initial == null) return null;
  final placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, placement: initial.placement, gap: csPopconfirmGap);
  if (placed == null) return null;
  final sx = scaleX == 0 ? 1.0 : scaleX;
  final sy = scaleY == 0 ? 1.0 : scaleY;
  return CsPopconfirmPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement);
}

class CsPopconfirm extends StatefulWidget {
  const CsPopconfirm({super.key, required this.title, this.trigger, this.portal = true, this.placement, this.confirmLabel, this.cancelLabel, required this.open, required this.onOpenChange, required this.onConfirm, this.onCancel, required this.dark, required this.highContrast, required this.compact, this.language});
  final String title;
  final String? trigger;
  final bool portal;
  final String? placement;
  final String? confirmLabel;
  final String? cancelLabel;
  final String? language;
  final bool open;
  final ValueChanged<bool> onOpenChange;
  final VoidCallback onConfirm;
  final VoidCallback? onCancel;
  final bool dark;
  final bool highContrast;
  final bool compact;
  @override
  State<CsPopconfirm> createState() => _CsPopconfirmState();
}

class _CsPopconfirmState extends State<CsPopconfirm> {
  final fieldKey = GlobalKey();
  final listKey = GlobalKey();
  Size? natural;
  Size? fitted;
  CsPopconfirmPlace? place;

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
    final next = csPopconfirmShift(
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
      csPopconfirmPlacement(widget.placement),
    );
    setState(() { fitted = listBox.size; place = next; });
  }

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final triggerFace = csPopconfirmTriggerText(widget.trigger, widget.title);
    final minW = csControlsWaveStylePopconfirmMinWidth();
    final padY = csControlsWaveStylePopconfirmPaddingY();
    final padX = csControlsWaveStylePopconfirmPaddingX();
    final titleMargin = csControlsWaveStylePopconfirmTitleMarginBottom();
    final actionsGap = csControlsWaveStylePopconfirmActionsGap();
    if (!widget.open) { natural = null; fitted = null; }
    if (widget.open) WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && widget.open) measure(); });
    return TapRegion(
      onTapOutside: widget.open ? (_) => widget.onOpenChange(false) : null,
      child: Focus(
        onKeyEvent: (node, event) {
          if (event is! KeyDownEvent || event.logicalKey != LogicalKeyboardKey.escape || !widget.open) return KeyEventResult.ignored;
          widget.onOpenChange(csPopconfirmEscapeClose());
          return KeyEventResult.handled;
        },
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          CsOwnFocus(builder: (node, claim) => Semantics(button: true, toggled: widget.open, child: TextButton(key: fieldKey, focusNode: node, onPressed: () { claim(); widget.onOpenChange(!widget.open); }, child: Text(triggerFace)))),
          if (widget.open) Opacity(opacity: place == null ? 0 : 1, child: Transform.translate(key: listKey, offset: Offset(place?.x ?? 0, place?.y ?? csControlsWaveStylePopconfirmOffset()), child: ConstrainedBox(constraints: BoxConstraints(minWidth: minW), child: Padding(padding: EdgeInsets.symmetric(horizontal: padX, vertical: padY), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Padding(padding: EdgeInsets.only(bottom: titleMargin), child: Text(widget.title)),
            CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); widget.onOpenChange(false); widget.onCancel?.call(); }, child: Text(csPopconfirmOkText(widget.cancelLabel, csPopconfirmCopy('cancel', locale))))),
            SizedBox(height: actionsGap),
            CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); widget.onOpenChange(false); widget.onConfirm(); }, child: Text(csPopconfirmOkText(widget.confirmLabel, csPopconfirmCopy('ok', locale))))),
          ]))))),
        ]),
      ),
    );
  }
}

const csToggleLabel = 'Toggle';
double csToggleIconGap() => 6;
bool csToggleValue(bool? pressed, bool inner) => pressed ?? inner;
bool csToggleShowsIcon(String? icon) => icon != null && icon.isNotEmpty;
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
class CsToggle extends StatefulWidget {
  const CsToggle({super.key, this.label = '', this.icon, this.pressed, this.defaultPressed = false, this.onChange, required this.dark, required this.highContrast, required this.compact, this.disabled = false, this.ariaLabel, this.language});
  final String label;
  final String? icon;
  final bool disabled;
  final String? ariaLabel;
  final String? language;
  final bool? pressed;
  final bool defaultPressed;
  final ValueChanged<bool>? onChange;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsToggle> createState() => _CsToggleState();
}

class _CsToggleState extends State<CsToggle> {
  late var innerPressed = widget.defaultPressed;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final isPressed = csToggleValue(widget.pressed, innerPressed);
    final spoken = csToggleCopy('label', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)));
    final hasIcon = csToggleShowsIcon(widget.icon);
    final content = csToggleHasContent(widget.label, hasNode: hasIcon);
    final name = csToggleName(widget.ariaLabel, content, spoken);
    final next = csToggleFlip(isPressed, widget.disabled, false);
    final padY = csControlsWaveStyleTogglePaddingY();
    final padX = csControlsWaveStyleTogglePaddingX();
    final minH = csControlsWaveStyleToggleMinHeight();
    final disabledAlpha = csControlsWaveStyleToggleDisabledOpacity;
    return CsOwnFocus(builder: (node, claim) => Semantics(
      label: name ?? widget.label,
      selected: isPressed,
      child: Opacity(
        opacity: widget.disabled ? disabledAlpha : 1.0,
        child: ConstrainedBox(
          constraints: BoxConstraints(minHeight: minH),
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: padX, vertical: padY),
            child: TextButton(
              focusNode: node,
              onPressed: next == null ? null : () { claim(); if (widget.pressed == null) setState(() => innerPressed = next); widget.onChange?.call(next); },
              child: content ? ExcludeSemantics(child: Row(mainAxisSize: MainAxisSize.min, children: [
                if (hasIcon && widget.icon != null) Text(widget.icon!, style: TextStyle(color: csColor(isPressed ? pack.colorBrandOchre : pack.colorTextPrimary))),
                if (hasIcon && widget.label.trim().isNotEmpty) SizedBox(width: csToggleIconGap()),
                if (widget.label.trim().isNotEmpty) Text(widget.label, style: TextStyle(color: csColor(isPressed ? pack.colorBrandOchre : pack.colorTextPrimary))),
              ])) : const SizedBox.shrink(),
            ),
          ),
        ),
      ),
    ));
  }
}
