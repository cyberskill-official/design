import SwiftUI

enum SampleContrast: String, CaseIterable {
  case system, standard, high
  func resolve(systemHigh: Bool) -> Bool { self == .high || self == .system && systemHigh }
  var label: SampleText {
    switch self {
    case .system: return .contrastSystem
    case .standard: return .contrastStandard
    case .high: return .contrastHigh
    }
  }
}

final class SamplePreferences: ObservableObject {
  @Published var dark = false
  @Published var language: SampleLanguage = .vi
  @Published var contrast: SampleContrast = .system
  @Published var systemHighContrast = false
  func text(_ key: SampleText) -> String { key.value(in: language) }
  var colors: SampleColors { SampleColors(dark: dark, highContrast: contrast.resolve(systemHigh: systemHighContrast)) }
}

struct SampleColors {
  let dark: Bool
  var highContrast = false
  var colorSurfacePage: Color { dark ? CSTokens.colorSurfacePageDark : CSTokens.colorSurfacePage }
  var colorSurfacePanel: Color { dark ? CSTokens.colorSurfacePanelDark : CSTokens.colorSurfacePanel }
  var colorTextPrimary: Color { dark ? CSTokens.colorTextPrimaryDark : CSTokens.colorTextPrimary }
  var colorTextMuted: Color { highContrast ? (dark ? CSTokens.colorTextMutedHighDark : CSTokens.colorTextMutedHighLight) : (dark ? CSTokens.colorTextMutedDark : CSTokens.colorTextMuted) }
  var colorTextInverse: Color { dark ? CSTokens.colorTextInverseDark : CSTokens.colorTextInverse }
  var colorBorderDefault: Color { highContrast ? (dark ? CSTokens.colorBorderDefaultHighDark : CSTokens.colorBorderDefaultHighLight) : (dark ? CSTokens.colorBorderDefaultDark : CSTokens.colorBorderDefault) }
  var colorLink: Color { dark ? CSTokens.colorLinkDark : CSTokens.colorLink }
  var colorSemanticDangerText: Color { dark ? CSTokens.colorSemanticDangerTextDark : CSTokens.colorSemanticDangerText }
  var colorSemanticDanger: Color { dark ? CSTokens.colorSemanticDangerDark : CSTokens.colorSemanticDanger }
  var colorSemanticDangerFg: Color { dark ? CSTokens.colorSemanticDangerFgDark : CSTokens.colorSemanticDangerFg }
  var componentButtonPrimaryBg: Color { dark ? CSTokens.componentButtonPrimaryBgDark : CSTokens.componentButtonPrimaryBg }
  var componentButtonPrimaryFg: Color { dark ? CSTokens.componentButtonPrimaryFgDark : CSTokens.componentButtonPrimaryFg }
  var componentTextfieldBorderDefault: Color { dark ? CSTokens.componentTextfieldBorderDefaultDark : CSTokens.componentTextfieldBorderDefault }
}
