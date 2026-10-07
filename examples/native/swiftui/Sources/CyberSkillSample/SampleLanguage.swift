import Foundation

enum SampleLanguage: String, CaseIterable {
  case vi
  case en

  var locale: Locale { Locale(identifier: rawValue) }
}

enum SampleText: CaseIterable {
  case signIn
  case welcome
  case workEmail
  case password
  case wishes
  case settings
  case listDescription
  case statusHub
  case laborContract
  case investorUpdate
  case inBuild
  case open
  case done
  case signOut
  case settingsDescription
  case preferDark
  case compactSpacing
  case compact
  case comfortable
  case language
  case brandUmber
  case brandOchre

  func value(in language: SampleLanguage) -> String {
    switch self {
    case .signIn: return language == .vi ? "Đăng nhập" : "Sign in"
    case .welcome: return language == .vi ? "Chào mừng bạn trở lại. Đăng nhập để tiếp tục." : "Welcome back. Sign in to continue."
    case .workEmail: return language == .vi ? "Email công việc" : "Work email"
    case .password: return language == .vi ? "Mật khẩu" : "Password"
    case .wishes: return language == .vi ? "Mong muốn" : "Wishes"
    case .settings: return language == .vi ? "Cài đặt" : "Settings"
    case .listDescription: return language == .vi ? "Mong muốn của nhóm và tiến độ thực hiện." : "Your team’s wishes and their progress."
    case .statusHub: return language == .vi ? "Cập nhật trung tâm trạng thái" : "Status hub refresh"
    case .laborContract: return language == .vi ? "Bộ hợp đồng lao động Việt Nam" : "VN labor contract pack"
    case .investorUpdate: return language == .vi ? "Cập nhật cho hội đồng quản trị và nhà đầu tư" : "BOD investor update"
    case .inBuild: return language == .vi ? "Đang thực hiện" : "In build"
    case .open: return language == .vi ? "Mới" : "Open"
    case .done: return language == .vi ? "Hoàn thành" : "Done"
    case .signOut: return language == .vi ? "Đăng xuất" : "Sign out"
    case .settingsDescription: return language == .vi ? "Quản lý tùy chọn và phiên làm việc." : "Manage your preferences and session."
    case .preferDark: return language == .vi ? "Ưu tiên giao diện tối" : "Prefer dark theme"
    case .compactSpacing: return language == .vi ? "Khoảng cách gọn" : "Compact spacing"
    case .compact: return language == .vi ? "Gọn" : "Compact"
    case .comfortable: return language == .vi ? "Thoải mái" : "Comfortable"
    case .language: return language == .vi ? "Ngôn ngữ" : "Language"
    case .brandUmber: return language == .vi ? "Nâu thương hiệu" : "Brand umber"
    case .brandOchre: return language == .vi ? "Vàng thương hiệu" : "Brand ochre"
    }
  }
}
