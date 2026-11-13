# GHS Mobile (`ghs_mobile`)

Flutter application (Android & iOS) for the **Global Horizon Standard (GHS)** — displaying live `@Beats` decimal time, the 13-month Human Era calendar, and a bidirectional Gregorian ↔ GHS converter.

## Architecture

- `lib/core/ghs_converter.dart` — Pure Dart port of `ghs-time` v3 (`getGhsDate`, `parseGhsDate`, `parseGhsString`, `parseGhsComponents`, `getSolarNoonBeat`, `formatGhs`).
- `lib/screens/home_screen.dart` — Live GHS clock and date view (`Timer.periodic` 1 s).
- `lib/screens/converter_screen.dart` — Bidirectional Gregorian ↔ GHS converter.
- `test/core/ghs_converter_test.dart` — Unit test suite and conformance checks against `test/fixtures/vectors.json`.

## Development

```bash
cd packages/mobile
flutter pub get
flutter test
flutter run
```
