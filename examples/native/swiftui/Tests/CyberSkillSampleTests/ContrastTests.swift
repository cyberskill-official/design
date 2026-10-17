import XCTest
@testable import CyberSkillSample

final class ContrastTests: XCTestCase {
  func testSystemChangesAndExplicitModesRemainIndependentOfThemeAndLanguage() {
    let preferences = SamplePreferences()
    XCTAssertEqual(preferences.contrast, .system)
    for dark in [false, true] {
      preferences.dark = dark
      for mode in SampleContrast.allCases {
        preferences.contrast = mode
        for systemHigh in [false, true, false] {
          preferences.systemHighContrast = systemHigh
          let high = mode == .high || mode == .system && systemHigh
          let muted = high ? (dark ? CSTokens.colorTextMutedHighDark : CSTokens.colorTextMutedHighLight) : (dark ? CSTokens.colorTextMutedDark : CSTokens.colorTextMuted)
          let border = high ? (dark ? CSTokens.colorBorderDefaultHighDark : CSTokens.colorBorderDefaultHighLight) : (dark ? CSTokens.colorBorderDefaultDark : CSTokens.colorBorderDefault)
          XCTAssertEqual(preferences.colors.colorTextMuted, muted)
          XCTAssertEqual(preferences.colors.colorBorderDefault, border)
          preferences.language = .en
          XCTAssertEqual(preferences.contrast, mode)
          XCTAssertEqual(preferences.dark, dark)
        }
      }
    }
  }
}
