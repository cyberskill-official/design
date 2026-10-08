package world.cyberskill.sample.ui

import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import world.cyberskill.sample.tokens.CSTokens

private data class Wish(val title: String, val status: String)

@Composable
fun HomeScreen(onOpenSettings: () -> Unit, onSignOut: () -> Unit) {
  val colors = LocalSampleColors.current
  val language = LocalSampleLanguage.current
  val wishes = listOf(
    Wish(SampleText.StatusHub.value(language), SampleText.InBuild.value(language)),
    Wish(SampleText.LaborContract.value(language), SampleText.Open.value(language)),
    Wish(SampleText.InvestorUpdate.value(language), SampleText.Done.value(language)),
  )
  Column(
    modifier = Modifier
      .fillMaxSize()
      .background(colors.colorSurfacePage)
      .padding(24.dp),
    verticalArrangement = Arrangement.spacedBy(12.dp),
  ) {
    Column(
      modifier = Modifier.weight(1f).fillMaxWidth().verticalScroll(rememberScrollState()),
      verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
      Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Text(SampleText.Wishes.value(language), color = colors.colorTextPrimary, fontSize = 24.sp, modifier = Modifier.weight(1f))
        TextButton(onClick = onOpenSettings) {
          Text(SampleText.Settings.value(language), color = colors.colorLink)
        }
      }
      Text(
        SampleText.ListDescription.value(language),
        color = colors.colorTextMuted,
        fontSize = 13.sp,
      )
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .clip(RoundedCornerShape(12.dp))
          .border(1.dp, colors.colorBorderDefault, RoundedCornerShape(12.dp))
          .background(colors.colorSurfacePanel),
      ) {
        wishes.forEach { wish ->
          Row(
            modifier = Modifier
              .fillMaxWidth()
              .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
          ) {
            Column(modifier = Modifier.weight(1f)) {
              Text(wish.title, color = colors.colorTextPrimary, fontSize = 15.sp)
              Text(wish.status, color = colors.colorTextMuted, fontSize = 12.sp)
            }
            Spacer(
              modifier = Modifier
                .size(10.dp)
                .clip(CircleShape)
                .background(CSTokens.colorBrandOchre),
            )
          }
        }
      }
    }
    TextButton(onClick = onSignOut) {
      Text(SampleText.SignOut.value(language), color = colors.colorSemanticDanger)
    }
  }
}
