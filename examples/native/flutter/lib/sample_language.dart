// Generated from examples/native/sample-copy.json; run npm run native:copy.
enum SampleLanguage { vi, en }

enum SampleText {
  signIn("Đăng nhập", "Sign in"),
  welcome("Chào mừng bạn trở lại. Đăng nhập để tiếp tục.", "Welcome back. Sign in to continue."),
  workEmail("Email công việc", "Work email"),
  password("Mật khẩu", "Password"),
  wishes("Mong muốn", "Wishes"),
  settings("Cài đặt", "Settings"),
  listDescription("Mong muốn của nhóm và tiến độ thực hiện.", "Your team’s wishes and their progress."),
  statusHub("Cập nhật trung tâm trạng thái", "Status hub refresh"),
  laborContract("Bộ hợp đồng lao động Việt Nam", "VN labor contract pack"),
  investorUpdate("Cập nhật cho hội đồng quản trị và nhà đầu tư", "BOD investor update"),
  inBuild("Đang thực hiện", "In build"),
  open("Mới", "Open"),
  done("Hoàn thành", "Done"),
  signOut("Đăng xuất", "Sign out"),
  settingsDescription("Quản lý tùy chọn và phiên làm việc.", "Manage your preferences and session."),
  preferDark("Ưu tiên giao diện tối", "Prefer dark theme"),
  compactSpacing("Khoảng cách gọn", "Compact spacing"),
  compact("Gọn", "Compact"),
  comfortable("Thoải mái", "Comfortable"),
  language("Ngôn ngữ", "Language"),
  brandUmber("Nâu thương hiệu", "Brand umber"),
  brandOchre("Vàng thương hiệu", "Brand ochre"),
  back("Quay lại", "Back"),
  sampleTitle("Mẫu CyberSkill", "CyberSkill sample"),
  contrast("Độ tương phản", "Contrast"),
  contrastSystem("Theo hệ thống", "System"),
  contrastStandard("Chuẩn", "Standard"),
  contrastHigh("Cao", "High"),
  contrastSystemUnavailable("Trên Android cũ hơn 14, hãy chọn Chuẩn hoặc Cao; mẫu chưa hỗ trợ theo độ tương phản hệ thống.", "On Android versions earlier than 14, choose Standard or High; system contrast is unavailable in this sample.");
  const SampleText(this.vi, this.en);
  final String vi;
  final String en;
  String value(SampleLanguage language) => language == SampleLanguage.vi ? vi : en;
}
