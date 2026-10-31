package world.cyberskill.design

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.hoverable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.layout.boundsInWindow
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.onPointerEvent
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import kotlinx.coroutines.delay
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.isAltPressed
import androidx.compose.ui.input.key.isCtrlPressed
import androidx.compose.ui.input.key.isMetaPressed
import androidx.compose.ui.input.key.isShiftPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.matchParentSize
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.SemanticsPropertyKey
import androidx.compose.ui.semantics.SemanticsPropertyReceiver
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp

data class CsKeyEvent(val key: String, val ctrl: Boolean = false, val meta: Boolean = false, val shift: Boolean = false, val alt: Boolean = false)

fun csHotKeyMatches(combo: String, event: CsKeyEvent): Boolean {
  val parts = combo.lowercase().split("+").map { it.trim() }.toMutableList()
  if (parts.isEmpty()) return false
  val key = parts.removeAt(parts.lastIndex)
  if (key.isEmpty()) return false
  val allowed = setOf("mod", "ctrl", "meta", "shift", "alt")
  if (parts.any { it !in allowed }) return false
  val control = if ("mod" in parts) {
    (event.meta || event.ctrl) && ("ctrl" !in parts || event.ctrl) && ("meta" !in parts || event.meta)
  } else event.ctrl == ("ctrl" in parts) && event.meta == ("meta" in parts)
  return control && event.shift == ("shift" in parts) && event.alt == ("alt" in parts) && event.key.lowercase() == key
}
const val csHotKeyTitle = "Keyboard shortcuts"
const val csHotKeyToggle = "Toggle this sheet"
fun csHotKeyCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("title" to "Phím tắt", "toggle" to "Bật/tắt bảng này")
  val en = mapOf("title" to csHotKeyTitle, "toggle" to csHotKeyToggle)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csHotKeyIgnored(composing: Boolean, keyCode: Int, inField: Boolean) = composing || keyCode == 229 || inField
fun csHotKeyHelp(key: String, ctrl: Boolean, meta: Boolean, alt: Boolean, help: Boolean) = help && key == "?" && !ctrl && !meta && !alt
fun csHotKeyNextOpen(open: Boolean, helpKey: Boolean, otherModal: Boolean): Boolean? {
  if (!helpKey) return null
  if (!open && otherModal) return null
  return !open
}

fun csChartMax(values: List<Double>): Double = maxOf(1.0, values.maxOrNull() ?: 1.0)
fun csChartKind(type: String) = if (type == "pie" || type == "line" || type == "spark") type else "bar"
fun csChartSliceSlot(index: Int): Int {
  val count = 5
  return ((index % count) + count) % count
}
fun csChartNumber(value: Double): String {
  if (value.isNaN()) return "NaN"
  if (value.isInfinite()) return if (value > 0) "Infinity" else "-Infinity"
  if (value == 0.0) return "0"
  val rounded = kotlin.math.round(value)
  if (value == rounded && kotlin.math.abs(value) < 1e21) return rounded.toLong().toString()
  return value.toString()
}
fun csChartLegend(type: String, labels: List<String>, values: List<Double>, showValues: Boolean): List<String>? {
  if (csChartKind(type) == "spark") return null
  return labels.mapIndexed { index, name -> if (showValues && index < values.size) name + " " + csChartNumber(values[index]) else name }
}
fun csChartCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("empty" to "Biểu đồ chưa có dữ liệu")
  val en = mapOf("empty" to "Chart with no data")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csChartEmpty(text: String, fallback: String) = if (text.isEmpty()) fallback else text
fun csChartAccessibleName(label: String?, points: List<Pair<String, Double>>, empty: String): String {
  if (label != null && label.trim().isNotEmpty()) return label
  if (points.isEmpty()) return empty
  return points.joinToString(", ") { it.first + ": " + csChartNumber(it.second) }
}

data class CsChartBar(val x: Double, val y: Double, val width: Double, val height: Double)
data class CsChartPoint(val x: Double, val y: Double)
data class CsChartSlice(val start: Double, val end: Double, val large: Boolean, val full: Boolean)

fun csChartBars(values: List<Double>, height: Double = 160.0): List<CsChartBar> {
  val numbers = values.map { if (it.isNaN()) 0.0 else it }
  if (numbers.isEmpty()) return emptyList()
  val peak = maxOf(1.0, numbers.maxOrNull() ?: 1.0)
  val floor = minOf(0.0, numbers.minOrNull() ?: 0.0)
  val span = if (peak - floor == 0.0) 1.0 else peak - floor
  val band = (320.0 - 8.0) / numbers.size
  val zeroY = if (floor < 0) 6 + (peak / span) * (height - 26) else height - 20
  return numbers.mapIndexed { index, value ->
    val barHeight: Double
    val y: Double
    if (floor < 0) {
      barHeight = kotlin.math.abs(value) / span * (height - 26)
      y = if (value >= 0) zeroY - barHeight else zeroY
    } else {
      barHeight = maxOf(0.0, maxOf(0.0, value) / peak * (height - 26))
      y = height - 20 - barHeight
    }
    CsChartBar(4 + index * band + band * 0.14, y, band * 0.72, barHeight)
  }
}

fun csChartLine(values: List<Double>, height: Double = 160.0): List<CsChartPoint> {
  val numbers = values.map { if (it.isNaN()) 0.0 else it }
  val peak = maxOf(1.0, numbers.maxOrNull() ?: 1.0)
  val step = maxOf(1, numbers.size - 1).toDouble()
  return numbers.mapIndexed { index, value ->
    CsChartPoint((index / step) * (320 - 8) + 4, height - 6 - (value / peak) * (height - 24))
  }
}

fun csChartPie(values: List<Double>): List<CsChartSlice?> {
  val numbers = values.map { if (it.isNaN()) 0.0 else it }
  val total = numbers.sum()
  val safe = if (total == 0.0) 1.0 else total
  var angle = -Math.PI / 2
  return numbers.map { value ->
    if (value == 0.0) return@map null
    if (value == total) return@map CsChartSlice(angle, angle, false, true)
    val next = angle + (value / safe) * Math.PI * 2
    val slice = CsChartSlice(angle, next, next - angle > Math.PI, false)
    angle = next
    slice
  }
}

data class CsTerminalLine(val command: String? = null, val output: String? = null)

fun csTerminalRun(history: List<CsTerminalLine>, command: String, output: String?): List<CsTerminalLine>? {
  if (command.trim().isEmpty()) return null
  val next = history.toMutableList()
  next += CsTerminalLine(command = command)
  if (!output.isNullOrEmpty()) next += CsTerminalLine(output = output)
  return next
}
const val csTerminalTitle = "cyberskill — zsh"
const val csTerminalInput = "Terminal input"
fun csTerminalCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("input" to "Ô nhập lệnh", "title" to csTerminalTitle)
  val en = mapOf("input" to csTerminalInput, "title" to csTerminalTitle)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csTerminalBarTitle(title: String?, fallback: String) = title ?: fallback
fun csTerminalSubmits(composing: Boolean, keyCode: Int) = !composing && keyCode != 229

data class CsCascaderNode(val key: String, val label: String, val children: List<CsCascaderNode> = emptyList())
data class CsCascaderPick(val path: List<String>, val commit: Boolean)
data class CsCascaderBack(val path: List<String>, val close: Boolean)
data class CsDockScale(val scale: Double, val lift: Double)

fun csCascaderOpen(requested: Boolean, disabled: Boolean) = requested && !disabled
fun csCascaderDismissOutside(open: Boolean, inside: Boolean) = open && !inside
const val csCascaderGap = 6.0
data class CsCascaderPlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csCascaderShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double): CsCascaderPlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, "bottom-start", csCascaderGap) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, csCascaderGap) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsCascaderPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}
fun csCascaderColumns(nodes: List<CsCascaderNode>, path: List<String>): List<List<CsCascaderNode>> {
  val columns = mutableListOf<List<CsCascaderNode>>()
  var level = nodes
  var depth = 0
  while (level.isNotEmpty()) {
    columns.add(level)
    level = level.firstOrNull { it.key == path.getOrNull(depth) }?.children ?: emptyList()
    depth++
  }
  return columns
}
fun csCascaderLabels(nodes: List<CsCascaderNode>, value: List<String>): List<String> {
  val labels = mutableListOf<String>()
  var level = nodes
  for (key in value) {
    val node = level.firstOrNull { it.key == key } ?: break
    labels.add(node.label)
    level = node.children
  }
  return labels
}
fun csCascaderSelect(path: List<String>, depth: Int, key: String, hasChildren: Boolean) = CsCascaderPick(path.take(depth) + key, !hasChildren)
fun csCascaderMove(index: Int, count: Int, key: String): Int? {
  if (count <= 0) return null
  return when (key) {
    "down" -> if (index < 0) 0 else minOf(count - 1, index + 1)
    "up" -> if (index < 0) count - 1 else maxOf(0, index - 1)
    "home" -> 0
    "end" -> count - 1
    else -> null
  }
}
fun csCascaderArrowLeft(path: List<String>, depth: Int): CsCascaderBack {
  if (path.isEmpty()) return CsCascaderBack(path, true)
  val parent = if (depth > 0) depth - 1 else maxOf(0, path.size - 1)
  return CsCascaderBack(path.take(parent), false)
}
fun csCascaderSlot(columns: List<List<CsCascaderNode>>, depth: Int, offset: Int) = columns.take(depth).sumOf { it.size } + offset
fun csCascaderLocate(index: Int, columns: List<List<CsCascaderNode>>): Pair<Int, CsCascaderNode>? {
  var seen = 0
  columns.forEachIndexed { depth, column ->
    if (index >= seen && index < seen + column.size) return depth to column[index - seen]
    seen += column.size
  }
  return null
}
fun csCascaderIndex(columns: List<List<CsCascaderNode>>, depth: Int, key: String): Int? {
  val column = columns.getOrNull(depth) ?: return null
  val offset = column.indexOfFirst { it.key == key }
  return if (offset < 0) null else csCascaderSlot(columns, depth, offset)
}
data class CsCascaderPress(val index: Int, val path: List<String>, val commit: Boolean, val close: Boolean)
fun csCascaderPress(key: String, index: Int, columns: List<List<CsCascaderNode>>, path: List<String>): CsCascaderPress? {
  return when (key) {
    "down", "up", "home", "end" -> {
      val next = csCascaderMove(index, columns.sumOf { it.size }, key) ?: return null
      CsCascaderPress(next, path, false, false)
    }
    "right" -> {
      val place = csCascaderLocate(index, columns) ?: return null
      val next = csCascaderSelect(path, place.first, place.second.key, place.second.children.isNotEmpty())
      CsCascaderPress(index, next.path, next.commit, next.commit)
    }
    "left" -> {
      val depth = csCascaderLocate(index, columns)?.first ?: -1
      val back = csCascaderArrowLeft(path, depth)
      if (back.close) return CsCascaderPress(index, path, false, true)
      val parentDepth = if (depth > 0) depth - 1 else maxOf(0, path.size - 1)
      val parentKey = path.getOrNull(parentDepth)
      val nextIndex = parentKey?.let { csCascaderIndex(columns, parentDepth, it) } ?: index
      CsCascaderPress(nextIndex, back.path, false, false)
    }
    else -> null
  }
}
fun csCascaderText(label: String, path: List<String>, nodes: List<CsCascaderNode>): String {
  val names = csCascaderLabels(nodes, path)
  if (names.isNotEmpty()) return names.joinToString(" / ")
  if (path.isEmpty()) return label
  return path.joinToString(" / ")
}
const val csCascaderPlaceholder = "Select…"
fun csCascaderCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("placeholder" to "Chọn…")
  val en = mapOf("placeholder" to csCascaderPlaceholder)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csCascaderPlaceholderText(text: String?, fallback: String) = text ?: fallback
fun csCascaderFace(labels: List<String>, placeholder: String) = if (labels.isEmpty()) placeholder else labels.joinToString(" / ")
fun csCascaderFieldName(label: String?, labelledBy: String?) = if (!labelledBy.isNullOrEmpty()) null else label
fun csDockScale(index: Int, hover: Int?): CsDockScale {
  val distance = if (hover == null) 3 else kotlin.math.abs(index - hover)
  return when (distance) {
    0 -> CsDockScale(1.35, -6.0)
    1 -> CsDockScale(1.15, -2.0)
    else -> CsDockScale(1.0, 0.0)
  }
}
@Composable fun CsCascader(path: List<String>, dark: Boolean, highContrast: Boolean, compact: Boolean, onChange: (List<String>) -> Unit, modifier: Modifier = Modifier, nodes: List<CsCascaderNode> = emptyList(), label: String? = null, labelledBy: String? = null, placeholder: String? = null, disabled: Boolean = false, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val hint = csCascaderPlaceholderText(placeholder, csCascaderCopy("placeholder", locale))
  val shown = csCascaderFace(csCascaderLabels(nodes, path), hint)
  val name = csCascaderFieldName(label, labelledBy)
  var requested by remember { mutableStateOf(false) }
  var draft by remember(path) { mutableStateOf(path) }
  var highlight by remember { mutableStateOf(-1) }
  var field by remember { mutableStateOf<CsFloatingRect?>(null) }
  var natural by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var fitted by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var origin by remember { mutableStateOf(0.0 to 0.0) }
  var panelScale by remember { mutableStateOf(1.0 to 1.0) }
  val opened = csCascaderOpen(requested, disabled)
  val config = LocalConfiguration.current
  val density = LocalDensity.current
  val viewWidth = with(density) { config.screenWidthDp.dp.toPx() }.toDouble()
  val viewHeight = with(density) { config.screenHeightDp.dp.toPx() }.toDouble()
  val viewport = CsFloatingRect(8.0, 8.0, maxOf(8.0, viewWidth - 8.0), maxOf(8.0, viewHeight - 8.0), 0.0, 0.0)
  val place = field?.let { box ->
    val first = natural
    val second = fitted
    if (first == null || second == null) null else csCascaderShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second)
  }
  val shiftX = with(density) { (place?.x ?: 0.0).toFloat().toDp() }
  val shiftY = with(density) { (place?.y ?: 0.0).toFloat().toDp() }
  LaunchedEffect(opened) { if (!opened) { natural = null; fitted = null } }
  Column(modifier.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
    if (event.key == Key.Escape && opened) { requested = false; highlight = -1; return@onPreviewKeyEvent true }
    val name = when (event.key) {
      Key.DirectionDown -> "down"
      Key.DirectionUp -> "up"
      Key.DirectionLeft -> "left"
      Key.DirectionRight -> "right"
      Key.MoveHome -> "home"
      Key.MoveEnd -> "end"
      else -> null
    } ?: return@onPreviewKeyEvent false
    if (!opened) {
      if (name != "down" || disabled || !csControlEnabled()) return@onPreviewKeyEvent false
      requested = true
      highlight = -1
      return@onPreviewKeyEvent true
    }
    val next = csCascaderPress(name, highlight, csCascaderColumns(nodes, draft), draft) ?: return@onPreviewKeyEvent false
    highlight = next.index
    draft = next.path
    if (next.commit) onChange(next.path)
    if (next.close) { requested = false; highlight = -1 }
    true
  }) {
    CsTriggerButton(title = shown, onClick = { if (!disabled) requested = !requested }, enabled = !disabled && csControlEnabled(), modifier = Modifier.onGloballyPositioned {
      val bounds = it.boundsInWindow()
      field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
    }.semantics { if (name != null) contentDescription = name; stateDescription = opened.toString() }) {
      Text(shown, color = pack.colorTextPrimary.toComposeColor(), modifier = if (name != null) Modifier.clearAndSetSemantics {} else Modifier)
      Text("▾", modifier = Modifier.clearAndSetSemantics {})
    }
    if (opened) Popup(alignment = Alignment.TopStart, onDismissRequest = { if (csCascaderDismissOutside(true, false)) { requested = false; highlight = -1 } }, properties = PopupProperties(focusable = false, dismissOnBackPress = false, dismissOnClickOutside = true)) { Row(Modifier.onGloballyPositioned {
      val bounds = it.boundsInWindow()
      val width = it.size.width.toDouble()
      val height = it.size.height.toDouble()
      if (width <= 0.0 || height <= 0.0) return@onGloballyPositioned
      val nextOrigin = bounds.left.toDouble() to bounds.top.toDouble()
      val nextScale = (bounds.width / width) to (bounds.height / height)
      val nextSize = width to height
      if (origin != nextOrigin) origin = nextOrigin
      if (panelScale != nextScale) panelScale = nextScale
      if (natural == null) natural = nextSize else if (fitted != nextSize) fitted = nextSize
    }.offset(x = shiftX, y = shiftY).widthIn(max = with(density) { (place?.maxWidth ?: viewWidth).toFloat().toDp() })) {
      val columns = csCascaderColumns(nodes, draft)
      var seen = 0
      columns.forEachIndexed { depth, column ->
        Column {
          column.forEachIndexed { offset, node ->
            val slot = seen + offset
            val picked = depth < draft.size && draft[depth] == node.key
            CsTriggerButton(title = node.label, onClick = {
              val next = csCascaderSelect(draft, depth, node.key, node.children.isNotEmpty())
              highlight = slot
              draft = next.path
              if (next.commit) { onChange(next.path); requested = false; highlight = -1 }
            }, modifier = Modifier.semantics { if (picked) stateDescription = "true" }) {
              Text(node.label, color = (if (slot == highlight) pack.colorBrandOchre else pack.colorTextPrimary).toComposeColor())
              if (node.children.isNotEmpty()) Text(" ›", modifier = Modifier.clearAndSetSemantics {})
            }
          }
        }
        seen += column.size
      }
    } }
  }
}
@Composable fun CsChart(label: String, values: List<Double>, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, type: String = "bar", pointLabels: List<String> = emptyList(), showValues: Boolean = false, emptyLabel: String = "", language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val kind = csChartKind(type)
  val color = pack.accent.toComposeColor()
  val announced = csChartAccessibleName(label, pointLabels.mapIndexed { index, name -> name to (values.getOrNull(index) ?: 0.0) }, csChartEmpty(emptyLabel, csChartCopy("empty", csComboboxResolvedLanguage(language, LocalCsLanguage.current))))
  val rows = csChartLegend(type, pointLabels, values, showValues)
  Column(modifier.semantics { contentDescription = announced }) {
  Canvas(Modifier.size(320.dp, 160.dp)) {
    val scaleX = size.width / 320f
    val scaleY = size.height / 160f
    when (kind) {
      "pie" -> {
        val fills = listOf(pack.accent, pack.accentStrong, pack.accentGradB, pack.colorTextMuted, pack.colorBorderDefault).map { it.toComposeColor() }
        csChartPie(values).forEachIndexed { index, slice ->
          if (slice == null) return@forEachIndexed
          val fill = fills[csChartSliceSlot(index)]
          if (slice.full) drawCircle(fill, 50f * scaleY, Offset(60f * scaleY, 60f * scaleY))
          else drawArc(fill, Math.toDegrees(slice.start).toFloat(), Math.toDegrees(slice.end - slice.start).toFloat(), true, Offset(10f * scaleY, 10f * scaleY), Size(100f * scaleY, 100f * scaleY))
        }
      }
      "line", "spark" -> {
        val points = csChartLine(values)
        points.zipWithNext().forEach { (start, end) -> drawLine(color, Offset((start.x * scaleX).toFloat(), (start.y * scaleY).toFloat()), Offset((end.x * scaleX).toFloat(), (end.y * scaleY).toFloat()), strokeWidth = 2.4f) }
        if (kind == "line") points.forEach { point -> drawCircle(color, 3.4f, Offset((point.x * scaleX).toFloat(), (point.y * scaleY).toFloat())) }
      }
      else -> csChartBars(values).forEach { bar -> if (bar.height > 0) drawRoundRect(color, Offset((bar.x * scaleX).toFloat(), (bar.y * scaleY).toFloat()), Size((bar.width * scaleX).toFloat(), (bar.height * scaleY).toFloat()), androidx.compose.ui.geometry.CornerRadius(3f, 3f)) }
    }
  }
  if (rows != null) Row { rows.forEach { Text(it) } }
  }
}
@Composable fun CsDock(label: String, items: List<String>, onSelect: (String) -> Unit, modifier: Modifier = Modifier) {
  var hover by remember { mutableStateOf<Int?>(null) }
  Row(modifier.onPointerEvent(PointerEventType.Exit) { hover = null }.semantics { contentDescription = label }) {
    items.forEachIndexed { index, item ->
      val interaction = remember(index) { MutableInteractionSource() }
      val hovered by interaction.collectIsHoveredAsState()
      val handle = rememberFocusHandle("dock-$index")
      LaunchedEffect(hovered) { if (hovered) hover = index }
      val mark = csDockScale(index, hover)
      TextButton(onClick = { handle.claim(); onSelect(item) }, Modifier.focusRequester(handle.requester).hoverable(interaction).onFocusChanged { if (it.isFocused) { hover = index; handle.claim() } else if (hover == index) hover = null }.offset(y = mark.lift.dp).graphicsLayer { scaleX = mark.scale.toFloat(); scaleY = mark.scale.toFloat() }.minimumInteractiveComponentSize(), enabled = csControlEnabled()) { Text(item) }
    }
  }
}
enum class CsEditorMark { Off, On, Mixed }
fun csEditorEscape(text: String) = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
fun csEditorPlainInsert(text: String) = csEditorEscape(text).replace("\r\n", "\n").replace("\n", "<br>")
fun csEditorWrapped(html: String, open: String, close: String) = html.startsWith(open) && html.endsWith(close) && html.length >= open.length + close.length
fun csEditorToggle(text: String, open: String, close: String) = if (csEditorWrapped(text, open, close)) text.substring(open.length, text.length - close.length) else open + text + close
fun csEditorList(text: String): String {
  if (csEditorWrapped(text, "<ul>", "</ul>")) return text.substring(4, text.length - 5).replace("</li><li>", "<br>").replace("<li>", "").replace("</li>", "")
  return "<ul>" + text.replace("\n", "<br>").split("<br>").joinToString("") { "<li>$it</li>" } + "</ul>"
}
fun csEditorSpan(start: Int, end: Int, length: Int): Pair<Int, Int> {
  val lower = start.coerceIn(0, length)
  val upper = end.coerceIn(lower, length)
  return lower to upper
}
fun csEditorMovedEnd(start: Int, end: Int, before: Int, after: Int) = start + (after - before + (end - start))
fun csEditorApply(html: String, command: String, start: Int, end: Int): String {
  val lower = start.coerceIn(0, html.length)
  val upper = end.coerceIn(lower, html.length)
  if (upper <= lower) return html
  val selected = html.substring(lower, upper)
  val changed = when (command) {
    "bold" -> csEditorToggle(selected, "<b>", "</b>")
    "italic" -> csEditorToggle(selected, "<i>", "</i>")
    "insertUnorderedList" -> csEditorList(selected)
    else -> return html
  }
  return html.substring(0, lower) + changed + html.substring(upper)
}
fun csEditorMark(samples: List<Boolean>, fallback: CsEditorMark): CsEditorMark {
  if (samples.isEmpty()) return fallback
  if (samples.all { it }) return CsEditorMark.On
  if (samples.any { it }) return CsEditorMark.Mixed
  return CsEditorMark.Off
}
fun csEditorCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("toolbar" to "Định dạng", "bold" to "Đậm", "italic" to "Nghiêng", "list" to "Danh sách", "area" to "Văn bản")
  val en = mapOf("toolbar" to "Formatting", "bold" to "Bold", "italic" to "Italic", "list" to "Bullet list", "area" to "Rich text")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csEditorName(label: String?, fallback: String) = label ?: fallback
fun csEditorPressed(current: Boolean) = !current
@Composable fun CsEditor(text: String, onChange: (String) -> Unit, modifier: Modifier = Modifier, label: String? = null, language: String? = null, selectionStart: Int = 0, selectionEnd: Int = 0, onSelection: (Int, Int) -> Unit = { _, _ -> }) {
  val handle = rememberFocusHandle("editor")
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val spoken = csEditorName(label, csEditorCopy("area", locale))
  var bold by remember { mutableStateOf(false) }
  var italic by remember { mutableStateOf(false) }
  var list by remember { mutableStateOf(false) }
  Column(modifier) {
    Row(Modifier.semantics { contentDescription = csEditorCopy("toolbar", locale) }) {
      CsTriggerButton(title = "B", onClick = { val span = csEditorSpan(selectionStart, selectionEnd, text.length); val next = csEditorApply(text, "bold", span.first, span.second); if (next == text) bold = csEditorPressed(bold) else { onSelection(span.first, csEditorMovedEnd(span.first, span.second, text.length, next.length)); onChange(next); bold = csEditorWrapped(next, "<b>", "</b>") } }, modifier = Modifier.semantics { contentDescription = csEditorCopy("bold", locale); stateDescription = bold.toString() }) { Text("B", modifier = Modifier.clearAndSetSemantics {}) }
      CsTriggerButton(title = "I", onClick = { val span = csEditorSpan(selectionStart, selectionEnd, text.length); val next = csEditorApply(text, "italic", span.first, span.second); if (next == text) italic = csEditorPressed(italic) else { onSelection(span.first, csEditorMovedEnd(span.first, span.second, text.length, next.length)); onChange(next); italic = csEditorWrapped(next, "<i>", "</i>") } }, modifier = Modifier.semantics { contentDescription = csEditorCopy("italic", locale); stateDescription = italic.toString() }) { Text("I", modifier = Modifier.clearAndSetSemantics {}) }
      CsTriggerButton(title = "≔", onClick = { val span = csEditorSpan(selectionStart, selectionEnd, text.length); val next = csEditorApply(text, "insertUnorderedList", span.first, span.second); if (next == text) list = csEditorPressed(list) else { onSelection(span.first, csEditorMovedEnd(span.first, span.second, text.length, next.length)); onChange(next); list = csEditorWrapped(next, "<ul>", "</ul>") } }, modifier = Modifier.semantics { contentDescription = csEditorCopy("list", locale); stateDescription = list.toString() }) { Text("≔", modifier = Modifier.clearAndSetSemantics {}) }
    }
    androidx.compose.foundation.text.BasicTextField(value = text, onValueChange = { next -> if (!csControlEnabled()) return@BasicTextField; handle.claim(); onChange(next) }, enabled = csControlEnabled(), modifier = Modifier.focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }.semantics { contentDescription = spoken })
  }
}
val LocalCsLanguage = androidx.compose.runtime.compositionLocalOf<String?> { null }
val LocalCsForm = androidx.compose.runtime.compositionLocalOf { false }
@Composable fun CsLanguage(language: String?, content: @Composable () -> Unit) {
  androidx.compose.runtime.CompositionLocalProvider(LocalCsLanguage provides language) { content() }
}
val LocalCsDisabled = androidx.compose.runtime.compositionLocalOf { false }
@Composable fun csControlEnabled(enabled: Boolean = true) = enabled && !LocalCsDisabled.current
@Composable fun CsForm(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
  androidx.compose.runtime.CompositionLocalProvider(LocalCsForm provides true) { Column(modifier) { content() } }
}
@Composable fun CsFieldset(legend: String? = null, disabled: Boolean = false, modifier: Modifier = Modifier, content: @Composable () -> Unit) {
  androidx.compose.runtime.CompositionLocalProvider(LocalCsForm provides true, LocalCsDisabled provides disabled) {
    Column(modifier.onPreviewKeyEvent { _ -> disabled }) {
      if (!legend.isNullOrEmpty()) Text(legend)
      Box {
        content()
        if (disabled) Box(Modifier.matchParentSize().pointerInput(disabled) {
          awaitPointerEventScope { while (true) { awaitPointerEvent() } }
        })
      }
    }
  }
}
fun csFormFieldShowsLabel(label: String) = label.trim().isNotEmpty()
fun csFormFieldShowsHint(hint: String?) = !hint.isNullOrEmpty()
fun csFormFieldAlert(error: String?) = !error.isNullOrEmpty()
fun csFormFieldCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("required" to "bắt buộc")
  val en = mapOf("required" to "required")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
@Composable fun CsFormField(label: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, hint: String? = null, error: String? = null, required: Boolean = false, language: String? = null, content: @Composable () -> Unit) {
  val pack = csModePack(dark, highContrast, compact)
  val mark = csFormFieldCopy("required", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  Column(modifier) {
    Row {
      if (csFormFieldShowsLabel(label)) Text(label, color = pack.colorTextPrimary.toComposeColor())
      if (required) Text("*", color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.semantics { contentDescription = mark })
    }
    content()
    if (csFormFieldAlert(error)) Text(error ?: "", color = pack.colorSemanticDangerText.toComposeColor(), modifier = Modifier.semantics { liveRegion = LiveRegionMode.Assertive }) else if (csFormFieldShowsHint(hint)) Text(hint ?: "")
  }
}
fun csFormArrayCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("addRow" to "Thêm dòng", "arrayContext" to "FormFieldArray phải được đặt bên trong Form")
  val en = mapOf("addRow" to "Add row", "arrayContext" to "FormFieldArray must be used inside Form")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csFormArrayAdd(text: String?, fallback: String) = if (text.isNullOrEmpty()) fallback else text
fun csFormArrayShowsLabel(label: String?) = !label.isNullOrEmpty()
fun csFormArrayCanAdd(count: Int, max: Int) = count < max
fun csFormArrayCanRemove(count: Int, min: Int) = count > min
fun csFormArrayContext(inForm: Boolean) = !inForm
fun csFormArrayAlert(inForm: Boolean) = csFormArrayContext(inForm)
@Composable fun CsFormFieldArray(rows: List<String>, removeLabel: String, onChange: (List<String>) -> Unit, modifier: Modifier = Modifier, label: String? = null, addLabel: String? = null, min: Int = 0, max: Int = 50, language: String? = null) {
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val add = csFormArrayAdd(addLabel, csFormArrayCopy("addRow", locale))
  if (csFormArrayAlert(LocalCsForm.current)) Text(csFormArrayCopy("arrayContext", locale), modifier.semantics { liveRegion = LiveRegionMode.Assertive })
  else Column(modifier) {
    if (csFormArrayShowsLabel(label)) Text(label ?: "")
    rows.forEachIndexed { index, row ->
      Row {
        Text(row)
        CsTriggerButton(title = removeLabel, onClick = { if (csFormArrayCanRemove(rows.size, min)) onChange(rows.filterIndexed { i, _ -> i != index }) }, enabled = csFormArrayCanRemove(rows.size, min)) { Text(removeLabel) }
      }
    }
    CsTriggerButton(title = add, onClick = { if (csFormArrayCanAdd(rows.size, max)) onChange(rows + "") }, enabled = csFormArrayCanAdd(rows.size, max)) { Text(add) }
  }
}
fun csFormWizardCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("back" to "Quay lại", "next" to "Tiếp", "finish" to "Hoàn tất", "step" to "Bước", "summary" to "Vui lòng sửa các mục sau:", "requiredField" to "Vui lòng nhập giá trị")
  val en = mapOf("back" to "Back", "next" to "Next", "finish" to "Finish", "step" to "Step", "summary" to "Please fix the following:", "requiredField" to "Enter a value")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csFormWizardButton(text: String?, fallback: String) = if (text.isNullOrEmpty()) fallback else text
fun csFormWizardStep(title: String, index: Int, fallback: String) = "${index + 1}. " + (if (title.isEmpty()) "$fallback ${index + 1}" else title)
fun csFormWizardCanBack(index: Int, pending: Boolean) = index > 0 && !pending
fun csFormWizardLast(index: Int, count: Int) = count > 0 && index >= count - 1
fun csFormWizardRequired(value: String?, fallback: String) = if (value?.trim().isNullOrEmpty()) fallback else null
fun interface CsWizardCheck { fun check(value: String?, values: Map<String, String>): String? }
data class CsWizardRule(val name: String, val check: CsWizardCheck)
fun csFormWizardCustom(message: String?) = message?.takeIf { it.isNotEmpty() }
data class CsWizardAdvance(val index: Int, val errors: List<String>, val completed: Boolean)
fun csFormWizardAdvance(index: Int, count: Int, pending: Boolean, values: Map<String, String>, required: List<String>, fallback: String, custom: List<CsWizardRule> = emptyList()): CsWizardAdvance? {
  if (pending) return null
  val messages = mutableListOf<String>()
  val failed = mutableSetOf<String>()
  for (name in required) {
    val message = csFormWizardRequired(values[name], fallback) ?: continue
    messages.add(message)
    failed.add(name)
  }
  for (rule in custom) {
    if (rule.name in failed) continue
    csFormWizardCustom(rule.check.check(values[rule.name], values))?.let { messages.add(it) }
  }
  if (messages.isNotEmpty()) return CsWizardAdvance(index, messages, false)
  if (csFormWizardLast(index, count)) return CsWizardAdvance(index, emptyList(), true)
  return CsWizardAdvance(index + 1, emptyList(), false)
}
fun csFormWizardSummary(errors: List<String>, submission: String?) = errors.isNotEmpty() || !submission.isNullOrEmpty()
fun csFormWizardAlert(errors: List<String>, submission: String?) = csFormWizardSummary(errors, submission)
@Composable fun CsFormWizard(steps: List<String>, index: Int, onIndex: (Int) -> Unit, modifier: Modifier = Modifier, backLabel: String? = null, nextLabel: String? = null, finishLabel: String? = null, errors: List<String> = emptyList(), values: Map<String, String> = emptyMap(), required: List<String> = emptyList(), custom: List<CsWizardRule> = emptyList(), submission: String? = null, pending: Boolean = false, language: String? = null, onComplete: () -> Unit = {}) {
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val active = if (steps.isEmpty()) 0 else index.coerceIn(0, steps.lastIndex)
  val last = csFormWizardLast(active, steps.size)
  val back = csFormWizardButton(backLabel, csFormWizardCopy("back", locale))
  val next = csFormWizardButton(nextLabel, csFormWizardCopy("next", locale))
  val finish = csFormWizardButton(finishLabel, csFormWizardCopy("finish", locale))
  var ruled by remember { mutableStateOf<List<String>?>(null) }
  val liveErrors = ruled ?: errors
  Column(modifier.semantics { if (pending) stateDescription = "true" }) {
    steps.forEachIndexed { offset, title ->
      Text(csFormWizardStep(title, offset, csFormWizardCopy("step", locale)), modifier = Modifier.semantics { if (offset == active) stateDescription = "step" })
    }
    if (csFormWizardAlert(liveErrors, submission)) Column(Modifier.semantics { liveRegion = LiveRegionMode.Assertive }) {
      Text(csFormWizardCopy("summary", locale))
      if (!submission.isNullOrEmpty()) Text(submission)
      liveErrors.forEach { Text(it) }
    }
    if (steps.isNotEmpty()) Row {
      CsTriggerButton(title = back, onClick = { if (csFormWizardCanBack(active, pending)) { ruled = emptyList(); onIndex(active - 1) } }, enabled = csFormWizardCanBack(active, pending)) { Text(back) }
      CsTriggerButton(title = if (last) finish else next, onClick = {
        val step = csFormWizardAdvance(active, steps.size, pending, values, required, csFormWizardCopy("requiredField", locale), custom) ?: return@CsTriggerButton
        ruled = step.errors
        if (step.errors.isNotEmpty()) return@CsTriggerButton
        if (step.completed) onComplete() else onIndex(step.index)
      }, enabled = !pending) { Text(if (last) finish else next) }
    }
  }
}
@Composable fun CsHotKeys(bindings: List<Pair<String, String>>, onTrigger: (String) -> Unit, modifier: Modifier = Modifier, help: Boolean = true, language: String? = null) {
  var open by remember { mutableStateOf(false) }
  val spoken = csHotKeyCopy("title", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  val toggle = csHotKeyCopy("toggle", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  Column(modifier.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
    if (event.key == Key.Escape) {
      if (!open) return@onPreviewKeyEvent false
      open = false
      return@onPreviewKeyEvent true
    }
    val question = event.key == Key.Slash && event.isShiftPressed
    val next = csHotKeyNextOpen(open, csHotKeyHelp(if (question) "?" else "", event.isCtrlPressed, event.isMetaPressed, event.isAltPressed, help), false)
    if (next != null) {
      open = next
      return@onPreviewKeyEvent true
    }
    val matched = if (question) bindings.firstOrNull { csHotKeyMatches(it.first, CsKeyEvent("?", event.isCtrlPressed, event.isMetaPressed, event.isShiftPressed, event.isAltPressed)) } else null
    if (matched != null) {
      onTrigger(matched.first)
      return@onPreviewKeyEvent true
    }
    false
  }) {
    bindings.forEach { val title = it.first + " " + it.second; CsTriggerButton(title = title, onClick = { onTrigger(it.first) }, modifier = Modifier.minimumInteractiveComponentSize()) { Text(title) } }
    if (open) Column(Modifier.semantics { contentDescription = spoken }) { Text(spoken); bindings.forEach { Text(it.second); Text(it.first) }; Text(toggle); Text("?") }
  }
}
fun csHoverPlacement(explicit: String?) = explicit ?: "bottom-start"
const val csHoverGap = 8.0
data class CsHoverPlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csHoverShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String): CsHoverPlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement, csHoverGap) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, csHoverGap) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsHoverPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}
fun csHoverOpen(hovered: Boolean, focused: Boolean) = hovered || focused
fun csHoverDelay(opening: Boolean, openDelay: Int = 150, closeDelay: Int = 200) = if (opening) openDelay else closeDelay
fun csHoverSyncAfterLeave(focused: Boolean) = !focused
fun csHoverSyncAfterBlur(hovered: Boolean) = !hovered
@Composable fun CsHoverCard(label: String, modifier: Modifier = Modifier, openDelay: Int = 150, closeDelay: Int = 200, content: @Composable () -> Unit) {
  var hovered by remember { mutableStateOf(false) }
  var focused by remember { mutableStateOf(false) }
  var open by remember { mutableStateOf(false) }
  var request by remember { mutableStateOf(0) }
  var field by remember { mutableStateOf<CsFloatingRect?>(null) }
  var natural by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var fitted by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var origin by remember { mutableStateOf(0.0 to 0.0) }
  var panelScale by remember { mutableStateOf(1.0 to 1.0) }
  val config = LocalConfiguration.current
  val density = LocalDensity.current
  val viewWidth = with(density) { config.screenWidthDp.dp.toPx() }.toDouble()
  val viewHeight = with(density) { config.screenHeightDp.dp.toPx() }.toDouble()
  val viewport = CsFloatingRect(8.0, 8.0, maxOf(8.0, viewWidth - 8.0), maxOf(8.0, viewHeight - 8.0), 0.0, 0.0)
  val place = field?.let { box ->
    val first = natural
    val second = fitted
    if (first == null || second == null) null else csHoverShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second, csHoverPlacement(null))
  }
  if (!open && natural != null) { natural = null; fitted = null }
  LaunchedEffect(request) {
    if (request == 0) return@LaunchedEffect
    val next = csHoverOpen(hovered, focused)
    delay(csHoverDelay(next, openDelay, closeDelay).toLong())
    open = next
  }
  Column(modifier.onPointerEvent(PointerEventType.Enter) { hovered = true; request += 1 }.onPointerEvent(PointerEventType.Exit) { hovered = false; if (csHoverSyncAfterLeave(focused)) request += 1 }.onFocusChanged { state ->
    val entering = state.isFocused
    focused = entering
    if (entering || csHoverSyncAfterBlur(hovered)) request += 1
  }.onPreviewKeyEvent { event ->
    if (event.type == KeyEventType.KeyDown && event.key == Key.Escape) {
      open = false
      request = 0
      true
    } else false
  }) {
    Box(Modifier.onGloballyPositioned {
      val bounds = it.boundsInWindow()
      field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
    }) { content() }
    if (open) Text(label, modifier = Modifier.onGloballyPositioned {
      val bounds = it.boundsInWindow()
      val width = it.size.width.toDouble()
      val height = it.size.height.toDouble()
      if (width <= 0.0 || height <= 0.0) return@onGloballyPositioned
      val nextOrigin = bounds.left.toDouble() to bounds.top.toDouble()
      val nextScale = (bounds.width / width) to (bounds.height / height)
      val nextSize = width to height
      if (origin != nextOrigin) origin = nextOrigin
      if (panelScale != nextScale) panelScale = nextScale
      if (natural == null) natural = nextSize else if (fitted != nextSize) fitted = nextSize
    }.offset(x = with(density) { (place?.x ?: 0.0).toFloat().toDp() }, y = with(density) { (place?.y ?: 0.0).toFloat().toDp() }).alpha(if (place == null) 0f else 1f))
  }
}
enum class CsPresence { Absent, Zero, Text }
fun csPresenceShown(kind: CsPresence, text: String = "") = when (kind) {
  CsPresence.Absent -> false
  CsPresence.Zero -> true
  CsPresence.Text -> text.isNotEmpty()
}
fun csNativeLabelId(id: String, shown: Boolean) = if (shown) "$id-label" else null
fun csNativeErrorId(id: String, shown: Boolean) = if (shown) "$id-err" else null
fun csNativeLabelledBy(explicit: String?, hasAriaLabel: Boolean, labelId: String?) = explicit ?: if (hasAriaLabel) null else labelId
fun csNativeInvalid(hasError: Boolean, passed: Boolean?) = if (hasError) true else passed
const val csSelectPlaceholder = "Select…"
fun csSelectShowsPlaceholder(placeholder: String?, hasChildren: Boolean) = placeholder != null || !hasChildren
fun csSelectPlaceholderText(placeholder: String?, fallback: String) = placeholder ?: fallback
fun csSelectControlId(id: String?, generated: String) = id ?: generated
const val csInputGroupInput = "Input"
fun csInputGroupText(controlled: String?, inner: String) = controlled ?: inner
fun csInputGroupAddonName(ariaLabel: String?, hasLabel: Boolean, hasLabelledBy: Boolean, placeholder: String?, fallback: String) = when {
  ariaLabel != null -> ariaLabel
  hasLabel || hasLabelledBy -> null
  !placeholder.isNullOrEmpty() -> placeholder
  else -> fallback
}
const val csReviewRegion = "Human review gate"
const val csReviewRisk = "review required"
const val csReviewerPrefix = "Reviewer"
fun csReviewRiskText(risk: String?, fallback: String) = risk ?: fallback
fun csReviewAction(label: String?, fallback: String) = label ?: fallback
fun csReviewerLine(reviewer: String?, prefix: String) = if (reviewer.isNullOrEmpty()) null else "$prefix: $reviewer"
fun csReviewCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf(
    "aria" to "Cổng kiểm duyệt của con người",
    "risk" to "cần xem xét",
    "approve" to "Phê duyệt",
    "reject" to "Từ chối",
    "reviewer" to "Người duyệt",
  )
  val en = mapOf("aria" to csReviewRegion, "risk" to csReviewRisk, "approve" to "Approve", "reject" to "Reject", "reviewer" to csReviewerPrefix)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
@Composable fun CsHumanReviewGate(summary: String, onApprove: () -> Unit, onReject: () -> Unit, modifier: Modifier = Modifier, risk: String? = null, approveLabel: String? = null, rejectLabel: String? = null, reviewer: String? = null, language: String? = null) {
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val riskText = csReviewRiskText(risk, csReviewCopy("risk", locale))
  val rejectName = csReviewAction(rejectLabel, csReviewCopy("reject", locale))
  val approveName = csReviewAction(approveLabel, csReviewCopy("approve", locale))
  val line = csReviewerLine(reviewer, csReviewCopy("reviewer", locale))
  Column(modifier.semantics { contentDescription = csReviewCopy("aria", locale) }) {
    Text(riskText)
    Text(summary)
    if (line != null) Text(line)
    CsTriggerButton(title = rejectName, onClick = onReject) { Text(rejectName) }
    CsTriggerButton(title = approveName, onClick = onApprove) { Text(approveName) }
  }
}
fun csInlineCommit(draft: String, value: String, cancelling: Boolean = false) = if (cancelling || draft == value) null else draft
fun csInlineText(value: String, empty: String) = value.ifEmpty { empty }
fun csInlineControlled(value: String?, inner: String) = value ?: inner
fun csInlineEnter(composing: Boolean, keyCode: Int) = !composing && keyCode != 229
fun csInlineEditLabel(action: String, label: String) = if (label.isEmpty()) action else "$action: $label"
fun csInlineFieldName(label: String, edit: String) = if (label.isEmpty()) edit else label
fun csInlineCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("edit" to "Sửa", "empty" to "Thêm nội dung")
  val en = mapOf("edit" to "Edit", "empty" to "Add text")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
@Composable fun CsInlineEdit(label: String, value: String, onChange: (String) -> Unit, modifier: Modifier = Modifier, editAction: String = "", emptyLabel: String = "", language: String? = null) {
  var editing by remember { mutableStateOf(false) }
  var draft by remember(value) { mutableStateOf(value) }
  var cancelling by remember { mutableStateOf(false) }
  var closed by remember { mutableStateOf(false) }
  var sawFocus by remember { mutableStateOf(false) }
  val editId = remember { csOverlayFreshId("inline-edit") }
  val editRequester = remember { FocusRequester() }
  val draftId = remember { csOverlayFreshId("inline-draft") }
  val draftRequester = remember { FocusRequester() }
  DisposableEffect(editId) { onDispose { CsFocusRegistry.disconnect(editId); CsFocusRegistry.disconnect(draftId) } }
  fun claimEdit() { CsFocusRegistry.claim(editId) { editRequester.requestFocus() } }
  fun claimDraft() { CsFocusRegistry.claim(draftId) { draftRequester.requestFocus() } }
  fun finish() {
    if (closed) return
    claimEdit()
    closed = true
    val next = csInlineCommit(draft, value, cancelling)
    cancelling = false
    editing = false
    if (next != null) onChange(next)
  }
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val edit = editAction.ifEmpty { csInlineCopy("edit", locale) }
  val empty = emptyLabel.ifEmpty { csInlineCopy("empty", locale) }
  if (!editing) {
    val shown = csInlineText(value, empty)
    TextButton(onClick = { claimEdit(); closed = false; sawFocus = false; cancelling = false; draft = value; editing = true }, modifier.focusRequester(editRequester).onFocusChanged { if (it.isFocused) claimEdit() }.semantics { contentDescription = csInlineEditLabel(edit, label) }, enabled = csControlEnabled()) {
      Row {
        Text(shown, modifier = Modifier.clearAndSetSemantics {})
        if (csInlineShowsPen(editing)) Canvas(Modifier.size(13.dp).clearAndSetSemantics {}) {
          drawPath(csIconPathData(csInlinePen, size.minDimension), LocalContentColor.current, style = Stroke(width = 1.9f, cap = StrokeCap.Round, join = StrokeJoin.Round))
        }
      }
    }
  } else {
    BasicTextField(value = draft, onValueChange = { if (!csControlEnabled()) return@BasicTextField; claimDraft(); draft = it }, enabled = csControlEnabled(), modifier = modifier.focusRequester(draftRequester).semantics { contentDescription = csInlineFieldName(label, edit) }.onFocusChanged { state -> if (state.isFocused) { sawFocus = true; claimDraft() } else if (sawFocus) finish() }.onPreviewKeyEvent { event ->
      if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
      when (event.key) {
        Key.Enter -> {
          if (csInlineEnter(false, 13)) finish()
          true
        }
        Key.Escape -> {
          cancelling = true
          draft = value
          finish()
          true
        }
        else -> false
      }
    })
  }
}
const val csInlinePen = "M4 20l4.5-.9L20 7.6a2 2 0 0 0-2.8-2.8L5.7 16.3 4 20z"
fun csInlineShowsPen(editing: Boolean) = !editing
fun csInputShowsClear(clearable: Boolean, value: String) = clearable && value.isNotEmpty()
fun csInputCanClear(disabled: Boolean, readOnly: Boolean) = !disabled && !readOnly
fun csInputCanReveal(disabled: Boolean) = !disabled
fun csInputRevealLabel(revealed: Boolean, show: String = "Show password", hide: String = "Hide password") = if (revealed) hide else show
fun csInputCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("input" to "Ô nhập", "clear" to "Xóa", "show" to "Hiện mật khẩu", "hide" to "Ẩn mật khẩu")
  val en = mapOf("input" to "Input", "clear" to "Clear", "show" to "Show password", "hide" to "Hide password")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
@Composable fun CsInputGroup(label: String, modifier: Modifier = Modifier, text: String = "", onText: (String) -> Unit = {}, clearable: Boolean = false, password: Boolean = false, revealed: Boolean = false, onReveal: (Boolean) -> Unit = {}, disabled: Boolean = false, readOnly: Boolean = false, language: String? = null, content: @Composable () -> Unit) {
  val handle = rememberFocusHandle("input-group")
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val fieldName = csInputGroupAddonName(null, label.isNotEmpty(), false, null, csInputCopy("input", locale)) ?: label
  val clearName = csInputCopy("clear", locale)
  val revealName = csInputRevealLabel(revealed, csInputCopy("show", locale), csInputCopy("hide", locale))
  Column(modifier) {
    if (label.isNotEmpty()) Text(label, modifier = Modifier.clearAndSetSemantics {})
    Row {
      androidx.compose.foundation.text.BasicTextField(value = text, onValueChange = { next -> if (!csControlEnabled()) return@BasicTextField; handle.claim(); if (!disabled && !readOnly) onText(next) }, enabled = csControlEnabled(!disabled && !readOnly), modifier = Modifier.weight(1f).focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }.semantics { contentDescription = fieldName })
      content()
      if (csInputShowsClear(clearable, text)) CsTriggerButton(title = clearName, onClick = { if (csInputCanClear(disabled, readOnly)) onText("") }, enabled = csInputCanClear(disabled, readOnly), modifier = Modifier.semantics { contentDescription = clearName }) { Text(clearName, modifier = Modifier.clearAndSetSemantics {}) }
      if (password) CsTriggerButton(title = revealName, onClick = { if (csInputCanReveal(disabled)) onReveal(!revealed) }, enabled = csInputCanReveal(disabled), modifier = Modifier.semantics { contentDescription = revealName; stateDescription = if (revealed) "true" else "false" }) { Text(revealName, modifier = Modifier.clearAndSetSemantics {}) }
    }
  }
}
@Composable fun CsItem(title: String, subtitle: String = "", modifier: Modifier = Modifier) { Column(modifier) { Text(title); if (subtitle.isNotEmpty()) Text(subtitle) } }
@Composable fun CsLocaleProvider(language: String, modifier: Modifier = Modifier, content: @Composable () -> Unit) { Column(modifier) { content() } }
@Composable fun CsLumiAvatar(alt: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) { CsIcon(name = "sparkle", label = alt, dark = dark, highContrast = highContrast, compact = compact, modifier = modifier) }
@Composable fun CsMasonry(columns: Int, modifier: Modifier = Modifier, content: @Composable () -> Unit) { Column(modifier) { content() } }
@Composable fun CsMenuItem(title: String, onSelect: () -> Unit, modifier: Modifier = Modifier) {
  val handle = rememberFocusHandle("menu-item")
  TextButton(onClick = { handle.claim(); onSelect() }, modifier.focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }.minimumInteractiveComponentSize(), enabled = csControlEnabled()) { Text(title) }
}
fun csNativeSelectAlert(error: String?) = error != null && csPresenceShown(CsPresence.Text, error)
@Composable fun CsNativeSelect(label: String, options: List<String>, selection: String, onSelect: (String) -> Unit, modifier: Modifier = Modifier, error: String? = null, disabled: Boolean = false, disabledOptions: Set<String> = emptySet(), dark: Boolean = false, highContrast: Boolean = false, compact: Boolean = false) {
  val handle = rememberFocusHandle("select")
  val pack = csModePack(dark, highContrast, compact)
  val enabled = csControlEnabled(!disabled)
  Column(modifier.csOwnFocus()) {
    if (csPresenceShown(CsPresence.Text, label)) Text(label)
    Box {
      Column {
        options.forEach { option ->
          val rowEnabled = enabled && option !in disabledOptions
          TextButton(onClick = {
            if (!rowEnabled) return@TextButton
            handle.claim()
            onSelect(option)
          }, enabled = rowEnabled) { Text(option) }
        }
      }
      CsIcon(name = "chevron-down", label = "", dark = dark, highContrast = highContrast, compact = compact, modifier = Modifier.align(Alignment.CenterEnd).clearAndSetSemantics { })
    }
    if (csNativeSelectAlert(error)) Text(error ?: "", color = pack.colorSemanticDangerText.toComposeColor(), modifier = Modifier.semantics { liveRegion = LiveRegionMode.Assertive })
  }
}
@Composable fun CsNavItem(title: String, active: Boolean, onSelect: () -> Unit, modifier: Modifier = Modifier) {
  val handle = rememberFocusHandle("nav-item")
  TextButton(onClick = { handle.claim(); onSelect() }, modifier.focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }.minimumInteractiveComponentSize(), enabled = csControlEnabled()) { Text(title) }
}
@Composable fun CsOverlayProvider(modifier: Modifier = Modifier, content: @Composable () -> Unit) { Column(modifier) { content() } }
const val csPromptPlaceholder = "Type your wish…"
const val csPromptSend = "Send"
const val csPromptHint = "Lumi replies, then hands clear wishes to a human."
fun csPromptCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf(
    "placeholder" to "Nhập điều ước của bạn…",
    "send" to "Gửi",
    "hint" to "Lumi trả lời, rồi chuyển điều ước rõ ràng cho con người.",
  )
  val en = mapOf("placeholder" to csPromptPlaceholder, "send" to csPromptSend, "hint" to csPromptHint)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csPromptText(controlled: String?, inner: String) = controlled ?: inner
fun csPromptPlaceholderText(text: String?, fallback: String) = text ?: fallback
fun csPromptSpoken(ariaLabel: String?, placeholder: String) = if (!ariaLabel.isNullOrEmpty()) ariaLabel else placeholder
fun csPromptHintText(hint: String?, fallback: String) = if (csPromptShowsHint(hint)) hint ?: fallback else null
fun csPromptCanType(disabled: Boolean) = !disabled
fun csPromptCanSend(disabled: Boolean, busy: Boolean) = !disabled && !busy
fun csPromptSubmit(value: String, disabled: Boolean, busy: Boolean): String? {
  if (disabled || busy || value.trim().isEmpty()) return null
  return value
}
fun csPromptEnter(shift: Boolean, composing: Boolean, keyCode: Int) = !shift && !composing && keyCode != 229
fun csPromptShowsHint(hint: String?) = hint == null || hint.isNotEmpty()
@Composable fun CsPromptInput(text: String, onSubmit: (String) -> Unit, modifier: Modifier = Modifier, onText: (String) -> Unit = {}, submitLabel: String? = null, placeholder: String? = null, hint: String? = null, ariaLabel: String? = null, disabled: Boolean = false, busy: Boolean = false, language: String? = null) {
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val prompt = csPromptPlaceholderText(placeholder, csPromptCopy("placeholder", locale))
  val name = csPromptSpoken(ariaLabel, prompt)
  val sendName = submitLabel ?: csPromptCopy("send", locale)
  val hintLine = csPromptHintText(hint, csPromptCopy("hint", locale))
  val submitted = csPromptSubmit(text, disabled, busy)
  val handle = rememberFocusHandle("prompt")
  Column(modifier) {
    androidx.compose.foundation.text.BasicTextField(value = text, onValueChange = { next -> if (!csPromptCanType(disabled) || !csControlEnabled()) return@BasicTextField; handle.claim(); onText(next) }, enabled = csPromptCanType(disabled) && csControlEnabled(), modifier = Modifier.focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }.semantics { contentDescription = name })
    if (hintLine != null) Text(hintLine)
    CsTriggerButton(title = sendName, onClick = { submitted?.let(onSubmit) }, enabled = csPromptCanSend(disabled, busy) && csControlEnabled()) { Text(sendName) }
  }
}
data class CsPromptSuggestion(val label: String, val icon: String? = null)
fun csPromptIcon(icon: String?) = icon ?: "sparkle"
fun csPromptChosen(label: String, hasHandler: Boolean) = if (hasHandler) label else null
fun csPromptSelected(suggestion: CsPromptSuggestion) = suggestion.label
@Composable fun CsPromptSuggestions(suggestions: List<CsPromptSuggestion>, onSelect: (String) -> Unit, dark: Boolean = false, highContrast: Boolean = false, compact: Boolean = false, modifier: Modifier = Modifier) {
  Column(modifier) {
    suggestions.forEach { item ->
      CsTriggerButton(title = item.label, onClick = { onSelect(csPromptSelected(item)) }, modifier = Modifier.minimumInteractiveComponentSize()) {
        Row { CsIcon(name = csPromptIcon(item.icon), label = "", dark = dark, highContrast = highContrast, compact = compact); Text(item.label) }
      }
    }
  }
}
@Composable fun CsQRCode(value: String, label: String, modifier: Modifier = Modifier) {
  val modules = csQrMatrix(value)
  if (modules == null) Text("—", modifier)
  else Canvas(modifier.size(128.dp)) {
    val cell = size.minDimension / modules.size
    modules.forEachIndexed { y, row -> row.forEachIndexed { x, on -> if (on) drawRect(Color.Black, Offset(x * cell, y * cell), Size(cell, cell)) } }
  }
}
const val csTreeSelectPlaceholder = "Select…"
fun csTreeSelectCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("placeholder" to "Chọn…")
  val en = mapOf("placeholder" to csTreeSelectPlaceholder)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csTreeSelectPlaceholderText(text: String?, fallback: String) = text ?: fallback
fun csTreeSelectFind(nodes: List<CsTreeNode>, key: String?): CsTreeNode? {
  if (key == null) return null
  for (node in nodes) {
    if (node.key == key) return node
    csTreeSelectFind(node.children, key)?.let { return it }
  }
  return null
}
fun csTreeSelectFace(found: String?, placeholder: String) = found ?: placeholder
fun csTreeSelectCommits(node: CsTreeNode) = node.children.isEmpty()
fun csTreeSelectShown(requested: Boolean, disabled: Boolean) = requested && !disabled
fun csTreeSelectDismissOutside(open: Boolean, inside: Boolean) = open && !inside
const val csTreeSelectGap = 6.0
data class CsTreeSelectPlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csTreeSelectShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double): CsTreeSelectPlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, "bottom-start", csTreeSelectGap) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, csTreeSelectGap) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsTreeSelectPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}
fun csTreeSelectFieldName(label: String?, labelledBy: String?) = if (!labelledBy.isNullOrEmpty()) null else label
fun csTreeSelectTreeName(label: String?, labelledBy: String?, placeholder: String) = when {
  !labelledBy.isNullOrEmpty() -> null
  !label.isNullOrEmpty() -> label
  else -> placeholder
}
@Composable fun CsTreeSelect(nodes: List<CsTreeNode>, selected: String?, onSelect: (String) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, labelledBy: String? = null, open: Map<String, Boolean> = emptyMap(), placeholder: String? = null, disabled: Boolean = false, language: String? = null) {
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val hint = csTreeSelectPlaceholderText(placeholder, csTreeSelectCopy("placeholder", locale))
  val found = csTreeSelectFind(nodes, selected)
  val shown = csTreeSelectFace(found?.label, hint)
  val name = csTreeSelectFieldName(label, labelledBy)
  val tree = csTreeSelectTreeName(label, labelledBy, hint) ?: ""
  var requested by remember { mutableStateOf(false) }
  var field by remember { mutableStateOf<CsFloatingRect?>(null) }
  var natural by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var fitted by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var origin by remember { mutableStateOf(0.0 to 0.0) }
  var panelScale by remember { mutableStateOf(1.0 to 1.0) }
  val opened = csTreeSelectShown(requested, disabled)
  val config = LocalConfiguration.current
  val density = LocalDensity.current
  val viewWidth = with(density) { config.screenWidthDp.dp.toPx() }.toDouble()
  val viewHeight = with(density) { config.screenHeightDp.dp.toPx() }.toDouble()
  val viewport = CsFloatingRect(8.0, 8.0, maxOf(8.0, viewWidth - 8.0), maxOf(8.0, viewHeight - 8.0), 0.0, 0.0)
  val place = field?.let { box ->
    val first = natural
    val second = fitted
    if (first == null || second == null) null else csTreeSelectShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second)
  }
  val shiftX = with(density) { (place?.x ?: 0.0).toFloat().toDp() }
  val shiftY = with(density) { (place?.y ?: 0.0).toFloat().toDp() }
  if (!opened && natural != null) { natural = null; fitted = null }
  Column(modifier) {
    CsTriggerButton(title = shown, onClick = { if (!disabled) requested = !requested }, enabled = !disabled && csControlEnabled(), modifier = Modifier.onGloballyPositioned {
      val bounds = it.boundsInWindow()
      field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
    }.semantics { if (name != null) contentDescription = name; stateDescription = opened.toString() }) {
      Text(shown, modifier = Modifier.clearAndSetSemantics {})
      Text("▾", modifier = Modifier.clearAndSetSemantics {})
    }
    if (opened) Popup(alignment = Alignment.TopStart, onDismissRequest = { if (csTreeSelectDismissOutside(true, false)) requested = false }, properties = PopupProperties(focusable = false, dismissOnBackPress = false, dismissOnClickOutside = true)) { Column(Modifier.onGloballyPositioned {
      val bounds = it.boundsInWindow()
      val width = it.size.width.toDouble()
      val height = it.size.height.toDouble()
      if (width <= 0.0 || height <= 0.0) return@onGloballyPositioned
      val nextOrigin = bounds.left.toDouble() to bounds.top.toDouble()
      val nextScale = (bounds.width / width) to (bounds.height / height)
      val nextSize = width to height
      if (origin != nextOrigin) origin = nextOrigin
      if (panelScale != nextScale) panelScale = nextScale
      if (natural == null) natural = nextSize else if (fitted != nextSize) fitted = nextSize
    }.offset(x = shiftX, y = shiftY).widthIn(max = with(density) { (place?.maxWidth ?: viewWidth).toFloat().toDp() }).onPreviewKeyEvent { event ->
      if (event.type != KeyEventType.KeyDown || event.key != Key.Escape) return@onPreviewKeyEvent false
      requested = false
      true
    }) {
      CsTree(tree, nodes, open, selected, { key ->
        val node = csTreeSelectFind(nodes, key) ?: return@CsTree
        if (!csTreeSelectCommits(node)) return@CsTree
        onSelect(key)
        requested = false
      }, dark, highContrast, compact)
    } }
  }
}
data class CsTreeTableNode(val key: String, val label: String = "", val children: List<CsTreeTableNode> = emptyList())
data class CsTreeTableRow(val key: String, val label: String, val depth: Int, val expandable: Boolean, val open: Boolean, val children: List<String> = emptyList())
fun csTreeRowId(prefix: String, key: String) = prefix + "-row-" + key.toCharArray().joinToString("") { it.code.toString(16).padStart(4, '0') }
fun csTreeToggle(expanded: List<String>, key: String) = if (key in expanded) expanded.filter { it != key } else expanded + key
fun csTreeRows(nodes: List<CsTreeTableNode>, expanded: List<String>, depth: Int = 0): List<CsTreeTableRow> = nodes.flatMap { node ->
  val open = node.key in expanded
  val row = CsTreeTableRow(node.key, node.label, depth, node.children.isNotEmpty(), open, node.children.map { it.key })
  if (open) listOf(row) + csTreeRows(node.children, expanded, depth + 1) else listOf(row)
}
fun csTreeIndent(depth: Int) = depth * 18
fun csTreeControls(prefix: String, children: List<String>, open: Boolean) = if (!open || children.isEmpty()) null else children.joinToString(" ") { csTreeRowId(prefix, it) }
fun csTreeTableCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("empty" to "Không có kết quả", "expand" to "Mở rộng", "collapse" to "Thu gọn")
  val en = mapOf("empty" to "No results", "expand" to "Expand", "collapse" to "Collapse")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csTreeTableWord(text: String, fallback: String) = if (text.isEmpty()) fallback else text
fun csTreeTableShowsCaption(caption: String?) = !caption.isNullOrEmpty()
fun csTreeTableTwist(action: String, cell: String) = "$action $cell"
private val csTreeControlsKey = SemanticsPropertyKey<String>("Controls")
private var SemanticsPropertyReceiver.csTreeControlsValue by csTreeControlsKey
@Composable fun CsTreeTable(columns: List<String>, nodes: List<CsTreeTableNode>, onExpanded: (List<String>) -> Unit = {}, modifier: Modifier = Modifier, expanded: List<String> = emptyList(), emptyLabel: String = "", expandLabel: String = "", collapseLabel: String = "", caption: String? = null, language: String? = null) {
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val empty = csTreeTableWord(emptyLabel, csTreeTableCopy("empty", locale))
  val expand = csTreeTableWord(expandLabel, csTreeTableCopy("expand", locale))
  val collapse = csTreeTableWord(collapseLabel, csTreeTableCopy("collapse", locale))
  val visible = csTreeRows(nodes, expanded)
  val treeId = remember { java.util.UUID.randomUUID().toString() }
  Column(modifier) {
    if (csTreeTableShowsCaption(caption)) Text(caption ?: "")
    Text(columns.joinToString(" "))
    if (visible.isEmpty()) Text(empty)
    visible.forEach { row ->
      val cell = row.label.ifEmpty { row.key }
      Row(Modifier.padding(start = csTreeIndent(row.depth).dp)) {
        if (row.expandable) CsTriggerButton(title = if (row.open) "▾" else "▸", onClick = { onExpanded(csTreeToggle(expanded, row.key)) }, modifier = Modifier.semantics { contentDescription = csTreeTableTwist(if (row.open) collapse else expand, cell); stateDescription = row.open.toString(); csTreeControls(treeId, row.children, row.open)?.let { csTreeControlsValue = it } }.minimumInteractiveComponentSize()) { Text(if (row.open) "▾" else "▸", modifier = Modifier.clearAndSetSemantics {}) }
        Text(cell)
      }
    }
  }
}
@Composable fun CsTerminal(history: List<CsTerminalLine>, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, title: String? = null, prompt: String = "➜", language: String? = null, onCommand: (String) -> String? = { null }) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val bar = csTerminalBarTitle(title, csTerminalCopy("title", locale))
  val inputName = csTerminalCopy("input", locale)
  var lines by remember { mutableStateOf(history) }
  var draft by remember { mutableStateOf(TextFieldValue("")) }
  Column(modifier) {
    Text(bar, color = pack.colorTextPrimary.toComposeColor())
    lines.forEach { line -> if (line.command != null) Text(prompt + " " + line.command); if (line.output != null) Text(line.output) }
    Row {
      Text(prompt)
      BasicTextField(value = draft, onValueChange = { if (!csControlEnabled()) return@BasicTextField; draft = it }, enabled = csControlEnabled(), modifier = Modifier.semantics { contentDescription = inputName }.onPreviewKeyEvent { event ->
        if (event.type != KeyEventType.KeyDown || event.key != Key.Enter) return@onPreviewKeyEvent false
        if (!csTerminalSubmits(draft.composition != null, 0)) return@onPreviewKeyEvent false
        val trimmed = draft.text.trim()
        if (trimmed.isEmpty()) return@onPreviewKeyEvent true
        val next = csTerminalRun(lines, draft.text, onCommand(trimmed)) ?: return@onPreviewKeyEvent true
        lines = next
        draft = TextFieldValue("")
        true
      })
    }
  }
}
const val csTypingLabel = "Lumi is typing"
const val csTypingDots = 3
fun csTypingLabelText(label: String?, fallback: String) = label ?: fallback
fun csTypingCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Lumi đang nhập")
  val en = mapOf("label" to csTypingLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
@Composable fun CsTypingIndicator(modifier: Modifier = Modifier, label: String? = null, language: String? = null) {
  val spoken = csTypingLabelText(label, csTypingCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  Row(modifier.semantics { contentDescription = spoken; liveRegion = LiveRegionMode.Polite }) {
    repeat(csTypingDots) { Text("•", modifier = Modifier.clearAndSetSemantics {}) }
  }
}
