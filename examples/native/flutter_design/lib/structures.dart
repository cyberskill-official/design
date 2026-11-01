import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'catalog.dart';
import 'controls.dart';
import 'overlays.dart';
import 'primitives.dart';
import 'icon_paths.dart';

class CsCommandGroup {
  const CsCommandGroup(this.title, this.items);
  final String title;
  final List<String> items;
}

List<CsCommandGroup> csCommandFilter(List<CsCommandGroup> groups, String query) {
  final needle = query.trim().toLowerCase();
  return [
    for (final group in groups)
      CsCommandGroup(group.title, group.items.where((item) => needle.isEmpty || item.toLowerCase().contains(needle)).toList()),
  ];
}
const csCommandPlaceholder = 'Type a command or search…';
String csCommandCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'placeholder': 'Nhập lệnh hoặc tìm kiếm…', 'empty': 'Không có kết quả', 'oneResult': '{count} kết quả', 'results': '{count} kết quả', 'aria': 'Bảng lệnh', 'esc': 'Esc'};
  const en = {'placeholder': csCommandPlaceholder, 'empty': 'No results', 'oneResult': '{count} result', 'results': '{count} results', 'aria': 'Command palette', 'esc': 'Esc'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csCommandPlaceholderText(String? text, String fallback) => text ?? fallback;
String csCommandFormat(int count, String? language) {
  final primary = csSelectPrimaryLanguage(language) ?? 'vi';
  final separator = primary == 'vi' ? '.' : ',';
  final raw = count.abs().toString();
  final buffer = StringBuffer();
  for (var i = 0; i < raw.length; i++) {
    if (i > 0 && (raw.length - i) % 3 == 0) buffer.write(separator);
    buffer.write(raw[i]);
  }
  return buffer.toString();
}
bool csCommandClosesOnBackdrop() => true;
int csCommandStops(int resultCount) => 1 + (resultCount < 0 ? 0 : resultCount);
const csCommandScrimRed = 31;
const csCommandScrimGreen = 19;
const csCommandScrimBlue = 11;
const csCommandScrimAlpha = 0.42;
const csCommandTopOffsetRatio = 0.12;
const csCommandViewportWidthRatio = 0.92;
double csCommandMaxWidth() => 560;
double csCommandBorderWidth() => 1;
double csCommandSearchGap() => 10;
double csCommandSearchPaddingY() => 14;
double csCommandSearchPaddingX() => 18;
double csCommandSearchIconSize() => 18;
double csCommandSearchOutlineWidth() => 2;
double csCommandSearchOutlineOffset() => -2;
bool csCommandShowsSearchOutline(bool focused) => focused;
double csCommandListMaxHeight() => 340;
double csCommandListPadding() => 8;
double csCommandListGap() => 2;
double csCommandStatusPaddingY() => 8;
double csCommandStatusPaddingX() => 10;
double csCommandLabelPaddingTop() => 8;
double csCommandLabelPaddingX() => 10;
double csCommandLabelPaddingBottom() => 2;
double csCommandLabelTracking() => 0.08;
bool csCommandShowsGroupLabel(String? title) => title != null && title.isNotEmpty;
String csCommandGroupLabelText(String title) => title.toUpperCase();
double csCommandItemGap() => 11;
double csCommandItemPaddingY() => 10;
double csCommandItemPaddingX() => 12;
bool csCommandItemShowsRaisedFill({required bool hovered, required bool selected}) => hovered || selected;
String csCommandStatus(int count, String? language) {
  if (count == 0) return csCommandCopy('empty', language);
  final template = csCommandCopy(count == 1 ? 'oneResult' : 'results', language);
  return template.replaceAll('{count}', csCommandFormat(count, language));
}

List<String> csTransferToggle(List<String> checked, String key) =>
    checked.contains(key) ? checked.where((item) => item != key).toList() : [...checked, key];

String csTransferCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'source': 'Có sẵn', 'target': 'Đã chọn', 'toTarget': 'Chuyển sang đã chọn', 'toSource': 'Chuyển về có sẵn'};
  const en = {'source': 'Available', 'target': 'Selected', 'toTarget': 'Move to selected', 'toSource': 'Move to available'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csTransferTitle(String? text, String fallback) => text ?? fallback;
(List<String>, List<String>) csTransferMove(List<String> value, List<String> checked, List<String> items, bool toTarget) {
  final moving = checked.where((key) => items.contains(key) && value.contains(key) != toTarget).toList();
  if (moving.isEmpty) return (value, checked);
  final next = toTarget ? [...value, ...moving] : value.where((key) => !moving.contains(key)).toList();
  return (next, <String>[]);
}

const csOneTimeLabel = 'One-time code';
String csOneTimeCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Mã dùng một lần'};
  const en = {'label': csOneTimeLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csOneTimeLabelText(String? label, String fallback) => label ?? fallback;
String csOneTimeDigits(String raw, {double requested = 6}) {
  final length = csRenderCount(requested, 6);
  final numbers = raw.replaceAll(RegExp(r'\D'), '');
  return numbers.substring(0, numbers.length < length ? numbers.length : length);
}
String csOneTimeText(String? controlled, String inner, {double requested = 6}) => csOneTimeDigits(controlled ?? inner, requested: requested);
String? csOneTimeCommit(String raw, {double requested = 6, required bool disabled}) => disabled ? null : csOneTimeDigits(raw, requested: requested);
String csOneTimeBox(String value, int index) => index >= 0 && index < value.length ? value[index] : '';
String? csOneTimeReplace(String value, int index, String next, {double requested = 6}) {
  final current = csOneTimeDigits(value, requested: requested);
  if (next.isEmpty) return current.substring(0, index < 0 ? 0 : (index > current.length ? current.length : index)) + (index < 0 ? current : current.substring(index + 1 > current.length ? current.length : index + 1));
  final typed = next.replaceAll(RegExp(r'\D'), '');
  if (typed.isEmpty) return null;
  final head = current.substring(0, index < 0 ? 0 : (index > current.length ? current.length : index));
  final tail = index < 0 ? current : current.substring(index + 1 > current.length ? current.length : index + 1);
  return csOneTimeDigits(head + typed + tail, requested: requested);
}
String csOneTimeBackspace(String value, int index, {double requested = 6}) {
  final chars = csOneTimeDigits(value, requested: requested).split('');
  if (index >= 0 && index < chars.length) {
    chars.removeAt(index);
  } else if (index > 0 && index - 1 < chars.length) {
    chars.removeAt(index - 1);
  }
  return chars.join();
}
String? csOneTimePaste(String text, {double requested = 6, required bool disabled}) => disabled ? null : csOneTimeDigits(text, requested: requested);
String csOneTimeDigitName(String label, int index, int length) => '$label ${index + 1}/$length';

int csCarouselClamp(int index, int count) => count <= 0 ? 0 : (index < 0 ? 0 : (index > count - 1 ? count - 1 : index));

const csCarouselSlide = 'Slide';
const csCarouselPrevious = 'Previous slide';
const csCarouselNext = 'Next slide';
String csCarouselCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'prev': 'Ảnh trước', 'next': 'Ảnh sau', 'slide': 'Ảnh'};
  const en = {'prev': csCarouselPrevious, 'next': csCarouselNext, 'slide': csCarouselSlide};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csCarouselSlideLabel(int index, int count, String word) => '$word ${index + 1}/$count';
String csCarouselStatus(int index, int count, String word) => count > 0 ? csCarouselSlideLabel(index, count, word) : '';
int csCarouselGo(int index, int delta, int count) => count <= 0 ? 0 : csNonnegative(index + delta, count);

class CsTreeNode {
  const CsTreeNode(this.key, this.label, {this.children = const []});
  final String key;
  final String label;
  final List<CsTreeNode> children;
}

List<CsTreeNode> csTreeVisible(List<CsTreeNode> nodes, Map<String, bool> open) {
  final out = <CsTreeNode>[];
  void walk(List<CsTreeNode> list) {
    for (final node in list) {
      out.add(node);
      if (node.children.isNotEmpty && open[node.key] == true) walk(node.children);
    }
  }
  walk(nodes);
  return out;
}

const csFileTitleDefault = 'Drop files here or browse';
const csFileHintDefault = 'PNG, JPG, or PDF up to 10MB';
const csFileIcon = 'M12 16V4M7 9l5-5 5 5M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3';
String csFileTitle(String? title, String fallback) => title ?? fallback;
String csFileHint(String? hint, String fallback) => hint ?? fallback;
String csFileCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'title': 'Kéo tệp vào đây hoặc chọn', 'hint': 'PNG, JPG hoặc PDF, tối đa 10MB'};
  const en = {'title': csFileTitleDefault, 'hint': csFileHintDefault};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool csFileDragging(String phase) => phase == 'over';
List<String>? csFileNotify(List<String> files, {bool multiple = false}) {
  final picked = csFileNames(files, multiple: multiple);
  return picked.isEmpty ? null : picked;
}
List<String> csFileNames(List<String> files, {bool multiple = false}) {
  if (files.isEmpty) return const [];
  return multiple ? files : [files.first];
}

class CsCommandPalette extends StatefulWidget {
  const CsCommandPalette({super.key, required this.groups, required this.query, required this.onQuery, required this.onSelect, required this.onClose, required this.dark, required this.highContrast, required this.compact, this.placeholder, this.language});
  final String? placeholder;
  final String? language;
  final List<CsCommandGroup> groups;
  final String query;
  final ValueChanged<String> onQuery;
  final ValueChanged<String> onSelect;
  final VoidCallback onClose;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsCommandPalette> createState() => _CsCommandPaletteState();
}

class _CsCommandPaletteState extends State<CsCommandPalette> {
  var trap = 0;
  var searchFocused = false;
  String? hoveredItem;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final locale = csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context));
    final hint = csCommandPlaceholderText(widget.placeholder, csCommandCopy('placeholder', locale));
    final filtered = csCommandFilter(widget.groups, widget.query);
    final resultCount = filtered.fold<int>(0, (count, group) => count + group.items.length);
    final stops = csCommandStops(resultCount);
    final scrimColor = Color.fromARGB(255, csCommandScrimRed, csCommandScrimGreen, csCommandScrimBlue).withOpacity(csCommandScrimAlpha);
    return Semantics(
      namesRoute: true,
      label: csCommandCopy('aria', locale),
      child: Focus(
        onKeyEvent: (node, event) {
          if (event is! KeyDownEvent) return KeyEventResult.ignored;
          if (event.logicalKey == LogicalKeyboardKey.escape) {
            widget.onQuery('');
            widget.onClose();
            return KeyEventResult.handled;
          }
          if (event.logicalKey != LogicalKeyboardKey.tab) return KeyEventResult.ignored;
          final next = csFocusNext(trap, stops, HardwareKeyboard.instance.isShiftPressed, true);
          if (next == null) return KeyEventResult.ignored;
          setState(() => trap = next);
          return KeyEventResult.handled;
        },
        child: Stack(
          alignment: Alignment.topCenter,
          children: [
            if (csCommandClosesOnBackdrop())
              Positioned.fill(
                child: GestureDetector(
                  onTap: () {
                    widget.onQuery('');
                    widget.onClose();
                  },
                  child: ColoredBox(color: scrimColor),
                ),
              ),
            ConstrainedBox(
              constraints: BoxConstraints(maxWidth: csCommandMaxWidth()),
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: csColor(pack.colorSurfacePanel),
                  border: Border.all(color: csColor(pack.colorBorderDefault), width: csCommandBorderWidth()),
                  borderRadius: BorderRadius.circular(csPoints(pack.radiusLg)),
                  boxShadow: const [BoxShadow(color: Color(0x3D000000), blurRadius: 24, offset: Offset(0, 12))],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(csPoints(pack.radiusLg)),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      DecoratedBox(
                        decoration: BoxDecoration(
                          boxShadow: [
                            if (csInteractionCmdkSearchOuterHaloWidth(searchFocused) > 0)
                              BoxShadow(
                                color: csColor(pack.colorAccentOchre),
                                spreadRadius: csInteractionCmdkSearchOuterHaloWidth(searchFocused),
                              ),
                          ],
                          border: Border(
                            bottom: BorderSide(color: csColor(pack.colorBorderDefault), width: csCommandBorderWidth()),
                            top: csCommandShowsSearchOutline(searchFocused) ? BorderSide(color: csColor(pack.colorTextPrimary), width: csCommandSearchOutlineWidth()) : BorderSide.none,
                            left: csCommandShowsSearchOutline(searchFocused) ? BorderSide(color: csColor(pack.colorTextPrimary), width: csCommandSearchOutlineWidth()) : BorderSide.none,
                            right: csCommandShowsSearchOutline(searchFocused) ? BorderSide(color: csColor(pack.colorTextPrimary), width: csCommandSearchOutlineWidth()) : BorderSide.none,
                          ),
                        ),
                        child: Padding(
                          padding: EdgeInsets.symmetric(horizontal: csCommandSearchPaddingX(), vertical: csCommandSearchPaddingY()),
                          child: Row(
                            children: [
                              SizedBox(
                                width: csCommandSearchIconSize(),
                                height: csCommandSearchIconSize(),
                                child: CsIcon(name: 'search', label: '', dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact),
                              ),
                              SizedBox(width: csCommandSearchGap()),
                              Expanded(
                                child: CsOwnFocus(
                                  builder: (node, claim) => Focus(
                                    onFocusChange: (focused) => setState(() => searchFocused = focused),
                                    child: TextField(
                                      focusNode: node,
                                      controller: TextEditingController(text: widget.query),
                                      style: TextStyle(color: csColor(pack.colorTextPrimary), fontSize: csPoints(pack.fontSizeMd)),
                                      onChanged: (next) {
                                        claim();
                                        widget.onQuery(next);
                                      },
                                      decoration: InputDecoration(
                                        hintText: hint.isEmpty ? null : hint,
                                        border: InputBorder.none,
                                        isDense: true,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              SizedBox(width: csCommandSearchGap()),
                              CsKbd(csCommandCopy('esc', locale), dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact),
                            ],
                          ),
                        ),
                      ),
                      ConstrainedBox(
                        constraints: BoxConstraints(maxHeight: csCommandListMaxHeight()),
                        child: SingleChildScrollView(
                          padding: EdgeInsets.all(csCommandListPadding()),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Padding(
                                padding: EdgeInsets.symmetric(horizontal: csCommandStatusPaddingX(), vertical: csCommandStatusPaddingY()),
                                child: Semantics(
                                  liveRegion: true,
                                  child: Text(
                                    csCommandStatus(resultCount, locale),
                                    style: TextStyle(color: csColor(pack.colorTextPrimary), fontSize: csPoints(pack.fontSizeSm)),
                                  ),
                                ),
                              ),
                              for (var gi = 0; gi < filtered.length; gi++)
                                if (filtered[gi].items.isNotEmpty) ...[
                                  if (csCommandShowsGroupLabel(filtered[gi].title))
                                    Padding(
                                      padding: EdgeInsets.only(
                                        left: csCommandLabelPaddingX(),
                                        right: csCommandLabelPaddingX(),
                                        top: csCommandLabelPaddingTop(),
                                        bottom: csCommandLabelPaddingBottom(),
                                      ),
                                      child: Text(
                                        csCommandGroupLabelText(filtered[gi].title),
                                        style: TextStyle(
                                          color: csColor(pack.colorTextMuted),
                                          fontSize: csPoints(pack.fontSizeXs),
                                          letterSpacing: csCommandLabelTracking() * csPoints(pack.fontSizeXs),
                                        ),
                                      ),
                                    ),
                                  for (var ii = 0; ii < filtered[gi].items.length; ii++)
                                    Padding(
                                      padding: EdgeInsets.only(top: csCommandListGap()),
                                      child: Builder(
                                        builder: (context) {
                                          final item = filtered[gi].items[ii];
                                          final itemKey = '$gi-$ii';
                                          var stopIndex = 1 + ii;
                                          for (var k = 0; k < gi; k++) {
                                            stopIndex += filtered[k].items.length;
                                          }
                                          final raised = csCommandItemShowsRaisedFill(hovered: hoveredItem == itemKey, selected: trap == stopIndex);
                                          return MouseRegion(
                                            onEnter: (_) => setState(() => hoveredItem = itemKey),
                                            onExit: (_) => setState(() {
                                              if (hoveredItem == itemKey) hoveredItem = null;
                                            }),
                                            child: DecoratedBox(
                                              decoration: BoxDecoration(
                                                color: raised ? csColor(pack.colorSurfaceRaised) : Colors.transparent,
                                                borderRadius: BorderRadius.circular(csPoints(pack.radiusMd)),
                                              ),
                                              child: CsOwnFocus(
                                                builder: (node, claim) => TextButton(
                                                  focusNode: node,
                                                  style: TextButton.styleFrom(
                                                    padding: EdgeInsets.symmetric(horizontal: csCommandItemPaddingX(), vertical: csCommandItemPaddingY()),
                                                    alignment: Alignment.centerLeft,
                                                  ),
                                                  onPressed: () {
                                                    claim();
                                                    widget.onSelect(item);
                                                    widget.onQuery('');
                                                    widget.onClose();
                                                  },
                                                  child: Row(
                                                    children: [
                                                      Text(
                                                        item,
                                                        style: TextStyle(
                                                          color: csColor(pack.colorTextPrimary),
                                                          fontSize: csPoints(pack.fontSizeSm),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                            ),
                                          );
                                        },
                                      ),
                                    ),
                                ],
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class CsTransfer extends StatelessWidget {
  const CsTransfer({super.key, required this.items, required this.value, required this.checked, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.sourceTitle, this.targetTitle, this.toTargetLabel, this.toSourceLabel, this.language});
  final List<(String, String)> items;
  final List<String> value;
  final List<String> checked;
  final String? sourceTitle;
  final String? targetTitle;
  final String? toTargetLabel;
  final String? toSourceLabel;
  final String? language;
  final void Function(List<String> value, List<String> checked) onChange;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final locale = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final source = csTransferTitle(sourceTitle, csTransferCopy('source', locale));
    final target = csTransferTitle(targetTitle, csTransferCopy('target', locale));
    final toward = csTransferTitle(toTargetLabel, csTransferCopy('toTarget', locale));
    final back = csTransferTitle(toSourceLabel, csTransferCopy('toSource', locale));
    final keys = items.map((item) => item.$1).toList();
    List<Widget> column(String title, bool side) => [
          Text(title),
          for (final item in items.where((item) => value.contains(item.$1) == side))
            CsCheckbox(
              label: item.$2,
              value: checked.contains(item.$1),
              onChanged: (next) {
                if (next == null || next == checked.contains(item.$1)) return;
                onChange(value, csTransferToggle(checked, item.$1));
              },
              dark: dark,
              highContrast: highContrast,
              compact: compact,
            ),
        ];
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(children: column(source, false)),
        Column(children: [
          Semantics(button: true, label: toward, child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); final next = csTransferMove(value, checked, keys, true); onChange(next.$1, next.$2); }, child: const ExcludeSemantics(child: Text('›'))))),
          Semantics(button: true, label: back, child: CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: () { claim(); final next = csTransferMove(value, checked, keys, false); onChange(next.$1, next.$2); }, child: const ExcludeSemantics(child: Text('‹'))))),
        ]),
        Column(children: column(target, true)),
      ],
    );
  }
}

class CsInputOTP extends StatelessWidget {
  const CsInputOTP({super.key, this.label, required this.value, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.length = 6, this.language});
  final String? label;
  final String? language;
  final String value;
  final ValueChanged<String> onChange;
  final double length;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final name = csOneTimeLabelText(label, csOneTimeCopy('label', csSelectResolvedLanguage(language, CsLanguageScope.of(context))));
    return CsOwnFocus(builder: (node, claim) => Semantics(label: name, textField: true, child: TextField(focusNode: node, controller: TextEditingController(text: csOneTimeDigits(value, requested: length)), decoration: InputDecoration(labelText: name.isEmpty ? null : name), style: TextStyle(color: csColor(pack.colorTextPrimary)), onChanged: (next) { claim(); final committed = csOneTimeCommit(next, requested: length, disabled: false); if (committed != null) onChange(committed); })));
  }
}

class CsCarousel extends StatelessWidget {
  const CsCarousel({super.key, required this.slides, required this.index, this.label, this.previousLabel, this.nextLabel, required this.onChange, required this.dark, required this.highContrast, required this.compact, this.language});
  final List<String> slides;
  final int index;
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
    final active = csCarouselClamp(index, slides.length);
    final spoken = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final previousName = previousLabel ?? csCarouselCopy('prev', spoken);
    final nextName = nextLabel ?? csCarouselCopy('next', spoken);
    return Column(children: [
      if (slides.isNotEmpty) Text(slides[active]),
      Row(children: [
        CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: slides.length < 2 ? null : () { claim(); onChange(csCarouselGo(active, -1, slides.length)); }, child: Text(previousName))),
        CsOwnFocus(builder: (node, claim) => TextButton(focusNode: node, onPressed: slides.length < 2 ? null : () { claim(); onChange(csCarouselGo(active, 1, slides.length)); }, child: Text(nextName))),
      ]),
    ]);
  }
}

class CsTree extends StatelessWidget {
  const CsTree({super.key, required this.label, required this.nodes, required this.open, required this.selected, required this.onSelect, required this.dark, required this.highContrast, required this.compact});
  final String label;
  final List<CsTreeNode> nodes;
  final Map<String, bool> open;
  final String? selected;
  final ValueChanged<String> onSelect;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(color: csColor(pack.colorTextMuted))),
        for (final node in csTreeVisible(nodes, open))
          CsOwnFocus(builder: (focusNode, claim) => TextButton(focusNode: focusNode, onPressed: () { claim(); onSelect(node.key); }, child: Text(node.label, style: TextStyle(color: csColor(selected == node.key ? pack.colorBrandOchre : pack.colorTextPrimary))))),
      ],
    );
  }
}

class CsFileUpload extends StatelessWidget {
  const CsFileUpload({super.key, this.title, this.hint, required this.onFiles, required this.dark, required this.highContrast, required this.compact, this.multiple = false, this.language});
  final String? title;
  final String? hint;
  final String? language;
  final ValueChanged<List<String>> onFiles;
  final bool multiple;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final spoken = csSelectResolvedLanguage(language, CsLanguageScope.of(context));
    final shownTitle = csFileTitle(title, csFileCopy('title', spoken));
    final shownHint = csFileHint(hint, csFileCopy('hint', spoken));
    return Semantics(label: shownTitle, hint: shownHint, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      ExcludeSemantics(child: Text(shownTitle, style: TextStyle(color: csColor(pack.colorTextPrimary)))),
      ExcludeSemantics(child: Text(shownHint, style: TextStyle(color: csColor(pack.colorTextMuted)))),
    ]));
  }
}

const csDrawerClose = 'Close';
const csDrawerPanel = 'Side panel';
const csDrawerWidth = 480.0;
const csDrawerScrimRed = 31;
const csDrawerScrimGreen = 19;
const csDrawerScrimBlue = 11;
const csDrawerScrimAlpha = 0.42;
const csDrawerShadowAlpha = 0.22;
double csDrawerBorderWidth() => 1;
double csDrawerShadowOffsetX(String? side) => csDrawerSide(side) == 'left' ? 18 : -18;
double csDrawerShadowBlur() => 48;
double csDrawerScrimDepth(double modalDepth) => modalDepth;
double csDrawerPanelDepth(double modalDepth) => modalDepth + 1;
bool csDrawerAnimates(bool reducedMotion) => !reducedMotion;
double csDrawerHeaderGap() => 12;
double csDrawerHeaderPaddingY() => 16;
double csDrawerHeaderPaddingX() => 20;
int csDrawerTitleFontWeight() => 700;
double csDrawerClosePadding() => 4;
double csDrawerCloseIconSize() => 20;
bool csDrawerCloseHovered(bool hovered) => hovered;
double csDrawerBodyPadding() => 20;
double csDrawerFooterPaddingY() => 14;
double csDrawerFooterPaddingX() => 20;
double csDrawerFooterGap() => 10;
String csDrawerSide(String? side) => side == 'left' ? 'left' : 'right';
bool csDrawerShowsTitle(String? title) => title != null && title.isNotEmpty;
String csDrawerLabel(String? title, String fallback) => csDrawerShowsTitle(title) ? title! : fallback;
String csDrawerCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'close': 'Đóng', 'panel': 'Bảng bên'};
  const en = {'close': csDrawerClose, 'panel': csDrawerPanel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool csDrawerShowsActions(String? actions) => actions != null && actions.isNotEmpty;
List<String> csDrawerNotify(bool hasOpenChange, bool hasClose) => [if (hasOpenChange) 'open-false', if (hasClose) 'close'];
bool csDrawerBodyFocusable(double scrollHeight, double clientHeight, double scrollWidth, double clientWidth) => scrollHeight > clientHeight + 1 || scrollWidth > clientWidth + 1;

class CsDrawer extends StatefulWidget {
  const CsDrawer({super.key, required this.title, required this.message, this.actions, this.closeLabel, required this.open, required this.onOpenChange, required this.dark, required this.highContrast, required this.compact, this.side = 'right', this.onClose, this.onRestore, this.language});
  final String title;
  final String message;
  final String? actions;
  final String? closeLabel;
  final String? language;
  final String side;
  final VoidCallback? onClose;
  final VoidCallback? onRestore;
  final bool open;
  final ValueChanged<bool> onOpenChange;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsDrawer> createState() => _CsDrawerState();
}

class _CsDrawerState extends State<CsDrawer> {
  final closeNode = FocusNode();
  final layerId = csOverlayFreshId('drawer');
  final closeId = csOverlayFreshId('drawer-close');
  var trap = 0;
  var closeHovered = false;
  String? restoreId;

  @override
  void initState() {
    super.initState();
    restoreId = CsFocusRegistry.activeId;
    CsOverlayRegistry.push(layerId);
    closeNode.addListener(() {
      if (closeNode.hasFocus) claimClose();
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !widget.open) return;
      closeNode.requestFocus();
    });
  }

  @override
  void dispose() {
    CsOverlayRegistry.remove(layerId);
    closeNode.dispose();
    super.dispose();
  }

  void claimClose() => CsFocusRegistry.claim(closeId, closeNode.requestFocus);

  KeyEventResult _tab(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent || event.logicalKey != LogicalKeyboardKey.tab) return KeyEventResult.ignored;
    final live = CsOverlayRegistry.resolved(layerId, [CsOverlayLayer(layerId, 'modal', true)]);
    if (!csOverlayOwns(layerId, live)) return KeyEventResult.ignored;
    final next = csFocusNext(trap, 1, HardwareKeyboard.instance.isShiftPressed, true);
    if (next == null) return KeyEventResult.ignored;
    setState(() => trap = next);
    closeNode.requestFocus();
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.open) return const SizedBox.shrink();
    final pack = csModePack(dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact);
    final edge = csDrawerSide(widget.side);
    final scrimBase = Color.fromARGB(255, csDrawerScrimRed, csDrawerScrimGreen, csDrawerScrimBlue);
    return Stack(
      alignment: edge == 'left' ? Alignment.topLeft : Alignment.topRight,
      children: [
        Positioned.fill(
          child: ExcludeSemantics(
            child: GestureDetector(
              onTap: () {
                widget.onOpenChange(false);
                widget.onClose?.call();
                final stack = CsOverlayRegistry.resolved(layerId, [CsOverlayLayer(layerId, 'modal', true)]);
                csReturnFocus(restoreId, widget.onRestore, layerId, stack);
              },
              child: ColoredBox(color: scrimBase.withOpacity(csDrawerScrimAlpha)),
            ),
          ),
        ),
        Focus(
          onKeyEvent: _tab,
          child: Semantics(
            label: csDrawerLabel(widget.title, csDrawerCopy('panel', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)))),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: csDrawerWidth),
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: csColor(pack.colorSurfacePage),
                  border: edge == 'left'
                      ? Border(right: BorderSide(color: csColor(pack.colorBorderDefault), width: csDrawerBorderWidth()))
                      : Border(left: BorderSide(color: csColor(pack.colorBorderDefault), width: csDrawerBorderWidth())),
                  boxShadow: [
                    BoxShadow(
                      color: scrimBase.withOpacity(csDrawerShadowAlpha),
                      blurRadius: csDrawerShadowBlur(),
                      offset: Offset(csDrawerShadowOffsetX(edge), 0),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    DecoratedBox(
                      decoration: BoxDecoration(
                        color: csColor(pack.colorSurfacePanel),
                        border: Border(bottom: BorderSide(color: csColor(pack.colorBorderDefault), width: csDrawerBorderWidth())),
                      ),
                      child: Padding(
                        padding: EdgeInsets.symmetric(horizontal: csDrawerHeaderPaddingX(), vertical: csDrawerHeaderPaddingY()),
                        child: Row(
                          children: [
                            if (csDrawerShowsTitle(widget.title)) ...[
                              Text(
                                widget.title,
                                style: TextStyle(
                                  color: csColor(pack.colorTextPrimary),
                                  fontSize: csPoints(pack.textH4),
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              SizedBox(width: csDrawerHeaderGap()),
                            ],
                            const Spacer(),
                            MouseRegion(
                              onEnter: (_) => setState(() => closeHovered = true),
                              onExit: (_) => setState(() => closeHovered = false),
                              child: TextButton(
                                focusNode: closeNode,
                                style: TextButton.styleFrom(padding: EdgeInsets.all(csDrawerClosePadding())),
                                onPressed: () {
                                  claimClose();
                                  widget.onOpenChange(false);
                                  widget.onClose?.call();
                                  final stack = CsOverlayRegistry.resolved(layerId, [CsOverlayLayer(layerId, 'modal', true)]);
                                  csReturnFocus(restoreId, widget.onRestore, layerId, stack);
                                },
                                child: Semantics(
                                  label: widget.closeLabel ?? csDrawerCopy('close', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context))),
                                  child: ExcludeSemantics(
                                    child: SizedBox(
                                      width: csDrawerCloseIconSize(),
                                      height: csDrawerCloseIconSize(),
                                      child: IconTheme(
                                        data: IconThemeData(
                                          color: csColor(csDrawerCloseHovered(closeHovered) ? pack.colorSemanticDangerText : pack.colorTextMuted),
                                        ),
                                        child: CsIcon(
                                          name: 'close',
                                          label: '',
                                          dark: widget.dark,
                                          highContrast: widget.highContrast,
                                          compact: widget.compact,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    Expanded(
                      child: SingleChildScrollView(
                        padding: EdgeInsets.all(csDrawerBodyPadding()),
                        child: Text(widget.message, style: TextStyle(color: csColor(pack.colorTextMuted))),
                      ),
                    ),
                    if (csDrawerShowsActions(widget.actions))
                      DecoratedBox(
                        decoration: BoxDecoration(
                          border: Border(top: BorderSide(color: csColor(pack.colorBorderDefault), width: csDrawerBorderWidth())),
                        ),
                        child: Padding(
                          padding: EdgeInsets.symmetric(horizontal: csDrawerFooterPaddingX(), vertical: csDrawerFooterPaddingY()),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              Text(widget.actions ?? '', style: TextStyle(color: csColor(pack.colorTextPrimary))),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

const double csResponsivePhoneBreakpoint = 360.0;
const double csResponsiveSmBreakpoint = 640.0;
const double csResponsiveMdBreakpoint = 768.0;
const double csResponsiveXlBreakpoint = 1280.0;
const double csResponsiveCanvasTrackMinWidth = 960.0;
const double csResponsiveTouchFloor = 44.0;

double csResponsiveMediaMaxWidthRatio() => 1.0;
bool csResponsiveMediaAutoHeight() => true;

String csResponsiveCqContainerType() => 'inline-size';
String csResponsiveCqContainerName() => 'cs';
int csResponsiveCqColumns(int columns, double containerWidth) {
  if ((columns == 2 || columns == 3 || columns == 4) && containerWidth <= csResponsiveMdBreakpoint) return 1;
  return columns < 1 ? 1 : columns;
}
bool csResponsiveCqHideNarrow(double containerWidth) => containerWidth <= csResponsiveMdBreakpoint;
bool csResponsiveCqStackColumn(double containerWidth) => containerWidth <= csResponsiveSmBreakpoint;
double csResponsiveCqStackChildMinInlineSize() => 0.0;
double csResponsiveCqStackChildMaxInlineRatio() => 1.0;

double csResponsiveDeskPaddingY(double viewportWidth) =>
    viewportWidth <= csResponsiveSmBreakpoint ? 12.0 : 24.0;
double csResponsiveDeskPaddingX(double viewportWidth) =>
    viewportWidth <= csResponsiveSmBreakpoint ? 6.0 : 10.0;
double csResponsiveSheetPaddingY(double viewportWidth) {
  if (viewportWidth <= csResponsivePhoneBreakpoint) return 20.0;
  if (viewportWidth <= csResponsiveSmBreakpoint) return 26.0;
  return 40.0;
}
double csResponsiveSheetPaddingX(double viewportWidth) {
  if (viewportWidth <= csResponsivePhoneBreakpoint) return 15.0;
  if (viewportWidth <= csResponsiveSmBreakpoint) return 20.0;
  return 40.0;
}
double csResponsiveSheetRadius(double viewportWidth, [double defaultRadius = 12.0]) =>
    viewportWidth <= csResponsiveSmBreakpoint ? 8.0 : defaultRadius;
bool csResponsiveDeskSheetOverflowWrapAnywhere(double viewportWidth) =>
    viewportWidth <= csResponsiveMdBreakpoint;
bool csResponsiveTableScrollsHorizontally(double viewportWidth) =>
    viewportWidth <= csResponsiveMdBreakpoint;

bool csResponsiveSidebarStacked(double viewportWidth) => viewportWidth <= csResponsiveMdBreakpoint;
double csResponsiveSidebarRowGap(double viewportWidth) => viewportWidth <= csResponsiveMdBreakpoint ? 4.0 : 2.0;
double csResponsiveSidebarColumnGap(double viewportWidth) => viewportWidth <= csResponsiveMdBreakpoint ? 10.0 : 0.0;
double csResponsiveSidebarBorderInlineEnd(double viewportWidth) => viewportWidth <= csResponsiveMdBreakpoint ? 0.0 : 1.0;
double csResponsiveSidebarBorderBlockEnd(double viewportWidth) => viewportWidth <= csResponsiveMdBreakpoint ? 1.0 : 0.0;
bool csResponsiveSidebarLabelFullWidth(double viewportWidth) => viewportWidth <= csResponsiveMdBreakpoint;
int csResponsiveAppShellColumns(double viewportWidth) => viewportWidth <= csResponsiveMdBreakpoint ? 1 : 2;
double csResponsiveAppShellMainMinWidth() => 0.0;

bool csResponsiveCanvasDeskScrollsHorizontally() => true;
double csResponsiveCanvasDeskTrackMinWidth(double viewportWidth) =>
    viewportWidth <= csResponsiveXlBreakpoint ? csResponsiveCanvasTrackMinWidth : 0.0;

double csResponsiveSectionInlinePadding(double authoredPadding, double viewportWidth) =>
    (viewportWidth <= csResponsiveSmBreakpoint && (authoredPadding == 84.0 || authoredPadding == 80.0 || authoredPadding == 72.0)) ? 22.0 : authoredPadding;

int csResponsiveGridColumns(int authoredColumns, double viewportWidth, {bool insideCanvasDesk = false}) {
  final cols = authoredColumns < 1 ? 1 : authoredColumns;
  if (insideCanvasDesk) return cols;
  if (viewportWidth <= csResponsiveSmBreakpoint && cols >= 2 && cols <= 6) return 1;
  if (viewportWidth <= csResponsiveMdBreakpoint && cols >= 3 && cols <= 6) return 2;
  return cols;
}

bool csResponsiveCollapsesTwoColumnSpec(String spec, double viewportWidth, {bool insideCanvasDesk = false}) {
  if (insideCanvasDesk) return false;
  if (viewportWidth <= csResponsivePhoneBreakpoint && spec.contains('minmax(320px')) return true;
  if (viewportWidth > csResponsiveSmBreakpoint) return false;
  final normalized = spec.replaceAll(' ', '').toLowerCase();
  return normalized.contains('1fr1fr') ||
      normalized.contains('1.15fr1fr') ||
      normalized.contains('1fr1.15fr') ||
      normalized.contains('2fr1fr') ||
      normalized.contains('1fr2fr') ||
      normalized.contains('auto1fr') ||
      normalized.contains('248px1fr');
}

double csResponsiveNavItemMinHeight(double viewportWidth, [double baseHeight = 39.0]) =>
    viewportWidth <= csResponsiveMdBreakpoint ? (baseHeight < csResponsiveTouchFloor ? csResponsiveTouchFloor : baseHeight) : baseHeight;
double csResponsiveSearchMinHeight(double viewportWidth, [double baseHeight = 26.0]) =>
    viewportWidth <= csResponsiveMdBreakpoint ? (baseHeight < csResponsiveTouchFloor ? csResponsiveTouchFloor : baseHeight) : baseHeight;

bool csResponsiveTabsScrollHorizontally(double viewportWidth) => viewportWidth <= csResponsivePhoneBreakpoint;
String csResponsiveTabsScrollbarWidth(double viewportWidth, {required bool coarsePointer}) {
  if (coarsePointer) return 'none';
  if (viewportWidth <= csResponsivePhoneBreakpoint) return 'thin';
  return 'auto';
}
bool csResponsivePaginationWraps(double viewportWidth) => viewportWidth <= csResponsivePhoneBreakpoint;
bool csResponsiveOtpWraps(double viewportWidth) => viewportWidth <= csResponsivePhoneBreakpoint;
double csResponsiveOtpGap(double viewportWidth, [double defaultGap = 8.0]) =>
    viewportWidth <= csResponsivePhoneBreakpoint ? 4.0 : defaultGap;
double csResponsiveOtpInputWidth(double viewportWidth, {required bool coarsePointer, double defaultWidth = 44.0}) =>
    (viewportWidth <= csResponsivePhoneBreakpoint && !coarsePointer) ? 36.0 : defaultWidth;
double csResponsiveOtpInputHeight(double viewportWidth, {required bool coarsePointer, double defaultHeight = 44.0}) =>
    (viewportWidth <= csResponsivePhoneBreakpoint && !coarsePointer) ? 40.0 : defaultHeight;
int csResponsiveDlColumns(double viewportWidth, [int defaultColumns = 2]) =>
    viewportWidth <= csResponsivePhoneBreakpoint ? 1 : defaultColumns;
double csResponsiveFieldMinInlineSize() => 0.0;
