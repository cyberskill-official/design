package world.cyberskill.design

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.isShiftPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics

data class CsCommandGroup(val title: String, val items: List<String>)

fun csCommandFilter(groups: List<CsCommandGroup>, query: String): List<CsCommandGroup> {
  val needle = query.trim().lowercase()
  return groups.map { group -> group.copy(items = group.items.filter { needle.isEmpty() || it.lowercase().contains(needle) }) }
}
const val csCommandPlaceholder = "Type a command or search…"
fun csCommandCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("placeholder" to "Nhập lệnh hoặc tìm kiếm…", "empty" to "Không có kết quả", "oneResult" to "{count} kết quả", "results" to "{count} kết quả", "aria" to "Bảng lệnh", "esc" to "Esc")
  val en = mapOf("placeholder" to csCommandPlaceholder, "empty" to "No results", "oneResult" to "{count} result", "results" to "{count} results", "aria" to "Command palette", "esc" to "Esc")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csCommandPlaceholderText(text: String?, fallback: String) = text ?: fallback
fun csCommandFormat(count: Int, language: String?): String {
  val primary = csComboboxPrimaryLanguage(language) ?: "vi"
  val locale = when (primary) {
    "vi" -> java.util.Locale("vi", "VN")
    "ja" -> java.util.Locale.JAPAN
    else -> java.util.Locale.US
  }
  return java.text.NumberFormat.getNumberInstance(locale).format(count)
}
fun csCommandClosesOnBackdrop() = true
fun csCommandStops(resultCount: Int) = 1 + maxOf(0, resultCount)
fun csCommandStatus(count: Int, language: String?): String {
  if (count == 0) return csCommandCopy("empty", language)
  val template = csCommandCopy(if (count == 1) "oneResult" else "results", language)
  return template.replace("{count}", csCommandFormat(count, language))
}

fun csTransferToggle(checked: List<String>, key: String): List<String> =
  if (checked.contains(key)) checked.filter { it != key } else checked + key

fun csTransferMove(value: List<String>, checked: List<String>, items: List<String>, toTarget: Boolean): Pair<List<String>, List<String>> {
  val moving = checked.filter { items.contains(it) && value.contains(it) != toTarget }
  if (moving.isEmpty()) return value to checked
  val next = if (toTarget) value + moving else value.filter { !moving.contains(it) }
  return next to emptyList()
}
fun csTransferCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("source" to "Có sẵn", "target" to "Đã chọn", "toTarget" to "Chuyển sang đã chọn", "toSource" to "Chuyển về có sẵn")
  val en = mapOf("source" to "Available", "target" to "Selected", "toTarget" to "Move to selected", "toSource" to "Move to available")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csTransferTitle(text: String?, fallback: String) = text ?: fallback

const val csOneTimeLabel = "One-time code"
fun csOneTimeCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Mã dùng một lần")
  val en = mapOf("label" to csOneTimeLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csOneTimeLabelText(label: String?, fallback: String) = label ?: fallback
fun csOneTimeDigits(raw: String, requested: Double = 6.0): String {
  val length = csRenderCount(requested, 6)
  return raw.filter { it in '0'..'9' }.take(length)
}
fun csOneTimeText(controlled: String?, inner: String, requested: Double = 6.0) = csOneTimeDigits(controlled ?: inner, requested)
fun csOneTimeCommit(raw: String, requested: Double = 6.0, disabled: Boolean) = if (disabled) null else csOneTimeDigits(raw, requested)
fun csOneTimeBox(value: String, index: Int) = if (index in value.indices) value[index].toString() else ""
fun csOneTimeReplace(value: String, index: Int, next: String, requested: Double = 6.0): String? {
  val current = csOneTimeDigits(value, requested)
  if (next.isEmpty()) return current.take(maxOf(0, index)) + current.drop(maxOf(0, index + 1))
  val typed = next.filter { it in '0'..'9' }
  if (typed.isEmpty()) return null
  return csOneTimeDigits(current.take(maxOf(0, index)) + typed + current.drop(maxOf(0, index + 1)), requested)
}
fun csOneTimeBackspace(value: String, index: Int, requested: Double = 6.0): String {
  val chars = csOneTimeDigits(value, requested).toMutableList()
  if (index in chars.indices) chars.removeAt(index) else if (index > 0 && index - 1 in chars.indices) chars.removeAt(index - 1)
  return chars.joinToString("")
}
fun csOneTimePaste(text: String, requested: Double = 6.0, disabled: Boolean) = if (disabled) null else csOneTimeDigits(text, requested)
fun csOneTimeDigitName(label: String, index: Int, length: Int) = "$label ${index + 1}/$length"

fun csCarouselClamp(index: Int, count: Int): Int = if (count <= 0) 0 else minOf(count - 1, maxOf(0, index))

const val csCarouselSlide = "Slide"
const val csCarouselPrevious = "Previous slide"
const val csCarouselNext = "Next slide"
fun csCarouselCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("prev" to "Ảnh trước", "next" to "Ảnh sau", "slide" to "Ảnh")
  val en = mapOf("prev" to csCarouselPrevious, "next" to csCarouselNext, "slide" to csCarouselSlide)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csCarouselSlideLabel(index: Int, count: Int, word: String) = "$word ${index + 1}/$count"
fun csCarouselStatus(index: Int, count: Int, word: String) = if (count > 0) csCarouselSlideLabel(index, count, word) else ""
fun csCarouselGo(index: Int, delta: Int, count: Int): Int {
  if (count <= 0) return 0
  return csNonnegative(index + delta, count)
}

data class CsTreeNode(val key: String, val label: String, val children: List<CsTreeNode> = emptyList())

fun csTreeVisible(nodes: List<CsTreeNode>, open: Map<String, Boolean>): List<CsTreeNode> {
  val out = mutableListOf<CsTreeNode>()
  fun walk(list: List<CsTreeNode>) {
    list.forEach { node ->
      out += node
      if (node.children.isNotEmpty() && open[node.key] == true) walk(node.children)
    }
  }
  walk(nodes)
  return out
}

const val csFileTitle = "Drop files here or browse"
const val csFileHint = "PNG, JPG, or PDF up to 10MB"
const val csFileIcon = "M12 16V4M7 9l5-5 5 5M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
fun csFileTitle(title: String?, fallback: String) = title ?: fallback
fun csFileHint(hint: String?, fallback: String) = hint ?: fallback
fun csFileCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("title" to "Kéo tệp vào đây hoặc chọn", "hint" to "PNG, JPG hoặc PDF, tối đa 10MB")
  val en = mapOf("title" to "Drop files here or browse", "hint" to "PNG, JPG, or PDF up to 10MB")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csFileDragging(phase: String) = phase == "over"
fun csFileNotify(files: List<String>, multiple: Boolean): List<String>? {
  val picked = csFileNames(files, multiple)
  return picked.ifEmpty { null }
}
fun csFileNames(files: List<String>, multiple: Boolean): List<String> {
  val first = files.firstOrNull() ?: return emptyList()
  return if (multiple) files else listOf(first)
}

@Composable
fun CsCommandPalette(
  groups: List<CsCommandGroup>,
  query: String,
  onQuery: (String) -> Unit,
  onSelect: (String) -> Unit,
  onClose: () -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  placeholder: String? = null,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val hint = csCommandPlaceholderText(placeholder, csCommandCopy("placeholder", locale))
  val filtered = csCommandFilter(groups, query)
  val resultCount = filtered.sumOf { it.items.size }
  val handle = rememberFocusHandle("command-query")
  val stops = csCommandStops(resultCount)
  var trap by remember { mutableIntStateOf(0) }
  Box(modifier) {
    if (csCommandClosesOnBackdrop()) Box(Modifier.matchParentSize().clickable { onQuery(""); onClose() })
  Column(Modifier.semantics { contentDescription = csCommandCopy("aria", locale) }.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
    if (event.key == Key.Escape) { onQuery(""); onClose(); return@onPreviewKeyEvent true }
    if (event.key != Key.Tab) return@onPreviewKeyEvent false
    val next = csFocusNext(trap, stops, event.isShiftPressed, trap >= 0) ?: return@onPreviewKeyEvent false
    trap = if (csModalPullBack(next >= 0)) 0 else next
    true
  }) {
    Row {
      Box(Modifier.weight(1f)) {
        if (query.isEmpty() && hint.isNotEmpty()) Text(hint, color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.clearAndSetSemantics {})
        androidx.compose.foundation.text.BasicTextField(value = query, onValueChange = { next -> if (!csControlEnabled()) return@BasicTextField; handle.claim(); onQuery(next) }, enabled = csControlEnabled(), modifier = Modifier.fillMaxWidth().focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }.semantics { contentDescription = hint })
      }
      Text(csCommandCopy("esc", locale), color = pack.colorTextMuted.toComposeColor())
    }
    Text(csCommandStatus(resultCount, locale), color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite })
    filtered.forEach { group ->
      if (group.items.isNotEmpty()) {
        if (group.title.isNotEmpty()) Text(group.title, color = pack.colorTextMuted.toComposeColor())
        group.items.forEach { item ->
          CsTriggerButton(title = item, onClick = { onSelect(item); onQuery(""); onClose() }, modifier = Modifier.fillMaxWidth().minimumInteractiveComponentSize()) { Text(item) }
        }
      }
    }
  }
  }
}

@Composable
fun CsTransfer(
  items: List<Pair<String, String>>,
  value: List<String>,
  checked: List<String>,
  onChange: (List<String>, List<String>) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  sourceTitle: String? = null,
  targetTitle: String? = null,
  toTargetLabel: String? = null,
  toSourceLabel: String? = null,
  language: String? = null,
) {
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val source = csTransferTitle(sourceTitle, csTransferCopy("source", locale))
  val target = csTransferTitle(targetTitle, csTransferCopy("target", locale))
  val toward = csTransferTitle(toTargetLabel, csTransferCopy("toTarget", locale))
  val back = csTransferTitle(toSourceLabel, csTransferCopy("toSource", locale))
  val keys = items.map { it.first }
  Row(modifier) {
    Column {
      Text(source)
      items.filter { !value.contains(it.first) }.forEach { item ->
        CsTriggerButton(title = item.second, onClick = { onChange(value, csTransferToggle(checked, item.first)) }, modifier = Modifier.semantics { stateDescription = checked.contains(item.first).toString() }) { Text(item.second) }
      }
    }
    Column {
      CsTriggerButton(title = "›", onClick = { val next = csTransferMove(value, checked, keys, true); onChange(next.first, next.second) }, modifier = Modifier.semantics { contentDescription = toward }) { Text("›", modifier = Modifier.clearAndSetSemantics {}) }
      CsTriggerButton(title = "‹", onClick = { val next = csTransferMove(value, checked, keys, false); onChange(next.first, next.second) }, modifier = Modifier.semantics { contentDescription = back }) { Text("‹", modifier = Modifier.clearAndSetSemantics {}) }
    }
    Column {
      Text(target)
      items.filter { value.contains(it.first) }.forEach { item ->
        CsTriggerButton(title = item.second, onClick = { onChange(value, csTransferToggle(checked, item.first)) }, modifier = Modifier.semantics { stateDescription = checked.contains(item.first).toString() }) { Text(item.second) }
      }
    }
  }
}

@Composable
fun CsInputOTP(value: String, onChange: (String) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, length: Double = 6.0, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val digits = csOneTimeDigits(value, length)
  val name = csOneTimeLabelText(label, csOneTimeCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  val handle = rememberFocusHandle("otp")
  androidx.compose.foundation.text.BasicTextField(value = digits, onValueChange = { next -> if (!csControlEnabled()) return@BasicTextField; handle.claim(); csOneTimeCommit(next, length, false)?.let(onChange) }, enabled = csControlEnabled(), modifier = modifier.focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }.semantics { contentDescription = name }, textStyle = androidx.compose.ui.text.TextStyle(color = pack.colorTextPrimary.toComposeColor()))
}

@Composable
fun CsCarousel(slides: List<String>, index: Int, onChange: (Int) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, previousLabel: String? = null, nextLabel: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val previousName = previousLabel ?: csCarouselCopy("prev", spoken)
  val nextName = nextLabel ?: csCarouselCopy("next", spoken)
  val slideWord = csCarouselCopy("slide", spoken)
  val active = csCarouselClamp(index, slides.size)
  Column(modifier.semantics { contentDescription = csCarouselStatus(active, slides.size, slideWord) }) {
    if (slides.indices.contains(active)) Text(slides[active], color = pack.colorTextPrimary.toComposeColor())
    Row {
      CsTriggerButton(title = previousName, onClick = { onChange(csCarouselGo(active, -1, slides.size)) }, enabled = slides.size > 1) { Text(previousName) }
      CsTriggerButton(title = nextName, onClick = { onChange(csCarouselGo(active, 1, slides.size)) }, enabled = slides.size > 1) { Text(nextName) }
    }
  }
}

@Composable
fun CsTree(label: String, nodes: List<CsTreeNode>, open: Map<String, Boolean>, selected: String?, onSelect: (String) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier) {
  val pack = csModePack(dark, highContrast, compact)
  Column(modifier) {
    Text(label, color = pack.colorTextMuted.toComposeColor())
    csTreeVisible(nodes, open).forEach { node ->
      CsTriggerButton(title = node.label, onClick = { onSelect(node.key) }, modifier = Modifier.fillMaxWidth().minimumInteractiveComponentSize()) {
        Text(node.label, color = if (selected == node.key) pack.colorBrandOchre.toComposeColor() else pack.colorTextPrimary.toComposeColor())
      }
    }
  }
}

@Composable
fun CsFileUpload(onFiles: (List<String>) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, title: String? = null, hint: String? = null, multiple: Boolean = false, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val shownTitle = csFileTitle(title, csFileCopy("title", spoken))
  val shownHint = csFileHint(hint, csFileCopy("hint", spoken))
  Column(modifier.semantics { contentDescription = shownTitle }) {
    Text(shownTitle, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.clearAndSetSemantics {})
    Text(shownHint, color = pack.colorTextMuted.toComposeColor())
  }
}

const val csDrawerClose = "Close"
const val csDrawerPanel = "Side panel"
const val csDrawerWidth = 480
fun csDrawerSide(side: String?) = if (side == "left") "left" else "right"
fun csDrawerShowsTitle(title: String?) = title != null && title.isNotEmpty()
fun csDrawerLabel(title: String?, fallback: String) = if (csDrawerShowsTitle(title)) title ?: "" else fallback
fun csDrawerCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("close" to "Đóng", "panel" to "Bảng bên")
  val en = mapOf("close" to csDrawerClose, "panel" to csDrawerPanel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csDrawerShowsActions(actions: String?) = actions != null && actions.isNotEmpty()
fun csDrawerNotify(hasOpenChange: Boolean, hasClose: Boolean): List<String> {
  val events = mutableListOf<String>()
  if (hasOpenChange) events += "open-false"
  if (hasClose) events += "close"
  return events
}
fun csDrawerBodyFocusable(scrollHeight: Double, clientHeight: Double, scrollWidth: Double, clientWidth: Double) = scrollHeight > clientHeight + 1 || scrollWidth > clientWidth + 1

@Composable
fun CsDrawer(title: String, message: String, closeLabel: String? = null, open: Boolean, onOpenChange: (Boolean) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, side: String = "right", onClose: (() -> Unit)? = null, onRestore: (() -> Unit)? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val closeName = closeLabel ?: csDrawerCopy("close", spoken)
  val panelName = csDrawerCopy("panel", spoken)
  if (open) {
    val edge = csDrawerSide(side)
    val layerId = remember { csOverlayFreshId("drawer") }
    val restoreId = remember { CsFocusRegistry.activeId }
    val closeFocus = remember { FocusRequester() }
    val closeId = remember { csOverlayFreshId("drawer-close") }
    fun claimClose() { CsFocusRegistry.claim(closeId) { closeFocus.requestFocus() } }
    var trap by remember { mutableIntStateOf(0) }
    DisposableEffect(layerId) {
      CsOverlayRegistry.push(layerId)
      onDispose { CsOverlayRegistry.remove(layerId) }
    }
    LaunchedEffect(open) { closeFocus.requestFocus() }
    Column(modifier.onPreviewKeyEvent { event ->
      if (event.type != KeyEventType.KeyDown || event.key != Key.Tab) return@onPreviewKeyEvent false
      val live = CsOverlayRegistry.resolved(layerId, listOf(CsOverlayLayer(layerId, "modal", true)))
      if (!csOverlayOwns(layerId, live)) return@onPreviewKeyEvent false
      val next = csFocusNext(trap, 1, event.isShiftPressed, true) ?: return@onPreviewKeyEvent false
      trap = next
      true
    }.semantics { contentDescription = csDrawerLabel(title, panelName) }) {
      if (csDrawerShowsTitle(title)) Text(title, color = pack.colorTextPrimary.toComposeColor())
      Text(message, color = pack.colorTextMuted.toComposeColor())
      TextButton(onClick = {
        if (!csControlEnabled()) return@TextButton
        claimClose()
        onOpenChange(false)
        onClose?.invoke()
        val stack = CsOverlayRegistry.resolved(layerId, listOf(CsOverlayLayer(layerId, "modal", true)))
        csReturnFocus(restoreId, onRestore, layerId, stack)
      }, enabled = csControlEnabled(), modifier = Modifier.minimumInteractiveComponentSize().focusRequester(closeFocus).onFocusChanged { if (it.isFocused) claimClose() }.semantics { contentDescription = closeName }) {
        CsIcon(name = "close", label = "", dark = dark, highContrast = highContrast, compact = compact, modifier = Modifier.clearAndSetSemantics { })
      }
    }
  }
}
