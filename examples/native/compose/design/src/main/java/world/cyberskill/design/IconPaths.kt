package world.cyberskill.design

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.atan2
import kotlin.math.max
import kotlin.math.sqrt

sealed class CsIconMark {
  data class PathData(val d: String) : CsIconMark()
  data class Circle(val cx: Float, val cy: Float, val r: Float) : CsIconMark()
  data class Box(val x: Float, val y: Float, val width: Float, val height: Float, val rx: Float) : CsIconMark()
}

fun csIconResolved(name: String): String = if (csIconGlyphs.containsKey(name)) name else "sparkle"

fun csIconPathData(data: String, sizePx: Float): Path {
  val path = Path()
  appendIconPath(data, path, sizePx / 24f)
  return path
}

fun csIconPath(name: String, sizePx: Float): Path {
  val path = Path()
  val scale = sizePx / 24f
  for (mark in csIconGlyphs[csIconResolved(name)] ?: csIconGlyphs.getValue("sparkle")) {
    when (mark) {
      is CsIconMark.PathData -> appendIconPath(mark.d, path, scale)
      is CsIconMark.Circle -> path.addOval(Rect((mark.cx - mark.r) * scale, (mark.cy - mark.r) * scale, (mark.cx + mark.r) * scale, (mark.cy + mark.r) * scale))
      is CsIconMark.Box -> path.addRoundRect(RoundRect(Rect(mark.x * scale, mark.y * scale, (mark.x + mark.width) * scale, (mark.y + mark.height) * scale), CornerRadius(mark.rx * scale, mark.rx * scale)))
    }
  }
  return path
}

@Composable
fun CsIcon(name: String, label: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, size: String = "md") {
  val pack = csModePack(dark, highContrast, compact)
  val points = csIconPoints(size)
  val color = pack.colorTextPrimary.toComposeColor()
  Canvas(modifier.size(points.dp)) {
    val px = this.size.minDimension
    drawPath(
      csIconPath(name, px),
      color,
      style = Stroke(width = 1.75f * px / 24f, cap = StrokeCap.Round, join = StrokeJoin.Round),
    )
  }
}

private fun appendIconPath(data: String, path: Path, scale: Float) {
  var index = 0
  var command = 'M'
  var cx = 0f
  var cy = 0f
  var startX = 0f
  var startY = 0f
  fun skip() { while (index < data.length && data[index] in " \n\t,") index += 1 }
  fun number(): Float? {
    skip()
    if (index >= data.length || data[index].isLetter()) return null
    val start = index
    if (data[index] == '+' || data[index] == '-') index += 1
    var digits = false
    var dot = false
    while (index < data.length) {
      val char = data[index]
      if (char.isDigit()) { digits = true; index += 1 }
      else if (char == '.' && !dot) { dot = true; index += 1 }
      else break
    }
    if (!digits) return null
    return data.substring(start, index).toFloat()
  }
  while (index < data.length) {
    skip()
    if (index >= data.length) break
    if (data[index].isLetter()) { command = data[index]; index += 1 }
    when (command) {
      'M', 'L' -> {
        val x = number() ?: return
        val y = number() ?: return
        if (command == 'M') { path.moveTo(x * scale, y * scale); startX = x; startY = y; command = 'L' }
        else path.lineTo(x * scale, y * scale)
        cx = x; cy = y
      }
      'm', 'l' -> {
        val dx = number() ?: return
        val dy = number() ?: return
        val x = cx + dx
        val y = cy + dy
        if (command == 'm') { path.moveTo(x * scale, y * scale); startX = x; startY = y; command = 'l' }
        else path.lineTo(x * scale, y * scale)
        cx = x; cy = y
      }
      'H' -> { val x = number() ?: return; path.lineTo(x * scale, cy * scale); cx = x }
      'h' -> { val dx = number() ?: return; cx += dx; path.lineTo(cx * scale, cy * scale) }
      'V' -> { val y = number() ?: return; path.lineTo(cx * scale, y * scale); cy = y }
      'v' -> { val dy = number() ?: return; cy += dy; path.lineTo(cx * scale, cy * scale) }
      'Z', 'z' -> { path.close(); cx = startX; cy = startY; command = 'M' }
      'C', 'c' -> {
        val x1 = number() ?: return
        val y1 = number() ?: return
        val x2 = number() ?: return
        val y2 = number() ?: return
        val ex = number() ?: return
        val ey = number() ?: return
        val absolute = command == 'C'
        val endX = if (absolute) ex else cx + ex
        val endY = if (absolute) ey else cy + ey
        path.cubicTo(
          (if (absolute) x1 else cx + x1) * scale, (if (absolute) y1 else cy + y1) * scale,
          (if (absolute) x2 else cx + x2) * scale, (if (absolute) y2 else cy + y2) * scale,
          endX * scale, endY * scale,
        )
        cx = endX; cy = endY
      }
      'S', 's' -> {
        val x2 = number() ?: return
        val y2 = number() ?: return
        val ex = number() ?: return
        val ey = number() ?: return
        val absolute = command == 'S'
        val endX = if (absolute) ex else cx + ex
        val endY = if (absolute) ey else cy + ey
        path.quadraticBezierTo((if (absolute) x2 else cx + x2) * scale, (if (absolute) y2 else cy + y2) * scale, endX * scale, endY * scale)
        cx = endX; cy = endY
      }
      'A', 'a' -> {
        val rx = number() ?: return
        val ry = number() ?: return
        number() ?: return
        val large = number() ?: return
        val sweep = number() ?: return
        val ex = number() ?: return
        val ey = number() ?: return
        val x = if (command == 'a') cx + ex else ex
        val y = if (command == 'a') cy + ey else ey
        addIconArc(path, cx, cy, x, y, rx, ry, large != 0f, sweep != 0f, scale)
        cx = x; cy = y
      }
      else -> return
    }
  }
}

private fun addIconArc(path: Path, x1: Float, y1: Float, x2: Float, y2: Float, rx0: Float, ry0: Float, large: Boolean, sweep: Boolean, scale: Float) {
  var rx = abs(rx0)
  var ry = abs(ry0)
  if (rx == 0f || ry == 0f || (x1 == x2 && y1 == y2)) {
    path.lineTo(x2 * scale, y2 * scale)
    return
  }
  val dx = (x1 - x2) / 2f
  val dy = (y1 - y2) / 2f
  var rx2 = rx * rx
  var ry2 = ry * ry
  val lambda = dx * dx / rx2 + dy * dy / ry2
  if (lambda > 1f) {
    val factor = sqrt(lambda)
    rx *= factor
    ry *= factor
    rx2 = rx * rx
    ry2 = ry * ry
  }
  val sign = if (large == sweep) -1f else 1f
  val numer = max(0f, rx2 * ry2 - rx2 * dy * dy - ry2 * dx * dx)
  val denom = rx2 * dy * dy + ry2 * dx * dx
  val coef = sign * if (denom == 0f) 0f else sqrt(numer / denom)
  val cxp = coef * rx * dy / ry
  val cyp = coef * -ry * dx / rx
  val centerX = cxp + (x1 + x2) / 2f
  val centerY = cyp + (y1 + y2) / 2f
  val ux = (dx - cxp) / rx
  val uy = (dy - cyp) / ry
  val vx = (-dx - cxp) / rx
  val vy = (-dy - cyp) / ry
  val start = atan2(uy, ux)
  var delta = atan2(ux * vy - uy * vx, ux * vx + uy * vy)
  if (!sweep && delta > 0f) delta -= (2f * PI.toFloat())
  if (sweep && delta < 0f) delta += (2f * PI.toFloat())
  val radius = max(rx, ry) * scale
  path.arcTo(
    Rect(centerX * scale - radius, centerY * scale - radius, centerX * scale + radius, centerY * scale + radius),
    Math.toDegrees(start.toDouble()).toFloat(),
    Math.toDegrees(delta.toDouble()).toFloat(),
    false,
  )
}

val csIconGlyphs: Map<String, List<CsIconMark>> = mapOf(
  "close" to listOf(CsIconMark.PathData("M6 6l12 12M18 6L6 18")),
  "sun" to listOf(CsIconMark.Circle(12f, 12f, 4f), CsIconMark.PathData("M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4")),
  "moon" to listOf(CsIconMark.PathData("M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z")),
  "arrow-right" to listOf(CsIconMark.PathData("M5 12h14M13 6l6 6-6 6")),
  "check" to listOf(CsIconMark.PathData("M4 12.5l5 5 11-11")),
  "sparkle" to listOf(CsIconMark.PathData("M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z")),
  "chat" to listOf(CsIconMark.PathData("M4 5h16v11H8l-4 4z")),
  "sound-on" to listOf(CsIconMark.PathData("M5 9v6h3l4 4V5L8 9z"), CsIconMark.PathData("M15 9.5a4 4 0 0 1 0 5M17.6 7a8 8 0 0 1 0 10")),
  "sound-off" to listOf(CsIconMark.PathData("M5 9v6h3l4 4V5L8 9z"), CsIconMark.PathData("M16 9.5l4.5 5M20.5 9.5l-4.5 5")),
  "search" to listOf(CsIconMark.Circle(11f, 11f, 6f), CsIconMark.PathData("M20 20l-4.2-4.2")),
  "sliders" to listOf(CsIconMark.PathData("M4 6h16M4 12h16M4 18h16"), CsIconMark.Circle(9f, 6f, 2f), CsIconMark.Circle(15f, 12f, 2f), CsIconMark.Circle(7f, 18f, 2f)),
  "upload" to listOf(CsIconMark.PathData("M12 15V4M7 8.5L12 4l5 4.5"), CsIconMark.PathData("M4 19h16")),
  "download" to listOf(CsIconMark.PathData("M12 4v11M7 10.5L12 15l5-4.5"), CsIconMark.PathData("M4 19h16")),
  "calendar" to listOf(CsIconMark.Box(4f, 6f, 16f, 14f, 2f), CsIconMark.PathData("M4 10.5h16M8 3.5v4M16 3.5v4")),
  "user" to listOf(CsIconMark.Circle(12f, 8.5f, 3.5f), CsIconMark.PathData("M5 19.5c1.6-3.4 4-5 7-5s5.4 1.6 7 5")),
  "plus" to listOf(CsIconMark.PathData("M12 5v14M5 12h14")),
  "trash" to listOf(CsIconMark.PathData("M5 7h14M9.5 7V4.5h5V7"), CsIconMark.PathData("M7 7l.8 12.5h8.4L17 7M10 11v5M14 11v5")),
  "external" to listOf(CsIconMark.PathData("M14 4h6v6M20 4l-8 8"), CsIconMark.PathData("M18 13v6H5V6h6")),
  "menu" to listOf(CsIconMark.PathData("M4 7h16M4 12h16M4 17h16")),
  "chevron-down" to listOf(CsIconMark.PathData("M6 9l6 6 6-6")),
  "chevron-up" to listOf(CsIconMark.PathData("M6 15l6-6 6 6")),
  "chevron-left" to listOf(CsIconMark.PathData("M15 6l-6 6 6 6")),
  "chevron-right" to listOf(CsIconMark.PathData("M9 6l6 6-6 6")),
  "edit" to listOf(CsIconMark.PathData("M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17z"), CsIconMark.PathData("M13.5 6.5l3 3")),
  "copy" to listOf(CsIconMark.Box(8f, 8f, 12f, 12f, 2f), CsIconMark.PathData("M4 16V6a2 2 0 0 1 2-2h10")),
  "info" to listOf(CsIconMark.Circle(12f, 12f, 9f), CsIconMark.PathData("M12 11v5M12 7.75v.01")),
  "alert-triangle" to listOf(CsIconMark.PathData("M12 3.5l9 16H3z"), CsIconMark.PathData("M12 10v4M12 17.5v.01")),
  "pin" to listOf(CsIconMark.PathData("M12 21v-7"), CsIconMark.PathData("M8.5 3.5h7l-1.2 6.5h2.7L12 14.5 6.999 10h2.7z")),
)
