import XCTest
final class RootFlowTests: XCTestCase {
  override func setUpWithError() throws { continueAfterFailure = false }
  func capture(_ app: XCUIApplication, _ name: String) {
    let shot = XCTAttachment(screenshot: app.screenshot()); shot.name = name; shot.lifetime = .keepAlways; add(shot)
    let tree = XCTAttachment(string: app.debugDescription); tree.name = name + "-tree"; tree.lifetime = .keepAlways; add(tree)
  }
  func reachable(_ element: XCUIElement, app: XCUIApplication) {
    XCTAssertTrue(element.waitForExistence(timeout: 10))
    func visiblyReachable() -> Bool {
      guard element.isHittable else { return false }
      if element.label == "Sign out" || element.label == "Đăng xuất" { return true }
      let footer = app.buttons.matching(NSPredicate(format: "label == %@ OR label == %@", "Sign out", "Đăng xuất")).firstMatch
      let top = app.navigationBars.firstMatch.exists ? app.navigationBars.firstMatch.frame.maxY : app.frame.minY
      let bottom = footer.exists ? footer.frame.minY - 24 : app.frame.maxY
      return element.frame.minY >= top && element.frame.maxY <= bottom
    }
    for _ in 0..<8 { if visiblyReachable() { return }; app.scrollViews.firstMatch.swipeUp() }
    XCTAssertTrue(visiblyReachable(), "Expected fully visible control above footer: " + element.debugDescription)
  }
  func menuChoice(_ app: XCUIApplication, _ label: String, _ option: String, _ selectedLabel: String? = nil) {
    let menu = app.buttons[label]; reachable(menu, app: app); menu.tap()
    capture(app, label + "-opened"); print("MENU_HIERARCHY " + app.debugDescription)
    let choice = app.buttons[option]; XCTAssertTrue(choice.waitForExistence(timeout: 5)); choice.tap()
    XCTAssertEqual(app.buttons[selectedLabel ?? label].value as? String, option)
  }
  func flow(accessibility: Bool) {
    let app = XCUIApplication()
    app.launchArguments = ["-UIPreferredContentSizeCategoryName", accessibility ? "UICTContentSizeCategoryAccessibilityXXXL" : "UICTContentSizeCategoryL"]
    app.launch(); capture(app, accessibility ? "large-sign-in" : "normal-sign-in")
    XCTAssertTrue(app.buttons["Đăng nhập"].waitForExistence(timeout: 10)); app.buttons["Đăng nhập"].tap()
    XCTAssertTrue(app.buttons["Cài đặt"].waitForExistence(timeout: 5)); app.buttons["Cài đặt"].tap()
    let dark = app.switches["Ưu tiên giao diện tối"]; reachable(dark, app: app); XCTAssertEqual(dark.value as? String, "0"); dark.tap(); XCTAssertEqual(dark.value as? String, "1")
    let compact = app.switches["Khoảng cách gọn"]; reachable(compact, app: app); compact.tap(); XCTAssertEqual(compact.value as? String, "1")
    menuChoice(app, "Độ tương phản", "Cao")
    capture(app, accessibility ? "large-vi-dark-high-compact" : "normal-vi-dark-high-compact")
    if accessibility { menuChoice(app, "Ngôn ngữ", "English", "Language") }
    else { let english = app.segmentedControls.buttons["English"]; reachable(english, app: app); english.tap() }
    XCTAssertTrue(app.switches["Prefer dark theme"].waitForExistence(timeout: 5)); XCTAssertEqual(app.switches["Prefer dark theme"].value as? String, "1")
    XCTAssertEqual(app.switches["Compact spacing"].value as? String, "1")
    XCTAssertEqual(app.buttons["Contrast"].value as? String, "High")
    menuChoice(app, "Contrast", "Standard")
    capture(app, accessibility ? "large-en-dark-standard-compact" : "normal-en-dark-standard-compact")
    let signout = app.buttons["Sign out"]; reachable(signout, app: app); signout.tap()
    XCTAssertTrue(app.buttons["Sign in"].waitForExistence(timeout: 5)); app.buttons["Sign in"].tap()
    XCTAssertTrue(app.buttons["Settings"].waitForExistence(timeout: 5)); app.buttons["Settings"].tap()
    XCTAssertEqual(app.switches["Compact spacing"].value as? String, "0")
    XCTAssertEqual(app.switches["Prefer dark theme"].value as? String, "1")
    XCTAssertEqual(app.buttons["Contrast"].value as? String, "Standard")
    capture(app, accessibility ? "large-reopened-settings" : "normal-reopened-settings")
    let darkAgain = app.switches["Prefer dark theme"]; reachable(darkAgain, app: app); darkAgain.tap(); XCTAssertEqual(darkAgain.value as? String, "0")
    menuChoice(app, "Contrast", "System")
    if accessibility { menuChoice(app, "Language", "Tiếng Việt", "Ngôn ngữ") }
    else { let vi = app.segmentedControls.buttons["Tiếng Việt"]; reachable(vi, app: app); vi.tap() }
    XCTAssertEqual(app.buttons["Độ tương phản"].value as? String, "Theo hệ thống")
    reachable(app.buttons["Đăng xuất"], app: app); app.buttons["Đăng xuất"].tap(); XCTAssertTrue(app.buttons["Đăng nhập"].waitForExistence(timeout: 5))
    capture(app, accessibility ? "large-returned-sign-in" : "normal-returned-sign-in"); app.terminate()
  }
  func testNormalRootFlow() { flow(accessibility: false) }
  func testAccessibilityRootFlow() { flow(accessibility: true) }
  func testEmailPurposeName() {
    let app = XCUIApplication(); app.launch(); capture(app, "email-purpose")
    XCTAssertEqual(app.textFields.firstMatch.label, "Email công việc"); app.terminate()
  }
  func testPasswordPurposeName() {
    let app = XCUIApplication(); app.launch(); capture(app, "password-purpose")
    XCTAssertEqual(app.secureTextFields.firstMatch.label, "Mật khẩu"); app.terminate()
  }
  func testLargeKeyboardActionReachability() {
    let app = XCUIApplication(); app.launchArguments = ["-UIPreferredContentSizeCategoryName", "UICTContentSizeCategoryAccessibilityXXXL"]; app.launch()
    app.secureTextFields.firstMatch.tap(); XCTAssertTrue(app.keyboards.firstMatch.waitForExistence(timeout: 10)); capture(app, "large-keyboard")
    let signIn = app.buttons["Đăng nhập"]
    capture(app, "large-keyboard-sign-in-target")
    XCTAssertTrue(app.keyboards.firstMatch.exists, "Keyboard remains present through the action check")
    XCTAssertLessThanOrEqual(signIn.frame.maxY, app.keyboards.firstMatch.frame.minY, "Sign-in action should be reachable above the keyboard without dismissal")
    XCTAssertTrue(signIn.isHittable)
    signIn.tap()
    XCTAssertTrue(app.buttons["Cài đặt"].waitForExistence(timeout: 5))
    capture(app, "keyboard-action-home")
    app.terminate()
  }
  func testEnglishPurposeNamesFollowPreferences() {
    let app = XCUIApplication(); app.launch(); app.buttons["Đăng nhập"].tap(); app.buttons["Cài đặt"].tap()
    app.segmentedControls.buttons["English"].tap(); app.buttons["Sign out"].tap(); capture(app, "english-purpose-names")
    XCTAssertEqual(app.textFields.firstMatch.label, "Work email")
    XCTAssertEqual(app.secureTextFields.firstMatch.label, "Password"); app.terminate()
  }

  func testLargeKeyboardCaptionReflow() {
    let app = XCUIApplication(); app.launchArguments = ["-UIPreferredContentSizeCategoryName", "UICTContentSizeCategoryAccessibilityXXXL"]; app.launch()
    let welcome = app.staticTexts["Chào mừng bạn trở lại. Đăng nhập để tiếp tục."]
    XCTAssertTrue(welcome.waitForExistence(timeout: 5)); let fullHeight = welcome.frame.height
    capture(app, "caption-before-keyboard")
    app.secureTextFields.firstMatch.tap(); XCTAssertTrue(app.keyboards.firstMatch.waitForExistence(timeout: 10))
    capture(app, "caption-after-keyboard")
    print("CAPTION_HEIGHT_BEFORE " + String(describing: fullHeight) + " AFTER " + String(describing: welcome.frame.height))
    XCTAssertGreaterThanOrEqual(welcome.frame.height, fullHeight - 1, "Keyboard should preserve full welcome paragraph height through reflow/scrolling")
    app.terminate()
  }

}
