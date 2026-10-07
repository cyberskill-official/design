// swift-tools-version: 5.9
import PackageDescription

let package = Package(
  name: "CyberSkillSample",
  platforms: [
    .macOS(.v13),
    .iOS(.v16),
  ],
  products: [
    .executable(name: "CyberSkillSample", targets: ["CyberSkillSample"]),
  ],
  targets: [
    .executableTarget(
      name: "CyberSkillSample",
      path: "Sources/CyberSkillSample"
    ),
    .testTarget(
      name: "CyberSkillSampleTests",
      dependencies: ["CyberSkillSample"]
    ),
  ]
)
