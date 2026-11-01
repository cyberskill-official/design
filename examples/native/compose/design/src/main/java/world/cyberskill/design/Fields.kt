package world.cyberskill.design

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.ui.Alignment
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.widthIn
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.hoverable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.layout.boundsInWindow
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInRoot
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusProperties
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.isShiftPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.key.type
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.SemanticsPropertyKey
import androidx.compose.ui.semantics.SemanticsPropertyReceiver
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.TextFieldValue

data class CsCalendarDate(val year: Int, val month: Int, val day: Int)

fun csCalendarDayLanguage(language: String?): String {
  if (language == null) return "en"
  val trimmed = language.trim()
  if (trimmed.isEmpty()) return "en"
  val lower = trimmed.lowercase().replace('_', '-')
  if (lower == "tiếng việt" || lower == "tieng viet") return "vi"
  if (lower == "english") return "en"
  if (lower == "日本語" || lower == "japanese") return "ja"
  val primary = lower.substringBefore('-')
  return if (primary == "vi" || primary == "ja") primary else "en"
}
fun csCalendarDayName(year: Int, month: Int, day: Int, language: String?): String {
  val code = csCalendarDayLanguage(language)
  val index = csCalendarWeekday(year, month, day)
  val enDays = arrayOf("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
  val viDays = arrayOf("Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy")
  val jaDays = arrayOf("日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日")
  val safeMonth = minOf(11, maxOf(0, month))
  if (code == "vi") return "${viDays[index]}, $day tháng ${safeMonth + 1}, $year"
  if (code == "ja") return "${year}年${safeMonth + 1}月${day}日${jaDays[index]}"
  val enMonths = arrayOf("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
  return "${enDays[index]}, ${enMonths[safeMonth]} $day, $year"
}
fun csCalendarCurrent(year: Int, month: Int, day: Int, nowYear: Int, nowMonth: Int, nowDay: Int): Boolean {
  return year == nowYear && month == nowMonth && day == nowDay
}
fun csCalendarTabStop(day: Int, focused: Int, monthDays: Int): Int {
  val active = minOf(maxOf(focused, 1), maxOf(monthDays, 1))
  return if (day == active) 0 else -1
}
fun csCalendarFocus(year: Int, month: Int, day: Int, key: String, shift: Boolean = false): Triple<Int, Int, Int> {
  if (key == "home") return Triple(year, month, 1)
  if (key == "end") return Triple(year, month, csCalendarDays(year, month))
  if (key == "pageUp" || key == "pageDown") {
    val offset = (if (key == "pageUp") -1 else 1) * (if (shift) 12 else 1)
    val moved = csCalendarAddMonths(CsCalendarDate(year, month, 1), offset)
    return Triple(moved.year, moved.month, minOf(day, csCalendarDays(moved.year, moved.month)))
  }
  val delta = when (key) { "left" -> -1; "right" -> 1; "up" -> -7; else -> 7 }
  val moved = csCalendarAddDays(CsCalendarDate(year, month, day), delta)
  return Triple(moved.year, moved.month, moved.day)
}
fun csCalendarShift(year: Int, month: Int, delta: Int): Pair<Int, Int> {
  var nextYear = year
  var nextMonth = month + delta
  while (nextMonth > 11) { nextMonth -= 12; nextYear += 1 }
  while (nextMonth < 0) { nextMonth += 12; nextYear -= 1 }
  return nextYear to nextMonth
}
fun csCalendarDays(year: Int, month: Int): Int = when (month + 1) {
  2 -> if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) 29 else 28
  4, 6, 9, 11 -> 30
  else -> 31
}

fun csCalendarWeekday(year: Int, month: Int, day: Int): Int {
  var y = year
  val monthNumber = month + 1
  val table = intArrayOf(0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4)
  if (monthNumber < 3) y -= 1
  return (y + y / 4 - y / 100 + y / 400 + table[monthNumber - 1] + day) % 7
}

fun csCalendarGrid(year: Int, month: Int): List<Int?> {
  val lead = (csCalendarWeekday(year, month, 1) + 6) % 7
  val cells = MutableList<Int?>(lead) { null }
  for (day in 1..csCalendarDays(year, month)) cells += day
  while (cells.size % 7 != 0) cells += null
  return cells
}

fun csCalendarAddDays(date: CsCalendarDate, delta: Int): CsCalendarDate {
  var year = date.year
  var month = date.month
  var day = date.day + delta
  while (true) {
    val count = csCalendarDays(year, month)
    if (day > count) {
      day -= count
      month += 1
      if (month > 11) { month = 0; year += 1 }
    } else if (day < 1) {
      month -= 1
      if (month < 0) { month = 11; year -= 1 }
      day += csCalendarDays(year, month)
    } else return CsCalendarDate(year, month, day)
  }
}
fun csCalendarAddMonths(date: CsCalendarDate, delta: Int): CsCalendarDate {
  var year = date.year
  var month = date.month + delta
  while (month > 11) { month -= 12; year += 1 }
  while (month < 0) { month += 12; year -= 1 }
  return CsCalendarDate(year, month, minOf(date.day, csCalendarDays(year, month)))
}

const val csComboboxEmpty = "No results"
fun csComboboxListName(label: String?, labelledBy: String?, fallback: String) = when {
  !label.isNullOrEmpty() -> label
  !labelledBy.isNullOrEmpty() -> null
  else -> fallback
}
fun csComboboxEmptyText(count: Int, fallback: String) = if (count == 0) fallback else null
fun csComboboxDisplay(open: Boolean, query: String, selected: String?) = if (open) query else selected ?: query
fun csComboboxAllowsOpen(requested: Boolean, disabled: Boolean) = requested && !disabled
fun csComboboxMessage(value: String?) = !value.isNullOrEmpty()
fun csComboboxUsesWindow(inForm: Boolean, inFieldset: Boolean = false) = !(inForm || inFieldset)
fun csComboboxComposing(collapsed: Boolean?) = collapsed == false
const val csComboboxCaret = "▾"
fun csComboboxPrimaryLanguage(tag: String?): String? {
  if (tag == null) return null
  val raw = tag.trim()
  if (raw.isEmpty()) return null
  val lower = raw.lowercase(java.util.Locale.ROOT).replace('_', '-')
  if (lower == "tiếng việt" || lower == "tieng viet") return "vi"
  if (lower == "english") return "en"
  if (lower == "日本語" || lower == "japanese") return "ja"
  val primary = lower.substringBefore('-')
  return primary.ifEmpty { null }
}
fun csComboboxCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("placeholder" to "Chọn hoặc nhập…", "label" to "Chọn mục", "empty" to "Không có kết quả")
  val en = mapOf("placeholder" to "Select or type…", "label" to "Choose an option", "empty" to "No results")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csComboboxPlaceholder(text: String?, fallback: String) = text ?: fallback
fun csComboboxResolvedLanguage(explicit: String?, ancestor: String?) = csComboboxPrimaryLanguage(explicit) ?: csComboboxPrimaryLanguage(ancestor)
data class CsComboboxOption(val value: String, val label: String)
fun csComboboxShownOptions(options: List<CsComboboxOption>, query: String): List<CsComboboxOption> {
  val needle = query.trim().lowercase()
  if (needle.isEmpty()) return options
  return options.filter { it.label.lowercase().contains(needle) }
}
fun csComboboxLabel(value: String?, options: List<CsComboboxOption>) = options.firstOrNull { it.value == value }?.label
fun csComboboxDisplayValue(open: Boolean, query: String, value: String?, options: List<CsComboboxOption>) = if (open) query else csComboboxLabel(value, options) ?: query
fun csComboboxShown(labels: List<String>, query: String): List<String> {
  val needle = query.trim().lowercase()
  if (needle.isEmpty()) return labels
  return labels.filter { it.lowercase().contains(needle) }
}

fun csCalendarMonthLanguage(language: String?): String {
  if (language == null) return "vi"
  val trimmed = language.trim()
  if (trimmed.isEmpty()) return "vi"
  val lower = trimmed.lowercase().replace('_', '-')
  if (lower == "tiếng việt" || lower == "tieng viet") return "vi"
  if (lower == "english") return "en"
  if (lower == "日本語" || lower == "japanese") return "ja"
  val primary = lower.substringBefore('-')
  return if (primary.isEmpty()) "vi" else primary
}
fun csCalendarHeading(month: Int, year: Int, language: String?): String {
  val code = csCalendarMonthLanguage(language)
  val safe = minOf(11, maxOf(0, month))
  val title = when (code) {
    "en" -> arrayOf("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")[safe]
    "ja" -> "${safe + 1}月"
    else -> "Tháng ${safe + 1}"
  }
  return "$title $year"
}
fun csComboboxHighlight(current: Int, count: Int, down: Boolean): Int {
  if (count <= 0) return 0
  return if (down) minOf(count - 1, current + 1) else maxOf(0, current - 1)
}

fun csCalendarCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("prev" to "Tháng trước", "next" to "Tháng sau")
  val en = mapOf("prev" to "Previous month", "next" to "Next month")
  val ja = mapOf("prev" to "前の月", "next" to "次の月")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "ja") ja else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
@Composable
fun CsCalendar(monthLabel: String, year: Int, month: Int, selected: Int?, onSelect: (Int) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, language: String? = null, modifier: Modifier = Modifier, onChoose: (CsCalendarDate) -> Unit = {}) {
  val pack = csModePack(dark, highContrast, compact)
  val now = java.time.LocalDate.now()
  var viewYear by remember(year) { mutableIntStateOf(year) }
  var viewMonth by remember(month) { mutableIntStateOf(month) }
  var focusedDay by remember(selected) { mutableIntStateOf(selected ?: 1) }
  Column(modifier.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
    val key = when (event.key) {
      Key.DirectionLeft -> "left"
      Key.DirectionRight -> "right"
      Key.DirectionUp -> "up"
      Key.DirectionDown -> "down"
      Key.MoveHome -> "home"
      Key.MoveEnd -> "end"
      Key.PageUp -> "pageUp"
      Key.PageDown -> "pageDown"
      else -> null
    } ?: return@onPreviewKeyEvent false
    val active = minOf(focusedDay, csCalendarDays(viewYear, viewMonth))
    val next = csCalendarFocus(viewYear, viewMonth, active, key, event.isShiftPressed)
    viewYear = next.first
    viewMonth = next.second
    focusedDay = next.third
    true
  }) {
    Row {
      CsTriggerButton(title = "‹", onClick = {
        val next = csCalendarShift(viewYear, viewMonth, -1)
        viewYear = next.first
        viewMonth = next.second
      }, modifier = Modifier.minimumInteractiveComponentSize().semantics { contentDescription = csCalendarCopy("prev", csComboboxResolvedLanguage(language, LocalCsLanguage.current)) }) { Text("‹", modifier = Modifier.clearAndSetSemantics {}) }
      Text(csCalendarHeading(viewMonth, viewYear, csComboboxResolvedLanguage(language, LocalCsLanguage.current)), color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.semantics { contentDescription = monthLabel })
      CsTriggerButton(title = "›", onClick = {
        val next = csCalendarShift(viewYear, viewMonth, 1)
        viewYear = next.first
        viewMonth = next.second
      }, modifier = Modifier.minimumInteractiveComponentSize().semantics { contentDescription = csCalendarCopy("next", csComboboxResolvedLanguage(language, LocalCsLanguage.current)) }) { Text("›", modifier = Modifier.clearAndSetSemantics {}) }
    }
    csCalendarGrid(viewYear, viewMonth).forEach { day ->
      if (day != null) {
        val chosen = selected == day
        val current = csCalendarCurrent(viewYear, viewMonth, day, now.year, now.monthValue - 1, now.dayOfMonth)
        val active = day == minOf(focusedDay, csCalendarDays(viewYear, viewMonth))
        CsTriggerButton(title = day.toString(), onClick = { focusedDay = day; onSelect(day); onChoose(CsCalendarDate(viewYear, viewMonth, day)) }, modifier = Modifier.minimumInteractiveComponentSize().focusProperties { canFocus = csCalendarTabStop(day, focusedDay, csCalendarDays(viewYear, viewMonth)) == 0 }.semantics {
          contentDescription = csCalendarDayName(viewYear, viewMonth, day, language)
          stateDescription = if (current) "date" else ""
          this.selected = chosen
        }) {
          Text(day.toString(), color = if (chosen) pack.colorBrandOchre.toComposeColor() else pack.colorTextPrimary.toComposeColor(), fontWeight = if (active) FontWeight.Bold else FontWeight.Normal)
        }
      }
    }
  }
}

private val csControlsKey = SemanticsPropertyKey<String>("Controls")
private val csAutocompleteKey = SemanticsPropertyKey<String>("Autocomplete")
private val csListIdKey = SemanticsPropertyKey<String>("ListId")
private val csRoleKey = SemanticsPropertyKey<String>("Role")
private val csRequiredKey = SemanticsPropertyKey<Boolean>("Required")
private var SemanticsPropertyReceiver.csControls by csControlsKey
private var SemanticsPropertyReceiver.csAutocomplete by csAutocompleteKey
private var SemanticsPropertyReceiver.csListId by csListIdKey
private var SemanticsPropertyReceiver.csRole by csRoleKey
private var SemanticsPropertyReceiver.csRequired by csRequiredKey

@Composable
fun CsCombobox(label: String, options: List<CsComboboxOption>, query: String, highlight: Int, onQuery: (String) -> Unit, onSelect: (String) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, onHighlight: (Int) -> Unit = {}, value: String? = null, disabled: Boolean = false, description: String? = null, fieldError: String? = null, required: Boolean = false, language: String? = null, placeholder: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val handle = rememberFocusHandle("combobox")
  val shown = csComboboxShownOptions(options, query)
  val listId = remember { java.util.UUID.randomUUID().toString() }
  var listOpen by remember { mutableStateOf(false) }
  var blurToken by remember { mutableIntStateOf(0) }
  val blocked = disabled || LocalCsDisabled.current
  var fieldValue by remember { mutableStateOf(TextFieldValue("")) }
  var composing by remember { mutableStateOf(false) }
  val open = csComboboxAllowsOpen(listOpen, blocked)
  LaunchedEffect(blocked) { if (blocked) listOpen = false }
  val host = LocalView.current
  var bounds by remember { mutableStateOf(androidx.compose.ui.geometry.Rect.Zero) }
  var fieldRect by remember { mutableStateOf(androidx.compose.ui.geometry.Rect.Zero) }
  var panelBounds by remember { mutableStateOf(androidx.compose.ui.geometry.Rect.Zero) }
  var panelHeight by remember { mutableStateOf(0.0) }
  DisposableEffect(open, bounds) {
    if (!open) return@DisposableEffect onDispose {}
    val root = host.rootView as android.view.ViewGroup
    val overlay = android.view.View(host.context)
    overlay.layoutParams = android.view.ViewGroup.LayoutParams(android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.ViewGroup.LayoutParams.MATCH_PARENT)
    overlay.isClickable = false
    overlay.isFocusable = false
    overlay.setOnTouchListener { _, event ->
      if (event.action == android.view.MotionEvent.ACTION_DOWN) {
        val loc = IntArray(2)
        root.getLocationOnScreen(loc)
        val x = event.rawX - loc[0]
        val y = event.rawY - loc[1]
        val point = androidx.compose.ui.geometry.Offset(x, y)
        if (!bounds.contains(point) && !panelBounds.contains(point)) listOpen = false
      }
      false
    }
    root.addView(overlay)
    onDispose { root.removeView(overlay) }
  }
  Column(modifier.onGloballyPositioned { bounds = it.boundsInWindow() }.onPreviewKeyEvent { event ->
    if (blocked || composing || event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
    when (event.key) {
      Key.DirectionDown -> {
        listOpen = true
        onHighlight(csComboboxHighlight(highlight, shown.size, true))
      }
      Key.DirectionUp -> onHighlight(csComboboxHighlight(highlight, shown.size, false))
      Key.Enter, Key.NumPadEnter -> {
        if (!listOpen) return@onPreviewKeyEvent false
        handle.claim()
        if (highlight in shown.indices) onSelect(shown[highlight].value)
        listOpen = false
        onQuery("")
      }
      Key.Escape -> listOpen = false
      else -> return@onPreviewKeyEvent false
    }
    true
  }) {
    if (open && fieldRect.width > 0f) {
      val density = androidx.compose.ui.platform.LocalDensity.current
      val config = androidx.compose.ui.platform.LocalConfiguration.current
      val viewWidth = with(density) { config.screenWidthDp.dp.toPx() }.toDouble()
      val viewHeight = with(density) { config.screenHeightDp.dp.toPx() }.toDouble()
      val matched = minOf(fieldRect.width.toDouble(), maxOf(0.0, viewWidth - 16.0))
      val anchor = CsFloatingRect(fieldRect.left.toDouble(), fieldRect.top.toDouble(), fieldRect.right.toDouble(), fieldRect.bottom.toDouble(), fieldRect.width.toDouble(), fieldRect.height.toDouble())
      val viewport = CsFloatingRect(8.0, 8.0, maxOf(8.0, viewWidth - 8.0), maxOf(8.0, viewHeight - 8.0), viewWidth, viewHeight)
      val placed = if (panelHeight > 0.0) csFloatingPlace(anchor, matched, panelHeight, viewport, "bottom-start", 6.0, "ltr") else null
      val shiftX = placed?.left?.minus(fieldRect.left.toDouble()) ?: 0.0
      val shiftY = placed?.top?.minus(fieldRect.top.toDouble()) ?: (fieldRect.height.toDouble() + 6.0)
      val inForm = LocalCsForm.current
      val listBody: @Composable () -> Unit = {
        Column(Modifier.width(with(density) { matched.toFloat().toDp() }).then(placed?.let { Modifier.heightIn(max = with(density) { it.maxHeight.toFloat().toDp() }) } ?: Modifier).alpha(if (placed == null) 0f else 1f).onGloballyPositioned {
          panelBounds = it.boundsInWindow()
          val height = it.size.height.toDouble()
          if (height > 0.0 && kotlin.math.abs(height - panelHeight) > 0.5) panelHeight = height
        }.semantics {
          role = Role.DropdownList
          contentDescription = csComboboxListName(label, null, csComboboxCopy("label", spoken)) ?: ""
          csListId = listId
        }) { shown.forEachIndexed { index, option ->
          Text(option.label, color = if (index == highlight) pack.colorBrandOchre.toComposeColor() else pack.colorTextPrimary.toComposeColor(), modifier = Modifier.semantics { selected = option.value == value }.fillMaxWidth().minimumInteractiveComponentSize().pointerInput(index) {
            var pressed = false
            awaitPointerEventScope {
              while (true) {
                val event = awaitPointerEvent()
                if (event.type == PointerEventType.Enter) onHighlight(index)
                if (event.type == PointerEventType.Press && !pressed) {
                  pressed = true
                  listOpen = false
                  onSelect(option.value)
                  onQuery("")
                }
              }
            }
          })
        }
        csComboboxEmptyText(shown.size, csComboboxCopy("empty", spoken))?.let { empty ->
          Text(empty, color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite })
        }
      }
      }
      if (csComboboxUsesWindow(inForm)) {
        Popup(alignment = Alignment.TopStart, offset = IntOffset(shiftX.toInt(), shiftY.toInt()), properties = PopupProperties(focusable = false, dismissOnBackPress = false, dismissOnClickOutside = false, clippingEnabled = false)) { listBody() }
      } else {
        Box(Modifier.height(0.dp).wrapContentHeight(Alignment.Top, unbounded = true)) {
          Box(Modifier.offset(with(density) { shiftX.toFloat().toDp() }, with(density) { shiftY.toFloat().toDp() })) { listBody() }
        }
      }
    }
    val shownText = csComboboxDisplayValue(open, query, value, options)
    SideEffect {
      if (!composing && fieldValue.text != shownText) fieldValue = TextFieldValue(shownText, selection = TextRange(shownText.length))
    }
    Box {
    androidx.compose.foundation.text.BasicTextField(value = fieldValue, onValueChange = { next ->
      fieldValue = next
      composing = csComboboxComposing(next.composition?.collapsed)
      if (blocked) return@BasicTextField
      handle.claim(); listOpen = true; onQuery(next.text); onHighlight(0)
    }, enabled = !blocked, modifier = Modifier.onGloballyPositioned { fieldRect = it.boundsInWindow() }.focusRequester(handle.requester).onFocusChanged {
      if (it.isFocused && !blocked) {
        blurToken += 1
        handle.claim()
        listOpen = true
        onHighlight(0)
      } else {
        val token = blurToken
        android.os.Handler(android.os.Looper.getMainLooper()).post { if (token == blurToken) listOpen = false }
      }
    }.semantics {
      contentDescription = label
      role = Role.DropdownList
      csRole = "combobox"
      csAutocomplete = "list"
      if (required) csRequired = true
      if (csComboboxMessage(fieldError)) error(fieldError ?: "")
      if (open) csControls = listId
      stateDescription = when {
        open && highlight in shown.indices -> "expanded, ${shown[highlight].label}"
        open -> "expanded"
        else -> "collapsed"
      }
    }, decorationBox = { inner ->
      Box {
        if (fieldValue.text.isEmpty()) Text(csComboboxPlaceholder(placeholder, csComboboxCopy("placeholder", spoken)), color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.align(Alignment.CenterStart).clearAndSetSemantics { })
        inner()
      }
    })
    Text(csComboboxCaret, color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.align(Alignment.CenterEnd).padding(end = 10.dp).clearAndSetSemantics { })
    }
    if (csComboboxMessage(description)) Text(description ?: "", color = pack.colorTextMuted.toComposeColor())
    if (csComboboxMessage(fieldError)) Text(fieldError ?: "", color = pack.colorSemanticDangerText.toComposeColor())
  }
}

@Composable
const val csAlertConfirm = "Confirm"
const val csAlertCancel = "Cancel"
fun csAlertOpen(open: Boolean?, internalOpen: Boolean) = open ?: internalOpen
fun csAlertDestructive(tone: String?, variant: String?) = (tone ?: variant) == "destructive"
fun csAlertLabel(label: String?, fallback: String) = label ?: fallback
fun csAlertCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("confirm" to "Xác nhận", "cancel" to "Hủy")
  val en = mapOf("confirm" to csAlertConfirm, "cancel" to csAlertCancel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csAlertHasDescription(description: String?, children: String?) = (description ?: children)?.isNotEmpty() == true
fun csAlertInitialFocus(destructive: Boolean) = if (destructive) "cancel" else "confirm"
fun csModalOwned(active: String, opener: String?, insidePanel: Boolean) = active == "body" || (opener != null && active == opener) || insidePanel
fun csModalShouldRestore(wasTop: Boolean, ownedFocus: Boolean, openerConnected: Boolean, openerHidden: Boolean) = wasTop && ownedFocus && openerConnected && !openerHidden
fun csModalPullBack(inside: Boolean) = !inside
data class CsOverlayLayer(val id: String, val kind: String, val connected: Boolean)
fun csOverlayTop(layers: List<CsOverlayLayer>) = layers.asReversed().firstOrNull { it.kind != "toast" }?.id
fun csOverlayActive(layers: List<CsOverlayLayer>) = layers.asReversed().firstOrNull { it.kind == "modal" && it.connected }?.id
fun csOverlayWasTop(id: String, layers: List<CsOverlayLayer>) = csOverlayTop(layers) == id
fun csOverlayOwns(id: String, layers: List<CsOverlayLayer>) = csOverlayActive(layers) == id
private var csOverlaySeq = 0
fun csOverlayFreshId(kind: String): String {
  csOverlaySeq += 1
  return "$kind-$csOverlaySeq"
}
object CsOverlayRegistry {
  private val layers = mutableListOf<CsOverlayLayer>()
  fun push(id: String) {
    layers.removeAll { it.id == id }
    layers.add(CsOverlayLayer(id, "modal", true))
  }
  fun remove(id: String) { layers.removeAll { it.id == id } }
  fun resolved(id: String, fallback: List<CsOverlayLayer>): List<CsOverlayLayer> = if (layers.any { it.id == id }) layers.toList() else fallback
}
fun csFocusNext(current: Int, count: Int, shift: Boolean, inside: Boolean): Int? {
  if (count <= 0) return null
  if (!inside || current < 0 || current >= count) return if (shift) count - 1 else 0
  val delta = if (shift) -1 else 1
  return (current + delta + count) % count
}
fun csAlertDismiss() = listOf("open-false", "cancel")
fun csAlertConfirmOrder() = listOf("open-false", "confirm")

fun CsAlertDialog(title: String, message: String, onConfirm: () -> Unit, onCancel: () -> Unit, onOpenChange: (Boolean) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, destructive: Boolean = false, confirmLabel: String? = null, cancelLabel: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val confirmName = csAlertLabel(confirmLabel, csAlertCopy("confirm", spoken))
  val cancelName = csAlertLabel(cancelLabel, csAlertCopy("cancel", spoken))
  val layerId = remember { csOverlayFreshId("alert") }
  val restoreId = remember { CsFocusRegistry.activeId }
  DisposableEffect(layerId) {
    CsOverlayRegistry.push(layerId)
    onDispose {
      val stack = CsOverlayRegistry.resolved(layerId, listOf(CsOverlayLayer(layerId, "modal", true)))
      csReturnFocus(restoreId, null, layerId, stack)
      CsFocusRegistry.disconnect("alert-cancel-$layerId")
      CsFocusRegistry.disconnect("alert-confirm-$layerId")
      CsOverlayRegistry.remove(layerId)
    }
  }
  val cancelFocus = remember { FocusRequester() }
  val confirmFocus = remember { FocusRequester() }
  var trap by remember(destructive) { mutableIntStateOf(if (csAlertInitialFocus(destructive) == "cancel") 0 else 1) }
  LaunchedEffect(trap) {
    if (trap == 0) cancelFocus.requestFocus() else confirmFocus.requestFocus()
  }
  Column(modifier.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown || event.key != Key.Tab) return@onPreviewKeyEvent false
    val stack = CsOverlayRegistry.resolved(layerId, listOf(CsOverlayLayer(layerId, "modal", true)))
    if (!csOverlayOwns(layerId, stack)) return@onPreviewKeyEvent false
    val next = csFocusNext(trap, 2, event.isShiftPressed, true) ?: return@onPreviewKeyEvent false
    trap = next
    true
  }) {
    Text(title, color = pack.colorTextPrimary.toComposeColor())
    Text(message, color = pack.colorTextMuted.toComposeColor())
    TextButton(onClick = {
      CsFocusRegistry.claim("alert-cancel-$layerId") { cancelFocus.requestFocus() }
      onOpenChange(false); onCancel()
    }, enabled = csControlEnabled(), modifier = Modifier.minimumInteractiveComponentSize().focusRequester(cancelFocus).onFocusChanged { if (it.isFocused) CsFocusRegistry.claim("alert-cancel-$layerId") { cancelFocus.requestFocus() } }) { Text(cancelName) }
    TextButton(onClick = {
      CsFocusRegistry.claim("alert-confirm-$layerId") { confirmFocus.requestFocus() }
      onOpenChange(false); onConfirm()
    }, enabled = csControlEnabled(), modifier = Modifier.minimumInteractiveComponentSize().focusRequester(confirmFocus).onFocusChanged { if (it.isFocused) CsFocusRegistry.claim("alert-confirm-$layerId") { confirmFocus.requestFocus() } }) {
      Text(confirmName, color = if (destructive) pack.colorSemanticDanger.toComposeColor() else pack.colorBrandOchre.toComposeColor())
    }
  }
}

@Composable
const val csPopoverPanel = "Details"
const val csPopoverGap = 8
fun csPopoverOpen(controlled: Boolean?, internalOpen: Boolean) = controlled ?: internalOpen
fun csPopoverPlacement(placement: String?, align: String) = placement ?: if (align == "end") "bottom-end" else "bottom-start"
fun csPopoverLabel(ariaLabel: String?, hasLabelledBy: Boolean, fallback: String) = if (ariaLabel != null) ariaLabel else if (hasLabelledBy) null else fallback
fun csPopoverCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("panel" to "Chi tiết")
  val en = mapOf("panel" to csPopoverPanel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csPopoverToggle(open: Boolean, defaultPrevented: Boolean) = if (defaultPrevented) null else !open
fun csPopoverDismissOutside(open: Boolean, inside: Boolean) = open && !inside

fun CsPopover(label: String, open: Boolean, onOpenChange: (Boolean) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, ariaLabel: String? = null, hasLabelledBy: Boolean = false, language: String? = null, align: String = "start", content: @Composable () -> Unit) {
  var origin by remember { mutableStateOf(0.0 to 0.0) }
  var trigger by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var natural by remember(open) { mutableStateOf<Pair<Double, Double>?>(null) }
  var fitted by remember(open) { mutableStateOf<Pair<Double, Double>?>(null) }
  var layout by remember(open) { mutableStateOf<Pair<Double, Double>?>(null) }
  var panelScale by remember(open) { mutableStateOf(1.0 to 1.0) }
  var applied by remember(open) { mutableStateOf(0.0 to 0.0) }
  val config = androidx.compose.ui.platform.LocalConfiguration.current
  val density = androidx.compose.ui.platform.LocalDensity.current
  val viewWidth = with(density) { config.screenWidthDp.dp.toPx() }.toDouble()
  val viewHeight = with(density) { config.screenHeightDp.dp.toPx() }.toDouble()
  val place = csPopoverPlacement(null, align)
  val panelName = csPopoverLabel(ariaLabel, hasLabelledBy, csPopoverCopy("panel", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  val initial = trigger?.let { size -> natural?.let { panelSize -> csFloatingPlace(
    CsFloatingRect(origin.first, origin.second, origin.first + size.first, origin.second + size.second, size.first, size.second),
    panelSize.first,
    panelSize.second,
    CsFloatingRect(8.0, 8.0, maxOf(8.0, viewWidth - 8.0), maxOf(8.0, viewHeight - 8.0), viewWidth, viewHeight),
    place,
    csPopoverGap.toDouble(),
    "ltr",
  ) } }
  val shrinks = initial != null && natural != null && (natural!!.first - initial.maxWidth > 0.5 || natural!!.second - initial.maxHeight > 0.5)
  val finalSize = fitted ?: if (initial != null && !shrinks) natural else null
  val placed = trigger?.let { size -> finalSize?.let { panelSize -> csFloatingPlace(
    CsFloatingRect(origin.first, origin.second, origin.first + size.first, origin.second + size.second, size.first, size.second),
    panelSize.first,
    panelSize.second,
    CsFloatingRect(8.0, 8.0, maxOf(8.0, viewWidth - 8.0), maxOf(8.0, viewHeight - 8.0), viewWidth, viewHeight),
    initial?.placement ?: place,
    csPopoverGap.toDouble(),
    "ltr",
  ) } }
  val desired = placed?.let { point -> layout?.let { origin -> ((point.left - origin.first) / panelScale.first) to ((point.top - origin.second) / panelScale.second) } }
  SideEffect {
    if (desired != null && (kotlin.math.abs(desired.first - applied.first) > 0.5 || kotlin.math.abs(desired.second - applied.second) > 0.5)) applied = desired
  }
  Column(modifier) {
    CsTriggerButton(title = label, onClick = { onOpenChange(!open) }, modifier = Modifier.minimumInteractiveComponentSize().onGloballyPositioned {
      val width = it.size.width.toDouble()
      val height = it.size.height.toDouble()
      if (width > 0.0 && height > 0.0) {
        val root = it.positionInRoot()
        origin = root.x.toDouble() to root.y.toDouble()
        trigger = width to height
      }
    }) { Text(label) }
    if (open) Column(Modifier.offset(with(density) { applied.first.toFloat().toDp() }, with(density) { applied.second.toFloat().toDp() }).alpha(if (placed != null) 1f else 0f).then(if (placed != null) Modifier else Modifier.clearAndSetSemantics { }).then(panelName?.let { name -> Modifier.semantics { contentDescription = name } } ?: Modifier).then(initial?.let { Modifier.widthIn(max = with(density) { it.maxWidth.toFloat().toDp() }).heightIn(max = with(density) { it.maxHeight.toFloat().toDp() }) } ?: Modifier).onGloballyPositioned {
      val width = it.size.width.toDouble()
      val height = it.size.height.toDouble()
      val bounds = it.boundsInRoot()
      val rawScaleX = if (it.size.width > 0) bounds.width / it.size.width.toFloat() else 1f
      val rawScaleY = if (it.size.height > 0) bounds.height / it.size.height.toFloat() else 1f
      val scaleX = if (rawScaleX == 0f) 1.0 else rawScaleX.toDouble()
      val scaleY = if (rawScaleY == 0f) 1.0 else rawScaleY.toDouble()
      panelScale = scaleX to scaleY
      val shiftX = with(density) { applied.first.toFloat().toDp().toPx() }.toDouble() * scaleX
      val shiftY = with(density) { applied.second.toFloat().toDp().toPx() }.toDouble() * scaleY
      layout = (it.positionInRoot().x.toDouble() - shiftX) to (it.positionInRoot().y.toDouble() - shiftY)
      if (width > 0.0 && height > 0.0) {
        if (natural == null) natural = width to height
        else fitted = width to height
      }
    }) { content() }
  }
}

fun csListGap() = 2.dp
fun csListItemPaddingY() = 10.dp
fun csListIsInteractive(hasOnClick: Boolean) = hasOnClick
fun csListItemBorderWidth() = 0.dp
fun csListItemShowsHoverFill(interactive: Boolean, hovered: Boolean) = interactive && hovered
fun csListMainGap() = 1.dp
fun csListShowsSlot(value: String?) = value != null

@Composable
fun CsList(items: List<Pair<String, String>>, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, leads: List<String?> = emptyList(), trails: List<String?> = emptyList(), onSelect: ((Int) -> Unit)? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val interactive = csListIsInteractive(onSelect != null)
  Column(modifier, verticalArrangement = Arrangement.spacedBy(csListGap())) {
    items.forEachIndexed { index, item ->
      val interaction = remember { MutableInteractionSource() }
      val hovered by interaction.collectIsHoveredAsState()
      val showHover = csListItemShowsHoverFill(interactive, hovered)
      val lead = leads.getOrNull(index)
      val trail = trails.getOrNull(index)
      Row(Modifier.fillMaxWidth().hoverable(interaction).clip(RoundedCornerShape(pack.radiusMd.toDp())).background(if (showHover) pack.colorSurfaceRaised.toComposeColor() else Color.Transparent, RoundedCornerShape(pack.radiusMd.toDp())).let { if (interactive) it.clickable { onSelect?.invoke(index) } else it }.padding(horizontal = pack.space3.toDp(), vertical = csListItemPaddingY()), horizontalArrangement = Arrangement.spacedBy(pack.space3.toDp()), verticalAlignment = Alignment.CenterVertically) {
        if (csListShowsSlot(lead)) Text(lead ?: "", color = pack.colorTextAccent.toComposeColor())
        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(csListMainGap())) {
          Text(item.first, color = pack.colorTextPrimary.toComposeColor(), fontSize = pack.fontSizeSm.toDp().value.sp, fontWeight = FontWeight.SemiBold)
          if (item.second.isNotEmpty()) Text(item.second, color = pack.colorTextMuted.toComposeColor(), fontSize = pack.fontSizeXs.toDp().value.sp)
        }
        if (csListShowsSlot(trail)) Text(trail ?: "", color = pack.colorTextMuted.toComposeColor(), fontSize = pack.fontSizeSm.toDp().value.sp)
      }
    }
  }
}

@Composable
fun CsComment(author: String, meta: String, body: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, actions: List<String> = emptyList(), replies: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val reply = csCommentCopy("reply", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  Column(modifier) {
    Text(author, color = pack.colorTextPrimary.toComposeColor())
    if (csCommentShows(meta)) Text(meta, color = pack.colorTextMuted.toComposeColor())
    Text(body, color = pack.colorTextPrimary.toComposeColor())
    Row { csCommentReplyActions(actions, reply).forEach { label -> CsTriggerButton(title = label, onClick = {}, modifier = Modifier.minimumInteractiveComponentSize()) { Text(label) } } }
    if (csCommentShows(replies)) Text(replies ?: "", color = pack.colorTextMuted.toComposeColor())
  }
}

const val csCodeLabel = "code"
const val csCodeCopy = "Copy"
const val csCodeCopied = "Copied ✓"
const val csCodeCopiedMs = 1400
fun csCodeText(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("code" to "mã", "copy" to "Sao chép", "copied" to "Đã sao chép ✓")
  val en = mapOf("code" to csCodeLabel, "copy" to csCodeCopy, "copied" to csCodeCopied)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
const val csCommentReply = "Reply"
fun csCommentShows(value: String?) = !value.isNullOrEmpty()
fun csCommentReplyActions(labels: List<String>?, fallback: String) = if (labels.isNullOrEmpty()) listOf(fallback) else labels
fun csCommentCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("reply" to "Trả lời")
  val en = mapOf("reply" to csCommentReply)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
const val csCodeBgHex = "#2b1e14"
const val csCodeFgHex = "#f5ead9"
const val csCodeBorderHex = "#4a3a2c"
const val csCodeMutedHex = "#c9b7a3"
val csCodeBgColor = CSColorValue(CSColorSpace.SRGB, listOf(0x2B / 255.0, 0x1E / 255.0, 0x14 / 255.0), 1.0)
val csCodeFgColor = CSColorValue(CSColorSpace.SRGB, listOf(0xF5 / 255.0, 0xEA / 255.0, 0xD9 / 255.0), 1.0)
val csCodeBorderColor = CSColorValue(CSColorSpace.SRGB, listOf(0x4A / 255.0, 0x3A / 255.0, 0x2C / 255.0), 1.0)
val csCodeMutedColor = CSColorValue(CSColorSpace.SRGB, listOf(0xC9 / 255.0, 0xB7 / 255.0, 0xA3 / 255.0), 1.0)
fun csCodeBorderWidth() = 1.dp
fun csCodeBarPaddingY() = 8.dp
fun csCodeBarPaddingX() = 14.dp
fun csCodeBarBorderWidth() = 1.dp
fun csCodeCopyFontWeight() = 600
fun csCodeCopyShowsHoverColor(hovered: Boolean) = hovered
fun csCodeCopyColor(hovered: Boolean, pack: CSTokenModePack) = if (csCodeCopyShowsHoverColor(hovered)) pack.colorBrandOchre else csCodeMutedColor
fun csCodePrePaddingY() = 14.dp
fun csCodePrePaddingX() = 16.dp
fun csCodePreLineHeight() = 1.6
fun csCodeBarLabel(filename: String?, language: String?, fallback: String) = if (!filename.isNullOrEmpty()) filename else language ?: fallback
fun csCodeButton(copied: Boolean, copy: String, copiedLabel: String) = if (copied) copiedLabel else copy
fun csCodeBegin(attempt: Int) = attempt + 1
fun csCodeSucceeded(current: Int, attempt: Int, wrote: Boolean) = wrote && current == attempt
@Composable
fun CsCodeBlock(code: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, filename: String? = null, language: String? = null, showBar: Boolean = true, lang: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val spoken = csComboboxResolvedLanguage(lang, LocalCsLanguage.current)
  val title = csCodeBarLabel(filename, language, csCodeText("code", spoken))
  var attempt by remember { mutableIntStateOf(0) }
  var copied by remember { mutableStateOf(false) }
  val copyInteraction = remember { MutableInteractionSource() }
  val copyHovered by copyInteraction.collectIsHoveredAsState()
  val copyLabel = csCodeButton(copied, csCodeText("copy", spoken), csCodeText("copied", spoken))
  Column(modifier.clip(RoundedCornerShape(pack.radiusLg.toDp())).background(csCodeBgColor.toComposeColor(), RoundedCornerShape(pack.radiusLg.toDp())).border(csCodeBorderWidth(), csCodeBorderColor.toComposeColor(), RoundedCornerShape(pack.radiusLg.toDp()))) {
    if (showBar) {
      Row(Modifier.fillMaxWidth().padding(horizontal = csCodeBarPaddingX(), vertical = csCodeBarPaddingY()), verticalAlignment = Alignment.CenterVertically) {
        Text(title, color = csCodeMutedColor.toComposeColor(), fontSize = pack.fontSizeXs.toDp().value.sp, fontFamily = FontFamily.Monospace, modifier = Modifier.weight(1f))
        CsTriggerButton(title = copyLabel, onClick = { attempt = csCodeBegin(attempt); copied = false }, modifier = Modifier.hoverable(copyInteraction)) {
          Text(copyLabel, color = csCodeCopyColor(copyHovered, pack).toComposeColor(), fontSize = pack.fontSizeXs.toDp().value.sp, fontWeight = FontWeight.SemiBold)
        }
      }
      Box(Modifier.fillMaxWidth().height(csCodeBarBorderWidth()).background(csCodeBorderColor.toComposeColor()))
    }
    Box(Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()).padding(horizontal = csCodePrePaddingX(), vertical = csCodePrePaddingY())) {
      Text(code, color = csCodeFgColor.toComposeColor(), fontSize = pack.fontSizeSm.toDp().value.sp, lineHeight = (pack.fontSizeSm.toDp().value * csCodePreLineHeight().toFloat()).sp, fontFamily = FontFamily.Monospace)
    }
  }
}

fun csSidebarWidth() = 248.dp
fun csSidebarBorderWidth() = 1.dp
fun csSidebarPaddingY() = 16.dp
fun csSidebarPaddingX() = 12.dp
fun csSidebarGap() = 3.dp
fun csSidebarLabelPaddingTop() = 12.dp
fun csSidebarLabelPaddingX() = 12.dp
fun csSidebarLabelPaddingBottom() = 4.dp
fun csSidebarLabelTracking() = 0.08f
fun csSidebarShowsLabel(label: String?) = !label.isNullOrEmpty()
fun csSidebarLabelText(label: String) = label.uppercase()

@Composable
fun CsSidebar(label: String, items: List<String>, active: String, onSelect: (String) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  val pack = csModePack(dark, highContrast, compact)
  val labelSize = pack.fontSizeXs.toDp().value
  Row(modifier.width(csSidebarWidth()).background(pack.colorSurfacePanel.toComposeColor()).semantics { if (csSidebarShowsLabel(label)) contentDescription = label }) {
    Column(Modifier.weight(1f).padding(horizontal = csSidebarPaddingX(), vertical = csSidebarPaddingY()), verticalArrangement = Arrangement.spacedBy(csSidebarGap())) {
      if (csSidebarShowsLabel(label)) {
        Text(
          csSidebarLabelText(label),
          color = pack.colorTextMuted.toComposeColor(),
          fontSize = labelSize.sp,
          letterSpacing = (labelSize * csSidebarLabelTracking()).sp,
          modifier = Modifier.padding(top = csSidebarLabelPaddingTop(), start = csSidebarLabelPaddingX(), end = csSidebarLabelPaddingX(), bottom = csSidebarLabelPaddingBottom()).semantics { contentDescription = label },
        )
      }
      items.forEach { item ->
        CsNavItem(title = item, active = item == active, onSelect = { onSelect(item) }, dark = dark, highContrast = highContrast, compact = compact)
      }
    }
    Box(Modifier.width(csSidebarBorderWidth()).background(pack.colorBorderDefault.toComposeColor()))
  }
}
