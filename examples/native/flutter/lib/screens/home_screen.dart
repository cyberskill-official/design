import 'package:cyberskill_design/controls.dart';
import 'package:flutter/material.dart';
import '../sample_theme.dart';
import '../sample_language.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const _wishKeys = [
    (SampleText.statusHub, SampleText.inBuild),
    (SampleText.laborContract, SampleText.open),
    (SampleText.investorUpdate, SampleText.done),
  ];

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
                    Row(
                      children: [
                        Expanded(
                            child: Text(
                          sampleTheme.text(SampleText.wishes),
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w800,
                            color: colors.colorTextPrimary,
                          ),
                        )),
                        const SizedBox(width: 8),
                        CsTextButton(
                          title: sampleTheme.text(SampleText.settings),
                          dark: sampleTheme.dark,
                          highContrast: sampleTheme.highContrast,
                          compact: false,
                          onPressed: () =>
                              Navigator.of(context).pushNamed('/settings'),
                        ),
                      ],
                    ),
                    Text(
                      sampleTheme.text(SampleText.listDescription),
                      style:
                          TextStyle(fontSize: 13, color: colors.colorTextMuted),
                    ),
                    const SizedBox(height: 16),
                    CsCard(
                      dark: sampleTheme.dark,
                      highContrast: sampleTheme.highContrast,
                      compact: false,
                      child: Column(
                        children: [
                          for (final w in _wishKeys)
                            CsListRow(
                              title: sampleTheme.text(w.$1),
                              subtitle: sampleTheme.text(w.$2),
                              dark: sampleTheme.dark,
                              highContrast: sampleTheme.highContrast,
                              compact: false,
                            ),
                            CsDivider(
                              dark: sampleTheme.dark,
                              highContrast: sampleTheme.highContrast,
                              compact: false,
                            ),
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
                  alignment: Alignment.bottomLeft,
                  child: CsTextButton(
                    title: sampleTheme.text(SampleText.signOut),
                    dark: sampleTheme.dark,
                    highContrast: sampleTheme.highContrast,
                    compact: false,
                    role: CsButtonRole.danger,
                    onPressed: () =>
                        Navigator.of(context).pushReplacementNamed('/sign-in'),
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
