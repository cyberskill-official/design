import 'package:flutter/material.dart';
import '../tokens/cs_tokens.dart';
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
                        TextButton(
                          onPressed: () =>
                              Navigator.of(context).pushNamed('/settings'),
                          child: Text(
                            sampleTheme.text(SampleText.settings),
                            style: TextStyle(color: colors.colorLink),
                          ),
                        ),
                      ],
                    ),
                    Text(
                      sampleTheme.text(SampleText.listDescription),
                      style:
                          TextStyle(fontSize: 13, color: colors.colorTextMuted),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      decoration: BoxDecoration(
                        color: colors.colorSurfacePanel,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: colors.colorBorderDefault),
                      ),
                      child: Column(
                        children: [
                          for (final w in _wishKeys)
                            ListTile(
                              title: Text(
                                sampleTheme.text(w.$1),
                                style: TextStyle(
                                  color: colors.colorTextPrimary,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              subtitle: Text(
                                sampleTheme.text(w.$2),
                                style: TextStyle(color: colors.colorTextMuted),
                              ),
                              trailing: Container(
                                width: 10,
                                height: 10,
                                decoration: BoxDecoration(
                                  color: CSTokens.colorBrandOchre,
                                  shape: BoxShape.circle,
                                ),
                              ),
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
                  child: TextButton(
                    onPressed: () =>
                        Navigator.of(context).pushReplacementNamed('/sign-in'),
                    child: Text(
                      sampleTheme.text(SampleText.signOut),
                      style: TextStyle(color: colors.colorSemanticDanger),
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
}
