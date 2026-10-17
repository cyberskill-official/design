// Run with the sample's explicitly selected package_config.json, which pins intl.
import 'dart:convert';
import 'dart:io';
import 'package:intl/intl.dart';
import 'package:intl/date_symbol_data_local.dart';
import '../../flutter/lib/sample_language.dart';

Future<void> main(List<String> args) async {
  if (args.length != 1) throw ArgumentError('Pass the fixture JSON path');
  final fixture = jsonDecode(await File(args.single).readAsString()) as Map<String,dynamic>;
  final languages = (fixture['languages'] as List).cast<Map<String,dynamic>>();
  final tags = languages.map((language)=>language['language']).toSet();
  if (tags.length != SampleLanguage.values.length || !SampleLanguage.values.every((language)=>tags.contains(language.name))) throw StateError('Fixture languages differ from the sample');
  final rows = <Map<String,dynamic>>[];
  for (final language in languages) {
    final tag = language['language'] as String;
    final locale = (language['numberLocale'] as String).replaceAll('-','_');
    for (final currency in fixture['currencies'] as List) {
      final amounts = fixture['currencyAmounts'] as List;
      for (var index=0;index<amounts.length;index++) {
        for (final mode in ['sdkDefault','webProfile']) {
          final formatter = NumberFormat.currency(locale:locale,name:currency as String);
          // intl already derives currency digits from its ISO currency table.
          // Its full currency-name symbol is intentionally retained, not forced
          // to match another platform's symbol or whitespace.
          rows.add({'id':'$tag:currency:$currency:$index','mode':mode,'text':formatter.format(amounts[index]),'currency':formatter.currencyName,'minimumFractionDigits':formatter.minimumFractionDigits,'maximumFractionDigits':formatter.maximumFractionDigits});
        }
      }
    }
    final numbers = fixture['numberAmounts'] as List;
    for (var index=0;index<numbers.length;index++) {
      final formatter = NumberFormat.decimalPattern(locale)..maximumFractionDigits=3;
      rows.add({'id':'$tag:number:$index','mode':'webProfile','text':formatter.format(numbers[index])});
    }
    final dateLocale = (language['dateLocale'] as String).replaceAll('-','_');
    await initializeDateFormatting(dateLocale);
    final formatter = DateFormat(language['datePattern'] as String,dateLocale);
    final dates = fixture['dates'] as List;
    for (var index=0;index<dates.length;index++) rows.add({'id':'$tag:date:$index','mode':'webProfile','text':formatter.format(DateTime.parse(dates[index] as String).toUtc())});
  }
  final result = {'schemaVersion':1,'platform':'flutter-intl','runtime':Platform.version,'rows':rows};
  stdout.writeln(const JsonEncoder.withIndent('  ').convert(result));
}
