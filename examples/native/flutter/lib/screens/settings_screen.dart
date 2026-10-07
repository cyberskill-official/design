import 'package:flutter/material.dart';
import '../tokens/cs_tokens.dart';
import '../sample_theme.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool compact = false;

  double get controlGap => compact ? CSTokens.densityControlGapCompact : CSTokens.densityControlGapComfortable;
  double get buttonPaddingX => compact ? CSTokens.componentButtonMdPaddingXCompact : CSTokens.componentButtonMdPaddingXComfortable;
  double get buttonPaddingY => compact ? CSTokens.componentButtonMdPaddingYCompact : CSTokens.componentButtonMdPaddingYComfortable;

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
                          '← Back',
                          style: TextStyle(color: colors.colorLink),
                        ),
                      ),
                    ),
                    Text(
                      'Settings',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: colors.colorTextPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Third screen — brand swatches from CSTokens.',
                      style: TextStyle(fontSize: 13, color: colors.colorTextMuted),
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
                              'Prefer dark theme',
                              style: TextStyle(color: colors.colorTextPrimary),
                            ),
                            value: sampleTheme.dark,
                            activeColor: CSTokens.colorBrandOchre,
                            onChanged: sampleTheme.onDarkChanged,
                          ),
                          SwitchListTile(
                            title: const Text('Compact spacing'),
                            value: compact,
                            onChanged: (v) => setState(() => compact = v),
                          ),
                          Text(compact ? 'Compact' : 'Comfortable'),
                          SizedBox(height: controlGap),
                          _swatch('Brand umber', CSTokens.colorBrandUmber),
                          SizedBox(height: controlGap),
                          _swatch('Brand ochre', CSTokens.colorBrandOchre),
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
  constraints: const BoxConstraints(minHeight: CSTokens.componentButtonMdMinHeight),
  child: FilledButton(
    style: FilledButton.styleFrom(
      padding: EdgeInsets.symmetric(horizontal: buttonPaddingX, vertical: buttonPaddingY),
      backgroundColor: colors.colorSemanticDanger,
      foregroundColor: colors.colorTextInverse,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(
          CSTokens.componentButtonRadius,
        ),
      ),
    ),
    onPressed: () =>
        Navigator.of(context).pushReplacementNamed('/sign-in'),
    child: const Text('Sign out'),
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
