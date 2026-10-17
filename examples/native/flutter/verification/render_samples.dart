// Render evidence, not accepted golden baselines. Run with --update-goldens.
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cyberskill_sample/main.dart';
import 'package:cyberskill_sample/sample_theme.dart';
import 'package:cyberskill_sample/sample_language.dart';
import 'package:cyberskill_sample/tokens/cs_tokens.dart';

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
    // Flutter test bindings do not load the declared Material icon font for us.
    final icons = FontLoader('MaterialIcons');
    icons.addFont(rootBundle.load('fonts/MaterialIcons-Regular.otf'));
    await icons.load();
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
  // Bounded contrast render evidence: OS requests more, explicit High applies
  // the delta and Standard opts out at enlarged text in both sample languages.
  for (final language in SampleLanguage.values) {
    for (final size in [const Size(360, 800), const Size(800, 600)]) {
      for (final dark in [false, true]) {
        for (final contrast in [SampleContrast.high, SampleContrast.standard]) {
          final name =
              'contrast-${contrast.name}-${language.name}-${size.width.toInt()}x${size.height.toInt()}-text2-${dark ? 'dark' : 'light'}';
          testWidgets(name, (tester) async {
            tester.view.physicalSize = size;
            tester.view.devicePixelRatio = 1;
            tester.platformDispatcher.textScaleFactorTestValue = 2;
            tester.platformDispatcher.accessibilityFeaturesTestValue =
                const FakeAccessibilityFeatures(highContrast: true);
            addTearDown(tester.view.resetPhysicalSize);
            addTearDown(tester.view.resetDevicePixelRatio);
            addTearDown(
                tester.platformDispatcher.clearTextScaleFactorTestValue);
            addTearDown(
                tester.platformDispatcher.clearAccessibilityFeaturesTestValue);
            await tester.pumpWidget(const CyberSkillSampleApp());
            await tester.pumpAndSettle();
            final preferences =
                SampleTheme.of(tester.element(find.byType(Scaffold)));
            preferences.onLanguageChanged(language);
            preferences.onDarkChanged(dark);
            preferences.onContrastChanged(contrast);
            tester
                .state<NavigatorState>(find.byType(Navigator))
                .pushNamed('/settings');
            await tester.pumpAndSettle();
            final high = contrast == SampleContrast.high;
            final description = tester.widget<Text>(
                find.text(SampleText.settingsDescription.value(language)));
            expect(
                description.style!.color,
                high
                    ? (dark
                        ? CSTokens.colorTextMutedHighDark
                        : CSTokens.colorTextMutedHighLight)
                    : (dark
                        ? CSTokens.colorTextMutedDark
                        : CSTokens.colorTextMuted));
            final selector =
                find.byType(DropdownButtonFormField<SampleContrast>);
            await tester.ensureVisible(selector);
            await tester.pumpAndSettle();
            expect(selector.hitTestable(), findsOneWidget);
            expect(tester.getSize(selector).height, greaterThanOrEqualTo(44));
            for (final element in find.byType(RichText).evaluate()) {
              final paragraph = element.renderObject! as RenderParagraph;
              expect(paragraph.didExceedMaxLines, isFalse, reason: name);
              expect(paragraph.textSize.height,
                  lessThanOrEqualTo(paragraph.size.height + 1),
                  reason: name);
              expect(paragraph.textSize.width,
                  lessThanOrEqualTo(paragraph.size.width + 1),
                  reason: name);
            }
            await expectLater(find.byType(MaterialApp),
                matchesGoldenFile('rendered/$name.png'));
            final signOut = find.widgetWithText(
                FilledButton, SampleText.signOut.value(language));
            await tester.ensureVisible(signOut);
            await tester.pumpAndSettle();
            expect(signOut.hitTestable(), findsOneWidget);
            expect(tester.getSize(signOut).height, greaterThanOrEqualTo(44));
            await expectLater(find.byType(MaterialApp),
                matchesGoldenFile('rendered/$name-end.png'));
            await tester.tap(signOut);
            await tester.pumpAndSettle();
            expect(
                find.text(SampleText.password.value(language)), findsOneWidget);
          });
        }
      }
    }
  }
}
