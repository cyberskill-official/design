package world.cyberskill.design

import androidx.compose.foundation.background
import androidx.compose.ui.zIndex
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.layout.boundsInWindow
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.SemanticsPropertyKey
import androidx.compose.ui.semantics.SemanticsPropertyReceiver
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

fun csToggleSelection(selected: List<String>, key: String): List<String> =
  if (selected.contains(key)) selected.filter { it != key } else selected + key

fun csToggleAllSelection(keys: List<String>, selected: List<String>): List<String> {
  val all = keys.isNotEmpty() && keys.all { selected.contains(it) }
  return if (all) emptyList() else keys
}

data class CsTagEdit(val tags: List<String>, val query: String)

fun csAddTag(tags: List<String>, query: String, max: Int?): CsTagEdit {
  val text = query.trim()
  if (text.isEmpty()) return CsTagEdit(tags, query)
  if (tags.contains(text)) return CsTagEdit(tags, "")
  if (max != null && tags.size >= max) return CsTagEdit(tags, query)
  return CsTagEdit(tags + text, "")
}

fun csBackspaceTag(tags: List<String>, query: String): List<String> =
  if (query.isEmpty() && tags.isNotEmpty()) tags.dropLast(1) else tags

data class CsConfidenceMeasurement(val tone: String, val filled: Int, val segments: Int)

const val csConfidenceLabel = "Confidence"
fun csConfidenceLabelText(label: String?, fallback: String) = label ?: fallback
fun csConfidenceCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Độ tin cậy", "low" to "Thấp", "medium" to "Trung bình", "high" to "Cao")
  val en = mapOf("label" to csConfidenceLabel, "low" to "Low", "medium" to "Medium", "high" to "High")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csConfidenceToneWord(tone: String, low: String, medium: String, high: String) = when (tone) {
  "low" -> low
  "high" -> high
  else -> medium
}
fun csConfidenceName(label: String, word: String) = if (label.isEmpty()) word else "$label $word"
fun csConfidenceMeasure(value: Double?, level: String?, segments: Double): CsConfidenceMeasurement {
  val source = if (segments.isFinite() && segments != 0.0) segments else Double.NaN
  val segs = csRenderCount(source, 5, 1)
  if (value != null) {
    val numeric = if (value.isFinite()) value else 0.0
    val clamped = min(1.0, max(0.0, numeric))
    val tone = if (clamped < 0.4) "low" else if (clamped < 0.75) "medium" else "high"
    val filled = min(segs, max(0, (clamped * segs).roundToInt()))
    return CsConfidenceMeasurement(tone, filled, segs)
  }
  val tone = if (level == "low" || level == "medium" || level == "high") level else "medium"
  val fill = if (tone == "low") 2 else if (tone == "high") 5 else 3
  val filled = min(segs, max(0, (fill / 5.0 * segs).roundToInt()))
  return CsConfidenceMeasurement(tone, filled, segs)
}

data class CsDataColumn(val key: String, val header: String, val sortable: Boolean = true)

@Composable
fun CsDataGrid(
  columns: List<CsDataColumn>,
  rows: List<Map<String, String>>,
  selectable: Boolean,
  selected: List<String>,
  selectAllLabel: String,
  clearLabel: String,
  onSelect: (List<String>) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  persistKey: String? = null,
  caption: String? = null,
  empty: String? = null,
  sortValues: Map<String, (Map<String, String>) -> String?> = emptyMap(),
  renders: Map<String, (Map<String, String>) -> String?> = emptyMap(),
  filterText: String? = null,
  filterKeys: List<String>? = null,
  virtual: Boolean = false,
  virtualThreshold: Int = 80,
  height: Double = 280.0,
  rowHeight: Double = 36.0,
  measuredRowHeight: Double? = null,
  modifier: Modifier = Modifier,
) {
  val pack = csModePack(dark, highContrast, compact)
  val context = androidx.compose.ui.platform.LocalContext.current
  val stored = csGridPrefsLoad(context, persistKey) ?: csGridDecodeOrder(csGridStorageKey(persistKey)?.let { CsGridColumnStore.values[it] })
  var order by remember(persistKey) { mutableStateOf(stored) }
  var pinned by remember { mutableStateOf<String?>(null) }
  var sort by remember { mutableStateOf<String?>(null) }
  val ordered = csGridOrderedKeys(order, columns.map { it.key }).mapNotNull { key -> columns.find { it.key == key } }
  val keysToSearch = csGridFilterKeys(filterKeys, ordered.map { it.key })
  val shown = csGridSorted(csGridFiltered(rows, filterText, keysToSearch), sort, sortValues)
  val keys = shown.mapIndexed { index, row -> csGridRowKey(row["id"], index) }
  val allSelected = keys.isNotEmpty() && keys.all { selected.contains(it) }
  val useVirtual = csGridVirtual(virtual, shown.size, virtualThreshold)
  val scroll = rememberScrollState()
  val incoming = measuredRowHeight ?: rowHeight
  var settled by remember { mutableStateOf(rowHeight) }
  val shownMeasure = csGridMeasured(settled, incoming)
  LaunchedEffect(incoming) { settled = shownMeasure }
  val safeRow = csGridRowHeight(rowHeight, shownMeasure)
  val body = maxOf(0.0, height - 40)
  val window = csGridWindow(shown.size, height, safeRow, scroll.value.toDouble(), useVirtual)
  val painted = csGridPainted(shown.size, window.first, window.second)
  val publishedHeight = csGridRowBox(useVirtual, safeRow)
  Column(modifier.semantics {
    csGridDataCountValue = csGridDataCount(shown.size)
    csGridVirtualFlagValue = csGridVirtualFlag(useVirtual)
    csGridRowCount(useVirtual, shown.size)?.let { csGridRowCountValue = it }
    publishedHeight?.let { csGridDataRowHeightValue = it }
  }) {
    if (csGridShowsCaption(caption)) Text(caption ?: "", color = pack.colorTextPrimary.toComposeColor())
    if (selectable) {
      CsCheckbox(label = selectAllLabel, checked = allSelected, onCheckedChange = { onSelect(csToggleAllSelection(keys, selected)) }, dark = dark, highContrast = highContrast, compact = compact)
    }
    Row(Modifier.semantics { csGridRowIndex(useVirtual, 0, true)?.let { csGridRowIndexValue = it } }) {
      ordered.forEach { column ->
        if (column.sortable) {
          val aria = csGridSortAria(sort, column.key)
          val mark = if (aria == "ascending") "▲" else if (aria == "descending") "▼" else "↕"
          CsTriggerButton(title = column.header, onClick = { sort = csGridNextSort(sort, column.key) }, modifier = Modifier.minimumInteractiveComponentSize()) {
            Text(column.header + " " + mark)
          }
        } else {
          Text(column.header, color = pack.colorTextPrimary.toComposeColor())
        }
      }
    }
    if (persistKey != null) {
      Row {
        ordered.forEach { column ->
          CsTriggerButton(title = csGridCopy("pin", null), onClick = {
            val next = csGridPinOrder(ordered.map { it.key }, column.key, true) ?: return@CsTriggerButton
            order = next
            pinned = column.key
            csGridSaveOrder(CsGridColumnStore.values, persistKey, next)
            csGridPrefsSave(context, persistKey, next)
          }, modifier = Modifier.minimumInteractiveComponentSize().semantics { contentDescription = csGridPinName(column.header.ifEmpty { null }, column.key, csGridCopy("pinNamed", null)) }) { Text(csGridCopy("pin", null), modifier = Modifier.clearAndSetSemantics {}) }
        }
      }
    }
    if (shown.isEmpty()) {
      Text(csGridEmptyText(empty, csGridCopy("empty", null)), color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.semantics { csGridRowIndex(useVirtual, 0)?.let { csGridRowIndexValue = it } })
    } else Column(if (useVirtual) Modifier.height(body.dp).verticalScroll(scroll) else Modifier) {
      if (useVirtual && window.first > 0) Spacer(Modifier.height((window.first * safeRow).dp))
      painted.forEach { index ->
        val row = shown[index]
        val key = csGridRowKey(row["id"], index)
        val box = csGridRowBox(useVirtual, safeRow)
        Row((if (box != null) Modifier.height(box.dp) else Modifier.heightIn(min = pack.componentButtonMdMinHeight.toDp())).semantics { if (selectable && selected.contains(key)) this.selected = true; csGridRowIndex(useVirtual, index)?.let { csGridRowIndexValue = it } }) {
          if (selectable) {
            CsCheckbox(label = csGridCopy("selectRow", null) + ": " + csGridRowName(ordered.map { row[it.key] }, key), checked = selected.contains(key), onCheckedChange = { onSelect(csToggleSelection(selected, key)) }, dark = dark, highContrast = highContrast, compact = compact)
          }
          ordered.forEach { column ->
            val stuck = csGridSticky(column.key, pinned) != null
            Text(csGridCellText(row, column.key, renders[column.key]), color = pack.colorTextPrimary.toComposeColor(), modifier = if (stuck) Modifier.background(pack.colorSurfacePanel.toComposeColor()).zIndex(1f) else Modifier)
          }
        }
      }
      if (useVirtual && shown.size > window.second) Spacer(Modifier.height(((shown.size - window.second) * safeRow).dp))
    }
  }
}

@Composable
fun CsTagInput(
  tags: List<String>,
  query: String,
  onChange: (List<String>, String) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  label: String? = null,
  removeLabel: String? = null,
  placeholder: String? = null,
  max: Int? = null,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val hint = csTagPlaceholderShown(placeholder, emptyList(), csTagCopy("placeholder", locale))
  val fieldName = if (label.isNullOrEmpty()) hint else label
  val handle = rememberFocusHandle("tag-query")
  Column(modifier) {
    if (!label.isNullOrEmpty()) Text(label, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.clearAndSetSemantics {})
    Row {
      tags.forEach { tag ->
        val name = csTagRemoveName(removeLabel, tag, csTagCopy("remove", locale))
        CsTriggerButton(title = name, onClick = { onChange(tags.filter { it != tag }, query) }, modifier = Modifier.minimumInteractiveComponentSize().semantics { contentDescription = name }) {
          Text(name, modifier = Modifier.clearAndSetSemantics {})
        }
      }
    }
    androidx.compose.foundation.text.BasicTextField(
      value = query,
      onValueChange = { next ->
        if (!csControlEnabled()) return@BasicTextField
        handle.claim()
        if (next.contains(",")) {
          val edit = csAddTag(tags, next.replace(",", ""), max)
          onChange(edit.tags, edit.query)
        } else onChange(tags, next)
      },
      enabled = csControlEnabled(),
      textStyle = androidx.compose.ui.text.TextStyle(color = pack.colorTextPrimary.toComposeColor()),
      modifier = Modifier.focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }.semantics { contentDescription = fieldName },
    )
  }
}

@Composable
fun CsConfidenceMeter(
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  label: String? = null,
  value: Double? = null,
  level: String? = null,
  segments: Double = 5.0,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val measurement = csConfidenceMeasure(value, level, segments)
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val shown = csConfidenceLabelText(label, csConfidenceCopy("label", spoken))
  val word = csConfidenceToneWord(measurement.tone, csConfidenceCopy("low", spoken), csConfidenceCopy("medium", spoken), csConfidenceCopy("high", spoken))
  val color = when (measurement.tone) {
    "low" -> pack.colorSemanticDanger
    "high" -> pack.colorSemanticSuccess
    else -> pack.colorSemanticWarning
  }.toComposeColor()
  val ink = when (measurement.tone) {
    "low" -> pack.colorSemanticDangerText
    "high" -> pack.colorSemanticSuccessText
    else -> pack.colorSemanticWarningText
  }.toComposeColor()
  Column(modifier.semantics { contentDescription = csConfidenceName(shown, word) }) {
    Text(shown, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.clearAndSetSemantics {})
    Text(word, color = ink, modifier = Modifier.clearAndSetSemantics {})
    Row {
      repeat(measurement.segments) { index ->
        androidx.compose.foundation.layout.Box(
          Modifier
            .padding(end = 4.dp)
            .size(16.dp, 8.dp)
            .clip(RoundedCornerShape(2.dp))
            .background(if (index < measurement.filled) color else pack.colorBorderDefault.toComposeColor()),
        )
      }
    }
  }
}

@Composable
fun CsCollapsible(
  title: String,
  content: String,
  expandedLabel: String,
  collapsedLabel: String,
  isOpen: Boolean,
  onOpenChange: (Boolean) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
) {
  val pack = csModePack(dark, highContrast, compact)
  Column(modifier) {
    CsTriggerButton(title = title, onClick = { onOpenChange(!isOpen) }, modifier = Modifier.fillMaxWidth().minimumInteractiveComponentSize()) {
      Text(title, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.semantics { contentDescription = if (isOpen) expandedLabel else collapsedLabel })
    }
    if (isOpen) Text(content, color = pack.colorTextMuted.toComposeColor())
  }
}

const val csGridSelectAll = "Select all rows"
const val csGridSelectRow = "Select row"
const val csGridEmpty = "No results"
fun csGridRowName(cells: List<String?>, key: String): String {
  for (cell in cells) if (cell != null && cell.trim().isNotEmpty()) return cell
  return key
}
fun csGridAllSelected(selectable: Boolean, keys: List<String>, selected: List<String>) = selectable && keys.isNotEmpty() && keys.all { selected.contains(it) }
fun csGridShowsCaption(caption: String?) = caption != null && caption.isNotEmpty()
fun csGridEmptyText(empty: String?, fallback: String) = empty ?: fallback
fun csGridCellText(row: Map<String, String>, key: String, render: ((Map<String, String>) -> String?)?) = if (render != null) render(row) ?: "" else row[key] ?: ""
fun csGridFilterKeys(requested: List<String>?, columns: List<String>) = if (requested.isNullOrEmpty()) columns else requested
const val csGridPin = "Pin column {name}"
fun csGridOrderedKeys(order: List<String>?, columns: List<String>): List<String> {
  if (order.isNullOrEmpty()) return columns
  val remaining = columns.toMutableList()
  val out = mutableListOf<String>()
  for (key in order) if (remaining.remove(key)) out += key
  out += remaining
  return out
}
fun csGridPinOrder(order: List<String>, key: String, canPersist: Boolean) = if (canPersist) listOf(key) + order.filter { it != key } else null
fun csGridSticky(key: String, pinned: String?) = if (pinned != null && key == pinned) 0.0 else null
fun csGridStorageKey(persistKey: String?) = if (persistKey.isNullOrEmpty()) null else "cs:datagrid:cols:$persistKey"
fun csGridDecodeOrder(raw: String?): List<String>? {
  if (raw == null) return null
  return try {
    val array = org.json.JSONArray(raw)
    (0 until array.length()).map { index ->
      val item = array.get(index)
      if (item !is String) return null
      item
    }
  } catch (error: Exception) { null }
}
fun csGridEncodeOrder(order: List<String>) = org.json.JSONArray(order).toString()
object CsGridColumnStore {
  val values = mutableMapOf<String, String>()
}
fun csGridPrefsLoad(context: android.content.Context, persistKey: String?): List<String>? {
  val key = csGridStorageKey(persistKey) ?: return null
  val raw = context.getSharedPreferences("cs-datagrid", android.content.Context.MODE_PRIVATE).getString(key, null)
  return csGridDecodeOrder(raw)
}
fun csGridPrefsSave(context: android.content.Context, persistKey: String?, order: List<String>?) {
  val key = csGridStorageKey(persistKey) ?: return
  if (order == null) return
  context.getSharedPreferences("cs-datagrid", android.content.Context.MODE_PRIVATE).edit().putString(key, csGridEncodeOrder(order)).apply()
}
fun csGridSaveOrder(store: MutableMap<String, String>, persistKey: String?, order: List<String>?) {
  val key = csGridStorageKey(persistKey) ?: return
  if (order == null) return
  store[key] = csGridEncodeOrder(order)
}
fun csGridPinName(header: String?, key: String, template: String = csGridPin) = template.replace("{name}", header ?: key)
fun csGridCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("selectAll" to "Chọn tất cả", "selectRow" to "Chọn dòng", "empty" to "Không có kết quả", "pin" to "Ghim cột này", "pinNamed" to "Ghim cột {name}")
  val en = mapOf("selectAll" to csGridSelectAll, "selectRow" to csGridSelectRow, "empty" to "No results", "pin" to "Pin this column", "pinNamed" to csGridPin)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
const val csTagPlaceholder = "Add a tag…"
fun csTagValues(value: List<String>?, inner: List<String>) = value ?: inner
fun csTagPlaceholderShown(text: String?, tags: List<String>, fallback: String) = if (tags.isNotEmpty()) "" else text ?: fallback
fun csTagRemoveName(label: String?, tag: String, fallback: String) = "${label ?: fallback} $tag"
fun csTagCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("placeholder" to "Thêm thẻ…", "remove" to "Gỡ")
  val en = mapOf("placeholder" to "Add a tag…", "remove" to "Remove")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csTagCanEdit(disabled: Boolean, composing: Boolean) = !disabled && !composing
const val csToolbarMore = "More actions"
fun csToolbarCut(count: Int, overflowAfter: Int?) = overflowAfter?.let { minOf(count, maxOf(0, it)) } ?: count
fun csToolbarPlacement(explicit: String?) = explicit ?: "bottom-end"
const val csToolbarGap = 6.0
data class CsToolbarPlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csToolbarShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String): CsToolbarPlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement, csToolbarGap) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, csToolbarGap) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsToolbarPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}
fun csToolbarCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("more" to "Thao tác khác")
  val en = mapOf("more" to "More actions")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csToolbarTail(items: List<String>, overflowAfter: Int?) = items.drop(csToolbarCut(items.size, overflowAfter)).filter { it != "-" }
fun csToolbarMove(current: Int, count: Int, delta: Int) = if (count <= 0) 0 else minOf(count - 1, maxOf(0, current + delta))
fun csGridRowKey(value: String?, index: Int) = value ?: index.toString()
fun csGridRowIndex(virtual: Boolean, position: Int, header: Boolean = false) = if (virtual) if (header) 1 else position + 2 else null
private val csGridRowIndexKey = SemanticsPropertyKey<Int>("rowindex")
private var SemanticsPropertyReceiver.csGridRowIndexValue by csGridRowIndexKey
private val csGridRowCountKey = SemanticsPropertyKey<Int>("rowcount")
private var SemanticsPropertyReceiver.csGridRowCountValue by csGridRowCountKey
private val csGridDataCountKey = SemanticsPropertyKey<Int>("data-row-count")
private var SemanticsPropertyReceiver.csGridDataCountValue by csGridDataCountKey
private val csGridDataRowHeightKey = SemanticsPropertyKey<Double>("data-row-height")
private var SemanticsPropertyReceiver.csGridDataRowHeightValue by csGridDataRowHeightKey
private val csGridVirtualFlagKey = SemanticsPropertyKey<String>("data-virtual")
private var SemanticsPropertyReceiver.csGridVirtualFlagValue by csGridVirtualFlagKey
fun csGridRowCount(virtual: Boolean, count: Int) = if (virtual) maxOf(2, count + 1) else null
fun csGridDataCount(count: Int) = count
fun csGridRowHeight(requested: Double, measured: Double): Double {
  val estimate = if (requested.isFinite() && requested > 0) requested else 36.0
  val known = if (measured.isFinite()) measured else estimate
  return maxOf(estimate, known)
}
fun csGridMeasured(previous: Double, next: Double) = if (kotlin.math.abs(previous - next) > 0.01) next else previous
fun csGridRowBox(virtual: Boolean, height: Double) = if (virtual && height.isFinite() && height > 0) height else null
fun csGridVirtual(enabled: Boolean, count: Int, threshold: Int = 80) = enabled || count >= threshold
fun csGridVirtualFlag(virtual: Boolean) = if (virtual) "true" else "false"
fun csGridWindow(count: Int, height: Double, rowHeight: Double, scrollTop: Double, virtual: Boolean): Pair<Int, Int> {
  if (!virtual) return 0 to count
  val safeRow = if (rowHeight.isFinite() && rowHeight > 0) rowHeight else 36.0
  val body = maxOf(0.0, height - 40)
  val visible = kotlin.math.ceil(body / safeRow).toInt() + 8
  val start = minOf(maxOf(0, count - visible), maxOf(0, kotlin.math.floor(scrollTop / safeRow).toInt() - 4))
  return start to minOf(count, start + visible)
}
fun csGridPainted(count: Int, start: Int, end: Int): List<Int> {
  val safeStart = minOf(maxOf(0, start), count)
  val safeEnd = minOf(maxOf(safeStart, end), count)
  return (safeStart until safeEnd).toList()
}
fun csGridFiltered(rows: List<Map<String, String>>, query: String?, keys: List<String>): List<Map<String, String>> {
  val needle = (query ?: "").trim().lowercase()
  if (needle.isEmpty()) return rows
  return rows.filter { row -> keys.any { key -> (row[key] ?: "").lowercase().contains(needle) } }
}
fun csGridSorted(rows: List<Map<String, String>>, sort: String?, values: Map<String, (Map<String, String>) -> String?> = emptyMap()): List<Map<String, String>> {
  if (sort == null || !sort.contains(":")) return rows
  val descending = sort.startsWith("desc:")
  val key = sort.substring(sort.indexOf(':') + 1)
  val value = values[key]
  if (value == null) {
    val sorted = rows.sortedWith(compareBy { it[key] ?: "" })
    return if (descending) sorted.asReversed() else sorted
  }
  val sorted = rows.sortedWith { left, right ->
    val x = value(left)
    val y = value(right)
    val cmp = if (x == null || y == null || x == y) 0 else if (x > y) 1 else -1
    if (descending) -cmp else cmp
  }
  return sorted
}
fun csGridNextSort(current: String?, key: String) = when (current) {
  "asc:$key" -> "desc:$key"
  "desc:$key" -> null
  else -> "asc:$key"
}
fun csGridSortAria(current: String?, key: String) = when (current) {
  "asc:$key" -> "ascending"
  "desc:$key" -> "descending"
  else -> null
}
fun csTimelineMarker(state: String) = if (state == "todo") "" else if (state == "now") "→" else "✓"
fun csTimelineShowsDetail(text: String?) = text != null && text.isNotEmpty()
data class CsTimelineItem(val title: String, val state: String = "done", val meta: String? = null, val body: String? = null)

@Composable
fun CsTimeline(items: List<CsTimelineItem>, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  val pack = csModePack(dark, highContrast, compact)
  Column(modifier) {
    items.forEach { item ->
      val fill = if (item.state == "now") pack.colorBrandOchre else if (item.state == "todo") pack.colorSurfaceRaised else pack.colorSemanticSuccess
      val ink = if (item.state == "now") pack.colorBrandUmber else if (item.state == "todo") pack.colorTextMuted else pack.colorSemanticSuccessFg
      Row(verticalAlignment = Alignment.Top) {
        Text(csTimelineMarker(item.state), color = ink.toComposeColor(), modifier = Modifier.size(26.dp).background(fill.toComposeColor(), CircleShape).then(if (item.state == "todo") Modifier.border(1.dp, pack.colorBorderDefault.toComposeColor(), CircleShape) else Modifier), textAlign = TextAlign.Center)
        Column {
          Text(item.title, color = pack.colorTextPrimary.toComposeColor())
          if (csTimelineShowsDetail(item.meta)) Text(item.meta ?: "", color = pack.colorTextMuted.toComposeColor())
          if (csTimelineShowsDetail(item.body)) Text(item.body ?: "", color = pack.colorTextMuted.toComposeColor())
        }
      }
    }
  }
}

@Composable
fun CsToolbar(
  items: List<String>,
  onSelect: (String) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  label: String? = null,
  overflowAfter: Int? = null,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val moreName = csToolbarCopy("more", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  val head = items.take(csToolbarCut(items.size, overflowAfter))
  val extra = csToolbarTail(items, overflowAfter)
  val actionable = head.mapIndexedNotNull { index, item -> if (item == "-") null else index }
  var focus by remember { mutableIntStateOf(actionable.firstOrNull() ?: 0) }
  var open by remember { mutableStateOf(false) }
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
    if (first == null || second == null) null else csToolbarShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second, csToolbarPlacement(null))
  }
  if (!open && natural != null) { natural = null; fitted = null }
  Column(modifier) {
    Row(Modifier.semantics { contentDescription = label ?: "" }) {
      head.forEachIndexed { index, item ->
        if (item == "-") {
          androidx.compose.foundation.layout.Box(Modifier.padding(horizontal = 4.dp).size(1.dp, 24.dp).background(pack.colorBorderDefault.toComposeColor()).clearAndSetSemantics {})
        } else {
          CsTriggerButton(title = item, onClick = { focus = index; onSelect(item) }, modifier = Modifier.minimumInteractiveComponentSize()) {
            Text(item, color = if (focus == index) pack.colorBrandOchre.toComposeColor() else pack.colorTextPrimary.toComposeColor())
          }
        }
      }
      if (extra.isNotEmpty()) {
        CsTriggerButton(title = moreName, onClick = { open = !open }, modifier = Modifier.minimumInteractiveComponentSize().onGloballyPositioned {
          val bounds = it.boundsInWindow()
          field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
        }.semantics { contentDescription = moreName; stateDescription = if (open) "true" else "false" }) {
          Text(moreName, modifier = Modifier.clearAndSetSemantics {})
        }
      }
    }
    if (open && extra.isNotEmpty()) {
      Column(Modifier.onGloballyPositioned {
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
      }.offset(x = with(density) { (place?.x ?: 0.0).toFloat().toDp() }, y = with(density) { (place?.y ?: 0.0).toFloat().toDp() }).widthIn(max = with(density) { (place?.maxWidth ?: viewWidth).toFloat().toDp() })) {
        extra.forEach { item ->
          CsTriggerButton(title = item, onClick = { open = false; onSelect(item) }, modifier = Modifier.minimumInteractiveComponentSize()) { Text(item) }
        }
      }
    }
  }
}
