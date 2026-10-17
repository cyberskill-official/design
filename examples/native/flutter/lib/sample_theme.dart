import 'package:flutter/material.dart';
import 'tokens/cs_tokens.dart';
import 'sample_language.dart';

enum SampleContrast {
  system,
  standard,
  high;

  bool resolve(bool systemHigh) => this == high || this == system && systemHigh;
  SampleText get label => switch (this) {
        system => SampleText.contrastSystem,
        standard => SampleText.contrastStandard,
        high => SampleText.contrastHigh,
      };
}

class SampleColors {
  const SampleColors(this.dark, {this.highContrast = false});
  final bool dark;
  final bool highContrast;
  Color get colorSurfacePage =>
      dark ? CSTokens.colorSurfacePageDark : CSTokens.colorSurfacePage;
  Color get colorSurfacePanel =>
      dark ? CSTokens.colorSurfacePanelDark : CSTokens.colorSurfacePanel;
  Color get colorTextPrimary =>
      dark ? CSTokens.colorTextPrimaryDark : CSTokens.colorTextPrimary;
  Color get colorTextMuted => highContrast
      ? (dark
          ? CSTokens.colorTextMutedHighDark
          : CSTokens.colorTextMutedHighLight)
      : (dark ? CSTokens.colorTextMutedDark : CSTokens.colorTextMuted);
  Color get colorTextInverse =>
      dark ? CSTokens.colorTextInverseDark : CSTokens.colorTextInverse;
  Color get colorBorderDefault => highContrast
      ? (dark
          ? CSTokens.colorBorderDefaultHighDark
          : CSTokens.colorBorderDefaultHighLight)
      : (dark ? CSTokens.colorBorderDefaultDark : CSTokens.colorBorderDefault);
  Color get colorLink => dark ? CSTokens.colorLinkDark : CSTokens.colorLink;
  Color get colorSemanticDangerText =>
      dark ? CSTokens.colorSemanticDangerTextDark : CSTokens.colorSemanticDangerText;
  Color get colorSemanticDanger =>
      dark ? CSTokens.colorSemanticDangerDark : CSTokens.colorSemanticDanger;
  Color get colorSemanticDangerFg => dark
      ? CSTokens.colorSemanticDangerFgDark
      : CSTokens.colorSemanticDangerFg;
  Color get componentButtonPrimaryBg => dark
      ? CSTokens.componentButtonPrimaryBgDark
      : CSTokens.componentButtonPrimaryBg;
  Color get componentButtonPrimaryFg => dark
      ? CSTokens.componentButtonPrimaryFgDark
      : CSTokens.componentButtonPrimaryFg;
  Color get componentTextfieldBorderDefault => dark
      ? CSTokens.componentTextfieldBorderDefaultDark
      : CSTokens.componentTextfieldBorderDefault;
}

class SampleTheme extends InheritedWidget {
  const SampleTheme(
      {super.key,
      required this.dark,
      required this.onDarkChanged,
      required this.language,
      required this.onLanguageChanged,
      required this.contrast,
      required this.highContrast,
      required this.onContrastChanged,
      required super.child});
  final bool dark;
  final SampleContrast contrast;
  final bool highContrast;
  final ValueChanged<SampleContrast> onContrastChanged;
  final SampleLanguage language;
  final ValueChanged<SampleLanguage> onLanguageChanged;
  String text(SampleText key) => key.value(language);
  final ValueChanged<bool> onDarkChanged;
  SampleColors get colors => SampleColors(dark, highContrast: highContrast);
  static SampleTheme of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<SampleTheme>()!;
  @override
  bool updateShouldNotify(SampleTheme oldWidget) =>
      oldWidget.dark != dark ||
      oldWidget.language != language ||
      oldWidget.contrast != contrast ||
      oldWidget.highContrast != highContrast;
}
