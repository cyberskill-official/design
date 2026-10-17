package world.cyberskill.sample.probe

import android.os.Build
import android.os.ParcelFileDescriptor
import androidx.test.platform.app.InstrumentationRegistry
import org.json.JSONArray
import org.json.JSONObject
import org.junit.Assert.*
import org.junit.Test
import java.io.File
import java.math.RoundingMode
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Currency
import java.util.Locale
import java.util.TimeZone
import world.cyberskill.sample.ui.SampleLanguage

class NativeLocaleFormattingTest {
  @Test fun recordExplicitLocaleProfilesAndUnconfiguredCurrencyDefaults() {
    val instrumentation = InstrumentationRegistry.getInstrumentation()
    val fixtures = JSONObject(instrumentation.context.assets.open("locale-formatting.json").bufferedReader().use { it.readText() })
    val languages = fixtures.getJSONArray("languages")
    assertEquals(SampleLanguage.values().map { it.tag }.toSet(), (0 until languages.length()).map { languages.getJSONObject(it).getString("language") }.toSet())
    val currencies = fixtures.getJSONArray("currencies")
    val amounts = fixtures.getJSONArray("currencyAmounts")
    val rows = JSONArray()
    for (languageIndex in 0 until languages.length()) {
      val language = languages.getJSONObject(languageIndex)
      val tag = language.getString("language")
      val locale = Locale.forLanguageTag(language.getString("numberLocale"))
      for (currencyIndex in 0 until currencies.length()) {
        val currency = currencies.getString(currencyIndex)
        for (index in 0 until amounts.length()) {
          for (mode in listOf("sdkDefault", "webProfile")) {
            val formatter = NumberFormat.getCurrencyInstance(locale)
            formatter.currency = Currency.getInstance(currency)
            if (mode == "webProfile") {
              val digits = formatter.currency.defaultFractionDigits
              formatter.minimumFractionDigits = digits
              formatter.maximumFractionDigits = digits
              formatter.roundingMode = RoundingMode.HALF_UP
            }
            rows.put(JSONObject().put("id", "$tag:currency:$currency:$index").put("mode",mode).put("text",formatter.format(amounts.getDouble(index))).put("currency",formatter.currency.currencyCode).put("minimumFractionDigits",formatter.minimumFractionDigits).put("maximumFractionDigits",formatter.maximumFractionDigits))
          }
        }
      }
      val numbers = fixtures.getJSONArray("numberAmounts")
      for (index in 0 until numbers.length()) {
        val formatter = NumberFormat.getNumberInstance(locale)
        formatter.maximumFractionDigits = 3
        formatter.roundingMode = RoundingMode.HALF_UP
        rows.put(JSONObject().put("id","$tag:number:$index").put("mode","webProfile").put("text",formatter.format(numbers.getDouble(index))))
      }
      val dates = fixtures.getJSONArray("dates")
      val input = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'",Locale.ROOT).apply { timeZone = TimeZone.getTimeZone("UTC"); isLenient = false }
      val formatter = SimpleDateFormat(language.getString("datePattern"),Locale.forLanguageTag(language.getString("dateLocale"))).apply { timeZone = TimeZone.getTimeZone(fixtures.getString("timeZone")) }
      for (index in 0 until dates.length()) {
        val date = requireNotNull(input.parse(dates.getString(index)))
        rows.put(JSONObject().put("id","$tag:date:$index").put("mode","webProfile").put("text",formatter.format(date)))
      }
    }
    assertEquals(92, rows.length())
    val output = JSONObject().put("schemaVersion",1).put("platform","android").put("runtime","Android ${Build.VERSION.RELEASE}, API ${Build.VERSION.SDK_INT}").put("rows",rows)
    val file = File(instrumentation.targetContext.getExternalFilesDir(null),"locale-formatting.json")
    file.writeText(output.toString(2))
    // Gradle removes the test APK after execution. Preserve the probe receipt
    // outside app storage, using the same shell-owned emulator export as renders.
    for (command in listOf("mkdir -p /sdcard/Download/cs-native-formatting-evidence", "cp ${file.absolutePath} /sdcard/Download/cs-native-formatting-evidence/android.json")) {
      ParcelFileDescriptor.AutoCloseInputStream(instrumentation.uiAutomation.executeShellCommand(command)).use { it.readBytes() }
    }
  }
}
