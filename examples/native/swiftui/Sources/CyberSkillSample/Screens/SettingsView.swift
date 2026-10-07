import SwiftUI

struct SettingsView: View {
  @EnvironmentObject private var preferences: SamplePreferences
  private var colors: SampleColors { preferences.colors }
  var onSignOut: () -> Void
  @State private var compact = false

  private var controlGap: CGFloat { compact ? CSTokens.densityControlGapCompact : CSTokens.densityControlGapComfortable }
  private var buttonPaddingX: CGFloat { compact ? CSTokens.componentButtonMdPaddingXCompact : CSTokens.componentButtonMdPaddingXComfortable }
  private var buttonPaddingY: CGFloat { compact ? CSTokens.componentButtonMdPaddingYCompact : CSTokens.componentButtonMdPaddingYComfortable }
  @State private var language = "English"

  var body: some View {
    VStack(alignment: .leading, spacing: 20) {
      Text("Settings")
        .font(.system(size: 24, weight: .heavy))
        .foregroundStyle(colors.colorTextPrimary)
      Text("Third screen — identity & session.")
        .font(.system(size: 13))
        .foregroundStyle(colors.colorTextMuted)

      VStack(alignment: .leading, spacing: controlGap) {
        Toggle(isOn: $preferences.dark) {
          Text("Prefer dark theme")
            .foregroundStyle(colors.colorTextPrimary)
        }
        .tint(CSTokens.colorBrandOchre)

        Toggle("Compact spacing", isOn: $compact)
          .tint(CSTokens.colorBrandOchre)
        Text(compact ? "Compact" : "Comfortable")
          .foregroundStyle(colors.colorTextPrimary)

        Picker("Language", selection: $language) {
          Text("English").tag("English")
          Text("Tiếng Việt").tag("Tiếng Việt")
        }
        .pickerStyle(.segmented)

        HStack {
          Text("Brand umber")
            .foregroundStyle(colors.colorTextPrimary)
          Spacer()
          RoundedRectangle(cornerRadius: 6)
            .fill(CSTokens.colorBrandUmber)
            .frame(width: 36, height: 24)
        }
        HStack {
          Text("Brand ochre")
            .foregroundStyle(colors.colorTextPrimary)
          Spacer()
          RoundedRectangle(cornerRadius: 6)
            .fill(CSTokens.colorBrandOchre)
            .frame(width: 36, height: 24)
        }
      }
      .padding(16)
      .background(colors.colorSurfacePanel)
      .clipShape(RoundedRectangle(cornerRadius: 12))
      .overlay(
        RoundedRectangle(cornerRadius: 12)
          .stroke(colors.colorBorderDefault, lineWidth: 1)
      )

      Spacer()
      Button(action: onSignOut) {
        Text("Sign out")
          .padding(.horizontal, buttonPaddingX)
          .padding(.vertical, buttonPaddingY)
          .frame(maxWidth: .infinity)
          .frame(minHeight: CSTokens.componentButtonMdMinHeight)
          .foregroundStyle(colors.colorTextInverse)
          .background(colors.colorSemanticDanger)
          .clipShape(RoundedRectangle(cornerRadius: CSTokens.componentButtonRadius))
      }
      .buttonStyle(.plain)
    }
    .padding(24)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .background(colors.colorSurfacePage)
  }
}
