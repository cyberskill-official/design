// Render evidence, not accepted golden baselines. Run with --update-goldens.
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cyberskill_sample/main.dart';
import 'package:cyberskill_sample/sample_theme.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUpAll(() async {
    final sdk = Platform.environment['CS_FLUTTER_SDK']!;
    final font = File('$sdk/bin/cache/artifacts/material_fonts/Roboto-Regular.ttf');
    final loader = FontLoader('Roboto')
      ..addFont(Future.value(ByteData.sublistView(await font.readAsBytes())));
    await loader.load();
  });
  for (final size in [const Size(360, 800), const Size(800, 600)]) {
    for (final scale in [1.0, 1.5]) {
      for (final dark in [false, true]) {
        for (final route in ['/sign-in', '/home', '/settings']) {
          for (final compact in route == '/settings' ? [false, true] : [false]) {
            final name = '${size.width.toInt()}x${size.height.toInt()}-text$scale-${dark ? 'dark' : 'light'}-${route.substring(1)}-${compact ? 'compact' : 'comfortable'}';
            testWidgets(name, (tester) async {
              tester.view.physicalSize = size;
              tester.view.devicePixelRatio = 1;
              tester.platformDispatcher.textScaleFactorTestValue = scale;
              addTearDown(tester.view.resetPhysicalSize);
              addTearDown(tester.view.resetDevicePixelRatio);
              addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
              await tester.pumpWidget(const CyberSkillSampleApp());
              await tester.pumpAndSettle();
              final context = tester.element(find.byType(Scaffold));
              if (dark) SampleTheme.of(context).onDarkChanged(true);
              if (route != '/sign-in') Navigator.of(context).pushNamed(route);
              await tester.pumpAndSettle();
              if (compact) {
                await tester.tap(find.text('Compact spacing'));
                await tester.pumpAndSettle();
              }
              expect(tester.takeException(), isNull, reason: name);
              await expectLater(find.byType(MaterialApp), matchesGoldenFile('rendered/$name.png'));
            });
          }
        }
      }
    }
  }
}
