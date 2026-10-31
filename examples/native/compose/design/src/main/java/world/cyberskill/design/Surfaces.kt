package world.cyberskill.design

import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.widthIn
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.isShiftPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.boundsInWindow
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.unit.dp

fun csColorCommit(value: String): String? {
  if (value.length != 7 || value[0] != '#') return null
  if (value.drop(1).any { it !in '0'..'9' && it !in 'a'..'f' && it !in 'A'..'F' }) return null
  return value
}
const val csColorLabel = "Color"
const val csColorHex = "Hex value"
fun csColorCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Màu", "hex" to "Giá trị hex")
  val en = mapOf("label" to csColorLabel, "hex" to csColorHex)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csColorFieldName(label: String?, labelledBy: String?, value: String, fallback: String): String? {
  if (!labelledBy.isNullOrEmpty()) return null
  val name = if (label.isNullOrEmpty()) fallback else label
  return "$name: $value"
}
fun csColorDialogName(label: String?, labelledBy: String?, fallback: String): String? {
  if (!labelledBy.isNullOrEmpty()) return null
  return if (label.isNullOrEmpty()) fallback else label
}
fun csColorSelected(swatch: String, value: String) = swatch.lowercase() == value.lowercase()
fun csColorSubmits(composing: Boolean, keyCode: Int) = !composing && keyCode != 229
fun csColorDismissOutside(open: Boolean, inside: Boolean) = open && !inside
const val csColorGap = 6.0
data class CsColorPlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csColorShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double): CsColorPlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, "bottom-start", csColorGap) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, csColorGap) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsColorPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}

fun csSplitterClamp(value: Double, lower: Double = 20.0, upper: Double = 80.0): Double =
  minOf(upper, maxOf(lower, value))

fun csSplitterNudge(value: Double, right: Boolean, rtl: Boolean, lower: Double = 20.0, upper: Double = 80.0): Double {
  val delta = (if (right) 2.0 else -2.0) * (if (rtl) -1 else 1)
  return csSplitterClamp(csSplitterClamp(value, lower, upper) + delta, lower, upper)
}
const val csSplitterLabel = "Resize panes"
fun csSplitterCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Đổi kích thước khung")
  val en = mapOf("label" to csSplitterLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csSplitterName(label: String?, fallback: String) = label ?: fallback

const val csDatePlaceholder = "Select a date"
fun csDatePlaceholderText(text: String?, fallback: String) = text ?: fallback
fun csDateCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("placeholder" to "Chọn ngày")
  val en = mapOf("placeholder" to "Select a date")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csDateDialogLabel(label: String?, placeholder: String?, fallback: String): String {
  val name = label?.trim().orEmpty()
  if (name.isNotEmpty()) return name
  val hint = placeholder?.trim().orEmpty()
  return if (hint.isEmpty()) fallback else hint
}
fun csDateOpen(requested: Boolean, disabled: Boolean): Boolean = requested && !disabled
const val csDateGap = 6.0
data class CsDatePlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csDateShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double): CsDatePlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, "bottom-start", csDateGap) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, csDateGap) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsDatePlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}

fun csDateFormat(day: Int, month: Int, year: Int, language: String): String {
  if (language == "vi" || language.isEmpty()) return "%02d/%02d/%04d".format(day, month + 1, year)
  val months = arrayOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
  return "%02d %s %04d".format(day, months[month], year)
}

const val csChatYou = "You"
const val csChatLumi = "Lumi"
fun csChatIsUser(role: String): Boolean = role == "user"
fun csChatSpeaker(name: String?, role: String, you: String, lumi: String) = name ?: if (csChatIsUser(role)) you else lumi
fun csChatCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("you" to "Bạn")
  val en = mapOf("you" to csChatYou)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
const val csImagePreview = "Preview image"
fun csImagePreviewName(alt: String, fallback: String) = if (alt.isEmpty()) fallback else "$fallback: $alt"
fun csImageCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("preview" to "Xem ảnh", "close" to "Đóng")
  val en = mapOf("preview" to "Preview image", "close" to "Close")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csImageCanPreview(preview: Boolean, state: String) = preview && state == "ok"
fun csImageDialogName(alt: String, fallback: String) = if (alt.isEmpty()) fallback else alt

fun csIconPoints(size: String): Int = when (size) { "sm" -> 16; "lg" -> 24; else -> 20 }

@Composable
fun CsColorPicker(value: String, swatches: List<String>, onChange: (String) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, labelledBy: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val fallback = csColorCopy("label", locale)
  val name = csColorFieldName(label, labelledBy, value, fallback)
  val dialog = csColorDialogName(label, labelledBy, fallback)
  var open by remember { mutableStateOf(false) }
  var hex by remember(value) { mutableStateOf(value) }
  var field by remember { mutableStateOf<CsFloatingRect?>(null) }
  var natural by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var fitted by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var origin by remember { mutableStateOf(0.0 to 0.0) }
  var panelScale by remember { mutableStateOf(1.0 to 1.0) }
  val config = androidx.compose.ui.platform.LocalConfiguration.current
  val density = androidx.compose.ui.platform.LocalDensity.current
  val viewWidth = with(density) { config.screenWidthDp.dp.toPx() }.toDouble()
  val viewHeight = with(density) { config.screenHeightDp.dp.toPx() }.toDouble()
  val viewport = CsFloatingRect(8.0, 8.0, maxOf(8.0, viewWidth - 8.0), maxOf(8.0, viewHeight - 8.0), 0.0, 0.0)
  val place = field?.let { box ->
    val first = natural
    val second = fitted
    if (first == null || second == null) null else csColorShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second)
  }
  val shiftX = with(density) { (place?.x ?: 0.0).toFloat().toDp() }
  val shiftY = with(density) { (place?.y ?: 0.0).toFloat().toDp() }
  if (!open && natural != null) { natural = null; fitted = null }
  Column(modifier) {
    CsTriggerButton(title = value, onClick = { open = !open }, modifier = Modifier.onGloballyPositioned {
      val bounds = it.boundsInWindow()
      field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
    }.semantics { if (name != null) contentDescription = name; stateDescription = open.toString() }) { Text(value, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.clearAndSetSemantics {}) }
    if (open) Popup(alignment = Alignment.TopStart, onDismissRequest = { if (csColorDismissOutside(true, false)) open = false }, properties = PopupProperties(focusable = false, dismissOnBackPress = false, dismissOnClickOutside = true)) { Column(Modifier.onGloballyPositioned {
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
    }.offset(x = shiftX, y = shiftY).widthIn(max = with(density) { (place?.maxWidth ?: viewWidth).toFloat().toDp() }).semantics { if (dialog != null) contentDescription = dialog }.onPreviewKeyEvent { event ->
      if (event.type != KeyEventType.KeyDown || event.key != Key.Escape) return@onPreviewKeyEvent false
      open = false
      true
    }) {
      swatches.forEach { swatch ->
        CsTriggerButton(title = swatch, onClick = { csColorCommit(swatch)?.let { onChange(it); open = false } }, modifier = Modifier.minimumInteractiveComponentSize().semantics { contentDescription = swatch; stateDescription = csColorSelected(swatch, value).toString() }) { Text(swatch, modifier = Modifier.clearAndSetSemantics {}) }
      }
      BasicTextField(value = hex, onValueChange = { hex = it }, modifier = Modifier.semantics { contentDescription = csColorCopy("hex", locale) }.onPreviewKeyEvent { event ->
        if (event.type != KeyEventType.KeyDown || event.key != Key.Enter) return@onPreviewKeyEvent false
        if (!csColorSubmits(false, 0)) return@onPreviewKeyEvent false
        csColorCommit(hex)?.let(onChange)
        open = false
        true
      })
    } }
  }
}

@Composable
fun CsSplitter(start: String, end: String, percent: Double, onChange: (Double) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val rtl = LocalLayoutDirection.current == LayoutDirection.Rtl
  val spoken = csSplitterName(label, csSplitterCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  Row(modifier.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
    when (event.key) {
      Key.DirectionRight -> { onChange(csSplitterNudge(percent, true, rtl)); true }
      Key.DirectionLeft -> { onChange(csSplitterNudge(percent, false, rtl)); true }
      else -> false
    }
  }) {
    Text(start, color = pack.colorTextPrimary.toComposeColor())
    CsTriggerButton(title = spoken, onClick = { onChange(csSplitterNudge(percent, true, rtl)) }, modifier = Modifier.semantics { contentDescription = spoken; stateDescription = percent.toInt().toString() }) { Text(spoken, modifier = Modifier.clearAndSetSemantics {}) }
    Text(end, color = pack.colorTextPrimary.toComposeColor())
  }
}

@Composable
fun CsDatePicker(text: String, requestedOpen: Boolean, disabled: Boolean, onOpenChange: (Boolean) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, placeholder: String? = null, language: String? = null) {
  val open = csDateOpen(requestedOpen, disabled)
  val hint = csDatePlaceholderText(placeholder, csDateCopy("placeholder", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  val face = if (text.isEmpty()) hint else text
  val name = if (label.isNullOrEmpty()) face else label
  var field by remember { mutableStateOf<CsFloatingRect?>(null) }
  var natural by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var fitted by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var origin by remember { mutableStateOf(0.0 to 0.0) }
  var panelScale by remember { mutableStateOf(1.0 to 1.0) }
  val config = androidx.compose.ui.platform.LocalConfiguration.current
  val density = androidx.compose.ui.platform.LocalDensity.current
  val viewWidth = with(density) { config.screenWidthDp.dp.toPx() }.toDouble()
  val viewHeight = with(density) { config.screenHeightDp.dp.toPx() }.toDouble()
  val viewport = CsFloatingRect(8.0, 8.0, maxOf(8.0, viewWidth - 8.0), maxOf(8.0, viewHeight - 8.0), 0.0, 0.0)
  val place = field?.let { box ->
    val first = natural
    val second = fitted
    if (first == null || second == null) null else csDateShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second)
  }
  if (!open && natural != null) { natural = null; fitted = null }
  Column(modifier) {
    CsTriggerButton(title = face, onClick = { if (!disabled) onOpenChange(!open) }, enabled = !disabled && csControlEnabled(), modifier = Modifier.onGloballyPositioned {
      val bounds = it.boundsInWindow()
      field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
    }.semantics { contentDescription = name }) { Text(face, modifier = Modifier.clearAndSetSemantics {}) }
    if (open) Text(text, modifier = Modifier.onGloballyPositioned {
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

@Composable
fun CsChatMessage(role: String, body: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, name: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val user = csChatIsUser(role)
  val you = csChatCopy("you", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  val speaker = csChatSpeaker(name, role, you, csChatLumi)
  Column(modifier) {
    Text(speaker, color = pack.colorTextMuted.toComposeColor())
    Text(body, color = if (user) pack.colorSemanticInfoFg.toComposeColor() else pack.colorTextPrimary.toComposeColor())
  }
}

@Composable
fun CsAnchor(title: String, items: List<Pair<String, String>>, visibleIds: List<String>, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  val active = visibleIds.firstOrNull()
  val pack = csModePack(dark, highContrast, compact)
  Column(modifier) {
    Text(title, color = pack.colorTextPrimary.toComposeColor())
    items.forEach { item -> Text(item.second, color = if (item.first == active) pack.colorBrandOchre.toComposeColor() else pack.colorTextMuted.toComposeColor()) }
  }
}

const val csCitationLabel = "Sources"
const val csCitationRel = "noreferrer"
fun csCitationHeading(label: String?, omitted: Boolean, fallback: String) = if (omitted) fallback else if (label.isNullOrEmpty()) null else label
fun csCitationCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("sources" to "Nguồn")
  val en = mapOf("sources" to csCitationLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csCitationSource(source: String?) = if (source.isNullOrEmpty()) null else " · $source"
fun csCitationHref(href: String?) = if (href.isNullOrEmpty()) null else href
fun csCitationLine(index: Int, title: String, source: String?) = "${index + 1} $title${csCitationSource(source) ?: ""}"
@Composable
fun CsCitationList(items: List<String>, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val heading = csCitationHeading(label, label == null, csCitationCopy("sources", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  Column(modifier) {
    if (heading != null) Text(heading, color = pack.colorTextPrimary.toComposeColor())
    items.forEachIndexed { index, item -> Text("${index + 1} $item", color = pack.colorTextPrimary.toComposeColor()) }
  }
}

@Composable
fun CsScrollArea(maxHeight: Int, modifier: Modifier = Modifier, content: @Composable () -> Unit) {
  Column(modifier) { content() }
}

@Composable
fun CsImage(dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, alt: String = "", ratio: String = "16 / 9", preview: Boolean = false, state: String = "loading", language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val previewWord = csImageCopy("preview", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  val name = if (csImageCanPreview(preview, state)) csImagePreviewName(alt, previewWord) else alt
  Text(alt, color = pack.colorTextMuted.toComposeColor(), modifier = modifier.clearAndSetSemantics { contentDescription = name })
}

@Composable
fun CsLogo(title: String, decorative: Boolean, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  val pack = csModePack(dark, highContrast, compact)
  Text(if (decorative) "" else title, color = pack.colorBrandOchre.toComposeColor(), modifier = modifier)
}

const val csContextMenu = "Context menu"
fun csContextFirst(items: List<String>) = items.indexOfFirst { it != "-" }.takeIf { it >= 0 }
fun csContextPoint(clientX: Double, clientY: Double, left: Double, top: Double) = (clientX - left) to (clientY - top)
fun csContextKeyboardPoint(height: Double) = 0.0 to height
data class CsFloatingRect(val left: Double, val top: Double, val right: Double, val bottom: Double, val width: Double, val height: Double)
data class CsFloatingResult(val left: Double, val top: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csFloatingPlace(anchor: CsFloatingRect, panelWidth: Double, panelHeight: Double, viewport: CsFloatingRect, placement: String = "bottom-start", gap: Double = 8.0, direction: String = "ltr"): CsFloatingResult? {
  val names = listOf("top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end")
  if (!names.contains(placement)) return null
  val parts = placement.split("-", limit = 2)
  val preferred = parts[0]
  val alignment = parts.getOrNull(1)
  val opposite = mapOf("top" to "bottom", "bottom" to "top", "left" to "right", "right" to "left")
  val available = mapOf(
    "top" to anchor.top - viewport.top - gap,
    "bottom" to viewport.bottom - anchor.bottom - gap,
    "left" to anchor.left - viewport.left - gap,
    "right" to viewport.right - anchor.right - gap,
  )
  val dimension = if (preferred == "top" || preferred == "bottom") panelHeight else panelWidth
  val preferredSpace = available[preferred] ?: 0.0
  val oppositeSpace = available[opposite[preferred]] ?: 0.0
  val side = if (dimension > preferredSpace && oppositeSpace > preferredSpace) opposite[preferred] ?: preferred else preferred
  val vertical = side == "top" || side == "bottom"
  val align = if (vertical && direction == "rtl") if (alignment == "start") "end" else if (alignment == "end") "start" else null else alignment
  var left = if (vertical) if (align == "start") anchor.left else if (align == "end") anchor.right - panelWidth else anchor.left + (anchor.width - panelWidth) / 2 else if (side == "left") anchor.left - gap - panelWidth else anchor.right + gap
  var top = if (vertical) if (side == "top") anchor.top - gap - panelHeight else anchor.bottom + gap else if (align == "start") anchor.top else if (align == "end") anchor.bottom - panelHeight else anchor.top + (anchor.height - panelHeight) / 2
  left = maxOf(viewport.left, minOf(left, maxOf(viewport.left, viewport.right - panelWidth)))
  top = maxOf(viewport.top, minOf(top, maxOf(viewport.top, viewport.bottom - panelHeight)))
  val maxWidth = maxOf(0.0, if (vertical) viewport.right - viewport.left else available[side] ?: 0.0)
  val maxHeight = maxOf(0.0, if (vertical) available[side] ?: 0.0 else viewport.bottom - viewport.top)
  return CsFloatingResult(left, top, maxWidth, maxHeight, side + if (alignment == null) "" else "-$alignment")
}
fun csContextPlace(x: Double, y: Double, panelWidth: Double, panelHeight: Double, viewportWidth: Double, viewportHeight: Double): Pair<Double, Double> {
  val inset = 8.0
  val viewport = CsFloatingRect(inset, inset, maxOf(inset, viewportWidth - inset), maxOf(inset, viewportHeight - inset), 0.0, 0.0)
  val anchor = CsFloatingRect(x, y, x, y, 0.0, 0.0)
  val placed = csFloatingPlace(anchor, panelWidth, panelHeight, viewport, "bottom-start", 0.0, "ltr") ?: return x to y
  return placed.left to placed.top
}
fun csContextOpen(items: List<String>, defaultPrevented: Boolean) = if (defaultPrevented) null else csContextFirst(items)
fun csContextMove(index: Int, count: Int, key: String) = when {
  count <= 0 -> null
  key == "down" -> minOf(count - 1, index + 1)
  key == "up" -> if (index < 0) count - 1 else maxOf(0, index - 1)
  key == "home" -> 0
  key == "end" -> count - 1
  else -> null
}
fun csContextLabel(label: String?, fallback: String) = label ?: fallback
fun csContextCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("menu" to "Trình đơn ngữ cảnh")
  val en = mapOf("menu" to csContextMenu)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}

fun CsContextMenu(items: List<String>, onSelect: (String) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, language: String? = null) {
  var raw by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var natural by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var fitted by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var zoneHeight by remember { mutableStateOf(44.0) }
  var origin by remember { mutableStateOf(0.0 to 0.0) }
  var zoneScale by remember { mutableStateOf(1.0 to 1.0) }
  val config = androidx.compose.ui.platform.LocalConfiguration.current
  val density = androidx.compose.ui.platform.LocalDensity.current
  val viewWidth = with(density) { config.screenWidthDp.dp.toPx() }.toDouble()
  val viewHeight = with(density) { config.screenHeightDp.dp.toPx() }.toDouble()
  val spoken = csContextLabel(label, csContextCopy("menu", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  fun place(point: Pair<Double, Double>, size: Pair<Double, Double>, placement: String): CsFloatingResult {
    val inset = 8.0
    val viewport = CsFloatingRect(inset, inset, maxOf(inset, viewWidth - inset), maxOf(inset, viewHeight - inset), 0.0, 0.0)
    val anchor = CsFloatingRect(origin.first + point.first, origin.second + point.second, origin.first + point.first, origin.second + point.second, 0.0, 0.0)
    val global = csFloatingPlace(anchor, size.first, size.second, viewport, placement, 0.0, "ltr")
      ?: CsFloatingResult(origin.first + point.first, origin.second + point.second, viewWidth, viewHeight, placement)
    return global.copy(left = (global.left - origin.first) / zoneScale.first, top = (global.top - origin.second) / zoneScale.second)
  }
  Box(modifier.onGloballyPositioned {
    val root = it.positionInRoot()
    val bounds = it.boundsInRoot()
    val rawScaleX = if (it.size.width > 0) bounds.width / it.size.width.toFloat() else 1f
    val rawScaleY = if (it.size.height > 0) bounds.height / it.size.height.toFloat() else 1f
    origin = root.x.toDouble() to root.y.toDouble()
    zoneScale = (if (rawScaleX == 0f) 1.0 else rawScaleX.toDouble()) to (if (rawScaleY == 0f) 1.0 else rawScaleY.toDouble())
    zoneHeight = it.size.height.toDouble()
  }.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
    val shiftF10 = event.key == Key.F10 && event.isShiftPressed
    val menuKey = event.key == Key.Menu
    if (!shiftF10 && !menuKey) return@onPreviewKeyEvent false
    raw = csContextKeyboardPoint(zoneHeight)
    natural = null
    fitted = null
    true
  }.pointerInput(Unit) {
    awaitEachGesture {
      val down = awaitFirstDown(requireUnconsumed = false)
      if (!down.buttons.isSecondaryPressed) return@awaitEachGesture
      raw = csContextPoint(down.position.x.toDouble(), down.position.y.toDouble(), 0.0, 0.0)
      natural = null
      fitted = null
    }
  }) {
    val pending = raw
    val initial = pending?.let { rawPoint -> natural?.let { size -> place(rawPoint, size, "bottom-start") } }
    val shrinks = initial != null && natural != null && (natural!!.first - initial.maxWidth > 0.5 || natural!!.second - initial.maxHeight > 0.5)
    val finalSize = fitted ?: if (initial != null && !shrinks) natural else null
    val point = pending?.let { rawPoint -> finalSize?.let { size -> place(rawPoint, size, initial?.placement ?: "bottom-start") } }
    if (pending != null) {
      val shown = point != null
      Column(Modifier.offset(with(density) { (point?.left ?: 0.0).toFloat().toDp() }, with(density) { (point?.top ?: 0.0).toFloat().toDp() }).alpha(if (shown) 1f else 0f).then(if (shown) Modifier else Modifier.clearAndSetSemantics { }).then(initial?.let { Modifier.widthIn(max = with(density) { it.maxWidth.toFloat().toDp() }).heightIn(max = with(density) { it.maxHeight.toFloat().toDp() }) } ?: Modifier).onGloballyPositioned {
        val width = it.size.width.toDouble()
        val height = it.size.height.toDouble()
        if (width > 0.0 && height > 0.0) {
          if (natural == null) natural = width to height
          else fitted = width to height
        }
      }.semantics { contentDescription = spoken }) {
        if (label != null) Text(label, modifier = Modifier.clearAndSetSemantics { })
        items.forEach { item ->
          CsTriggerButton(title = item, onClick = { onSelect(item); raw = null; natural = null; fitted = null }) { Text(item) }
        }
      }
    }
  }
}

const val csNavGap = 8
fun csNavHref(href: String?) = if (href.isNullOrEmpty()) "#" else href
fun csNavShowsDescription(description: String?) = description != null && description.isNotEmpty()
fun csNavClick(open: Int?, index: Int) = if (open == index) null else index
fun csNavHover(open: Int?, index: Int) = if (open == null) null else if (open == index) open else index
fun csNavPlacement(placement: String?) = placement ?: "bottom-start"
data class CsNavPlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csNavShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String): CsNavPlace? {
  val space = csNavGap.toDouble()
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement, space) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, space) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsNavPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}

fun CsNavigationMenu(items: List<String>, active: String, onSelect: (String) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  val pack = csModePack(dark, highContrast, compact)
  Row(modifier) {
    items.forEach { item -> CsTriggerButton(title = item, onClick = { onSelect(item) }) { Text(item, color = if (item == active) pack.colorBrandOchre.toComposeColor() else pack.colorTextPrimary.toComposeColor()) } }
  }
}

@Composable
fun CsCardHeader(title: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  Text(title, color = csModePack(dark, highContrast, compact).colorTextPrimary.toComposeColor(), modifier = modifier)
}

@Composable
fun CsCardBody(text: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  Text(text, color = csModePack(dark, highContrast, compact).colorTextPrimary.toComposeColor(), modifier = modifier)
}

@Composable
fun CsCardFooter(text: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  Text(text, color = csModePack(dark, highContrast, compact).colorTextMuted.toComposeColor(), modifier = modifier)
}

@Composable
fun CsToastStack(modifier: Modifier = Modifier, label: String? = null, language: String? = null, content: @Composable () -> Unit) {
  val name = label ?: csToastCopy("notifications", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  Column(modifier.semantics { contentDescription = name }) { content() }
}
