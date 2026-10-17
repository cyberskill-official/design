package world.cyberskill.sample

import android.app.UiModeManager
import android.os.Build
import android.os.ParcelFileDescriptor
import androidx.compose.ui.semantics.SemanticsActions
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.text.TextLayoutResult
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.*
import org.junit.Assume.assumeTrue
import org.junit.Rule
import org.junit.Test
import world.cyberskill.sample.ui.*
import world.cyberskill.sample.tokens.CSTokens

/** OS preference mutation is opt-in and only for a dedicated disposable emulator. */
class NativeContrastTest {
  @get:Rule val compose = createAndroidComposeRule<MainActivity>()

  @Test fun liveSystemContrastAndExplicitModesSurviveActivityRecreation() {
    val instrumentation = InstrumentationRegistry.getInstrumentation()
    assumeTrue("Requires explicit disposable-emulator argument", InstrumentationRegistry.getArguments().getString("csDisposableContrast") == "true")
    assumeTrue(Build.VERSION.SDK_INT >= 34)
    val manager = instrumentation.targetContext.getSystemService(UiModeManager::class.java)
    fun shell(command: String): String = ParcelFileDescriptor.AutoCloseInputStream(instrumentation.uiAutomation.executeShellCommand(command)).bufferedReader().use { it.readText().trim() }

    // Retry only transient remount/detachment errors. Wrong colors or saved
    // preferences still fail immediately; persistent remount gaps time out.
    fun afterRecreation(assertions: () -> Unit) {
      compose.waitUntil(15000) {
        try {
          assertions()
          true
        } catch (error: IllegalStateException) {
          if (error.message?.startsWith("No compose hierarchies found") == true) false else throw error
        } catch (error: AssertionError) {
          if (error.message?.contains("The node is no longer in the tree") == true) false else throw error
        }
      }
    }
    val original = shell("settings get secure contrast_level")
    try {
      shell("settings put secure contrast_level 0.0")
      compose.waitUntil(5000) { manager.contrast == 0f }
      compose.onNode(hasText("Đăng nhập") and hasClickAction()).performClick()
      compose.onNode(hasText("Cài đặt") and hasClickAction()).performClick()
      compose.onNodeWithText("English").performScrollTo().performClick()
      for (dark in listOf(false, true)) {
        if (dark) compose.onNodeWithText("Prefer dark theme").performScrollTo().performClick()
        for (mode in SampleContrast.values()) {
          val label = mode.label.value(SampleLanguage.En)
          compose.onNodeWithText(label).performScrollTo().performClick()
          compose.onNodeWithText(label).assertIsSelected()
          for (contrast in listOf(0f, 0.5f, 1f, 0f)) {
            shell("settings put secure contrast_level $contrast")
            compose.waitUntil(5000) { manager.contrast == contrast }
            // Finish one explicit lifecycle after OS readback, even when the
            // unchanged contrast value does not trigger OS recreation.
            compose.activityRule.scenario.recreate()
            val high = mode == SampleContrast.High || mode == SampleContrast.System && contrast > 0f
            val expected = if (high) { if (dark) CSTokens.colorTextMutedHighDark else CSTokens.colorTextMutedHighLight } else { if (dark) CSTokens.colorTextMutedDark else CSTokens.colorTextMuted }
            // OS changes can recreate the Activity. Observe the newly mounted
            // real screen, not a detached test-only composition or old Window.
            afterRecreation {
              compose.waitUntil(5000) { compose.onAllNodesWithText("Manage your preferences and session.").fetchSemanticsNodes(atLeastOneRootRequired = false).isNotEmpty() }
              val description = compose.onNodeWithText("Manage your preferences and session.")
              description.performScrollTo()
              compose.onNodeWithText("Manage your preferences and session.").assertIsDisplayed()
              val layouts = mutableListOf<TextLayoutResult>()
              compose.onNodeWithText("Manage your preferences and session.").performSemanticsAction(SemanticsActions.GetTextLayoutResult) { it(layouts) }
              assertEquals("Actual screen muted text ($dark/$mode/$contrast)", expected, layouts.single().layoutInput.style.color)
              compose.onNodeWithText(label).performScrollTo()
              compose.onNodeWithText(label).assertIsSelected()
              compose.onNodeWithText("Prefer dark theme").performScrollTo()
              compose.onNodeWithText("Prefer dark theme").let { if (dark) it.assertIsOn() else it.assertIsOff() }
              compose.onNodeWithText("English").performScrollTo()
              compose.onNodeWithText("English").assertIsSelected()
            }
            println("NativeContrast verified: dark=$dark mode=$mode contrast=$contrast")
          }
        }
      }
    } finally {
      if (original == "null") shell("settings delete secure contrast_level") else shell("settings put secure contrast_level $original")
    }
  }
}
