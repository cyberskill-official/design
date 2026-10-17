import XCTest
@testable import CyberSkillSample

final class LanguageTests: XCTestCase {
  func testEverySampleLabelHasDistinctEnglishAndVietnameseCopy() {
    for key in SampleText.allCases {
      let english = key.value(in: .en)
      let vietnamese = key.value(in: .vi)
      XCTAssertFalse(english.isEmpty)
      XCTAssertFalse(vietnamese.isEmpty)
      XCTAssertNotEqual(english, vietnamese, "Missing translation for \(key)")
    }
  }

  func testLanguageSwitchPreservesThemeAndUsesVietnameseByDefault() {
    let preferences = SamplePreferences()
    XCTAssertEqual(preferences.language, .vi)
    XCTAssertEqual(preferences.text(.signIn), "Đăng nhập")
    preferences.dark = true
    preferences.language = .en
    XCTAssertEqual(preferences.text(.signIn), "Sign in")
    XCTAssertEqual(preferences.language.locale.identifier, "en")
    XCTAssertTrue(preferences.dark)
    preferences.language = .vi
    XCTAssertEqual(preferences.text(.signOut), "Đăng xuất")
    XCTAssertEqual(preferences.language.locale.identifier, "vi")
    XCTAssertTrue(preferences.dark)
  }
}
