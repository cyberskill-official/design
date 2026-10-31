package world.cyberskill.sample.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import world.cyberskill.design.CsButton
import world.cyberskill.design.CsTextField

@Composable
fun SignInScreen(onSuccess: () -> Unit) {
  val colors = LocalSampleColors.current
  val language = LocalSampleLanguage.current
  var email by remember { mutableStateOf("you@cyberskill.world") }
  var password by remember { mutableStateOf("") }
  Column(
    modifier = Modifier
      .fillMaxSize()
      .background(colors.colorSurfacePage)
      .padding(24.dp),
    verticalArrangement = Arrangement.spacedBy(16.dp),
  ) {
    Text(SampleText.SignIn.value(language), color = colors.colorTextPrimary, fontSize = 28.sp)
    Text(
      SampleText.Welcome.value(language),
      color = colors.colorTextMuted,
      fontSize = 15.sp,
    )
    CsTextField(
      label = SampleText.WorkEmail.value(language),
      value = email,
      onValueChange = { email = it },
      dark = colors.dark,
      highContrast = colors.highContrast,
      compact = false,
    )
    CsTextField(
      label = SampleText.Password.value(language),
      value = password,
      onValueChange = { password = it },
      dark = colors.dark,
      highContrast = colors.highContrast,
      compact = false,
      secure = true,
    )
    Spacer(modifier = Modifier.height(8.dp))
    CsButton(
      title = SampleText.SignIn.value(language),
      onClick = onSuccess,
      dark = colors.dark,
      highContrast = colors.highContrast,
      compact = false,
    )
  }
}
