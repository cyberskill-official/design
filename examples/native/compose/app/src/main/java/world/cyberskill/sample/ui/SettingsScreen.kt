package world.cyberskill.sample.ui

import androidx.compose.foundation.background
import android.os.Build
import androidx.compose.foundation.border
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import world.cyberskill.design.CsButton
import world.cyberskill.design.CsButtonRole
import world.cyberskill.design.csControlEnabled
import world.cyberskill.design.CsCard
import world.cyberskill.design.CsSelect
import world.cyberskill.design.CsSwitch
import world.cyberskill.sample.tokens.CSTokens

@Composable
fun SettingsScreen(dark: Boolean, language: SampleLanguage = LocalSampleLanguage.current, onLanguageChanged: (SampleLanguage) -> Unit = {}, contrast: SampleContrast = SampleContrast.System, onContrastChanged: (SampleContrast) -> Unit = {}, onDarkChanged: (Boolean) -> Unit, onSignOut: () -> Unit, onBack: () -> Unit) {
  val colors = LocalSampleColors.current
  var compact by remember { mutableStateOf(false) }
  val controlGap = if (compact) CSTokens.densityControlGapCompact else CSTokens.densityControlGapComfortable
  val buttonPaddingX = if (compact) CSTokens.componentButtonMdPaddingXCompact else CSTokens.componentButtonMdPaddingXComfortable
  val buttonPaddingY = if (compact) CSTokens.componentButtonMdPaddingYCompact else CSTokens.componentButtonMdPaddingYComfortable
  Column(
    modifier = Modifier
      .fillMaxSize()
      .background(colors.colorSurfacePage)
      .padding(24.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
  ) {
    Column(
      modifier = Modifier
        .weight(1f)
        .fillMaxWidth()
        .verticalScroll(rememberScrollState()),
      verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
      TextButton(onClick = onBack, enabled = csControlEnabled()) {
        Text(SampleText.Back.value(language), color = colors.colorLink)
      }
      Text(SampleText.Settings.value(language), color = colors.colorTextPrimary, fontSize = 24.sp)
      Text(
        SampleText.SettingsDescription.value(language),
        color = colors.colorTextMuted,
        fontSize = 13.sp,
      )
      CsCard(dark = colors.dark, highContrast = colors.highContrast, compact = compact, spacing = controlGap, padding = 16.dp) {
        CsSwitch(
          title = SampleText.PreferDark.value(language),
          checked = dark,
          onCheckedChange = onDarkChanged,
          dark = colors.dark,
          highContrast = colors.highContrast,
          compact = compact,
        )
        CsSwitch(
          title = SampleText.CompactSpacing.value(language),
          checked = compact,
          onCheckedChange = { compact = it },
          dark = colors.dark,
          highContrast = colors.highContrast,
          compact = compact,
        )
        CsSelect(
          label = SampleText.Language.value(language),
          options = SampleLanguage.values().toList(),
          selected = language,
          labelFor = { if (it == SampleLanguage.Vi) "Tiếng Việt" else "English" },
          onSelect = onLanguageChanged,
          dark = colors.dark,
          highContrast = colors.highContrast,
          compact = compact,
        )
        CsSelect(
          label = SampleText.Contrast.value(language),
          options = SampleContrast.values().toList(),
          selected = contrast,
          labelFor = { it.label.value(language) },
          onSelect = onContrastChanged,
          dark = colors.dark,
          highContrast = colors.highContrast,
          compact = compact,
        )
        if (Build.VERSION.SDK_INT < 34) Text(SampleText.ContrastSystemUnavailable.value(language), color = colors.colorTextMuted)
        Text(if (compact) SampleText.Compact.value(language) else SampleText.Comfortable.value(language), color = colors.colorTextPrimary)
        SwatchRow(SampleText.BrandUmber.value(language), CSTokens.colorBrandUmber)
        SwatchRow(SampleText.BrandOchre.value(language), CSTokens.colorBrandOchre)
      }
    }
    CsButton(
      title = SampleText.SignOut.value(language),
      onClick = onSignOut,
      dark = colors.dark,
      highContrast = colors.highContrast,
      compact = compact,
      role = CsButtonRole.Danger,
      paddingX = buttonPaddingX,
      paddingY = buttonPaddingY,
    )
  }
}

@Composable
private fun SwatchRow(label: String, color: androidx.compose.ui.graphics.Color) {
  val colors = LocalSampleColors.current
  Row(verticalAlignment = Alignment.CenterVertically) {
    Text(label, color = colors.colorTextPrimary, modifier = Modifier.weight(1f))
    Box(
      modifier = Modifier
        .width(36.dp)
        .height(24.dp)
        .clip(RoundedCornerShape(6.dp))
        .background(color),
    )
  }
}
