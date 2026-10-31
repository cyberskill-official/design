import SwiftUI
import CyberSkillDesign

struct SettingsView: View {
  @EnvironmentObject private var preferences: SamplePreferences
  @Environment(\.dynamicTypeSize) private var dynamicTypeSize
  private var colors: SampleColors { preferences.colors }
  var onSignOut: () -> Void
  @State private var compact = false
  @State private var languageFocusId = UUID().uuidString
  @FocusState private var languageFocused: Bool

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

      CSCard(dark: preferences.dark, highContrast: preferences.contrast.resolve(systemHigh: preferences.systemHighContrast), compact: compact, spacing: controlGap, padding: 16) {
        CSSwitch(title: preferences.text(.preferDark), isOn: $preferences.dark, dark: preferences.dark, highContrast: preferences.contrast.resolve(systemHigh: preferences.systemHighContrast), compact: compact)
        CSSwitch(title: preferences.text(.compactSpacing), isOn: $compact, dark: preferences.dark, highContrast: preferences.contrast.resolve(systemHigh: preferences.systemHighContrast), compact: compact)
        Text(compact ? preferences.text(.compact) : preferences.text(.comfortable))
          .foregroundStyle(colors.colorTextPrimary)
          .fixedSize(horizontal: false, vertical: true)

        CSSelect(label: preferences.text(.contrast), value: preferences.text(preferences.contrast.label), selection: $preferences.contrast, dark: preferences.dark, highContrast: preferences.contrast.resolve(systemHigh: preferences.systemHighContrast), compact: compact) {
          ForEach(SampleContrast.allCases, id: \.self) { option in
            Text(preferences.text(option.label)).tag(option)
          }
        }

        if dynamicTypeSize.isAccessibilitySize {
          Menu {
            languagePicker
          } label: {
            menuLabel(preferences.language == .en ? "English" : "Tiếng Việt")
          }
          .focused($languageFocused)
          .onChange(of: languageFocused) { isFocused in
            if isFocused { claimLanguage() }
          }
          .simultaneousGesture(TapGesture().onEnded { claimLanguage() })
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

    }
    .padding(24)
    .frame(maxWidth: .infinity, alignment: .topLeading)
    }
    .safeAreaInset(edge: .bottom) {
      CSButton(title: preferences.text(.signOut), role: .danger, dark: preferences.dark, highContrast: preferences.contrast.resolve(systemHigh: preferences.systemHighContrast), compact: compact, paddingX: buttonPaddingX, paddingY: buttonPaddingY, action: onSignOut)
      .padding(24)
      .background(colors.colorSurfacePage)
    }
    .background(colors.colorSurfacePage)
  }

  private var languagePicker: some View {
    Picker(preferences.text(.language), selection: Binding(get: { preferences.language }, set: { next in
      claimLanguage()
      preferences.language = next
    })) {
      Text("English").tag(SampleLanguage.en)
      Text("Tiếng Việt").tag(SampleLanguage.vi)
    }
    .fixedSize(horizontal: false, vertical: true)
  }

  private func claimLanguage() {
    CSFocusRegistry.shared.claim(id: languageFocusId, restore: { languageFocused = true })
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
