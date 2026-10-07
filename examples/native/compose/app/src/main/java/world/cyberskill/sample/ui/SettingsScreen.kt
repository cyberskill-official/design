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
fun SettingsScreen(onSignOut: () -> Unit, onBack: () -> Unit) {
  var dark by remember { mutableStateOf(false) }
  var compact by remember { mutableStateOf(false) }
  val controlGap = if (compact) CSTokens.densityControlGapCompact else CSTokens.densityControlGapComfortable
  val buttonPaddingX = if (compact) CSTokens.componentButtonMdPaddingXCompact else CSTokens.componentButtonMdPaddingXComfortable
  val buttonPaddingY = if (compact) CSTokens.componentButtonMdPaddingYCompact else CSTokens.componentButtonMdPaddingYComfortable
  Column(
    modifier = Modifier
      .fillMaxSize()
      .background(CSTokens.colorSurfacePage)
      .padding(24.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
  ) {
    TextButton(onClick = onBack) {
      Text("← Back", color = CSTokens.colorLink)
    }
    Text("Settings", color = CSTokens.colorTextPrimary, fontSize = 24.sp)
    Text(
      "Third screen — brand swatches from CSTokens.",
      color = CSTokens.colorTextMuted,
      fontSize = 13.sp,
    )
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .clip(RoundedCornerShape(12.dp))
        .border(1.dp, CSTokens.colorBorderDefault, RoundedCornerShape(12.dp))
        .background(CSTokens.colorSurfacePanel)
        .padding(16.dp),
      verticalArrangement = Arrangement.spacedBy(controlGap),
    ) {
      Row(verticalAlignment = Alignment.CenterVertically) {
        Text("Prefer dark theme", color = CSTokens.colorTextPrimary, modifier = Modifier.weight(1f))
        Switch(
          checked = dark,
          onCheckedChange = { dark = it },
          colors = SwitchDefaults.colors(checkedTrackColor = CSTokens.colorBrandOchre),
        )
      }
      Row(verticalAlignment = Alignment.CenterVertically) {
        Text("Compact spacing", color = CSTokens.colorTextPrimary, modifier = Modifier.weight(1f))
        Switch(checked = compact, onCheckedChange = { compact = it })
      }
      Text(if (compact) "Compact" else "Comfortable", color = CSTokens.colorTextPrimary)
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
        containerColor = CSTokens.colorSemanticDanger,
        contentColor = CSTokens.colorTextInverse,
      ),
      shape = RoundedCornerShape(CSTokens.componentButtonRadius),
    ) {
      Text("Sign out")
    }
  }
}

@Composable
private fun SwatchRow(label: String, color: androidx.compose.ui.graphics.Color) {
  Row(verticalAlignment = Alignment.CenterVertically) {
    Text(label, color = CSTokens.colorTextPrimary, modifier = Modifier.weight(1f))
    Box(
      modifier = Modifier
        .width(36.dp)
        .height(24.dp)
        .clip(RoundedCornerShape(6.dp))
        .background(color),
    )
  }
}
