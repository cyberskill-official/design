package world.cyberskill.sample

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import world.cyberskill.sample.ui.SampleTheme
import world.cyberskill.sample.ui.SampleLanguage
import world.cyberskill.sample.ui.SampleContrast
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import world.cyberskill.sample.ui.HomeScreen
import world.cyberskill.sample.ui.SettingsScreen
import world.cyberskill.sample.ui.SignInScreen

/**
 * Multi-screen Compose sample: SignIn → Home → Settings.
 * Colours and metrics come from generated CSTokens (synced from tokens/native).
 */
class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContent {
      CyberSkillSampleApp()
    }
  }
}

@Composable
fun CyberSkillSampleApp() {
  var dark by rememberSaveable { mutableStateOf(false) }
  var language by rememberSaveable { mutableStateOf(SampleLanguage.Vi) }
  var contrast by rememberSaveable { mutableStateOf(SampleContrast.System) }
  val nav = rememberNavController()
  SampleTheme(dark = dark, language = language, contrast = contrast) {
    NavHost(
      navController = nav,
      startDestination = "sign_in",
      modifier = Modifier.fillMaxSize(),
    ) {
      composable("sign_in") {
        SignInScreen(onSuccess = {
          nav.navigate("home") {
            popUpTo("sign_in") { inclusive = true }
          }
        })
      }
      composable("home") {
        HomeScreen(
          onOpenSettings = { nav.navigate("settings") },
          onSignOut = {
            nav.navigate("sign_in") {
              popUpTo(0) { inclusive = true }
            }
          },
        )
      }
      composable("settings") {
        SettingsScreen(
          dark = dark,
          language = language,
          contrast = contrast,
          onContrastChanged = { contrast = it },
          onLanguageChanged = { language = it },
          onDarkChanged = { dark = it },
          onSignOut = {
            nav.navigate("sign_in") {
              popUpTo(0) { inclusive = true }
            }
          },
          onBack = { nav.popBackStack() },
        )
      }
    }
  }
}
