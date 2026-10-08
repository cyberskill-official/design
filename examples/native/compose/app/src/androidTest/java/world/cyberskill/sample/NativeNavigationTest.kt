package world.cyberskill.sample

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.semantics.getOrNull
import org.junit.Assert.assertEquals
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class NativeNavigationTest {
  @get:Rule val compose = createAndroidComposeRule<MainActivity>()

  @Test fun settingsSwitchesExposeTheirVisibleLabels() {
    compose.onNode(hasText("Đăng nhập") and hasClickAction()).performClick()
    compose.onNode(hasText("Cài đặt") and hasClickAction()).performClick()
    val names = compose.onAllNodes(isToggleable()).fetchSemanticsNodes().map { node ->
      node.config.getOrNull(SemanticsProperties.Text)?.joinToString(" ") { it.text }
        ?: node.config.getOrNull(SemanticsProperties.ContentDescription)?.joinToString(" ")
        ?: ""
    }
    assertEquals("Settings control names; tree: " + compose.onRoot().printToString(), listOf("Ưu tiên giao diện tối", "Khoảng cách gọn"), names)
  }

  @Test fun themeSurvivesNavigationAndSignOutWhileDensityResets() {
    compose.onNode(hasSetTextAction() and SemanticsMatcher.keyIsDefined(SemanticsProperties.Password)).assertExists()
    compose.onNode(hasText("Đăng nhập") and hasClickAction()).performClick()
    compose.onNodeWithText("Mong muốn").assertIsDisplayed()
    compose.onNode(hasText("Cài đặt") and hasClickAction()).performClick()
    compose.onAllNodes(isToggleable())[0].assertIsOff().performClick().assertIsOn()
    compose.onAllNodes(isToggleable())[1].assertIsOff().performClick().assertIsOn()
    compose.onNodeWithText("Gọn", substring = false).assertIsDisplayed()
    compose.onNode(hasText("Quay lại") and hasClickAction()).performClick()
    compose.onNodeWithText("Mong muốn").assertIsDisplayed()
    compose.onNode(hasText("Cài đặt") and hasClickAction()).performClick()
    compose.onAllNodes(isToggleable())[0].assertIsOn()
    compose.onAllNodes(isToggleable())[1].assertIsOff()
    compose.onNodeWithText("Thoải mái", substring = false).assertIsDisplayed()
    compose.onNode(hasText("Đăng xuất") and hasClickAction()).performClick()
    compose.onNode(hasText("Đăng nhập") and hasClickAction()).assertIsDisplayed().performClick()
    compose.onNodeWithText("Mong muốn").assertIsDisplayed()
    compose.onNode(hasText("Cài đặt") and hasClickAction()).performClick()
    compose.onAllNodes(isToggleable())[0].assertIsOn()
    compose.onAllNodes(isToggleable())[1].assertIsOff()
  }

  @Test fun languageChangesAllRoutesWithoutResettingThemeOrDensity() {
    val email=compose.onNode(hasSetTextAction() and !SemanticsMatcher.keyIsDefined(SemanticsProperties.Password))
    email.performTextReplacement("draft@example.test")
    compose.onNodeWithText("Chào mừng bạn trở lại. Đăng nhập để tiếp tục.").assertIsDisplayed()
    compose.onNode(hasText("Đăng nhập") and hasClickAction()).performClick()
    compose.onNode(hasText("Cài đặt") and hasClickAction()).performClick()
    compose.onAllNodes(isToggleable())[0].performClick()
    compose.onAllNodes(isToggleable())[1].performClick()
    compose.onNodeWithText("English").performScrollTo().performClick()
    compose.onNodeWithText("Settings").assertExists()
    compose.onAllNodes(isToggleable())[0].assertIsOn()
    compose.onAllNodes(isToggleable())[1].assertIsOn()
    compose.onNode(hasText("Back") and hasClickAction()).performScrollTo().performClick()
    compose.onNodeWithText("Wishes").assertIsDisplayed()
    for (text in listOf("Status hub refresh","VN labor contract pack","BOD investor update","In build","Open","Done")) compose.onNodeWithText(text).assertExists()
    compose.onNode(hasText("Settings") and hasClickAction()).performClick()
    compose.onAllNodes(isToggleable())[0].assertIsOn()
    compose.onAllNodes(isToggleable())[1].assertIsOff()
    compose.onNode(hasText("Sign out") and hasClickAction()).performClick()
    compose.onNodeWithText("Welcome back. Sign in to continue.").assertIsDisplayed()
    compose.onNode(hasText("Sign in") and hasClickAction()).performClick()
    compose.onNode(hasText("Settings") and hasClickAction()).performClick()
    compose.onNodeWithText("Tiếng Việt").performScrollTo().performClick()
    compose.onAllNodes(isToggleable())[0].assertIsOn()
    compose.onNode(hasText("Đăng xuất") and hasClickAction()).performClick()
    compose.onNodeWithText("Chào mừng bạn trở lại. Đăng nhập để tiếp tục.").assertIsDisplayed()
  }
}
