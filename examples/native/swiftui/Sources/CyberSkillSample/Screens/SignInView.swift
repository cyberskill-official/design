import SwiftUI

struct SignInView: View {
  @EnvironmentObject private var preferences: SamplePreferences
  private var colors: SampleColors { preferences.colors }
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

        VStack(alignment: .leading, spacing: 8) {
          Text(preferences.text(.workEmail))
            .font(SampleFonts.font(size: 13, weight: .semibold))
            .foregroundStyle(colors.colorTextPrimary)
          TextField("you@cyberskill.world", text: $email)
            .accessibilityLabel(preferences.text(.workEmail))
            .textFieldStyle(.plain)
            .padding(.horizontal, CSTokens.componentTextfieldPaddingX)
            .padding(.vertical, CSTokens.componentTextfieldPaddingY)
            .frame(minHeight: CSTokens.componentTextfieldMinHeight)
            .background(colors.colorSurfacePanel)
            .overlay(
              RoundedRectangle(cornerRadius: 8)
                .stroke(colors.componentTextfieldBorderDefault, lineWidth: 1)
            )
        }

        VStack(alignment: .leading, spacing: 8) {
          Text(preferences.text(.password))
            .font(SampleFonts.font(size: 13, weight: .semibold))
            .foregroundStyle(colors.colorTextPrimary)
          SecureField("••••••••", text: $password)
            .accessibilityLabel(preferences.text(.password))
            .textFieldStyle(.plain)
            .padding(.horizontal, CSTokens.componentTextfieldPaddingX)
            .padding(.vertical, CSTokens.componentTextfieldPaddingY)
            .frame(minHeight: CSTokens.componentTextfieldMinHeight)
            .background(colors.colorSurfacePanel)
            .overlay(
              RoundedRectangle(cornerRadius: 8)
                .stroke(colors.componentTextfieldBorderDefault, lineWidth: 1)
            )
        }
      }
      .padding(24)
      .frame(maxWidth: .infinity, alignment: .topLeading)
    }
    .safeAreaInset(edge: .bottom, spacing: 0) {
      Button(action: onSuccess) {
        Text(preferences.text(.signIn))
          .font(SampleFonts.font(size: 15, weight: .semibold))
          .frame(maxWidth: .infinity)
          .frame(minHeight: CSTokens.componentButtonMdMinHeight)
          .foregroundStyle(colors.componentButtonPrimaryFg)
          .background(colors.componentButtonPrimaryBg)
          .clipShape(RoundedRectangle(cornerRadius: CSTokens.componentButtonRadius))
      }
      .buttonStyle(.plain)
      .padding(24)
      .background(colors.colorSurfacePage)
    }
    .background(colors.colorSurfacePage)
  }
}
