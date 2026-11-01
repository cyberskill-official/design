package world.cyberskill.design

import androidx.compose.foundation.Canvas
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
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
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
fun csRadioLabelId(id: String, label: String?) = if (csRadioShowsText(label)) "$id-label" else null
fun csRadioDescId(id: String, description: String?) = if (csRadioShowsText(description)) "$id-desc" else null
fun csRadioDescriptionId(id: String, description: String?) = if (csRadioShowsText(description)) "$id-description" else null
fun csRadioLabelledBy(explicit: String?, hasAriaLabel: Boolean, labelId: String?) = when {
  explicit != null -> explicit
  hasAriaLabel -> null
  else -> labelId
}
fun csRadioDescribedBy(explicit: String?, descriptionId: String?) = csCheckDescribedBy(explicit, descriptionId)
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
const val csAlertBannerDismiss = "Close"
fun csAlertBannerCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("dismiss" to "Đóng")
  val en = mapOf("dismiss" to csAlertBannerDismiss)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csAlertBannerVariantName(variant: CsAlertVariant) = when (variant) {
  CsAlertVariant.Info -> "info"
  CsAlertVariant.Success -> "success"
  CsAlertVariant.Warning -> "warning"
  CsAlertVariant.Danger -> "danger"
}
fun csAlertBannerMark(variant: String?) = when (variant) {
  "success" -> "M4 12.5l5 5 11-11"
  "warning" -> "M12 3l9 16H3z M12 10v4 M12 17h.01"
  "danger" -> "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6"
  else -> "M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"
}
fun csAlertBannerShows(value: String?) = value != null && value.isNotEmpty()
fun csAlertBannerDismissName(explicit: String?, fallback: String) = explicit ?: fallback
fun csAlertBannerShowsDismiss(hasOpenChange: Boolean, hasClose: Boolean, hasDismiss: Boolean) = hasOpenChange || hasClose || hasDismiss
fun csAlertBannerNotify(hasOpenChange: Boolean, hasClose: Boolean, hasDismiss: Boolean): List<String> {
  val events = mutableListOf<String>()
  if (hasOpenChange) events += "open-false"
  if (hasClose) events += "close"
  if (hasDismiss) events += "dismiss"
  return events
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
  val controlEnabled = csControlEnabled(enabled)
  Row(
    modifier
      .fillMaxWidth()
      .heightIn(min = pack.componentButtonMdMinHeight.toDp())
      .alpha(csFormsStyleCheckRadioOpacity(!controlEnabled))
      .focusRequester(handle.requester)
      .onFocusChanged { if (it.isFocused) handle.claim() }
      .semantics { contentDescription = if (csCheckboxShows(label)) label else "" }
      .toggleable(value = checked, enabled = controlEnabled, role = Role.Checkbox, onValueChange = {
        if (!controlEnabled) return@toggleable
        handle.claim()
        onCheckedChange(it)
      }),
    horizontalArrangement = Arrangement.spacedBy(csFormsStyleCheckRadioGap()),
    verticalAlignment = Alignment.CenterVertically,
  ) {
    Checkbox(
      checked = checked,
      onCheckedChange = null,
      enabled = controlEnabled,
      colors = CheckboxDefaults.colors(checkedColor = csFormsStyleCheckRadioAccentColor(dark, pack).toComposeColor()),
    )
    Column(verticalArrangement = Arrangement.spacedBy(csFormsStyleCheckRadioTextGap())) {
      if (csCheckboxShows(label)) Text(label, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.clearAndSetSemantics { })
      if (csCheckboxShows(description)) Text(description ?: "", color = pack.colorTextMuted.toComposeColor())
    }
  }
}

data class CsRadioOption(val value: String, val label: String, val description: String? = null, val disabled: Boolean = false)

@Composable
fun CsRadio(
  label: String,
  selected: Boolean,
  onSelect: () -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  description: String? = null,
  disabled: Boolean = false,
) {
  val pack = csModePack(dark, highContrast, compact)
  val handle = rememberFocusHandle("radio-$label")
  val rowEnabled = csControlEnabled(!disabled)
  Column(modifier.alpha(csFormsStyleCheckRadioOpacity(!rowEnabled)), verticalArrangement = Arrangement.spacedBy(csFormsStyleCheckRadioTextGap())) {
    Row(
      Modifier
        .fillMaxWidth()
        .minimumInteractiveComponentSize()
        .focusRequester(handle.requester)
        .onFocusChanged { if (it.isFocused && rowEnabled) handle.claim() }
        .semantics { contentDescription = if (csRadioShowsText(label)) label else "" }
        .selectable(selected = selected, enabled = rowEnabled, role = Role.RadioButton, onClick = {
          if (!rowEnabled) return@selectable
          handle.claim()
          onSelect()
        }),
      horizontalArrangement = Arrangement.spacedBy(csFormsStyleCheckRadioGap()),
      verticalAlignment = Alignment.CenterVertically,
    ) {
      RadioButton(selected = selected, onClick = null, enabled = rowEnabled, colors = RadioButtonDefaults.colors(selectedColor = csFormsStyleCheckRadioAccentColor(dark, pack).toComposeColor()))
      if (csRadioShowsText(label)) Text(label, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.clearAndSetSemantics { })
    }
    if (csRadioShowsText(description)) Text(description ?: "", color = pack.colorTextMuted.toComposeColor())
  }
}

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
  name: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  androidx.compose.runtime.CompositionLocalProvider(LocalCsForm provides true) { Column(modifier.semantics { if (csCheckboxShows(label)) contentDescription = label }, verticalArrangement = Arrangement.spacedBy(csFormsStyleRadioGroupGap())) {
    if (csCheckboxShows(label)) Text(label, color = pack.colorTextPrimary.toComposeColor(), fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = csFormsStyleRadioGroupLegendMarginBottom()).clearAndSetSemantics { })
    options.forEach { option ->
      val handle = rememberFocusHandle("radio-${option.value}")
      val rowEnabled = csControlEnabled() && !option.disabled
      Column(Modifier.alpha(csFormsStyleCheckRadioOpacity(!rowEnabled)), verticalArrangement = Arrangement.spacedBy(csFormsStyleCheckRadioTextGap())) {
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
          horizontalArrangement = Arrangement.spacedBy(csFormsStyleCheckRadioGap()),
          verticalAlignment = Alignment.CenterVertically,
        ) {
          RadioButton(selected = selection == option.value, onClick = null, enabled = rowEnabled, colors = RadioButtonDefaults.colors(selectedColor = csFormsStyleCheckRadioAccentColor(dark, pack).toComposeColor()))
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
  val progressName = csProgressBarName(label, csProgressCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  LinearProgressIndicator(
    progress = (measurement.percent / 100.0).toFloat(),
    modifier = modifier
      .fillMaxWidth()
      .height(csFeedbackStyleProgressHeight())
      .clip(RoundedCornerShape(pack.radiusFull.toDp()))
      .semantics {
        contentDescription = progressName
        progressBarRangeInfo = ProgressBarRangeInfo(measurement.clamped.toFloat(), 0f..measurement.max.toFloat())
      },
    color = color.toComposeColor(),
    trackColor = pack.colorSurfaceRaised.toComposeColor(),
  )
}

@Composable
fun CsAvatar(
  name: String = "",
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  size: String = "md",
  square: Boolean = false,
  source: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val points = csDataStyleAvatarSize(size)
  val shape = RoundedCornerShape(csDataStyleAvatarRadius(square, size, pack))
  val spoken = csAvatarSpoken(source, name)
  Text(
    csInitials(name),
    color = pack.colorBrandOchre.toComposeColor(),
    fontWeight = FontWeight.Bold,
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
  icon: String? = null,
  dismissLabel: String? = null,
  language: String? = null,
  onOpenChange: ((Boolean) -> Unit)? = null,
  onClose: (() -> Unit)? = null,
  onDismiss: (() -> Unit)? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val tone = csAlertText(variant, pack).toComposeColor()
  val closeName = csAlertBannerDismissName(dismissLabel, csAlertBannerCopy("dismiss", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  Row(
    modifier
      .fillMaxWidth()
      .clip(RoundedCornerShape(pack.radiusMd.toDp()))
      .background(pack.colorSurfacePanel.toComposeColor())
      .border(csFeedbackStyleAlertBorderWidth(), pack.colorBorderDefault.toComposeColor(), RoundedCornerShape(pack.radiusMd.toDp()))
      .padding(horizontal = csFeedbackStyleAlertPaddingX(), vertical = csFeedbackStyleAlertPaddingY()),
    horizontalArrangement = Arrangement.spacedBy(csFeedbackStyleAlertGap()),
    verticalAlignment = Alignment.Top,
  ) {
    if (icon != null) {
      Text(icon, color = tone, modifier = Modifier.padding(top = csFeedbackStyleAlertIconPaddingTop()).clearAndSetSemantics {})
    } else {
      Canvas(Modifier.padding(top = csFeedbackStyleAlertIconPaddingTop()).size(20.dp)) {
        drawPath(csIconPathData(csAlertBannerMark(csAlertBannerVariantName(variant)), size.minDimension), tone, style = Stroke(width = 1.9f))
      }
    }
    Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(csFeedbackStyleAlertTitleMarginBottom())) {
      if (csAlertBannerShows(title)) {
        Text(title, color = tone, fontSize = csFeedbackStyleAlertBodyFontSize(pack).value.sp, fontWeight = FontWeight.Bold)
      }
      if (csAlertBannerShows(message)) {
        Text(message, color = pack.colorTextMuted.toComposeColor(), fontSize = csFeedbackStyleAlertBodyFontSize(pack).value.sp)
      }
    }
    if (csAlertBannerShowsDismiss(onOpenChange != null, onClose != null, onDismiss != null)) {
      CsTriggerButton(title = closeName, onClick = {
        onOpenChange?.invoke(false)
        onClose?.invoke()
        onDismiss?.invoke()
      }, modifier = Modifier.minimumInteractiveComponentSize()) {
        Text("×", modifier = Modifier.semantics { contentDescription = closeName })
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
  step: Double? = 1.0,
  disabled: Boolean = false,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val handle = rememberFocusHandle("slider")
  val min = valueRange.start.toDouble()
  val limit = csSliderUpper(min, valueRange.endInclusive.toDouble())
  val enabled = csControlEnabled(!disabled && limit > min)
  val spoken = csSliderCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  val accent = csFormsStyleCheckRadioAccentColor(dark, pack).toComposeColor()
  Slider(
    value = csSliderSnap(value.toDouble(), min, limit, step).toFloat(),
    onValueChange = { next -> if (!enabled) return@Slider; handle.claim(); onValueChange(csSliderSnap(next.toDouble(), min, limit, step).toFloat()) },
    enabled = enabled,
    valueRange = min.toFloat()..(if (limit > min) limit.toFloat() else (min + 1.0).toFloat()),
    modifier = modifier.heightIn(min = csControlsWaveStyleSliderHeight()).focusRequester(handle.requester).onFocusChanged { if (it.isFocused && enabled) handle.claim() }.semantics { contentDescription = csSliderLabel(label, spoken) },
    colors = SliderDefaults.colors(thumbColor = accent, activeTrackColor = accent),
  )
}

data class CsTabItem(val value: String, val label: String, val count: Int? = null, val id: String? = null, val controls: String? = null)

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
fun csTabsOrientation(vertical: Boolean) = if (vertical) "vertical" else null
fun csTabsListLabel(label: String?, fallback: String) = label ?: fallback
fun csTabsMove(current: Int, count: Int, key: String, vertical: Boolean = false): Int? {
  if (count <= 0) return null
  val index = current.coerceIn(0, count - 1)
  if (key == if (vertical) "ArrowDown" else "ArrowRight") return (index + 1) % count
  if (key == if (vertical) "ArrowUp" else "ArrowLeft") return (index - 1 + count) % count
  if (key == "Home") return 0
  if (key == "End") return count - 1
  return null
}
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
fun CsTab(
  label: String,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  selected: Boolean = false,
  count: Int? = null,
  onSelect: () -> Unit = {},
) {
  val pack = csModePack(dark, highContrast, compact)
  val handle = rememberFocusHandle("tab-$label")
  Column(
    modifier
      .minimumInteractiveComponentSize()
      .focusRequester(handle.requester)
      .onFocusChanged { if (it.isFocused) handle.claim() }
      .selectable(selected = selected, enabled = csControlEnabled(), role = Role.Tab, onClick = { handle.claim(); onSelect() }),
  ) {
    Row(
      Modifier.padding(horizontal = csNavigationStyleTabPaddingX(), vertical = csNavigationStyleTabPaddingY()),
      horizontalArrangement = Arrangement.spacedBy(csNavigationStyleTabGap()),
      verticalAlignment = Alignment.CenterVertically,
    ) {
      Text(
        label,
        color = csNavigationStyleTabTextColor(selected = selected, dark = dark, pack = pack).toComposeColor(),
        fontWeight = FontWeight.SemiBold,
      )
      if (csTabsShowsCount(count) && count != null) {
        Text(
          count.toString(),
          color = pack.colorTextMuted.toComposeColor(),
          fontSize = csNavigationStyleTabCountFontSize(pack).value.sp,
          modifier = Modifier.padding(horizontal = csNavigationStyleTabCountPaddingX(), vertical = csNavigationStyleTabCountPaddingY()),
        )
      }
    }
    csNavigationStyleTabBorderBottomColor(selected, pack)?.let { border ->
      Box(Modifier.fillMaxWidth().height(csNavigationStyleTabBorderBottomWidth()).background(border.toComposeColor()))
    }
  }
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
  vertical: Boolean = false,
  label: String? = null,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val listName = csTabsListLabel(label, csTabsCopy("list", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  val tabListModifier = modifier
    .semantics { contentDescription = listName }
    .onPreviewKeyEvent { event ->
      if (event.type != KeyEventType.KeyDown || tabs.isEmpty()) return@onPreviewKeyEvent false
      val key = when (event.key) {
        Key.DirectionRight -> "ArrowRight"
        Key.DirectionLeft -> "ArrowLeft"
        Key.DirectionDown -> "ArrowDown"
        Key.DirectionUp -> "ArrowUp"
        Key.MoveHome -> "Home"
        Key.MoveEnd -> "End"
        else -> return@onPreviewKeyEvent false
      }
      val current = csTabsIndex(tabs.map { it.value }, selection)
      val next = csTabsMove(current, tabs.size, key, vertical) ?: return@onPreviewKeyEvent false
      onSelect(tabs[next].value)
      true
    }
  val renderTabs: @Composable () -> Unit = {
    tabs.forEach { tab ->
      val selected = selection == tab.value
      val handle = rememberFocusHandle("tab-${tab.value}")
      Column(
        Modifier
          .minimumInteractiveComponentSize()
          .focusRequester(handle.requester)
          .onFocusChanged { if (it.isFocused) handle.claim() }
          .selectable(selected = selected, enabled = csControlEnabled(), role = Role.Tab, onClick = { handle.claim(); onSelect(tab.value) }),
      ) {
        Row(
          Modifier.padding(horizontal = csNavigationStyleTabPaddingX(), vertical = csNavigationStyleTabPaddingY()),
          horizontalArrangement = Arrangement.spacedBy(csNavigationStyleTabGap()),
          verticalAlignment = Alignment.CenterVertically,
        ) {
          Text(
            tab.label,
            color = csNavigationStyleTabTextColor(selected = selected, dark = dark, pack = pack).toComposeColor(),
            fontWeight = FontWeight.SemiBold,
          )
          if (csTabsShowsCount(tab.count) && tab.count != null) {
            Text(
              tab.count.toString(),
              color = pack.colorTextMuted.toComposeColor(),
              fontSize = csNavigationStyleTabCountFontSize(pack).value.sp,
              modifier = Modifier.padding(horizontal = csNavigationStyleTabCountPaddingX(), vertical = csNavigationStyleTabCountPaddingY()),
            )
          }
        }
        csNavigationStyleTabBorderBottomColor(selected, pack)?.let { border ->
          Box(Modifier.fillMaxWidth().height(csNavigationStyleTabBorderBottomWidth()).background(border.toComposeColor()))
        }
      }
    }
  }
  if (vertical) {
    Column(tabListModifier, verticalArrangement = Arrangement.spacedBy(csNavigationStyleTabsGap())) { renderTabs() }
  } else {
    Row(tabListModifier, horizontalArrangement = Arrangement.spacedBy(csNavigationStyleTabsGap())) { renderTabs() }
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
  variant: String = "block",
  radius: Dp? = null,
  width: Int = 120,
  height: Int = 12,
) {
  val pack = csModePack(dark, highContrast, compact)
  val color = pack.colorBorderDefault.toComposeColor()
  val shape = RoundedCornerShape(radius ?: pack.radiusSm.toDp())
  val count = csSkeletonLines(lines.toDouble())
  val round = csSkeletonCircle(if (circle) "circle" else variant, count)
  if (count > 0) {
    Column(modifier.clearAndSetSemantics { }, verticalArrangement = Arrangement.spacedBy(8.dp)) {
      repeat(count) { index ->
        Box(
          Modifier
            .width((width * csSkeletonLineWidth(index, count)).dp)
            .height(height.dp)
            .clip(shape)
            .background(color),
        )
      }
    }
  } else {
    Box(
      modifier
        .then(if (round) Modifier.size(width.dp) else Modifier.width(width.dp).height(height.dp))
        .clip(if (round) CircleShape else shape)
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
    strokeWidth = csFeedbackStyleSpinnerBorderWidth(),
  )
}

const val csTagCloseIconPath = "M6 6l12 12M18 6L6 18"
fun csTagCloseIconSize() = 12.dp
fun csTagCloseStrokeWidth() = 2.4f
fun csTagShowsRemove(hasOnRemove: Boolean) = hasOnRemove
fun csTagLabel(text: String?, fallback: String) = text ?: fallback

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
    modifier
      .clip(RoundedCornerShape(pack.radiusSm.toDp()))
      .background(pack.colorSurfaceRaised.toComposeColor())
      .border(csFeedbackStyleTagBorderWidth(), pack.colorBorderDefault.toComposeColor(), RoundedCornerShape(pack.radiusSm.toDp()))
      .padding(horizontal = csFeedbackStyleTagPaddingX(), vertical = csFeedbackStyleTagPaddingY()),
    horizontalArrangement = Arrangement.spacedBy(csFeedbackStyleTagGap()),
    verticalAlignment = Alignment.CenterVertically,
  ) {
    Text(title, color = pack.colorTextPrimary.toComposeColor(), fontSize = csFeedbackStyleTagFontSize(pack).value.sp, fontWeight = FontWeight.SemiBold)
    if (csTagShowsRemove(onRemove != null) && onRemove != null) {
      CsTriggerButton(title = "×", onClick = onRemove, modifier = Modifier.minimumInteractiveComponentSize()) {
        Canvas(Modifier.size(csTagCloseIconSize())) {
          drawPath(csIconPathData(csTagCloseIconPath, size.minDimension), pack.colorTextMuted.toComposeColor(), style = Stroke(width = csTagCloseStrokeWidth()))
        }
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
  val dir = when (trend) {
    CsStatTrend.Up -> "up"
    CsStatTrend.Down -> "down"
    CsStatTrend.Flat -> "flat"
  }
  val ink = csDataStyleStatDeltaColor(dir, pack)
  Column(modifier, verticalArrangement = Arrangement.spacedBy(csDataStyleStatGap())) {
    Text(label.uppercase(), color = pack.colorTextMuted.toComposeColor(), fontSize = csDataStyleStatLabelFontSize(pack).value.sp, fontWeight = FontWeight.SemiBold)
    Text(value, color = pack.colorTextPrimary.toComposeColor(), fontSize = csDataStyleStatValueFontSize(pack).value.sp, fontWeight = FontWeight.ExtraBold)
    if (csStatShowsDelta(delta)) {
      Row(horizontalArrangement = Arrangement.spacedBy(csDataStyleStatDeltaGap()), verticalAlignment = Alignment.CenterVertically) {
        Canvas(Modifier.size(14.dp)) {
          drawPath(csIconPathData(csStatArrowPath(dir), size.minDimension), ink.toComposeColor(), style = Stroke(width = 2.4f))
        }
        Text(csStatMark(trend), color = ink.toComposeColor(), fontSize = csDataStyleStatDeltaFontSize(pack).value.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clearAndSetSemantics {})
        Text(delta ?: "", color = ink.toComposeColor(), fontSize = csDataStyleStatDeltaFontSize(pack).value.sp, fontWeight = FontWeight.Bold)
      }
    }
  }
}
