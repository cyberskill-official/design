import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cyberskill_sample/main.dart';
import 'package:cyberskill_sample/tokens/cs_tokens.dart';

void main() {
  testWidgets('sample routes render without framework exceptions', (tester) async {
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

  testWidgets('dark preference changes rendered theme and survives navigation', (tester) async {
    await tester.pumpWidget(const CyberSkillSampleApp());
    await tester.pumpAndSettle();
    final navigator = tester.state<NavigatorState>(find.byType(Navigator));
    navigator.pushNamed('/settings');
    await tester.pumpAndSettle();
    await tester.tap(find.text('Prefer dark theme'));
    await tester.pumpAndSettle();
    final preference = tester.widget<SwitchListTile>(find.widgetWithText(SwitchListTile, 'Prefer dark theme'));
    expect(preference.value, isTrue);
    expect(Theme.of(tester.element(find.text('Settings'))).brightness, Brightness.dark);
    expect(tester.widget<Text>(find.text('Settings')).style!.color, CSTokens.colorTextPrimaryDark);
    navigator.pop();
    await tester.pumpAndSettle();
    final heading = find.text('Sign in').first;
    expect(Theme.of(tester.element(heading)).brightness, Brightness.dark);
    expect(tester.widget<Text>(heading).style!.color, CSTokens.colorTextPrimaryDark);
    navigator.pushNamed('/settings');
    await tester.pumpAndSettle();
    expect(tester.widget<SwitchListTile>(find.widgetWithText(SwitchListTile, 'Prefer dark theme')).value, isTrue);
    await tester.tap(find.text('Prefer dark theme'));
    await tester.pumpAndSettle();
    expect(Theme.of(tester.element(find.text('Settings'))).brightness, Brightness.light);
    expect(tester.widget<Text>(find.text('Settings')).style!.color, CSTokens.colorTextPrimary);
    expect(tester.takeException(), isNull);
  });

  testWidgets('compact spacing changes button padding without shrinking its minimum height', (tester) async {
    await tester.pumpWidget(const CyberSkillSampleApp());
    await tester.pumpAndSettle();
    tester.state<NavigatorState>(find.byType(Navigator)).pushNamed('/settings');
    await tester.pumpAndSettle();
    final button = find.widgetWithText(FilledButton, 'Sign out');
    EdgeInsetsGeometry? padding() => tester.widget<FilledButton>(button).style!.padding!.resolve({});
    expect(padding(), const EdgeInsets.symmetric(horizontal: CSTokens.componentButtonMdPaddingXComfortable, vertical: CSTokens.componentButtonMdPaddingYComfortable));
    await tester.tap(find.text('Compact spacing'));
    await tester.pumpAndSettle();
    expect(padding(), const EdgeInsets.symmetric(horizontal: CSTokens.componentButtonMdPaddingXCompact, vertical: CSTokens.componentButtonMdPaddingYCompact));
    expect(tester.getSize(button).height, greaterThanOrEqualTo(CSTokens.componentButtonMdMinHeight));
    await tester.tap(find.text('Compact spacing'));
    await tester.pumpAndSettle();
    expect(padding(), const EdgeInsets.symmetric(horizontal: CSTokens.componentButtonMdPaddingXComfortable, vertical: CSTokens.componentButtonMdPaddingYComfortable));
    expect(tester.takeException(), isNull);
  });

}
