import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/sign_in_screen.dart';
import 'tokens/cs_tokens.dart';
import 'sample_theme.dart';

/// Multi-screen Flutter sample: SignIn → Home → Settings.
/// Colours from generated [CSTokens] (synced from tokens/native/cs_tokens.dart).
void main() {
  runApp(const CyberSkillSampleApp());
}

class CyberSkillSampleApp extends StatefulWidget {
  const CyberSkillSampleApp({super.key});

  @override
  State<CyberSkillSampleApp> createState() => _CyberSkillSampleAppState();
}

class _CyberSkillSampleAppState extends State<CyberSkillSampleApp> {
  bool dark = false;

  ThemeData theme(bool isDark) {
    final colors = SampleColors(isDark);
    final scheme = isDark
        ? ColorScheme.dark(primary: colors.componentButtonPrimaryBg, onPrimary: colors.componentButtonPrimaryFg, secondary: CSTokens.colorBrandOchre, surface: colors.colorSurfacePanel, onSurface: colors.colorTextPrimary, error: colors.colorSemanticDanger, onError: colors.colorSemanticDangerFg)
        : ColorScheme.light(primary: colors.componentButtonPrimaryBg, onPrimary: colors.componentButtonPrimaryFg, secondary: CSTokens.colorBrandOchre, surface: colors.colorSurfacePanel, onSurface: colors.colorTextPrimary, error: colors.colorSemanticDanger, onError: colors.colorSemanticDangerFg);
    return ThemeData(colorScheme: scheme, scaffoldBackgroundColor: colors.colorSurfacePage, useMaterial3: true);
  }

  @override
  Widget build(BuildContext context) {
    return SampleTheme(
      dark: dark,
      onDarkChanged: (value) => setState(() => dark = value),
      child: MaterialApp(
        title: 'CyberSkill Sample',
        debugShowCheckedModeBanner: false,
        theme: theme(false),
        darkTheme: theme(true),
        themeMode: dark ? ThemeMode.dark : ThemeMode.light,
        initialRoute: '/sign-in',
        routes: {
          '/sign-in': (_) => const SignInScreen(),
          '/home': (_) => const HomeScreen(),
          '/settings': (_) => const SettingsScreen(),
        },
      ),
    );
  }
}
