import SwiftUI

struct SettingsView: View {
  @EnvironmentObject private var preferences: SamplePreferences
  @Environment(\.dynamicTypeSize) private var dynamicTypeSize
  private var colors: SampleColors { preferences.colors }
  var onSignOut: () -> Void
  @State private var compact = false

  private var controlGap: CGFloat { compact ? CSTokens.densityControlGapCompact : CSTokens.densityControlGapComfortable }
  private var buttonPaddingX: CGFloat { compact ? CSTokens.componentButtonMdPaddingXCompact : CSTokens.componentButtonMdPaddingXComfortable }
  private var buttonPaddingY: CGFloat { compact ? CSTokens.componentButtonMdPaddingYCompact : CSTokens.componentButtonMdPaddingYComfortable }

  var body: some View {
    ScrollView {
    VStack(alignment: .leading, spacing: 20) {
      Text(preferences.text(.settings))
        .font(SampleFonts.font(size: 24, weight: .extraBold, relativeTo: .title))
        .foregroundStyle(colors.colorTextPrimary)
        .fixedSize(horizontal: false, vertical: true)
      Text(preferences.text(.settingsDescription))
        .font(SampleFonts.font(size: 13))
        .foregroundStyle(colors.colorTextMuted)
        .fixedSize(horizontal: false, vertical: true)

      VStack(alignment: .leading, spacing: controlGap) {
        Toggle(isOn: $preferences.dark) {
          Text(preferences.text(.preferDark))
            .foregroundStyle(colors.colorTextPrimary)
            .fixedSize(horizontal: false, vertical: true)
        }
        .tint(CSTokens.colorBrandOchre)

        Toggle(isOn: $compact) {
          Text(preferences.text(.compactSpacing))
            .fixedSize(horizontal: false, vertical: true)
        }
          .tint(CSTokens.colorBrandOchre)
        Text(compact ? preferences.text(.compact) : preferences.text(.comfortable))
          .foregroundStyle(colors.colorTextPrimary)
          .fixedSize(horizontal: false, vertical: true)

        Menu {
          Picker(preferences.text(.contrast), selection: $preferences.contrast) {
            ForEach(SampleContrast.allCases, id: \.self) { option in
              Text(preferences.text(option.label)).tag(option)
            }
          }
        } label: {
          menuLabel(preferences.text(preferences.contrast.label))
        }
        .accessibilityLabel(preferences.text(.contrast))
        .accessibilityValue(preferences.text(preferences.contrast.label))

        if dynamicTypeSize.isAccessibilitySize {
          Menu {
            languagePicker
          } label: {
            menuLabel(preferences.language == .en ? "English" : "Tiếng Việt")
          }
          .accessibilityLabel(preferences.text(.language))
          .accessibilityValue(preferences.language == .en ? "English" : "Tiếng Việt")
        } else {
          languagePicker.pickerStyle(.segmented)
        }

        HStack {
          Text(preferences.text(.brandUmber))
            .foregroundStyle(colors.colorTextPrimary)
            .fixedSize(horizontal: false, vertical: true)
          Spacer()
          RoundedRectangle(cornerRadius: 6)
            .fill(CSTokens.colorBrandUmber)
            .frame(width: 36, height: 24)
        }
        HStack {
          Text(preferences.text(.brandOchre))
            .foregroundStyle(colors.colorTextPrimary)
            .fixedSize(horizontal: false, vertical: true)
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

    }
    .padding(24)
    .frame(maxWidth: .infinity, alignment: .topLeading)
    }
    .safeAreaInset(edge: .bottom) {
      Button(action: onSignOut) {
        Text(preferences.text(.signOut))
          .fixedSize(horizontal: false, vertical: true)
          .padding(.horizontal, buttonPaddingX)
          .padding(.vertical, buttonPaddingY)
          .frame(maxWidth: .infinity)
          .frame(minHeight: CSTokens.componentButtonMdMinHeight)
          .foregroundStyle(colors.colorTextInverse)
          .background(colors.colorSemanticDanger)
          .clipShape(RoundedRectangle(cornerRadius: CSTokens.componentButtonRadius))
      }
      .buttonStyle(.plain)
      .padding(24)
      .background(colors.colorSurfacePage)
    }
    .background(colors.colorSurfacePage)
  }

  private var languagePicker: some View {
    Picker(preferences.text(.language), selection: $preferences.language) {
      Text("English").tag(SampleLanguage.en)
      Text("Tiếng Việt").tag(SampleLanguage.vi)
    }
    .fixedSize(horizontal: false, vertical: true)
  }

  private func menuLabel(_ value: String) -> some View {
    HStack(alignment: .firstTextBaseline, spacing: 8) {
      Text(value)
        .frame(maxWidth: .infinity, alignment: .leading)
        .fixedSize(horizontal: false, vertical: true)
      Image(systemName: "chevron.down")
        .accessibilityHidden(true)
    }
    .frame(minHeight: CSTokens.componentButtonMdMinHeight)
    .foregroundStyle(colors.colorLink)
    .contentShape(Rectangle())
  }
}
