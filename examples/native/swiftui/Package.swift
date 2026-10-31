// swift-tools-version: 5.9
import PackageDescription

let package = Package(
  name: "CyberSkillSample",
  platforms: [
    .macOS(.v13),
    .iOS(.v16),
  ],
  products: [
    .library(name: "CyberSkillDesign", targets: ["CyberSkillDesign"]),
    .executable(name: "CyberSkillSample", targets: ["CyberSkillSample"]),
  ],
  targets: [
    .target(
      name: "CyberSkillDesign",
      path: "Sources/CyberSkillDesign"
    ),
    .executableTarget(
      name: "CyberSkillSample",
      dependencies: ["CyberSkillDesign"],
      path: "Sources/CyberSkillSample",
      resources: [.copy("Fonts")]
    ),
    .testTarget(
      name: "CyberSkillSampleTests",
      dependencies: ["CyberSkillSample", "CyberSkillDesign"]
    ),
  ]
)
