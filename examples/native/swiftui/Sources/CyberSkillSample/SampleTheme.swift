import SwiftUI

final class SamplePreferences: ObservableObject {
  @Published var dark = false
  @Published var language: SampleLanguage = .vi
  func text(_ key: SampleText) -> String { key.value(in: language) }
  var colors: SampleColors { SampleColors(dark: dark) }
}

struct SampleColors {
  let dark: Bool
  var colorSurfacePage: Color { dark ? CSTokens.colorSurfacePageDark : CSTokens.colorSurfacePage }
  var colorSurfacePanel: Color { dark ? CSTokens.colorSurfacePanelDark : CSTokens.colorSurfacePanel }
  var colorTextPrimary: Color { dark ? CSTokens.colorTextPrimaryDark : CSTokens.colorTextPrimary }
  var colorTextMuted: Color { dark ? CSTokens.colorTextMutedDark : CSTokens.colorTextMuted }
  var colorTextInverse: Color { dark ? CSTokens.colorTextInverseDark : CSTokens.colorTextInverse }
  var colorBorderDefault: Color { dark ? CSTokens.colorBorderDefaultDark : CSTokens.colorBorderDefault }
  var colorLink: Color { dark ? CSTokens.colorLinkDark : CSTokens.colorLink }
  var colorSemanticDanger: Color { dark ? CSTokens.colorSemanticDangerDark : CSTokens.colorSemanticDanger }
  var colorSemanticDangerFg: Color { dark ? CSTokens.colorSemanticDangerFgDark : CSTokens.colorSemanticDangerFg }
  var componentButtonPrimaryBg: Color { dark ? CSTokens.componentButtonPrimaryBgDark : CSTokens.componentButtonPrimaryBg }
  var componentButtonPrimaryFg: Color { dark ? CSTokens.componentButtonPrimaryFgDark : CSTokens.componentButtonPrimaryFg }
  var componentTextfieldBorderDefault: Color { dark ? CSTokens.componentTextfieldBorderDefaultDark : CSTokens.componentTextfieldBorderDefault }
}
