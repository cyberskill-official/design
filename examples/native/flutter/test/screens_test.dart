import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cyberskill_sample/main.dart';

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
}
