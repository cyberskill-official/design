package world.cyberskill.design

import androidx.compose.foundation.background
import androidx.compose.foundation.hoverable
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.clickable
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.unit.sp
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
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
import androidx.compose.ui.input.pointer.isSecondaryPressed
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.boundsInRoot
import androidx.compose.ui.layout.boundsInWindow
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInRoot
import androidx.compose.ui.unit.dp

const val csColorDefaultValue = "#f4ba17"
const val csColorHexMaxLength = 7
const val csColorTriggerHasPopup = "dialog"
const val csColorListboxRole = "listbox"
const val csColorOptionRole = "option"
val csColorDefaultSwatches = listOf("#F4BA17", "#C77B4A", "#E0632B", "#C43D1F", "#7A9B57", "#3E5A2E", "#4E8E9B", "#2E5E7E", "#BFB29B", "#45210E")
fun csColorPlacement(placement: String?) = placement ?: "bottom-start"
fun csColorDescriptionId(id: String, description: String?): String? =
  if (description.isNullOrEmpty()) null else "$id-description"
fun csColorErrorId(id: String, error: String?): String? =
  if (error.isNullOrEmpty()) null else "$id-error"
fun csColorDescribedBy(explicit: String?, descriptionId: String?, errorId: String?): String? {
  val parts = listOf(explicit, descriptionId, errorId).filter { !it.isNullOrEmpty() }
  return if (parts.isEmpty()) null else parts.joinToString(" ")
}
fun csColorInvalid(error: String?): Boolean = !error.isNullOrEmpty()
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
fun csColorShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String = "bottom-start"): CsColorPlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement, csColorGap) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, csColorGap) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsColorPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}

const val csSplitterDefaultInitial = 50.0
const val csSplitterDefaultMin = 20.0
const val csSplitterDefaultMax = 80.0
const val csSplitterDefaultHeight = 180
const val csSplitterSeparatorRole = "separator"
const val csSplitterOrientation = "vertical"
fun csSplitterClamp(value: Double, lower: Double = 20.0, upper: Double = 80.0): Double =
  minOf(upper, maxOf(lower, value))
fun csSplitterRightPercent(leftPercent: Double, lower: Double = 20.0, upper: Double = 80.0): Double =
  100.0 - csSplitterClamp(leftPercent, lower, upper)
fun csSplitterAcceptsKey(composing: Boolean, keyCode: Int): Boolean =
  !composing && keyCode != 229

fun csSplitterNudge(value: Double, right: Boolean, rtl: Boolean, lower: Double = 20.0, upper: Double = 80.0): Double {
  val delta = (if (right) 2.0 else -2.0) * (if (rtl) -1 else 1)
  return csSplitterClamp(csSplitterClamp(value, lower, upper) + delta, lower, upper)
}
fun csSplitterAcceptsPointer(button: Int, pointerId: Int, eventPointer: Int) = button == 0 && pointerId == eventPointer
fun csSplitterDrag(start: Double, grabX: Double, currentX: Double, wrapWidth: Double, handleWidth: Double, rtl: Boolean, lower: Double = 20.0, upper: Double = 80.0): Double? {
  val available = wrapWidth - handleWidth
  if (available <= 0.0) return null
  val distance = (currentX - grabX) * (if (rtl) -1.0 else 1.0)
  return csSplitterClamp(start + (distance / available) * 100.0, lower, upper)
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
fun csSplitterBoundsText(value: Double, lower: Double = 20.0, upper: Double = 80.0): String =
  "${csSplitterClamp(value, lower, upper).toInt()} (${lower.toInt()}-${upper.toInt()})"

const val csDatePlaceholder = "Select a date"
const val csDateTriggerHasPopup = "dialog"
const val csDateDialogRole = "dialog"
fun csDateIconSize(): Int = 16
fun csDateIconStrokeWidth(): Double = 1.8
fun csDatePlacement(placement: String?) = placement ?: "bottom-start"
fun csDateDescriptionId(id: String, description: String?): String? =
  if (description.isNullOrEmpty()) null else "$id-description"
fun csDateErrorId(id: String, error: String?): String? =
  if (error.isNullOrEmpty()) null else "$id-error"
fun csDateDescribedBy(explicit: String?, descriptionId: String?, errorId: String?): String? {
  val parts = listOf(explicit, descriptionId, errorId).filter { !it.isNullOrEmpty() }
  return if (parts.isEmpty()) null else parts.joinToString(" ")
}
fun csDateInvalid(error: String?): Boolean = !error.isNullOrEmpty()
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
fun csDateDialogName(label: String?, labelledBy: String?, dialog: String): String? {
  val name = label?.trim().orEmpty()
  if (name.isNotEmpty()) return dialog
  if (!labelledBy.isNullOrEmpty()) return null
  return dialog
}
fun csDateOpen(requested: Boolean, disabled: Boolean): Boolean = requested && !disabled
const val csDateGap = 6.0
data class CsDatePlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csDateShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String = "bottom-start"): CsDatePlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement, csDateGap) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, csDateGap) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsDatePlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}

fun csDateFormat(day: Int, month: Int, year: Int, language: String?): String {
  val code = csComboboxPrimaryLanguage(language) ?: "vi"
  if (code == "vi") return "%02d/%02d/%04d".format(day, month + 1, year)
  if (code == "ja") return "%04d/%02d/%02d".format(year, month + 1, day)
  val months = arrayOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
  return "%02d %s %04d".format(day, months[month], year)
}
fun csDateParse(text: String, language: String?): CsCalendarDate? {
  val trimmed = text.trim()
  if (trimmed.isEmpty()) return null
  val code = csComboboxPrimaryLanguage(language) ?: "vi"
  if (code == "vi" || code == "ja") {
    val parts = trimmed.split("/")
    if (parts.size != 3) return null
    val year: Int
    val month: Int
    val day: Int
    if (code == "ja") {
      year = parts[0].toIntOrNull() ?: return null
      month = parts[1].toIntOrNull() ?: return null
      day = parts[2].toIntOrNull() ?: return null
    } else {
      day = parts[0].toIntOrNull() ?: return null
      month = parts[1].toIntOrNull() ?: return null
      year = parts[2].toIntOrNull() ?: return null
    }
    if (month !in 1..12) return null
    val index = month - 1
    if (day !in 1..csCalendarDays(year, index)) return null
    return CsCalendarDate(year, index, day)
  }
  val months = listOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
  val parts = trimmed.split(" ")
  if (parts.size != 3) return null
  val day = parts[0].toIntOrNull() ?: return null
  val index = months.indexOf(parts[1])
  val year = parts[2].toIntOrNull() ?: return null
  if (index < 0 || day !in 1..csCalendarDays(year, index)) return null
  return CsCalendarDate(year, index, day)
}

const val csChatYou = "You"
const val csChatLumi = "Lumi"
const val csChatDefaultRole = "lumi"
const val csChatArticleRole = "article"
fun csChatIsUser(role: String): Boolean = role == "user"
fun csChatRootClass(role: String): String = "cs-chat cs-chat--$role"
fun csChatShowsSlot(value: String?): Boolean = !value.isNullOrEmpty()
fun csChatUserInitial(speaker: String): String = speaker.take(1).uppercase()
fun csChatSpeaker(name: String?, role: String, you: String, lumi: String) = name ?: if (csChatIsUser(role)) you else lumi
fun csChatDefaultAvatar(role: String, you: String): String = if (csChatIsUser(role)) you else csAiStyleLumiGlyph
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
const val csImageDialogRole = "dialog"
const val csImageFallbackMark = "M21 15l-5-5-9 9"
fun csImageFallbackIconSize(): Int = 28
fun csImageFallbackIconStrokeWidth(): Double = 1.6
fun csImageRootClass(state: String, canPreview: Boolean): String {
  val classes = mutableListOf("cs-image")
  if (state == "loading") classes.add("is-loading")
  if (canPreview) classes.add("is-zoomable")
  return classes.joinToString(" ")
}
fun csImageAcceptsPreviewKey(key: String): Boolean = key == "Enter" || key == " "
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
fun csImagePreviewOpen(zoom: Boolean, preview: Boolean, state: String) = zoom && csImageCanPreview(preview, state)
fun csImageDialogName(alt: String, fallback: String) = if (alt.isEmpty()) fallback else alt
fun csImageShowsFallback(fallback: String?): Boolean = !fallback.isNullOrEmpty()

const val csIconDefaultSize = "md"
const val csIconViewBox = "0 0 24 24"
const val csIconDefaultStrokeWidth = 1.75
fun csIconIsDecorative(label: String): Boolean = label.isEmpty()
fun csIconRole(label: String): String? = if (csIconIsDecorative(label)) null else "img"
fun csIconPoints(size: String): Int = when (size) { "xs" -> 14; "sm" -> 16; "lg" -> 24; "xl" -> 32; else -> 20 }
const val csAnchorNavRole = "navigation"
fun csAnchorActive(visibleIds: List<String>): String? = visibleIds.firstOrNull()
fun csAnchorResolvedActive(visibleIds: List<String>, itemIds: List<String>, explicit: String? = null): String? =
  if (!explicit.isNullOrEmpty()) explicit else csAnchorActive(visibleIds) ?: itemIds.firstOrNull()
fun csAnchorShowsTitle(title: String?): Boolean = !title.isNullOrEmpty()
fun csAnchorTitleId(baseId: String, title: String?): String? = if (csAnchorShowsTitle(title)) "$baseId-title" else null
fun csAnchorItemHref(id: String): String = "#$id"
fun csAnchorLinkClass(active: Boolean): String = if (active) "cs-anchor__link is-active" else "cs-anchor__link"
fun csAnchorAriaCurrent(isActive: Boolean): String? = if (isActive) "location" else null

@Composable
fun CsColorPicker(value: String = csColorDefaultValue, swatches: List<String> = csColorDefaultSwatches, onChange: (String) -> Unit = {}, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, labelledBy: String? = null, description: String? = null, error: String? = null, required: Boolean = false, ariaDescribedBy: String? = null, portal: Boolean = true, placement: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val fallback = csColorCopy("label", locale)
  val name = csColorFieldName(label, labelledBy, value, fallback)
  val dialog = csColorDialogName(label, labelledBy, fallback)
  val placeName = csColorPlacement(placement)
  var open by remember { mutableStateOf(false) }
  var hex by remember(value) { mutableStateOf(value) }
  var sawHexFocus by remember { mutableStateOf(false) }
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
    if (first == null || second == null) null else csColorShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second, placeName)
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
        CsTriggerButton(title = swatch, onClick = { csColorCommit(swatch)?.let { onChange(it); open = false } }, modifier = Modifier.sizeIn(minWidth = csControlsBatchStyleColorPickerCellSize(), minHeight = csControlsBatchStyleColorPickerCellSize()).minimumInteractiveComponentSize().semantics { contentDescription = swatch; stateDescription = csColorSelected(swatch, value).toString() }) { Text(swatch, modifier = Modifier.clearAndSetSemantics {}) }
      }
      BasicTextField(value = hex, onValueChange = { hex = it }, modifier = Modifier.widthIn(min = csControlsBatchStyleColorPickerHexInputWidth()).onFocusChanged { state ->
        if (state.isFocused) sawHexFocus = true
        else if (sawHexFocus) csColorCommit(hex)?.let(onChange)
      }.semantics { contentDescription = csColorCopy("hex", locale) }.onPreviewKeyEvent { event ->
        if (event.type != KeyEventType.KeyDown || event.key != Key.Enter) return@onPreviewKeyEvent false
        if (!csColorSubmits(false, 0)) return@onPreviewKeyEvent false
        csColorCommit(hex)?.let(onChange)
        open = false
        true
      })
    } }
    if (!description.isNullOrEmpty()) Text(description, color = pack.colorTextMuted.toComposeColor())
    if (!error.isNullOrEmpty()) Text(error, color = pack.colorSemanticDangerText.toComposeColor())
  }
}

@Composable
fun CsSplitter(start: String, end: String, percent: Double = csSplitterDefaultInitial, onChange: (Double) -> Unit = {}, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, initial: Double = csSplitterDefaultInitial, min: Double = csSplitterDefaultMin, max: Double = csSplitterDefaultMax, height: Int = csSplitterDefaultHeight, label: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val rtl = LocalLayoutDirection.current == LayoutDirection.Rtl
  val spoken = csSplitterName(label, csSplitterCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  val clampedPercent = csSplitterClamp(percent, min, max)
  val currentPercent by rememberUpdatedState(clampedPercent)
  var dragStart by remember { mutableStateOf<Double?>(null) }
  var travel by remember { mutableStateOf(0.0) }
  var wrapWidth by remember { mutableStateOf(0.0) }
  var handleWidth by remember { mutableStateOf(0.0) }
  Row(modifier.heightIn(min = height.dp).onGloballyPositioned { wrapWidth = it.size.width.toDouble() }.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
    when (event.key) {
      Key.DirectionRight -> { onChange(csSplitterNudge(clampedPercent, true, rtl, min, max)); true }
      Key.DirectionLeft -> { onChange(csSplitterNudge(clampedPercent, false, rtl, min, max)); true }
      else -> false
    }
  }) {
    Text(start, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.padding(csControlsBatchStyleSplitterPanePadding()))
    CsTriggerButton(title = spoken, onClick = { onChange(csSplitterNudge(clampedPercent, true, rtl, min, max)) }, modifier = Modifier.widthIn(min = csControlsBatchStyleSplitterBarWidth()).onGloballyPositioned { handleWidth = it.size.width.toDouble() }.pointerInput(rtl, wrapWidth, handleWidth, min, max) {
      detectDragGestures(
        onDragStart = { dragStart = currentPercent; travel = 0.0 },
        onDrag = { _, amount ->
          val start = dragStart ?: return@detectDragGestures
          travel += amount.x.toDouble()
          csSplitterDrag(start, 0.0, travel, wrapWidth, handleWidth, rtl, min, max)?.let(onChange)
        },
        onDragEnd = { dragStart = null },
        onDragCancel = { dragStart = null },
      )
    }.semantics { contentDescription = spoken; stateDescription = clampedPercent.toInt().toString() }) { Text(spoken, modifier = Modifier.clearAndSetSemantics {}) }
    Text(end, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.padding(csControlsBatchStyleSplitterPanePadding()))
  }
}

@Composable
fun CsDatePicker(text: String, requestedOpen: Boolean, disabled: Boolean, onOpenChange: (Boolean) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, labelledBy: String? = null, description: String? = null, error: String? = null, required: Boolean = false, ariaDescribedBy: String? = null, placeholder: String? = null, portal: Boolean = true, placement: String? = null, language: String? = null, onValue: (String) -> Unit = {}) {
  val open = csDateOpen(requestedOpen, disabled)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val fallback = csDateCopy("placeholder", locale)
  val hint = csDatePlaceholderText(placeholder, fallback)
  val face = if (text.isEmpty()) hint else text
  val name = if (!labelledBy.isNullOrEmpty() && label.isNullOrEmpty()) null else if (label.isNullOrEmpty()) face else label
  val dialogLabel = csDateDialogLabel(label, placeholder, fallback)
  val dialogName = csDateDialogName(label, labelledBy, dialogLabel)
  val placeName = csDatePlacement(placement)
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
    if (first == null || second == null) null else csDateShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second, placeName)
  }
  if (!open && natural != null) { natural = null; fitted = null }
  val parsed = csDateParse(text, locale)
  val today = java.time.LocalDate.now()
  val seed = parsed ?: CsCalendarDate(today.year, today.monthValue - 1, today.dayOfMonth)
  Column(modifier.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown || event.key != Key.Escape || !open) return@onPreviewKeyEvent false
    onOpenChange(false)
    true
  }) {
    CsTriggerButton(title = face, onClick = { if (!disabled) onOpenChange(!open) }, enabled = !disabled && csControlEnabled(), modifier = Modifier.widthIn(min = csControlsWaveStyleDatePickerFieldMinWidth()).onGloballyPositioned {
      val bounds = it.boundsInWindow()
      field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
    }.semantics { if (name != null) contentDescription = name }) { Text("📅 $face", modifier = Modifier.clearAndSetSemantics {}) }
    if (open) CsCalendar(monthLabel = csCalendarHeading(seed.month, seed.year, locale), year = seed.year, month = seed.month, selected = parsed?.day, onSelect = {}, dark = dark, highContrast = highContrast, compact = compact, language = locale, onChoose = { date ->
      onValue(csDateFormat(date.day, date.month, date.year, locale))
      onOpenChange(false)
    }, modifier = Modifier.semantics { if (dialogName != null) contentDescription = dialogName }.onGloballyPositioned {
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
    if (!description.isNullOrEmpty()) Text(description, color = csModePack(dark, highContrast, compact).colorTextMuted.toComposeColor())
    if (!error.isNullOrEmpty()) Text(error, color = csModePack(dark, highContrast, compact).colorSemanticDangerText.toComposeColor())
  }
}

@Composable
fun CsChatMessage(role: String = csChatDefaultRole, body: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, name: String? = null, meta: String? = null, actions: String? = null, avatar: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val user = csChatIsUser(role)
  val you = csChatCopy("you", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  val speaker = csChatSpeaker(name, role, you, csChatLumi)
  val avatarText = avatar ?: csChatDefaultAvatar(role, you)
  Column(modifier, verticalArrangement = Arrangement.spacedBy(csAiStyleChatColGap())) {
    Text(avatarText, color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.clearAndSetSemantics {})
    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
      Text(speaker, color = pack.colorTextMuted.toComposeColor(), fontSize = csAiStyleChatNameFontSize(pack).value.sp)
      if (csChatShowsSlot(meta)) Text(meta ?: "", color = pack.colorTextMuted.toComposeColor(), fontSize = csAiStyleChatNameFontSize(pack).value.sp)
    }
    Text(body, color = if (user) pack.colorSemanticInfoFg.toComposeColor() else pack.colorTextPrimary.toComposeColor(), fontSize = csAiStyleChatBubbleFontSize(pack).value.sp, modifier = Modifier.padding(horizontal = csAiStyleChatBubblePaddingX(), vertical = csAiStyleChatBubblePaddingY()))
    if (csChatShowsSlot(actions)) Text(actions ?: "", color = pack.colorTextMuted.toComposeColor())
  }
}

@Composable
fun CsAnchor(title: String = "", items: List<Pair<String, String>> = emptyList(), visibleIds: List<String> = emptyList(), dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, activeId: String? = null, onSelect: (String) -> Unit = {}) {
  val active = csAnchorResolvedActive(visibleIds, items.map { it.first }, activeId)
  val pack = csModePack(dark, highContrast, compact)
  Column(modifier.widthIn(min = csControlsBatchStyleAnchorMinWidth())) {
    if (csAnchorShowsTitle(title)) Text(title, color = pack.colorTextPrimary.toComposeColor(), fontSize = csControlsBatchStyleAnchorTitleFontSize.sp)
    items.forEach { item ->
      val current = csAnchorAriaCurrent(item.first == active)
      Text(item.second, color = if (item.first == active) pack.colorBrandOchre.toComposeColor() else pack.colorTextMuted.toComposeColor(), modifier = Modifier.padding(horizontal = csControlsBatchStyleAnchorItemPaddingX(), vertical = csControlsBatchStyleAnchorItemPaddingY()).let { if (current != null) it.semantics { stateDescription = current } else it })
    }
  }
}

data class CsCitation(val title: String, val source: String? = null, val href: String? = null)
const val csCitationLabel = "Sources"
const val csCitationRootClass = "cs-citations"
const val csCitationItemClass = "cs-citation"
const val csCitationTarget = "_blank"
const val csCitationRel = "noreferrer"
fun csCitationShowsHeading(heading: String?): Boolean = !heading.isNullOrEmpty()
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
fun CsCitationList(items: List<String> = emptyList(), dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, citations: List<CsCitation> = emptyList(), language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val heading = csCitationHeading(label, label == null, csCitationCopy("sources", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  val rows = if (citations.isNotEmpty()) citations else items.map { CsCitation(it) }
  Column(modifier, verticalArrangement = Arrangement.spacedBy(csAiStyleCitationsGap())) {
    if (heading != null) Text(heading, color = pack.colorTextPrimary.toComposeColor(), fontSize = csAiStyleCitationsLabelFontSize(pack).value.sp)
    rows.forEachIndexed { index, item ->
      val line = csCitationLine(index, item.title, item.source)
      val href = csCitationHref(item.href)
      Text(line, color = pack.colorTextPrimary.toComposeColor(), fontSize = csAiStyleCitationFontSize(pack).value.sp, modifier = if (href != null) Modifier.semantics { contentDescription = href } else Modifier)
    }
  }
}

const val csScrollAreaRootClass = "cs-scroll-area"
const val csScrollAreaTabIndex = 0
fun csScrollAreaMaxBlockSize(maxHeight: Int?): String? = maxHeight?.let { "${it}px" }
@Composable
fun CsScrollArea(maxHeight: Int? = null, modifier: Modifier = Modifier, content: @Composable () -> Unit) {
  Column(modifier.let { if (maxHeight != null) it.heightIn(max = maxHeight.dp) else it }.padding(csDataStyleScrollAreaFocusOutlineWidth(csDataStyleScrollAreaTabStop() < 0))) { content() }
}

@Composable
fun CsImage(dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, src: String? = null, alt: String = "", ratio: String = "16 / 9", preview: Boolean = false, state: String = "loading", fallback: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val previewWord = csImageCopy("preview", locale)
  val closeWord = csImageCopy("close", locale)
  val canPreview = csImageCanPreview(preview, state)
  var zoom by remember(src, preview) { mutableStateOf(false) }
  val isZoomOpen = csImagePreviewOpen(zoom, preview, state)
  val name = if (canPreview) csImagePreviewName(alt, previewWord) else alt
  Column(modifier.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown || event.key != Key.Escape || !isZoomOpen) return@onPreviewKeyEvent false
    zoom = false
    true
  }) {
    val display = if (state == "error") (if (csImageShowsFallback(fallback)) fallback!! else csImageFallbackMark) else alt
    Text(display, color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.sizeIn(minWidth = csControlsBatchStyleImageLoadingMinWidth(), minHeight = csControlsBatchStyleImageLoadingMinHeight()).let { if (canPreview) it.clickable { zoom = true } else it }.clearAndSetSemantics { contentDescription = name })
    if (isZoomOpen) {
      Column(Modifier.semantics { contentDescription = csImageDialogName(alt, previewWord) }) {
        CsTriggerButton(title = closeWord, onClick = { zoom = false }) { Text(closeWord) }
        Text(alt, color = pack.colorTextPrimary.toComposeColor())
      }
    }
  }
}

const val csLogoViewBox = "0 0 512 512"
const val csLogoRootClass = "cs-logo"
fun csLogoRole(decorative: Boolean): String? = if (decorative) null else "img"
fun csLogoTitleMarkup(decorative: Boolean, title: String): String =
  if (decorative) "" else "<title>${csLogoStyleEscapeTitle(title)}</title>"
@Composable
fun CsLogo(title: String = csLogoStyleDefaultTitle, decorative: Boolean = false, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, size: androidx.compose.ui.unit.Dp = csLogoStyleDefaultSize()) {
  val pack = csModePack(dark, highContrast, compact)
  val autoHeight = csLogoStyleAutoBlockSize()
  val label = csLogoStyleAriaLabel(title, decorative)
  Text(if (decorative) "" else title, color = pack.colorBrandOchre.toComposeColor(), modifier = modifier.sizeIn(minWidth = size, minHeight = if (autoHeight) size else 0.dp).let { if (csLogoStyleAriaHidden(decorative) == true) it.clearAndSetSemantics {} else if (label != null) it.semantics { contentDescription = label } else it })
}

const val csContextMenu = "Context menu"
const val csContextZoneRole = "group"
const val csContextMenuRole = "menu"
const val csContextItemRole = "menuitem"
const val csContextSeparatorRole = "separator"
const val csContextDefaultPlacement = "bottom-start"
fun csContextResolvedPlacement(placement: String?): String = placement ?: csContextDefaultPlacement
fun csContextItemClass(danger: Boolean): String = if (danger) "cs-menu__item cs-menu__item--danger" else "cs-menu__item"
fun csContextOpensFromKeyboard(key: String, shiftKey: Boolean): Boolean = key == "ContextMenu" || (key == "F10" && shiftKey)
fun csContextAcceptsKey(composing: Boolean, keyCode: Int): Boolean = !composing && keyCode != 229
fun csContextEscapeClose(): Boolean = false
fun csContextIsSeparator(item: String) = item == "-"
fun csContextFirst(items: List<String>) = items.indexOfFirst { !csContextIsSeparator(it) }.takeIf { it >= 0 }
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

@Composable
fun CsContextMenu(items: List<String> = emptyList(), onSelect: (String) -> Unit = {}, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, dangerItems: Set<String> = emptySet(), portal: Boolean = true, placement: String? = null, tabIndex: Int = 0, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  var raw by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var active by remember { mutableStateOf(0) }
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
  val actionable = items.filter { !csContextIsSeparator(it) }
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
    if (raw != null) {
      when (event.key) {
        Key.Escape -> { raw = null; natural = null; fitted = null; return@onPreviewKeyEvent true }
        Key.DirectionDown -> { csContextMove(active, actionable.size, "down")?.let { active = it }; return@onPreviewKeyEvent true }
        Key.DirectionUp -> { csContextMove(active, actionable.size, "up")?.let { active = it }; return@onPreviewKeyEvent true }
        Key.MoveHome -> { csContextMove(active, actionable.size, "home")?.let { active = it }; return@onPreviewKeyEvent true }
        Key.MoveEnd -> { csContextMove(active, actionable.size, "end")?.let { active = it }; return@onPreviewKeyEvent true }
        else -> return@onPreviewKeyEvent false
      }
    }
    val shiftF10 = event.key == Key.F10 && event.isShiftPressed
    val menuKey = event.key == Key.Menu
    if (!shiftF10 && !menuKey) return@onPreviewKeyEvent false
    if (csContextFirst(items) == null) return@onPreviewKeyEvent false
    active = 0
    raw = csContextKeyboardPoint(zoneHeight)
    natural = null
    fitted = null
    true
  }.pointerInput(items) {
    awaitEachGesture {
      val event = awaitPointerEvent()
      val down = event.changes.firstOrNull { it.pressed } ?: return@awaitEachGesture
      if (!event.buttons.isSecondaryPressed || csContextFirst(items) == null) return@awaitEachGesture
      active = 0
      raw = csContextPoint(down.position.x.toDouble(), down.position.y.toDouble(), 0.0, 0.0)
      natural = null
      fitted = null
    }
  }) {
    val pending = raw
    val initial = pending?.let { rawPoint -> natural?.let { size -> place(rawPoint, size, placement ?: "bottom-start") } }
    val shrinks = initial != null && natural != null && (natural!!.first - initial.maxWidth > 0.5 || natural!!.second - initial.maxHeight > 0.5)
    val finalSize = fitted ?: if (initial != null && !shrinks) natural else null
    val point = pending?.let { rawPoint -> finalSize?.let { size -> place(rawPoint, size, initial?.placement ?: (placement ?: "bottom-start")) } }
    if (pending != null && csContextFirst(items) != null) {
      val shown = point != null
      Column(Modifier.offset(with(density) { (point?.left ?: 0.0).toFloat().toDp() }, with(density) { (point?.top ?: 0.0).toFloat().toDp() }).alpha(if (shown) 1f else 0f).then(if (shown) Modifier else Modifier.clearAndSetSemantics { }).then(initial?.let { Modifier.widthIn(max = with(density) { it.maxWidth.toFloat().toDp() }).heightIn(max = with(density) { it.maxHeight.toFloat().toDp() }) } ?: Modifier).onGloballyPositioned {
        val width = it.size.width.toDouble()
        val height = it.size.height.toDouble()
        if (width > 0.0 && height > 0.0) {
          if (natural == null) natural = width to height
          else fitted = width to height
        }
      }.padding(csNavigationStyleMenuListPadding()).semantics { contentDescription = spoken }) {
        if (label != null) Text(label, modifier = Modifier.clearAndSetSemantics { })
        items.forEach { item ->
          if (csContextIsSeparator(item)) {
            Box(Modifier.heightIn(min = csNavigationStyleMenuSeparatorHeight()).background(pack.colorBorderDefault.toComposeColor()).clearAndSetSemantics { })
          } else {
            CsTriggerButton(title = item, onClick = { onSelect(item); raw = null; natural = null; fitted = null }) { Text(item) }
          }
        }
      }
    }
  }
}

const val csNavRole = "navigation"
const val csNavChevronGlyph = "▾"
const val csNavGap = 8
fun csNavTopClass(open: Boolean): String = if (open) "cs-navmenu__top is-open" else "cs-navmenu__top"
fun csNavEscapeClose(): Boolean = false
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

data class CsNavMenuCard(val label: String, val href: String? = null, val description: String? = null)
data class CsNavMenuItem(val label: String, val href: String? = null, val panel: List<CsNavMenuCard> = emptyList())

@Composable
private fun CsNavPanelButton(index: Int, item: CsNavMenuItem, open: Int?, onOpen: (Int?) -> Unit, onAnchor: (CsFloatingRect) -> Unit) {
  val interaction = remember { MutableInteractionSource() }
  val hovered by interaction.collectIsHoveredAsState()
  LaunchedEffect(hovered, open) {
    if (hovered) onOpen(csNavHover(open, index))
  }
  TextButton(onClick = { onOpen(csNavClick(open, index)) }, modifier = Modifier.hoverable(interaction).onGloballyPositioned { coordinates ->
    val bounds = coordinates.boundsInWindow()
    onAnchor(CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble()))
  }.semantics { stateDescription = if (open == index) "expanded" else "collapsed" }) {
    Text(item.label)
    Text("▾", modifier = Modifier.clearAndSetSemantics { })
  }
}

@Composable
fun CsNavigationMenu(items: List<CsNavMenuItem> = emptyList(), dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, portal: Boolean = true, placement: String? = null, ariaLabel: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  var open by remember { mutableStateOf<Int?>(null) }
  var anchors by remember { mutableStateOf(mapOf<Int, CsFloatingRect>()) }
  var natural by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var fitted by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var panelOrigin by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var panelScale by remember { mutableStateOf(1.0 to 1.0) }
  var pass by remember { mutableStateOf(0) }
  val placeName = csNavPlacement(placement)
  val config = androidx.compose.ui.platform.LocalConfiguration.current
  val density = androidx.compose.ui.platform.LocalDensity.current
  val viewWidth = with(density) { config.screenWidthDp.dp.toPx() }.toDouble()
  val viewHeight = with(density) { config.screenHeightDp.dp.toPx() }.toDouble()
  val viewport = CsFloatingRect(8.0, 8.0, maxOf(8.0, viewWidth - 8.0), maxOf(8.0, viewHeight - 8.0), 0.0, 0.0)
  fun choose(next: Int?) {
    if (next != open) {
      natural = null
      fitted = null
      panelOrigin = null
      panelScale = 1.0 to 1.0
      pass = 0
    }
    open = next
  }
  Column(modifier.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown || event.key != Key.Escape || open == null) return@onPreviewKeyEvent false
    choose(null)
    true
  }) {
    Row {
      items.forEachIndexed { index, item ->
        if (item.panel.isNotEmpty()) CsNavPanelButton(index, item, open, { next -> choose(next) }) { box ->
          if (anchors[index] != box) anchors = anchors + (index to box)
        } else Text(item.label, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.semantics { contentDescription = csNavHref(item.href) })
      }
    }
    val current = open
    val cards = current?.let { items.getOrNull(it) }?.panel.orEmpty()
    if (current != null && cards.isNotEmpty()) {
      val box = anchors[current] ?: CsFloatingRect(0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
      val originX = panelOrigin?.first ?: box.left
      val originY = panelOrigin?.second ?: box.bottom
      val place = natural?.let { first -> fitted?.let { second -> csNavShift(box, first.first, first.second, second.first, second.second, viewport, originX, originY, panelScale.first, panelScale.second, placeName) } }
      Popup(alignment = Alignment.TopStart, onDismissRequest = { choose(null) }, properties = PopupProperties(focusable = false, dismissOnBackPress = false, dismissOnClickOutside = true)) {
        Column(Modifier.onPreviewKeyEvent { event ->
          if (event.type != KeyEventType.KeyDown || event.key != Key.Escape) return@onPreviewKeyEvent false
          choose(null)
          true
        }.offset(x = with(density) { (place?.x ?: 0.0).toFloat().toDp() }, y = with(density) { (place?.y ?: 0.0).toFloat().toDp() }).alpha(if (place == null) 0f else 1f).then(if (place == null) Modifier.clearAndSetSemantics { } else Modifier).then(place?.let { Modifier.widthIn(max = with(density) { it.maxWidth.toFloat().toDp() }).heightIn(max = with(density) { it.maxHeight.toFloat().toDp() }) } ?: Modifier).onGloballyPositioned { coordinates ->
          val bounds = coordinates.boundsInWindow()
          val width = coordinates.size.width.toDouble()
          val height = coordinates.size.height.toDouble()
          if (width <= 0.0 || height <= 0.0) return@onGloballyPositioned
          val nextOrigin = bounds.left.toDouble() to bounds.top.toDouble()
          val nextScale = (if (width == 0.0) 1.0 else bounds.width / width) to (if (height == 0.0) 1.0 else bounds.height / height)
          if (panelOrigin != nextOrigin) panelOrigin = nextOrigin
          if (panelScale != nextScale) panelScale = nextScale
          if (natural == null) {
            natural = width to height
            pass = 1
          } else if (pass >= 1 && fitted != width to height) fitted = width to height
        }.padding(csNavigationStyleMenuListPadding()), verticalArrangement = Arrangement.spacedBy(csControlsBatchStyleNavMenuPanelOffset())) {
          cards.forEach { card ->
            TextButton(onClick = { choose(null) }, modifier = Modifier.semantics { contentDescription = csNavHref(card.href) }) {
              Column {
                Text(card.label, color = pack.colorTextPrimary.toComposeColor(), fontWeight = FontWeight.Bold)
                if (csNavShowsDescription(card.description)) Text(card.description ?: "", color = pack.colorTextMuted.toComposeColor())
              }
            }
          }
        }
      }
    }
  }
}

const val csCardSlotHeaderClass = "cs-card__header"
const val csCardSlotTitleClass = "cs-card__title"
const val csCardSlotSubtitleClass = "cs-card__subtitle"
const val csCardSlotBodyClass = "cs-card__body"
const val csCardSlotFooterClass = "cs-card__footer"
fun csCardSlotShowsTitle(title: String?): Boolean = csDataStyleCardShowsSlot(title)
fun csCardSlotShowsSubtitle(subtitle: String?): Boolean = csDataStyleCardShowsSlot(subtitle)

@Composable
fun CsCardHeader(title: String = "", dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, subtitle: String? = null, children: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  Column(modifier.padding(start = csDataStyleCardHeaderPaddingX(), top = csDataStyleCardHeaderPaddingTop(), end = csDataStyleCardHeaderPaddingX(), bottom = csDataStyleCardHeaderPaddingBottom()), verticalArrangement = Arrangement.spacedBy(csDataStyleCardSubtitleMarginTop())) {
    if (csDataStyleCardShowsSlot(title)) Text(title, color = pack.colorTextPrimary.toComposeColor(), fontWeight = FontWeight.Bold)
    if (csDataStyleCardShowsSlot(subtitle)) Text(subtitle ?: "", color = pack.colorTextMuted.toComposeColor(), fontSize = csDataStyleCardSubtitleFontSize(pack).value.sp)
    if (csDataStyleCardShowsSlot(children)) Text(children ?: "", color = pack.colorTextPrimary.toComposeColor())
  }
}

@Composable
fun CsCardBody(text: String = "", dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  Text(text, color = csModePack(dark, highContrast, compact).colorTextPrimary.toComposeColor(), modifier = modifier.padding(horizontal = csDataStyleCardBodyPaddingX(), vertical = csDataStyleCardBodyPaddingY()))
}

@Composable
fun CsCardFooter(text: String = "", dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  Text(text, color = csModePack(dark, highContrast, compact).colorTextMuted.toComposeColor(), modifier = modifier.padding(start = csDataStyleCardFooterPaddingX(), top = csDataStyleCardFooterPaddingTop(), end = csDataStyleCardFooterPaddingX(), bottom = csDataStyleCardFooterPaddingBottom()))
}

const val csToastStackRegionRole = "region"
const val csToastStackRootClass = "cs-toast-stack"
@Composable
fun CsToastStack(modifier: Modifier = Modifier, label: String? = null, language: String? = null, content: @Composable () -> Unit = {}) {
  val name = label ?: csToastCopy("notifications", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  Column(modifier.padding(csFeedbackStyleToastStackInset()).semantics { contentDescription = name }, verticalArrangement = Arrangement.spacedBy(csFeedbackStyleToastStackGap())) { content() }
}

enum class CsGlassMaterial(val className: String) {
  Whisper("cs-surface-whisper"),
  Light("cs-surface-light"),
  Standard("cs-surface-standard"),
  GlassCard("cs-glass-card"),
  Heavy("cs-surface-heavy"),
  Solid("cs-surface-solid"),
  Matte("cs-surface-matte"),
}

enum class CsGlassSurfaceBase { Page, Panel, Raised }
enum class CsGlassShadow { None, Sm, Lg }
enum class CsDepthTier(val className: String) {
  Bg("cs-depth-bg"),
  Section("cs-depth-section"),
  Card("cs-depth-card"),
  Nav("cs-depth-nav"),
  Modal("cs-depth-modal"),
  Toast("cs-depth-toast"),
}

val csGlassOverlaySurfacePrecedence = listOf(
  "cs-surface-matte",
  "cs-surface-solid",
  "cs-surface-heavy",
  "cs-surface-standard",
  "cs-glass-card",
  "cs-surface-light",
  "cs-surface-whisper",
)

fun csGlassOverlaySurfaceClass(className: String?): String {
  val classes = (className ?: "").trim().split(Regex("\\s+")).filter { it.isNotEmpty() }.toSet()
  return csGlassOverlaySurfacePrecedence.firstOrNull { classes.contains(it) } ?: ""
}

fun csGlassMaterialFromClassName(className: String?): CsGlassMaterial? {
  val resolved = csGlassOverlaySurfaceClass(className)
  return CsGlassMaterial.entries.firstOrNull { it.className == resolved }
}

fun csGlassSurfaceBase(material: CsGlassMaterial): CsGlassSurfaceBase = when (material) {
  CsGlassMaterial.Whisper -> CsGlassSurfaceBase.Page
  CsGlassMaterial.Light, CsGlassMaterial.Standard, CsGlassMaterial.GlassCard, CsGlassMaterial.Solid, CsGlassMaterial.Matte -> CsGlassSurfaceBase.Panel
  CsGlassMaterial.Heavy -> CsGlassSurfaceBase.Raised
}

fun csGlassOpacity(material: CsGlassMaterial, pack: CSTokenModePack): Double = when (material) {
  CsGlassMaterial.Whisper -> pack.glassWhisperOpacity
  CsGlassMaterial.Light -> pack.glassLightOpacity
  CsGlassMaterial.Standard, CsGlassMaterial.GlassCard -> pack.glassStandardOpacity
  CsGlassMaterial.Heavy -> pack.glassHeavyOpacity
  CsGlassMaterial.Solid, CsGlassMaterial.Matte -> 1.0
}

fun csGlassBlur(material: CsGlassMaterial, pack: CSTokenModePack) = when (material) {
  CsGlassMaterial.Whisper -> pack.glassWhisperBlur.toDp()
  CsGlassMaterial.Light -> pack.glassLightBlur.toDp()
  CsGlassMaterial.Standard, CsGlassMaterial.GlassCard -> pack.glassStandardBlur.toDp()
  CsGlassMaterial.Heavy -> pack.glassHeavyBlur.toDp()
  CsGlassMaterial.Solid, CsGlassMaterial.Matte -> 0.dp
}

fun csGlassSaturate(material: CsGlassMaterial, pack: CSTokenModePack): Double = when (material) {
  CsGlassMaterial.Whisper -> pack.glassWhisperSaturate
  CsGlassMaterial.Light -> pack.glassLightSaturate
  CsGlassMaterial.Standard, CsGlassMaterial.GlassCard -> pack.glassStandardSaturate
  CsGlassMaterial.Heavy -> pack.glassHeavySaturate
  CsGlassMaterial.Solid, CsGlassMaterial.Matte -> 1.0
}

fun csGlassBorderMix(material: CsGlassMaterial): Double = when (material) {
  CsGlassMaterial.Whisper -> 0.0
  CsGlassMaterial.Light -> 0.50
  CsGlassMaterial.Standard, CsGlassMaterial.GlassCard -> 0.60
  CsGlassMaterial.Heavy -> 0.80
  CsGlassMaterial.Solid, CsGlassMaterial.Matte -> 1.0
}

fun csGlassBorderWidth(material: CsGlassMaterial) = if (material == CsGlassMaterial.Whisper) 0.dp else 1.dp

fun csGlassShadow(material: CsGlassMaterial): CsGlassShadow = when (material) {
  CsGlassMaterial.Whisper, CsGlassMaterial.Light, CsGlassMaterial.Solid, CsGlassMaterial.Matte -> CsGlassShadow.None
  CsGlassMaterial.Standard, CsGlassMaterial.GlassCard -> CsGlassShadow.Sm
  CsGlassMaterial.Heavy -> CsGlassShadow.Lg
}

const val csGlassLensEdgeAngle = 135.0
fun csGlassLensEdgeWidth() = 1.dp
const val csGlassLensHighlightAlpha = 0.30
const val csGlassLensTransparentStartStop = 0.30
const val csGlassLensTransparentEndStop = 0.70
const val csGlassLensUmberAlpha = 0.15

fun csGlassShowsLensEdge(
  material: CsGlassMaterial,
  reducedTransparency: Boolean = false,
  forcedColors: Boolean = false,
  overlaySurface: Boolean = false,
): Boolean {
  if (reducedTransparency || forcedColors || overlaySurface) return false
  return material == CsGlassMaterial.Standard || material == CsGlassMaterial.Heavy || material == CsGlassMaterial.GlassCard
}

fun csGlassDepthValue(tier: CsDepthTier, pack: CSTokenModePack): Double = when (tier) {
  CsDepthTier.Bg -> pack.depthBg
  CsDepthTier.Section -> pack.depthSection
  CsDepthTier.Card -> pack.depthCard
  CsDepthTier.Nav -> pack.depthNav
  CsDepthTier.Modal -> pack.depthModal
  CsDepthTier.Toast -> pack.depthToast
}

fun csGlassDepthSticky(tier: CsDepthTier): Boolean = tier == CsDepthTier.Nav

fun csGlassEffectiveSurfaceBase(
  material: CsGlassMaterial,
  reducedTransparency: Boolean = false,
  supportsBackdropFilter: Boolean = true,
): CsGlassSurfaceBase = if (reducedTransparency || !supportsBackdropFilter) CsGlassSurfaceBase.Panel else csGlassSurfaceBase(material)

fun csGlassEffectiveOpacity(
  material: CsGlassMaterial,
  pack: CSTokenModePack,
  reducedTransparency: Boolean = false,
  forcedColors: Boolean = false,
  supportsBackdropFilter: Boolean = true,
): Double = if (reducedTransparency || forcedColors || !supportsBackdropFilter) 1.0 else csGlassOpacity(material, pack)

fun csGlassEffectiveBlur(
  material: CsGlassMaterial,
  pack: CSTokenModePack,
  reducedTransparency: Boolean = false,
  forcedColors: Boolean = false,
  overlaySurfaceReady: Boolean = false,
) = if (reducedTransparency || forcedColors || overlaySurfaceReady) 0.dp else csGlassBlur(material, pack)

fun csGlassEffectiveBorderMix(
  material: CsGlassMaterial,
  reducedTransparency: Boolean = false,
  forcedColors: Boolean = false,
): Double = if (reducedTransparency || forcedColors) 1.0 else csGlassBorderMix(material)

fun csGlassEffectiveBorderWidth(
  material: CsGlassMaterial,
  reducedTransparency: Boolean = false,
  forcedColors: Boolean = false,
  overlaySurface: Boolean = false,
) = when {
  overlaySurface -> 0.dp
  reducedTransparency || forcedColors -> 1.dp
  else -> csGlassBorderWidth(material)
}

const val csAuroraInkHex = "#ffffff"
const val csAuroraOchreAlpha = 0.46
const val csAuroraOchreCenterX = 0.12
const val csAuroraOchreCenterY = -0.10
const val csAuroraOchreRadiusX = 0.90
const val csAuroraOchreRadiusY = 1.20
const val csAuroraOchreStop = 0.55
const val csAuroraGoldHex = "#ffcf5c"
const val csAuroraGoldAlpha = 0.32
const val csAuroraGoldCenterX = 0.88
const val csAuroraGoldCenterY = 0.08
const val csAuroraGoldRadiusX = 0.70
const val csAuroraGoldRadiusY = 0.90
const val csAuroraGoldStop = 0.60
const val csAuroraDeepHex = "#1a1108"
const val csAuroraDeepAlpha = 0.60
const val csAuroraDeepCenterX = 0.50
const val csAuroraDeepCenterY = 1.20
const val csAuroraDeepRadiusX = 1.20
const val csAuroraDeepRadiusY = 1.20
const val csAuroraDeepStop = 0.60

@Composable
fun CsAuroraSurface(
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  photo: Boolean = false,
  modifier: Modifier = Modifier,
  content: @Composable () -> Unit,
) {
  val pack = csModePack(dark, highContrast, compact)
  Box(
    modifier
      .background(pack.colorBrandUmber.toComposeColor())
      .background(
        Brush.radialGradient(
          colors = listOf(
            pack.colorBrandOchre.toComposeColor().copy(alpha = csAuroraOchreAlpha.toFloat()),
            Color.Transparent,
          )
        )
      )
  ) {
    content()
  }
}
