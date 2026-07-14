# packages/mobile — ghs_mobile

Flutter app for GHS time display and conversion. Android-first, iOS-ready.

## Key files
- `lib/core/ghs_converter.dart` — Dart port of `packages/core/src` (epoch-based, v2). All GHS logic lives here. Must stay in sync with the TypeScript core: epoch 10001.01.01 = 0001-03-21 UTC, year lengths always 364/371, `parseGhsDate` throws `RangeError` on invalid input.
- `lib/main.dart` — App entry point, MaterialApp + bottom nav shell (Home / Converter)
- `lib/screens/home_screen.dart` — Live GHS clock, updates every second via `Timer.periodic`
- `lib/screens/converter_screen.dart` — Bidirectional date converter (Gregorian ↔ GHS)
- `test/core/ghs_converter_test.dart` — Unit tests for the converter (edge cases: year boundary, Aurora Week, beats overflow)

## Patterns
- GHS logic is pure Dart, no Flutter imports — testable with `dart test`
- All DateTime calculations in UTC (`DateTime.utc(...)`, `.toUtc()`)
- `getGhsDate()` with no args = current time
- Aurora Week: `month == null`, `monthName == 'Aurora'`

## Widget (Phase 3 — not yet implemented)
- Will use `home_widget` package to share data between Flutter app and native Android AppWidget
- Native Kotlin stub: `android/app/src/main/kotlin/.../GhsWidget.kt`

## Commands
```bash
flutter pub get
flutter test
flutter run                 # requires connected device or emulator
flutter build apk --release
```
