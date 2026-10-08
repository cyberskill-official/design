import Foundation
import CoreText
import SwiftUI

/// Process-local registration of the pinned, bundled native sample fonts.
enum SampleFonts {
  enum Weight: String, CaseIterable {
    case regular = "Regular"
    case medium = "Medium"
    case semibold = "SemiBold"
    case extraBold = "ExtraBold"
  }

  private static let postscriptFamily = CSTokens.fontFamilyUi.split(separator: ",")[0]
    .trimmingCharacters(in: .whitespaces).replacingOccurrences(of: " ", with: "")

  private static let registration: Void = {
    do { try register(in: .module) }
    catch { fatalError("Cannot load bundled CyberSkill sample fonts: \(error)") }
  }()

  static func font(size: CGFloat, weight: Weight = .regular, relativeTo style: Font.TextStyle = .body) -> Font {
    _ = registration
    return .custom(postscriptFamily + "-" + weight.rawValue, size: size, relativeTo: style)
  }

  static func register(in bundle: Bundle) throws {
    for weight in Weight.allCases {
      let name = postscriptFamily + "-" + weight.rawValue
      guard let url = bundle.url(forResource: name, withExtension: "ttf", subdirectory: "Fonts") else {
        throw NSError(domain: "CyberSkillSampleFonts", code: 1, userInfo: [NSLocalizedDescriptionKey: "Missing font resource: " + name])
      }
      var error: Unmanaged<CFError>?
      if !CTFontManagerRegisterFontsForURL(url as CFURL, .process, &error) {
        if let error = error?.takeRetainedValue() { throw error as Error }
        throw NSError(domain: "CyberSkillSampleFonts", code: 2, userInfo: [NSLocalizedDescriptionKey: "Font registration failed: " + name])
      }
    }
  }
}
