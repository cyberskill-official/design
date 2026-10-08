import XCTest
import CoreText
@testable import CyberSkillSample

final class FontTests: XCTestCase {
  func testBundledFontsResolveEverySampleGlyphWithoutNameFallback() {
    _ = SampleFonts.font(size: 16)
    for weight in SampleFonts.Weight.allCases {
      let name = "BeVietnamPro-" + weight.rawValue
      let font = CTFontCreateWithName(name as CFString, 16, nil)
      XCTAssertEqual(CTFontCopyPostScriptName(font) as String, name)
      for key in SampleText.allCases {
        for language in SampleLanguage.allCases {
          for text in [key.value(in: language), key.value(in: language).decomposedStringWithCanonicalMapping] {
            let characters = Array(text.utf16)
            var glyphs = [CGGlyph](repeating: 0, count: characters.count)
            XCTAssertTrue(CTFontGetGlyphsForCharacters(font, characters, &glyphs, characters.count), text)
            XCTAssertFalse(glyphs.contains(0), text)
          }
        }
      }
    }
  }
}
