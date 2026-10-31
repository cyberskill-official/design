package world.cyberskill.design

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.onPointerEvent
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInRoot
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.max
import kotlin.math.min

sealed class CsPageToken {
  data class Page(val number: Int) : CsPageToken()
  data object Ellipsis : CsPageToken()
}

fun csPaginationTokens(page: Int, count: Int): List<CsPageToken> {
  if (count <= 7) return (1..max(0, count)).map { CsPageToken.Page(it) }
  val out = mutableListOf<CsPageToken>(CsPageToken.Page(1))
  val lo = max(2, page - 1)
  val hi = min(count - 1, page + 1)
  if (lo > 2) out += CsPageToken.Ellipsis
  if (lo <= hi) for (number in lo..hi) out += CsPageToken.Page(number)
  if (hi < count - 1) out += CsPageToken.Ellipsis
  out += CsPageToken.Page(count)
  return out
}
const val csPaginationPrevious = "Previous page"
const val csPaginationNext = "Next page"
const val csPaginationLabel = "Pagination"
fun csPaginationCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Phân trang", "prev" to "Trang trước", "next" to "Trang sau")
  val en = mapOf("label" to csPaginationLabel, "prev" to csPaginationPrevious, "next" to csPaginationNext)
  val ja = mapOf("label" to "ページネーション", "prev" to "前のページ", "next" to "次のページ")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = when (locale) {
      "vi" -> vi
      "en" -> en
      "ja" -> ja
      else -> emptyMap()
    }
    table[key]?.let { return it }
  }
  return key
}
fun csPaginationDestination(page: Int, target: Int, count: Int, hasHandler: Boolean) = if (hasHandler && target >= 1 && target <= count && target != page) target else null
fun csPaginationCurrent(number: Int, page: Int) = number == page

fun csClampNumber(value: Double, lower: Double?, upper: Double?): Double {
  var number = value
  if (lower != null) number = max(lower, number)
  if (upper != null) number = min(upper, number)
  return number
}

fun csRenderCount(value: Double, fallback: Int, minimum: Int = 0): Int {
  if (!value.isFinite() || value >= 4294967296.0) return fallback
  return max(minimum, value.toInt())
}

fun csRatingCommit(current: Int, tapped: Int): Int = if (tapped == current) 0 else tapped
const val csRatingLabel = "Rating"
fun csRatingValue(controlled: Int?, inner: Int) = controlled ?: inner
fun csRatingGroupName(label: String?, value: Int, max: Int, explicit: String?, hasLabelledBy: Boolean, word: String = csRatingLabel) = when {
  explicit != null -> explicit
  hasLabelledBy -> null
  label == null -> "$word: $value / $max"
  label.isEmpty() -> ": $value / $max"
  else -> "$label: $value / $max"
}
fun csRatingCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Đánh giá")
  val en = mapOf("label" to csRatingLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csRatingStar(index: Int, max: Int) = "$index / $max"
fun csRatingFocus(value: Int, max: Int) = if (value > 0) minOf(max, value) - 1 else 0
fun csRatingStop(index: Int, focus: Int, readOnly: Boolean) = if (readOnly) -1 else if (index == focus) 0 else -1

enum class CsStepState { Done, Active, Todo }

fun csStepState(index: Int, current: Int): CsStepState = when {
  index < current -> CsStepState.Done
  index == current -> CsStepState.Active
  else -> CsStepState.Todo
}

fun csStepMarker(state: CsStepState, index: Int, number: Int?) = if (state == CsStepState.Done) "✓" else (number?.toString() ?: (index + 1).toString())
fun csStepCurrent(state: CsStepState) = state == CsStepState.Active
const val csStepLabel = "Steps"
fun csStepListName(explicit: String?, fallback: String) = fallback
fun csStepCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Các bước")
  val en = mapOf("label" to csStepLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csStepListName(explicit: String?, fallback: String) = fallback
fun csStepCurrentValue(state: CsStepState) = if (state == CsStepState.Active) "step" else null
fun csStepShowsBody(body: String?) = body != null

fun csAccordionInitial(defaultOpen: Int?) = if (defaultOpen != null && defaultOpen >= 0) listOf(defaultOpen) else emptyList()
fun csAccordionPanel(open: List<Int>, index: Int, allowMultiple: Boolean) = if (allowMultiple) open.contains(index) else open.firstOrNull() == index
fun csAccordionCollapse(open: List<Int>, allowMultiple: Boolean) = if (allowMultiple || open.size <= 1) open else open.take(1)
fun csAccordionToggle(open: List<Int>, index: Int, allowMultiple: Boolean): List<Int> {
  if (allowMultiple) return if (open.contains(index)) open.filter { it != index } else open + index
  return if (open.firstOrNull() == index) emptyList() else listOf(index)
}

const val csTextareaRows = 4
const val csTextareaMinHeight = 96
fun csTextareaShows(value: String?) = value != null && value.isNotEmpty()
fun csTextareaDescribedBy(parts: List<String?>): String? {
  val seen = linkedSetOf<String>()
  for (part in parts) {
    if (part.isNullOrEmpty()) continue
    for (token in part.trim().split(Regex("\\s+")).filter { it.isNotEmpty() }) seen += token
  }
  return seen.joinToString(" ").ifEmpty { null }
}

@Composable
fun CsTextarea(
  label: String,
  value: String,
  onValueChange: (String) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  rows: Int = 4,
) {
  val pack = csModePack(dark, highContrast, compact)
  val handle = rememberFocusHandle("textarea")
  BasicTextField(
    value = value,
    onValueChange = { next -> if (!csControlEnabled()) return@BasicTextField; handle.claim(); onValueChange(next) },
    enabled = csControlEnabled(),
    modifier = modifier
      .fillMaxWidth()
      .heightIn(min = csTextareaMinHeight.dp)
      .background(pack.colorSurfacePanel.toComposeColor())
      .padding(8.dp)
      .focusRequester(handle.requester)
      .onFocusChanged { if (it.isFocused) handle.claim() }
      .semantics { if (csTextareaShows(label)) contentDescription = label },
    textStyle = androidx.compose.ui.text.TextStyle(color = pack.colorTextPrimary.toComposeColor()),
  )
}

const val csSearchPlaceholder = "Search…"
const val csSearchClear = "Clear search"
const val csSearchIconRadius = 7.0
const val csSearchIconLine = "M21 21l-4.3-4.3"
fun csSearchText(value: String?, inner: String) = value ?: inner
fun csSearchInitial(defaultValue: String?) = defaultValue ?: ""
fun csSearchPlaceholder(placeholder: String?, fallback: String) = placeholder ?: fallback
fun csSearchClearText(label: String?, fallback: String) = label ?: fallback
fun csSearchCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("placeholder" to "Tìm kiếm…", "clear" to "Xóa tìm kiếm")
  val en = mapOf("placeholder" to "Search…", "clear" to "Clear search")
  val ja = mapOf("placeholder" to "検索…", "clear" to "検索をクリア")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "ja") ja else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csSearchShowsClear(value: String) = value.isNotEmpty()
fun csSearchCanEdit(disabled: Boolean, readOnly: Boolean) = !disabled && !readOnly
fun csSearchCommit(current: String, next: String, disabled: Boolean, readOnly: Boolean) = if (csSearchCanEdit(disabled, readOnly)) next else null
fun csSearchSpoken(ariaLabel: String?, hasLabelledBy: Boolean, placeholder: String) = if (!ariaLabel.isNullOrEmpty()) ariaLabel else if (hasLabelledBy) null else placeholder

@Composable
fun CsSearchField(
  value: String,
  onValueChange: (String) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  label: String? = null,
  placeholder: String? = null,
  clearLabel: String? = null,
  ariaLabel: String? = null,
  hasLabelledBy: Boolean = false,
  disabled: Boolean = false,
  readOnly: Boolean = false,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val hint = csSearchPlaceholder(placeholder, csSearchCopy("placeholder", locale))
  val name = csSearchSpoken(ariaLabel ?: label, hasLabelledBy, hint) ?: ""
  val clearName = csSearchClearText(clearLabel, csSearchCopy("clear", locale))
  val handle = rememberFocusHandle("search")
  Row(modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
    BasicTextField(
      value = value,
      onValueChange = { next -> if (!csControlEnabled(!disabled && !readOnly)) return@BasicTextField; handle.claim(); csSearchCommit(value, next, disabled, readOnly)?.let(onValueChange) },
      enabled = csControlEnabled(!disabled && !readOnly),
      modifier = Modifier.weight(1f).focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }.semantics { contentDescription = name },
      textStyle = androidx.compose.ui.text.TextStyle(color = pack.colorTextPrimary.toComposeColor()),
      readOnly = !csSearchCanEdit(disabled, readOnly),
    )
    if (csSearchShowsClear(value)) {
      CsTriggerButton(title = clearName, onClick = {
        if (csSearchCommit(value, "", disabled, readOnly) != null) onValueChange("")
      }, enabled = csSearchCanEdit(disabled, readOnly), modifier = Modifier.minimumInteractiveComponentSize().semantics { contentDescription = clearName }) {
        Text(clearName, modifier = Modifier.clearAndSetSemantics {})
      }
    }
  }
}

const val csNumberDecrease = "Decrease"
const val csNumberIncrease = "Increase"
const val csNumberValue = "Value"
fun csNumberShowsLabel(label: String?) = label != null && label.isNotEmpty()
fun csNumberCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("decrease" to "Giảm", "increase" to "Tăng", "value" to "Giá trị")
  val en = mapOf("decrease" to csNumberDecrease, "increase" to csNumberIncrease, "value" to csNumberValue)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csNumberCanDecrease(disabled: Boolean, value: String, min: Double?) = if (disabled) false else if (value == "" || min == null) true else (value.toDoubleOrNull()?.let { it > min } ?: true)
fun csNumberCanIncrease(disabled: Boolean, value: String, max: Double?) = if (disabled) false else if (value == "" || max == null) true else (value.toDoubleOrNull()?.let { it < max } ?: true)
fun csNumberCommit(raw: String) = if (raw == "") null else raw.toDoubleOrNull()?.takeIf { it.isFinite() }
fun csNumberBlurEmpty(uncontrolled: Boolean, empty: Boolean, min: Double?, max: Double?) = if (uncontrolled && empty) csClampNumber(0.0, min, max) else null

@Composable
fun CsNumberField(
  value: Double,
  onValueChange: (Double) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  label: String? = null,
  minimum: Double? = null,
  maximum: Double? = null,
  step: Double = 1.0,
  disabled: Boolean = false,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val shown = value.toString()
  val down = csNumberCanDecrease(disabled, shown, minimum)
  val up = csNumberCanIncrease(disabled, shown, maximum)
  val downName = csNumberCopy("decrease", locale)
  val upName = csNumberCopy("increase", locale)
  val valueName = if (csNumberShowsLabel(label)) label ?: "" else csNumberCopy("value", locale)
  Row(modifier.semantics { contentDescription = valueName }, verticalAlignment = Alignment.CenterVertically) {
    CsTriggerButton(title = "−", onClick = { if (down) onValueChange(csClampNumber(value - step, minimum, maximum)) }, enabled = down, modifier = Modifier.minimumInteractiveComponentSize().semantics { contentDescription = downName }) { Text("−", modifier = Modifier.clearAndSetSemantics {}) }
    if (csNumberShowsLabel(label)) Text(label ?: "", color = pack.colorTextPrimary.toComposeColor())
    Text(shown, color = pack.colorTextPrimary.toComposeColor())
    CsTriggerButton(title = "+", onClick = { if (up) onValueChange(csClampNumber(value + step, minimum, maximum)) }, enabled = up, modifier = Modifier.minimumInteractiveComponentSize().semantics { contentDescription = upName }) { Text("+", modifier = Modifier.clearAndSetSemantics {}) }
  }
}

@Composable
fun CsKbd(keys: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  val pack = csModePack(dark, highContrast, compact)
  Text(
    keys,
    color = pack.colorTextPrimary.toComposeColor(),
    fontFamily = FontFamily.Monospace,
    modifier = modifier.border(1.dp, pack.colorBorderDefault.toComposeColor(), RoundedCornerShape(4.dp)).padding(horizontal = 6.dp, vertical = 2.dp),
  )
}

fun csEmptyTitle(title: String?, fallback: String) = title ?: fallback
fun csEmptyCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("title" to "Chưa có gì ở đây", "action" to "Tạo mục đầu tiên")
  val en = mapOf("title" to "Nothing here yet", "action" to "Create your first item")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csEmptyShows(value: String?) = value != null && value.isNotEmpty()
fun csEmptyUsesDefaultIcon(icon: String?) = icon == null
const val csEmptyTray = "M3 8l2-4h14l2 4M3 8v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8h6l1 3h4l1-3h6"
@Composable
fun CsEmptyState(dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, title: String? = null, message: String? = null, action: String? = null, icon: String? = null, fallbackTitle: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  Column(modifier.fillMaxWidth().padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
    if (csEmptyUsesDefaultIcon(icon)) Canvas(Modifier.size(26.dp)) { drawPath(csIconPathData(csEmptyTray, size.minDimension), pack.colorTextMuted.toComposeColor(), style = Stroke(width = 1.8f)) }
    else if (icon != null) CsIcon(name = icon, label = "", dark = dark, highContrast = highContrast, compact = compact)
    Text(csEmptyTitle(title, fallbackTitle ?: csEmptyCopy("title", csComboboxResolvedLanguage(language, LocalCsLanguage.current))), color = pack.colorTextPrimary.toComposeColor(), fontSize = 16.sp)
    if (csEmptyShows(message)) Text(message ?: "", color = pack.colorTextMuted.toComposeColor())
    if (csEmptyShows(action)) Text(action ?: "", color = pack.colorBrandOchre.toComposeColor())
  }
}

const val csBreadcrumbLabel = "Breadcrumb"
fun csBreadcrumbHref(href: String?) = if (href.isNullOrEmpty()) "#" else href
fun csBreadcrumbCurrent(index: Int, count: Int) = count > 0 && index == count - 1
fun csBreadcrumbSeparator(index: Int, count: Int) = count > 1 && index < count - 1
fun csBreadcrumbNavLabel(explicit: String?, hasExplicit: Boolean, fallback: String) = if (hasExplicit) explicit ?: "" else fallback
fun csBreadcrumbCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Đường dẫn")
  val en = mapOf("label" to csBreadcrumbLabel)
  val ja = mapOf("label" to "パンくずリスト")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = when (locale) {
      "vi" -> vi
      "en" -> en
      "ja" -> ja
      else -> emptyMap()
    }
    table[key]?.let { return it }
  }
  return key
}

data class CsBreadcrumbItem(val label: String, val href: String = "")

@Composable
fun CsBreadcrumb(items: List<CsBreadcrumbItem>, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val navName = csBreadcrumbNavLabel(label, label != null, csBreadcrumbCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  Row(modifier.semantics { contentDescription = navName }) {
    items.forEachIndexed { index, item ->
      val last = index == items.lastIndex
      Text(item.label, color = if (last) pack.colorTextPrimary.toComposeColor() else pack.colorBrandOchre.toComposeColor())
      if (!last) Text("/", color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.padding(horizontal = 4.dp).clearAndSetSemantics { })
    }
  }
}

@Composable
fun CsPagination(
  page: Int,
  pageCount: Int,
  onChange: (Int) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  label: String? = null,
  previousLabel: String? = null,
  nextLabel: String? = null,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val navName = label ?: csPaginationCopy("label", spoken)
  val previousName = previousLabel ?: csPaginationCopy("prev", spoken)
  val nextName = nextLabel ?: csPaginationCopy("next", spoken)
  Row(modifier.semantics { contentDescription = navName }, verticalAlignment = Alignment.CenterVertically) {
    CsTriggerButton(title = previousName, onClick = { if (page > 1) onChange(page - 1) }, enabled = page > 1, modifier = Modifier.minimumInteractiveComponentSize()) { Text(previousName) }
    csPaginationTokens(page, pageCount).forEach { token ->
      when (token) {
        is CsPageToken.Ellipsis -> Text("…", color = pack.colorTextMuted.toComposeColor())
        is CsPageToken.Page -> CsTriggerButton(title = token.number.toString(), onClick = { if (token.number != page) onChange(token.number) }, modifier = Modifier.minimumInteractiveComponentSize()) {
          Text(token.number.toString(), color = if (token.number == page) pack.colorBrandOchre.toComposeColor() else pack.colorTextPrimary.toComposeColor())
        }
      }
    }
    CsTriggerButton(title = nextName, onClick = { if (page < pageCount) onChange(page + 1) }, enabled = page < pageCount, modifier = Modifier.minimumInteractiveComponentSize()) { Text(nextName) }
  }
}

data class CsStepItem(val title: String, val number: Int? = null, val body: String? = null)

@Composable
fun CsSteps(label: String, steps: List<CsStepItem>, current: Int, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val listName = csStepListName(label, csStepCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  Row(modifier.semantics { contentDescription = listName }, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
    steps.forEachIndexed { index, step ->
      val state = csStepState(index, current)
      Column {
        Text(csStepMarker(state, index, step.number), color = if (state == CsStepState.Todo) pack.colorTextMuted.toComposeColor() else pack.colorBrandOchre.toComposeColor())
        Text(step.title, color = pack.colorTextPrimary.toComposeColor())
        if (step.body != null) Text(step.body, color = pack.colorTextMuted.toComposeColor())
      }
    }
  }
}

fun csStatusKind(name: String) = when (name) {
  "online" -> "online"
  "busy" -> "busy"
  "error" -> "error"
  else -> "offline"
}
fun csStatusPulses(pulse: Boolean, reducedMotion: Boolean) = pulse && !reducedMotion
const val csDescriptionColumnMin = 160.0
fun csDescriptionSpoken(term: String) = term
const val csKbdPadX = 7.0
fun csKbdKeyFace(text: String) = text
const val csButtonGroupOverlap = -1.0
fun csButtonGroupLabel(label: String?) = label
enum class CsStatusKind { Online, Busy, Offline, Error }

@Composable
fun CsStatusIndicator(title: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, status: CsStatusKind = CsStatusKind.Offline) {
  val pack = csModePack(dark, highContrast, compact)
  val color = when (status) {
    CsStatusKind.Online -> pack.colorSemanticSuccess
    CsStatusKind.Busy -> pack.colorBrandOchre
    CsStatusKind.Offline -> pack.colorTextMuted
    CsStatusKind.Error -> pack.colorSemanticDanger
  }
  Row(modifier, verticalAlignment = Alignment.CenterVertically) {
    androidx.compose.foundation.layout.Box(Modifier.size(8.dp).clip(CircleShape).background(color.toComposeColor()))
    Text(title, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.padding(start = 8.dp))
  }
}

@Composable
fun CsRating(
  value: Int,
  onChange: (Int) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  label: String? = null,
  requestedMax: Double = 5.0,
  readOnly: Boolean = false,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val max = csRenderCount(requestedMax, 5)
  val groupName = csRatingGroupName(label, value, max, null, false, csRatingCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current))) ?: ""
  Row(modifier.semantics { contentDescription = groupName }) {
    for (star in 1..max) {
      CsTriggerButton(title = if (star <= value) "★" else "☆", onClick = { if (!readOnly) onChange(csRatingCommit(value, star)) }, enabled = !readOnly, modifier = Modifier.minimumInteractiveComponentSize()) {
        Text(if (star <= value) "★" else "☆", color = pack.colorBrandOchre.toComposeColor())
      }
    }
  }
}

@Composable
fun CsSegmentedControl(
  label: String,
  options: List<CsTabItem>,
  selection: String,
  onSelect: (String) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
) {
  val pack = csModePack(dark, highContrast, compact)
  Row(modifier.clip(RoundedCornerShape(pack.radiusMd.toDp())).border(1.dp, pack.colorBorderDefault.toComposeColor(), RoundedCornerShape(pack.radiusMd.toDp())).semantics { contentDescription = label }) {
    options.forEach { option ->
      val selected = selection == option.value
      val handle = rememberFocusHandle("segment-${option.value}")
      Text(
        option.label,
        color = if (selected) pack.colorSurfacePage.toComposeColor() else pack.colorTextPrimary.toComposeColor(),
        modifier = Modifier
          .weight(1f)
          .minimumInteractiveComponentSize()
          .focusRequester(handle.requester)
          .background(if (selected) pack.colorBrandUmber.toComposeColor() else androidx.compose.ui.graphics.Color.Transparent)
          .onFocusChanged { if (it.isFocused) handle.claim() }
          .clickable(enabled = csControlEnabled(), role = Role.RadioButton) { handle.claim(); onSelect(option.value) },
      )
    }
  }
}

data class CsDescriptionItem(val term: String, val value: String)

@Composable
fun CsDescriptionList(items: List<CsDescriptionItem>, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  val pack = csModePack(dark, highContrast, compact)
  Column(modifier, verticalArrangement = Arrangement.spacedBy(8.dp)) {
    items.forEach { item ->
      Row(Modifier.fillMaxWidth()) {
        Text(item.term, color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.weight(1f))
        Text(item.value, color = pack.colorTextPrimary.toComposeColor())
      }
    }
  }
}

@Composable
fun CsButtonGroup(label: String, modifier: Modifier = Modifier, content: @Composable () -> Unit) {
  Row(modifier.semantics { contentDescription = label }, horizontalArrangement = Arrangement.spacedBy(8.dp)) { content() }
}

const val csAvatarOverlap = 10
const val csAvatarRing = 2

@Composable
fun CsAvatarGroup(names: List<String>, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  val pack = csModePack(dark, highContrast, compact)
  Row(modifier, horizontalArrangement = Arrangement.spacedBy((-csAvatarOverlap).dp)) {
    names.forEach { name ->
      CsAvatar(name = name, dark = dark, highContrast = highContrast, compact = compact, size = "sm", modifier = Modifier.border(csAvatarRing.dp, pack.colorSurfacePanel.toComposeColor(), CircleShape))
    }
  }
}

enum class CsResultStatus { Info, Success, Warning, Error }
fun csResultCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("success" to "Hoàn tất", "error" to "Chúng tôi chưa hoàn tất được", "warning" to "Vui lòng kiểm tra", "info" to "Đây là điều đã xảy ra")
  val en = mapOf("success" to "Done", "error" to "We couldn't complete that", "warning" to "Please check", "info" to "Here's what happened")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csResultTitle(title: String?, status: String, language: String? = null) = title ?: csResultCopy(status, language)
fun csResultFallback(status: String) = csResultCopy(status, "en")
fun csResultIcon(status: String) = if (status == "success" || status == "error" || status == "warning" || status == "info") status else "info"
fun csResultShows(value: String?) = value != null && value.isNotEmpty()
fun csResultMark(status: String) = when (csResultIcon(status)) {
  "success" -> "M4 12.5l5 5 11-11"
  "error" -> "M6 6l12 12M18 6L6 18"
  "warning" -> "M12 3l10 18H2zM12 10v5M12 18.2v.1"
  else -> "M12 11v6M12 7.2v.1"
}

@Composable
fun CsResult(message: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, title: String? = null, status: CsResultStatus = CsResultStatus.Info, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val name = when (status) {
    CsResultStatus.Info -> "info"
    CsResultStatus.Success -> "success"
    CsResultStatus.Warning -> "warning"
    CsResultStatus.Error -> "error"
  }
  val tone = when (name) {
    "success" -> pack.colorSemanticSuccessText
    "error" -> pack.colorSemanticDangerText
    "warning" -> pack.colorSemanticWarningText
    else -> pack.colorSemanticInfoText
  }
  val heading = csResultTitle(title, name, csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  Column(modifier.semantics { liveRegion = LiveRegionMode.Polite }, horizontalAlignment = Alignment.CenterHorizontally) {
    Canvas(Modifier.size(64.dp)) {
      drawCircle(color = tone.toComposeColor().copy(alpha = if (name == "error") 0.12f else 0.14f))
      drawPath(csIconPathData(csResultMark(name), 28.dp.toPx()), tone.toComposeColor(), style = Stroke(width = 2.2f))
    }
    Text(heading, color = pack.colorTextPrimary.toComposeColor(), fontSize = 22.sp)
    if (csResultShows(message)) Text(message, color = pack.colorTextMuted.toComposeColor())
  }
}

const val csLinkNewContext = "noopener noreferrer"
fun csLinkHref(href: String?) = href ?: "#"
fun csLinkOpensNew(external: Boolean) = external
fun csLinkSuffix(external: Boolean, variant: String) = if (external) " ↗" else if (variant == "standalone") " →" else ""
fun csLinkTone(variant: String) = if (variant == "muted") "muted" else "link"
fun csLinkWeight(variant: String) = if (variant == "standalone") "bold" else "regular"
fun csLinkMinTarget(coarse: Boolean) = if (coarse) 44 else 0

@Composable
fun CsLink(title: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, href: String? = null, variant: String = "default", external: Boolean = false, coarse: Boolean = false) {
  val pack = csModePack(dark, highContrast, compact)
  val destination = csLinkHref(href)
  val extra = csLinkSuffix(external, variant)
  val ink = if (csLinkTone(variant) == "muted") pack.colorTextMuted else pack.colorLink
  val weight = if (csLinkWeight(variant) == "bold") FontWeight.Bold else FontWeight.Normal
  Row(modifier.heightIn(min = csLinkMinTarget(coarse).dp).csOwnFocus().semantics { contentDescription = if (destination.isEmpty()) title else title }) {
    Text(title, color = ink.toComposeColor(), fontWeight = weight)
    if (extra.isNotEmpty()) Text(extra, color = ink.toComposeColor(), modifier = Modifier.clearAndSetSemantics { })
  }
}

data class CsTooltipState(val hovered: Boolean = false, val focused: Boolean = false, val dismissed: Boolean = false) {
  val open get() = (hovered || focused) && !dismissed
}
const val csTooltipGap = 8
fun csTooltipLabel(label: String?, fallback: String) = label ?: fallback
const val csTooltipDefault = "Tooltip"
fun csTooltipCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Chú thích")
  val en = mapOf("label" to csTooltipDefault)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csTooltipEnter(state: CsTooltipState) = state.copy(hovered = true, dismissed = false)
fun csTooltipLeave(state: CsTooltipState) = state.copy(hovered = false)
fun csTooltipFocus(state: CsTooltipState) = state.copy(focused = true, dismissed = false)
fun csTooltipBlur(state: CsTooltipState, inside: Boolean) = if (inside) state else state.copy(focused = false)
fun csTooltipEscape(state: CsTooltipState) = state.copy(dismissed = true)

@Composable
fun CsTooltip(
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  label: String? = null,
  fallbackLabel: String? = null,
  language: String? = null,
  content: @Composable () -> Unit,
) {
  val pack = csModePack(dark, highContrast, compact)
  var state by remember { mutableStateOf(CsTooltipState()) }
  var origin by remember { mutableStateOf(0.0 to 0.0) }
  var trigger by remember { mutableStateOf<Pair<Double, Double>?>(null) }
  var natural by remember(state.open) { mutableStateOf<Pair<Double, Double>?>(null) }
  var fitted by remember(state.open) { mutableStateOf<Pair<Double, Double>?>(null) }
  var layout by remember(state.open) { mutableStateOf<Pair<Double, Double>?>(null) }
  var panelScale by remember(state.open) { mutableStateOf(1.0 to 1.0) }
  var applied by remember(state.open) { mutableStateOf(0.0 to 0.0) }
  val config = androidx.compose.ui.platform.LocalConfiguration.current
  val density = androidx.compose.ui.platform.LocalDensity.current
  val viewWidth = with(density) { config.screenWidthDp.dp.toPx() }.toDouble()
  val viewHeight = with(density) { config.screenHeightDp.dp.toPx() }.toDouble()
  val initial = trigger?.let { size -> natural?.let { panelSize -> csFloatingPlace(
    CsFloatingRect(origin.first, origin.second, origin.first + size.first, origin.second + size.second, size.first, size.second),
    panelSize.first,
    panelSize.second,
    CsFloatingRect(8.0, 8.0, maxOf(8.0, viewWidth - 8.0), maxOf(8.0, viewHeight - 8.0), viewWidth, viewHeight),
    "top",
    csTooltipGap.toDouble(),
    "ltr",
  ) } }
  val shrinks = initial != null && natural != null && (natural!!.first - initial.maxWidth > 0.5 || natural!!.second - initial.maxHeight > 0.5)
  val finalSize = fitted ?: if (initial != null && !shrinks) natural else null
  val placed = trigger?.let { size -> finalSize?.let { panelSize -> csFloatingPlace(
    CsFloatingRect(origin.first, origin.second, origin.first + size.first, origin.second + size.second, size.first, size.second),
    panelSize.first,
    panelSize.second,
    CsFloatingRect(8.0, 8.0, maxOf(8.0, viewWidth - 8.0), maxOf(8.0, viewHeight - 8.0), viewWidth, viewHeight),
    initial?.placement ?: "top",
    csTooltipGap.toDouble(),
    "ltr",
  ) } }
  val maxWidth = minOf(240.0, initial?.maxWidth ?: placed?.maxWidth ?: 240.0)
  val desired = placed?.let { point -> layout?.let { origin -> ((point.left - origin.first) / panelScale.first) to ((point.top - origin.second) / panelScale.second) } }
  SideEffect {
    if (desired != null && (kotlin.math.abs(desired.first - applied.first) > 0.5 || kotlin.math.abs(desired.second - applied.second) > 0.5)) applied = desired
  }
  val spoken = csTooltipLabel(label, fallbackLabel ?: csTooltipCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  Column(modifier.onPointerEvent(PointerEventType.Enter) { state = csTooltipEnter(state) }.onPointerEvent(PointerEventType.Exit) { state = csTooltipLeave(state) }.onFocusChanged { focus -> state = if (focus.isFocused) csTooltipFocus(state) else csTooltipBlur(state, false) }.onPreviewKeyEvent { event ->
    if (event.type == KeyEventType.KeyDown && event.key == Key.Escape) {
      state = csTooltipEscape(state)
      true
    } else false
  }) {
    if (state.open) Text(spoken, color = Color.White, modifier = Modifier.offset(with(density) { applied.first.toFloat().toDp() }, with(density) { applied.second.toFloat().toDp() }).padding(bottom = csTooltipGap.dp).background(pack.colorBrandUmber.toComposeColor()).padding(horizontal = 10.dp, vertical = 6.dp).widthIn(max = with(density) { maxWidth.toFloat().toDp() }).heightIn(max = with(density) { (initial?.maxHeight ?: viewHeight).toFloat().toDp() }).alpha(if (placed != null) 1f else 0f).onGloballyPositioned {
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
    }.clearAndSetSemantics { })
    Column(Modifier.onGloballyPositioned {
      val width = it.size.width.toDouble()
      val height = it.size.height.toDouble()
      if (width > 0.0 && height > 0.0) {
        val root = it.positionInRoot()
        origin = root.x.toDouble() to root.y.toDouble()
        trigger = width to height
      }
    }) { content() }
  }
}

enum class CsToastVariant { Standard, Success, Danger }
const val csToastStackGap = 10
const val csToastDismiss = "Close"
const val csToastStackLabel = "Notifications"
fun csToastCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("notifications" to "Thông báo", "dismiss" to "Đóng")
  val en = mapOf("notifications" to csToastStackLabel, "dismiss" to csToastDismiss)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csToastIcon(name: String?) = if (name == "success" || name == "danger" || name == "default") name ?: "default" else "default"
fun csToastBorder(name: String?) = when (name) {
  "success" -> "success"
  "danger" -> "danger"
  "default", null -> "info"
  else -> "none"
}
fun csToastMark(name: String?) = when (csToastIcon(name)) {
  "success" -> "M4 12.5l5 5 11-11"
  "danger" -> "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6"
  else -> "M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"
}
fun csToastShows(value: String?) = value != null && value.isNotEmpty()
fun csToastShowsClose(hasOpenChange: Boolean, hasClose: Boolean) = hasOpenChange || hasClose
fun csToastNotify(hasOpenChange: Boolean, hasClose: Boolean): List<String> {
  val events = mutableListOf<String>()
  if (hasOpenChange) events += "open-false"
  if (hasClose) events += "close"
  return events
}

@Composable
fun CsToast(
  title: String,
  message: String,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  variant: String = "default",
  dismissLabel: String? = null,
  language: String? = null,
  onOpenChange: ((Boolean) -> Unit)? = null,
  onClose: (() -> Unit)? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val edge = csToastBorder(variant)
  val closeName = dismissLabel ?: csToastCopy("dismiss", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  val ink = when (edge) {
    "success" -> pack.colorSemanticSuccessText
    "danger" -> pack.colorSemanticDangerText
    "info" -> pack.colorSemanticInfoText
    else -> pack.colorTextAccent
  }
  Row(modifier.fillMaxWidth().background(pack.colorSurfacePanel.toComposeColor()).padding(12.dp), verticalAlignment = Alignment.Top) {
    Canvas(Modifier.size(18.dp)) { drawPath(csIconPathData(csToastMark(variant), size.minDimension), ink.toComposeColor(), style = Stroke(width = 2f)) }
    Column(Modifier.weight(1f)) {
      if (csToastShows(title)) Text(title, color = pack.colorTextPrimary.toComposeColor())
      if (csToastShows(message)) Text(message, color = pack.colorTextMuted.toComposeColor())
    }
    if (csToastShowsClose(onOpenChange != null, onClose != null)) {
      CsTriggerButton(title = closeName, onClick = {
        onOpenChange?.invoke(false)
        onClose?.invoke()
      }, modifier = Modifier.minimumInteractiveComponentSize().semantics { contentDescription = closeName }) {
        Text("×", modifier = Modifier.clearAndSetSemantics {})
      }
    }
  }
}

data class CsAccordionItem(val title: String, val content: String)

@Composable
fun CsAccordion(
  items: List<CsAccordionItem>,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  defaultOpen: Int? = 0,
  allowMultiple: Boolean = false,
) {
  val pack = csModePack(dark, highContrast, compact)
  var open by remember { mutableStateOf(csAccordionInitial(defaultOpen)) }
  LaunchedEffect(allowMultiple) { open = csAccordionCollapse(open, allowMultiple) }
  Column(modifier) {
    items.forEachIndexed { index, item ->
      val opened = csAccordionPanel(open, index, allowMultiple)
      CsTriggerButton(
        title = item.title,
        onClick = { open = csAccordionToggle(open, index, allowMultiple) },
        modifier = Modifier.fillMaxWidth().minimumInteractiveComponentSize().semantics { stateDescription = if (opened) "expanded" else "collapsed" },
      ) {
        Text(item.title, color = pack.colorTextPrimary.toComposeColor())
        CsIcon(name = "chevron-down", label = "", dark = dark, highContrast = highContrast, compact = compact, modifier = Modifier.graphicsLayer { rotationZ = if (opened) 180f else 0f }.clearAndSetSemantics { })
      }
      if (opened) Text(item.content, color = pack.colorTextMuted.toComposeColor())
    }
  }
}
