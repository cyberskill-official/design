package world.cyberskill.sample.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.material3.RadioButton
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.heightIn
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
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import world.cyberskill.sample.tokens.CSTokens

@Composable
fun SettingsScreen(dark: Boolean, language: SampleLanguage = LocalSampleLanguage.current, onLanguageChanged: (SampleLanguage) -> Unit = {}, onDarkChanged: (Boolean) -> Unit, onSignOut: () -> Unit, onBack: () -> Unit) {
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
      TextButton(onClick = onBack) {
        Text(SampleText.Back.value(language), color = colors.colorLink)
      }
      Text(SampleText.Settings.value(language), color = colors.colorTextPrimary, fontSize = 24.sp)
      Text(
        SampleText.SettingsDescription.value(language),
        color = colors.colorTextMuted,
        fontSize = 13.sp,
      )
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .clip(RoundedCornerShape(12.dp))
          .border(1.dp, colors.colorBorderDefault, RoundedCornerShape(12.dp))
          .background(colors.colorSurfacePanel)
          .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(controlGap),
      ) {
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .minimumInteractiveComponentSize()
            .toggleable(value = dark, role = Role.Switch, onValueChange = onDarkChanged),
          verticalAlignment = Alignment.CenterVertically,
        ) {
          Text(SampleText.PreferDark.value(language), color = colors.colorTextPrimary, modifier = Modifier.weight(1f))
          Switch(
            checked = dark,
            onCheckedChange = null,
            colors = SwitchDefaults.colors(checkedTrackColor = CSTokens.colorBrandOchre),
          )
        }
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .minimumInteractiveComponentSize()
            .toggleable(value = compact, role = Role.Switch, onValueChange = { compact = it }),
          verticalAlignment = Alignment.CenterVertically,
        ) {
          Text(SampleText.CompactSpacing.value(language), color = colors.colorTextPrimary, modifier = Modifier.weight(1f))
          Switch(checked = compact, onCheckedChange = null)
        }
        Column(Modifier.selectableGroup()) {
          Text(SampleText.Language.value(language), color = colors.colorTextPrimary)
          for (option in SampleLanguage.values()) {
            Row(
              modifier = Modifier.fillMaxWidth().minimumInteractiveComponentSize()
                .selectable(selected = language == option, role = Role.RadioButton, onClick = { onLanguageChanged(option) }),
              verticalAlignment = Alignment.CenterVertically,
            ) {
              RadioButton(selected = language == option, onClick = null)
              Text(if (option == SampleLanguage.Vi) "Tiếng Việt" else "English", color = colors.colorTextPrimary, modifier = Modifier.weight(1f))
            }
          }
        }
        Text(if (compact) SampleText.Compact.value(language) else SampleText.Comfortable.value(language), color = colors.colorTextPrimary)
        SwatchRow(SampleText.BrandUmber.value(language), CSTokens.colorBrandUmber)
        SwatchRow(SampleText.BrandOchre.value(language), CSTokens.colorBrandOchre)
      }
    }
    Button(
      onClick = onSignOut,
      modifier = Modifier
        .fillMaxWidth()
        .heightIn(min = CSTokens.componentButtonMdMinHeight),
      contentPadding = PaddingValues(horizontal = buttonPaddingX, vertical = buttonPaddingY),
      colors = ButtonDefaults.buttonColors(
        containerColor = colors.colorSemanticDanger,
        contentColor = colors.colorTextInverse,
      ),
      shape = RoundedCornerShape(CSTokens.componentButtonRadius),
    ) {
      Text(SampleText.SignOut.value(language))
    }
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
