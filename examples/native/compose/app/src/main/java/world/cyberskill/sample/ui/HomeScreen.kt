package world.cyberskill.sample.ui

import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import world.cyberskill.design.CsButtonRole
import world.cyberskill.design.CsCard
import world.cyberskill.design.CsDivider
import world.cyberskill.design.CsListRow
import world.cyberskill.design.CsTextButton

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
        CsTextButton(
          title = SampleText.Settings.value(language),
          onClick = onOpenSettings,
          dark = colors.dark,
          highContrast = colors.highContrast,
          compact = false,
        )
      }
      Text(
        SampleText.ListDescription.value(language),
        color = colors.colorTextMuted,
        fontSize = 13.sp,
      )
      CsCard(dark = colors.dark, highContrast = colors.highContrast, compact = false) {
        wishes.forEach { wish ->
          CsListRow(
            title = wish.title,
            subtitle = wish.status,
            dark = colors.dark,
            highContrast = colors.highContrast,
            compact = false,
          )
          CsDivider(dark = colors.dark, highContrast = colors.highContrast, compact = false)
        }
      }
    }
    CsTextButton(
      title = SampleText.SignOut.value(language),
      onClick = onSignOut,
      dark = colors.dark,
      highContrast = colors.highContrast,
      compact = false,
      role = CsButtonRole.Danger,
    )
  }
}
