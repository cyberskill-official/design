import Foundation

@main
struct LocaleFormattingProbe {
  static func main() throws {
    guard CommandLine.arguments.count == 2 else { fatalError("Pass the fixture JSON path") }
    let fixture = try JSONSerialization.jsonObject(with: Data(contentsOf: URL(fileURLWithPath: CommandLine.arguments[1]))) as! [String: Any]
    let languages = fixture["languages"] as! [[String: String]]
    guard Set(languages.map { $0["language"]! }) == Set(SampleLanguage.allCases.map(\.rawValue)) else { fatalError("Fixture languages differ from the sample") }
    let currencies = fixture["currencies"] as! [String]
    let amounts = fixture["currencyAmounts"] as! [NSNumber]
    var rows = [[String: Any]]()
    for language in languages {
      let tag = language["language"]!
      for currency in currencies {
        for (index, amount) in amounts.enumerated() {
          for mode in ["sdkDefault", "webProfile"] {
            let formatter = NumberFormatter()
            formatter.locale = Locale(identifier: language["numberLocale"]!)
            formatter.numberStyle = .currency
            formatter.currencyCode = currency
            if mode == "webProfile" {
              // Explicit ISO minor units + half-up matches the web profile.
              // Retain the unconfigured SDK output separately for comparison.
              let digits = (currency == "VND" || currency == "JPY") ? 0 : 2
              formatter.minimumFractionDigits = digits
              formatter.maximumFractionDigits = digits
              formatter.roundingMode = .halfUp
            }
            guard let text = formatter.string(from: amount) else { fatalError("Currency formatting unavailable") }
            rows.append(["id":"\(tag):currency:\(currency):\(index)", "mode":mode, "text":text, "currency":formatter.currencyCode!, "minimumFractionDigits":formatter.minimumFractionDigits, "maximumFractionDigits":formatter.maximumFractionDigits])
          }
        }
      }
      for (index, amount) in (fixture["numberAmounts"] as! [NSNumber]).enumerated() {
        let formatter = NumberFormatter()
        formatter.locale = Locale(identifier: language["numberLocale"]!)
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 3
        formatter.roundingMode = .halfUp
        guard let text = formatter.string(from: amount) else { fatalError("Number formatting unavailable") }
        rows.append(["id":"\(tag):number:\(index)", "mode":"webProfile", "text":text])
      }
      let input = ISO8601DateFormatter()
      for (index, value) in (fixture["dates"] as! [String]).enumerated() {
        guard let date = input.date(from: value) else { fatalError("Invalid date fixture") }
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: language["dateLocale"]!)
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.timeZone = TimeZone(identifier: fixture["timeZone"] as! String)
        formatter.dateFormat = language["datePattern"]!
        rows.append(["id":"\(tag):date:\(index)", "mode":"webProfile", "text":formatter.string(from: date)])
      }
    }
    let result: [String: Any] = ["schemaVersion":1, "platform":"foundation", "runtime":ProcessInfo.processInfo.operatingSystemVersionString, "rows":rows]
    let data = try JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes])
    print(String(data:data, encoding:.utf8)!)
  }
}
