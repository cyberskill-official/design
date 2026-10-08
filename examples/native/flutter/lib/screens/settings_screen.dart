import 'package:flutter/material.dart';
import '../tokens/cs_tokens.dart';
import '../sample_theme.dart';
import '../sample_language.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool compact = false;

  double get controlGap => compact
      ? CSTokens.densityControlGapCompact
      : CSTokens.densityControlGapComfortable;
  double get buttonPaddingX => compact
      ? CSTokens.componentButtonMdPaddingXCompact
      : CSTokens.componentButtonMdPaddingXComfortable;
  double get buttonPaddingY => compact
      ? CSTokens.componentButtonMdPaddingYCompact
      : CSTokens.componentButtonMdPaddingYComfortable;

  @override
  Widget build(BuildContext context) {
    final sampleTheme = SampleTheme.of(context);
    final colors = sampleTheme.colors;
    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
              sliver: SliverToBoxAdapter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: TextButton(
                        onPressed: () => Navigator.of(context).pop(),
                        child: Text(
                          sampleTheme.text(SampleText.back),
                          style: TextStyle(color: colors.colorLink),
                        ),
                      ),
                    ),
                    Text(
                      sampleTheme.text(SampleText.settings),
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: colors.colorTextPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      sampleTheme.text(SampleText.settingsDescription),
                      style:
                          TextStyle(fontSize: 13, color: colors.colorTextMuted),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: colors.colorSurfacePanel,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: colors.colorBorderDefault),
                      ),
                      child: Column(
                        children: [
                          SwitchListTile(
                            title: Text(
                              sampleTheme.text(SampleText.preferDark),
                              style: TextStyle(color: colors.colorTextPrimary),
                            ),
                            value: sampleTheme.dark,
                            activeColor: CSTokens.colorBrandOchre,
                            onChanged: sampleTheme.onDarkChanged,
                          ),
                          SwitchListTile(
                            title: Text(
                                sampleTheme.text(SampleText.compactSpacing)),
                            value: compact,
                            onChanged: (v) => setState(() => compact = v),
                          ),
                          DropdownButtonFormField<SampleLanguage>(
                            value: sampleTheme.language,
                            isExpanded: true,
                            isDense: false,
                            itemHeight: null,
                            decoration: InputDecoration(
                                labelText:
                                    sampleTheme.text(SampleText.language)),
                            items: const [
                              DropdownMenuItem(
                                  value: SampleLanguage.vi,
                                  child: Text('Tiếng Việt')),
                              DropdownMenuItem(
                                  value: SampleLanguage.en,
                                  child: Text('English')),
                            ],
                            onChanged: (value) {
                              if (value != null)
                                sampleTheme.onLanguageChanged(value);
                            },
                          ),
                          Text(compact
                              ? sampleTheme.text(SampleText.compact)
                              : sampleTheme.text(SampleText.comfortable)),
                          SizedBox(height: controlGap),
                          _swatch(sampleTheme.text(SampleText.brandUmber),
                              CSTokens.colorBrandUmber),
                          SizedBox(height: controlGap),
                          _swatch(sampleTheme.text(SampleText.brandOchre),
                              CSTokens.colorBrandOchre),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SliverFillRemaining(
              hasScrollBody: false,
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: SizedBox(
                    width: double.infinity,
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(
                          minHeight: CSTokens.componentButtonMdMinHeight),
                      child: FilledButton(
                        style: FilledButton.styleFrom(
                          padding: EdgeInsets.symmetric(
                              horizontal: buttonPaddingX,
                              vertical: buttonPaddingY),
                          backgroundColor: colors.colorSemanticDanger,
                          foregroundColor: colors.colorTextInverse,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(
                              CSTokens.componentButtonRadius,
                            ),
                          ),
                        ),
                        onPressed: () => Navigator.of(context)
                            .pushReplacementNamed('/sign-in'),
                        child: Text(sampleTheme.text(SampleText.signOut)),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _swatch(String label, Color color) {
    final colors = SampleTheme.of(context).colors;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: TextStyle(color: colors.colorTextPrimary),
            ),
          ),
          Container(
            width: 36,
            height: 24,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(6),
            ),
          ),
        ],
      ),
    );
  }
}
