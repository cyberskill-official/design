package world.cyberskill.sample

import android.graphics.Typeface
import android.text.TextPaint
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.platform.LocalFontFamilyResolver
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.text.font.FontWeight
import org.junit.Assert.*
import org.junit.Rule
import org.junit.Test
import world.cyberskill.sample.ui.*

class NativeFontTest {
  @get:Rule val compose = createComposeRule()

  @Test fun bundledTypefaceResolvesSampleCopyAtAllDeclaredWeights() {
    val faces=mutableListOf<Typeface>()
    compose.setContent {
      val resolver=LocalFontFamilyResolver.current
      val resolved=listOf(FontWeight.Normal, FontWeight.Medium, FontWeight.SemiBold, FontWeight.ExtraBold).map {
        resolver.resolve(fontFamily=SampleFontFamily, fontWeight=it).value as Typeface
      }
      SideEffect { faces.clear(); faces.addAll(resolved) }
    }
    compose.waitForIdle()
    assertEquals(4,faces.size)
    for (face in faces) {
      assertNotEquals("Bundled family must not resolve to Android's default",Typeface.DEFAULT,face)
      val paint=TextPaint().apply { typeface=face; textSize=16f }
      val characters=SampleText.values().flatMap { text -> listOf(text.vi,text.en) }.joinToString("").filterNot { it.isWhitespace() }.toSet()
      for (character in characters) assertTrue("Bundled sample glyph missing: $character",paint.hasGlyph(character.toString()))
    }
  }
}
