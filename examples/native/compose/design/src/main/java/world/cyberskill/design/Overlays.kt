package world.cyberskill.design

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.boundsInWindow
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp

enum class CsRovingKey { Right, Left, Up, Down, Home, End }

const val csFabMain = 56.0
fun csFabEscapeClose() = false
fun csFabIsStatic(position: String?) = position == "static"
fun csFabRootClass(position: String?) = if (csFabIsStatic(position)) "cs-fab cs-fab--static" else "cs-fab"
fun csFabDialClass(position: String?) = if (csFabIsStatic(position)) "cs-fab__dial cs-fab__dial--static" else "cs-fab__dial"
fun csFabMainGlyph(icon: String?, label: String) = icon ?: label
fun csFabSelectAction(index: Int, count: Int): Int? = if (index in 0 until count) index else null
fun csFabExpanded(actionCount: Int, open: Boolean): Boolean? = if (actionCount > 0) open else null
fun csFabNextOpen(actionCount: Int, open: Boolean) = if (actionCount > 0) !open else null
fun csFabPlacement(explicit: String?) = explicit ?: "top-end"
const val csFabGap = 10.0
data class CsFabPlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csFabShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String): CsFabPlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement, csFabGap) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, csFabGap) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsFabPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}
const val csBackTopLabel = "Back to top"
const val csBackTopArrow = "M12 19V5M5 12l7-7 7 7"
const val csBackTopIconSize = 18.0
const val csBackTopStrokeWidth = 2.0
fun csBackTopScrollTopTarget() = 0.0
fun csBackTopLabelText(label: String?, fallback: String) = label ?: fallback
fun csBackTopCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Về đầu trang")
  val en = mapOf("label" to csBackTopLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csBackTopBehavior(reducedMotion: Boolean) = if (reducedMotion) "instant" else "smooth"
fun csNonnegative(value: Int, count: Int): Int {
  val remainder = value % count
  return if (remainder >= 0) remainder else remainder + count
}

const val csMenuLabel = "Menu"
fun csMenuEscapeClose() = false
fun csMenuTabClose() = false
fun csMenuIsSeparator(item: String) = item == "-"
fun csMenuActionable(items: List<String>) = items.filter { !csMenuIsSeparator(it) }
fun csMenuPlacement(explicit: String?, align: String) = explicit ?: if (align == "end") "bottom-end" else "bottom-start"
const val csMenuGap = 6.0
data class CsMenuPlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csMenuShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String): CsMenuPlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement, csMenuGap) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, csMenuGap) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsMenuPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}
fun csMenuCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("menu" to "Trình đơn")
  val en = mapOf("menu" to csMenuLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csMenuIndex(current: Int, count: Int, key: CsRovingKey): Int? {
  if (count <= 0) return null
  return when (key) {
    CsRovingKey.Down -> csNonnegative(current + 1, count)
    CsRovingKey.Up -> csNonnegative(current - 1 + count, count)
    CsRovingKey.Home -> 0
    CsRovingKey.End -> count - 1
    else -> null
  }
}

fun csMenuNeedle(previous: String, character: String, elapsedMs: Int): String {
  val letter = character.lowercase()
  val text = if (elapsedMs < 500) previous.lowercase() + letter else letter
  return if (text.all { it.toString() == letter }) letter else text
}

fun csMenuTypeahead(labels: List<String>, from: Int, needle: String): Int? {
  if (labels.isEmpty() || needle.isEmpty()) return null
  val lowered = needle.lowercase()
  for (step in labels.indices) {
    val index = csNonnegative(from + 1 + step, labels.size)
    if (labels[index].trim().lowercase().startsWith(lowered)) return index
  }
  return null
}

data class CsMenubarState(val top: Int, val open: Int?, val item: Int)

const val csMenubarLabel = "Application menu"
const val csMenubarGap = 5
fun csMenubarLabel(ariaLabel: String?, hasLabelledBy: Boolean, fallback: String) = if (ariaLabel != null) ariaLabel else if (hasLabelledBy) null else fallback
fun csMenubarCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf("label" to "Trình đơn ứng dụng")
  val en = mapOf("label" to csMenubarLabel)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csMenubarPlacement(explicit: String?) = explicit ?: "bottom-start"
data class CsMenubarPlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csMenubarShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String): CsMenubarPlace? {
  val space = csMenubarGap.toDouble()
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement, space) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, space) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsMenubarPlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}
fun csMenubarClick(open: Int?, index: Int) = if (open == index) null else index
fun csMenubarHover(open: Int?, index: Int) = if (open == null) null else if (open == index) open else index
fun csMenubarActionable(items: List<String>) = items.filter { it != "-" }
fun csMenubarTabStop(index: Int, focus: Int) = if (index == focus) 0 else -1
fun csMenubarTabClose(top: Int) = CsMenubarState(top, null, 0)
fun csMenubarEscapeClose(top: Int) = CsMenubarState(top, null, 0)
fun csMenubarBar(top: Int, open: Int?, menuCount: Int, itemCount: Int, key: CsRovingKey): CsMenubarState? {
  if (menuCount <= 0) return null
  if (key == CsRovingKey.Down || key == CsRovingKey.Up) {
    val item = if (key == CsRovingKey.Up) maxOf(0, itemCount - 1) else 0
    return CsMenubarState(top, top, item)
  }
  val next = when (key) {
    CsRovingKey.Right -> csNonnegative(top + 1, menuCount)
    CsRovingKey.Left -> csNonnegative(top - 1 + menuCount, menuCount)
    CsRovingKey.Home -> 0
    CsRovingKey.End -> menuCount - 1
    else -> return null
  }
  return CsMenubarState(next, if (open == null) null else next, 0)
}

fun csMenubarItem(menu: Int, item: Int, menuCount: Int, itemCount: Int, key: CsRovingKey): CsMenubarState? {
  if (menuCount <= 0) return null
  if (key == CsRovingKey.Right || key == CsRovingKey.Left) {
    val next = csNonnegative(menu + if (key == CsRovingKey.Right) 1 else -1 + menuCount, menuCount)
    return CsMenubarState(next, next, 0)
  }
  val moved = csMenuIndex(item, itemCount, key) ?: return null
  return CsMenubarState(menu, menu, moved)
}

fun csBackTopVisible(offset: Double, threshold: Double = 320.0): Boolean = offset > threshold

const val csAspectDefaultRatio = "16 / 9"
fun csAspectNormalizedRatio(ratio: String) = ratio.trim()
fun csAspectHeightFromNumber(ratio: Double, width: Double): Double? = if (ratio > 0.0) width / ratio else null
fun csAspectHeight(ratio: String, width: Double): Double? {
  val parts = ratio.split("/").map { it.trim() }
  if (parts.size == 2) {
    val across = parts[0].toDoubleOrNull()
    val down = parts[1].toDoubleOrNull()
    if (across != null && down != null && across > 0) return width * down / across
  }
  val number = ratio.trim().toDoubleOrNull()
  if (number != null && number > 0) return width / number
  return null
}

private fun rovingKey(key: Key): CsRovingKey? = when (key) {
  Key.DirectionRight -> CsRovingKey.Right
  Key.DirectionLeft -> CsRovingKey.Left
  Key.DirectionUp -> CsRovingKey.Up
  Key.DirectionDown -> CsRovingKey.Down
  Key.MoveHome -> CsRovingKey.Home
  Key.MoveEnd -> CsRovingKey.End
  else -> null
}

@Composable
fun CsMenu(
  label: String,
  items: List<String>,
  open: Boolean,
  onOpenChange: (Boolean) -> Unit,
  onSelect: (String) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  language: String? = null,
  align: String = "start",
  placement: String? = null,
  portal: Boolean = true,
  dangerItems: Set<String> = emptySet(),
) {
  val pack = csModePack(dark, highContrast, compact)
  val menuName = csMenuCopy("menu", csComboboxResolvedLanguage(language, LocalCsLanguage.current))
  val placeName = csMenuPlacement(placement, align)
  var focus by remember { mutableIntStateOf(-1) }
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
    if (first == null || second == null) null else csMenuShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second, placeName)
  }
  if (!open && natural != null) { natural = null; fitted = null }
  Column(modifier.onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
    if (open && event.key == Key.Escape) {
      onOpenChange(csMenuEscapeClose())
      return@onPreviewKeyEvent true
    }
    if (open && event.key == Key.Tab) {
      onOpenChange(csMenuTabClose())
      return@onPreviewKeyEvent false
    }
    val key = rovingKey(event.key) ?: return@onPreviewKeyEvent false
    val enabled = csMenuActionable(items)
    if (!open && (key == CsRovingKey.Down || key == CsRovingKey.Up)) {
      onOpenChange(true)
      focus = if (key == CsRovingKey.Up) maxOf(0, enabled.lastIndex) else 0
      return@onPreviewKeyEvent true
    }
    val next = csMenuIndex(focus, enabled.size, key) ?: return@onPreviewKeyEvent false
    focus = next
    true
  }) {
    CsTriggerButton(title = label, onClick = { onOpenChange(!open); focus = if (!open) 0 else -1 }, modifier = Modifier.fillMaxWidth().minimumInteractiveComponentSize().onGloballyPositioned {
      val bounds = it.boundsInWindow()
      field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
    }) {
      Text(label, color = pack.colorTextPrimary.toComposeColor())
    }
    if (open) {
      val menuShape = RoundedCornerShape(pack.radiusMd.toDp())
      Column(
        Modifier.onGloballyPositioned {
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
        }
          .offset(x = with(density) { (place?.x ?: 0.0).toFloat().toDp() }, y = with(density) { (place?.y ?: 0.0).toFloat().toDp() })
          .widthIn(min = csNavigationStyleMenuListMinWidth(), max = with(density) { (place?.maxWidth ?: viewWidth).toFloat().toDp() })
          .background(pack.colorSurfacePanel.toComposeColor(), menuShape)
          .border(csNavigationStyleMenuListBorderWidth(), pack.colorBorderDefault.toComposeColor(), menuShape)
          .padding(csNavigationStyleMenuListPadding())
          .semantics { contentDescription = menuName },
        verticalArrangement = Arrangement.spacedBy(csNavigationStyleMenuListGap()),
      ) {
        items.forEachIndexed { index, item ->
          if (csMenuIsSeparator(item)) {
            Box(Modifier.fillMaxWidth().padding(horizontal = csNavigationStyleMenuSeparatorMarginX(), vertical = csNavigationStyleMenuSeparatorMarginY()).height(csNavigationStyleMenuSeparatorHeight()).background(pack.colorBorderDefault.toComposeColor()))
          } else {
            val actionIndex = csMenuActionable(items.take(index + 1)).size - 1
            CsTriggerButton(title = item, onClick = { focus = actionIndex; onOpenChange(false); onSelect(item) }, modifier = Modifier.fillMaxWidth().minimumInteractiveComponentSize().padding(horizontal = csNavigationStyleMenuItemPaddingX(), vertical = csNavigationStyleMenuItemPaddingY())) {
              Text(item, color = if (focus == actionIndex) pack.colorBrandOchre.toComposeColor() else if (dangerItems.contains(item)) pack.colorSemanticDangerFg.toComposeColor() else pack.colorTextPrimary.toComposeColor(), fontSize = csNavigationStyleMenuItemFontSize(pack).value.sp)
            }
          }
        }
      }
    }
  }
}

data class CsMenubarMenu(val label: String, val items: List<String>, val dangerItems: Set<String> = emptySet())

@Composable
fun CsMenubar(
  menus: List<CsMenubarMenu>,
  onSelect: (String) -> Unit,
  dark: Boolean,
  highContrast: Boolean,
  compact: Boolean,
  modifier: Modifier = Modifier,
  label: String? = null,
  hasLabelledBy: Boolean = false,
  language: String? = null,
  placement: String? = null,
  portal: Boolean = true,
) {
  val pack = csModePack(dark, highContrast, compact)
  val barName = csMenubarLabel(label, hasLabelledBy, csMenubarCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  var state by remember { mutableStateOf(CsMenubarState(0, null, 0)) }
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
    if (first == null || second == null) null else csMenubarShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second, csMenubarPlacement(placement))
  }
  if (state.open == null && natural != null) { natural = null; fitted = null }
  Column(modifier.then(barName?.let { name -> Modifier.semantics { contentDescription = name } } ?: Modifier).onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
    if (state.open != null && event.key == Key.Escape) {
      state = csMenubarEscapeClose(state.top)
      return@onPreviewKeyEvent true
    }
    if (state.open != null && event.key == Key.Tab) {
      state = csMenubarTabClose(state.top)
      return@onPreviewKeyEvent true
    }
    val key = rovingKey(event.key) ?: return@onPreviewKeyEvent false
    if (state.open == null) {
      val count = csMenubarActionable(menus.getOrNull(state.top)?.items.orEmpty()).size
      val next = csMenubarBar(state.top, state.open, menus.size, count, key) ?: return@onPreviewKeyEvent false
      state = next
      return@onPreviewKeyEvent true
    }
    val menu = state.open ?: state.top
    val count = csMenubarActionable(menus.getOrNull(menu)?.items.orEmpty()).size
    val next = csMenubarItem(menu, state.item, menus.size, count, key) ?: return@onPreviewKeyEvent false
    state = next
    true
  }) {
    androidx.compose.foundation.layout.Row(
      modifier = Modifier.padding(csControlsBatchStyleMenubarPadding()),
      horizontalArrangement = Arrangement.spacedBy(csControlsBatchStyleMenubarGap()),
    ) {
      menus.forEachIndexed { index, menu ->
        CsTriggerButton(title = menu.label, onClick = {
          state = CsMenubarState(index, if (state.open == index) null else index, 0)
        }, modifier = Modifier.minimumInteractiveComponentSize().onGloballyPositioned {
          if (state.open == index) {
            val bounds = it.boundsInWindow()
            field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
          }
        }) {
          Text(menu.label, color = if (state.top == index) pack.colorBrandOchre.toComposeColor() else pack.colorTextPrimary.toComposeColor(), fontSize = csControlsBatchStyleMenubarTopFontSize.sp, fontWeight = FontWeight.SemiBold)
        }
      }
    }
    val open = state.open
    if (open != null && menus.indices.contains(open)) {
      val menuShape = RoundedCornerShape(pack.radiusMd.toDp())
      Column(
        Modifier.onGloballyPositioned {
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
        }
          .offset(x = with(density) { (place?.x ?: 0.0).toFloat().toDp() }, y = with(density) { (place?.y ?: 0.0).toFloat().toDp() })
          .widthIn(min = csNavigationStyleMenuListMinWidth())
          .background(pack.colorSurfacePanel.toComposeColor(), menuShape)
          .border(csNavigationStyleMenuListBorderWidth(), pack.colorBorderDefault.toComposeColor(), menuShape)
          .padding(csNavigationStyleMenuListPadding())
          .alpha(if (place == null) 0f else 1f),
        verticalArrangement = Arrangement.spacedBy(csNavigationStyleMenuListGap()),
      ) {
        menus[open].items.forEachIndexed { index, item ->
          if (item == "-") {
            Box(Modifier.fillMaxWidth().padding(horizontal = csNavigationStyleMenuSeparatorMarginX(), vertical = csNavigationStyleMenuSeparatorMarginY()).height(csNavigationStyleMenuSeparatorHeight()).background(pack.colorBorderDefault.toComposeColor()))
          } else {
            val actionIndex = csMenubarActionable(menus[open].items.take(index + 1)).size - 1
            CsTriggerButton(title = item, onClick = { onSelect(item); state = state.copy(open = null) }, modifier = Modifier.fillMaxWidth().minimumInteractiveComponentSize().padding(horizontal = csNavigationStyleMenuItemPaddingX(), vertical = csNavigationStyleMenuItemPaddingY())) {
              Text(item, color = if (state.item == actionIndex) pack.colorBrandOchre.toComposeColor() else if (menus[open].dangerItems.contains(item)) pack.colorSemanticDangerFg.toComposeColor() else pack.colorTextPrimary.toComposeColor(), fontSize = csNavigationStyleMenuItemFontSize(pack).value.sp)
            }
          }
        }
      }
    }
  }
}

@Composable
fun CsBackTop(offset: Double, onPress: () -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, threshold: Double = 320.0, label: String? = null, language: String? = null) {
  val pack = csModePack(dark, highContrast, compact)
  val name = csBackTopLabelText(label, csBackTopCopy("label", csComboboxResolvedLanguage(language, LocalCsLanguage.current)))
  if (csBackTopVisible(offset, threshold)) {
    val circleShape = androidx.compose.foundation.shape.CircleShape
    CsTriggerButton(title = name, onClick = onPress, modifier = modifier.size(csControlsBatchStyleBackTopSize()).minimumInteractiveComponentSize().background(pack.colorSurfacePanel.toComposeColor(), circleShape).border(1.dp, pack.colorBorderDefault.toComposeColor(), circleShape).semantics { contentDescription = name }) {
      CsIcon(name = "arrow-up", label = "", dark = dark, highContrast = highContrast, compact = compact, size = "sm")
    }
  }
}

@Composable
fun CsFab(label: String, actions: List<String>, onPress: () -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, icon: String? = null, position: String = "fixed", placement: String? = null, portal: Boolean = true, onSelectAction: ((Int) -> Unit)? = null) {
  val pack = csModePack(dark, highContrast, compact)
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
    if (first == null || second == null) null else csFabShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second, csFabPlacement(placement))
  }
  if (!open && natural != null) { natural = null; fitted = null }
  Column(modifier.onPreviewKeyEvent { event ->
    if (open && event.type == KeyEventType.KeyDown && event.key == Key.Escape) {
      open = csFabEscapeClose()
      true
    } else false
  }) {
    if (open && actions.isNotEmpty()) Column(
      Modifier.onGloballyPositioned {
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
      }.offset(x = with(density) { (place?.x ?: 0.0).toFloat().toDp() }, y = with(density) { (place?.y ?: 0.0).toFloat().toDp() }).alpha(if (place == null) 0f else 1f),
      verticalArrangement = Arrangement.spacedBy(csControlsWaveStyleFabDialGap()),
    ) {
      actions.forEachIndexed { index, action ->
        CsTriggerButton(title = action, onClick = {
          open = false
          csFabSelectAction(index, actions.size)?.let { onSelectAction?.invoke(it) }
        }, modifier = Modifier.size(csControlsWaveStyleFabMiniSize()).minimumInteractiveComponentSize()) { Text(action) }
      }
    }
    CsTriggerButton(title = csFabMainGlyph(icon, label), onClick = { if (actions.isEmpty()) onPress() else open = !open }, modifier = Modifier.size(csControlsWaveStyleFabMainSize()).minimumInteractiveComponentSize().onGloballyPositioned {
      val bounds = it.boundsInWindow()
      field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
    }.background(pack.colorBrandUmber.toComposeColor()).semantics {
      contentDescription = label
      csFabExpanded(actions.size, open)?.let { stateDescription = if (it) "true" else "false" }
    }) {
      Text(csFabMainGlyph(icon, label), color = pack.colorSemanticInfoFg.toComposeColor())
    }
  }
}

@Composable
fun CsFloatingActionButton(label: String, actions: List<String> = emptyList(), onPress: () -> Unit = {}, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, icon: String? = null, position: String = "fixed", placement: String? = null, portal: Boolean = true, onSelectAction: ((Int) -> Unit)? = null) {
  CsFab(label = label, actions = actions, onPress = onPress, dark = dark, highContrast = highContrast, compact = compact, modifier = modifier, icon = icon, position = position, placement = placement, portal = portal, onSelectAction = onSelectAction)
}

const val csDisclosureLabel = "AI assisted"
const val csDisclosureDetails = "This content was generated or transformed with AI assistance."
const val csDisclosureSources = "Sources"
const val csDisclosurePlacement = "bottom-start"
const val csDisclosurePanelRole = "status"
fun csDisclosureEscapeClose() = false
fun csDisclosureLabelText(label: String?, fallback: String) = label ?: fallback
fun csDisclosureCopy(key: String, language: String?): String {
  val want = csComboboxPrimaryLanguage(language) ?: "vi"
  val vi = mapOf(
    "label" to "Có AI hỗ trợ",
    "details" to "Nội dung này được tạo hoặc chuyển đổi với sự hỗ trợ của AI.",
    "sources" to "Nguồn",
  )
  val en = mapOf("label" to csDisclosureLabel, "details" to csDisclosureDetails, "sources" to csDisclosureSources)
  for (locale in linkedSetOf(want, "en", "vi")) {
    val table = if (locale == "vi") vi else if (locale == "en") en else emptyMap()
    table[key]?.let { return it }
  }
  return key
}
fun csDisclosurePlacementText(placement: String?, fallback: String) = placement ?: fallback
fun csDisclosureSourceLine(sources: List<String?>, prefix: String): String? {
  val kept = sources.mapNotNull { if (it.isNullOrEmpty()) null else it }
  return if (kept.isEmpty()) null else "$prefix: ${kept.joinToString(", ")}"
}
fun csDisclosureControls(open: Boolean, id: String) = if (open) id else null
const val csDisclosureGap = 8.0
data class CsDisclosurePlace(val x: Double, val y: Double, val maxWidth: Double, val maxHeight: Double, val placement: String)
fun csDisclosureShift(anchor: CsFloatingRect, naturalWidth: Double, naturalHeight: Double, fittedWidth: Double, fittedHeight: Double, viewport: CsFloatingRect, originX: Double, originY: Double, scaleX: Double, scaleY: Double, placement: String): CsDisclosurePlace? {
  val initial = csFloatingPlace(anchor, naturalWidth, naturalHeight, viewport, placement, csDisclosureGap) ?: return null
  val placed = csFloatingPlace(anchor, fittedWidth, fittedHeight, viewport, initial.placement, csDisclosureGap) ?: return null
  val sx = if (scaleX == 0.0) 1.0 else scaleX
  val sy = if (scaleY == 0.0) 1.0 else scaleY
  return CsDisclosurePlace((placed.left - originX) / sx, (placed.top - originY) / sy, initial.maxWidth, initial.maxHeight, placed.placement)
}
@Composable
fun CsAIDisclosure(sources: List<String> = emptyList(), expandedLabel: String = "true", collapsedLabel: String = "false", open: Boolean, onOpenChange: (Boolean) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, details: String? = null, language: String? = null, placement: String? = null, portal: Boolean = true) {
  val pack = csModePack(dark, highContrast, compact)
  val spoken = csComboboxResolvedLanguage(language, LocalCsLanguage.current)
  val badge = csDisclosureLabelText(label, csDisclosureCopy("label", spoken))
  val explanation = details ?: csDisclosureCopy("details", spoken)
  val line = csDisclosureSourceLine(sources, csDisclosureCopy("sources", spoken))
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
    if (first == null || second == null) null else csDisclosureShift(box, first.first, first.second, second.first, second.second, viewport, origin.first, origin.second, panelScale.first, panelScale.second, csDisclosurePlacementText(placement, csDisclosurePlacement))
  }
  if (!open && natural != null) { natural = null; fitted = null }
  Column(modifier.onPreviewKeyEvent { event ->
    if (open && event.type == KeyEventType.KeyDown && event.key == Key.Escape) {
      onOpenChange(csDisclosureEscapeClose())
      true
    } else false
  }, verticalArrangement = Arrangement.spacedBy(csDisclosureStylePanelTopOffset())) {
    CsTriggerButton(title = badge, onClick = { onOpenChange(!open) }, modifier = Modifier.minimumInteractiveComponentSize().background(pack.colorSurfaceRaised.toComposeColor(), RoundedCornerShape(csDisclosureStyleBadgeRadius())).padding(horizontal = csDisclosureStyleBadgePaddingX(), vertical = csDisclosureStyleBadgePaddingY()).onGloballyPositioned {
      val bounds = it.boundsInWindow()
      field = CsFloatingRect(bounds.left.toDouble(), bounds.top.toDouble(), bounds.right.toDouble(), bounds.bottom.toDouble(), bounds.width.toDouble(), bounds.height.toDouble())
    }.semantics { contentDescription = badge; stateDescription = if (open) expandedLabel else collapsedLabel }) {
      Text(badge, color = pack.colorTextPrimary.toComposeColor(), fontSize = csDisclosureStyleBadgeFontSize(), fontWeight = FontWeight.Bold, modifier = Modifier.clearAndSetSemantics {})
    }
    if (open) {
      val panelShape = RoundedCornerShape(pack.radiusMd.toDp())
      Column(
        Modifier.onGloballyPositioned {
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
        }
          .offset(x = with(density) { (place?.x ?: 0.0).toFloat().toDp() }, y = with(density) { (place?.y ?: 0.0).toFloat().toDp() })
          .widthIn(min = csDisclosureStylePanelMinWidth())
          .background(pack.colorSurfacePanel.toComposeColor(), panelShape)
          .border(csDisclosureStylePanelBorderWidth(), pack.colorBorderDefault.toComposeColor().copy(alpha = csDisclosureStylePanelBorderAlpha), panelShape)
          .padding(csDisclosureStylePanelPadding())
          .alpha(if (place == null) 0f else 1f)
          .semantics { liveRegion = LiveRegionMode.Polite },
        verticalArrangement = Arrangement.spacedBy(csDisclosureStylePanelGap()),
      ) {
        Text(explanation, color = pack.colorTextPrimary.toComposeColor())
        if (line != null) Text(line, color = pack.colorTextMuted.toComposeColor(), fontSize = csDisclosureStyleSourcesFontSize())
      }
    }
  }
}

@Composable
fun CsAIDisclosureBadge(sources: List<String> = emptyList(), expandedLabel: String = "true", collapsedLabel: String = "false", open: Boolean, onOpenChange: (Boolean) -> Unit, dark: Boolean, highContrast: Boolean, compact: Boolean, modifier: Modifier = Modifier, label: String? = null, details: String? = null, language: String? = null, placement: String? = null, portal: Boolean = true) {
  CsAIDisclosure(sources = sources, expandedLabel = expandedLabel, collapsedLabel = collapsedLabel, open = open, onOpenChange = onOpenChange, dark = dark, highContrast = highContrast, compact = compact, modifier = modifier, label = label, details = details, language = language, placement = placement, portal = portal)
}

@Composable
fun CsAspectRatio(ratio: String = "16 / 9", width: Int, modifier: Modifier = Modifier, dark: Boolean = false, highContrast: Boolean = false, compact: Boolean = false, content: @Composable () -> Unit) {
  val pack = csModePack(dark, highContrast, compact)
  val height = csAspectHeight(ratio, width.toDouble()) ?: width.toDouble()
  Column(modifier.width(width.dp).height(height.dp).clip(RoundedCornerShape(csDataStyleAspectRatioRadius(pack)))) { content() }
}

const val csWatermarkFontSize = 14.0
const val csWatermarkFontWeight = 700
fun csWatermarkEscape(text: String) = text.replace("&", "&amp;").replace("<", "&lt;")
fun csWatermarkSvgMarkup(text: String = "CyberSkill", opacity: Double = 0.09, gap: Int = 140, rotate: Int = -22): String {
  val half = gap / 2
  return "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"$gap\" height=\"$gap\"><text x=\"50%\" y=\"50%\" font-family=\"Be Vietnam Pro, sans-serif\" font-size=\"14\" font-weight=\"700\" fill=\"black\" fill-opacity=\"$opacity\" text-anchor=\"middle\" transform=\"rotate($rotate $half $half)\">${csWatermarkEscape(text)}</text></svg>"
}
fun csWatermarkCenters(width: Float, height: Float, gap: Float): List<Offset> {
  if (gap <= 0f || width <= 0f || height <= 0f) return emptyList()
  val points = mutableListOf<Offset>()
  var y = gap / 2
  while (y < height) {
    var x = gap / 2
    while (x < width) {
      points.add(Offset(x, y))
      x += gap
    }
    y += gap
  }
  return points
}

@Composable
fun CsWatermark(text: String = "CyberSkill", modifier: Modifier = Modifier, opacity: Float = 0.09f, gap: Int = 140, rotate: Float = -22f, dark: Boolean = false, highContrast: Boolean = false, compact: Boolean = false, content: @Composable () -> Unit) {
  val measurer = androidx.compose.ui.text.rememberTextMeasurer()
  val ink = csModePack(dark, highContrast, compact).colorTextPrimary.toComposeColor().copy(alpha = opacity)
  androidx.compose.foundation.layout.Box(modifier) {
    content()
    Canvas(Modifier.matchParentSize().clearAndSetSemantics { }) {
      val centers = csWatermarkCenters(size.width, size.height, gap.toFloat())
      centers.forEach { point ->
        rotate(rotate, point) {
          drawText(textMeasurer = measurer, text = text, topLeft = Offset(point.x, point.y), style = TextStyle(color = ink, fontSize = csWatermarkFontSize.sp, fontWeight = FontWeight.Bold))
        }
      }
    }
  }
}
