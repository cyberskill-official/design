// Generated from examples/native/sample-copy.json; run npm run native:copy.
package world.cyberskill.sample.ui

enum class SampleLanguage(val tag: String) { Vi("vi"), En("en") }

enum class SampleText(val vi: String, val en: String) {
  SignIn("Đăng nhập", "Sign in"),
  Welcome("Chào mừng bạn trở lại. Đăng nhập để tiếp tục.", "Welcome back. Sign in to continue."),
  WorkEmail("Email công việc", "Work email"),
  Password("Mật khẩu", "Password"),
  Wishes("Mong muốn", "Wishes"),
  Settings("Cài đặt", "Settings"),
  ListDescription("Mong muốn của nhóm và tiến độ thực hiện.", "Your team’s wishes and their progress."),
  StatusHub("Cập nhật trung tâm trạng thái", "Status hub refresh"),
  LaborContract("Bộ hợp đồng lao động Việt Nam", "VN labor contract pack"),
  InvestorUpdate("Cập nhật cho hội đồng quản trị và nhà đầu tư", "BOD investor update"),
  InBuild("Đang thực hiện", "In build"),
  Open("Mới", "Open"),
  Done("Hoàn thành", "Done"),
  SignOut("Đăng xuất", "Sign out"),
  SettingsDescription("Quản lý tùy chọn và phiên làm việc.", "Manage your preferences and session."),
  PreferDark("Ưu tiên giao diện tối", "Prefer dark theme"),
  CompactSpacing("Khoảng cách gọn", "Compact spacing"),
  Compact("Gọn", "Compact"),
  Comfortable("Thoải mái", "Comfortable"),
  Language("Ngôn ngữ", "Language"),
  BrandUmber("Nâu thương hiệu", "Brand umber"),
  BrandOchre("Vàng thương hiệu", "Brand ochre"),
  Back("Quay lại", "Back"),
  SampleTitle("Mẫu CyberSkill", "CyberSkill sample");
  fun value(language: SampleLanguage): String = if (language == SampleLanguage.Vi) vi else en
}
