package world.cyberskill.design

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.selection.toggleable
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.ui.Alignment
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.sp
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.isShiftPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow

enum class CsButtonRole { Primary, Danger }

fun csModePack(dark: Boolean, highContrast: Boolean, compact: Boolean): CSTokenModePack {
  val scheme = if (dark) CSColorScheme.DARK else CSColorScheme.LIGHT
  val theme = if (dark) CSTheme.DARK else CSTheme.LIGHT
  return CSModes.resolve(
    theme,
    scheme,
    null,
    null,
    if (compact) CSDensity.COMPACT else CSDensity.COMFORTABLE,
    if (highContrast) CSContrast.HIGH else CSContrast.STANDARD,
    CSStyle.LIQUID_GLASS,
  )
}

fun CSDimension.toDp(): Dp = (if (unit == CSLengthUnit.REM) value * 16 else value).dp

fun CSColorValue.toComposeColor(): Color {
  val rgb = if (colorSpace == CSColorSpace.SRGB) components else oklabToSrgb(components)
  return Color(rgb[0].toFloat(), rgb[1].toFloat(), rgb[2].toFloat(), alpha.toFloat())
}

private fun oklabToSrgb(lab: List<Double>): List<Double> {
  val l = lab[0]
  val a = lab[1]
  val b = lab[2]
  val lmsL = l + 0.3963377774 * a + 0.2158037573 * b
  val lmsM = l - 0.1055613458 * a - 0.0638541728 * b
  val lmsS = l - 0.0894841775 * a - 1.2914855480 * b
  val cubeL = lmsL.pow(3.0)
  val cubeM = lmsM.pow(3.0)
  val cubeS = lmsS.pow(3.0)
  val linear = listOf(
    4.0767416621 * cubeL - 3.3077115913 * cubeM + 0.2309699292 * cubeS,
    -1.2684380046 * cubeL + 2.6097574011 * cubeM - 0.3413193965 * cubeS,
    -0.0041960863 * cubeL - 0.7034186147 * cubeM + 1.7076147010 * cubeS,
  )
  return linear.map { channel ->
    val clamped = min(1.0, max(0.0, channel))
    if (clamped <= 0.0031308) 12.92 * clamped else 1.055 * clamped.pow(1 / 2.4) - 0.055
  }
}

object CsFocusRegistry {
  var activeId: String? = null
    private set
  private val claims = linkedMapOf<String, Pair<Boolean, () -> Unit>>()

  fun claim(id: String, restore: () -> Unit) {
    claims[id] = true to restore
    activeId = id
  }

  fun disconnect(id: String) {
    claims[id] = false to {}
    if (activeId == id) activeId = null
  }

  fun canRestore(id: String?) = claims[id]?.first == true

  fun restore(id: String?) {
    if (canRestore(id)) claims[id]?.second?.invoke()
  }
}

class CsFocusHandle(val id: String, val requester: FocusRequester) {
  fun claim() { CsFocusRegistry.claim(id) { requester.requestFocus() } }
}

@Composable
fun rememberFocusHandle(kind: String): CsFocusHandle {
  val focusId = remember { csOverlayFreshId(kind) }
  val requester = remember { FocusRequester() }
  DisposableEffect(focusId) { onDispose { CsFocusRegistry.disconnect(focusId) } }
  return remember(focusId, requester) { CsFocusHandle(focusId, requester) }
}

@Composable
fun CsTriggerButton(title: String, onClick: () -> Unit, modifier: Modifier = Modifier, enabled: Boolean = true, content: @Composable () -> Unit = { Text(title) }) {
  val handle = rememberFocusHandle("trigger")
  val active = csControlEnabled(enabled)
  TextButton(onClick = { handle.claim(); onClick() }, enabled = active, modifier = modifier.focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }) { content() }
}

@Composable
fun Modifier.csOwnFocus(): Modifier {
  val handle = rememberFocusHandle("focus")
  return this.focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }
}

fun csReturnFocus(savedId: String?, onRestore: (() -> Unit)?, layerId: String, layers: List<CsOverlayLayer>) {
  val captured = CsFocusRegistry.canRestore(savedId)
  if (csModalShouldRestore(csOverlayWasTop(layerId, layers), csModalOwned("panel", "opener", true) && csOverlayOwns(layerId, layers), captured || onRestore != null, false)) {
    if (captured) CsFocusRegistry.restore(savedId)
    onRestore?.invoke()
  }
}

const val csInteractionHoverShadowRed = 69
const val csInteractionHoverShadowGreen = 33
const val csInteractionHoverShadowBlue = 14
const val csInteractionHoverShadowAlpha = 0.24f
fun csInteractionHoverShadowOffsetY() = 8.dp
fun csInteractionHoverShadowBlur() = 20.dp
fun csInteractionButtonTranslateY(
  hovered: Boolean,
  active: Boolean = false,
  disabled: Boolean = false,
  reducedMotion: Boolean = false,
) = if (disabled || active || reducedMotion || !hovered) 0.dp else (-1).dp
fun csInteractionShowsButtonHoverShadow(hovered: Boolean, active: Boolean = false, disabled: Boolean = false) =
  hovered && !active && !disabled
fun csInteractionShowsButtonActiveShadow(active: Boolean, disabled: Boolean = false) =
  active && !disabled
fun csInteractionFocusHaloWidth(focused: Boolean) = if (focused) 5.dp else 0.dp
fun csInteractionCmdkSearchOuterHaloWidth(focused: Boolean) = if (focused) 5.dp else 0.dp
fun csInteractionCmdkSearchInsetHaloWidth(focused: Boolean) = if (focused) 4.dp else 0.dp
fun csInteractionRiseOffsetY(reducedMotion: Boolean = false) = if (reducedMotion) 0.dp else 10.dp
fun csInteractionRiseDelayMs(step: Int, reducedMotion: Boolean = false): Double {
  if (reducedMotion) return 0.0
  return when (step) {
    2 -> 80.0
    3 -> 160.0
    4 -> 240.0
    else -> 0.0
  }
}
fun csInteractionEntranceDurationMs(pack: CSTokenModePack, reducedMotion: Boolean = false): Double =
  if (reducedMotion) 0.0 else pack.durationSlow.value
fun csInteractionDialogDurationMs(pack: CSTokenModePack, reducedMotion: Boolean = false): Double =
  if (reducedMotion) 0.0 else pack.durationBase.value

fun csA11ySrOnlySize() = 1.dp
fun csA11ySrOnlyMargin() = (-1).dp
fun csA11ySrOnlyPadding() = 0.dp
fun csA11ySrOnlyBorderWidth() = 0.dp
fun csA11yTouchTargetMinSize(coarse: Boolean = true) = if (coarse) 44.dp else 0.dp
fun csA11yCheckRadioInputBoxSize(coarse: Boolean = true) = if (coarse) 24.dp else 18.dp
fun csA11yTabsScrollbarHidden(coarse: Boolean = true) = coarse
fun csA11yInputGroupButtonMinWidth(coarse: Boolean = true) = if (coarse) 46.dp else 0.dp
const val csA11yColorPickerColumns = 5
fun csA11yColorPickerColumnWidth(coarse: Boolean = true) = if (coarse) 44.dp else 28.dp
const val csA11yCalendarColumns = 7
fun csA11yCalendarColumnWidth(coarse: Boolean = true) = if (coarse) 44.dp else 34.dp
fun csA11yCalendarMinGridWidth(coarse: Boolean = true) = if (coarse) 308.dp else 238.dp
fun csA11yCarouselViewMinHeight(coarse: Boolean = true) = if (coarse) 64.dp else 0.dp
fun csA11yCarouselViewPaddingInline(coarse: Boolean = true) = if (coarse) 64.dp else 0.dp
fun csA11yCarouselDotButtonSize(coarse: Boolean = true) = if (coarse) 44.dp else 8.dp
fun csA11yCarouselDotRadius() = 4.5.dp
fun csA11yCarouselDotOuterStop() = 5.dp
fun csA11ySplitterMinBlockSize(coarse: Boolean = true) = if (coarse) 46.dp else 0.dp
fun csA11ySplitterBarMinSize(coarse: Boolean = true) = if (coarse) 44.dp else 0.dp
fun csA11ySliderBlockSize(coarse: Boolean = true) = if (coarse) 44.dp else 22.dp
fun csA11yReducedMotionDurationMs(): Double = 0.01
fun csA11yReducedMotionIterationCount(): Int = 1
fun csA11yEffectiveDurationMs(durationMs: Double, reducedMotion: Boolean): Double =
  if (reducedMotion) csA11yReducedMotionDurationMs() else durationMs
const val csA11yHighContrastLightBorderHex = "#9a8060"
const val csA11yHighContrastLightMutedHex = "#45210e"
const val csA11yHighContrastDarkBorderHex = "#7a6450"
const val csA11yHighContrastDarkMutedHex = "#f5ead9"
fun csA11yAppliesHighContrastOverride(prefersContrastMore: Boolean, contrastAttr: String? = null) =
  prefersContrastMore && contrastAttr != "standard"
fun csA11yHighContrastBorderHex(dark: Boolean) = if (dark) csA11yHighContrastDarkBorderHex else csA11yHighContrastLightBorderHex
fun csA11yHighContrastMutedHex(dark: Boolean) = if (dark) csA11yHighContrastDarkMutedHex else csA11yHighContrastLightMutedHex
fun csA11yForcedColorsSwitchBorderWidth() = 1.dp
fun csA11yForcedColorsCarouselDotBorderWidth(current: Boolean) = if (current) 3.dp else 1.dp
fun csA11yForcedColorsSelectedTabBorderBottomWidth(selected: Boolean) = if (selected) 3.dp else 0.dp
fun csA11yForcedColorsSegmentedBorderWidth() = 2.dp
fun csA11yForcedColorsToggleOutlineWidth(pressed: Boolean, focusVisible: Boolean = false) =
  if (pressed && !focusVisible) 2.dp else 0.dp
fun csA11yForcedColorsToggleOutlineOffset() = (-4).dp

enum class CsButtonVariant(val key: String) {
  Primary("primary"),
  Secondary("secondary"),
  Tertiary("tertiary"),
  Ghost("ghost"),
  Danger("danger"),
  DangerGhost("danger-ghost"),
}

enum class CsButtonSize(val key: String) {
  Xs("xs"),
  Sm("sm"),
  Md("md"),
  Lg("lg"),
}

const val csButtonDangerGhostHoverAlpha = 0.03
const val csButtonDisabledOpacity = 0.58

fun csButtonResolveVariant(raw: String?): CsButtonVariant =
  CsButtonVariant.entries.firstOrNull { it.key == raw } ?: CsButtonVariant.Primary

fun csButtonResolveSize(raw: String?): CsButtonSize =
  CsButtonSize.entries.firstOrNull { it.key == raw } ?: CsButtonSize.Md

fun csButtonIsDisabled(disabled: Boolean, loading: Boolean): Boolean = disabled || loading
fun csButtonAriaBusy(loading: Boolean): String? = if (loading) "true" else null
fun csButtonShowsIcon(icon: String?): Boolean = !icon.isNullOrEmpty()
fun csButtonOpacity(disabled: Boolean, loading: Boolean): Float =
  if (csButtonIsDisabled(disabled, loading)) csButtonDisabledOpacity.toFloat() else 1f
fun csButtonFontWeight(): Int = 700
fun csButtonLineHeight(): Double = 1.2
fun csButtonGap(pack: CSTokenModePack): Dp = pack.componentButtonGap.toDp()
fun csButtonRadius(pack: CSTokenModePack): Dp = pack.componentButtonRadius.toDp()
fun csButtonBorderWidth(): Dp = 1.dp
fun csButtonHoverBrightness(variant: CsButtonVariant): Double =
  if (variant == CsButtonVariant.Primary || variant == CsButtonVariant.Danger) 1.08 else 1.0
fun csButtonActiveTranslateY(): Dp = 0.5.dp
fun csButtonSpinnerBorderWidth(): Dp = 2.dp
fun csButtonSpinnerDurationMs(): Double = 600.0
fun csButtonSpinnerSpins(reducedMotion: Boolean): Boolean = !reducedMotion

fun csButtonMinHeight(size: CsButtonSize, pack: CSTokenModePack, coarse: Boolean = false): Dp = when (size) {
  CsButtonSize.Xs -> (if (coarse) pack.componentButtonXsMinHeightCoarse else pack.componentButtonXsMinHeight).toDp()
  CsButtonSize.Sm -> (if (coarse) pack.componentButtonSmMinHeightCoarse else pack.componentButtonSmMinHeight).toDp()
  CsButtonSize.Md -> (if (coarse) pack.componentButtonMdMinHeightCoarse else pack.componentButtonMdMinHeight).toDp()
  CsButtonSize.Lg -> pack.componentButtonLgMinHeight.toDp()
}

fun csButtonMinWidth(size: CsButtonSize, pack: CSTokenModePack): Dp = when (size) {
  CsButtonSize.Xs -> pack.componentButtonXsMinWidth.toDp()
  CsButtonSize.Sm -> pack.componentButtonSmMinHeight.toDp()
  CsButtonSize.Md -> pack.componentButtonMdMinHeight.toDp()
  CsButtonSize.Lg -> 0.dp
}

fun csButtonPaddingY(size: CsButtonSize, pack: CSTokenModePack): Dp = when (size) {
  CsButtonSize.Xs -> pack.componentButtonXsPaddingY.toDp()
  CsButtonSize.Sm -> pack.componentButtonSmPaddingY.toDp()
  CsButtonSize.Md -> pack.componentButtonMdPaddingY.toDp()
  CsButtonSize.Lg -> pack.componentButtonLgPaddingY.toDp()
}

fun csButtonPaddingX(size: CsButtonSize, pack: CSTokenModePack): Dp = when (size) {
  CsButtonSize.Xs -> pack.componentButtonXsPaddingX.toDp()
  CsButtonSize.Sm -> pack.componentButtonSmPaddingX.toDp()
  CsButtonSize.Md -> pack.componentButtonMdPaddingX.toDp()
  CsButtonSize.Lg -> pack.componentButtonLgPaddingX.toDp()
}

fun csButtonFontSize(size: CsButtonSize, pack: CSTokenModePack): Dp =
  (if (size == CsButtonSize.Xs) pack.fontSizeSm else pack.fontSizeBase).toDp()

fun csButtonBackgroundColor(variant: CsButtonVariant, pack: CSTokenModePack, hovered: Boolean = false): CSColorValue? = when (variant) {
  CsButtonVariant.Primary -> pack.componentButtonPrimaryBg
  CsButtonVariant.Secondary -> if (hovered) pack.colorSurfaceRaised else pack.colorSurfacePanel
  CsButtonVariant.Tertiary -> pack.colorSurfaceRaised
  CsButtonVariant.Ghost -> if (hovered) pack.colorSurfaceRaised else null
  CsButtonVariant.Danger -> pack.colorSemanticDanger
  CsButtonVariant.DangerGhost ->
    if (hovered) CSColorValue(pack.colorSemanticDanger.colorSpace, pack.colorSemanticDanger.components, csButtonDangerGhostHoverAlpha)
    else null
}

fun csButtonForegroundColor(variant: CsButtonVariant, pack: CSTokenModePack, dark: Boolean = false): CSColorValue = when (variant) {
  CsButtonVariant.Primary -> pack.componentButtonPrimaryFg
  CsButtonVariant.Secondary -> if (dark) pack.colorBrandOchre else pack.colorBrandUmber
  CsButtonVariant.Tertiary, CsButtonVariant.Ghost -> if (dark) pack.colorTextPrimary else pack.colorBrandUmber
  CsButtonVariant.Danger -> pack.colorSemanticDangerFg
  CsButtonVariant.DangerGhost -> pack.colorSemanticDangerText
}

fun csButtonBorderColor(variant: CsButtonVariant, pack: CSTokenModePack, dark: Boolean = false, hovered: Boolean = false): CSColorValue? = when (variant) {
  CsButtonVariant.Secondary -> if (dark) pack.colorBrandOchre else pack.colorBrandUmber
  CsButtonVariant.Tertiary -> if (hovered) pack.colorBorderDefault else null
  CsButtonVariant.Primary, CsButtonVariant.Ghost, CsButtonVariant.Danger, CsButtonVariant.DangerGhost -> null
}

@Composable
fun CsButton(
  title: String,
  onClick: () -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  role: CsButtonRole = CsButtonRole.Primary,
  variant: CsButtonVariant? = null,
  size: CsButtonSize = CsButtonSize.Md,
  loading: Boolean = false,
  disabled: Boolean = false,
  fullWidth: Boolean = true,
  icon: String? = null,
  paddingX: Dp? = null,
  paddingY: Dp? = null,
  modifier: Modifier = Modifier,
) {
  val pack = csModePack(dark, highContrast, compact)
  val activeVariant = variant ?: if (role == CsButtonRole.Primary) CsButtonVariant.Primary else CsButtonVariant.Danger
  val isOff = csButtonIsDisabled(disabled, loading)
  val fill = csButtonBackgroundColor(activeVariant, pack, false)?.toComposeColor() ?: Color.Transparent
  val ink = csButtonForegroundColor(activeVariant, pack, dark).toComposeColor()
  val stroke = csButtonBorderColor(activeVariant, pack, dark, false)?.toComposeColor()
  val focusId = remember { csOverlayFreshId("button") }
  val requester = remember { FocusRequester() }
  var focused by remember { mutableStateOf(false) }
  val shape = RoundedCornerShape(csButtonRadius(pack))
  val haloWidth = csInteractionFocusHaloWidth(focused)
  val fontDp = csButtonFontSize(size, pack)
  DisposableEffect(focusId) { onDispose { CsFocusRegistry.disconnect(focusId) } }
  Button(
    onClick = {
      if (isOff) return@Button
      CsFocusRegistry.claim(focusId) { requester.requestFocus() }
      onClick()
    },
    enabled = csControlEnabled(!isOff),
    modifier = modifier
      .then(if (fullWidth) Modifier.fillMaxWidth() else Modifier)
      .widthIn(min = csButtonMinWidth(size, pack))
      .heightIn(min = csButtonMinHeight(size, pack))
      .alpha(csButtonOpacity(disabled, loading))
      .then(if (stroke != null) Modifier.border(csButtonBorderWidth(), stroke, shape) else Modifier)
      .then(if (haloWidth > 0.dp) Modifier.border(haloWidth, pack.colorAccentOchre.toComposeColor(), shape) else Modifier)
      .focusRequester(requester)
      .onFocusChanged {
        focused = it.isFocused
        if (it.isFocused) CsFocusRegistry.claim(focusId) { requester.requestFocus() }
      },
    contentPadding = androidx.compose.foundation.layout.PaddingValues(
      horizontal = paddingX ?: csButtonPaddingX(size, pack),
      vertical = paddingY ?: csButtonPaddingY(size, pack),
    ),
    colors = ButtonDefaults.buttonColors(containerColor = fill, contentColor = ink),
    shape = shape,
  ) {
    Row(
      horizontalArrangement = Arrangement.spacedBy(csButtonGap(pack)),
      verticalAlignment = Alignment.CenterVertically,
    ) {
      if (csButtonShowsIcon(icon)) {
        CsIcon(name = icon ?: "", label = "", dark = dark, highContrast = highContrast, compact = compact, modifier = Modifier.clearAndSetSemantics {})
      }
      Text(title, fontSize = fontDp.value.sp, fontWeight = FontWeight.Bold)
      if (loading) {
        Box(
          Modifier
            .size(fontDp)
            .border(csButtonSpinnerBorderWidth(), ink, CircleShape)
            .clearAndSetSemantics {}
        )
      }
    }
  }
}

const val csTextFieldPlaceholderOpacity = 0.7f
const val csTextFieldDisabledOpacity = 0.58f
fun csTextFieldShowsLabel(label: String?) = !label.isNullOrBlank()
fun csTextFieldAlert(error: String?) = !error.isNullOrEmpty()
fun csTextFieldShowsDescription(description: String?) = !description.isNullOrEmpty()
fun csTextFieldInvalid(error: String?, ariaInvalid: Boolean = false) = csTextFieldAlert(error) || ariaInvalid
fun csTextFieldLabelId(id: String, label: String?) = if (csTextFieldShowsLabel(label)) "$id-label" else null
fun csTextFieldDescriptionId(id: String, description: String?) = if (csTextFieldShowsDescription(description)) "$id-description" else null
fun csTextFieldErrorId(id: String, error: String?) = if (csTextFieldAlert(error)) "$id-error" else null
fun csTextFieldLabelledBy(explicit: String?, hasAriaLabel: Boolean, labelId: String?) = when {
  explicit != null -> explicit
  hasAriaLabel -> null
  else -> labelId
}
fun csTextFieldDescribedBy(explicit: String?, descriptionId: String?, errorId: String?): String? {
  val parts = mutableListOf<String>()
  for (value in listOf(explicit, descriptionId, errorId)) {
    value?.trim()?.split(Regex("\\s+"))?.forEach { if (it.isNotEmpty() && it !in parts) parts.add(it) }
  }
  return if (parts.isEmpty()) null else parts.joinToString(" ")
}
fun csTextFieldGap() = 6.dp
fun csTextFieldLabelFontWeight() = 700
fun csTextFieldDescriptionFontSize() = 14.sp
fun csTextFieldErrorFontSize() = 14.sp
fun csTextFieldBorderWidth() = 1.dp
fun csTextFieldRadius(pack: CSTokenModePack) = pack.radiusMd.toDp()
fun csTextFieldMinHeight(pack: CSTokenModePack) = pack.componentTextfieldMinHeight.toDp()
fun csTextFieldPaddingY(pack: CSTokenModePack) = pack.componentTextfieldPaddingY.toDp()
fun csTextFieldPaddingX(pack: CSTokenModePack) = pack.componentTextfieldPaddingX.toDp()
fun csTextFieldOpacity(disabled: Boolean) = if (disabled) csTextFieldDisabledOpacity else 1f
fun csTextFieldBorderColor(invalid: Boolean, pack: CSTokenModePack) =
  if (invalid) pack.colorSemanticDanger else pack.componentTextfieldBorderDefault

@Composable
fun CsTextField(
  label: String,
  value: String,
  onValueChange: (String) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  secure: Boolean = false,
  disabled: Boolean = false,
  readOnly: Boolean = false,
  required: Boolean = false,
  placeholder: String? = null,
  description: String? = null,
  modifier: Modifier = Modifier,
  error: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val handle = rememberFocusHandle("text-field")
  val invalid = csTextFieldAlert(error)
  val borderStroke = csTextFieldBorderColor(invalid, pack).toComposeColor()
  Column(
    modifier.alpha(csTextFieldOpacity(disabled)),
    verticalArrangement = Arrangement.spacedBy(csTextFieldGap()),
  ) {
    if (csTextFieldShowsDescription(description)) {
      Text(description ?: "", color = pack.colorTextMuted.toComposeColor(), fontSize = csTextFieldDescriptionFontSize())
    }
    OutlinedTextField(
      value = value,
      onValueChange = { next -> if (!csControlEnabled(!disabled) || readOnly) return@OutlinedTextField; handle.claim(); onValueChange(next) },
      enabled = csControlEnabled(!disabled),
      readOnly = readOnly,
      isError = invalid,
      label = if (csTextFieldShowsLabel(label)) ({ Text(label, fontWeight = FontWeight.Bold) }) else null,
      placeholder = if (placeholder != null) ({ Text(placeholder) }) else null,
      singleLine = true,
      visualTransformation = if (secure) PasswordVisualTransformation() else VisualTransformation.None,
      keyboardOptions = KeyboardOptions(keyboardType = if (secure) KeyboardType.Password else KeyboardType.Text),
      modifier = Modifier
        .fillMaxWidth()
        .heightIn(min = csTextFieldMinHeight(pack))
        .border(csTextFieldBorderWidth(), borderStroke, RoundedCornerShape(csTextFieldRadius(pack)))
        .padding(horizontal = csTextFieldPaddingX(pack), vertical = csTextFieldPaddingY(pack))
        .focusRequester(handle.requester)
        .onFocusChanged { if (it.isFocused) handle.claim() },
    )
    if (invalid) Text(error ?: "", color = pack.colorSemanticDangerText.toComposeColor(), fontSize = csTextFieldErrorFontSize(), modifier = Modifier.semantics { liveRegion = LiveRegionMode.Assertive })
  }
}

@Composable
fun CsTextButton(
  title: String,
  onClick: () -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  role: CsButtonRole = CsButtonRole.Primary,
  modifier: Modifier = Modifier,
) {
  val pack = csModePack(dark, highContrast, compact)
  val ink = (if (role == CsButtonRole.Danger) pack.colorSemanticDangerText else pack.colorLink).toComposeColor()
  val focusId = remember { csOverlayFreshId("text-button") }
  val requester = remember { FocusRequester() }
  DisposableEffect(focusId) { onDispose { CsFocusRegistry.disconnect(focusId) } }
  TextButton(onClick = {
    CsFocusRegistry.claim(focusId) { requester.requestFocus() }
    onClick()
  }, enabled = csControlEnabled(), modifier = modifier.heightIn(min = pack.componentButtonMdMinHeight.toDp()).focusRequester(requester).onFocusChanged { if (it.isFocused) CsFocusRegistry.claim(focusId) { requester.requestFocus() } }) {
    Text(title, color = ink)
  }
}

const val csBadgeTracking = 0.04
const val csBadgeSolidInkHex = "#ffffff"
fun csBadgeGap() = 5.dp
fun csBadgeFontWeight() = 700
const val csBadgeLineHeight = 1.0
fun csBadgePaddingY() = 4.dp
fun csBadgePaddingX() = 9.dp
fun csBadgeBorderWidth() = 1.dp
fun csBadgeDotSize() = 7.dp
fun csBadgeIsUppercase() = true
fun csBadgeToneClass(name: String) = if (name == "neutral") null else name
fun csBadgeSpoken(label: String) = label

const val csFeedbackStyleTagCloseHoverUmberAlpha = 0.12f
const val csFeedbackStyleSpinnerLightTrackAlpha = 0.22f
const val csFeedbackStyleSpinnerDarkTrackAlpha = 0.26f
const val csFeedbackStyleSkeletonMidStopRaisedPortion = 0.55
fun csFeedbackStyleTagGap() = 6.dp
fun csFeedbackStyleTagFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csFeedbackStyleTagFontWeight() = 600
fun csFeedbackStyleTagPaddingY() = 5.dp
fun csFeedbackStyleTagPaddingX() = 10.dp
fun csFeedbackStyleTagBorderWidth() = 1.dp
fun csFeedbackStyleTagCloseSize() = 18.dp
fun csFeedbackStyleAlertGap() = 12.dp
fun csFeedbackStyleAlertPaddingY() = 14.dp
fun csFeedbackStyleAlertPaddingX() = 16.dp
fun csFeedbackStyleAlertBorderWidth() = 1.dp
fun csFeedbackStyleAlertAccentBorderWidth() = 4.dp
fun csFeedbackStyleAlertIconPaddingTop() = 1.dp
fun csFeedbackStyleAlertTitleFontWeight() = 700
fun csFeedbackStyleAlertTitleMarginBottom() = 2.dp
fun csFeedbackStyleAlertBodyFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csFeedbackStyleAlertDismissFontSize(pack: CSTokenModePack) = pack.fontSizeMd.toDp()
fun csFeedbackStyleAlertDismissPaddingX() = 2.dp
fun csFeedbackStyleAlertDismissFocusOutlineWidth(focused: Boolean) = if (focused) 2.dp else 0.dp
fun csFeedbackStyleAlertDismissFocusHaloSpread(focused: Boolean) = if (focused) 5.dp else 0.dp
fun csFeedbackStyleToastStackInset() = 20.dp
fun csFeedbackStyleToastStackGap() = 10.dp
fun csFeedbackStyleToastStackMaxWidth(viewportWidth: Double) = max(0.0, min(380.0, viewportWidth - 40.0))
fun csFeedbackStyleToastGap() = 12.dp
fun csFeedbackStyleToastPaddingY() = 12.dp
fun csFeedbackStyleToastPaddingX() = 14.dp
fun csFeedbackStyleToastBorderWidth() = 1.dp
fun csFeedbackStyleToastAccentBorderWidth() = 4.dp
fun csFeedbackStyleToastTitleFontWeight() = 700
fun csFeedbackStyleToastTitleFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csFeedbackStyleToastBodyFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csFeedbackStyleToastBodyMarginTop() = 2.dp
fun csFeedbackStyleToastEntranceTranslateY(reducedMotion: Boolean = false) = if (reducedMotion) 0.dp else 8.dp
fun csFeedbackStyleSpinnerSize() = 20.dp
fun csFeedbackStyleSpinnerBorderWidth() = 2.5.dp
fun csFeedbackStyleSpinnerTrackAlpha(dark: Boolean) =
  if (dark) csFeedbackStyleSpinnerDarkTrackAlpha else csFeedbackStyleSpinnerLightTrackAlpha
fun csFeedbackStyleSpinnerDurationMs() = 620.0
fun csFeedbackStyleProgressHeight() = 10.dp
fun csFeedbackStyleProgressDurationMs(pack: CSTokenModePack) = pack.durationSlow.value
fun csFeedbackStyleSkeletonDurationMs() = 1400.0
const val csFeedbackStyleSkeletonTextHeightEm = 0.75
const val csFeedbackStyleSkeletonTextMarginBlockEm = 0.25
const val csSwitchLabel = "Setting"
const val csSwitchDisabledOpacity = 0.55f
fun csSwitchGap() = 10.dp
fun csSwitchTrackWidth() = 44.dp
fun csSwitchTrackHeight() = 26.dp
fun csSwitchTrackRadius() = 999.dp
fun csSwitchKnobSize() = 20.dp
fun csSwitchKnobInset() = 3.dp
fun csSwitchKnobCheckedTranslateX() = 18.dp
fun csSwitchOpacity(disabled: Boolean) = if (disabled) csSwitchDisabledOpacity else 1f
fun csSwitchTrackColor(checked: Boolean, dark: Boolean, pack: CSTokenModePack) =
  if (checked) (if (dark) pack.colorBrandOchre else pack.colorBrandUmber) else pack.colorBorderDefault
fun csSwitchFocusOutlineWidth(focused: Boolean) = if (focused) 2.dp else 0.dp
fun csSwitchFocusHaloSpread(focused: Boolean) = if (focused) 5.dp else 0.dp
fun csSwitchShowsLabel(label: String?) = !label.isNullOrEmpty()
fun csSwitchName(label: String?, ariaLabel: String?, labelledBy: String?, fallback: String) = when {
  ariaLabel != null -> ariaLabel
  csSwitchShowsLabel(label) || csSwitchShowsLabel(labelledBy) -> null
  else -> fallback
}
fun csSwitchCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Cài đặt")
  val en = mapOf("label" to csSwitchLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csBadgeVariant(name: String) = if (name == "solid" || name == "ochre" || name == "success" || name == "danger" || name == "warning" || name == "info") name else "neutral"

@Composable
fun CsBadge(
  label: String,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  variant: String = "neutral",
  dot: Boolean = false,
) {
  val pack = csModePack(dark, highContrast, compact)
  val tone = csBadgeVariant(variant)
  val fill = when (tone) {
    "solid" -> pack.colorBrandUmber
    "ochre" -> pack.colorBrandOchre
    "success" -> pack.colorSemanticSuccess
    "danger" -> pack.colorSemanticDanger
    "warning" -> pack.colorSemanticWarning
    "info" -> pack.colorSemanticInfo
    else -> pack.colorSurfaceRaised
  }
  val solidWhite = CSColorValue(CSColorSpace.SRGB, listOf(1.0, 1.0, 1.0), 1.0)
  val ink = when (tone) {
    "solid" -> solidWhite
    "ochre" -> pack.colorBrandUmber
    "success" -> pack.colorSemanticSuccessFg
    "danger" -> pack.colorSemanticDangerFg
    "warning" -> pack.colorSemanticWarningFg
    "info" -> pack.colorSemanticInfoFg
    else -> pack.colorTextAccent
  }
  Row(modifier.background(fill.toComposeColor(), RoundedCornerShape(pack.radiusFull.toDp())).then(if (tone == "neutral") Modifier.border(csBadgeBorderWidth(), pack.colorBorderDefault.toComposeColor(), RoundedCornerShape(pack.radiusFull.toDp())) else Modifier).padding(horizontal = csBadgePaddingX(), vertical = csBadgePaddingY()), horizontalArrangement = Arrangement.spacedBy(csBadgeGap()), verticalAlignment = Alignment.CenterVertically) {
    if (dot) Box(Modifier.size(csBadgeDotSize()).background(ink.toComposeColor(), CircleShape))
    Text(label, color = ink.toComposeColor(), fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.semantics { contentDescription = label })
  }
}

fun csDividerThickness() = 1.dp
fun csDividerMargin(pack: CSTokenModePack) = pack.space4.toDp()
fun csDividerLabelGap() = 12.dp
fun csDividerLabelFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csDividerShowsLabel(kind: CsPresence, text: String = "") = csPresenceShown(kind, text)
fun csDividerText(kind: CsPresence, text: String = "") = when (kind) {
  CsPresence.Zero -> "0"
  CsPresence.Text -> text
  CsPresence.Absent -> ""
}
fun csDividerOrientation(vertical: Boolean) = if (vertical) "vertical" else "horizontal"

const val csDataStyleTooltipBubbleInkHex = "#ffffff"
const val csDataStyleScrollAreaThumbUmberAlpha = 0.35f
fun csDataStyleCardBorderWidth() = 1.dp
fun csDataStyleCardHasShadow(flat: Boolean = false) = !flat
fun csDataStyleCardBorderColor(interactive: Boolean = false, hovered: Boolean = false, pack: CSTokenModePack) =
  if (interactive && hovered) pack.colorBrandOchre else pack.colorBorderDefault
fun csDataStyleCardFocusHaloSpread(interactive: Boolean = false, focused: Boolean = false) =
  if (interactive && focused) 5.dp else 0.dp
fun csDataStyleCardActiveTranslateY(interactive: Boolean = false, active: Boolean = false, reducedMotion: Boolean = false) =
  if (interactive && active && !reducedMotion) 1.dp else 0.dp
fun csDataStyleCardHeaderPaddingTop() = 18.dp
fun csDataStyleCardHeaderPaddingX() = 20.dp
fun csDataStyleCardHeaderPaddingBottom() = 0.dp
fun csDataStyleCardTitleFontWeight() = 700
fun csDataStyleCardTitleLineHeight(pack: CSTokenModePack) = pack.fontLineHeightHeading
fun csDataStyleCardSubtitleMarginTop() = 4.dp
fun csDataStyleCardSubtitleFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csDataStyleCardBodyPaddingY() = 16.dp
fun csDataStyleCardBodyPaddingX() = 20.dp
fun csDataStyleCardFooterPaddingTop() = 12.dp
fun csDataStyleCardFooterPaddingX() = 20.dp
fun csDataStyleCardFooterPaddingBottom() = 18.dp
fun csDataStyleCardFooterGap() = 10.dp
fun csDataStyleStatGap() = 3.dp
fun csDataStyleStatLabelFontSize(pack: CSTokenModePack) = pack.fontSizeXs.toDp()
const val csDataStyleStatLabelLetterSpacingEm = 0.08
fun csDataStyleStatLabelUppercase() = true
fun csDataStyleStatValueFontSize(pack: CSTokenModePack) = pack.fontSize3xl.toDp()
fun csDataStyleStatValueFontWeight() = 800
const val csDataStyleStatValueLineHeight = 1.1
const val csDataStyleStatValueLetterSpacingEm = -0.01
fun csDataStyleStatDeltaGap() = 4.dp
fun csDataStyleStatDeltaFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csDataStyleStatDeltaFontWeight() = 700
fun csDataStyleStatDeltaColor(direction: String, pack: CSTokenModePack) = when (direction) {
  "up" -> pack.colorSemanticSuccessText
  "down" -> pack.colorSemanticDangerText
  else -> pack.colorTextMuted
}
fun csDataStyleAvatarFontWeight() = 700
fun csDataStyleAvatarSize(size: String = "md") = when (size) {
  "sm" -> 28.dp
  "lg" -> 56.dp
  else -> 40.dp
}
fun csDataStyleAvatarFontSize(size: String = "md", pack: CSTokenModePack) = when (size) {
  "sm" -> pack.fontSizeXs.toDp()
  "lg" -> pack.fontSizeLg.toDp()
  else -> pack.fontSizeSm.toDp()
}
fun csDataStyleAvatarRadius(square: Boolean = false, size: String = "md", pack: CSTokenModePack) =
  if (square) pack.radiusMd.toDp() else (csDataStyleAvatarSize(size).value / 2f).dp
fun csDataStyleAvatarGroupRingWidth() = 2.dp
fun csDataStyleAvatarGroupOverlapOffset() = (-10).dp
fun csDataStyleTooltipBubbleOffset() = 8.dp
fun csDataStyleTooltipClosedTranslateY() = 4.dp
fun csDataStyleTooltipOpenTranslateY() = 0.dp
fun csDataStyleTooltipFontSize(pack: CSTokenModePack) = pack.fontSizeXs.toDp()
fun csDataStyleTooltipFontWeight() = 600
const val csDataStyleTooltipLineHeight = 1.35
fun csDataStyleTooltipPaddingY() = 6.dp
fun csDataStyleTooltipPaddingX() = 10.dp
fun csDataStyleTooltipMaxWidth() = 240.dp
fun csDataStyleTooltipDepth(pack: CSTokenModePack) = pack.depthDropdown
fun csDataStyleTooltipArrowBorderWidth() = 5.dp
fun csDataStyleTooltipHoverBridgeSize() = 8.dp
fun csDataStyleTooltipArrowPointsToward(placement: String) = when {
  placement.startsWith("bottom") -> "top"
  placement.startsWith("left") -> "right"
  placement.startsWith("right") -> "left"
  else -> "bottom"
}
fun csDataStyleScrollAreaRadius(pack: CSTokenModePack) = pack.radiusMd.toDp()
fun csDataStyleScrollAreaScrollbarWidth() = "thin"
fun csDataStyleScrollAreaTabStop() = 0
fun csDataStyleScrollAreaMaxBlockSize(maxHeight: Double?): String? {
  if (maxHeight == null) return null
  val rounded = kotlin.math.round(maxHeight)
  return if (maxHeight == rounded) "${rounded.toLong()}px" else "${maxHeight}px"
}
fun csDataStyleScrollAreaFocusOutlineWidth(focused: Boolean) = if (focused) 2.dp else 0.dp
fun csDataStyleScrollAreaFocusOutlineOffset(focused: Boolean) = if (focused) (-2).dp else 0.dp
fun csDataStyleScrollAreaFocusHaloSpread(focused: Boolean) = if (focused) 5.dp else 0.dp
fun csDataStyleCardShowsSlot(value: String?) = !value.isNullOrEmpty()
fun csDataStyleAspectRatioRadius(pack: CSTokenModePack) = pack.radiusMd.toDp()
fun csDataStyleAspectRatioMediaObjectFit() = "cover"

const val csNavigationStylePaginationDisabledOpacity = 0.45f
const val csNavigationStyleMenuDangerHoverAlpha = 0.1f
fun csNavigationStyleTabsGap() = 4.dp
fun csNavigationStyleTabsBorderBottomWidth() = 1.dp
fun csNavigationStyleTabFontWeight() = 600
fun csNavigationStyleTabFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csNavigationStyleTabPaddingY() = 10.dp
fun csNavigationStyleTabPaddingX() = 14.dp
fun csNavigationStyleTabBorderBottomWidth() = 2.dp
fun csNavigationStyleTabGap() = 7.dp
fun csNavigationStyleTabTextColor(selected: Boolean = false, hovered: Boolean = false, dark: Boolean = false, pack: CSTokenModePack) =
  if (selected) (if (dark) pack.colorBrandOchre else pack.colorBrandUmber)
  else if (hovered) pack.colorTextPrimary else pack.colorTextMuted
fun csNavigationStyleTabBorderBottomColor(selected: Boolean = false, pack: CSTokenModePack) =
  if (selected) pack.colorBrandOchre else null
fun csNavigationStyleTabFocusOutlineWidth(focused: Boolean) = if (focused) 2.dp else 0.dp
fun csNavigationStyleTabFocusOutlineOffset(focused: Boolean) = if (focused) (-3).dp else 0.dp
fun csNavigationStyleTabFocusRadius(pack: CSTokenModePack) = pack.radiusSm.toDp()
fun csNavigationStyleTabFocusHaloSpread(focused: Boolean) = if (focused) 5.dp else 0.dp
fun csNavigationStyleTabCountFontSize(pack: CSTokenModePack) = pack.fontSizeXs.toDp()
fun csNavigationStyleTabCountPaddingY() = 1.dp
fun csNavigationStyleTabCountPaddingX() = 7.dp
fun csNavigationStyleBreadcrumbGap() = 8.dp
fun csNavigationStyleBreadcrumbItemGap() = 8.dp
fun csNavigationStyleBreadcrumbFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csNavigationStyleBreadcrumbLinkColor(hovered: Boolean = false, pack: CSTokenModePack) =
  if (hovered) pack.colorTextAccent else pack.colorTextMuted
fun csNavigationStyleBreadcrumbSeparatorColor(pack: CSTokenModePack) = pack.colorBorderDefault
fun csNavigationStyleBreadcrumbCurrentFontWeight() = 600
fun csNavigationStyleBreadcrumbCurrentColor(pack: CSTokenModePack) = pack.colorTextPrimary
fun csNavigationStylePaginationGap() = 4.dp
fun csNavigationStylePaginationButtonSize() = 38.dp
fun csNavigationStylePaginationButtonPaddingX() = 10.dp
fun csNavigationStylePaginationButtonBorderWidth() = 1.dp
fun csNavigationStylePaginationButtonFontWeight() = 600
fun csNavigationStylePaginationButtonFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csNavigationStylePaginationButtonBackground(current: Boolean = false, dark: Boolean = false, pack: CSTokenModePack) =
  if (current) (if (dark) pack.colorBrandOchre else pack.colorBrandUmber) else pack.colorSurfacePanel
fun csNavigationStylePaginationButtonForeground(current: Boolean = false, dark: Boolean = false, pack: CSTokenModePack) =
  if (current) (if (dark) pack.colorBrandUmber else pack.colorTextInverse) else pack.colorTextPrimary
fun csNavigationStylePaginationButtonBorderColor(current: Boolean = false, hovered: Boolean = false, disabled: Boolean = false, pack: CSTokenModePack) =
  if (current) null else if (hovered && !disabled) pack.colorBrandOchre else pack.colorBorderDefault
fun csNavigationStylePaginationButtonOpacity(disabled: Boolean = false) =
  if (disabled) csNavigationStylePaginationDisabledOpacity else 1f
fun csNavigationStylePaginationEllipsisPaddingX() = 4.dp
fun csNavigationStyleMenuListOffset() = 6.dp
fun csNavigationStyleMenuListMinWidth() = 200.dp
fun csNavigationStyleMenuListBorderWidth() = 1.dp
fun csNavigationStyleMenuListPadding() = 6.dp
fun csNavigationStyleMenuListDepth(pack: CSTokenModePack) = pack.depthDropdown
fun csNavigationStyleMenuListGap() = 2.dp
fun csNavigationStyleMenuItemGap() = 10.dp
fun csNavigationStyleMenuItemFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csNavigationStyleMenuItemPaddingY() = 8.dp
fun csNavigationStyleMenuItemPaddingX() = 10.dp
fun csNavigationStyleMenuItemFocusOutlineWidth(focused: Boolean) = if (focused) 2.dp else 0.dp
fun csNavigationStyleMenuItemFocusOutlineOffset(focused: Boolean) = if (focused) (-3).dp else 0.dp
fun csNavigationStyleMenuItemFocusHaloSpread(focused: Boolean) = if (focused) 5.dp else 0.dp
fun csNavigationStyleMenuSeparatorHeight() = 1.dp
fun csNavigationStyleMenuSeparatorMarginY() = 4.dp
fun csNavigationStyleMenuSeparatorMarginX() = 2.dp
fun csNavigationStyleMenuLabelFontSize(pack: CSTokenModePack) = pack.fontSizeXs.toDp()
const val csNavigationStyleMenuLabelLetterSpacingEm = 0.08
fun csNavigationStyleMenuLabelUppercase() = true
fun csNavigationStyleMenuLabelPaddingTop() = 6.dp
fun csNavigationStyleMenuLabelPaddingX() = 10.dp
fun csNavigationStyleMenuLabelPaddingBottom() = 2.dp

const val csAiStyleUserInkHex = "#ffffff"
const val csAiStyleSuggestHoverOchrePortion = 0.08
const val csAiStyleTypingIdleOpacity = 0.5f
const val csAiStyleTypingPeakOpacity = 1f
const val csAiStyleTypingReducedMotionOpacity = 0.7f
const val csAiStyleCitationBadgeInfoPortion = 0.14
const val csAiStyleLumiHighlightHex = "#ffd873"
const val csAiStyleLumiRingOchreAlpha = 0.34f
fun csAiStylePromptBorderWidth() = 1.dp
fun csAiStylePromptPaddingY() = 10.dp
fun csAiStylePromptPaddingX() = 12.dp
fun csAiStylePromptGap() = 8.dp
fun csAiStylePromptBorderColor(focusedWithin: Boolean = false, pack: CSTokenModePack) =
  if (focusedWithin) pack.colorTextPrimary else pack.colorBorderDefault
fun csAiStylePromptFocusOutlineWidth(focusedWithin: Boolean) = if (focusedWithin) 2.dp else 0.dp
fun csAiStylePromptFocusOutlineOffset(focusedWithin: Boolean) = if (focusedWithin) 2.dp else 0.dp
fun csAiStylePromptFocusHaloSpread(focusedWithin: Boolean) = if (focusedWithin) 5.dp else 0.dp
fun csAiStylePromptFieldMinHeight() = 44.dp
fun csAiStylePromptFieldLineHeight(pack: CSTokenModePack) = pack.fontLineHeightBody
fun csAiStylePromptBarGap() = 10.dp
fun csAiStylePromptHintGap() = 6.dp
fun csAiStylePromptHintFontSize(pack: CSTokenModePack) = pack.fontSizeXs.toDp()
fun csAiStyleChatGap() = 14.dp
fun csAiStyleChatMsgGap() = 10.dp
fun csAiStyleChatMsgReverse(role: String) = role == "user"
fun csAiStyleChatAvatarSize() = 32.dp
fun csAiStyleChatAvatarBackground(role: String, pack: CSTokenModePack) =
  if (role == "user") pack.colorBrandUmber else pack.colorBrandOchre
fun csAiStyleChatColGap() = 3.dp
const val csAiStyleChatColMaxWidthRatio = 0.8
fun csAiStyleChatNameFontSize(pack: CSTokenModePack) = pack.fontSizeXs.toDp()
fun csAiStyleChatNameFontWeight() = 700
fun csAiStyleChatBubblePaddingY() = 10.dp
fun csAiStyleChatBubblePaddingX() = 14.dp
fun csAiStyleChatBubbleRadius() = 14.dp
fun csAiStyleChatBubbleCornerCutRadius() = 4.dp
fun csAiStyleChatBubbleFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csAiStyleChatBubbleLineHeight(pack: CSTokenModePack) = pack.fontLineHeightBody
fun csAiStyleConfidenceGap() = 6.dp
fun csAiStyleConfidenceHeadFontSize(pack: CSTokenModePack) = pack.fontSizeXs.toDp()
const val csAiStyleConfidenceHeadLetterSpacingEm = 0.08
fun csAiStyleConfidenceHeadUppercase() = true
fun csAiStyleConfidenceLevelFontWeight() = 700
fun csAiStyleConfidenceLevelFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csAiStyleConfidenceTrackGap() = 3.dp
fun csAiStyleConfidenceSegmentHeight() = 8.dp
fun csAiStyleConfidenceSegmentRadius() = 2.dp
fun csAiStyleSuggestGap() = 8.dp
fun csAiStyleSuggestButtonBorderWidth() = 1.dp
fun csAiStyleSuggestButtonPaddingY() = 8.dp
fun csAiStyleSuggestButtonPaddingX() = 14.dp
fun csAiStyleSuggestButtonFontWeight() = 600
fun csAiStyleSuggestButtonFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csAiStyleSuggestButtonGap() = 7.dp
fun csAiStyleSuggestButtonBorderColor(hovered: Boolean = false, pack: CSTokenModePack) =
  if (hovered) pack.colorBrandOchre else pack.colorBorderDefault
fun csAiStyleTypingGap() = 5.dp
fun csAiStyleTypingPaddingY() = 12.dp
fun csAiStyleTypingPaddingX() = 16.dp
fun csAiStyleTypingBorderWidth() = 1.dp
fun csAiStyleTypingRadius() = 14.dp
fun csAiStyleTypingCornerCutRadius() = 4.dp
fun csAiStyleTypingDotSize() = 7.dp
fun csAiStyleTypingDurationMs() = 1200.0
fun csAiStyleTypingDotDelayMs(index: Int) = when (index) {
  1 -> 180.0
  2 -> 360.0
  else -> 0.0
}
fun csAiStyleTypingPeakTranslateY(reducedMotion: Boolean = false) = if (reducedMotion) 0.dp else (-4).dp
fun csAiStyleCitationsGap() = 8.dp
fun csAiStyleCitationsLabelFontSize(pack: CSTokenModePack) = pack.fontSizeXs.toDp()
const val csAiStyleCitationsLabelLetterSpacingEm = 0.08
fun csAiStyleCitationsLabelUppercase() = true
fun csAiStyleCitationGap() = 9.dp
fun csAiStyleCitationFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csAiStyleCitationBadgeSize() = 20.dp
fun csAiStyleCitationBadgeRadius() = 6.dp
fun csAiStyleCitationBadgeFontSize(pack: CSTokenModePack) = pack.fontSize2xs.toDp()
fun csAiStyleCitationBadgeFontWeight() = 700
const val csAiStyleCitationTextLineHeight = 1.4
fun csAiStyleCitationSourceFontSize(pack: CSTokenModePack) = pack.fontSizeXs.toDp()
fun csAiStyleLumiSize(size: String = "md") = when (size) {
  "sm" -> 32.dp
  "lg" -> 64.dp
  else -> 44.dp
}
fun csAiStyleLumiRingSpread(ring: Boolean = false) = if (ring) 3.dp else 0.dp
const val csAiStyleLumiDefaultAlt = "Lumi"
const val csAiStyleLumiGlyph = "✦"
fun csAiStyleLumiHasImage(src: String?) = !src.isNullOrEmpty()
fun csAiStyleLumiWrapperRole(src: String?, alt: String) = if (!csAiStyleLumiHasImage(src) && alt.isNotEmpty()) "img" else null
fun csAiStyleLumiWrapperLabel(src: String?, alt: String) = if (!csAiStyleLumiHasImage(src) && alt.isNotEmpty()) alt else null

const val csControlsWaveStyleStepperButtonDisabledOpacity = 0.45f
const val csControlsWaveStyleDropzoneHoverOchrePortion = 0.08
const val csControlsWaveStyleStatusPulseSuccessStartAlpha = 0.55f
const val csControlsWaveStyleTogglePressedDarkAccentPortion = 0.22
const val csControlsWaveStyleToggleDisabledOpacity = 0.5f
const val csControlsWaveStyleOtpDisabledOpacity = 0.5f
const val csControlsWaveStyleFabMainHoverBrightness = 1.05
const val csControlsWaveStyleResultSuccessMixPortion = 0.14
const val csControlsWaveStyleResultErrorMixPortion = 0.12
const val csControlsWaveStyleResultWarningMixPortion = 0.14
fun csControlsWaveStyleSearchGap(pack: CSTokenModePack) = pack.space2.toDp()
fun csControlsWaveStyleSearchPaddingX() = 14.dp
fun csControlsWaveStyleSearchMinHeight() = 44.dp
fun csControlsWaveStyleSearchClearPadding() = 2.dp
fun csControlsWaveStyleStepperButtonWidth() = 40.dp
fun csControlsWaveStyleStepperInputWidth() = 56.dp
fun csControlsWaveStyleStepperInputMinHeight() = 42.dp
fun csControlsWaveStyleSliderHeight() = 22.dp
fun csControlsWaveStyleSliderFocusOutlineOffset(focused: Boolean) = if (focused) 4.dp else 0.dp
fun csControlsWaveStyleDropzoneGap() = 6.dp
fun csControlsWaveStyleDropzoneBorderWidth() = 2.dp
fun csControlsWaveStyleDropzonePaddingY() = 28.dp
fun csControlsWaveStyleDropzonePaddingX() = 24.dp
fun csControlsWaveStyleSegmentedGap() = 4.dp
fun csControlsWaveStyleSegmentedPadding() = 3.dp
fun csControlsWaveStyleSegmentedButtonPaddingY() = 7.dp
fun csControlsWaveStyleSegmentedButtonPaddingX() = 15.dp
fun csControlsWaveStyleSegmentedButtonGap() = 6.dp
fun csControlsWaveStyleStatusGap() = 7.dp
fun csControlsWaveStyleStatusDotSize() = 9.dp
fun csControlsWaveStyleStatusDotColor(tone: String, pack: CSTokenModePack) = when (tone) {
  "online" -> pack.colorSemanticSuccess
  "busy" -> pack.colorBrandOchre
  "error" -> pack.colorSemanticDanger
  else -> pack.colorTextMuted
}
fun csControlsWaveStyleStatusPulseDurationMs() = 1800.0
fun csControlsWaveStyleStatusPulseMaxSpread() = 7.dp
fun csControlsWaveStyleKbdBorderBottomWidth() = 2.dp
fun csControlsWaveStyleKbdRadius() = 6.dp
fun csControlsWaveStyleKbdPaddingY() = 3.dp
fun csControlsWaveStyleKbdPaddingX() = 7.dp
fun csControlsWaveStyleToggleGap() = 8.dp
fun csControlsWaveStyleTogglePaddingY() = 8.dp
fun csControlsWaveStyleTogglePaddingX() = 14.dp
fun csControlsWaveStyleToggleMinHeight() = 40.dp
fun csControlsWaveStyleRatingGap() = 4.dp
fun csControlsWaveStyleRatingButtonPadding() = 2.dp
fun csControlsWaveStyleRatingFocusRadius() = 4.dp
fun csControlsWaveStyleOtpGap() = 8.dp
fun csControlsWaveStyleOtpCellWidth() = 44.dp
fun csControlsWaveStyleOtpCellHeight() = 52.dp
fun csControlsWaveStyleOtpFontSize() = 22.dp
fun csControlsWaveStyleButtonGroupOverlapOffset() = (-1).dp
fun csControlsWaveStyleComboboxMinWidth() = 260.dp
fun csControlsWaveStyleComboboxInputPaddingEnd() = 34.dp
fun csControlsWaveStyleComboboxCaretInsetEnd() = 10.dp
fun csControlsWaveStyleComboboxPopupOffset() = 6.dp
fun csControlsWaveStyleComboboxPopupMaxHeight() = 240.dp
fun csControlsWaveStyleInputGroupMinWidth() = 260.dp
fun csControlsWaveStyleInputGroupAddonPaddingX() = 10.dp
fun csControlsWaveStyleTagInputGap() = 6.dp
fun csControlsWaveStyleTagInputMinWidth() = 280.dp
fun csControlsWaveStyleTagInputFieldMinWidth() = 120.dp
fun csControlsWaveStyleTagInputDisabledFieldOpacity() = 1f
fun csControlsWaveStyleCalendarMinWidth() = 272.dp
fun csControlsWaveStyleCalendarHeaderButtonSize() = 30.dp
fun csControlsWaveStyleCalendarCellSize() = 34.dp
fun csControlsWaveStyleCalendarGridGap() = 2.dp
const val csControlsWaveStyleCalendarWeekdayFontSize = 10.5
fun csControlsWaveStyleCalendarDayFontSize() = 13.dp
fun csControlsWaveStyleDatePickerFieldMinWidth() = 220.dp
fun csControlsWaveStyleTimePickerGap() = 8.dp
fun csControlsWaveStyleTimePickerPaddingX() = 10.dp
fun csControlsWaveStyleHoverCardOffset() = 8.dp
fun csControlsWaveStyleHoverCardMinWidth() = 240.dp
fun csControlsWaveStyleHoverCardPaddingY() = 14.dp
fun csControlsWaveStyleHoverCardPaddingX() = 16.dp
fun csControlsWaveStylePopconfirmOffset() = 8.dp
fun csControlsWaveStylePopconfirmMinWidth() = 240.dp
fun csControlsWaveStylePopconfirmPaddingY() = 12.dp
fun csControlsWaveStylePopconfirmPaddingX() = 14.dp
const val csControlsWaveStylePopconfirmTitleFontSize = 13.5
const val csControlsWaveStylePopconfirmTitleLineHeight = 1.45
fun csControlsWaveStylePopconfirmTitleMarginBottom() = 10.dp
fun csControlsWaveStylePopconfirmActionsGap() = 8.dp
fun csControlsWaveStyleFabInset() = 24.dp
fun csControlsWaveStyleFabDepth(pack: CSTokenModePack) = pack.depthOverlay
fun csControlsWaveStyleFabGap() = 10.dp
fun csControlsWaveStyleFabMainSize() = 56.dp
fun csControlsWaveStyleFabDialGap() = 8.dp
fun csControlsWaveStyleFabMiniSize() = 42.dp
fun csControlsWaveStyleResultGap() = 10.dp
fun csControlsWaveStyleResultPaddingY() = 44.dp
fun csControlsWaveStyleResultPaddingX() = 24.dp
fun csControlsWaveStyleResultIconSize() = 64.dp
fun csControlsWaveStyleResultTitleFontSize() = 22.dp
fun csControlsWaveStyleResultTitleFontWeight() = 800
const val csControlsWaveStyleResultTitleLineHeight = 1.3
const val csControlsWaveStyleResultBodyMaxCh = 46.0
const val csControlsWaveStyleResultBodyLineHeight = 1.55
fun csControlsWaveStyleResultActionsGap() = 10.dp
fun csControlsWaveStyleResultActionsMarginTop() = 6.dp
fun csControlsWaveStyleInlineEditGap() = 7.dp
fun csControlsWaveStyleInlineEditPaddingY() = 4.dp
fun csControlsWaveStyleInlineEditPaddingX() = 8.dp

const val csControlsBatchStyleLinkUnderlineOffsetEm = 0.15
const val csControlsBatchStyleImageLoadingMinAlpha = 0.55f
const val csControlsBatchStyleImageLoadingMaxAlpha = 0.9f
const val csControlsBatchStyleImageZoomBackdropAlpha = 0.82f
const val csControlsBatchStyleImageZoomCloseBgAlpha = 0.12f
const val csControlsBatchStyleFormPendingOpacity = 0.72f
const val csControlsBatchStyleFormSummaryDangerPortion = 0.08
const val csControlsBatchStyleTreeSelectedDarkAccentPortion = 0.18
const val csControlsBatchStyleTourScrimAlpha = 0.45f
const val csControlsBatchStyleDockPanelPortion = 0.82
const val csControlsBatchStyleSortableDraggingOpacity = 0.5f
const val csControlsBatchStyleSortableButtonDisabledOpacity = 0.4f
const val csControlsBatchStyleTerminalBorderHex = "#3a2a1c"
const val csControlsBatchStyleTerminalBarHex = "#2a1a0d"
const val csControlsBatchStyleTerminalDotHex = "#5b4331"
const val csControlsBatchStyleTerminalBgHex = "#1a1108"
const val csControlsBatchStyleTerminalFgHex = "#f5ead9"
const val csControlsBatchStyleTerminalMutedHex = "#e9d6c2"
fun csControlsBatchStyleAnchorMinWidth() = 180.dp
fun csControlsBatchStyleAnchorBorderWidth() = 2.dp
const val csControlsBatchStyleAnchorTitleFontSize = 10.5
fun csControlsBatchStyleAnchorItemPaddingY() = 5.dp
fun csControlsBatchStyleAnchorItemPaddingX() = 12.dp
fun csControlsBatchStyleImageLoadingMinWidth() = 120.dp
fun csControlsBatchStyleImageLoadingMinHeight() = 80.dp
fun csControlsBatchStyleImageShimmerDurationMs() = 1200.0
const val csControlsBatchStyleImageZoomMaxVwRatio = 0.88
const val csControlsBatchStyleImageZoomMaxVhRatio = 0.86
fun csControlsBatchStyleImageZoomCloseInset() = 18.dp
fun csControlsBatchStyleImageZoomCloseSize() = 40.dp
fun csControlsBatchStyleToolbarGap() = 4.dp
fun csControlsBatchStyleToolbarPadding() = 4.dp
fun csControlsBatchStyleToolbarButtonMinHeight() = 32.dp
fun csControlsBatchStyleToolbarSeparatorHeight() = 20.dp
fun csControlsBatchStyleMenubarGap() = 2.dp
fun csControlsBatchStyleMenubarPadding() = 3.dp
const val csControlsBatchStyleMenubarTopFontSize = 13.5
fun csControlsBatchStyleMenubarMenuOffset() = 5.dp
fun csControlsBatchStyleNavMenuPanelWidth() = 468.dp
fun csControlsBatchStyleNavMenuPanelColumns() = 2
fun csControlsBatchStyleNavMenuPanelOffset() = 8.dp
fun csControlsBatchStyleCarouselGap() = 10.dp
fun csControlsBatchStyleCarouselTrackDurationMs(pack: CSTokenModePack) = pack.durationBase.value
fun csControlsBatchStyleCarouselNavSize() = 36.dp
fun csControlsBatchStyleCarouselNavInset() = 10.dp
fun csControlsBatchStyleCarouselDotTargetSize() = 24.dp
fun csControlsBatchStyleCarouselDotMarkSize() = 9.dp
fun csControlsBatchStyleCommentGap() = 10.dp
fun csControlsBatchStyleCommentRepliesIndent() = 14.dp
fun csControlsBatchStyleCommentRepliesBorderWidth() = 2.dp
fun csControlsBatchStyleFormGap(pack: CSTokenModePack) = pack.space4.toDp()
fun csControlsBatchStyleFormFieldGap() = 6.dp
fun csControlsBatchStyleFormFieldLabelFontSize() = 13.dp
fun csControlsBatchStyleTreeRowGap() = 2.dp
fun csControlsBatchStyleTreeTwistWidth() = 20.dp
fun csControlsBatchStyleTreeTwistHeight() = 28.dp
fun csControlsBatchStyleBackTopInsetEnd() = 24.dp
fun csControlsBatchStyleBackTopInsetBottom() = 84.dp
fun csControlsBatchStyleBackTopSize() = 44.dp
fun csControlsBatchStyleTreeSelectMinWidth() = 240.dp
fun csControlsBatchStyleCascaderColumnMinWidth() = 150.dp
fun csControlsBatchStyleCascaderColumnMaxHeight() = 240.dp
fun csControlsBatchStyleTransferGap() = 10.dp
fun csControlsBatchStyleTransferListMaxHeight() = 200.dp
fun csControlsBatchStyleMentionsMaxWidth() = 420.dp
fun csControlsBatchStyleMentionsPopupInlineStart() = 10.dp
fun csControlsBatchStyleMentionsPopupBlockOffset() = (-6).dp
fun csControlsBatchStyleColorPickerSwatchSize() = 20.dp
fun csControlsBatchStyleColorPickerGridColumns() = 5
fun csControlsBatchStyleColorPickerCellSize() = 26.dp
fun csControlsBatchStyleColorPickerHexInputWidth() = 110.dp
fun csControlsBatchStyleTourHoleDepth(pack: CSTokenModePack) = pack.depthModal + 1.0
fun csControlsBatchStyleTourPopDepth(pack: CSTokenModePack) = pack.depthModal + 2.0
fun csControlsBatchStyleTourPopWidth() = 280.dp
fun csControlsBatchStyleQrCodePadding() = 10.dp
fun csControlsBatchStyleSplitterPanePadding() = 14.dp
fun csControlsBatchStyleSplitterBarWidth() = 8.dp
fun csControlsBatchStyleHotkeysCardMinWidth() = 300.dp
fun csControlsBatchStyleHotkeysRowGap() = 20.dp
fun csControlsBatchStyleDockGap() = 8.dp
fun csControlsBatchStyleDockRadius() = 18.dp
fun csControlsBatchStyleDockBlur() = 10.dp
fun csControlsBatchStyleDockItemSize() = 44.dp
fun csControlsBatchStyleDockItemRadius() = 12.dp
fun csControlsBatchStyleDockActiveDotSize() = 4.dp
fun csControlsBatchStyleDockActiveDotOffset() = (-6).dp
fun csControlsBatchStyleDataGridSelectionColumnWidth() = 36.dp
fun csControlsBatchStyleTreeTableCellGap() = 2.dp
fun csControlsBatchStyleSortableGap() = 6.dp
fun csControlsBatchStyleSortableMaxWidth() = 380.dp
fun csControlsBatchStyleChartMaxWidth() = 420.dp
fun csControlsBatchStyleChartLegendColumnGap() = 16.dp
fun csControlsBatchStyleEditorMaxWidth() = 460.dp
const val csControlsBatchStyleEditorAreaLineHeight = 1.6
fun csControlsBatchStyleTerminalMaxWidth() = 480.dp
fun csControlsBatchStyleTerminalDotSize() = 10.dp
fun csControlsBatchStyleTerminalBodyMinHeight() = 130.dp
const val csControlsBatchStyleTerminalBodyLineHeight = 1.7

@Composable
fun CsDivider(
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  labelKind: CsPresence = CsPresence.Absent,
  label: String = "",
  vertical: Boolean = false,
) {
  val pack = csModePack(dark, highContrast, compact)
  val ink = pack.colorBorderDefault.toComposeColor()
  val ruleThickness = csDividerThickness()
  val ruleMargin = csDividerMargin(pack)
  if (csDividerShowsLabel(labelKind, label)) {
    Row(modifier.fillMaxWidth().padding(vertical = ruleMargin).semantics { contentDescription = csDividerText(labelKind, label) }, verticalAlignment = Alignment.CenterVertically) {
      androidx.compose.foundation.layout.Box(Modifier.weight(1f).heightIn(min = ruleThickness, max = ruleThickness).background(ink))
      Text(csDividerText(labelKind, label), color = pack.colorTextMuted.toComposeColor(), fontSize = csDividerLabelFontSize(pack).value.sp, modifier = Modifier.padding(horizontal = csDividerLabelGap()))
      androidx.compose.foundation.layout.Box(Modifier.weight(1f).heightIn(min = ruleThickness, max = ruleThickness).background(ink))
    }
  } else if (vertical) {
    androidx.compose.foundation.layout.Box(modifier.width(ruleThickness).heightIn(min = ruleMargin).background(ink).semantics { contentDescription = csDividerOrientation(true) })
  } else {
    androidx.compose.foundation.layout.Box(modifier.fillMaxWidth().padding(vertical = ruleMargin).heightIn(min = ruleThickness, max = ruleThickness).background(ink).semantics { contentDescription = csDividerOrientation(false) })
  }
}

@Composable
fun CsListRow(
  title: String,
  subtitle: String,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
) {
  val pack = csModePack(dark, highContrast, compact)
  Row(
    modifier = modifier.fillMaxWidth().background(pack.colorSurfacePanel.toComposeColor()).padding(14.dp),
    verticalAlignment = Alignment.CenterVertically,
  ) {
    Column(modifier = Modifier.weight(1f)) {
      Text(title, color = pack.colorTextPrimary.toComposeColor(), fontSize = 15.sp)
      CsBadge(label = subtitle, dark = dark, highContrast = highContrast, compact = compact)
    }
    androidx.compose.foundation.layout.Spacer(
      modifier = Modifier.size(10.dp).clip(CircleShape).background(pack.colorBrandOchre.toComposeColor()),
    )
  }
}

fun csSelectControlPaddingInlineEnd() = 38.dp
fun csSelectChevronInsetInlineEnd() = 12.dp
fun csSelectFocusOutlineWidth(focused: Boolean) = if (focused) 2.dp else 0.dp
fun csSelectFocusOutlineOffset(focused: Boolean) = if (focused) 2.dp else 0.dp
fun csSelectFocusHaloSpread(focused: Boolean) = if (focused) 5.dp else 0.dp
fun csSelectNativeSelectMinHeight(size: String = "md") = if (size == "sm") 36.dp else 44.dp
fun csSelectNativeSelectPaddingY(size: String = "md", pack: CSTokenModePack) =
  if (size == "sm") 6.dp else pack.componentTextfieldPaddingY.toDp()
fun csSelectNativeSelectFontSize(size: String = "md", pack: CSTokenModePack) =
  (if (size == "sm") pack.fontSizeSm else pack.fontSizeBase).toDp()

const val csFormsStyleCheckRadioDisabledOpacity = 0.55f
fun csFormsStyleCheckRadioGap() = 10.dp
const val csFormsStyleCheckRadioLineHeight = 1.4
fun csFormsStyleCheckRadioBoxSize() = 20.dp
fun csFormsStyleCheckRadioOpacity(disabled: Boolean) = if (disabled) csFormsStyleCheckRadioDisabledOpacity else 1f
fun csFormsStyleCheckRadioAccentColor(dark: Boolean, pack: CSTokenModePack) =
  if (dark) pack.colorBrandOchre else pack.colorBrandUmber
fun csFormsStyleCheckRadioTextGap() = 2.dp
fun csFormsStyleCheckRadioDescriptionFontSize(pack: CSTokenModePack) = pack.fontSizeSm.toDp()
fun csFormsStyleRadioGroupGap() = 10.dp
fun csFormsStyleRadioGroupLegendFontWeight() = 700
fun csFormsStyleRadioGroupLegendMarginBottom() = 6.dp
fun csFormsStyleTextareaMinHeight() = 96.dp
fun csFormsStyleTextareaResize() = "vertical"
fun csFormsStyleTextareaLineHeight(pack: CSTokenModePack) = pack.fontLineHeightBody

fun csSelectCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("placeholder" to "Chọn…")
  val en = mapOf("placeholder" to "Select…")
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csSelectPlaceholder(text: String?, fallback: String) = text ?: fallback
fun csSelectShowsPrompt(placeholder: String?, hasContent: Boolean) = placeholder != null || !hasContent
fun csSelectShownText(value: String, placeholder: String?, fallback: String, hasContent: Boolean): String {
  if (value.isNotEmpty()) return value
  if (csSelectShowsPrompt(placeholder, hasContent)) return csSelectPlaceholder(placeholder, fallback)
  return value
}

fun csSelectAlert(error: String?) = !error.isNullOrEmpty()
fun csSelectLabelId(id: String, label: String?) = if (!label.isNullOrEmpty()) "$id-label" else null
fun csSelectDescId(id: String, description: String?) = if (!description.isNullOrEmpty()) "$id-desc" else null
fun csSelectErrId(id: String, error: String?) = if (csSelectAlert(error)) "$id-err" else null
fun csSelectLabelledBy(explicit: String?, hasAriaLabel: Boolean, labelId: String?) = csTextFieldLabelledBy(explicit, hasAriaLabel, labelId)
fun csSelectDescribedBy(explicit: String?, descId: String?, errId: String?) = csTextFieldDescribedBy(explicit, descId, errId)
@Composable
fun <T> CsSelect(
  label: String,
  options: List<T>,
  selected: T,
  labelFor: (T) -> String,
  onSelect: (T) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  description: String? = null,
  fieldError: String? = null,
  placeholder: String? = null,
  disabled: Boolean = false,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val prompt = csSelectCopy("placeholder", spoken)
  val shown = csSelectShownText(labelFor(selected), placeholder, prompt, options.isNotEmpty())
  val enabled = csControlEnabled(!disabled)
  val invalid = csSelectAlert(fieldError)
  var open by remember { mutableStateOf(false) }
  var focused by remember { mutableStateOf(false) }
  val shape = RoundedCornerShape(csTextFieldRadius(pack))
  Column(
    modifier.alpha(csTextFieldOpacity(disabled)).onPreviewKeyEvent { event ->
      if (event.type == KeyEventType.KeyDown && event.key == Key.Escape && open) { open = false; true } else false
    },
    verticalArrangement = Arrangement.spacedBy(csTextFieldGap()),
  ) {
    if (csPresenceShown(CsPresence.Text, label)) Text(label, color = pack.colorTextPrimary.toComposeColor(), fontWeight = FontWeight.Bold)
    if (description != null && csPresenceShown(CsPresence.Text, description)) Text(description, color = pack.colorTextMuted.toComposeColor(), fontSize = csTextFieldDescriptionFontSize())
    TextButton(
      onClick = { if (enabled) open = !open },
      enabled = enabled,
      modifier = Modifier
        .fillMaxWidth()
        .heightIn(min = csSelectNativeSelectMinHeight())
        .background(pack.colorSurfacePanel.toComposeColor(), shape)
        .border(csTextFieldBorderWidth(), csTextFieldBorderColor(invalid, pack).toComposeColor(), shape)
        .then(if (focused) Modifier.border(csSelectFocusOutlineWidth(true), pack.colorBrandOchre.toComposeColor(), shape) else Modifier)
        .padding(start = csTextFieldPaddingX(pack), end = csSelectControlPaddingInlineEnd(), top = csSelectNativeSelectPaddingY(pack = pack), bottom = csSelectNativeSelectPaddingY(pack = pack))
        .onFocusChanged { focused = it.isFocused },
    ) {
      Row(verticalAlignment = Alignment.CenterVertically) {
        Text(shown, color = pack.colorTextPrimary.toComposeColor(), fontSize = csSelectNativeSelectFontSize(pack = pack).value.sp, modifier = Modifier.weight(1f).semantics { contentDescription = label })
        CsIcon(name = "chevron-down", label = "", dark = dark, highContrast = highContrast, compact = compact, modifier = Modifier.padding(end = csSelectChevronInsetInlineEnd()).clearAndSetSemantics { })
      }
    }
    if (open && enabled) {
      options.forEach { option ->
        val handle = rememberFocusHandle("select-${labelFor(option)}")
        TextButton(onClick = {
          handle.claim()
          open = false
          onSelect(option)
        }, enabled = enabled, modifier = Modifier.fillMaxWidth().focusRequester(handle.requester).onFocusChanged { if (it.isFocused) handle.claim() }) {
          Text(labelFor(option), color = if (selected == option) pack.colorBrandOchre.toComposeColor() else pack.colorTextPrimary.toComposeColor())
        }
      }
    }
    if (invalid) Text(fieldError ?: "", color = pack.colorSemanticDangerText.toComposeColor(), fontSize = csTextFieldErrorFontSize(), modifier = Modifier.semantics { liveRegion = LiveRegionMode.Assertive })
  }
}

@Composable
fun CsCard(
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  spacing: Dp = 0.dp,
  padding: Dp = 0.dp,
  interactive: Boolean = false,
  flat: Boolean = false,
  material: CsGlassMaterial? = null,
  onClick: (() -> Unit)? = null,
  modifier: Modifier = Modifier,
  content: @Composable androidx.compose.foundation.layout.ColumnScope.() -> Unit,
) {
  val pack = csModePack(dark, highContrast, compact)
  val activeMaterial = material ?: CsGlassMaterial.Solid
  val baseColor = when (csGlassSurfaceBase(activeMaterial)) {
    CsGlassSurfaceBase.Page -> pack.colorSurfacePage.toComposeColor()
    CsGlassSurfaceBase.Panel -> pack.colorSurfacePanel.toComposeColor()
    CsGlassSurfaceBase.Raised -> pack.colorSurfaceRaised.toComposeColor()
  }
  val fillAlpha = csGlassOpacity(activeMaterial, pack).toFloat()
  val borderAlpha = csGlassBorderMix(activeMaterial).toFloat()
  val strokeWidth = csGlassBorderWidth(activeMaterial)
  val borderColor = csDataStyleCardBorderColor(interactive, false, pack).toComposeColor().copy(alpha = borderAlpha)
  val shape = RoundedCornerShape(pack.radiusLg.toDp())
  Column(
    modifier
      .fillMaxWidth()
      .clip(shape)
      .then(if (strokeWidth > 0.dp) Modifier.border(strokeWidth, borderColor, shape) else Modifier)
      .background(baseColor.copy(alpha = fillAlpha))
      .padding(padding),
    verticalArrangement = Arrangement.spacedBy(spacing),
    content = content,
  )
}

@Composable
fun CsSwitch(
  title: String,
  checked: Boolean,
  onCheckedChange: (Boolean) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  disabled: Boolean = false,
  ariaLabel: String? = null,
  labelledBy: String? = null,
  language: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val handle = rememberFocusHandle("switch")
  val enabled = csControlEnabled(!disabled)
  val spoken = csSwitchCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  val name = csSwitchName(title, ariaLabel, labelledBy, spoken)
  Row(
    modifier = modifier
      .fillMaxWidth()
      .heightIn(min = csA11yTouchTargetMinSize(true))
      .minimumInteractiveComponentSize()
      .alpha(csSwitchOpacity(disabled))
      .focusRequester(handle.requester)
      .onFocusChanged { if (it.isFocused && enabled) handle.claim() }
      .semantics { contentDescription = name ?: title }
      .toggleable(value = checked, enabled = enabled, role = Role.Switch, onValueChange = {
        if (!enabled) return@toggleable
        handle.claim()
        onCheckedChange(it)
      }),
    verticalAlignment = Alignment.CenterVertically,
  ) {
    if (csSwitchShowsLabel(title)) Text(title, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.weight(1f).clearAndSetSemantics { })
    Switch(
      checked = checked,
      onCheckedChange = null,
      enabled = enabled,
      colors = SwitchDefaults.colors(
        checkedTrackColor = csSwitchTrackColor(true, dark, pack).toComposeColor(),
        uncheckedTrackColor = csSwitchTrackColor(false, dark, pack).toComposeColor(),
      ),
    )
  }
}

const val csDialogClose = "Close"
const val csDialogMaxRem = 42.0
const val csDialogAlertMaxRem = 28.0
const val csDialogOverlayRed = 31
const val csDialogOverlayGreen = 19
const val csDialogOverlayBlue = 11
const val csDialogOverlayAlpha = 0.42f
const val csDialogPanelZIndex = 2
fun csDialogMaxWidth(root: Double = 16.0) = csDialogMaxRem * root
fun csDialogAlertMaxWidth(root: Double = 16.0) = csDialogAlertMaxRem * root
fun csDialogTopOffsetRatio(narrow: Boolean = false) = if (narrow) 0.04 else 0.12
fun csDialogSafeTop(viewportHeight: Double, narrow: Boolean = false, safeInsetTop: Double = 0.0) =
  max(viewportHeight * csDialogTopOffsetRatio(narrow), safeInsetTop)
fun csDialogMaxInlineSize(viewportWidth: Double, alert: Boolean = false, safeInsetLeft: Double = 0.0, safeInsetRight: Double = 0.0): Double {
  val narrow = viewportWidth <= 640.0
  val margin = if (narrow) 16.0 else 32.0
  val available = max(0.0, viewportWidth - margin - safeInsetLeft - safeInsetRight)
  if (narrow && !alert) return available
  return min(if (alert) csDialogAlertMaxWidth() else csDialogMaxWidth(), available)
}
fun csDialogMaxBlockSize(viewportHeight: Double, narrow: Boolean = false, safeInsetTop: Double = 0.0, safeInsetBottom: Double = 0.0): Double {
  val top = csDialogSafeTop(viewportHeight, narrow, safeInsetTop)
  return max(0.0, min(0.8 * viewportHeight, min(viewportHeight - 64.0, viewportHeight - top - safeInsetBottom - 16.0)))
}
fun csDialogPadding(pack: CSTokenModePack, narrow: Boolean = false) = (if (narrow) pack.space4 else pack.space6).toDp()
fun csDialogHeaderGap() = 12.dp
fun csDialogTitleFontSize() = 20.sp
fun csDialogTitleLineHeight() = 1.35
fun csDialogBodyMarginY() = 16.dp
fun csDialogActionsButtonsExpand(narrow: Boolean) = narrow
fun csDialogDestructiveTitleColor(destructive: Boolean, pack: CSTokenModePack) =
  if (destructive) pack.colorSemanticDangerText else pack.colorTextPrimary
fun csDialogCloseText(label: String?, fallback: String) = label ?: fallback
fun csDialogCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("close" to "Đóng", "confirm" to "Xác nhận", "cancel" to "Hủy")
  val en = mapOf("close" to csDialogClose, "confirm" to "Confirm", "cancel" to "Cancel")
  val ja = mapOf("close" to "閉じる", "confirm" to "確認", "cancel" to "キャンセル")
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
fun csDialogShowsClose(hasOpenChange: Boolean, hasClose: Boolean) = hasOpenChange || hasClose
fun csDialogShowsActions(actions: String?) = actions != null && actions.isNotEmpty()
fun csDialogDescribedBy(explicit: String?, hasExplicit: Boolean, hasBody: Boolean, bodyId: String) = if (hasExplicit) explicit?.takeIf { it.isNotEmpty() } else if (hasBody) bodyId else null
fun csDialogNotify(hasOpenChange: Boolean, hasClose: Boolean): List<String> {
  val events = mutableListOf<String>()
  if (hasOpenChange) events += "open-false"
  if (hasClose) events += "close"
  return events
}

const val csTableStyleCellBorderAlpha = 0.18f
fun csTableStyleStatusPaddingY(pack: CSTokenModePack) = pack.space4.toDp()
fun csTableStyleCellBorderWidth() = 1.dp
fun csTableStyleCellPaddingY() = 10.dp
fun csTableStyleCellPaddingX() = 12.dp
fun csTableStyleHeaderFontSize(pack: CSTokenModePack) = pack.fontSizeXs.toDp()
const val csTableStyleHeaderLetterSpacingEm = 0.08
fun csTableStyleHeaderUppercase() = true
fun csTableStyleCaptionFontWeight() = 700
fun csTableStyleCaptionMarginBottom() = 8.dp

const val csDisclosureStylePanelBorderAlpha = 0.18f
fun csDisclosureStyleBadgeRadius() = 999.dp
fun csDisclosureStyleBadgeFontSize() = 14.sp
fun csDisclosureStyleBadgeFontWeight() = 700
fun csDisclosureStyleBadgePaddingY() = 4.dp
fun csDisclosureStyleBadgePaddingX() = 10.dp
fun csDisclosureStylePanelBorderWidth() = 1.dp
fun csDisclosureStylePanelGap() = 6.dp
fun csDisclosureStylePanelTopOffset() = 6.dp
fun csDisclosureStylePanelMinWidth() = 288.dp
fun csDisclosureStylePanelPadding() = 12.dp
fun csDisclosureStylePanelDepth(pack: CSTokenModePack) = pack.depthDropdown
fun csDisclosureStyleSourcesFontSize() = 13.sp

const val csReviewGateStyleWarningMixPortion = 0.05
fun csReviewGateStyleBorderWidth() = 1.dp
fun csReviewGateStyleGap() = 12.dp
fun csReviewGateStylePadding(pack: CSTokenModePack) = pack.space4.toDp()
fun csReviewGateStyleRiskFontWeight() = 700
const val csReviewGateStyleRiskLetterSpacingEm = 0.04
fun csReviewGateStyleRiskFontSize() = 13.sp
fun csReviewGateStyleRiskUppercase() = true
fun csReviewGateStyleReviewerFontSize() = 14.sp

const val csLogoStyleDefaultTitle = "CyberSkill"
const val csLogoStyleViewBox = "0 0 1007 1007"
fun csLogoStyleDefaultSize() = 32.dp
fun csLogoStyleAutoBlockSize() = true
fun csLogoStyleVerticalAlign() = "middle"
fun csLogoStyleEscapeTitle(title: String) = title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
fun csLogoStyleTitleTag(title: String, decorative: Boolean) = if (decorative) "" else "<title>${csLogoStyleEscapeTitle(title)}</title>"
fun csLogoStyleRole(decorative: Boolean) = if (decorative) null else "img"
fun csLogoStyleAriaHidden(decorative: Boolean) = if (decorative) true else null
fun csLogoStyleAriaLabel(title: String, decorative: Boolean) = if (decorative) null else title

@Composable
fun CsDialog(
  title: String,
  message: String,
  confirmTitle: String,
  onConfirm: () -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  open: Boolean = true,
  onOpenChange: ((Boolean) -> Unit)? = null,
  onClose: (() -> Unit)? = null,
  closeLabel: String? = null,
  language: String? = null,
) {
  if (!open) return
  val pack = csModePack(dark, highContrast, compact)
  val canClose = csDialogShowsClose(onOpenChange != null, onClose != null)
  val closeName = csDialogCloseText(closeLabel, csDialogCopy("close", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  val layerId = remember { csOverlayFreshId("dialog") }
  val restoreId = remember { CsFocusRegistry.activeId }
  DisposableEffect(layerId) {
    CsOverlayRegistry.push(layerId)
    onDispose {
      val stack = CsOverlayRegistry.resolved(layerId, listOf(CsOverlayLayer(layerId, "modal", true)))
      csReturnFocus(restoreId, null, layerId, stack)
      CsOverlayRegistry.remove(layerId)
    }
  }
  val stops = (if (canClose) 1 else 0) + (if (csDialogShowsActions(confirmTitle)) 1 else 0)
  val confirmFocus = remember { FocusRequester() }
  var trap by remember { mutableIntStateOf(0) }
  LaunchedEffect(stops) {
    if (stops > 0) confirmFocus.requestFocus()
  }
  Column(
    modifier.onPreviewKeyEvent { event ->
      if (event.type == KeyEventType.KeyDown && event.key == Key.Escape && canClose) {
        onOpenChange?.invoke(false)
        onClose?.invoke()
        return@onPreviewKeyEvent true
      }
      if (event.type != KeyEventType.KeyDown || event.key != Key.Tab) return@onPreviewKeyEvent false
      val stack = CsOverlayRegistry.resolved(layerId, listOf(CsOverlayLayer(layerId, "modal", true)))
      if (!csOverlayOwns(layerId, stack)) return@onPreviewKeyEvent false
      val next = csFocusNext(trap, stops, event.isShiftPressed, trap >= 0) ?: return@onPreviewKeyEvent false
      trap = next
      true
    }.background(pack.colorSurfacePanel.toComposeColor()).padding(csDialogPadding(pack)),
    verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(csDialogHeaderGap()),
  ) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(csDialogHeaderGap())) {
      Text(title, color = pack.colorTextPrimary.toComposeColor(), fontSize = csDialogTitleFontSize(), fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
      if (canClose) TextButton(onClick = { onOpenChange?.invoke(false); onClose?.invoke() }, modifier = Modifier.semantics { contentDescription = closeName }) {
        CsIcon(name = "close", label = "", dark = dark, highContrast = highContrast, compact = compact, modifier = Modifier.clearAndSetSemantics { })
      }
    }
    if (message.isNotEmpty()) Text(message, color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.padding(vertical = csDialogBodyMarginY()))
    if (stops > 0) CsButton(title = confirmTitle, onClick = onConfirm, dark = dark, highContrast = highContrast, compact = compact, modifier = Modifier.focusRequester(confirmFocus))
  }
}

const val csResetTextSizeAdjustPercent = 100.0
fun csResetScrollPaddingBlockStart(pack: CSTokenModePack) = pack.scrollPaddingBlockStart.toDp()
fun csResetScrollPaddingBlockEnd(pack: CSTokenModePack) = pack.scrollPaddingBlockEnd.toDp()
fun csResetBodyMargin() = 0.dp
fun csResetBodyFontSize(pack: CSTokenModePack) = pack.fontSizeBase.toDp()
fun csResetBodyLineHeight(pack: CSTokenModePack) = pack.fontLineHeightBody
fun csResetHeadingLineHeight(pack: CSTokenModePack) = pack.fontLineHeightHeading
fun csResetHeadingTextWrap() = "balance"
fun csResetParagraphTextWrap() = "pretty"
fun csResetFocusOutlineWidth() = 2.dp
fun csResetFocusOutlineOffset() = 2.dp
fun csResetFocusHaloSpread() = 5.dp
fun csResetFocusDropShadowRadius() = 2.dp
fun csResetSkipUnfocusedLeft() = (-999).dp
fun csResetSkipUnfocusedSize() = 1.dp
fun csResetSkipFontWeight() = 700
fun csResetSkipFocusedOffset() = 12.dp
fun csResetSkipFocusedDepth(pack: CSTokenModePack) = (pack.depthToast + 1.0).toFloat()
fun csResetSkipFocusedPaddingY() = 10.dp
fun csResetSkipFocusedPaddingX() = 14.dp
fun csResetSkipFocusedBorderWidth() = 2.dp
fun csResetSkipFocusedHaloSpread() = 5.dp

@Composable
fun CsSkipLink(
  label: String,
  onClick: () -> Unit,
  dark: Boolean = false,
  highContrast: Boolean = false,
  compact: Boolean = false,
  modifier: Modifier = Modifier,
) {
  val pack = csModePack(dark, highContrast, compact)
  val handle = rememberFocusHandle("skip-link")
  var focused by remember { mutableStateOf(false) }
  val shape = RoundedCornerShape(pack.radiusMd.toDp())
  TextButton(
    onClick = { handle.claim(); onClick() },
    enabled = csControlEnabled(),
    modifier = modifier
      .then(if (focused) Modifier.zIndex(csResetSkipFocusedDepth(pack)) else Modifier.size(csResetSkipUnfocusedSize()))
      .background(pack.colorSurfacePanel.toComposeColor(), shape)
      .border(csResetSkipFocusedBorderWidth(), pack.colorBrandOchre.toComposeColor(), shape)
      .focusRequester(handle.requester)
      .onFocusChanged {
        focused = it.isFocused
        if (it.isFocused) handle.claim()
      },
    contentPadding = androidx.compose.foundation.layout.PaddingValues(
      horizontal = csResetSkipFocusedPaddingX(),
      vertical = csResetSkipFocusedPaddingY(),
    ),
  ) {
    Text(
      label,
      color = pack.colorTextPrimary.toComposeColor(),
      fontSize = csResetBodyFontSize(pack).value.sp,
      fontWeight = FontWeight.Bold,
    )
  }
}

enum class CsTypographyRole(val className: String) {
  Display("cs-display"),
  H1("cs-h1"),
  H2("cs-h2"),
  H3("cs-h3"),
  H4("cs-h4"),
  BodyLg("cs-body-lg"),
  Body("cs-body"),
  Secondary("cs-secondary"),
  Caption("cs-caption"),
  Eyebrow("cs-eyebrow"),
  Mono("cs-mono"),
}

const val csTypographyLetterSpacingTight = -0.01
const val csTypographyLetterSpacingNormal = 0.0
const val csTypographyLetterSpacingCaps = 0.08
const val csTypographyHeadingTracking = -0.01
const val csTypographyDisplayFaceMaxWeight = 700.0

fun csTypographyFontFamily(role: CsTypographyRole, pack: CSTokenModePack, displayFace: Boolean = false): List<String> = when (role) {
  CsTypographyRole.Mono -> pack.fontFamilyMono
  CsTypographyRole.Display, CsTypographyRole.H1, CsTypographyRole.H2, CsTypographyRole.H3, CsTypographyRole.H4 ->
    if (displayFace) pack.fontFamilyDisplay else pack.headingFamily
  CsTypographyRole.BodyLg, CsTypographyRole.Body, CsTypographyRole.Secondary, CsTypographyRole.Caption, CsTypographyRole.Eyebrow ->
    pack.fontFamilyUi
}

fun csTypographyFontSize(role: CsTypographyRole, pack: CSTokenModePack): Dp = when (role) {
  CsTypographyRole.Display -> pack.textDisplay.toDp()
  CsTypographyRole.H1 -> pack.textH1.toDp()
  CsTypographyRole.H2 -> pack.textH2.toDp()
  CsTypographyRole.H3 -> pack.textH3.toDp()
  CsTypographyRole.H4 -> pack.textH4.toDp()
  CsTypographyRole.BodyLg -> pack.textBodyLg.toDp()
  CsTypographyRole.Body, CsTypographyRole.Mono -> pack.textBody.toDp()
  CsTypographyRole.Secondary -> pack.textSecondary.toDp()
  CsTypographyRole.Caption -> pack.textCaption.toDp()
  CsTypographyRole.Eyebrow -> pack.textEyebrow.toDp()
}

fun csTypographyLineHeight(role: CsTypographyRole, pack: CSTokenModePack): Double = when (role) {
  CsTypographyRole.Display -> pack.fontLineHeightTight
  CsTypographyRole.H1, CsTypographyRole.H2, CsTypographyRole.H3, CsTypographyRole.H4 -> pack.fontLineHeightHeading
  CsTypographyRole.BodyLg, CsTypographyRole.Body, CsTypographyRole.Secondary, CsTypographyRole.Caption, CsTypographyRole.Eyebrow, CsTypographyRole.Mono ->
    pack.fontLineHeightBody
}

fun csTypographyFontWeight(role: CsTypographyRole, pack: CSTokenModePack, displayFace: Boolean = false): Double = when (role) {
  CsTypographyRole.Display, CsTypographyRole.H1 ->
    if (displayFace) min(csTypographyDisplayFaceMaxWeight, pack.headingWeightStrong) else pack.headingWeightStrong
  CsTypographyRole.H2, CsTypographyRole.H3 -> pack.headingWeight
  CsTypographyRole.H4 -> pack.fontWeightSemibold
  CsTypographyRole.Eyebrow -> pack.fontWeightBold
  CsTypographyRole.BodyLg, CsTypographyRole.Body, CsTypographyRole.Secondary, CsTypographyRole.Caption, CsTypographyRole.Mono ->
    pack.fontWeightRegular
}

fun csTypographyLetterSpacingEm(role: CsTypographyRole): Double = when (role) {
  CsTypographyRole.Display, CsTypographyRole.H1, CsTypographyRole.H2 -> csTypographyHeadingTracking
  CsTypographyRole.Eyebrow -> csTypographyLetterSpacingCaps
  CsTypographyRole.H3, CsTypographyRole.H4, CsTypographyRole.BodyLg, CsTypographyRole.Body, CsTypographyRole.Secondary, CsTypographyRole.Caption, CsTypographyRole.Mono ->
    csTypographyLetterSpacingNormal
}

fun csTypographyTextWrap(role: CsTypographyRole): String = when (role) {
  CsTypographyRole.Display, CsTypographyRole.H1, CsTypographyRole.H2 -> "balance"
  CsTypographyRole.BodyLg, CsTypographyRole.Body -> "pretty"
  CsTypographyRole.H3, CsTypographyRole.H4, CsTypographyRole.Secondary, CsTypographyRole.Caption, CsTypographyRole.Eyebrow, CsTypographyRole.Mono -> "normal"
}

fun csTypographyIsUppercase(role: CsTypographyRole): Boolean = role == CsTypographyRole.Eyebrow

fun csTypographyTextColor(role: CsTypographyRole, pack: CSTokenModePack): CSColorValue = when (role) {
  CsTypographyRole.Secondary, CsTypographyRole.Caption -> pack.colorTextMuted
  CsTypographyRole.Eyebrow -> pack.colorTextAccent
  CsTypographyRole.Display, CsTypographyRole.H1, CsTypographyRole.H2, CsTypographyRole.H3, CsTypographyRole.H4, CsTypographyRole.BodyLg, CsTypographyRole.Body, CsTypographyRole.Mono ->
    pack.colorTextPrimary
}
