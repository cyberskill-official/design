package world.cyberskill.design

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
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

@Composable
fun CsButton(
  title: String,
  onClick: () -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  role: CsButtonRole = CsButtonRole.Primary,
  paddingX: Dp? = null,
  paddingY: Dp? = null,
  modifier: Modifier = Modifier,
) {
  val pack = csModePack(dark, highContrast, compact)
  val fill = (if (role == CsButtonRole.Primary) pack.componentButtonPrimaryBg else pack.colorSemanticDanger).toComposeColor()
  val ink = (if (role == CsButtonRole.Primary) pack.componentButtonPrimaryFg else pack.colorTextInverse).toComposeColor()
  val focusId = remember { csOverlayFreshId("button") }
  val requester = remember { FocusRequester() }
  DisposableEffect(focusId) { onDispose { CsFocusRegistry.disconnect(focusId) } }
  Button(
    onClick = {
      CsFocusRegistry.claim(focusId) { requester.requestFocus() }
      onClick()
    },
    enabled = csControlEnabled(),
    modifier = modifier.fillMaxWidth().heightIn(min = pack.componentButtonMdMinHeight.toDp()).focusRequester(requester).onFocusChanged { if (it.isFocused) CsFocusRegistry.claim(focusId) { requester.requestFocus() } },
    contentPadding = androidx.compose.foundation.layout.PaddingValues(
      horizontal = paddingX ?: pack.componentButtonMdPaddingX.toDp(),
      vertical = paddingY ?: pack.componentButtonMdPaddingY.toDp(),
    ),
    colors = ButtonDefaults.buttonColors(containerColor = fill, contentColor = ink),
    shape = RoundedCornerShape(pack.componentButtonRadius.toDp()),
  ) {
    Text(title)
  }
}

fun csTextFieldAlert(error: String?) = !error.isNullOrEmpty()
@Composable
fun CsTextField(
  label: String,
  value: String,
  onValueChange: (String) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  secure: Boolean = false,
  modifier: Modifier = Modifier,
  error: String? = null,
) {
  val pack = csModePack(dark, highContrast, compact)
  val handle = rememberFocusHandle("text-field")
  Column(modifier) {
    OutlinedTextField(
      value = value,
      onValueChange = { next -> if (!csControlEnabled()) return@OutlinedTextField; handle.claim(); onValueChange(next) },
      enabled = csControlEnabled(),
      label = { Text(label) },
      singleLine = true,
      visualTransformation = if (secure) PasswordVisualTransformation() else VisualTransformation.None,
      keyboardOptions = KeyboardOptions(keyboardType = if (secure) KeyboardType.Password else KeyboardType.Text),
      modifier = Modifier
        .fillMaxWidth()
        .heightIn(min = pack.componentTextfieldMinHeight.toDp())
        .border(1.dp, pack.componentTextfieldBorderDefault.toComposeColor(), RoundedCornerShape(pack.radiusSm.toDp()))
        .padding(horizontal = pack.componentTextfieldPaddingX.toDp(), vertical = pack.componentTextfieldPaddingY.toDp())
        .focusRequester(handle.requester)
        .onFocusChanged { if (it.isFocused) handle.claim() },
    )
    if (csTextFieldAlert(error)) Text(error ?: "", color = pack.colorSemanticDangerText.toComposeColor(), modifier = Modifier.semantics { liveRegion = LiveRegionMode.Assertive })
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
  modifier: Modifier = Modifier,
  content: @Composable androidx.compose.foundation.layout.ColumnScope.() -> Unit,
) {
  val pack = csModePack(dark, highContrast, compact)
  val shape = RoundedCornerShape(pack.radiusLg.toDp())
  Column(
    modifier
      .fillMaxWidth()
      .clip(shape)
      .border(1.dp, pack.colorBorderDefault.toComposeColor(), shape)
      .background(pack.colorSurfacePanel.toComposeColor())
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
fun csDialogMaxWidth(root: Double = 16.0) = csDialogMaxRem * root
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
