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
fun csTextFieldAlert(error: String?) = !error.isNullOrEmpty()
fun csTextFieldShowsDescription(description: String?) = !description.isNullOrEmpty()
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
      onValueChange = { next -> if (!csControlEnabled(!disabled)) return@OutlinedTextField; handle.claim(); onValueChange(next) },
      enabled = csControlEnabled(!disabled),
      label = { Text(label, fontWeight = FontWeight.Bold) },
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
fun csBadgeToneClass(name: String) = if (name == "neutral") null else name
fun csBadgeSpoken(label: String) = label
const val csSwitchLabel = "Setting"
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
  val ink = when (tone) {
    "solid" -> pack.colorTextInverse
    "ochre" -> pack.colorBrandUmber
    "success" -> pack.colorSemanticSuccessFg
    "danger" -> pack.colorSemanticDangerFg
    "warning" -> pack.colorSemanticWarningFg
    "info" -> pack.colorSemanticInfoFg
    else -> pack.colorTextAccent
  }
  Row(modifier.background(fill.toComposeColor(), RoundedCornerShape(pack.radiusFull.toDp())).then(if (tone == "neutral") Modifier.border(1.dp, pack.colorBorderDefault.toComposeColor(), RoundedCornerShape(pack.radiusFull.toDp())) else Modifier).padding(horizontal = 9.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
    if (dot) Box(Modifier.size(7.dp).background(ink.toComposeColor(), CircleShape))
    Text(label.uppercase(), color = ink.toComposeColor(), fontSize = 12.sp, modifier = Modifier.semantics { contentDescription = label })
  }
}

fun csDividerShowsLabel(kind: CsPresence, text: String = "") = csPresenceShown(kind, text)
fun csDividerText(kind: CsPresence, text: String = "") = when (kind) {
  CsPresence.Zero -> "0"
  CsPresence.Text -> text
  CsPresence.Absent -> ""
}
fun csDividerOrientation(vertical: Boolean) = if (vertical) "vertical" else "horizontal"

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
  if (csDividerShowsLabel(labelKind, label)) {
    Row(modifier.fillMaxWidth().semantics { contentDescription = csDividerText(labelKind, label) }, verticalAlignment = Alignment.CenterVertically) {
      androidx.compose.foundation.layout.Box(Modifier.weight(1f).heightIn(min = 1.dp, max = 1.dp).background(ink))
      Text(csDividerText(labelKind, label), color = pack.colorTextMuted.toComposeColor(), modifier = Modifier.padding(horizontal = 12.dp))
      androidx.compose.foundation.layout.Box(Modifier.weight(1f).heightIn(min = 1.dp, max = 1.dp).background(ink))
    }
  } else if (vertical) {
    androidx.compose.foundation.layout.Box(modifier.width(1.dp).heightIn(min = 16.dp).background(ink).semantics { contentDescription = csDividerOrientation(true) })
  } else {
    androidx.compose.foundation.layout.Box(modifier.fillMaxWidth().heightIn(min = 1.dp, max = 1.dp).background(ink).semantics { contentDescription = csDividerOrientation(false) })
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
  var open by remember { mutableStateOf(false) }
  Column(modifier.onPreviewKeyEvent { event ->
    if (event.type == KeyEventType.KeyDown && event.key == Key.Escape && open) { open = false; true } else false
  }) {
    if (csPresenceShown(CsPresence.Text, label)) Text(label, color = pack.colorTextPrimary.toComposeColor())
    if (description != null && csPresenceShown(CsPresence.Text, description)) Text(description, color = pack.colorTextMuted.toComposeColor())
    TextButton(onClick = { if (enabled) open = !open }, enabled = enabled, modifier = Modifier.fillMaxWidth()) {
      Row(verticalAlignment = Alignment.CenterVertically) {
        Text(shown, color = pack.colorTextPrimary.toComposeColor(), modifier = Modifier.weight(1f).semantics { contentDescription = label })
        CsIcon(name = "chevron-down", label = "", dark = dark, highContrast = highContrast, compact = compact, modifier = Modifier.clearAndSetSemantics { })
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
    if (csSelectAlert(fieldError)) Text(fieldError ?: "", color = pack.colorSemanticDangerText.toComposeColor(), modifier = Modifier.semantics { liveRegion = LiveRegionMode.Assertive })
  }
}

@Composable
fun CsCard(
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  spacing: Dp = 0.dp,
  padding: Dp = 0.dp,
  material: CsGlassMaterial? = null,
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
  val shape = RoundedCornerShape(pack.radiusLg.toDp())
  Column(
    modifier
      .fillMaxWidth()
      .clip(shape)
      .then(if (strokeWidth > 0.dp) Modifier.border(strokeWidth, pack.colorBorderDefault.toComposeColor().copy(alpha = borderAlpha), shape) else Modifier)
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
      colors = SwitchDefaults.colors(checkedTrackColor = pack.colorBrandOchre.toComposeColor()),
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

fun csLogoStyleAutoBlockSize() = true
fun csLogoStyleVerticalAlign() = "middle"

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
  onOpenChange: ((Boolean) -> Unit)? = null,
  onClose: (() -> Unit)? = null,
  closeLabel: String? = null,
  language: String? = null,
) {
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
      if (event.type != KeyEventType.KeyDown || event.key != Key.Tab) return@onPreviewKeyEvent false
      val stack = CsOverlayRegistry.resolved(layerId, listOf(CsOverlayLayer(layerId, "modal", true)))
      if (!csOverlayOwns(layerId, stack)) return@onPreviewKeyEvent false
      val next = csFocusNext(trap, stops, event.isShiftPressed, trap >= 0) ?: return@onPreviewKeyEvent false
      trap = next
      true
    }.background(pack.colorSurfacePanel.toComposeColor()).padding(24.dp),
    verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(12.dp),
  ) {
    Row(verticalAlignment = Alignment.CenterVertically) {
      Text(title, color = pack.colorTextPrimary.toComposeColor(), fontSize = 20.sp, modifier = Modifier.weight(1f))
      if (canClose) TextButton(onClick = { onOpenChange?.invoke(false); onClose?.invoke() }, modifier = Modifier.semantics { contentDescription = closeName }) {
        CsIcon(name = "close", label = "", dark = dark, highContrast = highContrast, compact = compact, modifier = Modifier.clearAndSetSemantics { })
      }
    }
    if (message.isNotEmpty()) Text(message, color = pack.colorTextMuted.toComposeColor())
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
