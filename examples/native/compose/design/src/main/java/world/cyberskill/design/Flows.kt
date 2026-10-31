package world.cyberskill.design

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics

const val csTimeLabel = "Time"
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

@Composable
fun CsTimePicker(value: String, onChange: (String) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, labelledBy: String? = null, step: Double = 30.0, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val timeName = csTimeName(label, labelledBy, csTimeCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current))) ?: ""
  var open by remember { mutableStateOf(false) }
  Column(modifier) {
    CsTriggerButton(title = value, onClick = { open = !open }, modifier = Modifier.minimumInteractiveComponentSize().semantics { contentDescription = timeName }) { Text(value, color = pack.colorTextPrimary.toComposeColor()) }
    if (open) csTimeSlots(step).forEach { slot -> CsTriggerButton(title = slot, onClick = { onChange(slot) }, modifier = Modifier.minimumInteractiveComponentSize()) { Text(slot) } }
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
fun CsMentions(text: String, users: List<String>, onChange: (String) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, ariaLabel: String? = null, placeholder: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val hint = csMentionPlaceholderText(placeholder, csMentionCopy("placeholder", locale))
  val spoken = csMentionName(ariaLabel, hint)
  val handle = rememberFocusHandle("mentions")
  var dismissed by remember { mutableStateOf(false) }
  val hits = if (dismissed) emptyList() else csMentionHits(users, csMentionQuery(text, text.length))
  Column(modifier.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown || event.key != Key.Escape) return@onPreviewKeyEvent false
    dismissed = true
    true
  }) {
    Box {
      if (text.isEmpty() && hint.isNotEmpty()) Text(hint, color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.clearAndSetSemantics {})
      androidx.compose.foundation.text.BasicTextField(value = text, onValueChange = { next -> if (!csControlEnabled()) return@BasicTextField; handle.claim(); dismissed = false; onChange(next) }, enabled = csControlEnabled(), modifier = Modifier.focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }.semantics { contentDescription = spoken }, textStyle = androidx.compose.ui.text.TextStyle(color = pack.colorTextPrimary.toComposeColor()))
    }
    hits.forEach { user ->
      CsTriggerButton(title = csMentionOption(user), onClick = { onChange(csMentionPick(text, text.length, user)); dismissed = true }, modifier = Modifier.minimumInteractiveComponentSize()) { Text(csMentionOption(user)) }
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
@Composable
fun CsSortable(items: List<String>, onChange: (List<String>) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, upLabel: String? = null, downLabel: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val up = csSortLabel(upLabel, csSortCopy("moveUp", locale))
  val down = csSortLabel(downLabel, csSortCopy("moveDown", locale))
  Column(modifier) {
    items.forEachIndexed { index, item ->
      Row {
        Text("⠿", color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.clearAndSetSemantics {})
        Text(item, color = pack.colorTextPrimary.toComposeColor())
        CsTriggerButton(title = "↑", onClick = { if (csSortCanMoveUp(index)) onChange(csReorder(items, index, index - 1)) }, enabled = csSortCanMoveUp(index), modifier = Modifier.semantics { contentDescription = up }) { Text("↑", modifier = Modifier.clearAndSetSemantics {}) }
        CsTriggerButton(title = "↓", onClick = { if (csSortCanMoveDown(index, items.size)) onChange(csReorder(items, index, index + 1)) }, enabled = csSortCanMoveDown(index, items.size), modifier = Modifier.semantics { contentDescription = down }) { Text("↓", modifier = Modifier.clearAndSetSemantics {}) }
      }
    }
  }
}

@Composable
fun CsTour(steps: List<String>, index: Int, onIndex: (Int) -> Unit, onOpenChange: (Boolean) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, backLabel: String? = null, nextLabel: String? = null, doneLabel: String? = null, skipLabel: String? = null, language: String? = null, open: Boolean = true) {
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val skip = csTourLabel(skipLabel, csTourCopy("skip", locale))
  val back = csTourLabel(backLabel, csTourCopy("back", locale))
  val next = csTourLabel(nextLabel, csTourCopy("next", locale))
  val done = csTourLabel(doneLabel, csTourCopy("done", locale))
  LaunchedEffect(open) { if (open) onIndex(0) }
  if (!open || steps.isEmpty()) return
  val active = csTourClamp(index, steps.size)
  val pack = csModePack(dark, highContrast, compact)
  val last = csTourLast(active, steps.size)
  Column(modifier.semantics { contentDescription = steps[active] }.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown || event.key != Key.Escape) return@onPreviewKeyEvent false
    onOpenChange(false)
    true
  }) {
    Text(steps[active], color = pack.colorTextPrimary.toComposeColor())
    Text(csTourCount(active, steps.size), color = pack.colorTextMuted.toComposeColor())
    CsTriggerButton(title = skip, onClick = { onOpenChange(false) }) { Text(skip) }
    if (active > 0) CsTriggerButton(title = back, onClick = { onIndex(active - 1) }) { Text(back) }
    CsTriggerButton(title = if (last) done else next, onClick = { if (last) onOpenChange(false) else onIndex(active + 1) }) { Text(if (last) done else next) }
  }
}

@Composable
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
@Composable
fun CsDataTable(rows: List<String>, state: String, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, caption: String? = null, emptyLabel: String? = null, errorLabel: String? = null, loadingRows: Double = 5.0, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val locale = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val count = csRenderCount(loadingRows, 5, 1)
  val empty = csTableText(emptyLabel, csTableCopy("empty", locale))
  Column(modifier) {
    if (csTableShowsCaption(caption)) Text(caption ?: "", color = pack.colorTextPrimary.toComposeColor())
    when (state) {
      "loading" -> Column(Modifier.semantics { contentDescription = csTableCopy("loading", locale); stateDescription = "true" }) { repeat(count) { Text(" ", modifier = Modifier.clearAndSetSemantics {}, color = pack.colorBorderDefault.toComposeColor()) } }
      "error" -> if (errorLabel != null) Text(errorLabel, color = pack.colorSemanticDangerText.toComposeColor()) else Column { Text(csTableCopy("error", locale), color = pack.colorSemanticDangerText.toComposeColor()); Text(csTableCopy("errorHint", locale), color = pack.colorTextMuted.toComposeColor()) }
      else -> if (rows.isEmpty()) Text(empty, color = pack.colorTextMuted.toComposeColor()) else rows.forEach { Text(it, color = pack.colorTextPrimary.toComposeColor()) }
    }
  }
}

@Composable
fun CsPopconfirm(title: String, open: Boolean, onOpenChange: (Boolean) -> Unit, onConfirm: () -> Unit, onCancel: () -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, confirmLabel: String? = null, cancelLabel: String? = null, language: String? = null) {
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val okName = csPopconfirmOkText(confirmLabel, csPopconfirmCopy("ok", spoken))
  val cancelName = csPopconfirmOkText(cancelLabel, csPopconfirmCopy("cancel", spoken))
  Column(modifier) {
    CsTriggerButton(title = title, onClick = { onOpenChange(!open) }) { Text(title) }
    if (open) {
      CsTriggerButton(title = cancelName, onClick = { onOpenChange(false); onCancel() }) { Text(cancelName) }
      CsTriggerButton(title = okName, onClick = { onOpenChange(false); onConfirm() }) { Text(okName) }
    }
  }
}

const val csToggleLabel = "Toggle"
fun csToggleValue(pressed: Boolean?, inner: Boolean) = pressed ?: inner
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
fun CsToggle(label: String = "", pressed: Boolean, onChange: (Boolean) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, disabled: Boolean = false, ariaLabel: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val handle = rememberFocusHandle("toggle")
  val enabled = csControlEnabled(!disabled)
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val content = csToggleHasContent(label)
  val name = csToggleName(ariaLabel, content, csToggleCopy("label", spoken))
  TextButton(onClick = {
    if (!enabled) return@TextButton
    val next = csToggleFlip(pressed, disabled, false) ?: return@TextButton
    handle.claim()
    onChange(next)
  }, enabled = enabled, modifier = modifier.focusRequester(handle.requester).onFocusChanged { if (it.isFocused && enabled) handle.claim() }.minimumInteractiveComponentSize().semantics { contentDescription = name ?: label }) {
    if (content) Text(label, color = if (pressed) pack.colorBrandOchre.toComposeColor() else pack.colorTextPrimary.toComposeColor(), modifier = Modifier.clearAndSetSemantics { })
  }
}
