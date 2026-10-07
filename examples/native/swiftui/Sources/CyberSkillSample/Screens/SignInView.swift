import SwiftUI

struct SignInView: View {
  @EnvironmentObject private var preferences: SamplePreferences
  private var colors: SampleColors { preferences.colors }
  var onSuccess: () -> Void
  @State private var email = "you@cyberskill.world"
  @State private var password = ""

  var body: some View {
    VStack(alignment: .leading, spacing: 20) {
      Text("Sign in")
        .font(.system(size: 28, weight: .heavy))
        .foregroundStyle(colors.colorTextPrimary)
      Text("Welcome back. Đăng nhập để tiếp tục.")
        .font(.system(size: 15))
        .foregroundStyle(colors.colorTextMuted)

      VStack(alignment: .leading, spacing: 8) {
        Text("Work email")
          .font(.system(size: 13, weight: .semibold))
          .foregroundStyle(colors.colorTextPrimary)
        TextField("you@cyberskill.world", text: $email)
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
        Text("Password")
          .font(.system(size: 13, weight: .semibold))
          .foregroundStyle(colors.colorTextPrimary)
        SecureField("••••••••", text: $password)
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

      Button(action: onSuccess) {
        Text("Sign in")
          .font(.system(size: 15, weight: .semibold))
          .frame(maxWidth: .infinity)
          .frame(minHeight: CSTokens.componentButtonMdMinHeight)
          .foregroundStyle(colors.componentButtonPrimaryFg)
          .background(colors.componentButtonPrimaryBg)
          .clipShape(RoundedRectangle(cornerRadius: CSTokens.componentButtonRadius))
      }
      .buttonStyle(.plain)

      Spacer(minLength: 0)
    }
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .background(colors.colorSurfacePage)
  }
}
