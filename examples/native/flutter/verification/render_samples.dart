// Render evidence, not accepted golden baselines. Run with --update-goldens.
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cyberskill_sample/main.dart';
import 'package:cyberskill_sample/sample_theme.dart';
import 'package:cyberskill_sample/sample_language.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUpAll(() async {
    final loader = FontLoader('BeVietnamPro');
    for (final filename in ['Regular', 'Medium', 'SemiBold', 'ExtraBold']) {
      final font = File('assets/fonts/BeVietnamPro-$filename.ttf');
      loader.addFont(
          Future.value(ByteData.sublistView(await font.readAsBytes())));
    }
    await loader.load();
  });
  for (final language in SampleLanguage.values) {
    for (final size in [const Size(360, 800), const Size(800, 600)]) {
      for (final scale in [1.0, 1.5, 2.0]) {
        for (final dark in [false, true]) {
          for (final route in ['/sign-in', '/home', '/settings']) {
            for (final compact
                in route == '/settings' ? [false, true] : [false]) {
              final name =
                  '${language.name}-${size.width.toInt()}x${size.height.toInt()}-text$scale-${dark ? 'dark' : 'light'}-${route.substring(1)}-${compact ? 'compact' : 'comfortable'}';
              testWidgets(name, (tester) async {
                tester.view.physicalSize = size;
                tester.view.devicePixelRatio = 1;
                tester.platformDispatcher.textScaleFactorTestValue = scale;
                addTearDown(tester.view.resetPhysicalSize);
                addTearDown(tester.view.resetDevicePixelRatio);
                addTearDown(
                    tester.platformDispatcher.clearTextScaleFactorTestValue);
                await tester.pumpWidget(const CyberSkillSampleApp());
                await tester.pumpAndSettle();
                final context = tester.element(find.byType(Scaffold));
                SampleTheme.of(context).onLanguageChanged(language);
                if (dark) SampleTheme.of(context).onDarkChanged(true);
                if (route != '/sign-in') Navigator.of(context).pushNamed(route);
                await tester.pumpAndSettle();
                if (compact) {
                  await tester.tap(
                      find.text(SampleText.compactSpacing.value(language)));
                  await tester.pumpAndSettle();
                }
                // Paragraph layout bounds detect clipping. Font glyph boxes can overhang
                // an intentionally tight line box without being clipped by RenderParagraph.
                for (final element in find.byType(RichText).evaluate()) {
                  final paragraph = element.renderObject! as RenderParagraph;
                  final text = paragraph.text.toPlainText();
                  expect(paragraph.didExceedMaxLines, isFalse,
                      reason: '$name: truncated $text');
                  expect(paragraph.textSize.height,
                      lessThanOrEqualTo(paragraph.size.height + 1),
                      reason: '$name: constrained paragraph height: $text');
                  expect(paragraph.textSize.width,
                      lessThanOrEqualTo(paragraph.size.width + 1),
                      reason: '$name: constrained paragraph width: $text');
                }
                // Leave framework exceptions unconsumed so failures retain full render diagnostics.
                await expectLater(find.byType(MaterialApp),
                    matchesGoldenFile('rendered/$name.png'));
                if (route == '/settings' || route == '/home') {
                  final signOut = route == '/home'
                      ? find.widgetWithText(
                          TextButton, SampleText.signOut.value(language))
                      : find.widgetWithText(
                          FilledButton, SampleText.signOut.value(language));
                  await tester.scrollUntilVisible(signOut, 120,
                      scrollable: find.byType(Scrollable).first);
                  await tester.pumpAndSettle();
                  expect(signOut.hitTestable(), findsOneWidget);

                  await expectLater(find.byType(MaterialApp),
                      matchesGoldenFile('rendered/$name-end.png'));
                  await tester.tap(signOut);
                  await tester.pumpAndSettle();
                  expect(find.text(SampleText.password.value(language)),
                      findsOneWidget);
                }
              });
            }
          }
        }
      }
    }
  }
}
