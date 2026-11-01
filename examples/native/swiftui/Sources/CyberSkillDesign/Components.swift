import SwiftUI

public enum CSButtonRole {
  case primary
  case danger
}

public enum CSInteractionModel {
  public static let hoverShadowRed = 69
  public static let hoverShadowGreen = 33
  public static let hoverShadowBlue = 14
  public static let hoverShadowAlpha = 0.24
  public static func hoverShadowOffsetY() -> Double { 8 }
  public static func hoverShadowBlur() -> Double { 20 }
  public static func hoverTranslateY(hovered: Bool, active: Bool = false, disabled: Bool = false, reducedMotion: Bool = false) -> Double {
    if disabled || active || reducedMotion || !hovered { return 0 }
    return -1
  }
  public static func showsHoverShadow(hovered: Bool, active: Bool = false, disabled: Bool = false) -> Bool {
    hovered && !active && !disabled
  }
  public static func showsActiveShadow(active: Bool, disabled: Bool = false) -> Bool {
    active && !disabled
  }
  public static func focusHaloWidth(focused: Bool) -> Double {
    focused ? 5 : 0
  }
  public static func cmdkSearchOuterHaloWidth(focused: Bool) -> Double {
    focused ? 5 : 0
  }
  public static func cmdkSearchInsetHaloWidth(focused: Bool) -> Double {
    focused ? 4 : 0
  }
  public static func riseOffsetY(reducedMotion: Bool = false) -> Double {
    reducedMotion ? 0 : 10
  }
  public static func riseDelayMs(step: Int, reducedMotion: Bool = false) -> Double {
    if reducedMotion { return 0 }
    switch step {
    case 2: return 80
    case 3: return 160
    case 4: return 240
    default: return 0
    }
  }
  public static func entranceDurationMs(pack: CSTokenModePack, reducedMotion: Bool = false) -> Double {
    reducedMotion ? 0 : pack.durationSlow.value
  }
  public static func dialogDurationMs(pack: CSTokenModePack, reducedMotion: Bool = false) -> Double {
    reducedMotion ? 0 : pack.durationBase.value
  }
}

public enum CSA11yModel {
  public static func srOnlySize() -> Double { 1 }
  public static func srOnlyMargin() -> Double { -1 }
  public static func srOnlyPadding() -> Double { 0 }
  public static func srOnlyBorderWidth() -> Double { 0 }
  public static func touchTargetMinSize(coarse: Bool = true) -> Double { coarse ? 44 : 0 }
  public static func checkRadioInputBoxSize(coarse: Bool = true) -> Double { coarse ? 24 : 18 }
  public static func tabsScrollbarHidden(coarse: Bool = true) -> Bool { coarse }
  public static func inputGroupButtonMinWidth(coarse: Bool = true) -> Double { coarse ? 46 : 0 }
  public static let colorPickerColumns = 5
  public static func colorPickerColumnWidth(coarse: Bool = true) -> Double { coarse ? 44 : 28 }
  public static let calendarColumns = 7
  public static func calendarColumnWidth(coarse: Bool = true) -> Double { coarse ? 44 : 34 }
  public static func calendarMinGridWidth(coarse: Bool = true) -> Double {
    Double(calendarColumns) * calendarColumnWidth(coarse: coarse)
  }
  public static func carouselViewMinHeight(coarse: Bool = true) -> Double { coarse ? 64 : 0 }
  public static func carouselViewPaddingInline(coarse: Bool = true) -> Double { coarse ? 64 : 0 }
  public static func carouselDotButtonSize(coarse: Bool = true) -> Double { coarse ? 44 : 8 }
  public static func carouselDotRadius() -> Double { 4.5 }
  public static func carouselDotOuterStop() -> Double { 5 }
  public static func splitterMinBlockSize(coarse: Bool = true) -> Double { coarse ? 46 : 0 }
  public static func splitterBarMinSize(coarse: Bool = true) -> Double { coarse ? 44 : 0 }
  public static func sliderBlockSize(coarse: Bool = true) -> Double { coarse ? 44 : 22 }
  public static func reducedMotionDurationMs() -> Double { 0.01 }
  public static func reducedMotionIterationCount() -> Int { 1 }
  public static func effectiveDurationMs(_ durationMs: Double, reducedMotion: Bool) -> Double {
    reducedMotion ? reducedMotionDurationMs() : durationMs
  }
  public static let highContrastLightBorderHex = "#9a8060"
  public static let highContrastLightMutedHex = "#45210e"
  public static let highContrastDarkBorderHex = "#7a6450"
  public static let highContrastDarkMutedHex = "#f5ead9"
  public static func appliesHighContrastOverride(prefersContrastMore: Bool, contrastAttr: String? = nil) -> Bool {
    prefersContrastMore && contrastAttr != "standard"
  }
  public static func highContrastBorderHex(dark: Bool) -> String {
    dark ? highContrastDarkBorderHex : highContrastLightBorderHex
  }
  public static func highContrastMutedHex(dark: Bool) -> String {
    dark ? highContrastDarkMutedHex : highContrastLightMutedHex
  }
  public static func forcedColorsSwitchBorderWidth() -> Double { 1 }
  public static func forcedColorsCarouselDotBorderWidth(current: Bool) -> Double { current ? 3 : 1 }
  public static func forcedColorsSelectedTabBorderBottomWidth(selected: Bool) -> Double { selected ? 3 : 0 }
  public static func forcedColorsSegmentedBorderWidth() -> Double { 2 }
  public static func forcedColorsToggleOutlineWidth(pressed: Bool, focusVisible: Bool = false) -> Double {
    (pressed && !focusVisible) ? 2 : 0
  }
  public static func forcedColorsToggleOutlineOffset() -> Double { -4 }
}

public enum CSControlMode {
  public static func pack(dark: Bool, highContrast: Bool, compact: Bool) -> CSTokenModePack {
    let scheme: CSColorScheme = dark ? .dark : .light
    let theme: CSTheme = dark ? .dark : .light
    return try! CSModes.resolve(
      theme: theme,
      colorScheme: scheme,
      element: nil,
      variant: nil,
      density: compact ? .compact : .comfortable,
      contrast: highContrast ? .high : .standard,
      style: .liquidGlass
    )
  }
}

extension CSDimension {
  public var points: CGFloat {
    CGFloat(unit == .rem ? value * 16 : value)
  }
}

extension CSColorValue {
  public var color: Color {
    let channels = colorSpace == .srgb ? components : CSColorValue.oklabToSrgb(components)
    return Color(red: channels[0], green: channels[1], blue: channels[2], opacity: alpha)
  }

  static func oklabToSrgb(_ lab: [Double]) -> [Double] {
    let L = lab[0], a = lab[1], b = lab[2]
    let l_ = L + 0.3963377774 * a + 0.2158037573 * b
    let m_ = L - 0.1055613458 * a - 0.0638541728 * b
    let s_ = L - 0.0894841775 * a - 1.2914855480 * b
    let l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_
    let linear = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    ]
    return linear.map { channel in
      let clamped = min(1, max(0, channel))
      return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * pow(clamped, 1 / 2.4) - 0.055
    }
  }
}

public enum CSButtonVariant: String, CaseIterable {
  case primary = "primary"
  case secondary = "secondary"
  case tertiary = "tertiary"
  case ghost = "ghost"
  case danger = "danger"
  case dangerGhost = "danger-ghost"
}

public enum CSButtonSize: String, CaseIterable {
  case xs = "xs"
  case sm = "sm"
  case md = "md"
  case lg = "lg"
}

public enum CSButtonModel {
  public static let dangerGhostHoverAlpha = 0.03
  public static let disabledOpacity = 0.58

  public static func resolveVariant(_ raw: String?) -> CSButtonVariant {
    guard let raw, let found = CSButtonVariant(rawValue: raw) else { return .primary }
    return found
  }

  public static func resolveSize(_ raw: String?) -> CSButtonSize {
    guard let raw, let found = CSButtonSize(rawValue: raw) else { return .md }
    return found
  }

  public static func isDisabled(disabled: Bool, loading: Bool) -> Bool {
    disabled || loading
  }

  public static func ariaBusy(loading: Bool) -> String? {
    loading ? "true" : nil
  }

  public static func showsIcon(_ icon: String?) -> Bool {
    guard let icon else { return false }
    return !icon.isEmpty
  }

  public static func opacity(disabled: Bool, loading: Bool) -> Double {
    isDisabled(disabled: disabled, loading: loading) ? disabledOpacity : 1.0
  }

  public static func fontWeight() -> Int { 700 }
  public static func lineHeight() -> Double { 1.2 }
  public static func gap(_ pack: CSTokenModePack) -> Double { pack.componentButtonGap.points }
  public static func radius(_ pack: CSTokenModePack) -> Double { pack.componentButtonRadius.points }
  public static func borderWidth() -> Double { 1 }
  public static func hoverBrightness(_ variant: CSButtonVariant) -> Double {
    (variant == .primary || variant == .danger) ? 1.08 : 1.0
  }
  public static func activeTranslateY() -> Double { 0.5 }
  public static func spinnerBorderWidth() -> Double { 2 }
  public static func spinnerDurationMs() -> Double { 600 }
  public static func spinnerSpins(reducedMotion: Bool) -> Bool { !reducedMotion }

  public static func minHeight(_ size: CSButtonSize, pack: CSTokenModePack, coarse: Bool = false) -> Double {
    switch size {
    case .xs: return (coarse ? pack.componentButtonXsMinHeightCoarse : pack.componentButtonXsMinHeight).points
    case .sm: return (coarse ? pack.componentButtonSmMinHeightCoarse : pack.componentButtonSmMinHeight).points
    case .md: return (coarse ? pack.componentButtonMdMinHeightCoarse : pack.componentButtonMdMinHeight).points
    case .lg: return pack.componentButtonLgMinHeight.points
    }
  }

  public static func minWidth(_ size: CSButtonSize, pack: CSTokenModePack) -> Double {
    switch size {
    case .xs: return pack.componentButtonXsMinWidth.points
    case .sm: return pack.componentButtonSmMinHeight.points
    case .md: return pack.componentButtonMdMinHeight.points
    case .lg: return 0
    }
  }

  public static func paddingY(_ size: CSButtonSize, pack: CSTokenModePack) -> Double {
    switch size {
    case .xs: return pack.componentButtonXsPaddingY.points
    case .sm: return pack.componentButtonSmPaddingY.points
    case .md: return pack.componentButtonMdPaddingY.points
    case .lg: return pack.componentButtonLgPaddingY.points
    }
  }

  public static func paddingX(_ size: CSButtonSize, pack: CSTokenModePack) -> Double {
    switch size {
    case .xs: return pack.componentButtonXsPaddingX.points
    case .sm: return pack.componentButtonSmPaddingX.points
    case .md: return pack.componentButtonMdPaddingX.points
    case .lg: return pack.componentButtonLgPaddingX.points
    }
  }

  public static func fontSize(_ size: CSButtonSize, pack: CSTokenModePack) -> Double {
    size == .xs ? pack.fontSizeSm.points : pack.fontSizeBase.points
  }

  public static func backgroundColor(_ variant: CSButtonVariant, pack: CSTokenModePack, hovered: Bool = false) -> CSColorValue? {
    switch variant {
    case .primary: return pack.componentButtonPrimaryBg
    case .secondary: return hovered ? pack.colorSurfaceRaised : pack.colorSurfacePanel
    case .tertiary: return pack.colorSurfaceRaised
    case .ghost: return hovered ? pack.colorSurfaceRaised : nil
    case .danger: return pack.colorSemanticDanger
    case .dangerGhost:
      return hovered
        ? CSColorValue(colorSpace: pack.colorSemanticDanger.colorSpace, components: pack.colorSemanticDanger.components, alpha: dangerGhostHoverAlpha)
        : nil
    }
  }

  public static func foregroundColor(_ variant: CSButtonVariant, pack: CSTokenModePack, dark: Bool = false) -> CSColorValue {
    switch variant {
    case .primary: return pack.componentButtonPrimaryFg
    case .secondary: return dark ? pack.colorBrandOchre : pack.colorBrandUmber
    case .tertiary, .ghost: return dark ? pack.colorTextPrimary : pack.colorBrandUmber
    case .danger: return pack.colorSemanticDangerFg
    case .dangerGhost: return pack.colorSemanticDangerText
    }
  }

  public static func borderColor(_ variant: CSButtonVariant, pack: CSTokenModePack, dark: Bool = false, hovered: Bool = false) -> CSColorValue? {
    switch variant {
    case .secondary: return dark ? pack.colorBrandOchre : pack.colorBrandUmber
    case .tertiary: return hovered ? pack.colorBorderDefault : nil
    case .primary, .ghost, .danger, .dangerGhost: return nil
    }
  }
}

public struct CSButton: View {
  let title: String
  let role: CSButtonRole
  let variant: CSButtonVariant?
  let size: CSButtonSize
  let loading: Bool
  let disabled: Bool
  let fullWidth: Bool
  let icon: String?
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  var paddingX: CGFloat?
  var paddingY: CGFloat?
  let action: () -> Void

  public init(title: String, role: CSButtonRole = .primary, variant: CSButtonVariant? = nil, size: CSButtonSize = .md, loading: Bool = false, disabled: Bool = false, fullWidth: Bool = true, icon: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, paddingX: CGFloat? = nil, paddingY: CGFloat? = nil, action: @escaping () -> Void) {
    self.title = title
    self.role = role
    self.variant = variant
    self.size = size
    self.loading = loading
    self.disabled = disabled
    self.fullWidth = fullWidth
    self.icon = icon
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.paddingX = paddingX
    self.paddingY = paddingY
    self.action = action
  }

  @State private var focusId = UUID().uuidString
  @State private var hovered = false
  @FocusState private var ownerFocused: Bool
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let activeVariant = variant ?? (role == .primary ? .primary : .danger)
    let isOff = CSButtonModel.isDisabled(disabled: disabled, loading: loading)
    let fill = CSButtonModel.backgroundColor(activeVariant, pack: pack, hovered: hovered)?.color ?? .clear
    let ink = CSButtonModel.foregroundColor(activeVariant, pack: pack, dark: dark).color
    let stroke = CSButtonModel.borderColor(activeVariant, pack: pack, dark: dark, hovered: hovered)?.color ?? .clear
    let restore = { ownerFocused = true }
    let liftY = CGFloat(CSInteractionModel.hoverTranslateY(hovered: hovered, disabled: isOff, reducedMotion: reduceMotion))
    let showHoverShadow = CSInteractionModel.showsHoverShadow(hovered: hovered, disabled: isOff)
    let hoverShadowColor = Color(.sRGB, red: Double(CSInteractionModel.hoverShadowRed) / 255.0, green: Double(CSInteractionModel.hoverShadowGreen) / 255.0, blue: Double(CSInteractionModel.hoverShadowBlue) / 255.0, opacity: CSInteractionModel.hoverShadowAlpha)
    let haloWidth = CGFloat(CSInteractionModel.focusHaloWidth(focused: ownerFocused))
    let fontPts = CGFloat(CSButtonModel.fontSize(size, pack: pack))
    Button(action: {
      if isOff { return }
      CSFocusRegistry.shared.claim(id: focusId, restore: restore)
      action()
    }) {
      HStack(spacing: CGFloat(CSButtonModel.gap(pack))) {
        if CSButtonModel.showsIcon(icon) {
          CSIcon(name: icon ?? "", label: "", dark: dark, highContrast: highContrast, compact: compact)
            .accessibilityHidden(true)
        }
        Text(title)
          .font(.system(size: fontPts, weight: .bold))
          .fixedSize(horizontal: false, vertical: true)
        if loading {
          Circle()
            .strokeBorder(ink, lineWidth: CGFloat(CSButtonModel.spinnerBorderWidth()))
            .frame(width: fontPts, height: fontPts)
            .accessibilityHidden(true)
        }
      }
      .frame(maxWidth: fullWidth ? .infinity : nil)
      .padding(.horizontal, paddingX ?? CGFloat(CSButtonModel.paddingX(size, pack: pack)))
      .padding(.vertical, paddingY ?? CGFloat(CSButtonModel.paddingY(size, pack: pack)))
      .frame(minWidth: CGFloat(CSButtonModel.minWidth(size, pack: pack)), minHeight: CGFloat(CSButtonModel.minHeight(size, pack: pack)))
      .foregroundStyle(ink)
      .background(fill)
      .clipShape(RoundedRectangle(cornerRadius: CGFloat(CSButtonModel.radius(pack))))
      .overlay(
        RoundedRectangle(cornerRadius: CGFloat(CSButtonModel.radius(pack)))
          .stroke(stroke, lineWidth: CGFloat(CSButtonModel.borderWidth()))
      )
      .overlay(
        RoundedRectangle(cornerRadius: CGFloat(CSButtonModel.radius(pack)))
          .stroke(pack.colorAccentOchre.color, lineWidth: haloWidth)
      )
      .shadow(
        color: showHoverShadow ? hoverShadowColor : .clear,
        radius: showHoverShadow ? CGFloat(CSInteractionModel.hoverShadowBlur()) : 0,
        x: 0,
        y: showHoverShadow ? CGFloat(CSInteractionModel.hoverShadowOffsetY()) : 0
      )
      .offset(y: liftY)
      .opacity(CSButtonModel.opacity(disabled: disabled, loading: loading))
    }
    .buttonStyle(.plain)
    .disabled(isOff)
    .onHover { hovered = $0 }
    .focused($ownerFocused)
    .accessibilityLabel(title)
    .onChange(of: ownerFocused) { isFocused in
      if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true }) }
    }
    .onDisappear { CSFocusRegistry.shared.disconnect(id: focusId) }
  }
}

public enum CSTextFieldModel {
  public static let placeholderOpacity = 0.7
  public static let disabledOpacity = 0.58

  public static func showsError(_ error: String?) -> Bool {
    if let error { return !error.isEmpty }
    return false
  }
  public static func showsDescription(_ description: String?) -> Bool {
    if let description { return !description.isEmpty }
    return false
  }
  public static func isAlert(_ error: String?) -> Bool { showsError(error) }
  public static func gap() -> Double { 6 }
  public static func labelFontWeight() -> Int { 700 }
  public static func descriptionFontSize() -> Double { 14 }
  public static func errorFontSize() -> Double { 14 }
  public static func borderWidth() -> Double { 1 }
  public static func radius(_ pack: CSTokenModePack) -> Double { pack.radiusMd.points }
  public static func minHeight(_ pack: CSTokenModePack) -> Double { pack.componentTextfieldMinHeight.points }
  public static func paddingY(_ pack: CSTokenModePack) -> Double { pack.componentTextfieldPaddingY.points }
  public static func paddingX(_ pack: CSTokenModePack) -> Double { pack.componentTextfieldPaddingX.points }
  public static func opacity(disabled: Bool) -> Double { disabled ? disabledOpacity : 1.0 }
  public static func borderColor(invalid: Bool, pack: CSTokenModePack) -> CSColorValue {
    invalid ? pack.colorSemanticDanger : pack.componentTextfieldBorderDefault
  }
}

public struct CSTextField: View {
  let label: String
  @Binding var text: String
  public let description: String?
  public let error: String?
  let secure: Bool
  let disabled: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool

  public init(label: String, text: Binding<String>, secure: Bool = false, disabled: Bool = false, description: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, error: String? = nil) {
    self.label = label
    _text = text
    self.description = description
    self.error = error
    self.secure = secure
    self.disabled = disabled
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let invalid = CSTextFieldModel.showsError(error)
    let borderStroke = CSTextFieldModel.borderColor(invalid: invalid, pack: pack).color
    VStack(alignment: .leading, spacing: CGFloat(CSTextFieldModel.gap())) {
      Text(label)
        .font(.system(size: pack.fontSizeBase.points, weight: .bold))
        .foregroundStyle(pack.colorTextPrimary.color)
      if CSTextFieldModel.showsDescription(description), let description {
        Text(description)
          .font(.system(size: CGFloat(CSTextFieldModel.descriptionFontSize())))
          .foregroundStyle(pack.colorTextMuted.color)
      }
      field
        .textFieldStyle(.plain)
        .padding(.horizontal, CGFloat(CSTextFieldModel.paddingX(pack)))
        .padding(.vertical, CGFloat(CSTextFieldModel.paddingY(pack)))
        .frame(minHeight: CGFloat(CSTextFieldModel.minHeight(pack)))
        .background(pack.colorSurfacePanel.color)
        .overlay(
          RoundedRectangle(cornerRadius: CGFloat(CSTextFieldModel.radius(pack)))
            .stroke(borderStroke, lineWidth: CGFloat(CSTextFieldModel.borderWidth()))
        )
        .disabled(disabled)
        .onChange(of: focused) { isFocused in
          if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
        }
      if CSTextFieldModel.isAlert(error), let error {
        Text(error)
          .font(.system(size: CGFloat(CSTextFieldModel.errorFontSize())))
          .foregroundStyle(pack.colorSemanticDangerText.color)
          .accessibilityAddTraits(.updatesFrequently)
      }
    }
    .opacity(CSTextFieldModel.opacity(disabled: disabled))
  }

  private var typed: Binding<String> {
    Binding(get: { text }, set: { next in
      CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
      text = next
    })
  }

  @ViewBuilder private var field: some View {
    if secure {
      SecureField("••••••••", text: typed).focused($focused).accessibilityLabel(label)
    } else {
      TextField(label, text: typed).focused($focused).accessibilityLabel(label)
    }
  }
}

public struct CSTextButton: View {
  let title: String
  let role: CSButtonRole
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  var expand: Bool
  let action: () -> Void

  public init(title: String, role: CSButtonRole = .primary, dark: Bool, highContrast: Bool, compact: Bool, expand: Bool = false, action: @escaping () -> Void) {
    self.title = title
    self.role = role
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.expand = expand
    self.action = action
  }

  @State private var focusId = UUID().uuidString
  @FocusState private var ownerFocused: Bool

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let ink = (role == .danger ? pack.colorSemanticDangerText : pack.colorLink).color
    let restore = { ownerFocused = true }
    Button(action: {
      CSFocusRegistry.shared.claim(id: focusId, restore: restore)
      action()
    }) {
      Text(title)
        .fixedSize(horizontal: false, vertical: true)
        .frame(maxWidth: expand ? .infinity : nil, minHeight: pack.componentButtonMdMinHeight.points, alignment: .leading)
        .frame(minWidth: expand ? nil : pack.componentButtonMdMinHeight.points)
        .contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .focused($ownerFocused)
    .foregroundStyle(ink)
    .accessibilityLabel(title)
    .onChange(of: ownerFocused) { isFocused in
      if isFocused { CSFocusRegistry.shared.claim(id: focusId, restore: { ownerFocused = true }) }
    }
    .onDisappear { CSFocusRegistry.shared.disconnect(id: focusId) }
  }
}

public enum CSBadgeModel {
  public static let trackingEm = 0.04
  public static let fontSize = 12.0
  public static func toneClass(_ name: String) -> String? { name == "neutral" ? nil : name }
  public static func spoken(_ label: String) -> String { label }
  public static func variant(_ name: String) -> String {
    switch name {
    case "solid", "ochre", "success", "danger", "warning", "info": return name
    default: return "neutral"
    }
  }
}

public struct CSBadge: View {
  let label: String
  let variant: String
  let dot: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(label: String, variant: String = "neutral", dot: Bool = false, dark: Bool, highContrast: Bool, compact: Bool) {
    self.label = label
    self.variant = variant
    self.dot = dot
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let tone = CSBadgeModel.variant(variant)
    let fill = tone == "solid" ? pack.colorBrandUmber : tone == "ochre" ? pack.colorBrandOchre : tone == "success" ? pack.colorSemanticSuccess : tone == "danger" ? pack.colorSemanticDanger : tone == "warning" ? pack.colorSemanticWarning : tone == "info" ? pack.colorSemanticInfo : pack.colorSurfaceRaised
    let ink = tone == "solid" ? pack.colorTextInverse : tone == "ochre" ? pack.colorBrandUmber : tone == "success" ? pack.colorSemanticSuccessFg : tone == "danger" ? pack.colorSemanticDangerFg : tone == "warning" ? pack.colorSemanticWarningFg : tone == "info" ? pack.colorSemanticInfoFg : pack.colorTextAccent
    HStack(spacing: 5) {
      if dot { Circle().fill(ink.color).frame(width: 7, height: 7).accessibilityHidden(true) }
      Text(label).textCase(.uppercase).tracking(CSBadgeModel.fontSize * CSBadgeModel.trackingEm).accessibilityLabel(CSBadgeModel.spoken(label))
    }
    .font(.system(size: 12, weight: .bold))
    .foregroundStyle(ink.color)
    .padding(.horizontal, 9)
    .padding(.vertical, 4)
    .background(fill.color)
    .overlay { if tone == "neutral" { RoundedRectangle(cornerRadius: pack.radiusFull.points).stroke(pack.colorBorderDefault.color, lineWidth: 1) } }
    .clipShape(RoundedRectangle(cornerRadius: pack.radiusFull.points))
  }
}

public enum CSDividerModel {
  public static func showsLabel(_ label: CSPresenceValue) -> Bool { label.shown }
  public static func text(_ label: CSPresenceValue) -> String {
    switch label {
    case .text(let value): return value
    case .zero: return "0"
    case .absent: return ""
    }
  }
  public static func orientation(vertical: Bool) -> String { vertical ? "vertical" : "horizontal" }
}

public struct CSDivider: View {
  public let label: CSPresenceValue
  public let vertical: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(label: CSPresenceValue = .absent, vertical: Bool = false, dark: Bool, highContrast: Bool, compact: Bool) {
    self.label = label
    self.vertical = vertical
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSDividerModel.text(label)
    if CSDividerModel.showsLabel(label) {
      HStack(spacing: 12) {
        Rectangle().fill(pack.colorBorderDefault.color).frame(height: 1)
        Text(spoken).font(.footnote).foregroundStyle(pack.mutedColor)
        Rectangle().fill(pack.colorBorderDefault.color).frame(height: 1)
      }
      .accessibilityElement(children: .ignore)
      .accessibilityLabel(spoken)
    } else if vertical {
      Rectangle()
        .fill(pack.colorBorderDefault.color)
        .frame(width: 1, height: 16)
        .accessibilityLabel(CSDividerModel.orientation(vertical: true))
    } else {
      Rectangle()
        .fill(pack.colorBorderDefault.color)
        .frame(maxWidth: .infinity)
        .frame(height: 1)
        .accessibilityLabel(CSDividerModel.orientation(vertical: false))
    }
  }
}

public struct CSListRow: View {
  let title: String
  let subtitle: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool

  public init(title: String, subtitle: String, dark: Bool, highContrast: Bool, compact: Bool) {
    self.title = title
    self.subtitle = subtitle
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    HStack {
      VStack(alignment: .leading, spacing: 4) {
        Text(title)
          .font(.system(size: 15, weight: .semibold))
          .foregroundStyle(pack.colorTextPrimary.color)
          .fixedSize(horizontal: false, vertical: true)
        CSBadge(label: subtitle, dark: dark, highContrast: highContrast, compact: compact)
      }
      Spacer()
      Circle().fill(pack.colorBrandOchre.color).frame(width: 10, height: 10)
    }
    .padding(14)
    .background(pack.colorSurfacePanel.color)
  }
}

public enum CSSelectModel {
  public static let placeholderDefault = "Select…"
  public static func placeholderText(_ text: String?, fallback: String) -> String { text ?? fallback }
  public static func showsPrompt(placeholder: String?, hasContent: Bool) -> Bool { placeholder != nil || !hasContent }
  public static func shownText(value: String, placeholder: String?, fallback: String, hasContent: Bool) -> String {
    if !value.isEmpty { return value }
    if showsPrompt(placeholder: placeholder, hasContent: hasContent) { return placeholderText(placeholder, fallback: fallback) }
    return value
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["placeholder": "Chọn…"],
      "en": ["placeholder": placeholderDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func isAlert(_ error: String?) -> Bool {
    guard let error else { return false }
    return !error.isEmpty
  }
}

public struct CSSelect<Selection: Hashable, Content: View>: View {
  let label: String
  let value: String
  @Binding var selection: Selection
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let descriptionText: String?
  public let errorText: String?
  public let placeholder: String?
  public let disabled: Bool
  public let language: String?
  let content: () -> Content
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(label: String, value: String, selection: Binding<Selection>, dark: Bool, highContrast: Bool, compact: Bool, description: String? = nil, error: String? = nil, placeholder: String? = nil, disabled: Bool = false, language: String? = nil, @ViewBuilder content: @escaping () -> Content) {
    self.label = label
    self.value = value
    _selection = selection
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.descriptionText = description
    self.errorText = error
    self.placeholder = placeholder
    self.disabled = disabled
    self.language = language
    self.content = content
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let prompt = CSSelectModel.copy("placeholder", language: spoken)
    let shown = CSSelectModel.shownText(value: value, placeholder: placeholder, fallback: prompt, hasContent: true)
    VStack(alignment: .leading, spacing: 4) {
      if CSPresenceValue.text(label).shown { Text(label).foregroundStyle(pack.primaryTextColor) }
      if let descriptionText, CSPresenceValue.text(descriptionText).shown {
        Text(descriptionText).foregroundStyle(pack.mutedColor)
      }
      Menu {
        Picker(label, selection: Binding(get: { selection }, set: { next in
          if disabled { return }
          CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
          selection = next
        })) { content() }
      } label: {
        HStack {
          Text(shown)
            .foregroundStyle(pack.colorTextPrimary.color)
            .frame(maxWidth: .infinity, alignment: .leading)
          CSIcon(name: "chevron-down", label: "", dark: dark, highContrast: highContrast, compact: compact)
            .accessibilityHidden(true)
            .allowsHitTesting(false)
        }
      }
      .disabled(disabled)
      .accessibilityLabel(CSPresenceValue.text(label).shown ? label : "")
      .accessibilityValue(shown)
      .focused($focused)
      .onChange(of: focused) { isFocused in
        if isFocused && !disabled { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
      }
      .simultaneousGesture(TapGesture().onEnded {
        if !disabled { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
      })
      if let errorText, CSSelectModel.isAlert(errorText) {
        Text(errorText).foregroundStyle(pack.colorSemanticDangerText.color).accessibilityAddTraits(.updatesFrequently)
      }
    }
  }
}

public struct CSCard<Content: View>: View {
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  var spacing: CGFloat
  var padding: CGFloat
  public let material: CSGlassMaterial?
  let content: () -> Content

  public init(dark: Bool, highContrast: Bool, compact: Bool, spacing: CGFloat = 0, padding: CGFloat = 0, material: CSGlassMaterial? = nil, @ViewBuilder content: @escaping () -> Content) {
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.spacing = spacing
    self.padding = padding
    self.material = material
    self.content = content
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let activeMaterial = material ?? .solid
    let baseColor: Color = {
      switch CSGlassModel.surfaceBase(activeMaterial) {
      case .page: return pack.colorSurfacePage.color
      case .panel: return pack.colorSurfacePanel.color
      case .raised: return pack.colorSurfaceRaised.color
      }
    }()
    let fillAlpha = CSGlassModel.opacity(activeMaterial, pack: pack)
    let borderAlpha = CSGlassModel.borderMix(activeMaterial)
    let strokeWidth = CGFloat(CSGlassModel.borderWidth(activeMaterial))
    let lensEdgeShown = CSGlassModel.showsLensEdge(activeMaterial)
    let shadowSpec = CSGlassModel.shadow(activeMaterial) == .lg ? pack.shadowLg.first : (material == nil || CSGlassModel.shadow(activeMaterial) == .sm ? pack.shadowSm.first : nil)
    VStack(alignment: .leading, spacing: spacing) { content() }
      .padding(padding)
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(baseColor.opacity(fillAlpha))
      .clipShape(RoundedRectangle(cornerRadius: pack.radiusLg.points))
      .overlay(RoundedRectangle(cornerRadius: pack.radiusLg.points).stroke(pack.colorBorderDefault.color.opacity(borderAlpha), lineWidth: strokeWidth))
      .overlay(
        RoundedRectangle(cornerRadius: pack.radiusLg.points)
          .strokeBorder(
            LinearGradient(
              stops: [
                .init(color: Color.white.opacity(CSGlassModel.lensHighlightAlpha), location: 0.0),
                .init(color: .clear, location: CSGlassModel.lensTransparentStartStop),
                .init(color: .clear, location: CSGlassModel.lensTransparentEndStop),
                .init(color: pack.colorBrandUmber.color.opacity(CSGlassModel.lensUmberAlpha), location: 1.0),
              ],
              startPoint: .topLeading,
              endPoint: .bottomTrailing
            ),
            lineWidth: lensEdgeShown ? CGFloat(CSGlassModel.lensEdgeWidth()) : 0
          )
      )
      .shadow(
        color: shadowSpec?.color.color ?? .clear,
        radius: shadowSpec?.blur.points ?? 0,
        x: shadowSpec?.offsetX.points ?? 0,
        y: shadowSpec?.offsetY.points ?? 0
      )
  }
}

extension CSTokenModePack {
  public var pageColor: Color { colorSurfacePage.color }
  public var borderColor: Color { colorBorderDefault.color }
  public var mutedColor: Color { colorTextMuted.color }
  public var primaryTextColor: Color { colorTextPrimary.color }
}

public enum CSSwitchModel {
  public static let labelDefault = "Setting"
  public static func showsLabel(_ label: String?) -> Bool {
    guard let label else { return false }
    return !label.isEmpty
  }
  public static func named(label: String?, ariaLabel: String?, labelledBy: String?) -> Bool {
    showsLabel(label) || showsLabel(ariaLabel) || showsLabel(labelledBy)
  }
  public static func switchName(label: String?, ariaLabel: String?, labelledBy: String?, fallback: String) -> String? {
    if let ariaLabel { return ariaLabel }
    if named(label: label, ariaLabel: nil, labelledBy: labelledBy) { return nil }
    return fallback
  }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["label": "Cài đặt"],
      "en": ["label": labelDefault],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
}

public struct CSSwitch: View {
  let title: String
  let disabled: Bool
  let ariaLabel: String?
  let labelledBy: String?
  @Binding var isOn: Bool
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  public let language: String?
  @State private var focusId = UUID().uuidString
  @FocusState private var focused: Bool
  @Environment(\.csLanguage) private var ancestorLanguage

  public init(title: String, isOn: Binding<Bool>, dark: Bool, highContrast: Bool, compact: Bool, disabled: Bool = false, ariaLabel: String? = nil, labelledBy: String? = nil, language: String? = nil) {
    self.title = title
    self.disabled = disabled
    self.ariaLabel = ariaLabel
    self.labelledBy = labelledBy
    _isOn = isOn
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.language = language
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let name = CSSwitchModel.switchName(label: title, ariaLabel: ariaLabel, labelledBy: labelledBy, fallback: CSSwitchModel.copy("label", language: spoken))
    Toggle(isOn: Binding(get: { isOn }, set: { next in
      if disabled { return }
      CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true })
      isOn = next
    })) {
      if CSSwitchModel.showsLabel(title) { Text(title) }
    }
    .foregroundStyle(pack.colorTextPrimary.color)
    .tint(pack.colorBrandOchre.color)
    .frame(minWidth: CGFloat(CSA11yModel.touchTargetMinSize(coarse: true)), minHeight: CGFloat(CSA11yModel.touchTargetMinSize(coarse: true)))
    .focused($focused)
    .onChange(of: focused) { isFocused in
      if isFocused && !disabled { CSFocusRegistry.shared.claim(id: focusId, restore: { focused = true }) }
    }
    .disabled(disabled)
    .accessibilityLabel(name ?? title)
  }
}

public enum CSDialogModel {
  public static let closeDefault = "Close"
  public static let maxWidthRem = 42.0
  public static let alertMaxWidthRem = 28.0
  public static let overlayRed = 31
  public static let overlayGreen = 19
  public static let overlayBlue = 11
  public static let overlayAlpha = 0.42
  public static let panelZIndex = 2
  public static func maxWidth(root: Double = 16) -> Double { maxWidthRem * root }
  public static func alertMaxWidth(root: Double = 16) -> Double { alertMaxWidthRem * root }
  public static func topOffsetRatio(narrow: Bool = false) -> Double { narrow ? 0.04 : 0.12 }
  public static func safeTop(viewportHeight: Double, narrow: Bool = false, safeInsetTop: Double = 0) -> Double {
    max(viewportHeight * topOffsetRatio(narrow: narrow), safeInsetTop)
  }
  public static func maxInlineSize(viewportWidth: Double, alert: Bool = false, safeInsetLeft: Double = 0, safeInsetRight: Double = 0) -> Double {
    let narrow = viewportWidth <= 640
    let margin = narrow ? 16.0 : 32.0
    let available = max(0, viewportWidth - margin - safeInsetLeft - safeInsetRight)
    if narrow && !alert { return available }
    return min(alert ? alertMaxWidth() : maxWidth(), available)
  }
  public static func maxBlockSize(viewportHeight: Double, narrow: Bool = false, safeInsetTop: Double = 0, safeInsetBottom: Double = 0) -> Double {
    let top = safeTop(viewportHeight: viewportHeight, narrow: narrow, safeInsetTop: safeInsetTop)
    return max(0, min(0.8 * viewportHeight, min(viewportHeight - 64.0, viewportHeight - top - safeInsetBottom - 16.0)))
  }
  public static func padding(_ pack: CSTokenModePack, narrow: Bool = false) -> Double {
    (narrow ? pack.space4 : pack.space6).points
  }
  public static func headerGap() -> Double { 12 }
  public static func titleFontSize() -> Double { 20 }
  public static func titleLineHeight() -> Double { 1.35 }
  public static func bodyMarginY() -> Double { 16 }
  public static func actionsButtonsExpand(narrow: Bool) -> Bool { narrow }
  public static func destructiveTitleColor(destructive: Bool, pack: CSTokenModePack) -> CSColorValue {
    destructive ? pack.colorSemanticDangerText : pack.colorTextPrimary
  }
  public static func closeText(_ label: String?, fallback: String) -> String { label ?? fallback }
  public static func copy(_ key: String, language: String?) -> String {
    let want = CSComboboxModel.primaryLanguage(language) ?? "vi"
    let tables: [String: [String: String]] = [
      "vi": ["close": "Đóng", "confirm": "Xác nhận", "cancel": "Hủy"],
      "en": ["close": closeDefault, "confirm": "Confirm", "cancel": "Cancel"],
      "ja": ["close": "閉じる", "confirm": "確認", "cancel": "キャンセル"],
    ]
    var seen = Set<String>()
    for locale in [want, "en", "vi"] where seen.insert(locale).inserted {
      if let value = tables[locale]?[key] { return value }
    }
    return key
  }
  public static func showsClose(hasOpenChange: Bool, hasClose: Bool) -> Bool { hasOpenChange || hasClose }
  public static func showsActions(_ actions: String?) -> Bool {
    guard let actions else { return false }
    return !actions.isEmpty
  }
  public static func describedBy(explicit: String?, hasExplicit: Bool, hasBody: Bool, bodyId: String) -> String? {
    if hasExplicit {
      guard let explicit, !explicit.isEmpty else { return nil }
      return explicit
    }
    return hasBody ? bodyId : nil
  }
  public static func notify(hasOpenChange: Bool, hasClose: Bool) -> [String] {
    var events: [String] = []
    if hasOpenChange { events.append("open-false") }
    if hasClose { events.append("close") }
    return events
  }
}

public enum CSTableStyleModel {
  public static let cellBorderAlpha = 0.18
  public static func statusPaddingY(_ pack: CSTokenModePack) -> Double { pack.space4.points }
  public static func cellBorderWidth() -> Double { 1 }
  public static func cellPaddingY() -> Double { 10 }
  public static func cellPaddingX() -> Double { 12 }
  public static func headerFontSize(_ pack: CSTokenModePack) -> Double { pack.fontSizeXs.points }
  public static func headerLetterSpacingEm() -> Double { 0.08 }
  public static func headerUppercase() -> Bool { true }
  public static func captionFontWeight() -> Int { 700 }
  public static func captionMarginBottom() -> Double { 8 }
}

public enum CSAIDisclosureStyleModel {
  public static let panelBorderAlpha = 0.18
  public static func badgeRadius() -> Double { 999 }
  public static func badgeFontSize() -> Double { 14 }
  public static func badgeFontWeight() -> Int { 700 }
  public static func badgePaddingY() -> Double { 4 }
  public static func badgePaddingX() -> Double { 10 }
  public static func panelBorderWidth() -> Double { 1 }
  public static func panelGap() -> Double { 6 }
  public static func panelTopOffset() -> Double { 6 }
  public static func panelMinWidth() -> Double { 288 }
  public static func panelPadding() -> Double { 12 }
  public static func panelDepth(_ pack: CSTokenModePack) -> Double { pack.depthDropdown }
  public static func sourcesFontSize() -> Double { 13 }
}

public enum CSReviewGateStyleModel {
  public static let warningMixPortion = 0.05
  public static func borderWidth() -> Double { 1 }
  public static func gap() -> Double { 12 }
  public static func padding(_ pack: CSTokenModePack) -> Double { pack.space4.points }
  public static func riskFontWeight() -> Int { 700 }
  public static func riskLetterSpacingEm() -> Double { 0.04 }
  public static func riskFontSize() -> Double { 13 }
  public static func riskUppercase() -> Bool { true }
  public static func reviewerFontSize() -> Double { 14 }
}

public enum CSLogoStyleModel {
  public static func autoBlockSize() -> Bool { true }
  public static func verticalAlign() -> String { "middle" }
}

public struct CSDialog: View {
  public let title: String
  public let message: String
  public let confirmTitle: String
  let dark: Bool
  let highContrast: Bool
  let compact: Bool
  let onConfirm: () -> Void
  @Binding var open: Bool
  let onOpenChange: ((Bool) -> Void)?
  let onClose: (() -> Void)?
  let closeLabel: String?
  public let language: String?
  let onRestore: (() -> Void)?
  let layerId: String
  let layers: [CSOverlayLayer]
  @FocusState private var trap: Int?
  @Environment(\.csLanguage) private var ancestorLanguage
  @State private var restoreId: String? = nil
  @State private var closeFocusId = UUID().uuidString

  public init(title: String, message: String, confirmTitle: String, dark: Bool, highContrast: Bool, compact: Bool, onConfirm: @escaping () -> Void) {
    self.title = title
    self.message = message
    self.confirmTitle = confirmTitle
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onConfirm = onConfirm
    _open = .constant(true)
    self.onOpenChange = nil
    self.onClose = nil
    self.closeLabel = nil
    self.language = nil
    self.onRestore = nil
    let id = CSOverlayStack.freshId("dialog")
    self.layerId = id
    self.layers = CSOverlayStack.solo(id)
  }

  public init(title: String, message: String, confirmTitle: String, open: Binding<Bool>, closeLabel: String? = nil, dark: Bool, highContrast: Bool, compact: Bool, onConfirm: @escaping () -> Void, onOpenChange: ((Bool) -> Void)? = nil, onClose: (() -> Void)? = nil, onRestore: (() -> Void)? = nil, layerId: String? = nil, layers: [CSOverlayLayer]? = nil, language: String? = nil) {
    self.title = title
    self.message = message
    self.confirmTitle = confirmTitle
    _open = open
    self.closeLabel = closeLabel
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.onConfirm = onConfirm
    self.onOpenChange = onOpenChange
    self.onClose = onClose
    self.language = language
    self.onRestore = onRestore
    let id = layerId ?? CSOverlayStack.freshId("dialog")
    self.layerId = id
    self.layers = layers ?? CSOverlayStack.solo(id)
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    let canClose = CSDialogModel.showsClose(hasOpenChange: onOpenChange != nil, hasClose: onClose != nil)
    let spoken = CSComboboxModel.resolvedLanguage(explicit: language, ancestor: ancestorLanguage)
    let stops = (canClose ? 1 : 0) + (CSDialogModel.showsActions(confirmTitle) ? 1 : 0)
    if open {
      ZStack {
        if canClose {
          Color.black.opacity(0.42)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .contentShape(Rectangle())
            .onTapGesture(perform: close)
            .accessibilityHidden(true)
        }
        VStack(alignment: .leading, spacing: 12) {
          HStack {
            Text(title).font(.system(size: 20, weight: .bold)).foregroundStyle(pack.colorTextPrimary.color)
            Spacer()
            if canClose {
              Button(action: {
                CSFocusRegistry.shared.claim(id: closeFocusId, restore: { trap = 0 })
                close()
              }) {
                CSIcon(name: "close", label: "", dark: dark, highContrast: highContrast, compact: compact)
                  .frame(minWidth: 44, minHeight: 44)
              }
              .accessibilityLabel(CSDialogModel.closeText(closeLabel, fallback: CSDialogModel.copy("close", language: spoken)))
              .focused($trap, equals: 0)
            }
          }
          if !message.isEmpty {
            Text(message).foregroundStyle(pack.colorTextMuted.color)
          }
          if CSDialogModel.showsActions(confirmTitle) {
            CSButton(title: confirmTitle, dark: dark, highContrast: highContrast, compact: compact, action: onConfirm)
              .focused($trap, equals: canClose ? 1 : 0)
          }
        }
        .padding(24)
        .frame(maxWidth: CSDialogModel.maxWidth())
        .background(pack.colorSurfacePanel.color)
        .clipShape(RoundedRectangle(cornerRadius: pack.radiusMd.points))
        .accessibilityElement(children: .contain)
        .accessibilityAddTraits(.isModal)
        .accessibilityLabel(title)
        .onAppear {
          restoreId = CSFocusRegistry.shared.activeId
          CSOverlayRegistry.shared.push(id: layerId)
          trap = CSFocusTrap.initialIndex(preferred: nil, count: stops)
        }
        .onDisappear { CSOverlayRegistry.shared.remove(id: layerId) }
        .csTabTrap { shift in
          let stack = CSOverlayRegistry.shared.resolved(id: layerId, fallback: layers)
          guard CSOverlayStack.ownsFocus(id: layerId, layers: stack) else { return false }
          let next = CSFocusTrap.nextIndex(current: trap ?? -1, count: stops, shift: shift, inside: trap != nil)
          trap = CSModalFocus.pullBack(inside: next != nil) ? CSFocusTrap.initialIndex(preferred: nil, count: stops) : next
          return stops > 0
        }
      }
    }
  }

  private func close() {
    let stack = CSOverlayRegistry.shared.resolved(id: layerId, fallback: layers)
    open = false
    onOpenChange?(false)
    onClose?()
    CSFocusReturn.perform(savedId: restoreId, onRestore: onRestore, layerId: layerId, layers: stack)
    CSOverlayRegistry.shared.remove(id: layerId)
  }
}

public enum CSResetModel {
  public static let textSizeAdjustPercent = 100.0
  public static func scrollPaddingBlockStart(_ pack: CSTokenModePack) -> Double { pack.scrollPaddingBlockStart.points }
  public static func scrollPaddingBlockEnd(_ pack: CSTokenModePack) -> Double { pack.scrollPaddingBlockEnd.points }
  public static func bodyMargin() -> Double { 0 }
  public static func bodyFontSize(_ pack: CSTokenModePack) -> Double { pack.fontSizeBase.points }
  public static func bodyLineHeight(_ pack: CSTokenModePack) -> Double { pack.fontLineHeightBody }
  public static func headingLineHeight(_ pack: CSTokenModePack) -> Double { pack.fontLineHeightHeading }
  public static func headingTextWrap() -> String { "balance" }
  public static func paragraphTextWrap() -> String { "pretty" }
  public static func focusOutlineWidth() -> Double { 2 }
  public static func focusOutlineOffset() -> Double { 2 }
  public static func focusHaloSpread() -> Double { 5 }
  public static func focusDropShadowRadius() -> Double { 2 }
  public static func skipUnfocusedLeft() -> Double { -999 }
  public static func skipUnfocusedSize() -> Double { 1 }
  public static func skipFontWeight() -> Int { 700 }
  public static func skipFocusedOffset() -> Double { 12 }
  public static func skipFocusedDepth(_ pack: CSTokenModePack) -> Double { pack.depthToast + 1 }
  public static func skipFocusedPaddingY() -> Double { 10 }
  public static func skipFocusedPaddingX() -> Double { 14 }
  public static func skipFocusedBorderWidth() -> Double { 2 }
  public static func skipFocusedHaloSpread() -> Double { 5 }
}

public struct CSSkipLink: View {
  public let label: String
  public let dark: Bool
  public let highContrast: Bool
  public let compact: Bool
  public let action: () -> Void
  @FocusState private var focused: Bool

  public init(label: String, dark: Bool = false, highContrast: Bool = false, compact: Bool = false, action: @escaping () -> Void = {}) {
    self.label = label
    self.dark = dark
    self.highContrast = highContrast
    self.compact = compact
    self.action = action
  }

  public var body: some View {
    let pack = CSControlMode.pack(dark: dark, highContrast: highContrast, compact: compact)
    Button(action: action) {
      Text(label)
        .font(.system(size: CGFloat(CSResetModel.bodyFontSize(pack)), weight: .bold))
        .foregroundStyle(pack.colorTextPrimary.color)
        .padding(.horizontal, CGFloat(CSResetModel.skipFocusedPaddingX()))
        .padding(.vertical, CGFloat(CSResetModel.skipFocusedPaddingY()))
        .background(pack.colorSurfacePanel.color)
        .clipShape(RoundedRectangle(cornerRadius: pack.radiusMd.points))
        .overlay(
          RoundedRectangle(cornerRadius: pack.radiusMd.points)
            .stroke(pack.colorBrandOchre.color, lineWidth: CGFloat(CSResetModel.skipFocusedBorderWidth()))
        )
    }
    .buttonStyle(.plain)
    .focused($focused)
    .frame(
      width: focused ? nil : CGFloat(CSResetModel.skipUnfocusedSize()),
      height: focused ? nil : CGFloat(CSResetModel.skipUnfocusedSize())
    )
    .clipped()
    .zIndex(focused ? CSResetModel.skipFocusedDepth(pack) : 0)
  }
}

public enum CSTypographyRole: String, CaseIterable {
  case display = "cs-display"
  case h1 = "cs-h1"
  case h2 = "cs-h2"
  case h3 = "cs-h3"
  case h4 = "cs-h4"
  case bodyLg = "cs-body-lg"
  case body = "cs-body"
  case secondary = "cs-secondary"
  case caption = "cs-caption"
  case eyebrow = "cs-eyebrow"
  case mono = "cs-mono"
}

public enum CSTypographyModel {
  public static let letterSpacingTight = -0.01
  public static let letterSpacingNormal = 0.0
  public static let letterSpacingCaps = 0.08
  public static let headingTracking = -0.01
  public static let displayFaceMaxWeight = 700.0

  public static func fontFamily(_ role: CSTypographyRole, pack: CSTokenModePack, displayFace: Bool = false) -> [String] {
    switch role {
    case .mono:
      return pack.fontFamilyMono
    case .display, .h1, .h2, .h3, .h4:
      return displayFace ? pack.fontFamilyDisplay : pack.headingFamily
    case .bodyLg, .body, .secondary, .caption, .eyebrow:
      return pack.fontFamilyUi
    }
  }

  public static func fontSize(_ role: CSTypographyRole, pack: CSTokenModePack) -> Double {
    switch role {
    case .display: return pack.textDisplay.points
    case .h1: return pack.textH1.points
    case .h2: return pack.textH2.points
    case .h3: return pack.textH3.points
    case .h4: return pack.textH4.points
    case .bodyLg: return pack.textBodyLg.points
    case .body, .mono: return pack.textBody.points
    case .secondary: return pack.textSecondary.points
    case .caption: return pack.textCaption.points
    case .eyebrow: return pack.textEyebrow.points
    }
  }

  public static func lineHeight(_ role: CSTypographyRole, pack: CSTokenModePack) -> Double {
    switch role {
    case .display: return pack.fontLineHeightTight
    case .h1, .h2, .h3, .h4: return pack.fontLineHeightHeading
    case .bodyLg, .body, .secondary, .caption, .eyebrow, .mono: return pack.fontLineHeightBody
    }
  }

  public static func fontWeight(_ role: CSTypographyRole, pack: CSTokenModePack, displayFace: Bool = false) -> Double {
    switch role {
    case .display, .h1:
      return displayFace ? min(displayFaceMaxWeight, pack.headingWeightStrong) : pack.headingWeightStrong
    case .h2, .h3:
      return pack.headingWeight
    case .h4:
      return pack.fontWeightSemibold
    case .eyebrow:
      return pack.fontWeightBold
    case .bodyLg, .body, .secondary, .caption, .mono:
      return pack.fontWeightRegular
    }
  }

  public static func letterSpacingEm(_ role: CSTypographyRole) -> Double {
    switch role {
    case .display, .h1, .h2: return headingTracking
    case .eyebrow: return letterSpacingCaps
    case .h3, .h4, .bodyLg, .body, .secondary, .caption, .mono: return letterSpacingNormal
    }
  }

  public static func textWrap(_ role: CSTypographyRole) -> String {
    switch role {
    case .display, .h1, .h2: return "balance"
    case .bodyLg, .body: return "pretty"
    case .h3, .h4, .secondary, .caption, .eyebrow, .mono: return "normal"
    }
  }

  public static func isUppercase(_ role: CSTypographyRole) -> Bool {
    role == .eyebrow
  }

  public static func textColor(_ role: CSTypographyRole, pack: CSTokenModePack) -> CSColorValue {
    switch role {
    case .secondary, .caption: return pack.colorTextMuted
    case .eyebrow: return pack.colorTextAccent
    case .display, .h1, .h2, .h3, .h4, .bodyLg, .body, .mono: return pack.colorTextPrimary
    }
  }
}
