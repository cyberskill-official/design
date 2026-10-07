package world.cyberskill.sample.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
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
import world.cyberskill.sample.tokens.CSTokens

@Composable
fun SettingsScreen(dark: Boolean, onDarkChanged: (Boolean) -> Unit, onSignOut: () -> Unit, onBack: () -> Unit) {
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
    TextButton(onClick = onBack) {
      Text("← Back", color = colors.colorLink)
    }
    Text("Settings", color = colors.colorTextPrimary, fontSize = 24.sp)
    Text(
      "Third screen — brand swatches from CSTokens.",
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
      Row(verticalAlignment = Alignment.CenterVertically) {
        Text("Prefer dark theme", color = colors.colorTextPrimary, modifier = Modifier.weight(1f))
        Switch(
          checked = dark,
          onCheckedChange = onDarkChanged,
          colors = SwitchDefaults.colors(checkedTrackColor = CSTokens.colorBrandOchre),
        )
      }
      Row(verticalAlignment = Alignment.CenterVertically) {
        Text("Compact spacing", color = colors.colorTextPrimary, modifier = Modifier.weight(1f))
        Switch(checked = compact, onCheckedChange = { compact = it })
      }
      Text(if (compact) "Compact" else "Comfortable", color = colors.colorTextPrimary)
      SwatchRow("Brand umber", CSTokens.colorBrandUmber)
      SwatchRow("Brand ochre", CSTokens.colorBrandOchre)
    }
    Spacer(modifier = Modifier.weight(1f))
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
      Text("Sign out")
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
