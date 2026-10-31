import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'controls.dart';

double csIconPoints(String size) => switch (size) { 'sm' => 16, 'lg' => 24, _ => 20 };

String csIconResolved(String name) => csIconGlyphs.containsKey(name) ? name : 'sparkle';

Path csIconPath(String name, double sizePx) {
  final path = Path();
  final scale = sizePx / 24;
  for (final mark in csIconGlyphs[csIconResolved(name)]!) {
    if (mark.startsWith('C ')) {
      final n = mark.substring(2).split(' ').map(double.parse).toList();
      path.addOval(Rect.fromCircle(center: Offset(n[0] * scale, n[1] * scale), radius: n[2] * scale));
    } else if (mark.startsWith('R ')) {
      final n = mark.substring(2).split(' ').map(double.parse).toList();
      path.addRRect(RRect.fromRectAndRadius(Rect.fromLTWH(n[0] * scale, n[1] * scale, n[2] * scale, n[3] * scale), Radius.circular(n[4] * scale)));
    } else {
      _append(mark, path, scale);
    }
  }
  return path;
}

class CsIcon extends StatelessWidget {
  const CsIcon({super.key, required this.name, required this.dark, required this.highContrast, required this.compact, this.size = 'md', this.label = ''});
  final String name;
  final String size;
  final String label;
  final bool dark;
  final bool highContrast;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final pack = csModePack(dark: dark, highContrast: highContrast, compact: compact);
    final points = csIconPoints(size);
    final icon = CustomPaint(
      size: Size(points, points),
      painter: _CsIconPainter(name, csColor(pack.colorTextPrimary), points),
    );
    return label.isEmpty ? ExcludeSemantics(child: icon) : Semantics(label: label, child: icon);
  }
}

class _CsIconPainter extends CustomPainter {
  _CsIconPainter(this.name, this.color, this.points);
  final String name;
  final Color color;
  final double points;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.75 * points / 24
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..color = color;
    canvas.drawPath(csIconPath(name, points), paint);
  }

  @override
  bool shouldRepaint(covariant _CsIconPainter oldDelegate) => oldDelegate.name != name || oldDelegate.color != color || oldDelegate.points != points;
}

Path csIconPathData(String data, double sizePx) {
  final path = Path();
  _append(data, path, sizePx / 24);
  return path;
}

void _append(String data, Path path, double scale) {
  var index = 0;
  var command = 'M';
  var cx = 0.0;
  var cy = 0.0;
  var startX = 0.0;
  var startY = 0.0;
  void skip() {
    while (index < data.length && ' \n\t,'.contains(data[index])) {
      index += 1;
    }
  }

  double? number() {
    skip();
    if (index >= data.length || RegExp(r'[A-Za-z]').hasMatch(data[index])) return null;
    final start = index;
    if (data[index] == '+' || data[index] == '-') index += 1;
    var digits = false;
    var dot = false;
    while (index < data.length) {
      final char = data[index];
      if (RegExp(r'[0-9]').hasMatch(char)) {
        digits = true;
        index += 1;
      } else if (char == '.' && !dot) {
        dot = true;
        index += 1;
      } else {
        break;
      }
    }
    if (!digits) return null;
    return double.parse(data.substring(start, index));
  }

  while (index < data.length) {
    skip();
    if (index >= data.length) break;
    if (RegExp(r'[A-Za-z]').hasMatch(data[index])) {
      command = data[index];
      index += 1;
    }
    switch (command) {
      case 'M':
      case 'L':
        final x = number();
        final y = number();
        if (x == null || y == null) return;
        if (command == 'M') {
          path.moveTo(x * scale, y * scale);
          startX = x;
          startY = y;
          command = 'L';
        } else {
          path.lineTo(x * scale, y * scale);
        }
        cx = x;
        cy = y;
        break;
      case 'm':
      case 'l':
        final dx = number();
        final dy = number();
        if (dx == null || dy == null) return;
        final x = cx + dx;
        final y = cy + dy;
        if (command == 'm') {
          path.moveTo(x * scale, y * scale);
          startX = x;
          startY = y;
          command = 'l';
        } else {
          path.lineTo(x * scale, y * scale);
        }
        cx = x;
        cy = y;
        break;
      case 'H':
        final x = number();
        if (x == null) return;
        path.lineTo(x * scale, cy * scale);
        cx = x;
        break;
      case 'h':
        final dx = number();
        if (dx == null) return;
        cx += dx;
        path.lineTo(cx * scale, cy * scale);
        break;
      case 'V':
        final y = number();
        if (y == null) return;
        path.lineTo(cx * scale, y * scale);
        cy = y;
        break;
      case 'v':
        final dy = number();
        if (dy == null) return;
        cy += dy;
        path.lineTo(cx * scale, cy * scale);
        break;
      case 'Z':
      case 'z':
        path.close();
        cx = startX;
        cy = startY;
        command = 'M';
        break;
      case 'C':
      case 'c':
        final values = [number(), number(), number(), number(), number(), number()];
        if (values.any((value) => value == null)) return;
        final absolute = command == 'C';
        final endX = absolute ? values[4]! : cx + values[4]!;
        final endY = absolute ? values[5]! : cy + values[5]!;
        path.cubicTo(
          (absolute ? values[0]! : cx + values[0]!) * scale,
          (absolute ? values[1]! : cy + values[1]!) * scale,
          (absolute ? values[2]! : cx + values[2]!) * scale,
          (absolute ? values[3]! : cy + values[3]!) * scale,
          endX * scale,
          endY * scale,
        );
        cx = endX;
        cy = endY;
        break;
      case 'S':
      case 's':
        final x2 = number();
        final y2 = number();
        final ex = number();
        final ey = number();
        if (x2 == null || y2 == null || ex == null || ey == null) return;
        final absolute = command == 'S';
        final endX = absolute ? ex : cx + ex;
        final endY = absolute ? ey : cy + ey;
        path.quadraticBezierTo((absolute ? x2 : cx + x2) * scale, (absolute ? y2 : cy + y2) * scale, endX * scale, endY * scale);
        cx = endX;
        cy = endY;
        break;
      case 'A':
      case 'a':
        final rx = number();
        final ry = number();
        number();
        final large = number();
        final sweep = number();
        final ex = number();
        final ey = number();
        if (rx == null || ry == null || large == null || sweep == null || ex == null || ey == null) return;
        final x = command == 'a' ? cx + ex : ex;
        final y = command == 'a' ? cy + ey : ey;
        _arc(path, cx, cy, x, y, rx, ry, large != 0, sweep != 0, scale);
        cx = x;
        cy = y;
        break;
      default:
        return;
    }
  }
}

void _arc(Path path, double x1, double y1, double x2, double y2, double rx0, double ry0, bool large, bool sweep, double scale) {
  var rx = rx0.abs();
  var ry = ry0.abs();
  if (rx == 0 || ry == 0 || (x1 == x2 && y1 == y2)) {
    path.lineTo(x2 * scale, y2 * scale);
    return;
  }
  final dx = (x1 - x2) / 2;
  final dy = (y1 - y2) / 2;
  var rx2 = rx * rx;
  var ry2 = ry * ry;
  final lambda = dx * dx / rx2 + dy * dy / ry2;
  if (lambda > 1) {
    final factor = math.sqrt(lambda);
    rx *= factor;
    ry *= factor;
    rx2 = rx * rx;
    ry2 = ry * ry;
  }
  final sign = large == sweep ? -1.0 : 1.0;
  final numer = math.max(0.0, rx2 * ry2 - rx2 * dy * dy - ry2 * dx * dx);
  final denom = rx2 * dy * dy + ry2 * dx * dx;
  final coef = sign * (denom == 0 ? 0 : math.sqrt(numer / denom));
  final cxp = coef * rx * dy / ry;
  final cyp = coef * -ry * dx / rx;
  final centerX = cxp + (x1 + x2) / 2;
  final centerY = cyp + (y1 + y2) / 2;
  final ux = (dx - cxp) / rx;
  final uy = (dy - cyp) / ry;
  final vx = (-dx - cxp) / rx;
  final vy = (-dy - cyp) / ry;
  final start = math.atan2(uy, ux);
  var delta = math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  if (!sweep && delta > 0) delta -= 2 * math.pi;
  if (sweep && delta < 0) delta += 2 * math.pi;
  final radius = math.max(rx, ry) * scale;
  path.arcTo(Rect.fromCircle(center: Offset(centerX * scale, centerY * scale), radius: radius), start, delta, false);
}

const csIconGlyphs = <String, List<String>>{
  'close': ['M6 6l12 12M18 6L6 18'],
  'sun': ['C 12 12 4', 'M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4'],
  'moon': ['M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z'],
  'arrow-right': ['M5 12h14M13 6l6 6-6 6'],
  'check': ['M4 12.5l5 5 11-11'],
  'sparkle': ['M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z'],
  'chat': ['M4 5h16v11H8l-4 4z'],
  'sound-on': ['M5 9v6h3l4 4V5L8 9z', 'M15 9.5a4 4 0 0 1 0 5M17.6 7a8 8 0 0 1 0 10'],
  'sound-off': ['M5 9v6h3l4 4V5L8 9z', 'M16 9.5l4.5 5M20.5 9.5l-4.5 5'],
  'search': ['C 11 11 6', 'M20 20l-4.2-4.2'],
  'sliders': ['M4 6h16M4 12h16M4 18h16', 'C 9 6 2', 'C 15 12 2', 'C 7 18 2'],
  'upload': ['M12 15V4M7 8.5L12 4l5 4.5', 'M4 19h16'],
  'download': ['M12 4v11M7 10.5L12 15l5-4.5', 'M4 19h16'],
  'calendar': ['R 4 6 16 14 2', 'M4 10.5h16M8 3.5v4M16 3.5v4'],
  'user': ['C 12 8.5 3.5', 'M5 19.5c1.6-3.4 4-5 7-5s5.4 1.6 7 5'],
  'plus': ['M12 5v14M5 12h14'],
  'trash': ['M5 7h14M9.5 7V4.5h5V7', 'M7 7l.8 12.5h8.4L17 7M10 11v5M14 11v5'],
  'external': ['M14 4h6v6M20 4l-8 8', 'M18 13v6H5V6h6'],
  'menu': ['M4 7h16M4 12h16M4 17h16'],
  'chevron-down': ['M6 9l6 6 6-6'],
  'chevron-up': ['M6 15l6-6 6 6'],
  'chevron-left': ['M15 6l-6 6 6 6'],
  'chevron-right': ['M9 6l6 6-6 6'],
  'edit': ['M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17z', 'M13.5 6.5l3 3'],
  'copy': ['R 8 8 12 12 2', 'M4 16V6a2 2 0 0 1 2-2h10'],
  'info': ['C 12 12 9', 'M12 11v5M12 7.75v.01'],
  'alert-triangle': ['M12 3.5l9 16H3z', 'M12 10v4M12 17.5v.01'],
  'pin': ['M12 21v-7', 'M8.5 3.5h7l-1.2 6.5h2.7L12 14.5 6.999 10h2.7z'],
};
