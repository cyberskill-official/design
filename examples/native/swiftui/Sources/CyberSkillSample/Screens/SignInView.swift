import SwiftUI
import CyberSkillDesign

struct SignInView: View {
  @EnvironmentObject private var preferences: SamplePreferences
  private var colors: SampleColors { preferences.colors }
  private var highContrast: Bool { preferences.contrast.resolve(systemHigh: preferences.systemHighContrast) }
  var onSuccess: () -> Void
  @State private var email = "you@cyberskill.world"
  @State private var password = ""

  var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 20) {
        Text(preferences.text(.signIn))
          .font(SampleFonts.font(size: 28, weight: .extraBold, relativeTo: .largeTitle))
          .foregroundStyle(colors.colorTextPrimary)
          .fixedSize(horizontal: false, vertical: true)
        Text(preferences.text(.welcome))
          .font(SampleFonts.font(size: 15))
          .foregroundStyle(colors.colorTextMuted)
          .fixedSize(horizontal: false, vertical: true)

        CSTextField(label: preferences.text(.workEmail), text: $email, dark: preferences.dark, highContrast: highContrast, compact: false)
        CSTextField(label: preferences.text(.password), text: $password, secure: true, dark: preferences.dark, highContrast: highContrast, compact: false)
      }
      .padding(24)
      .frame(maxWidth: .infinity, alignment: .topLeading)
    }
    .safeAreaInset(edge: .bottom, spacing: 0) {
      CSButton(title: preferences.text(.signIn), dark: preferences.dark, highContrast: highContrast, compact: false, action: onSuccess)
      .padding(24)
      .background(colors.colorSurfacePage)
    }
    .background(colors.colorSurfacePage)
  }
}
