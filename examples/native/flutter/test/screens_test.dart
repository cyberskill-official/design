import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cyberskill_sample/main.dart';
import 'package:cyberskill_sample/tokens/cs_tokens.dart';
import 'package:cyberskill_sample/sample_language.dart';
import 'package:cyberskill_sample/sample_theme.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUpAll(() async {
    final loader = FontLoader('BeVietnamPro');
    for (final filename in ['Regular', 'Medium', 'SemiBold', 'ExtraBold']) {
      loader.addFont(Future.value(ByteData.sublistView(
          await File('assets/fonts/BeVietnamPro-$filename.ttf')
              .readAsBytes())));
    }
    await loader.load();
  });
  testWidgets('sample routes render without framework exceptions',
      (tester) async {
    await tester.pumpWidget(const CyberSkillSampleApp());
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    final navigator = tester.state<NavigatorState>(find.byType(Navigator));
    for (final route in ['/home', '/settings']) {
      navigator.pushNamed(route);
      await tester.pumpAndSettle();
      expect(find.byType(Scaffold), findsOneWidget);
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('dark preference changes rendered theme and survives navigation',
      (tester) async {
    await tester.pumpWidget(const CyberSkillSampleApp());
    await tester.pumpAndSettle();
    final navigator = tester.state<NavigatorState>(find.byType(Navigator));
    navigator.pushNamed('/settings');
    await tester.pumpAndSettle();
    await tester.tap(find.text('Ưu tiên giao diện tối'));
    await tester.pumpAndSettle();
    final preference = tester.widget<SwitchListTile>(
        find.widgetWithText(SwitchListTile, 'Ưu tiên giao diện tối'));
    expect(preference.value, isTrue);
    expect(Theme.of(tester.element(find.text('Cài đặt'))).brightness,
        Brightness.dark);
    expect(tester.widget<Text>(find.text('Cài đặt')).style!.color,
        CSTokens.colorTextPrimaryDark);
    navigator.pop();
    await tester.pumpAndSettle();
    final heading = find.text('Đăng nhập').first;
    expect(Theme.of(tester.element(heading)).brightness, Brightness.dark);
    expect(tester.widget<Text>(heading).style!.color,
        CSTokens.colorTextPrimaryDark);
    navigator.pushNamed('/settings');
    await tester.pumpAndSettle();
    expect(
        tester
            .widget<SwitchListTile>(
                find.widgetWithText(SwitchListTile, 'Ưu tiên giao diện tối'))
            .value,
        isTrue);
    await tester.tap(find.text('Ưu tiên giao diện tối'));
    await tester.pumpAndSettle();
    expect(Theme.of(tester.element(find.text('Cài đặt'))).brightness,
        Brightness.light);
    expect(tester.widget<Text>(find.text('Cài đặt')).style!.color,
        CSTokens.colorTextPrimary);
    expect(tester.takeException(), isNull);
  });

  testWidgets(
      'compact spacing changes button padding without shrinking its minimum height',
      (tester) async {
    await tester.pumpWidget(const CyberSkillSampleApp());
    await tester.pumpAndSettle();
    tester.state<NavigatorState>(find.byType(Navigator)).pushNamed('/settings');
    await tester.pumpAndSettle();
    final button = find.widgetWithText(FilledButton, 'Đăng xuất');
    EdgeInsetsGeometry? padding() =>
        tester.widget<FilledButton>(button).style!.padding!.resolve({});
    expect(
        padding(),
        const EdgeInsets.symmetric(
            horizontal: CSTokens.componentButtonMdPaddingXComfortable,
            vertical: CSTokens.componentButtonMdPaddingYComfortable));
    await tester.tap(find.text('Khoảng cách gọn'));
    await tester.pumpAndSettle();
    expect(
        padding(),
        const EdgeInsets.symmetric(
            horizontal: CSTokens.componentButtonMdPaddingXCompact,
            vertical: CSTokens.componentButtonMdPaddingYCompact));
    expect(tester.getSize(button).height,
        greaterThanOrEqualTo(CSTokens.componentButtonMdMinHeight));
    await tester.tap(find.text('Khoảng cách gọn'));
    await tester.pumpAndSettle();
    expect(
        padding(),
        const EdgeInsets.symmetric(
            horizontal: CSTokens.componentButtonMdPaddingXComfortable,
            vertical: CSTokens.componentButtonMdPaddingYComfortable));
    expect(tester.takeException(), isNull);
  });

  testWidgets(
      'language switches all routes independently of drafts, theme and density',
      (tester) async {
    await tester.pumpWidget(const CyberSkillSampleApp());
    await tester.pumpAndSettle();
    expect(find.text('Chào mừng bạn trở lại. Đăng nhập để tiếp tục.'),
        findsOneWidget);
    await tester.enterText(find.byType(TextField).first, 'draft@example.test');
    final navigator = tester.state<NavigatorState>(find.byType(Navigator));
    navigator.pushNamed('/settings');
    await tester.pumpAndSettle();
    await tester.tap(find.text('Ưu tiên giao diện tối'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Khoảng cách gọn'));
    await tester.pumpAndSettle();
    final selector = find.byType(DropdownButtonFormField<SampleLanguage>);
    await tester.ensureVisible(selector);
    await tester.tap(selector);
    await tester.pumpAndSettle();
    await tester.tap(find.text('English').last);
    await tester.pumpAndSettle();
    expect(find.text('Settings'), findsOneWidget);
    expect(
        tester
            .widget<SwitchListTile>(
                find.widgetWithText(SwitchListTile, 'Prefer dark theme'))
            .value,
        isTrue);
    expect(
        tester
            .widget<SwitchListTile>(
                find.widgetWithText(SwitchListTile, 'Compact spacing'))
            .value,
        isTrue);
    expect(Localizations.localeOf(tester.element(find.text('Settings'))),
        const Locale('en'));
    navigator.pop();
    await tester.pumpAndSettle();
    expect(find.text('Welcome back. Sign in to continue.'), findsOneWidget);
    expect(
        tester.widget<TextField>(find.byType(TextField).first).controller!.text,
        'draft@example.test');
    await tester.tap(find.widgetWithText(FilledButton, 'Sign in'));
    await tester.pumpAndSettle();
    for (final key in [
      SampleText.statusHub,
      SampleText.laborContract,
      SampleText.investorUpdate,
      SampleText.inBuild,
      SampleText.open,
      SampleText.done
    ]) {
      expect(find.text(key.en), findsOneWidget);
    }
    await tester.tap(find.widgetWithText(TextButton, 'Settings'));
    await tester.pumpAndSettle();
    expect(
        tester
            .widget<SwitchListTile>(
                find.widgetWithText(SwitchListTile, 'Compact spacing'))
            .value,
        isFalse);
    final selector2 = find.byType(DropdownButtonFormField<SampleLanguage>);
    await tester.ensureVisible(selector2);
    await tester.tap(selector2);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Tiếng Việt').last);
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.widgetWithText(FilledButton, 'Đăng xuất'));
    await tester.tap(find.widgetWithText(FilledButton, 'Đăng xuất'));
    await tester.pumpAndSettle();
    expect(find.text('Chào mừng bạn trở lại. Đăng nhập để tiếp tục.'),
        findsOneWidget);
    expect(SampleTheme.of(tester.element(find.byType(Scaffold))).dark, isTrue);
    expect(Localizations.localeOf(tester.element(find.byType(Scaffold))),
        const Locale('vi'));
    expect(tester.takeException(), isNull);
  });
  for (final language in SampleLanguage.values) {
    for (final size in [const Size(360, 800), const Size(800, 600)]) {
      for (final scale in [1.0, 1.5, 2.0]) {
        testWidgets('keyboard form ${language.name} $size text$scale',
            (tester) async {
          tester.view.physicalSize = size;
          tester.view.devicePixelRatio = 1;
          tester.view.viewInsets = const FakeViewPadding(bottom: 300);
          tester.platformDispatcher.textScaleFactorTestValue = scale;
          addTearDown(tester.view.resetPhysicalSize);
          addTearDown(tester.view.resetDevicePixelRatio);
          addTearDown(tester.view.resetViewInsets);
          addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
          final semantics = tester.ensureSemantics();
          try {
            await tester.pumpWidget(const CyberSkillSampleApp());
            await tester.pumpAndSettle();
            SampleTheme.of(tester.element(find.byType(Scaffold)))
                .onLanguageChanged(language);
            await tester.pumpAndSettle();
            await tester.enterText(
                find.byType(TextField).first, 'draft@example.test');
            await tester.enterText(
                find.byType(TextField).last, 'private-draft');
            final submit = find.widgetWithText(
                FilledButton, SampleText.signIn.value(language));
            await tester.ensureVisible(submit);
            await tester.pumpAndSettle();
            expect(submit.hitTestable(), findsOneWidget);
            expect(tester.getSize(submit).height,
                greaterThanOrEqualTo(CSTokens.componentButtonMdMinHeight));
            expect(
                tester
                    .widget<TextField>(find.byType(TextField).last)
                    .obscureText,
                isTrue);
            expect(
                tester
                    .widget<TextField>(find.byType(TextField).first)
                    .controller!
                    .text,
                'draft@example.test');
            expect(find.bySemanticsLabel(SampleText.password.value(language)),
                findsOneWidget);
            await tester.tap(submit);
            await tester.pumpAndSettle();
            expect(
                find.text(SampleText.wishes.value(language)), findsOneWidget);
            expect(tester.takeException(), isNull);
          } finally {
            semantics.dispose();
          }
        });
      }
    }
  }
}
