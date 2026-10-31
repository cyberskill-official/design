package world.cyberskill.design

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.max
import kotlin.math.min

data class CsProgressMeasurement(val clamped: Double, val percent: Double, val max: Double)

fun csProgressMeasure(value: Double, max: Double): CsProgressMeasurement {
  val safeMax = if (max.isFinite() && max > 0.0) max else 100.0
  val numeric = if (value.isFinite()) value else 0.0
  val clamped = min(safeMax, max(0.0, numeric))
  val percent = min(100.0, max(0.0, (clamped / safeMax) * 100.0))
  return CsProgressMeasurement(clamped, percent, safeMax)
}

const val csProgressLabel = "Progress"
fun csProgressBarName(label: String?, fallback: String) = label ?: fallback
fun csProgressCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Tiến độ")
  val en = mapOf("label" to csProgressLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csRadioShowsText(value: String?) = !value.isNullOrEmpty()
fun csRadioGroupName(name: String?, generated: String) = name ?: generated
fun csRadioChecked(value: String?, option: String) = value == option
fun csRadioSelect(option: String, hasHandler: Boolean) = if (hasHandler) option else null
fun csCheckShowsText(value: String?) = !value.isNullOrEmpty()
fun csCheckLabelId(id: String, label: String?) = if (csCheckShowsText(label)) "$id-label" else null
fun csCheckLabelledBy(explicit: String?, hasAriaLabel: Boolean, labelId: String?) = when {
  explicit != null -> explicit
  hasAriaLabel -> null
  else -> labelId
}
fun csCheckDescribedBy(explicit: String?, descriptionId: String?): String? {
  val parts = mutableListOf<String>()
  for (value in listOf(explicit, descriptionId)) {
    value?.trim()?.split(Regex("\\s+"))?.forEach { if (it.isNotEmpty() && it !in parts) parts.add(it) }
  }
  return if (parts.isEmpty()) null else parts.joinToString(" ")
}
fun csProgressVariant(name: String?) = if (name == "umber" || name == "success") name else "ochre"

fun csInitials(name: String): String {
  val parts = name.trim().split(Regex("\\s+")).filter { it.isNotEmpty() }.take(2)
  return parts.map { it.first() }.joinToString("").uppercase()
}

fun csAvatarHasImage(src: String?) = !src.isNullOrEmpty()
fun csAvatarSpoken(src: String?, name: String): String? = if (csAvatarHasImage(src)) name else name.ifEmpty { null }
fun csAvatarTitle(name: String): String? = name.ifEmpty { null }

fun csAvatarPoints(size: String): Int = when (size) {
  "sm" -> 28
  "lg" -> 56
  else -> 40
}

enum class CsAlertVariant { Info, Success, Warning, Danger }

fun csAlertText(variant: CsAlertVariant, pack: CSTokenModePack): CSColorValue = when (variant) {
  CsAlertVariant.Info -> pack.colorSemanticInfoText
  CsAlertVariant.Success -> pack.colorSemanticSuccessText
  CsAlertVariant.Warning -> pack.colorSemanticWarningText
  CsAlertVariant.Danger -> pack.colorSemanticDangerText
}

enum class CsStatTrend { Up, Down, Flat }

fun csStatMark(trend: CsStatTrend): String = when (trend) {
  CsStatTrend.Up -> "↑"
  CsStatTrend.Down -> "↓"
  CsStatTrend.Flat -> "–"
}
fun csStatTrend(name: String) = when (name) {
  "up" -> CsStatTrend.Up
  "down" -> CsStatTrend.Down
  else -> CsStatTrend.Flat
}
fun csStatShowsDelta(delta: String?) = delta != null
fun csStatArrowPath(name: String) = when (name) {
  "up" -> "M12 5v14M6 11l6-6 6 6"
  "down" -> "M12 5v14M6 13l6 6 6-6"
  else -> "M5 12h14"
}

fun csCheckboxShows(value: String?) = !value.isNullOrEmpty()
@Composable
fun CsCheckbox(
  label: String,
  checked: Boolean,
  onCheckedChange: (Boolean) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  description: String? = null,
  enabled: Boolean = true,
) {
  val pack = csModePack(dark, highContrast, compact)
  val handle = rememberFocusHandle("checkbox")
  Row(
    modifier
      .fillMaxWidth()
      .heightIn(min = pack.componentButtonMdMinHeight.toDp())
      .focusRequester(handle.requester)
      .onFocusChanged { if (it.isFocused) handle.claim() }
      .semantics { contentDescription = if (csCheckboxShows(label)) label else "" }
      .toggleable(value = checked, enabled = csControlEnabled(enabled), role = Role.Checkbox, onValueChange = {
        if (!csControlEnabled(enabled)) return@toggleable
        handle.claim()
        onCheckedChange(it)
      }),
    verticalAlignment = Alignment.CenterVertically,
  ) {
    Checkbox(
      checked = checked,
      onCheckedChange = null,
      enabled = csControlEnabled(enabled),
      colors = CheckboxDefaults.colors(checkedColor = pack.colorBrandOchre.toComposeColor()),
    )
    Column {
      if (csCheckboxShows(label)) Text(label, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.clearAndSetSemantics { })
      if (csCheckboxShows(description)) Text(description ?: "", color = pack.colorTextMuted.toComposeColor())
    }
  }
}

data class CsRadioOption(val value: String, val label: String, val description: String? = null, val disabled: Boolean = false)

@Composable
fun CsRadioGroup(
  label: String,
  options: List<CsRadioOption>,
  selection: String,
  onSelect: (String) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
) {
  val pack = csModePack(dark, highContrast, compact)
  androidx.compose.runtime.CompositionLocalProvider(LocalCsForm provides true) { Column(modifier.semantics { if (csCheckboxShows(label)) contentDescription = label }) {
    if (csCheckboxShows(label)) Text(label, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.clearAndSetSemantics { })
    options.forEach { option ->
      val handle = rememberFocusHandle("radio-${option.value}")
      val rowEnabled = csControlEnabled() && !option.disabled
      Column {
        Row(
          Modifier
            .fillMaxWidth()
            .minimumInteractiveComponentSize()
            .focusRequester(handle.requester)
            .onFocusChanged { if (it.isFocused && rowEnabled) handle.claim() }
            .semantics { contentDescription = option.label }
            .selectable(selected = selection == option.value, enabled = rowEnabled, role = Role.RadioButton, onClick = {
              if (!rowEnabled) return@selectable
              handle.claim()
              onSelect(option.value)
            }),
          verticalAlignment = Alignment.CenterVertically,
        ) {
          RadioButton(selected = selection == option.value, onClick = null, enabled = rowEnabled, colors = RadioButtonDefaults.colors(selectedColor = pack.colorBrandOchre.toComposeColor()))
          if (csCheckboxShows(option.label)) Text(option.label, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.clearAndSetSemantics { })
        }
        if (csCheckboxShows(option.description)) Text(option.description ?: "", color = pack.colorTextMuted.toComposeColor())
      }
    }
  } }
}

@Composable
fun CsProgressBar(
  value: Double,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  label: String? = null,
  maximum: Double = 100.0,
  variant: String = "ochre",
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val measurement = csProgressMeasure(value, maximum)
  val tone = csProgressVariant(variant)
  val color = when (tone) {
    "umber" -> pack.colorBrandUmber
    "success" -> pack.colorSemanticSuccess
    else -> pack.colorBrandOchre
  }
  LinearProgressIndicator(
    progress = (measurement.percent / 100.0).toFloat(),
    modifier = modifier
      .fillMaxWidth()
      .semantics {
        contentDescription = csProgressBarName(label, csProgressCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
        progressBarRangeInfo = ProgressBarRangeInfo(measurement.clamped.toFloat(), 0f..measurement.max.toFloat())
      },
    color = color.toComposeColor(),
    trackColor = pack.colorBorderDefault.toComposeColor(),
  )
}

@Composable
fun CsAvatar(
  name: String,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  size: String = "md",
  square: Boolean = false,
  source: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val points = csAvatarPoints(size).dp
  val shape = if (square) RoundedCornerShape(pack.radiusMd.toDp()) else CircleShape
  val spoken = csAvatarSpoken(source, name)
  Text(
    csInitials(name),
    color = pack.colorSemanticInfoFg.toComposeColor(),
    modifier = modifier
      .size(points)
      .clip(shape)
      .background(pack.colorBrandUmber.toComposeColor())
      .clearAndSetSemantics { if (spoken != null) contentDescription = spoken },
  )
}

@Composable
fun CsAlert(
  title: String,
  message: String,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  variant: CsAlertVariant = CsAlertVariant.Info,
  dismissLabel: String = "",
  onDismiss: (() -> Unit)? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val tone = csAlertText(variant, pack).toComposeColor()
  Row(
    modifier
      .fillMaxWidth()
      .border(1.dp, tone, RoundedCornerShape(pack.radiusMd.toDp()))
      .padding(16.dp),
    verticalAlignment = Alignment.Top,
  ) {
    Column(Modifier.weight(1f)) {
      Text(title, color = tone, fontSize = 16.sp)
      Text(message, color = pack.colorTextMuted.toComposeColor())
    }
    if (onDismiss != null) {
      CsTriggerButton(title = "×", onClick = onDismiss, modifier = Modifier.minimumInteractiveComponentSize()) {
        Text("×", modifier = Modifier.semantics { contentDescription = dismissLabel })
      }
    }
  }
}

@Composable
fun CsSlider(
  label: String? = null,
  value: Float,
  onValueChange: (Float) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  valueRange: ClosedFloatingPointRange<Float> = 0f..100f,
  disabled: Boolean = false,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val handle = rememberFocusHandle("slider")
  val enabled = csControlEnabled(!disabled)
  val spoken = csSliderCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  Slider(
    value = value,
    onValueChange = { next -> if (!enabled) return@Slider; handle.claim(); onValueChange(next) },
    enabled = enabled,
    valueRange = valueRange,
    modifier = modifier.focusRequester(handle.requester).onFocusChanged { if (it.isFocused && enabled) handle.claim() }.semantics { contentDescription = csSliderLabel(label, spoken) },
    colors = SliderDefaults.colors(thumbColor = pack.colorBrandOchre.toComposeColor(), activeTrackColor = pack.colorBrandOchre.toComposeColor()),
  )
}

data class CsTabItem(val value: String, val label: String)

const val csSliderLabel = "Slider"
fun csSliderUpper(min: Double, max: Double) = if (max < min) min else max
fun csSliderSnap(value: Double, min: Double, max: Double, step: Double?): Double {
  val limit = csSliderUpper(min, max)
  val numeric = if (value.isFinite()) value else min
  val clamped = minOf(limit, maxOf(min, numeric))
  if (step == null || step <= 0.0 || !step.isFinite() || limit <= min) return clamped
  val steps = ((clamped - min) / step).let { kotlin.math.round(it) }
  return minOf(limit, maxOf(min, min + steps * step))
}
fun csSliderLabel(label: String?, fallback: String) = label ?: fallback
fun csSliderCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Thanh trượt")
  val en = mapOf("label" to csSliderLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}

const val csTabsList = "Tabs"
fun csTabsIndex(values: List<String>, value: String) = maxOf(0, values.indexOf(value))
fun csTabsStop(index: Int, selected: Int) = if (index == selected) 0 else -1
fun csTabsShowsCount(count: Int?) = count != null
fun csTabsListLabel(label: String?, fallback: String) = label ?: fallback
fun csTabsCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("list" to "Tab")
  val en = mapOf("list" to csTabsList)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}

@Composable
fun CsTabs(
  tabs: List<CsTabItem>,
  selection: String,
  onSelect: (String) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  label: String? = null,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val listName = csTabsListLabel(label, csTabsCopy("list", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  Row(modifier.semantics { contentDescription = listName }) {
    tabs.forEach { tab ->
      val selected = selection == tab.value
      val handle = rememberFocusHandle("tab-${tab.value}")
      Text(
        tab.label,
        color = if (selected) pack.colorBrandOchre.toComposeColor() else pack.colorTextPrimary.toComposeColor(),
        modifier = Modifier
          .weight(1f)
          .minimumInteractiveComponentSize()
          .focusRequester(handle.requester)
          .onFocusChanged { if (it.isFocused) handle.claim() }
          .selectable(selected = selected, enabled = csControlEnabled(), role = Role.Tab, onClick = { handle.claim(); onSelect(tab.value) }),
      )
    }
  }
}

fun csSkeletonLines(requested: Double) = csRenderCount(requested, 0)
fun csSkeletonLineWidth(index: Int, count: Int) = if (count > 0 && index == count - 1) 0.7 else 1.0
fun csSkeletonCircle(variant: String, lines: Int) = lines == 0 && variant == "circle"
fun csSkeletonShimmer(reducedMotion: Boolean) = !reducedMotion

@Composable
fun CsSkeleton(
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  lines: Int = 0,
  circle: Boolean = false,
  width: Int = 120,
  height: Int = 12,
) {
  val pack = csModePack(dark, highContrast, compact)
  val color = pack.colorBorderDefault.toComposeColor()
  if (lines > 0) {
    Column(modifier.clearAndSetSemantics { }, verticalArrangement = Arrangement.spacedBy(8.dp)) {
      repeat(lines) { index ->
        Box(
          Modifier
            .width((width * csSkeletonLineWidth(index, lines)).dp)
            .height(height.dp)
            .clip(RoundedCornerShape(pack.radiusMd.toDp()))
            .background(color),
        )
      }
    }
  } else {
    Box(
      modifier
        .then(if (circle) Modifier.size(width.dp) else Modifier.width(width.dp).height(height.dp))
        .clip(if (circle) CircleShape else RoundedCornerShape(pack.radiusMd.toDp()))
        .background(color)
        .clearAndSetSemantics { },
    )
  }
}

fun csSpinnerLabel(label: String?, fallback: String) = label ?: fallback
fun csSpinnerCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Đang tải")
  val en = mapOf("label" to "Loading")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csSpinnerSpins(reducedMotion: Boolean) = !reducedMotion
fun csSpinnerTopOchre(dark: Boolean) = dark

@Composable
fun CsSpinner(
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  label: String? = null,
  size: Int = 20,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val ink = if (csSpinnerTopOchre(dark)) pack.colorBrandOchre else pack.colorBrandUmber
  val name = csSpinnerLabel(label, csSpinnerCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  CircularProgressIndicator(
    modifier = modifier.size(size.dp).semantics { contentDescription = name; liveRegion = LiveRegionMode.Polite },
    color = ink.toComposeColor(),
    strokeWidth = 2.5.dp,
  )
}

fun csTagLabel(text: String?, fallback: String) = text ?: fallback
fun csTagCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("remove" to "Gỡ")
  val en = mapOf("remove" to "Remove")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}

@Composable
fun CsTag(
  title: String,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  removeLabel: String? = null,
  onRemove: (() -> Unit)? = null,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val spoken = csTagLabel(removeLabel, csTagCopy("remove", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  Row(
    modifier.clip(RoundedCornerShape(pack.radiusMd.toDp())).background(pack.colorSurfacePanel.toComposeColor()).padding(horizontal = 8.dp),
    verticalAlignment = Alignment.CenterVertically,
  ) {
    Text(title, color = pack.colorTextPrimary.toComposeColor())
    if (onRemove != null) {
      CsTriggerButton(title = "×", onClick = onRemove, modifier = Modifier.minimumInteractiveComponentSize()) {
        Text("×", modifier = Modifier.semantics { contentDescription = spoken })
      }
    }
  }
}

@Composable
fun CsStat(
  label: String,
  value: String,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  delta: String? = null,
  trend: CsStatTrend = CsStatTrend.Flat,
) {
  val pack = csModePack(dark, highContrast, compact)
  val ink = when (trend) {
    CsStatTrend.Up -> pack.colorSemanticSuccessText
    CsStatTrend.Down -> pack.colorSemanticDangerText
    CsStatTrend.Flat -> pack.colorTextMuted
  }
  Column(modifier) {
    Text(label, color = pack.colorTextMuted.toComposeColor())
    Text(value, color = pack.colorTextPrimary.toComposeColor(), fontSize = 28.sp)
    if (csStatShowsDelta(delta)) Row { Text(csStatMark(trend), color = ink.toComposeColor()); Text(delta ?: "", color = ink.toComposeColor()) }
  }
}
