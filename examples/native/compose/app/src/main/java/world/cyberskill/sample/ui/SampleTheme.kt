package world.cyberskill.sample.ui

import android.app.UiModeManager
import android.os.Build
import androidx.compose.ui.platform.LocalContext
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import world.cyberskill.sample.R
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import world.cyberskill.sample.tokens.CSTokens

val SampleFontFamily = FontFamily(
  Font(R.font.be_vietnam_pro_400, FontWeight.Normal),
  Font(R.font.be_vietnam_pro_500, FontWeight.Medium),
  Font(R.font.be_vietnam_pro_600, FontWeight.SemiBold),
  Font(R.font.be_vietnam_pro_800, FontWeight.ExtraBold),
)

private val sampleTypography = Typography().let { base ->
  base.copy(
    displayLarge = base.displayLarge.copy(fontFamily = SampleFontFamily),
    displayMedium = base.displayMedium.copy(fontFamily = SampleFontFamily),
    displaySmall = base.displaySmall.copy(fontFamily = SampleFontFamily),
    headlineLarge = base.headlineLarge.copy(fontFamily = SampleFontFamily),
    headlineMedium = base.headlineMedium.copy(fontFamily = SampleFontFamily),
    headlineSmall = base.headlineSmall.copy(fontFamily = SampleFontFamily),
    titleLarge = base.titleLarge.copy(fontFamily = SampleFontFamily),
    titleMedium = base.titleMedium.copy(fontFamily = SampleFontFamily),
    titleSmall = base.titleSmall.copy(fontFamily = SampleFontFamily),
    bodyLarge = base.bodyLarge.copy(fontFamily = SampleFontFamily),
    bodyMedium = base.bodyMedium.copy(fontFamily = SampleFontFamily),
    bodySmall = base.bodySmall.copy(fontFamily = SampleFontFamily),
    labelLarge = base.labelLarge.copy(fontFamily = SampleFontFamily),
    labelMedium = base.labelMedium.copy(fontFamily = SampleFontFamily),
    labelSmall = base.labelSmall.copy(fontFamily = SampleFontFamily),
  )
}

enum class SampleContrast(val label: SampleText) {
  System(SampleText.ContrastSystem), Standard(SampleText.ContrastStandard), High(SampleText.ContrastHigh);
  fun resolve(systemHigh: Boolean) = this == High || this == System && systemHigh
}

// Android 14 introduced the public contrast API. Older Android versions have
// explicit Standard/High selection, with the unavailable System mode explained
// in Settings. Positive OS contrast maps to this system's binary High intent.
@Composable
fun rememberSystemHighContrast(): Boolean {
  val context = LocalContext.current
  val manager = remember(context) { context.getSystemService(UiModeManager::class.java) }
  var high by remember(manager) { mutableStateOf(false) }
  DisposableEffect(manager) {
    if (Build.VERSION.SDK_INT >= 34 && manager != null) {
      val listener = UiModeManager.ContrastChangeListener { high = it > 0f }
      manager.addContrastChangeListener(context.mainExecutor, listener)
      high = manager.contrast > 0f
      onDispose { manager.removeContrastChangeListener(listener) }
    } else {
      onDispose { }
    }
  }
  return high
}

class SampleColors(val dark: Boolean, val highContrast: Boolean = false) {
  val colorSurfacePage get() = if (dark) CSTokens.colorSurfacePageDark else CSTokens.colorSurfacePage
  val colorSurfacePanel get() = if (dark) CSTokens.colorSurfacePanelDark else CSTokens.colorSurfacePanel
  val colorTextPrimary get() = if (dark) CSTokens.colorTextPrimaryDark else CSTokens.colorTextPrimary
  val colorTextMuted get() = if (highContrast) { if (dark) CSTokens.colorTextMutedHighDark else CSTokens.colorTextMutedHighLight } else { if (dark) CSTokens.colorTextMutedDark else CSTokens.colorTextMuted }
  val colorTextInverse get() = if (dark) CSTokens.colorTextInverseDark else CSTokens.colorTextInverse
  val colorBorderDefault get() = if (highContrast) { if (dark) CSTokens.colorBorderDefaultHighDark else CSTokens.colorBorderDefaultHighLight } else { if (dark) CSTokens.colorBorderDefaultDark else CSTokens.colorBorderDefault }
  val colorLink get() = if (dark) CSTokens.colorLinkDark else CSTokens.colorLink
  val colorSemanticDangerText get() = if (dark) CSTokens.colorSemanticDangerTextDark else CSTokens.colorSemanticDangerText
  val colorSemanticDanger get() = if (dark) CSTokens.colorSemanticDangerDark else CSTokens.colorSemanticDanger
  val colorSemanticDangerFg get() = if (dark) CSTokens.colorSemanticDangerFgDark else CSTokens.colorSemanticDangerFg
  val componentButtonPrimaryBg get() = if (dark) CSTokens.componentButtonPrimaryBgDark else CSTokens.componentButtonPrimaryBg
  val componentButtonPrimaryFg get() = if (dark) CSTokens.componentButtonPrimaryFgDark else CSTokens.componentButtonPrimaryFg
  val componentTextfieldBorderDefault get() = if (dark) CSTokens.componentTextfieldBorderDefaultDark else CSTokens.componentTextfieldBorderDefault
}

val LocalSampleLanguage = staticCompositionLocalOf { SampleLanguage.Vi }

val LocalSampleColors = staticCompositionLocalOf { SampleColors(false) }

@Composable
fun SampleTheme(dark: Boolean, language: SampleLanguage = SampleLanguage.Vi, contrast: SampleContrast = SampleContrast.System, systemHighContrast: Boolean = rememberSystemHighContrast(), content: @Composable () -> Unit) {
  val colors = SampleColors(dark, contrast.resolve(systemHighContrast))
  val scheme = if (dark) darkColorScheme(
    primary = colors.componentButtonPrimaryBg, onPrimary = colors.componentButtonPrimaryFg,
    secondary = CSTokens.colorBrandOchre, surface = colors.colorSurfacePanel,
    background = colors.colorSurfacePage, onSurface = colors.colorTextPrimary,
    onBackground = colors.colorTextPrimary, error = colors.colorSemanticDangerText,
    onError = colors.colorSemanticDangerFg,
    onSurfaceVariant = colors.colorTextMuted, outline = colors.colorBorderDefault,
  ) else lightColorScheme(
    primary = colors.componentButtonPrimaryBg, onPrimary = colors.componentButtonPrimaryFg,
    secondary = CSTokens.colorBrandOchre, surface = colors.colorSurfacePanel,
    background = colors.colorSurfacePage, onSurface = colors.colorTextPrimary,
    onBackground = colors.colorTextPrimary, error = colors.colorSemanticDangerText,
    onError = colors.colorSemanticDangerFg,
    onSurfaceVariant = colors.colorTextMuted, outline = colors.colorBorderDefault,
  )
  CompositionLocalProvider(LocalSampleColors provides colors, LocalSampleLanguage provides language) {
    MaterialTheme(colorScheme = scheme, typography = sampleTypography, content = content)
  }
}
