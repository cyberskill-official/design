package world.cyberskill.design

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.zIndex
import androidx.compose.ui.layout.boundsInWindow
import androidx.compose.ui.layout.positionInRoot
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.isShiftPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription

const val csTimeLabel = "Time"
const val csTimeClockGlyph = "🕒"
fun csTimeShowsClockIcon() = true
fun csTimeCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Giờ")
  val en = mapOf("label" to csTimeLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csTimeName(label: String?, labelledBy: String?, fallback: String) = when {
  label != null -> label
  !labelledBy.isNullOrEmpty() -> null
  else -> fallback
}
fun csTimeSlots(step: Double): List<String> {
  val whole = step.toInt().toDouble()
  val safe = if (step.isFinite() && step == whole && whole >= 1 && whole <= 1440) whole.toInt() else 30
  val out = mutableListOf<String>()
  var minute = 0
  while (minute < 24 * 60) {
    out += "%02d:%02d".format(minute / 60, minute % 60)
    minute += safe
  }
  return out
}

fun csMentionPlacement(placement: String?) = placement ?: "bottom-start"
fun csMentionResolvedRows(rows: Int) = maxOf(1, rows)
fun csMentionActive(index: Int, count: Int) = if (count <= 0) 0 else index.coerceIn(0, count - 1)
fun csMentionNextIndex(current: Int, count: Int, down: Boolean) = if (count <= 0) 0 else if (down) minOf(count - 1, current + 1) else maxOf(0, current - 1)
fun csMentionQuery(text: String, caret: Int): String? {
  val end = caret.coerceIn(0, text.length)
  val head = text.substring(0, end)
  val at = head.lastIndexOf('@')
  if (at < 0) return null
  if (at > 0 && !head[at - 1].isWhitespace()) return null
  val after = head.substring(at + 1)
  if (after.any { !(it in 'A'..'Z' || it in 'a'..'z' || it in '0'..'9' || it == '_') }) return null
  return after.lowercase()
}

fun csMentionDismissOutside(open: Boolean, inside: Boolean) = open && !inside
fun csMentionClearOnBlur(relatedInside: Boolean) = !relatedInside
data class CsMentionPlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csMentionShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String = "bottom-start"): CsMentionPlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement, 0.0) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, 0.0) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsMentionPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}
fun csMentionHits(users: List<String>, query: String?): List<String> {
  if (query == null) return emptyList()
  return users.filter { it.lowercase().contains(query) }.take(6)
}
fun csMentionPick(text: String, caret: Int, user: String): String {
  val end = caret.coerceIn(0, text.length)
  val head = text.substring(0, end)
  val tail = text.substring(end)
  val at = head.lastIndexOf('@')
  if (at < 0) return text
  return head.substring(0, at) + "@" + user + " " + tail
}

fun csReorder(items: List<String>, from: Int, to: Int): List<String> {
  if (from < 0 || to < 0 || from >= items.size || to >= items.size || from == to) return items
  val next = items.toMutableList()
  val moved = next.removeAt(from)
  next.add(to, moved)
  return next
}

fun csTourClamp(index: Int, count: Int): Int = if (count <= 0) 0 else minOf(count - 1, maxOf(0, index))
fun csTourNotifyClose(onOpenChange: ((Boolean) -> Unit)?, onClose: (() -> Unit)?) {
  onOpenChange?.invoke(false)
  onClose?.invoke()
}
fun csTourCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("skip" to "Bỏ qua", "back" to "Quay lại", "next" to "Tiếp", "done" to "Xong")
  val en = mapOf("skip" to "Skip", "back" to "Back", "next" to "Next", "done" to "Done")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csTourLabel(text: String?, fallback: String) = text ?: fallback
fun csTourLast(index: Int, count: Int) = count > 0 && index == count - 1
fun csTourCount(index: Int, count: Int) = "${index + 1} / $count"
fun csTourShows(open: Boolean, count: Int) = open && count > 0
fun csTourClosesOnBackdrop() = true
fun csTourStops(hasBack: Boolean) = if (hasBack) 3 else 2
fun csTourShowsBody(body: String?) = !body.isNullOrEmpty()
data class CsTourTarget(val left: Double, val top: Double, val width: Double, val height: Double)
data class CsTourHole(val x: Double, val y: Double, val w: Double, val h: Double)
data class CsTourPop(val top: Double, val left: Double)
fun csTourHole(target: CsTourTarget?) = target?.let { CsTourHole(it.left - 6, it.top - 6, it.width + 12, it.height + 12) }
fun csTourPop(hole: CsTourHole?, viewWidth: Double, viewHeight: Double) = if (hole == null) CsTourPop(80.0, 40.0) else CsTourPop(minOf(viewHeight - 170, hole.y + hole.h + 12), maxOf(12.0, minOf(viewWidth - 292, hole.x)))

@Composable
fun CsTimePicker(value: String = "09:00", onChange: (String) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, labelledBy: String? = null, step: Double = 30.0, disabled: Boolean = false, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val timeName = csTimeName(label, labelledBy, csTimeCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  val gap = csControlsWaveStyleTimePickerGap()
  val padX = csControlsWaveStyleTimePickerPaddingX()
  val enabled = !disabled && csControlEnabled()
  var open by remember { mutableStateOf(false) }
  Column(modifier, verticalArrangement = Arrangement.spacedBy(gap)) {
    Row(horizontalArrangement = Arrangement.spacedBy(gap), verticalAlignment = Alignment.CenterVertically) {
      if (csTimeShowsClockIcon()) Text(csTimeClockGlyph, color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.clearAndSetSemantics {})
      CsTriggerButton(title = value, onClick = { if (enabled) open = !open }, enabled = enabled, modifier = Modifier.padding(horizontal = padX).minimumInteractiveComponentSize().let { if (timeName != null) it.semantics { contentDescription = timeName } else it }) { Text(value, color = pack.colorTextPrimary.toComposeColor()) }
    }
    if (open && enabled) csTimeSlots(step).forEach { slot -> CsTriggerButton(title = slot, onClick = { onChange(slot); open = false }, modifier = Modifier.minimumInteractiveComponentSize()) { Text(slot) } }
  }
}

const val csMentionPlaceholder = "Add a note — @ to mention"
fun csMentionCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("placeholder" to "Thêm ghi chú — gõ @ để nhắc tên")
  val en = mapOf("placeholder" to csMentionPlaceholder)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csMentionPlaceholderText(text: String?, fallback: String) = text ?: fallback
fun csMentionName(ariaLabel: String?, placeholder: String) = if (ariaLabel.isNullOrEmpty()) placeholder else ariaLabel
fun csMentionOption(user: String) = "@$user"
@Composable
fun CsMentions(text: String, users: List<String>, onChange: (String) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, ariaLabel: String? = null, placeholder: String? = null, rows: Int = 3, portal: Boolean = true, placement: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val hint = csMentionPlaceholderText(placeholder, csMentionCopy("placeholder", locale))
  val spoken = csMentionName(ariaLabel, hint)
  val handle = rememberFocusHandle("mentions")
  var dismissed by remember { mutableStateOf(false) }
  var active by remember { mutableStateOf(0) }
  var field by remember { mutableStateOf<CsFloatingRect?>(null) }
  var natural by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var fitted by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var origin by remember { mutableStateOf(0.0 to 0.0) }
  var panelScale by remember { mutableStateOf(1.0 to 1.0) }
  val hits = if (dismissed) emptyList() else csMentionHits(users, csMentionQuery(text, text.length))
  val current = csMentionActive(active, hits.size)
  val config = LocalConfiguration.current
  val density = LocalDensity.current
  val viewWidth = with(density) { config.screenWidthDp.dp.toPx() }.toDouble()
  val viewHeight = with(density) { config.screenHeightDp.dp.toPx() }.toDouble()
  val viewport = CsFloatingRect(8.0, 8.0, maxOf(8.0, viewWidth - 8.0), maxOf(8.0, viewHeight - 8.0), 0.0, 0.0)
  val placeName = csMentionPlacement(placement)
  val place = field?.let { box ->
    val first = natural
    val second = fitted
    if (first == null || second == null) null else csMentionShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second, placeName)
  }
  val shiftX = place?.let { with(density) { it.x.toFloat().toDp() } } ?: csControlsBatchStyleMentionsPopupInlineStart()
  val shiftY = place?.let { with(density) { it.y.toFloat().toDp() } } ?: csControlsBatchStyleMentionsPopupBlockOffset()
  val maxW = csControlsBatchStyleMentionsMaxWidth()
  val lineCount = csMentionResolvedRows(rows)
  LaunchedEffect(hits.isEmpty()) { if (hits.isEmpty()) { natural = null; fitted = null } }
  Column(modifier.widthIn(max = maxW).onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
    when (event.key) {
      Key.Escape -> { dismissed = true; true }
      Key.DirectionDown -> if (hits.isNotEmpty()) { active = csMentionNextIndex(current, hits.size, true); true } else false
      Key.DirectionUp -> if (hits.isNotEmpty()) { active = csMentionNextIndex(current, hits.size, false); true } else false
      Key.Enter -> if (current in hits.indices) { onChange(csMentionPick(text, text.length, hits[current])); dismissed = true; true } else false
      else -> false
    }
  }) {
    Box(Modifier.onGloballyPositioned {
      val bounds = it.boundsInWindow()
      field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
    }) {
      if (text.isEmpty() && hint.isNotEmpty()) Text(hint, color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.clearAndSetSemantics {})
      androidx.compose.foundation.text.BasicTextField(value = text, minLines = lineCount, maxLines = lineCount, onValueChange = { next -> if (!csControlEnabled()) return@BasicTextField; handle.claim(); dismissed = false; active = 0; onChange(next) }, enabled = csControlEnabled(), modifier = Modifier.focusRequester(handle.requester).onFocusChanged {
        if (it.isFocused) handle.claim()
        else if (csMentionClearOnBlur(false)) dismissed = true
      }.semantics { contentDescription = spoken }, textStyle = androidx.compose.ui.text.TextStyle(color = pack.colorTextPrimary.toComposeColor()))
    }
    if (hits.isNotEmpty()) Popup(alignment = Alignment.TopStart, onDismissRequest = { if (csMentionDismissOutside(true, false)) dismissed = true }, properties = PopupProperties(focusable = false, dismissOnBackPress = false, dismissOnClickOutside = true)) {
      Column(Modifier.onGloballyPositioned {
        val bounds = it.boundsInWindow()
        val width = it.size.width.toDouble()
        val height = it.size.height.toDouble()
        if (width <= 0.0 || height <= 0.0) return@onGloballyPositioned
        origin = bounds.left.toDouble() to bounds.top.toDouble()
        panelScale = (bounds.width / width) to (bounds.height / height)
        if (natural == null) natural = width to height else fitted = width to height
      }.offset(x = shiftX, y = shiftY).widthIn(max = with(density) { (place?.maxWidth ?: viewWidth).toFloat().toDp() })) {
        hits.forEachIndexed { index, user ->
          CsTriggerButton(title = csMentionOption(user), onClick = { onChange(csMentionPick(text, text.length, user)); dismissed = true }, modifier = Modifier.minimumInteractiveComponentSize().semantics { stateDescription = (index == current).toString() }) { Text(csMentionOption(user)) }
        }
      }
    }
  }
}

fun csSortCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("moveUp" to "Di chuyển lên", "moveDown" to "Di chuyển xuống")
  val en = mapOf("moveUp" to "Move up", "moveDown" to "Move down")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csSortLabel(text: String?, fallback: String) = text ?: fallback
fun csSortCanMoveUp(index: Int) = index > 0
fun csSortCanMoveDown(index: Int, count: Int) = index >= 0 && index < count - 1
fun csSortListGap() = 6.dp
fun csSortMaxWidth() = 380.dp
fun csSortItemGap() = 10.dp
fun csSortItemPaddingY() = 10.dp
fun csSortItemPaddingX() = 12.dp
fun csSortItemOpacity(dragging: Boolean) = if (dragging) 0.5f else 1f
fun csSortItemBorderWidth(over: Boolean) = if (over) 2.dp else 1.dp
fun csSortItemBorderColor(over: Boolean, accent: CSColorValue, border: CSColorValue) = if (over) accent else border
fun csSortOpsGap() = 4.dp
fun csSortButtonOpacity(enabled: Boolean) = if (enabled) 1f else 0.4f
fun csSortRowAt(originY: Double, rowHeight: Double, count: Int, pointY: Double): Int? {
  if (count <= 0 || rowHeight <= 0.0) return null
  val index = kotlin.math.floor((pointY - originY) / rowHeight).toInt()
  return if (index < 0 || index >= count) null else index
}
fun csSortDrop(items: List<String>, from: Int?, to: Int?): List<String>? {
  if (from == null || to == null) return null
  val next = csReorder(items, from, to)
  return if (next == items) null else next
}
fun csSortFallbackButtonAfterMove(to: Int, count: Int): String? = when {
  to == 0 -> "down"
  count > 0 && to == count - 1 -> "up"
  else -> null
}
@Composable
fun CsSortable(items: List<String>, onChange: (List<String>) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, upLabel: String? = null, downLabel: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val up = csSortLabel(upLabel, csSortCopy("moveUp", locale))
  val down = csSortLabel(downLabel, csSortCopy("moveDown", locale))
  var originY by remember { mutableStateOf(0.0) }
  var rowHeight by remember { mutableStateOf(0.0) }
  var dragFrom by remember { mutableStateOf<Int?>(null) }
  var pointY by remember { mutableStateOf(0.0) }
  val overIndex = if (dragFrom == null) null else csSortRowAt(originY, rowHeight, items.size, pointY)
  Column(modifier.widthIn(max = csSortMaxWidth()).onGloballyPositioned { originY = it.positionInRoot().y.toDouble() }, verticalArrangement = Arrangement.spacedBy(csSortListGap())) {
    items.forEachIndexed { index, item ->
      val isOver = overIndex == index
      Row(Modifier.alpha(csSortItemOpacity(dragFrom == index)).border(csSortItemBorderWidth(isOver), csSortItemBorderColor(isOver, pack.accent, pack.colorBorderDefault).toComposeColor(), RoundedCornerShape(pack.radiusMd.toDp())).background(pack.colorSurfacePanel.toComposeColor(), RoundedCornerShape(pack.radiusMd.toDp())).padding(horizontal = csSortItemPaddingX(), vertical = csSortItemPaddingY()).onGloballyPositioned { if (it.size.height > 0) rowHeight = it.size.height.toDouble() }, horizontalArrangement = Arrangement.spacedBy(csSortItemGap()), verticalAlignment = Alignment.CenterVertically) {
        Text("⠿", color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.clearAndSetSemantics {}.pointerInput(items, originY, rowHeight) {
          detectDragGestures(
            onDragStart = { offset ->
              dragFrom = index
              pointY = originY + rowHeight * index + offset.y.toDouble()
            },
            onDragEnd = {
              val to = csSortRowAt(originY, rowHeight, items.size, pointY)
              csSortDrop(items, dragFrom, to)?.let(onChange)
              dragFrom = null
            },
            onDragCancel = { dragFrom = null },
            onDrag = { change, _ ->
              pointY = originY + rowHeight * index + change.position.y.toDouble()
            },
          )
        })
        Text(item, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.weight(1f))
        Row(horizontalArrangement = Arrangement.spacedBy(csSortOpsGap()), verticalAlignment = Alignment.CenterVertically) {
          CsTriggerButton(title = "↑", onClick = { if (csSortCanMoveUp(index)) onChange(csReorder(items, index, index - 1)) }, enabled = csSortCanMoveUp(index), modifier = Modifier.alpha(csSortButtonOpacity(csSortCanMoveUp(index))).semantics { contentDescription = up }) { Text("↑", modifier = Modifier.clearAndSetSemantics {}) }
          CsTriggerButton(title = "↓", onClick = { if (csSortCanMoveDown(index, items.size)) onChange(csReorder(items, index, index + 1)) }, enabled = csSortCanMoveDown(index, items.size), modifier = Modifier.alpha(csSortButtonOpacity(csSortCanMoveDown(index, items.size))).semantics { contentDescription = down }) { Text("↓", modifier = Modifier.clearAndSetSemantics {}) }
        }
      }
    }
  }
}

@Composable
fun CsTour(steps: List<String>, index: Int, onIndex: (Int) -> Unit, onOpenChange: (Boolean) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, bodies: List<String?> = emptyList(), targets: List<CsTourTarget?> = emptyList(), backLabel: String? = null, nextLabel: String? = null, doneLabel: String? = null, skipLabel: String? = null, language: String? = null, open: Boolean = true, onClose: (() -> Unit)? = null) {
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val skip = csTourLabel(skipLabel, csTourCopy("skip", locale))
  val back = csTourLabel(backLabel, csTourCopy("back", locale))
  val next = csTourLabel(nextLabel, csTourCopy("next", locale))
  val done = csTourLabel(doneLabel, csTourCopy("done", locale))
  val close = { csTourNotifyClose(onOpenChange, onClose) }
  var trap by remember { mutableStateOf(0) }
  LaunchedEffect(open) { if (open) { onIndex(0); trap = 0 } }
  if (!csTourShows(open, steps.size)) return
  val active = csTourClamp(index, steps.size)
  val pack = csModePack(dark, highContrast, compact)
  val last = csTourLast(active, steps.size)
  val stops = csTourStops(active > 0)
  val config = androidx.compose.ui.platform.LocalConfiguration.current
  val target = targets.getOrNull(active)
  val hole = csTourHole(target)
  val pop = csTourPop(hole, config.screenWidthDp.toDouble(), config.screenHeightDp.toDouble())
  val body = bodies.getOrNull(active)
  val holeDepth = csControlsBatchStyleTourHoleDepth(pack).toFloat()
  val popDepth = csControlsBatchStyleTourPopDepth(pack).toFloat()
  val popWidth = csControlsBatchStyleTourPopWidth()
  Box(modifier) {
    if (csTourClosesOnBackdrop()) Box(Modifier.matchParentSize().clickable { close() })
    if (hole != null) Box(Modifier.zIndex(holeDepth).offset(hole.x.dp, hole.y.dp).size(hole.w.dp, hole.h.dp).border(3.dp, pack.colorBrandOchre.toComposeColor(), androidx.compose.foundation.shape.RoundedCornerShape(8.dp)))
    Column(Modifier.zIndex(popDepth).widthIn(max = popWidth).offset(pop.left.dp, pop.top.dp).semantics { contentDescription = steps[active] }.onPreviewKeyEvent { event ->
      if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
      if (event.key == Key.Escape) { close(); return@onPreviewKeyEvent true }
      if (event.key != Key.Tab) return@onPreviewKeyEvent false
      val nextStop = csFocusNext(trap, stops, event.isShiftPressed, trap >= 0) ?: return@onPreviewKeyEvent false
      trap = if (csModalPullBack(nextStop >= 0)) 0 else nextStop
      true
    }) {
      Text(steps[active], color = pack.colorTextPrimary.toComposeColor())
      if (csTourShowsBody(body)) Text(body ?: "", color = pack.colorTextPrimary.toComposeColor())
      Text(csTourCount(active, steps.size), color = pack.colorTextMuted.toComposeColor())
      CsTriggerButton(title = skip, onClick = { close() }) { Text(skip) }
      if (active > 0) CsTriggerButton(title = back, onClick = { onIndex(active - 1) }) { Text(back) }
      CsTriggerButton(title = if (last) done else next, onClick = { if (last) close() else onIndex(active + 1) }) { Text(if (last) done else next) }
    }
  }
}

fun csTableColumnCount(columns: List<String>) = maxOf(1, columns.size)
fun csTableCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("empty" to "Không có kết quả", "loading" to "Đang tải bảng", "error" to "Không tải được bảng này", "errorHint" to "Kiểm tra kết nối, rồi thử lại.")
  val en = mapOf("empty" to "No results", "loading" to "Loading table", "error" to "We couldn't load this table", "errorHint" to "Check your connection, then try again.")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csTableText(text: String?, fallback: String) = text ?: fallback
fun csTableShowsCaption(caption: String?) = !caption.isNullOrEmpty()
fun csTableAlert(state: String) = state == "error"
@Composable
fun CsDataTable(rows: List<String>, state: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, columns: List<String> = emptyList(), caption: String? = null, emptyLabel: String? = null, errorLabel: String? = null, loadingLabel: String? = null, loadingRows: Double = 5.0, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val count = csRenderCount(loadingRows, 5, 1)
  val empty = csTableText(emptyLabel, csTableCopy("empty", locale))
  val captionMargin = csTableStyleCaptionMarginBottom()
  val statusPadY = csTableStyleStatusPaddingY(pack)
  val cellPadX = csTableStyleCellPaddingX()
  val cellPadY = csTableStyleCellPaddingY()
  Column(modifier) {
    if (csTableShowsCaption(caption)) Text(caption ?: "", color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.padding(bottom = captionMargin))
    when (state) {
      "loading" -> Column(Modifier.padding(vertical = statusPadY).semantics { contentDescription = csTableCopy("loading", locale); stateDescription = "true" }) {
        if (loadingLabel != null) Text(loadingLabel, color = pack.colorTextMuted.toComposeColor())
        else {
          if (columns.isNotEmpty()) Text(columns.joinToString(" "), color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.padding(horizontal = cellPadX, vertical = cellPadY).clearAndSetSemantics {})
          repeat(count) { Text(" ", modifier = Modifier.clearAndSetSemantics {}, color = pack.colorBorderDefault.toComposeColor()) }
        }
      }
      "error" -> {
        val body: @Composable () -> Unit = {
          if (errorLabel != null) Text(errorLabel, color = pack.colorSemanticDangerText.toComposeColor()) else Column { Text(csTableCopy("error", locale), color = pack.colorSemanticDangerText.toComposeColor()); Text(csTableCopy("errorHint", locale), color = pack.colorTextMuted.toComposeColor()) }
        }
        if (csTableAlert(state)) Column(Modifier.padding(vertical = statusPadY).semantics { liveRegion = LiveRegionMode.Assertive }) { body() } else Column(Modifier.padding(vertical = statusPadY)) { body() }
      }
      else -> {
        if (columns.isNotEmpty()) Text(columns.joinToString(" "), color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.padding(horizontal = cellPadX, vertical = cellPadY))
        if (rows.isEmpty()) Text(empty, color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.padding(vertical = statusPadY)) else rows.forEach { Text(it, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.padding(horizontal = cellPadX, vertical = cellPadY)) }
      }
    }
  }
}

@Composable
fun CsPopconfirm(title: String, open: Boolean, onOpenChange: (Boolean) -> Unit, onConfirm: () -> Unit, onCancel: () -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, trigger: String? = null, portal: Boolean = true, placement: String? = null, confirmLabel: String? = null, cancelLabel: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val okName = csPopconfirmOkText(confirmLabel, csPopconfirmCopy("ok", spoken))
  val cancelName = csPopconfirmOkText(cancelLabel, csPopconfirmCopy("cancel", spoken))
  val triggerFace = csPopconfirmTriggerText(trigger, title)
  val minW = csControlsWaveStylePopconfirmMinWidth()
  val padY = csControlsWaveStylePopconfirmPaddingY()
  val padX = csControlsWaveStylePopconfirmPaddingX()
  val titleMargin = csControlsWaveStylePopconfirmTitleMarginBottom()
  val actionsGap = csControlsWaveStylePopconfirmActionsGap()
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
    if (first == null || second == null) null else csPopconfirmShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second, csPopconfirmPlacement(placement))
  }
  if (!open && natural != null) { natural = null; fitted = null }
  Column(modifier.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown || event.key != Key.Escape || !open) return@onPreviewKeyEvent false
    onOpenChange(false)
    true
  }) {
    CsTriggerButton(title = triggerFace, onClick = { onOpenChange(!open) }, modifier = Modifier.onGloballyPositioned {
      val bounds = it.boundsInWindow()
      field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
    }.semantics { stateDescription = open.toString() }) { Text(triggerFace) }
    if (open) Column(Modifier.widthIn(min = minW).padding(horizontal = padX, vertical = padY).onGloballyPositioned {
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
    }.offset(x = with(density) { (place?.x ?: 0.0).toFloat().toDp() }, y = place?.let { with(density) { it.y.toFloat().toDp() } } ?: csControlsWaveStylePopconfirmOffset()), verticalArrangement = Arrangement.spacedBy(actionsGap)) {
      Text(title, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.padding(bottom = titleMargin))
      CsTriggerButton(title = cancelName, onClick = { onOpenChange(false); onCancel() }) { Text(cancelName) }
      CsTriggerButton(title = okName, onClick = { onOpenChange(false); onConfirm() }) { Text(okName) }
    }
  }
}

const val csToggleLabel = "Toggle"
fun csToggleValue(pressed: Boolean?, inner: Boolean) = pressed ?: inner
fun csToggleShowsIcon(icon: String?) = !icon.isNullOrEmpty()
fun csToggleHasContent(text: String?, hasNode: Boolean = false) = hasNode || !text.isNullOrBlank()
fun csToggleName(ariaLabel: String?, hasContent: Boolean, fallback: String) = when {
  ariaLabel != null -> ariaLabel
  hasContent -> null
  else -> fallback
}
fun csToggleFlip(on: Boolean, disabled: Boolean, defaultPrevented: Boolean) = if (disabled || defaultPrevented) null else !on
fun csToggleCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Nút bật tắt")
  val en = mapOf("label" to csToggleLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
const val csPopconfirmOk = "Confirm"
const val csPopconfirmCancel = "Cancel"
fun csPopconfirmOkText(label: String?, fallback: String) = label ?: fallback
fun csPopconfirmTriggerText(trigger: String?, title: String) = trigger ?: title
fun csPopconfirmPlacement(explicit: String?) = explicit ?: "bottom-start"
const val csPopconfirmGap = 8.0
data class CsPopconfirmPlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csPopconfirmShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String): CsPopconfirmPlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement, csPopconfirmGap) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, csPopconfirmGap) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsPopconfirmPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}
fun csPopconfirmCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("ok" to "Xác nhận", "cancel" to "Hủy")
  val en = mapOf("ok" to csPopconfirmOk, "cancel" to csPopconfirmCancel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csPopconfirmSteps() = listOf("close", "confirm")
@Composable
fun CsToggle(label: String = "", pressed: Boolean, onChange: (Boolean) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, icon: String? = null, disabled: Boolean = false, ariaLabel: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val handle = rememberFocusHandle("toggle")
  val enabled = csControlEnabled(!disabled)
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val hasIcon = csToggleShowsIcon(icon)
  val content = csToggleHasContent(label, hasIcon)
  val name = csToggleName(ariaLabel, content, csToggleCopy("label", spoken))
  val padY = csControlsWaveStyleTogglePaddingY()
  val padX = csControlsWaveStyleTogglePaddingX()
  val minH = csControlsWaveStyleToggleMinHeight()
  val disabledAlpha = csControlsWaveStyleToggleDisabledOpacity
  TextButton(onClick = {
    if (!enabled) return@TextButton
    val next = csToggleFlip(pressed, disabled, false) ?: return@TextButton
    handle.claim()
    onChange(next)
  }, enabled = enabled, modifier = modifier.alpha(if (enabled) 1f else disabledAlpha).heightIn(min = minH).padding(horizontal = padX, vertical = padY).focusRequester(handle.requester).onFocusChanged { if (it.isFocused && enabled) handle.claim() }.minimumInteractiveComponentSize().semantics { contentDescription = name ?: label; stateDescription = pressed.toString() }) {
    if (hasIcon && icon != null) Text(icon, color = if (pressed) pack.colorBrandOchre.toComposeColor() else pack.colorTextPrimary.toComposeColor(), modifier = Modifier.clearAndSetSemantics { })
    if (label.isNotBlank()) Text(label, color = if (pressed) pack.colorBrandOchre.toComposeColor() else pack.colorTextPrimary.toComposeColor(), modifier = Modifier.clearAndSetSemantics { })
  }
}
