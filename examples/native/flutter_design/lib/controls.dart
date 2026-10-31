import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'cs_modes.dart';
import 'icon_paths.dart';

enum CsButtonRole { primary, danger }

class CsLanguageScope extends InheritedWidget {
  const CsLanguageScope({super.key, required this.language, required super.child});
  final String? language;
  static String? of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<CsLanguageScope>()?.language;
  @override
  bool updateShouldNotify(CsLanguageScope oldWidget) => language != oldWidget.language;
}

class CsFormAncestor extends InheritedWidget {
  const CsFormAncestor({super.key, required this.inForm, required super.child});
  final bool inForm;
  static bool of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<CsFormAncestor>()?.inForm ?? false;
  @override
  bool updateShouldNotify(CsFormAncestor oldWidget) => inForm != oldWidget.inForm;
}

CSTokenModePack csModePack({
  required bool dark,
  required bool highContrast,
  required bool compact,
}) {
  return CSModes.resolve(
    theme: dark ? CSTheme.dark : CSTheme.light,
    colorScheme: dark ? CSColorScheme.dark : CSColorScheme.light,
    element: null,
    variant: null,
    density: compact ? CSDensity.compact : CSDensity.comfortable,
    contrast: highContrast ? CSContrast.high : CSContrast.standard,
    style: CSStyle.liquidGlass,
  );
}

double csPoints(CSDimension dimension) =>
    dimension.unit == CSLengthUnit.rem ? dimension.value * 16 : dimension.value;

Color csColor(CSColorValue value) {
  final rgb = value.colorSpace == CSColorSpace.srgb
      ? value.components
      : _oklabToSrgb(value.components);
  return Color.fromRGBO(
    (rgb[0] * 255).round(),
    (rgb[1] * 255).round(),
    (rgb[2] * 255).round(),
    value.alpha,
  );
}

List<double> _oklabToSrgb(List<double> lab) {
  final l = lab[0], a = lab[1], b = lab[2];
  final lmsL = l + 0.3963377774 * a + 0.2158037573 * b;
  final lmsM = l - 0.1055613458 * a - 0.0638541728 * b;
  final lmsS = l - 0.0894841775 * a - 1.2914855480 * b;
  final cubeL = lmsL * lmsL * lmsL;
  final cubeM = lmsM * lmsM * lmsM;
  final cubeS = lmsS * lmsS * lmsS;
  final linear = [
    4.0767416621 * cubeL - 3.3077115913 * cubeM + 0.2309699292 * cubeS,
    -1.2684380046 * cubeL + 2.6097574011 * cubeM - 0.3413193965 * cubeS,
    -0.0041960863 * cubeL - 0.7034186147 * cubeM + 1.7076147010 * cubeS,
  ];
  return linear.map((channel) {
    final clamped = math.min(1.0, math.max(0.0, channel));
    final encoded = clamped <= 0.0031308
        ? 12.92 * clamped
        : 1.055 * math.pow(clamped, 1 / 2.4).toDouble() - 0.055;
    return encoded.toDouble();
  }).toList();
}

class CsFocusRegistry {
  static String? activeId;
  static final Map<String, void Function()> _claims = {};

  static void claim(String id, void Function() restore) {
    _claims[id] = restore;
    activeId = id;
  }

  static void disconnect(String id) {
    _claims.remove(id);
    if (activeId == id) activeId = null;
  }

  static bool canRestore(String? id) => id != null && _claims.containsKey(id);

  static void restore(String? id) {
    if (canRestore(id)) _claims[id]?.call();
  }
}

void csReturnFocus(String? savedId, void Function()? onRestore, String layerId, List<CsOverlayLayer> layers) {
  final captured = CsFocusRegistry.canRestore(savedId);
  if (csModalShouldRestore(csOverlayWasTop(layerId, layers), csModalOwned('panel', 'opener', true) && csOverlayOwns(layerId, layers), captured || onRestore != null, false)) {
    if (captured) CsFocusRegistry.restore(savedId);
    onRestore?.call();
  }
}

class CsButton extends StatefulWidget {
  const CsButton({
    super.key,
    required this.title,
    required this.onPressed,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.role = CsButtonRole.primary,
    this.paddingX,
    this.paddingY,
  });

  final String title;
  final VoidCallback onPressed;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final CsButtonRole role;
  final double? paddingX;
  final double? paddingY;

  @override
  State<CsButton> createState() => _CsButtonState();
}

class _CsButtonState extends State<CsButton> {
  final node = FocusNode();
  final focusId = csOverlayFreshId('button');

  @override
  void dispose() {
    CsFocusRegistry.disconnect(focusId);
    node.dispose();
    super.dispose();
  }

  void _claim() => CsFocusRegistry.claim(focusId, node.requestFocus);

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: widget.dark,
      highContrast: widget.highContrast,
      compact: widget.compact,
    );
    final fill = csColor(widget.role == CsButtonRole.primary
        ? pack.componentButtonPrimaryBg
        : pack.colorSemanticDanger);
    final ink = csColor(widget.role == CsButtonRole.primary
        ? pack.componentButtonPrimaryFg
        : pack.colorTextInverse);
    return FilledButton(
      focusNode: node,
      style: FilledButton.styleFrom(
        padding: EdgeInsets.symmetric(
          horizontal: widget.paddingX ?? csPoints(pack.componentButtonMdPaddingX),
          vertical: widget.paddingY ?? csPoints(pack.componentButtonMdPaddingY),
        ),
        minimumSize: Size.fromHeight(csPoints(pack.componentButtonMdMinHeight)),
        backgroundColor: fill,
        foregroundColor: ink,
        shape: RoundedRectangleBorder(
          borderRadius:
              BorderRadius.circular(csPoints(pack.componentButtonRadius)),
        ),
      ),
      onPressed: () {
        _claim();
        widget.onPressed();
      },
      onFocusChange: (focused) {
        if (focused) _claim();
      },
      child: Text(widget.title),
    );
  }
}

class CsOwnFocus extends StatefulWidget {
  const CsOwnFocus({super.key, required this.builder});
  final Widget Function(FocusNode node, VoidCallback claim) builder;

  @override
  State<CsOwnFocus> createState() => _CsOwnFocusState();
}

class _CsOwnFocusState extends State<CsOwnFocus> {
  final node = FocusNode();
  final focusId = csOverlayFreshId('focus');

  @override
  void initState() {
    super.initState();
    node.addListener(() {
      if (node.hasFocus) CsFocusRegistry.claim(focusId, node.requestFocus);
    });
  }

  @override
  void dispose() {
    CsFocusRegistry.disconnect(focusId);
    node.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => widget.builder(node, () => CsFocusRegistry.claim(focusId, node.requestFocus));
}

bool csTextFieldAlert(String? error) => error != null && error.isNotEmpty;

class CsTextField extends StatelessWidget {
  const CsTextField({
    super.key,
    required this.label,
    required this.controller,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.secure = false,
    this.error,
  });

  final String label;
  final TextEditingController controller;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final bool secure;
  final String? error;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: dark,
      highContrast: highContrast,
      compact: compact,
    );
    final field = CsOwnFocus(builder: (node, claim) => TextField(
      focusNode: node,
      controller: controller,
      obscureText: secure,
      decoration: InputDecoration(
        labelText: label,
        contentPadding: EdgeInsets.symmetric(
          horizontal: csPoints(pack.componentTextfieldPaddingX),
          vertical: csPoints(pack.componentTextfieldPaddingY),
        ),
        constraints:
            BoxConstraints(minHeight: csPoints(pack.componentTextfieldMinHeight)),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(csPoints(pack.radiusSm)),
          borderSide: BorderSide(color: csColor(pack.componentTextfieldBorderDefault)),
        ),
      ),
      onChanged: (_) => claim(),
    ));
    if (!csTextFieldAlert(error)) return field;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      field,
      Semantics(liveRegion: true, child: Text(error!)),
    ]);
  }
}

class CsTextButton extends StatelessWidget {
  const CsTextButton({
    super.key,
    required this.title,
    required this.onPressed,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.role = CsButtonRole.primary,
  });

  final String title;
  final VoidCallback onPressed;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final CsButtonRole role;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: dark,
      highContrast: highContrast,
      compact: compact,
    );
    final ink = csColor(role == CsButtonRole.danger
        ? pack.colorSemanticDangerText
        : pack.colorLink);
    return CsOwnFocus(builder: (node, claim) => TextButton(
      focusNode: node,
      onPressed: () {
        claim();
        onPressed();
      },
      child: Text(title, style: TextStyle(color: ink)),
    ));
  }
}

const csBadgeTracking = 0.04;
String? csBadgeToneClass(String name) => name == 'neutral' ? null : name;
String csBadgeSpoken(String label) => label;
const csSwitchLabel = 'Setting';
bool csSwitchShowsLabel(String? label) => label != null && label.isNotEmpty;
String? csSwitchName(String? label, String? ariaLabel, String? labelledBy, String fallback) {
  if (ariaLabel != null) return ariaLabel;
  if (csSwitchShowsLabel(label) || csSwitchShowsLabel(labelledBy)) return null;
  return fallback;
}
String csSwitchCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'label': 'Cài đặt'};
  const en = {'label': csSwitchLabel};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csBadgeVariant(String name) => const {'solid', 'ochre', 'success', 'danger', 'warning', 'info'}.contains(name) ? name : 'neutral';

class CsBadge extends StatelessWidget {
  const CsBadge({
    super.key,
    required this.label,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.variant = 'neutral',
    this.dot = false,
  });

  final String label;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final String variant;
  final bool dot;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: dark,
      highContrast: highContrast,
      compact: compact,
    );
    final tone = csBadgeVariant(variant);
    final fill = switch (tone) {
      'solid' => pack.colorBrandUmber,
      'ochre' => pack.colorBrandOchre,
      'success' => pack.colorSemanticSuccess,
      'danger' => pack.colorSemanticDanger,
      'warning' => pack.colorSemanticWarning,
      'info' => pack.colorSemanticInfo,
      _ => pack.colorSurfaceRaised,
    };
    final ink = switch (tone) {
      'solid' => pack.colorTextInverse,
      'ochre' => pack.colorBrandUmber,
      'success' => pack.colorSemanticSuccessFg,
      'danger' => pack.colorSemanticDangerFg,
      'warning' => pack.colorSemanticWarningFg,
      'info' => pack.colorSemanticInfoFg,
      _ => pack.colorTextAccent,
    };
    return DecoratedBox(
      decoration: BoxDecoration(
        color: csColor(fill),
        borderRadius: BorderRadius.circular(csPoints(pack.radiusFull)),
        border: tone == 'neutral' ? Border.all(color: csColor(pack.colorBorderDefault)) : null,
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          if (dot) ExcludeSemantics(child: Container(width: 7, height: 7, decoration: BoxDecoration(color: csColor(ink), shape: BoxShape.circle))),
          Text(label.toUpperCase(), semanticsLabel: label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: csColor(ink))),
        ]),
      ),
    );
  }
}

bool csDividerShowsLabel(String? label, {bool zero = false}) => zero || (label != null && label.isNotEmpty);
String csDividerText(String? label, {bool zero = false}) => zero ? '0' : (label ?? '');
String csDividerOrientation(bool vertical) => vertical ? 'vertical' : 'horizontal';

class CsDivider extends StatelessWidget {
  const CsDivider({
    super.key,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.label,
    this.zero = false,
    this.vertical = false,
  });

  final bool dark;
  final bool highContrast;
  final bool compact;
  final String? label;
  final bool zero;
  final bool vertical;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: dark,
      highContrast: highContrast,
      compact: compact,
    );
    final ink = csColor(pack.colorBorderDefault);
    if (csDividerShowsLabel(label, zero: zero)) {
      return Semantics(
        label: csDividerText(label, zero: zero),
        child: Row(children: [
          Expanded(child: SizedBox(height: 1, child: ColoredBox(color: ink))),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(csDividerText(label, zero: zero), style: TextStyle(color: csColor(pack.colorTextMuted))),
          ),
          Expanded(child: SizedBox(height: 1, child: ColoredBox(color: ink))),
        ]),
      );
    }
    return Semantics(
      label: csDividerOrientation(vertical),
      child: SizedBox(
        width: vertical ? 1 : double.infinity,
        height: vertical ? 16 : 1,
        child: ColoredBox(color: ink),
      ),
    );
  }
}

class CsListRow extends StatelessWidget {
  const CsListRow({
    super.key,
    required this.title,
    required this.subtitle,
    required this.dark,
    required this.highContrast,
    required this.compact,
  });

  final String title;
  final String subtitle;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: dark,
      highContrast: highContrast,
      compact: compact,
    );
    return ListTile(
      title: Text(title,
          style: TextStyle(
              color: csColor(pack.colorTextPrimary),
              fontWeight: FontWeight.w600)),
      subtitle: CsBadge(
        label: subtitle,
        dark: dark,
        highContrast: highContrast,
        compact: compact,
      ),
      trailing: Container(
        width: 10,
        height: 10,
        decoration: BoxDecoration(
          color: csColor(pack.colorBrandOchre),
          shape: BoxShape.circle,
        ),
      ),
    );
  }
}

String? csSelectPrimaryLanguage(String? tag) {
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
String csSelectCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'placeholder': 'Chọn…'};
  const en = {'placeholder': 'Select…'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
String csSelectPlaceholder(String? text, String fallback) => text ?? fallback;
bool csSelectShowsPrompt(String? placeholder, bool hasContent) => placeholder != null || !hasContent;
String csSelectShownText(String value, String? placeholder, String fallback, bool hasContent) {
  if (value.isNotEmpty) return value;
  if (csSelectShowsPrompt(placeholder, hasContent)) return csSelectPlaceholder(placeholder, fallback);
  return value;
}
String? csSelectResolvedLanguage(String? explicit, String? ancestor) => csSelectPrimaryLanguage(explicit) ?? csSelectPrimaryLanguage(ancestor);

bool csSelectAlert(String? error) => error != null && error.isNotEmpty;

class CsSelect<T> extends StatelessWidget {
  const CsSelect({
    super.key,
    required this.label,
    required this.value,
    required this.items,
    required this.onChanged,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.description,
    this.error,
    this.placeholder,
    this.disabled = false,
    this.language,
  });

  final String label;
  final T value;
  final List<DropdownMenuItem<T>> items;
  final ValueChanged<T?> onChanged;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final String? description;
  final String? error;
  final String? placeholder;
  final bool disabled;
  final String? language;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: dark,
      highContrast: highContrast,
      compact: compact,
    );
    final prompt = csSelectCopy('placeholder', csSelectResolvedLanguage(language, CsLanguageScope.of(context)));
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (description != null && description!.isNotEmpty) Text(description!, style: TextStyle(color: csColor(pack.colorTextMuted))),
      CsOwnFocus(builder: (node, claim) => DropdownButtonFormField<T>(
        focusNode: node,
        value: value,
        isExpanded: true,
        isDense: false,
        itemHeight: null,
        decoration: InputDecoration(
          labelText: label,
          labelStyle: TextStyle(color: csColor(pack.colorTextPrimary)),
          hintText: csSelectShownText('', placeholder, prompt, items.isNotEmpty),
        ),
        icon: ExcludeSemantics(child: IgnorePointer(child: CsIcon(name: 'chevron-down', label: '', dark: dark, highContrast: highContrast, compact: compact))),
        items: items,
        onTap: disabled ? null : claim,
        onChanged: disabled ? null : (next) {
          claim();
          onChanged(next);
        },
      )),
      if (csSelectAlert(error)) Semantics(liveRegion: true, child: Text(error!, style: TextStyle(color: csColor(pack.colorSemanticDangerText)))),
    ]);
  }
}

class CsCard extends StatelessWidget {
  const CsCard({
    super.key,
    required this.child,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.padding = EdgeInsets.zero,
  });

  final Widget child;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: dark,
      highContrast: highContrast,
      compact: compact,
    );
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: csColor(pack.colorSurfacePanel),
        borderRadius: BorderRadius.circular(csPoints(pack.radiusLg)),
        border: Border.all(color: csColor(pack.colorBorderDefault)),
      ),
      child: child,
    );
  }
}

class CsSwitch extends StatelessWidget {
  const CsSwitch({
    super.key,
    required this.title,
    required this.value,
    required this.onChanged,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.disabled = false,
    this.ariaLabel,
    this.labelledBy,
    this.language,
  });

  final String title;
  final bool value;
  final ValueChanged<bool> onChanged;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final bool disabled;
  final String? ariaLabel;
  final String? labelledBy;
  final String? language;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: dark,
      highContrast: highContrast,
      compact: compact,
    );
    final spoken = csSwitchCopy('label', csSelectResolvedLanguage(language, CsLanguageScope.of(context)));
    final name = csSwitchName(title, ariaLabel, labelledBy, spoken);
    return CsOwnFocus(builder: (node, claim) => Focus(
      focusNode: node,
      child: Semantics(
        label: name ?? title,
        child: SwitchListTile(
          title: csSwitchShowsLabel(title) ? ExcludeSemantics(child: Text(title, style: TextStyle(color: csColor(pack.colorTextPrimary)))) : null,
          value: value,
          activeColor: csColor(pack.colorBrandOchre),
          onChanged: disabled ? null : (next) {
            claim();
            onChanged(next);
          },
        ),
      ),
    ));
  }
}

const csDialogClose = 'Close';
const csDialogMaxRem = 42.0;
double csDialogMaxWidth([double root = 16]) => csDialogMaxRem * root;
String csDialogCloseText(String? label, String fallback) => label ?? fallback;
String csDialogCopy(String key, String? language) {
  final want = csSelectPrimaryLanguage(language) ?? 'vi';
  const vi = {'close': 'Đóng', 'confirm': 'Xác nhận', 'cancel': 'Hủy'};
  const en = {'close': csDialogClose, 'confirm': 'Confirm', 'cancel': 'Cancel'};
  const ja = {'close': '閉じる', 'confirm': '確認', 'cancel': 'キャンセル'};
  final seen = <String>{};
  for (final locale in [want, 'en', 'vi']) {
    if (!seen.add(locale)) continue;
    final table = locale == 'vi' ? vi : locale == 'en' ? en : locale == 'ja' ? ja : const <String, String>{};
    final value = table[key];
    if (value != null) return value;
  }
  return key;
}
bool csDialogShowsClose(bool hasOpenChange, bool hasClose) => hasOpenChange || hasClose;
bool csDialogShowsActions(String? actions) => actions != null && actions.isNotEmpty;
String? csDialogDescribedBy(String? explicit, bool hasExplicit, bool hasBody, String bodyId) => hasExplicit ? (explicit != null && explicit.isNotEmpty ? explicit : null) : (hasBody ? bodyId : null);
List<String> csDialogNotify(bool hasOpenChange, bool hasClose) => [if (hasOpenChange) 'open-false', if (hasClose) 'close'];
bool csModalOwned(String active, String? opener, bool insidePanel) => active == 'body' || (opener != null && active == opener) || insidePanel;
bool csModalShouldRestore(bool wasTop, bool ownedFocus, bool openerConnected, bool openerHidden) => wasTop && ownedFocus && openerConnected && !openerHidden;
bool csModalPullBack(bool inside) => !inside;
class CsOverlayLayer {
  const CsOverlayLayer(this.id, this.kind, this.connected);
  final String id;
  final String kind;
  final bool connected;
}
String? csOverlayTop(List<CsOverlayLayer> layers) {
  for (final layer in layers.reversed) {
    if (layer.kind != 'toast') return layer.id;
  }
  return null;
}
String? csOverlayActive(List<CsOverlayLayer> layers) {
  for (final layer in layers.reversed) {
    if (layer.kind == 'modal' && layer.connected) return layer.id;
  }
  return null;
}
bool csOverlayWasTop(String id, List<CsOverlayLayer> layers) => csOverlayTop(layers) == id;
bool csOverlayOwns(String id, List<CsOverlayLayer> layers) => csOverlayActive(layers) == id;
int _csOverlaySeq = 0;
String csOverlayFreshId(String kind) {
  _csOverlaySeq += 1;
  return '$kind-$_csOverlaySeq';
}
class CsOverlayRegistry {
  static final layers = <CsOverlayLayer>[];
  static void push(String id) {
    layers.removeWhere((layer) => layer.id == id);
    layers.add(CsOverlayLayer(id, 'modal', true));
  }
  static void remove(String id) { layers.removeWhere((layer) => layer.id == id); }
  static List<CsOverlayLayer> resolved(String id, List<CsOverlayLayer> fallback) => layers.any((layer) => layer.id == id) ? List<CsOverlayLayer>.of(layers) : fallback;
}
int? csFocusNext(int current, int count, bool shift, bool inside) {
  if (count <= 0) return null;
  if (!inside || current < 0 || current >= count) return shift ? count - 1 : 0;
  final delta = shift ? -1 : 1;
  return (current + delta + count) % count;
}

class CsDialog extends StatefulWidget {
  const CsDialog({
    super.key,
    required this.title,
    required this.message,
    required this.confirmTitle,
    required this.onConfirm,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.onOpenChange,
    this.onClose,
    this.closeLabel,
    this.language,
  });

  final String title;
  final String message;
  final String confirmTitle;
  final VoidCallback onConfirm;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final ValueChanged<bool>? onOpenChange;
  final VoidCallback? onClose;
  final String? closeLabel;
  final String? language;

  @override
  State<CsDialog> createState() => _CsDialogState();
}

class _CsDialogState extends State<CsDialog> {
  final confirmNode = FocusNode();
  final layerId = csOverlayFreshId('dialog');
  var trap = 0;
  String? restoreId;

  @override
  void initState() {
    super.initState();
    restoreId = CsFocusRegistry.activeId;
    CsOverlayRegistry.push(layerId);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      if (csDialogShowsActions(widget.confirmTitle)) confirmNode.requestFocus();
    });
  }

  @override
  void dispose() {
    final stack = CsOverlayRegistry.resolved(layerId, [CsOverlayLayer(layerId, 'modal', true)]);
    csReturnFocus(restoreId, null, layerId, stack);
    CsOverlayRegistry.remove(layerId);
    confirmNode.dispose();
    super.dispose();
  }

  KeyEventResult _tab(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent || event.logicalKey != LogicalKeyboardKey.tab) return KeyEventResult.ignored;
    final stack = CsOverlayRegistry.resolved(layerId, [CsOverlayLayer(layerId, 'modal', true)]);
    if (!csOverlayOwns(layerId, stack)) return KeyEventResult.ignored;
    final stops = csDialogShowsActions(widget.confirmTitle) ? 1 : 0;
    final next = csFocusNext(trap, stops, HardwareKeyboard.instance.isShiftPressed, true);
    if (next == null) return KeyEventResult.ignored;
    setState(() => trap = next);
    confirmNode.requestFocus();
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: widget.dark,
      highContrast: widget.highContrast,
      compact: widget.compact,
    );
    return Focus(
      onKeyEvent: _tab,
      child: Material(
        color: csColor(pack.colorSurfacePanel),
        borderRadius: BorderRadius.circular(csPoints(pack.radiusMd)),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(children: [
                Expanded(child: Text(widget.title,
                    style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: csColor(pack.colorTextPrimary)))),
                if (csDialogShowsClose(widget.onOpenChange != null, widget.onClose != null)) IconButton(
                  tooltip: csDialogCloseText(widget.closeLabel, csDialogCopy('close', csSelectResolvedLanguage(widget.language, CsLanguageScope.of(context)))),
                  onPressed: () { widget.onOpenChange?.call(false); widget.onClose?.call(); },
                  icon: ExcludeSemantics(child: CsIcon(name: 'close', label: '', dark: widget.dark, highContrast: widget.highContrast, compact: widget.compact)),
                ),
              ]),
              const SizedBox(height: 8),
              if (widget.message.isNotEmpty) Text(widget.message, style: TextStyle(color: csColor(pack.colorTextMuted))),
              const SizedBox(height: 12),
              if (csDialogShowsActions(widget.confirmTitle)) Focus(
                focusNode: confirmNode,
                child: CsButton(
                  title: widget.confirmTitle,
                  onPressed: widget.onConfirm,
                  dark: widget.dark,
                  highContrast: widget.highContrast,
                  compact: widget.compact,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
