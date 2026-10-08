import java.util.Properties

plugins {
  id("com.android.application")
  id("org.jetbrains.kotlin.android")
}

android {
  namespace = "world.cyberskill.sample"
  compileSdk = 34
  defaultConfig {
    applicationId = "world.cyberskill.sample"
    minSdk = 26
    targetSdk = 34
    versionCode = 1
    versionName = "1.0.0"
    testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
  }
  // Optional release signing — copy ../signing.properties.example → ../signing.properties.
  // Absent file = debug signing only (sample scaffold; CI soft-skips without keystore secrets).
  val signingPropsFile = rootProject.file("signing.properties")
  if (signingPropsFile.exists()) {
    val props = Properties().apply {
      signingPropsFile.inputStream().use { load(it) }
    }
    signingConfigs {
      create("release") {
        storeFile = file(props.getProperty("storeFile"))
        storePassword = props.getProperty("storePassword")
        keyAlias = props.getProperty("keyAlias")
        keyPassword = props.getProperty("keyPassword")
      }
    }
    buildTypes {
      getByName("release") {
        signingConfig = signingConfigs.getByName("release")
        isMinifyEnabled = false
      }
    }
  }
  buildFeatures { compose = true }
  composeOptions { kotlinCompilerExtensionVersion = "1.5.8" }
  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
  kotlinOptions { jvmTarget = "17" }
}

dependencies {
  val composeBom = platform("androidx.compose:compose-bom:2024.02.00")
  implementation(composeBom)
  implementation("androidx.compose.ui:ui")
  implementation("androidx.compose.material3:material3")
  implementation("androidx.compose.ui:ui-tooling-preview")
  implementation("androidx.activity:activity-compose:1.8.2")
  implementation("androidx.navigation:navigation-compose:2.7.7")
  androidTestImplementation(composeBom)
  androidTestImplementation("androidx.compose.ui:ui-test-junit4")
  androidTestImplementation("androidx.test:runner:1.5.2")
  androidTestImplementation("androidx.test.ext:junit:1.1.5")
  debugImplementation("androidx.compose.ui:ui-test-manifest")
}
