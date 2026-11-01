import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'cs_modes.dart';
import 'icon_paths.dart';
import 'surfaces.dart';

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

const int csInteractionHoverShadowRed = 69;
const int csInteractionHoverShadowGreen = 33;
const int csInteractionHoverShadowBlue = 14;
const double csInteractionHoverShadowAlpha = 0.24;
double csInteractionHoverShadowOffsetY() => 8;
double csInteractionHoverShadowBlur() => 20;
double csInteractionButtonTranslateY({
  required bool hovered,
  bool active = false,
  bool disabled = false,
  bool reducedMotion = false,
}) => disabled || active || reducedMotion || !hovered ? 0 : -1;
bool csInteractionShowsButtonHoverShadow({
  required bool hovered,
  bool active = false,
  bool disabled = false,
}) => hovered && !active && !disabled;
bool csInteractionShowsButtonActiveShadow({
  required bool active,
  bool disabled = false,
}) => active && !disabled;
double csInteractionFocusHaloWidth(bool focused) => focused ? 5 : 0;
double csInteractionCmdkSearchOuterHaloWidth(bool focused) => focused ? 5 : 0;
double csInteractionCmdkSearchInsetHaloWidth(bool focused) => focused ? 4 : 0;
double csInteractionRiseOffsetY({bool reducedMotion = false}) => reducedMotion ? 0 : 10;
double csInteractionRiseDelayMs(int step, {bool reducedMotion = false}) {
  if (reducedMotion) return 0;
  switch (step) {
    case 2:
      return 80;
    case 3:
      return 160;
    case 4:
      return 240;
    default:
      return 0;
  }
}
double csInteractionEntranceDurationMs(CSTokenModePack pack, {bool reducedMotion = false}) =>
    reducedMotion ? 0 : pack.durationSlow.value;
double csInteractionDialogDurationMs(CSTokenModePack pack, {bool reducedMotion = false}) =>
    reducedMotion ? 0 : pack.durationBase.value;

double csA11ySrOnlySize() => 1;
double csA11ySrOnlyMargin() => -1;
double csA11ySrOnlyPadding() => 0;
double csA11ySrOnlyBorderWidth() => 0;
double csA11yTouchTargetMinSize({bool coarse = true}) => coarse ? 44 : 0;
double csA11yCheckRadioInputBoxSize({bool coarse = true}) => coarse ? 24 : 18;
bool csA11yTabsScrollbarHidden({bool coarse = true}) => coarse;
double csA11yInputGroupButtonMinWidth({bool coarse = true}) => coarse ? 46 : 0;
const int csA11yColorPickerColumns = 5;
double csA11yColorPickerColumnWidth({bool coarse = true}) => coarse ? 44 : 28;
const int csA11yCalendarColumns = 7;
double csA11yCalendarColumnWidth({bool coarse = true}) => coarse ? 44 : 34;
double csA11yCalendarMinGridWidth({bool coarse = true}) => csA11yCalendarColumns * csA11yCalendarColumnWidth(coarse: coarse);
double csA11yCarouselViewMinHeight({bool coarse = true}) => coarse ? 64 : 0;
double csA11yCarouselViewPaddingInline({bool coarse = true}) => coarse ? 64 : 0;
double csA11yCarouselDotButtonSize({bool coarse = true}) => coarse ? 44 : 8;
double csA11yCarouselDotRadius() => 4.5;
double csA11yCarouselDotOuterStop() => 5;
double csA11ySplitterMinBlockSize({bool coarse = true}) => coarse ? 46 : 0;
double csA11ySplitterBarMinSize({bool coarse = true}) => coarse ? 44 : 0;
double csA11ySliderBlockSize({bool coarse = true}) => coarse ? 44 : 22;
double csA11yReducedMotionDurationMs() => 0.01;
int csA11yReducedMotionIterationCount() => 1;
double csA11yEffectiveDurationMs(double durationMs, {required bool reducedMotion}) =>
    reducedMotion ? csA11yReducedMotionDurationMs() : durationMs;
const String csA11yHighContrastLightBorderHex = '#9a8060';
const String csA11yHighContrastLightMutedHex = '#45210e';
const String csA11yHighContrastDarkBorderHex = '#7a6450';
const String csA11yHighContrastDarkMutedHex = '#f5ead9';
bool csA11yAppliesHighContrastOverride({required bool prefersContrastMore, String? contrastAttr}) =>
    prefersContrastMore && contrastAttr != 'standard';
String csA11yHighContrastBorderHex({required bool dark}) =>
    dark ? csA11yHighContrastDarkBorderHex : csA11yHighContrastLightBorderHex;
String csA11yHighContrastMutedHex({required bool dark}) =>
    dark ? csA11yHighContrastDarkMutedHex : csA11yHighContrastLightMutedHex;
double csA11yForcedColorsSwitchBorderWidth() => 1;
double csA11yForcedColorsCarouselDotBorderWidth(bool current) => current ? 3 : 1;
double csA11yForcedColorsSelectedTabBorderBottomWidth(bool selected) => selected ? 3 : 0;
double csA11yForcedColorsSegmentedBorderWidth() => 2;
double csA11yForcedColorsToggleOutlineWidth(bool pressed, {bool focusVisible = false}) =>
    (pressed && !focusVisible) ? 2 : 0;
double csA11yForcedColorsToggleOutlineOffset() => -4;

enum CsButtonVariant {
  primary('primary'),
  secondary('secondary'),
  tertiary('tertiary'),
  ghost('ghost'),
  danger('danger'),
  dangerGhost('danger-ghost');

  const CsButtonVariant(this.key);
  final String key;
}

enum CsButtonSize {
  xs('xs'),
  sm('sm'),
  md('md'),
  lg('lg');

  const CsButtonSize(this.key);
  final String key;
}

const double csButtonDangerGhostHoverAlpha = 0.03;
const double csButtonDisabledOpacity = 0.58;

CsButtonVariant csButtonResolveVariant(String? raw) {
  for (final item in CsButtonVariant.values) {
    if (item.key == raw) return item;
  }
  return CsButtonVariant.primary;
}

CsButtonSize csButtonResolveSize(String? raw) {
  for (final item in CsButtonSize.values) {
    if (item.key == raw) return item;
  }
  return CsButtonSize.md;
}

bool csButtonIsDisabled(bool disabled, bool loading) => disabled || loading;
String? csButtonAriaBusy(bool loading) => loading ? 'true' : null;
bool csButtonShowsIcon(String? icon) => icon != null && icon.isNotEmpty;
double csButtonOpacity(bool disabled, bool loading) =>
    csButtonIsDisabled(disabled, loading) ? csButtonDisabledOpacity : 1.0;
int csButtonFontWeight() => 700;
double csButtonLineHeight() => 1.2;
double csButtonGap(CSTokenModePack pack) => csPoints(pack.componentButtonGap);
double csButtonRadius(CSTokenModePack pack) => csPoints(pack.componentButtonRadius);
double csButtonBorderWidth() => 1;
double csButtonHoverBrightness(CsButtonVariant variant) =>
    (variant == CsButtonVariant.primary || variant == CsButtonVariant.danger) ? 1.08 : 1.0;
double csButtonActiveTranslateY() => 0.5;
double csButtonSpinnerBorderWidth() => 2;
double csButtonSpinnerDurationMs() => 600;
bool csButtonSpinnerSpins(bool reducedMotion) => !reducedMotion;

double csButtonMinHeight(CsButtonSize size, CSTokenModePack pack, {bool coarse = false}) {
  return switch (size) {
    CsButtonSize.xs => csPoints(coarse ? pack.componentButtonXsMinHeightCoarse : pack.componentButtonXsMinHeight),
    CsButtonSize.sm => csPoints(coarse ? pack.componentButtonSmMinHeightCoarse : pack.componentButtonSmMinHeight),
    CsButtonSize.md => csPoints(coarse ? pack.componentButtonMdMinHeightCoarse : pack.componentButtonMdMinHeight),
    CsButtonSize.lg => csPoints(pack.componentButtonLgMinHeight),
  };
}

double csButtonMinWidth(CsButtonSize size, CSTokenModePack pack) {
  return switch (size) {
    CsButtonSize.xs => csPoints(pack.componentButtonXsMinWidth),
    CsButtonSize.sm => csPoints(pack.componentButtonSmMinHeight),
    CsButtonSize.md => csPoints(pack.componentButtonMdMinHeight),
    CsButtonSize.lg => 0,
  };
}

double csButtonPaddingY(CsButtonSize size, CSTokenModePack pack) {
  return switch (size) {
    CsButtonSize.xs => csPoints(pack.componentButtonXsPaddingY),
    CsButtonSize.sm => csPoints(pack.componentButtonSmPaddingY),
    CsButtonSize.md => csPoints(pack.componentButtonMdPaddingY),
    CsButtonSize.lg => csPoints(pack.componentButtonLgPaddingY),
  };
}

double csButtonPaddingX(CsButtonSize size, CSTokenModePack pack) {
  return switch (size) {
    CsButtonSize.xs => csPoints(pack.componentButtonXsPaddingX),
    CsButtonSize.sm => csPoints(pack.componentButtonSmPaddingX),
    CsButtonSize.md => csPoints(pack.componentButtonMdPaddingX),
    CsButtonSize.lg => csPoints(pack.componentButtonLgPaddingX),
  };
}

double csButtonFontSize(CsButtonSize size, CSTokenModePack pack) =>
    csPoints(size == CsButtonSize.xs ? pack.fontSizeSm : pack.fontSizeBase);

CSColorValue? csButtonBackgroundColor(CsButtonVariant variant, CSTokenModePack pack, {bool hovered = false}) {
  return switch (variant) {
    CsButtonVariant.primary => pack.componentButtonPrimaryBg,
    CsButtonVariant.secondary => hovered ? pack.colorSurfaceRaised : pack.colorSurfacePanel,
    CsButtonVariant.tertiary => pack.colorSurfaceRaised,
    CsButtonVariant.ghost => hovered ? pack.colorSurfaceRaised : null,
    CsButtonVariant.danger => pack.colorSemanticDanger,
    CsButtonVariant.dangerGhost => hovered
        ? CSColorValue(
            colorSpace: pack.colorSemanticDanger.colorSpace,
            components: pack.colorSemanticDanger.components,
            alpha: csButtonDangerGhostHoverAlpha,
          )
        : null,
  };
}

CSColorValue csButtonForegroundColor(CsButtonVariant variant, CSTokenModePack pack, {bool dark = false}) {
  return switch (variant) {
    CsButtonVariant.primary => pack.componentButtonPrimaryFg,
    CsButtonVariant.secondary => dark ? pack.colorBrandOchre : pack.colorBrandUmber,
    CsButtonVariant.tertiary || CsButtonVariant.ghost => dark ? pack.colorTextPrimary : pack.colorBrandUmber,
    CsButtonVariant.danger => pack.colorSemanticDangerFg,
    CsButtonVariant.dangerGhost => pack.colorSemanticDangerText,
  };
}

CSColorValue? csButtonBorderColor(CsButtonVariant variant, CSTokenModePack pack, {bool dark = false, bool hovered = false}) {
  return switch (variant) {
    CsButtonVariant.secondary => dark ? pack.colorBrandOchre : pack.colorBrandUmber,
    CsButtonVariant.tertiary => hovered ? pack.colorBorderDefault : null,
    CsButtonVariant.primary || CsButtonVariant.ghost || CsButtonVariant.danger || CsButtonVariant.dangerGhost => null,
  };
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
    this.variant,
    this.size = CsButtonSize.md,
    this.loading = false,
    this.disabled = false,
    this.fullWidth = true,
    this.icon,
    this.paddingX,
    this.paddingY,
  });

  final String title;
  final VoidCallback onPressed;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final CsButtonRole role;
  final CsButtonVariant? variant;
  final CsButtonSize size;
  final bool loading;
  final bool disabled;
  final bool fullWidth;
  final String? icon;
  final double? paddingX;
  final double? paddingY;

  @override
  State<CsButton> createState() => _CsButtonState();
}

class _CsButtonState extends State<CsButton> {
  final node = FocusNode();
  final focusId = csOverlayFreshId('button');
  bool hovered = false;
  bool focused = false;

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
    final reducedMotion = MediaQuery.maybeOf(context)?.disableAnimations ?? false;
    final activeVariant = widget.variant ??
        (widget.role == CsButtonRole.primary ? CsButtonVariant.primary : CsButtonVariant.danger);
    final isOff = csButtonIsDisabled(widget.disabled, widget.loading);
    final fillSpec = csButtonBackgroundColor(activeVariant, pack, hovered: hovered);
    final fill = fillSpec != null ? csColor(fillSpec) : Colors.transparent;
    final ink = csColor(csButtonForegroundColor(activeVariant, pack, dark: widget.dark));
    final strokeSpec = csButtonBorderColor(activeVariant, pack, dark: widget.dark, hovered: hovered);
    final liftY = csInteractionButtonTranslateY(hovered: hovered, disabled: isOff, reducedMotion: reducedMotion);
    final haloWidth = csInteractionFocusHaloWidth(focused);
    final fontPts = csButtonFontSize(widget.size, pack);
    return Opacity(
      opacity: csButtonOpacity(widget.disabled, widget.loading),
      child: MouseRegion(
        onEnter: (_) => setState(() => hovered = true),
        onExit: (_) => setState(() => hovered = false),
        child: Transform.translate(
          offset: Offset(0, liftY),
          child: DecoratedBox(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(csButtonRadius(pack)),
              boxShadow: [
                if (haloWidth > 0)
                  BoxShadow(
                    color: csColor(pack.colorAccentOchre),
                    spreadRadius: haloWidth,
                  ),
                if (csInteractionShowsButtonHoverShadow(hovered: hovered, disabled: isOff))
                  BoxShadow(
                    color: const Color.fromARGB(255, csInteractionHoverShadowRed, csInteractionHoverShadowGreen, csInteractionHoverShadowBlue).withValues(alpha: csInteractionHoverShadowAlpha),
                    blurRadius: csInteractionHoverShadowBlur(),
                    offset: Offset(0, csInteractionHoverShadowOffsetY()),
                  ),
              ],
            ),
            child: FilledButton(
              focusNode: node,
              style: FilledButton.styleFrom(
                padding: EdgeInsets.symmetric(
                  horizontal: widget.paddingX ?? csButtonPaddingX(widget.size, pack),
                  vertical: widget.paddingY ?? csButtonPaddingY(widget.size, pack),
                ),
                minimumSize: Size(
                  csButtonMinWidth(widget.size, pack),
                  csButtonMinHeight(widget.size, pack),
                ),
                backgroundColor: fill,
                foregroundColor: ink,
                side: strokeSpec != null
                    ? BorderSide(color: csColor(strokeSpec), width: csButtonBorderWidth())
                    : BorderSide.none,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(csButtonRadius(pack)),
                ),
              ),
              onPressed: isOff
                  ? null
                  : () {
                      _claim();
                      widget.onPressed();
                    },
              onFocusChange: (nextFocused) {
                setState(() => focused = nextFocused);
                if (nextFocused) _claim();
              },
              child: Row(
                mainAxisSize: widget.fullWidth ? MainAxisSize.max : MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (csButtonShowsIcon(widget.icon)) ...[
                    ExcludeSemantics(
                      child: CsIcon(
                        name: widget.icon ?? '',
                        label: '',
                        dark: widget.dark,
                        highContrast: widget.highContrast,
                        compact: widget.compact,
                      ),
                    ),
                    SizedBox(width: csButtonGap(pack)),
                  ],
                  Text(
                    widget.title,
                    style: TextStyle(
                      fontSize: fontPts,
                      fontWeight: FontWeight.w700,
                      color: ink,
                    ),
                  ),
                  if (widget.loading) ...[
                    SizedBox(width: csButtonGap(pack)),
                    ExcludeSemantics(
                      child: Container(
                        width: fontPts,
                        height: fontPts,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: ink,
                            width: csButtonSpinnerBorderWidth(),
                          ),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
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

const double csTextFieldPlaceholderOpacity = 0.7;
const double csTextFieldDisabledOpacity = 0.58;
bool csTextFieldAlert(String? error) => error != null && error.isNotEmpty;
bool csTextFieldShowsDescription(String? description) => description != null && description.isNotEmpty;
double csTextFieldGap() => 6;
int csTextFieldLabelFontWeight() => 700;
double csTextFieldDescriptionFontSize() => 14;
double csTextFieldErrorFontSize() => 14;
double csTextFieldBorderWidth() => 1;
double csTextFieldRadius(CSTokenModePack pack) => csPoints(pack.radiusMd);
double csTextFieldMinHeight(CSTokenModePack pack) => csPoints(pack.componentTextfieldMinHeight);
double csTextFieldPaddingY(CSTokenModePack pack) => csPoints(pack.componentTextfieldPaddingY);
double csTextFieldPaddingX(CSTokenModePack pack) => csPoints(pack.componentTextfieldPaddingX);
double csTextFieldOpacity(bool disabled) => disabled ? csTextFieldDisabledOpacity : 1.0;
CSColorValue csTextFieldBorderColor(bool invalid, CSTokenModePack pack) =>
    invalid ? pack.colorSemanticDanger : pack.componentTextfieldBorderDefault;

class CsTextField extends StatelessWidget {
  const CsTextField({
    super.key,
    required this.label,
    required this.controller,
    required this.dark,
    required this.highContrast,
    required this.compact,
    this.secure = false,
    this.disabled = false,
    this.description,
    this.error,
  });

  final String label;
  final TextEditingController controller;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final bool secure;
  final bool disabled;
  final String? description;
  final String? error;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: dark,
      highContrast: highContrast,
      compact: compact,
    );
    final invalid = csTextFieldAlert(error);
    final borderStroke = csColor(csTextFieldBorderColor(invalid, pack));
    final field = CsOwnFocus(builder: (node, claim) => TextField(
      focusNode: node,
      controller: controller,
      enabled: !disabled,
      obscureText: secure,
      decoration: InputDecoration(
        labelText: label,
        contentPadding: EdgeInsets.symmetric(
          horizontal: csTextFieldPaddingX(pack),
          vertical: csTextFieldPaddingY(pack),
        ),
        constraints: BoxConstraints(minHeight: csTextFieldMinHeight(pack)),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(csTextFieldRadius(pack)),
          borderSide: BorderSide(color: borderStroke, width: csTextFieldBorderWidth()),
        ),
      ),
      onChanged: (_) => claim(),
    ));
    return Opacity(
      opacity: csTextFieldOpacity(disabled),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (csTextFieldShowsDescription(description)) ...[
            Text(
              description!,
              style: TextStyle(
                fontSize: csTextFieldDescriptionFontSize(),
                color: csColor(pack.colorTextMuted),
              ),
            ),
            SizedBox(height: csTextFieldGap()),
          ],
          field,
          if (invalid) ...[
            SizedBox(height: csTextFieldGap()),
            Semantics(
              liveRegion: true,
              child: Text(
                error!,
                style: TextStyle(
                  fontSize: csTextFieldErrorFontSize(),
                  color: csColor(pack.colorSemanticDangerText),
                ),
              ),
            ),
          ],
        ],
      ),
    );
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
const String csBadgeSolidInkHex = '#ffffff';
double csBadgeGap() => 5;
int csBadgeFontWeight() => 700;
const double csBadgeLineHeight = 1.0;
double csBadgePaddingY() => 4;
double csBadgePaddingX() => 9;
double csBadgeBorderWidth() => 1;
double csBadgeDotSize() => 7;
bool csBadgeIsUppercase() => true;
String? csBadgeToneClass(String name) => name == 'neutral' ? null : name;
String csBadgeSpoken(String label) => label;

const double csFeedbackStyleTagCloseHoverUmberAlpha = 0.12;
const double csFeedbackStyleSpinnerLightTrackAlpha = 0.22;
const double csFeedbackStyleSpinnerDarkTrackAlpha = 0.26;
const double csFeedbackStyleSkeletonMidStopRaisedPortion = 0.55;
double csFeedbackStyleTagGap() => 6;
double csFeedbackStyleTagFontSize(CSTokenModePack pack) => csPoints(pack.fontSizeSm);
int csFeedbackStyleTagFontWeight() => 600;
double csFeedbackStyleTagPaddingY() => 5;
double csFeedbackStyleTagPaddingX() => 10;
double csFeedbackStyleTagBorderWidth() => 1;
double csFeedbackStyleTagCloseSize() => 18;
double csFeedbackStyleAlertGap() => 12;
double csFeedbackStyleAlertPaddingY() => 14;
double csFeedbackStyleAlertPaddingX() => 16;
double csFeedbackStyleAlertBorderWidth() => 1;
double csFeedbackStyleAlertAccentBorderWidth() => 4;
double csFeedbackStyleAlertIconPaddingTop() => 1;
int csFeedbackStyleAlertTitleFontWeight() => 700;
double csFeedbackStyleAlertTitleMarginBottom() => 2;
double csFeedbackStyleAlertBodyFontSize(CSTokenModePack pack) => csPoints(pack.fontSizeSm);
double csFeedbackStyleAlertDismissFontSize(CSTokenModePack pack) => csPoints(pack.fontSizeMd);
double csFeedbackStyleAlertDismissPaddingX() => 2;
double csFeedbackStyleAlertDismissFocusOutlineWidth(bool focused) => focused ? 2 : 0;
double csFeedbackStyleAlertDismissFocusHaloSpread(bool focused) => focused ? 5 : 0;
double csFeedbackStyleToastStackInset() => 20;
double csFeedbackStyleToastStackGap() => 10;
double csFeedbackStyleToastStackMaxWidth(double viewportWidth) =>
    math.max(0.0, math.min(380.0, viewportWidth - 40.0));
double csFeedbackStyleToastGap() => 12;
double csFeedbackStyleToastPaddingY() => 12;
double csFeedbackStyleToastPaddingX() => 14;
double csFeedbackStyleToastBorderWidth() => 1;
double csFeedbackStyleToastAccentBorderWidth() => 4;
int csFeedbackStyleToastTitleFontWeight() => 700;
double csFeedbackStyleToastTitleFontSize(CSTokenModePack pack) => csPoints(pack.fontSizeSm);
double csFeedbackStyleToastBodyFontSize(CSTokenModePack pack) => csPoints(pack.fontSizeSm);
double csFeedbackStyleToastBodyMarginTop() => 2;
double csFeedbackStyleToastEntranceTranslateY({bool reducedMotion = false}) => reducedMotion ? 0 : 8;
double csFeedbackStyleSpinnerSize() => 20;
double csFeedbackStyleSpinnerBorderWidth() => 2.5;
double csFeedbackStyleSpinnerTrackAlpha({required bool dark}) =>
    dark ? csFeedbackStyleSpinnerDarkTrackAlpha : csFeedbackStyleSpinnerLightTrackAlpha;
double csFeedbackStyleSpinnerDurationMs() => 620;
double csFeedbackStyleProgressHeight() => 10;
double csFeedbackStyleProgressDurationMs(CSTokenModePack pack) => pack.durationSlow.value;
double csFeedbackStyleSkeletonDurationMs() => 1400;
const double csFeedbackStyleSkeletonTextHeightEm = 0.75;
const double csFeedbackStyleSkeletonTextMarginBlockEm = 0.25;
const csSwitchLabel = 'Setting';
const double csSwitchDisabledOpacity = 0.55;
double csSwitchGap() => 10;
double csSwitchTrackWidth() => 44;
double csSwitchTrackHeight() => 26;
double csSwitchTrackRadius() => 999;
double csSwitchKnobSize() => 20;
double csSwitchKnobInset() => 3;
double csSwitchKnobCheckedTranslateX() => 18;
double csSwitchOpacity(bool disabled) => disabled ? csSwitchDisabledOpacity : 1.0;
CSColorValue csSwitchTrackColor(bool checked, bool dark, CSTokenModePack pack) =>
    checked ? (dark ? pack.colorBrandOchre : pack.colorBrandUmber) : pack.colorBorderDefault;
double csSwitchFocusOutlineWidth(bool focused) => focused ? 2 : 0;
double csSwitchFocusHaloSpread(bool focused) => focused ? 5 : 0;
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
    const solidWhite = CSColorValue(colorSpace: 'srgb', components: [1.0, 1.0, 1.0], alpha: 1.0);
    final ink = switch (tone) {
      'solid' => solidWhite,
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
        border: tone == 'neutral' ? Border.all(color: csColor(pack.colorBorderDefault), width: csBadgeBorderWidth()) : null,
      ),
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: csBadgePaddingX(), vertical: csBadgePaddingY()),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          if (dot) ...[
            ExcludeSemantics(child: Container(width: csBadgeDotSize(), height: csBadgeDotSize(), decoration: BoxDecoration(color: csColor(ink), shape: BoxShape.circle))),
            SizedBox(width: csBadgeGap()),
          ],
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

double csSelectControlPaddingInlineEnd() => 38;
double csSelectChevronInsetInlineEnd() => 12;
double csSelectFocusOutlineWidth(bool focused) => focused ? 2 : 0;
double csSelectFocusOutlineOffset(bool focused) => focused ? 2 : 0;
double csSelectFocusHaloSpread(bool focused) => focused ? 5 : 0;
double csSelectNativeSelectMinHeight([String size = 'md']) => size == 'sm' ? 36 : 44;
double csSelectNativeSelectPaddingY(CSTokenModePack pack, {String size = 'md'}) =>
    size == 'sm' ? 6 : csPoints(pack.componentTextfieldPaddingY);
double csSelectNativeSelectFontSize(CSTokenModePack pack, {String size = 'md'}) =>
    csPoints(size == 'sm' ? pack.fontSizeSm : pack.fontSizeBase);

const double csFormsStyleCheckRadioDisabledOpacity = 0.55;
double csFormsStyleCheckRadioGap() => 10;
const double csFormsStyleCheckRadioLineHeight = 1.4;
double csFormsStyleCheckRadioBoxSize() => 20;
double csFormsStyleCheckRadioOpacity(bool disabled) =>
    disabled ? csFormsStyleCheckRadioDisabledOpacity : 1.0;
CSColorValue csFormsStyleCheckRadioAccentColor(bool dark, CSTokenModePack pack) =>
    dark ? pack.colorBrandOchre : pack.colorBrandUmber;
double csFormsStyleCheckRadioTextGap() => 2;
double csFormsStyleCheckRadioDescriptionFontSize(CSTokenModePack pack) => csPoints(pack.fontSizeSm);
double csFormsStyleRadioGroupGap() => 10;
int csFormsStyleRadioGroupLegendFontWeight() => 700;
double csFormsStyleRadioGroupLegendMarginBottom() => 6;
double csFormsStyleTextareaMinHeight() => 96;
String csFormsStyleTextareaResize() => 'vertical';
double csFormsStyleTextareaLineHeight(CSTokenModePack pack) => pack.fontLineHeightBody;

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
    this.material,
  });

  final Widget child;
  final bool dark;
  final bool highContrast;
  final bool compact;
  final EdgeInsetsGeometry padding;
  final CsGlassMaterial? material;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: dark,
      highContrast: highContrast,
      compact: compact,
    );
    final activeMaterial = material ?? CsGlassMaterial.solid;
    final baseColor = switch (csGlassSurfaceBase(activeMaterial)) {
      CsGlassSurfaceBase.page => csColor(pack.colorSurfacePage),
      CsGlassSurfaceBase.panel => csColor(pack.colorSurfacePanel),
      CsGlassSurfaceBase.raised => csColor(pack.colorSurfaceRaised),
    };
    final fillAlpha = csGlassOpacity(activeMaterial, pack);
    final borderAlpha = csGlassBorderMix(activeMaterial);
    final strokeWidth = csGlassBorderWidth(activeMaterial);
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: baseColor.withValues(alpha: fillAlpha),
        borderRadius: BorderRadius.circular(csPoints(pack.radiusLg)),
        border: strokeWidth > 0
            ? Border.all(color: csColor(pack.colorBorderDefault).withValues(alpha: borderAlpha), width: strokeWidth)
            : null,
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
        child: ConstrainedBox(
          constraints: BoxConstraints(
            minWidth: csA11yTouchTargetMinSize(coarse: true),
            minHeight: csA11yTouchTargetMinSize(coarse: true),
          ),
          child: Opacity(
            opacity: csSwitchOpacity(disabled),
            child: SwitchListTile(
              title: csSwitchShowsLabel(title) ? ExcludeSemantics(child: Text(title, style: TextStyle(color: csColor(pack.colorTextPrimary)))) : null,
              value: value,
              activeColor: csColor(csSwitchTrackColor(true, dark, pack)),
              onChanged: disabled ? null : (next) {
                claim();
                onChanged(next);
              },
            ),
          ),
        ),
      ),
    ));
  }
}

const csDialogClose = 'Close';
const csDialogMaxRem = 42.0;
const csDialogAlertMaxRem = 28.0;
const int csDialogOverlayRed = 31;
const int csDialogOverlayGreen = 19;
const int csDialogOverlayBlue = 11;
const double csDialogOverlayAlpha = 0.42;
const int csDialogPanelZIndex = 2;
double csDialogMaxWidth([double root = 16]) => csDialogMaxRem * root;
double csDialogAlertMaxWidth([double root = 16]) => csDialogAlertMaxRem * root;
double csDialogTopOffsetRatio({bool narrow = false}) => narrow ? 0.04 : 0.12;
double csDialogSafeTop(double viewportHeight, {bool narrow = false, double safeInsetTop = 0}) =>
    math.max(viewportHeight * csDialogTopOffsetRatio(narrow: narrow), safeInsetTop);
double csDialogMaxInlineSize(
  double viewportWidth, {
  bool alert = false,
  double safeInsetLeft = 0,
  double safeInsetRight = 0,
}) {
  final narrow = viewportWidth <= 640;
  final margin = narrow ? 16.0 : 32.0;
  final available = math.max(0.0, viewportWidth - margin - safeInsetLeft - safeInsetRight);
  if (narrow && !alert) return available;
  return math.min(alert ? csDialogAlertMaxWidth() : csDialogMaxWidth(), available);
}
double csDialogMaxBlockSize(
  double viewportHeight, {
  bool narrow = false,
  double safeInsetTop = 0,
  double safeInsetBottom = 0,
}) {
  final top = csDialogSafeTop(viewportHeight, narrow: narrow, safeInsetTop: safeInsetTop);
  return math.max(
    0.0,
    math.min(0.8 * viewportHeight, math.min(viewportHeight - 64.0, viewportHeight - top - safeInsetBottom - 16.0)),
  );
}
double csDialogPadding(CSTokenModePack pack, {bool narrow = false}) =>
    csPoints(narrow ? pack.space4 : pack.space6);
double csDialogHeaderGap() => 12;
double csDialogTitleFontSize() => 20;
double csDialogTitleLineHeight() => 1.35;
double csDialogBodyMarginY() => 16;
bool csDialogActionsButtonsExpand(bool narrow) => narrow;
CSColorValue csDialogDestructiveTitleColor(bool destructive, CSTokenModePack pack) =>
    destructive ? pack.colorSemanticDangerText : pack.colorTextPrimary;
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

const double csTableStyleCellBorderAlpha = 0.18;
double csTableStyleStatusPaddingY(CSTokenModePack pack) => csPoints(pack.space4);
double csTableStyleCellBorderWidth() => 1;
double csTableStyleCellPaddingY() => 10;
double csTableStyleCellPaddingX() => 12;
double csTableStyleHeaderFontSize(CSTokenModePack pack) => csPoints(pack.fontSizeXs);
const double csTableStyleHeaderLetterSpacingEm = 0.08;
bool csTableStyleHeaderUppercase() => true;
int csTableStyleCaptionFontWeight() => 700;
double csTableStyleCaptionMarginBottom() => 8;

const double csDisclosureStylePanelBorderAlpha = 0.18;
double csDisclosureStyleBadgeRadius() => 999;
double csDisclosureStyleBadgeFontSize() => 14;
int csDisclosureStyleBadgeFontWeight() => 700;
double csDisclosureStyleBadgePaddingY() => 4;
double csDisclosureStyleBadgePaddingX() => 10;
double csDisclosureStylePanelBorderWidth() => 1;
double csDisclosureStylePanelGap() => 6;
double csDisclosureStylePanelTopOffset() => 6;
double csDisclosureStylePanelMinWidth() => 288;
double csDisclosureStylePanelPadding() => 12;
double csDisclosureStylePanelDepth(CSTokenModePack pack) => pack.depthDropdown;
double csDisclosureStyleSourcesFontSize() => 13;

const double csReviewGateStyleWarningMixPortion = 0.05;
double csReviewGateStyleBorderWidth() => 1;
double csReviewGateStyleGap() => 12;
double csReviewGateStylePadding(CSTokenModePack pack) => csPoints(pack.space4);
int csReviewGateStyleRiskFontWeight() => 700;
const double csReviewGateStyleRiskLetterSpacingEm = 0.04;
double csReviewGateStyleRiskFontSize() => 13;
bool csReviewGateStyleRiskUppercase() => true;
double csReviewGateStyleReviewerFontSize() => 14;

bool csLogoStyleAutoBlockSize() => true;
String csLogoStyleVerticalAlign() => 'middle';
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

const double csResetTextSizeAdjustPercent = 100.0;
double csResetScrollPaddingBlockStart(CSTokenModePack pack) => csPoints(pack.scrollPaddingBlockStart);
double csResetScrollPaddingBlockEnd(CSTokenModePack pack) => csPoints(pack.scrollPaddingBlockEnd);
double csResetBodyMargin() => 0;
double csResetBodyFontSize(CSTokenModePack pack) => csPoints(pack.fontSizeBase);
double csResetBodyLineHeight(CSTokenModePack pack) => pack.fontLineHeightBody;
double csResetHeadingLineHeight(CSTokenModePack pack) => pack.fontLineHeightHeading;
String csResetHeadingTextWrap() => 'balance';
String csResetParagraphTextWrap() => 'pretty';
double csResetFocusOutlineWidth() => 2;
double csResetFocusOutlineOffset() => 2;
double csResetFocusHaloSpread() => 5;
double csResetFocusDropShadowRadius() => 2;
double csResetSkipUnfocusedLeft() => -999;
double csResetSkipUnfocusedSize() => 1;
int csResetSkipFontWeight() => 700;
double csResetSkipFocusedOffset() => 12;
double csResetSkipFocusedDepth(CSTokenModePack pack) => pack.depthToast + 1;
double csResetSkipFocusedPaddingY() => 10;
double csResetSkipFocusedPaddingX() => 14;
double csResetSkipFocusedBorderWidth() => 2;
double csResetSkipFocusedHaloSpread() => 5;

class CsSkipLink extends StatefulWidget {
  const CsSkipLink({
    super.key,
    required this.label,
    required this.onPressed,
    this.dark = false,
    this.highContrast = false,
    this.compact = false,
  });

  final String label;
  final VoidCallback onPressed;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  State<CsSkipLink> createState() => _CsSkipLinkState();
}

class _CsSkipLinkState extends State<CsSkipLink> {
  bool focused = false;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(
      dark: widget.dark,
      highContrast: widget.highContrast,
      compact: widget.compact,
    );
    final radius = BorderRadius.circular(csPoints(pack.radiusMd));
    return Focus(
      onFocusChange: (next) => setState(() => focused = next),
      child: GestureDetector(
        onTap: widget.onPressed,
        child: SizedBox(
          width: focused ? null : csResetSkipUnfocusedSize(),
          height: focused ? null : csResetSkipUnfocusedSize(),
          child: Container(
            padding: EdgeInsets.symmetric(
              horizontal: csResetSkipFocusedPaddingX(),
              vertical: csResetSkipFocusedPaddingY(),
            ),
            decoration: BoxDecoration(
              color: csColor(pack.colorSurfacePanel),
              borderRadius: radius,
              border: Border.all(
                color: csColor(pack.colorBrandOchre),
                width: csResetSkipFocusedBorderWidth(),
              ),
              boxShadow: focused
                  ? [
                      BoxShadow(
                        color: csColor(pack.colorAccentOchre),
                        spreadRadius: csResetSkipFocusedHaloSpread(),
                      ),
                    ]
                  : const [],
            ),
            child: Text(
              widget.label,
              style: TextStyle(
                fontSize: csResetBodyFontSize(pack),
                fontWeight: FontWeight.w700,
                color: csColor(pack.colorTextPrimary),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

enum CsTypographyRole {
  display('cs-display'),
  h1('cs-h1'),
  h2('cs-h2'),
  h3('cs-h3'),
  h4('cs-h4'),
  bodyLg('cs-body-lg'),
  body('cs-body'),
  secondary('cs-secondary'),
  caption('cs-caption'),
  eyebrow('cs-eyebrow'),
  mono('cs-mono');

  const CsTypographyRole(this.className);
  final String className;
}

const double csTypographyLetterSpacingTight = -0.01;
const double csTypographyLetterSpacingNormal = 0.0;
const double csTypographyLetterSpacingCaps = 0.08;
const double csTypographyHeadingTracking = -0.01;
const double csTypographyDisplayFaceMaxWeight = 700.0;

List<String> csTypographyFontFamily(CsTypographyRole role, CSTokenModePack pack, {bool displayFace = false}) {
  return switch (role) {
    CsTypographyRole.mono => pack.fontFamilyMono,
    CsTypographyRole.display || CsTypographyRole.h1 || CsTypographyRole.h2 || CsTypographyRole.h3 || CsTypographyRole.h4 =>
      displayFace ? pack.fontFamilyDisplay : pack.headingFamily,
    CsTypographyRole.bodyLg || CsTypographyRole.body || CsTypographyRole.secondary || CsTypographyRole.caption || CsTypographyRole.eyebrow =>
      pack.fontFamilyUi,
  };
}

double csTypographyFontSize(CsTypographyRole role, CSTokenModePack pack) {
  return switch (role) {
    CsTypographyRole.display => csPoints(pack.textDisplay),
    CsTypographyRole.h1 => csPoints(pack.textH1),
    CsTypographyRole.h2 => csPoints(pack.textH2),
    CsTypographyRole.h3 => csPoints(pack.textH3),
    CsTypographyRole.h4 => csPoints(pack.textH4),
    CsTypographyRole.bodyLg => csPoints(pack.textBodyLg),
    CsTypographyRole.body || CsTypographyRole.mono => csPoints(pack.textBody),
    CsTypographyRole.secondary => csPoints(pack.textSecondary),
    CsTypographyRole.caption => csPoints(pack.textCaption),
    CsTypographyRole.eyebrow => csPoints(pack.textEyebrow),
  };
}

double csTypographyLineHeight(CsTypographyRole role, CSTokenModePack pack) {
  return switch (role) {
    CsTypographyRole.display => pack.fontLineHeightTight,
    CsTypographyRole.h1 || CsTypographyRole.h2 || CsTypographyRole.h3 || CsTypographyRole.h4 => pack.fontLineHeightHeading,
    CsTypographyRole.bodyLg || CsTypographyRole.body || CsTypographyRole.secondary || CsTypographyRole.caption || CsTypographyRole.eyebrow || CsTypographyRole.mono =>
      pack.fontLineHeightBody,
  };
}

double csTypographyFontWeight(CsTypographyRole role, CSTokenModePack pack, {bool displayFace = false}) {
  return switch (role) {
    CsTypographyRole.display || CsTypographyRole.h1 =>
      displayFace ? math.min(csTypographyDisplayFaceMaxWeight, pack.headingWeightStrong) : pack.headingWeightStrong,
    CsTypographyRole.h2 || CsTypographyRole.h3 => pack.headingWeight,
    CsTypographyRole.h4 => pack.fontWeightSemibold,
    CsTypographyRole.eyebrow => pack.fontWeightBold,
    CsTypographyRole.bodyLg || CsTypographyRole.body || CsTypographyRole.secondary || CsTypographyRole.caption || CsTypographyRole.mono =>
      pack.fontWeightRegular,
  };
}

double csTypographyLetterSpacingEm(CsTypographyRole role) {
  return switch (role) {
    CsTypographyRole.display || CsTypographyRole.h1 || CsTypographyRole.h2 => csTypographyHeadingTracking,
    CsTypographyRole.eyebrow => csTypographyLetterSpacingCaps,
    CsTypographyRole.h3 || CsTypographyRole.h4 || CsTypographyRole.bodyLg || CsTypographyRole.body || CsTypographyRole.secondary || CsTypographyRole.caption || CsTypographyRole.mono =>
      csTypographyLetterSpacingNormal,
  };
}

String csTypographyTextWrap(CsTypographyRole role) {
  return switch (role) {
    CsTypographyRole.display || CsTypographyRole.h1 || CsTypographyRole.h2 => 'balance',
    CsTypographyRole.bodyLg || CsTypographyRole.body => 'pretty',
    CsTypographyRole.h3 || CsTypographyRole.h4 || CsTypographyRole.secondary || CsTypographyRole.caption || CsTypographyRole.eyebrow || CsTypographyRole.mono =>
      'normal',
  };
}

bool csTypographyIsUppercase(CsTypographyRole role) => role == CsTypographyRole.eyebrow;

CSColorValue csTypographyTextColor(CsTypographyRole role, CSTokenModePack pack) {
  return switch (role) {
    CsTypographyRole.secondary || CsTypographyRole.caption => pack.colorTextMuted,
    CsTypographyRole.eyebrow => pack.colorTextAccent,
    CsTypographyRole.display || CsTypographyRole.h1 || CsTypographyRole.h2 || CsTypographyRole.h3 || CsTypographyRole.h4 || CsTypographyRole.bodyLg || CsTypographyRole.body || CsTypographyRole.mono =>
      pack.colorTextPrimary,
  };
}
