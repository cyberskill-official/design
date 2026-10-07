import SwiftUI

struct SettingsView: View {
  @EnvironmentObject private var preferences: SamplePreferences
  private var colors: SampleColors { preferences.colors }
  var onSignOut: () -> Void
  @State private var compact = false

  private var controlGap: CGFloat { compact ? CSTokens.densityControlGapCompact : CSTokens.densityControlGapComfortable }
  private var buttonPaddingX: CGFloat { compact ? CSTokens.componentButtonMdPaddingXCompact : CSTokens.componentButtonMdPaddingXComfortable }
  private var buttonPaddingY: CGFloat { compact ? CSTokens.componentButtonMdPaddingYCompact : CSTokens.componentButtonMdPaddingYComfortable }

  var body: some View {
    VStack(alignment: .leading, spacing: 20) {
      Text(preferences.text(.settings))
        .font(.system(size: 24, weight: .heavy))
        .foregroundStyle(colors.colorTextPrimary)
      Text(preferences.text(.settingsDescription))
        .font(.system(size: 13))
        .foregroundStyle(colors.colorTextMuted)

      VStack(alignment: .leading, spacing: controlGap) {
        Toggle(isOn: $preferences.dark) {
          Text(preferences.text(.preferDark))
            .foregroundStyle(colors.colorTextPrimary)
        }
        .tint(CSTokens.colorBrandOchre)

        Toggle(preferences.text(.compactSpacing), isOn: $compact)
          .tint(CSTokens.colorBrandOchre)
        Text(compact ? preferences.text(.compact) : preferences.text(.comfortable))
          .foregroundStyle(colors.colorTextPrimary)

        Picker(preferences.text(.language), selection: $preferences.language) {
          Text("English").tag(SampleLanguage.en)
          Text("Tiếng Việt").tag(SampleLanguage.vi)
        }
        .pickerStyle(.segmented)

        HStack {
          Text(preferences.text(.brandUmber))
            .foregroundStyle(colors.colorTextPrimary)
          Spacer()
          RoundedRectangle(cornerRadius: 6)
            .fill(CSTokens.colorBrandUmber)
            .frame(width: 36, height: 24)
        }
        HStack {
          Text(preferences.text(.brandOchre))
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
        Text(preferences.text(.signOut))
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
