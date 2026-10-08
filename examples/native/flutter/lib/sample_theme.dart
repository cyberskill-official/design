import 'package:flutter/material.dart';
import 'tokens/cs_tokens.dart';
import 'sample_language.dart';

class SampleColors {
  const SampleColors(this.dark);
  final bool dark;
  Color get colorSurfacePage =>
      dark ? CSTokens.colorSurfacePageDark : CSTokens.colorSurfacePage;
  Color get colorSurfacePanel =>
      dark ? CSTokens.colorSurfacePanelDark : CSTokens.colorSurfacePanel;
  Color get colorTextPrimary =>
      dark ? CSTokens.colorTextPrimaryDark : CSTokens.colorTextPrimary;
  Color get colorTextMuted =>
      dark ? CSTokens.colorTextMutedDark : CSTokens.colorTextMuted;
  Color get colorTextInverse =>
      dark ? CSTokens.colorTextInverseDark : CSTokens.colorTextInverse;
  Color get colorBorderDefault =>
      dark ? CSTokens.colorBorderDefaultDark : CSTokens.colorBorderDefault;
  Color get colorLink => dark ? CSTokens.colorLinkDark : CSTokens.colorLink;
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
      required super.child});
  final bool dark;
  final SampleLanguage language;
  final ValueChanged<SampleLanguage> onLanguageChanged;
  String text(SampleText key) => key.value(language);
  final ValueChanged<bool> onDarkChanged;
  SampleColors get colors => SampleColors(dark);
  static SampleTheme of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<SampleTheme>()!;
  @override
  bool updateShouldNotify(SampleTheme oldWidget) =>
      oldWidget.dark != dark || oldWidget.language != language;
}
