package world.cyberskill.sample

import android.graphics.Bitmap
import android.os.ParcelFileDescriptor
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.requiredSize
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.graphics.asAndroidBitmap
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.semantics.SemanticsActions
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.semantics.getOrNull
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.text.TextLayoutResult
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.dp
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.*
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.Parameterized
import java.io.File
import world.cyberskill.sample.ui.*
import world.cyberskill.sample.tokens.CSTokens

/** Native rendered evidence; screenshots are not approved golden baselines. */
@RunWith(Parameterized::class)
class NativeLayoutTest(
  private val width: Int,
  private val height: Int,
  private val scale: Float,
  private val dark: Boolean,
  private val route: String,
  private val compact: Boolean,
  private val language: SampleLanguage,
) {
  @get:Rule val compose = createComposeRule()

  @Test fun enlargedTextAndActionsRemainReachable() {
    var signOutCalls = 0
    var backCalls = 0
    var signInCalls = 0
    var openSettingsCalls = 0
    compose.setContent {
      val density = LocalDensity.current.density
      var theme by remember { mutableStateOf(dark) }
      CompositionLocalProvider(LocalDensity provides Density(density, scale)) {
        Box(Modifier.requiredSize(width.dp, height.dp).testTag("sample-screen")) {
          SampleTheme(theme, language) {
            when (route) {
              "sign-in" -> SignInScreen(onSuccess = { signInCalls++ })
              "home" -> HomeScreen(onOpenSettings = { openSettingsCalls++ }, onSignOut = { signOutCalls++ })
              else -> SettingsScreen(dark = theme, onDarkChanged = { theme = it }, onSignOut = { signOutCalls++ }, onBack = { backCalls++ })
            }
          }
        }
      }
    }
    compose.waitForIdle()
    if (compact) {
      compose.onAllNodes(isToggleable())[1].performClick()
      compose.onNodeWithText(SampleText.Compact.value(language), substring = false).assertExists()
    }
    capture("initial")
    // A text field/button can be reachable while its label is clipped; inspect native text layout too.
    val texts = compose.onAllNodes(hasAnyAncestor(hasTestTag("sample-screen")), useUnmergedTree = true).fetchSemanticsNodes()
    for (node in texts) {
      val strings = node.config.getOrNull(SemanticsProperties.Text) ?: continue
      val action = node.config.getOrNull(SemanticsActions.GetTextLayoutResult)?.action ?: continue
      val layouts = mutableListOf<TextLayoutResult>()
      compose.runOnIdle { action(layouts) }
      for (layout in layouts) {
        // In Compose 1.6, multiParagraph.width can retain the maximum constraint while
        // Text's actual width wraps its glyphs. Compare rendered line bounds instead.
        val horizontalClip = (0 until layout.lineCount).any {
          layout.getLineLeft(it) < -1f || layout.getLineRight(it) > layout.size.width + 1f
        }
        val verticalClip = layout.multiParagraph.height > layout.size.height + 1f
        assertFalse("Clipped text: $strings in ${caseName()} size=${layout.size} measuredHeight=${layout.multiParagraph.height} horizontalClip=$horizontalClip verticalClip=$verticalClip", horizontalClip || verticalClip)
      }
    }
    if (route == "settings") {
      for (label in listOf("Tiếng Việt", "English")) reveal(compose.onNodeWithText(label))
      for (label in listOf(SampleText.PreferDark, SampleText.CompactSpacing, SampleText.Language, SampleText.BrandUmber, SampleText.BrandOchre).map { it.value(language) }) {
        reveal(compose.onNodeWithText(label))
      }
    }
    if (route == "home") {
      for (key in listOf(SampleText.Wishes,SampleText.StatusHub,SampleText.LaborContract,SampleText.InvestorUpdate,SampleText.InBuild,SampleText.Open,SampleText.Done)) reveal(compose.onNodeWithText(key.value(language)))
      reveal(compose.onNode(hasText(SampleText.Settings.value(language)) and hasClickAction()))
    }
    val actionText = if (route == "sign-in") SampleText.SignIn.value(language) else SampleText.SignOut.value(language)
    val action = compose.onNode(hasText(actionText) and hasClickAction())
    reveal(action)
    if (route != "home") {
      assertTrue("Filled action retains token minimum height", action.fetchSemanticsNode().boundsInRoot.height + 1f >= CSTokens.componentButtonMdMinHeight.value * compose.density.density)
    }
    capture("action")
    action.performClick()
    compose.runOnIdle {
      if (route == "sign-in") assertEquals(1, signInCalls) else assertEquals(1, signOutCalls)
    }
    if (route == "home") {
      // Material TextButton expands its touch area beyond its painted bounds.
      // Exercise both vertical edges of the 44dp target rather than treating paint size as hit size.
      val edge = (CSTokens.componentButtonMdMinHeight.value / 2f - 0.5f) * compose.density.density
      for (offset in listOf(-edge, edge)) {
        compose.runOnIdle { signOutCalls = 0 }
        action.performTouchInput { click(Offset(center.x, center.y + offset)) }
        compose.runOnIdle { assertEquals("Sign out hit target accepts edge gesture once", 1, signOutCalls) }
      }
      compose.onNode(hasText(SampleText.Settings.value(language)) and hasClickAction()).performClick()
      compose.runOnIdle { assertEquals(1, openSettingsCalls) }
    }
    if (route == "settings") {
      val back = compose.onNode(hasText(SampleText.Back.value(language)) and hasClickAction())
      reveal(back)
      back.performClick()
      compose.runOnIdle { assertEquals(1, backCalls) }
    }
  }

  private fun reveal(node: SemanticsNodeInteraction) {
    val bounds = node.getUnclippedBoundsInRoot()
    val fullHeight = (bounds.bottom - bounds.top).value * compose.density.density
    if (!node.isDisplayed() || node.fetchSemanticsNode().boundsInRoot.height + 1f < fullHeight) node.performScrollTo()
    node.assertIsDisplayed()
    assertTrue("Complete control/label remains reachable", node.fetchSemanticsNode().boundsInRoot.height + 1f >= fullHeight)
  }

  private fun caseName() = "${language.tag}-${width}x${height}-text${scale}-${if (dark) "dark" else "light"}-$route-${if (compact) "compact" else "comfortable"}"
  private fun capture(position: String) {
    val context = InstrumentationRegistry.getInstrumentation().targetContext
    val directory = File(context.getExternalFilesDir(null), "native-rendered").apply { mkdirs() }
    val image = compose.onNodeWithTag("sample-screen").captureToImage().asAndroidBitmap()
    val file = File(directory, "${caseName()}-$position.png")
    file.outputStream().use { image.compress(Bitmap.CompressFormat.PNG, 100, it) }
    // UiAutomation runs one executable per call; it does not interpret shell separators.
    for (command in listOf("mkdir -p /sdcard/Download/cs-native-language-evidence", "cp ${file.absolutePath} /sdcard/Download/cs-native-language-evidence/${file.name}")) {
      ParcelFileDescriptor.AutoCloseInputStream(InstrumentationRegistry.getInstrumentation().uiAutomation.executeShellCommand(command)).use { it.readBytes() }
    }
  }
  companion object {
    @JvmStatic @Parameterized.Parameters(name = "{0}x{1}-scale{2}-dark{3}-{4}-compact{5}-{6}")
    fun cases(): List<Array<Any>> {
      val cases = mutableListOf<Array<Any>>()
      for ((width, height) in listOf(360 to 800, 800 to 600))
        for (scale in listOf(1f, 1.5f, 2f))
          for (dark in listOf(false, true))
            for (route in listOf("sign-in", "home", "settings"))
              for (language in SampleLanguage.values())
              for (compact in if (route == "settings") listOf(false, true) else listOf(false))
                cases.add(arrayOf(width, height, scale, dark, route, compact, language))
      return cases
    }
  }
}
