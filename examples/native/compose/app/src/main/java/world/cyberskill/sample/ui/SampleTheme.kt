package world.cyberskill.sample.ui

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import world.cyberskill.sample.tokens.CSTokens

class SampleColors(val dark: Boolean) {
  val colorSurfacePage get() = if (dark) CSTokens.colorSurfacePageDark else CSTokens.colorSurfacePage
  val colorSurfacePanel get() = if (dark) CSTokens.colorSurfacePanelDark else CSTokens.colorSurfacePanel
  val colorTextPrimary get() = if (dark) CSTokens.colorTextPrimaryDark else CSTokens.colorTextPrimary
  val colorTextMuted get() = if (dark) CSTokens.colorTextMutedDark else CSTokens.colorTextMuted
  val colorTextInverse get() = if (dark) CSTokens.colorTextInverseDark else CSTokens.colorTextInverse
  val colorBorderDefault get() = if (dark) CSTokens.colorBorderDefaultDark else CSTokens.colorBorderDefault
  val colorLink get() = if (dark) CSTokens.colorLinkDark else CSTokens.colorLink
  val colorSemanticDanger get() = if (dark) CSTokens.colorSemanticDangerDark else CSTokens.colorSemanticDanger
  val colorSemanticDangerFg get() = if (dark) CSTokens.colorSemanticDangerFgDark else CSTokens.colorSemanticDangerFg
  val componentButtonPrimaryBg get() = if (dark) CSTokens.componentButtonPrimaryBgDark else CSTokens.componentButtonPrimaryBg
  val componentButtonPrimaryFg get() = if (dark) CSTokens.componentButtonPrimaryFgDark else CSTokens.componentButtonPrimaryFg
  val componentTextfieldBorderDefault get() = if (dark) CSTokens.componentTextfieldBorderDefaultDark else CSTokens.componentTextfieldBorderDefault
}

val LocalSampleColors = staticCompositionLocalOf { SampleColors(false) }

@Composable
fun SampleTheme(dark: Boolean, content: @Composable () -> Unit) {
  val colors = SampleColors(dark)
  val scheme = if (dark) darkColorScheme(
    primary = colors.componentButtonPrimaryBg, onPrimary = colors.componentButtonPrimaryFg,
    secondary = CSTokens.colorBrandOchre, surface = colors.colorSurfacePanel,
    background = colors.colorSurfacePage, onSurface = colors.colorTextPrimary,
    onBackground = colors.colorTextPrimary, error = colors.colorSemanticDanger,
    onError = colors.colorSemanticDangerFg,
  ) else lightColorScheme(
    primary = colors.componentButtonPrimaryBg, onPrimary = colors.componentButtonPrimaryFg,
    secondary = CSTokens.colorBrandOchre, surface = colors.colorSurfacePanel,
    background = colors.colorSurfacePage, onSurface = colors.colorTextPrimary,
    onBackground = colors.colorTextPrimary, error = colors.colorSemanticDanger,
    onError = colors.colorSemanticDangerFg,
  )
  CompositionLocalProvider(LocalSampleColors provides colors) {
    MaterialTheme(colorScheme = scheme, content = content)
  }
}
