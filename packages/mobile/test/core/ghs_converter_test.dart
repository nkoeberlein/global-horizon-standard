import 'dart:convert';
import 'dart:io';

import 'package:ghs_mobile/core/ghs_converter.dart';
import 'package:test/test.dart';

void main() {
  group('isAuroraYear', () {
    // Verified against TypeScript reference: packages/core/src
    // Aurora years near 12026: 12013, 12019, 12025, 12030, 12036
    test('known Aurora years return true', () {
      expect(isAuroraYear(12025), isTrue);
      expect(isAuroraYear(12019), isTrue);
      expect(isAuroraYear(12013), isTrue);
    });

    test('non-Aurora years return false', () {
      expect(isAuroraYear(12026), isFalse);
      expect(isAuroraYear(12020), isFalse);
      expect(isAuroraYear(12022), isFalse);
    });

    // Dart's `%` is euclidean, so negative eras are already handled. The
    // TypeScript core needed an explicit fix here (JS `%` truncates); this
    // test pins the behaviour so the two ports cannot drift apart again.
    test('negative eras use a non-negative modulo', () {
      for (var y = -2000; y <= 2000; y++) {
        final euclidean = (((71 * y + epsilon) % 400) + 400) % 400 < 71;
        expect(isAuroraYear(y), euclidean, reason: 'era $y');
      }
      expect(isAuroraYear(-1000), isFalse);
    });

    test('era is padded to five digits in fullDate', () {
      expect(getGhsDate(DateTime.utc(2026, 6, 15)).fullDate, startsWith('12026.'));
      expect(formatEra(12026), '12026');
      expect(formatEra(9999), '09999');
      expect(formatEra(500), '00500');
      expect(formatEra(1), '00001');
      // padLeft alone would produce "0-101".
      expect(formatEra(-101), '-00101');
    });

    test('short format does not throw for single-digit eras', () {
      final ghs = getGhsDate(parseGhsDate(1, 1, 15));
      expect(ghs.fullDate, '00001.01.15');
      expect(formatGhs(ghs, GhsFormat.short), "15 Mar '01");
    });

    test('400 consecutive years hold 71 Aurora Years, negative windows too', () {
      for (final windowStart in [-1200, -400, -3, 0, 500, 12000]) {
        var days = 0;
        for (var y = windowStart; y < windowStart + 400; y++) {
          days += getDaysInYear(y);
        }
        expect(days, cycleDays, reason: 'window $windowStart');
      }
    });
  });

  group('epoch calibration', () {
    test('12000.01.01 = Unix day 11,036 (2000-03-20 UTC)', () {
      expect(epochYearHe, 12000);
      expect(epochUnixDay, 11036);
      expect(DateTime.fromMillisecondsSinceEpoch(epochMs, isUtc: true),
          DateTime.utc(2000, 3, 20));
      expect(getYearStartMs(epochYearHe), epochMs);
    });

    // Reference values from the TypeScript implementation (packages/core)
    test('modern-era year starts match the TypeScript reference', () {
      expect(getYearStartMs(12025),
          DateTime.utc(2025, 3, 17).millisecondsSinceEpoch);
      expect(getYearStartMs(12026),
          DateTime.utc(2026, 3, 23).millisecondsSinceEpoch);
      expect(getYearStartMs(12027),
          DateTime.utc(2027, 3, 22).millisecondsSinceEpoch);
    });

    test('any 400 consecutive years sum to 146,097 days', () {
      var days = 0;
      for (var y = 12000; y < 12400; y++) {
        days += getDaysInYear(y);
      }
      expect(days, cycleDays);
    });

    test('aligns GHS weekdays 1:1 with the existing seven-day week', () {
      final start = DateTime.utc(2025, 3, 17); // 12025.01.01 (Monday)
      for (var i = 0; i < 371 + 364; i++) {
        final d = start.add(Duration(days: i));
        final ghs = getGhsDate(d);
        // DateTime.weekday: 1=Mon … 7=Sun
        expect(weekdaysGhs.indexOf(ghs.weekday), d.weekday - 1);
      }
    });
  });

  group('getGhsDate — standard date', () {
    // Reference: 2026-04-21T00:00:00Z → 12026.02.02 (April, day 2)
    test('2026-04-21 UTC midnight converts correctly', () {
      final ghs = getGhsDate(DateTime.utc(2026, 4, 21));

      expect(ghs.era, 12026);
      expect(ghs.month, 2);
      expect(ghs.monthName, 'April');
      expect(ghs.day, 2);
      expect(ghs.beats, '@000');
      expect(ghs.isAuroraWeek, isFalse);
      expect(ghs.isAuroraYearFlag, isFalse); // 12026 is a normal year
    });

    test('GHS year start: 2026-03-23 = month 1, day 1', () {
      final ghs = getGhsDate(DateTime.utc(2026, 3, 23));

      expect(ghs.era, 12026);
      expect(ghs.month, 1);
      expect(ghs.monthName, 'March');
      expect(ghs.day, 1);
      expect(ghs.dayOfYear, 1);
      expect(ghs.weekOfYear, 1);
      expect(ghs.quarter, 1);
    });

    test('the moment before a normal year transition belongs to Luna 28', () {
      final ghs = getGhsDate(DateTime.utc(2027, 3, 21, 23, 59, 59));

      expect(ghs.era, 12026);
      expect(ghs.month, 13);
      expect(ghs.monthName, 'Luna');
      expect(ghs.day, 28);
    });

    test('consecutive days map to distinct GHS dates (bijectivity)', () {
      // 12026 is a normal year: the day after Luna 28 is New Year — no
      // duplicated dates (the old fixed-anchor clamping bug).
      final luna28 = getGhsDate(DateTime.utc(2027, 3, 21));
      final newYear = getGhsDate(DateTime.utc(2027, 3, 22));
      expect(luna28.fullDate, '12026.13.28');
      expect(newYear.fullDate, '12027.01.01');
    });
  });

  group('getGhsDate — @Beats', () {
    // The ms-based calculation is exact: 43,200,000 ms / 86,400 = 500.0
    // (the old seconds/86.4 float path yielded 499.999… → @499).
    test('noon UTC = @500', () {
      final ghs = getGhsDate(DateTime.utc(2026, 4, 16, 12));
      expect(ghs.beats, '@500');
    });

    test('midnight UTC = @000', () {
      final ghs = getGhsDate(DateTime.utc(2026, 4, 16));
      expect(ghs.beats, '@000');
    });

    test('23:59:59.999 UTC does not overflow to @1000', () {
      final ghs = getGhsDate(DateTime.utc(2026, 4, 16, 23, 59, 59, 999));
      expect(ghs.beats, isNot('@1000'));
      expect(ghs.beats, '@999');
      expect(ghs.beatsLong, '@999.99');
    });

    test('truncates rather than rounds', () {
      // 172,481 ms into the day = 1.9963 beats. Rounding would show @002.00.
      final ghs = getGhsDate(
          DateTime.utc(2026, 4, 16).add(const Duration(milliseconds: 172481)));
      expect(ghs.beats, '@001');
      expect(ghs.beatsLong, '@001.99');
    });

    test('beats and beatsLong agree across a full day', () {
      final dayStart = DateTime.utc(2026, 4, 16);
      for (var msInDay = 0; msInDay < 86400000; msInDay += 997) {
        final ghs = getGhsDate(dayStart.add(Duration(milliseconds: msInDay)));
        expect(ghs.beatsLong.substring(0, 4), ghs.beats, reason: 'ms $msInDay');
      }
    });
  });

  group('getGhsDate — Aurora Week', () {
    // 12025 is an Aurora Year with 371 days; its Aurora Week spans
    // 2026-03-16 (A.1) through 2026-03-22 (A.7). 12026 begins 2026-03-23.
    test('Aurora Week day 1 (2026-03-16) is detected in GHS 12025', () {
      final ghs = getGhsDate(DateTime.utc(2026, 3, 16));

      expect(ghs.era, 12025);
      expect(ghs.isAuroraWeek, isTrue);
      expect(ghs.month, isNull);
      expect(ghs.monthName, 'Aurora');
      expect(ghs.day, 1);
      expect(ghs.weekOfYear, isNull);
      expect(ghs.quarter, isNull);
    });

    test('all seven Aurora days are reachable', () {
      for (var i = 0; i < 7; i++) {
        final ghs = getGhsDate(DateTime.utc(2026, 3, 16 + i));
        expect(ghs.isAuroraWeek, isTrue);
        expect(ghs.day, i + 1);
      }
      expect(getGhsDate(DateTime.utc(2026, 3, 23)).fullDate, '12026.01.01');
    });

    test('non-Aurora years contain no Aurora dates', () {
      final start = DateTime.utc(2026, 3, 23); // 12026.01.01
      for (var i = 0; i < getDaysInYear(12026); i++) {
        final ghs = getGhsDate(start.add(Duration(days: i)));
        expect(ghs.isAuroraWeek, isFalse);
        expect(ghs.era, 12026);
      }
    });
  });

  group('parseGhsDate — round-trip', () {
    test('round-trip: Gregorian → GHS → Gregorian', () {
      final original = DateTime.utc(2026, 6, 15, 12);
      final ghs = getGhsDate(original);
      final restored = parseGhsDate(ghs.era, ghs.month, ghs.day, ghs.beatsExact);

      expect(restored.millisecondsSinceEpoch,
          closeTo(original.millisecondsSinceEpoch, 1000));
    });

    test('parseGhsDate: every Aurora day round-trips exactly', () {
      for (var day = 1; day <= 7; day++) {
        final date = parseGhsDate(12025, null, day);
        final ghs = getGhsDate(date);
        expect(ghs.era, 12025);
        expect(ghs.isAuroraWeek, isTrue);
        expect(ghs.day, day);
      }
    });

    test('clamps beats near 1000 so parseGhsDate never rolls into the next day (C3)', () {
      final ghs = getGhsDate(parseGhsDate(12025, 13, 28, 999.999995));
      expect(ghs.fullDate, '12025.13.28');
      expect(ghs.beats, '@999');
      expect(ghs.beatsLong, '@999.99');
    });

    test('throws RangeError for invalid components and out-of-range eras (C2)', () {
      expect(() => parseGhsDate(12026, 14, 1), throwsRangeError);
      expect(() => parseGhsDate(12026, 1, 29), throwsRangeError);
      expect(() => parseGhsDate(12025, null, 8), throwsRangeError);
      expect(() => parseGhsDate(12026, null, 1), throwsRangeError); // no Aurora
      expect(() => parseGhsDate(12026, 1, 1, 1000), throwsRangeError);
      expect(() => isAuroraYear(maxEra + 1), throwsRangeError);
      expect(() => isAuroraYear(minEra - 1), throwsRangeError);
      expect(() => getYearStartMs(maxEra + 1), throwsRangeError);
      expect(() => parseGhsDate(maxEra + 1, 1, 1), throwsRangeError);
    });

    test('round-trips at minEra and maxEra', () {
      final minStart = parseGhsDate(minEra, 1, 1);
      expect(getGhsDate(minStart).era, minEra);
      expect(getGhsDate(minStart).dayOfYear, 1);

      final maxEnd = parseGhsDate(maxEra, 13, 28, 999.99);
      expect(getGhsDate(maxEnd).era, maxEra);
      expect(getGhsDate(maxEnd).day, 28);
    });
  });

  group('formatGhs', () {
    late GhsDateResult aprilSample;
    late GhsDateResult marchSample;

    setUp(() {
      aprilSample = getGhsDate(DateTime.utc(2026, 4, 21, 17, 16)); // GHS April
      marchSample = getGhsDate(DateTime.utc(2026, 3, 25, 17, 16)); // GHS March
    });

    test('core format contains fullDate and beats', () {
      expect(formatGhs(marchSample, GhsFormat.core), startsWith('12026.01.'));
      expect(formatGhs(marchSample, GhsFormat.core), contains('@'));
    });

    test('ui format for April date contains Apr', () {
      final result = formatGhs(aprilSample, GhsFormat.ui);
      expect(result, contains('Apr'));
      expect(result, contains('12026'));
      expect(result, contains('@'));
    });

    test('text format omits beats, shows full month name', () {
      final result = formatGhs(aprilSample, GhsFormat.text);
      expect(result, isNot(contains('@')));
      expect(result, contains('April'));
    });

    test('short format uses 2-digit year', () {
      final result = formatGhs(marchSample, GhsFormat.short);
      expect(result, contains("'26"));
    });
  });

  group('parseGhsString & getSolarNoonBeat', () {
    test('parses core, Aurora, prefixed, and spaceless GHS strings', () {
      final d = parseGhsString('12026.01.15 @685');
      expect(d, isNotNull);
      expect(d!.era, 12026);
      expect(d.month, 1);
      expect(d.day, 15);
      expect(d.beats, 685.0);

      final aurora = parseGhsString('GHS 12025.A.03@500.25');
      expect(aurora, isNotNull);
      expect(aurora!.era, 12025);
      expect(aurora.month, isNull);
      expect(aurora.day, 3);
      expect(aurora.beats, 500.25);

      expect(parseGhsString('2026-03-23'), isNull);
      expect(() => parseGhsString('12026.14.01'), throwsRangeError);
    });

    test('parses UI form components via parseGhsComponents', () {
      final d = parseGhsComponents(era: '12026', month: '1', day: '1', beats: '500');
      expect(getGhsDate(d).fullDate, '12026.01.01');
      expect(getGhsDate(d).beats, '@500');
    });

    test('computes solar noon beat from longitude', () {
      expect(getSolarNoonBeat(0), 500);
      expect(getSolarNoonBeat(180), 0);
      expect(getSolarNoonBeat(-180), 0);
      expect(getSolarNoonBeat(140), 111);
      expect(getSolarNoonBeat(151), 81);
      expect(() => getSolarNoonBeat(361), throwsRangeError);
    });
  });

  group('test/fixtures/vectors.json conformance', () {
    final vectorsFile = File('test/fixtures/vectors.json');
    final vectors =
        jsonDecode(vectorsFile.readAsStringSync()) as Map<String, dynamic>;

    test('matches canonical constants', () {
      final c = vectors['constants'] as Map<String, dynamic>;
      expect(epochYearHe, c['epochYearHE']);
      expect(epochUnixDay, c['epochUnixDay']);
      expect(epochMs, c['epochMs']);
      expect(epsilon, c['epsilon']);
      expect(cycleYears, c['cycleYears']);
      expect(cycleDays, c['cycleDays']);
      expect(minEra, c['minEra']);
      expect(maxEra, c['maxEra']);
    });

    test('matches all yearStart vectors', () {
      for (final raw in vectors['yearStarts'] as List<dynamic>) {
        final v = raw as Map<String, dynamic>;
        final era = v['era'] as int;
        expect(isAuroraYear(era), v['isAuroraYear'], reason: 'era $era');
        expect(getDaysInYear(era), v['daysInYear'], reason: 'era $era');
        expect(getYearStartMs(era), v['startMs'], reason: 'era $era');
      }
    });

    test('matches all conversion and formatting vectors', () {
      for (final raw in vectors['conversions'] as List<dynamic>) {
        final v = raw as Map<String, dynamic>;
        final ms = v['ms'] as int;
        final ghs =
            getGhsDate(DateTime.fromMillisecondsSinceEpoch(ms, isUtc: true));
        expect(ghs.era, v['era'], reason: 'ms $ms');
        expect(ghs.month, v['month'], reason: 'ms $ms');
        expect(ghs.monthName, v['monthName'], reason: 'ms $ms');
        expect(ghs.day, v['day'], reason: 'ms $ms');
        expect(ghs.dayOfYear, v['dayOfYear'], reason: 'ms $ms');
        expect(ghs.weekOfYear, v['weekOfYear'], reason: 'ms $ms');
        expect(ghs.quarter, v['quarter'], reason: 'ms $ms');
        expect(ghs.weekday, v['weekday'], reason: 'ms $ms');
        expect(ghs.isAuroraWeek, v['isAuroraWeek'], reason: 'ms $ms');
        expect(ghs.isAuroraYearFlag, v['isAuroraYear'], reason: 'ms $ms');
        expect(ghs.beats, v['beats'], reason: 'ms $ms');
        expect(ghs.beatsLong, v['beatsLong'], reason: 'ms $ms');
        expect(ghs.beatsExact, (v['beatsExact'] as num).toDouble(), reason: 'ms $ms');
        expect(ghs.fullDate, v['fullDate'], reason: 'ms $ms');

        final fmt = v['formatted'] as Map<String, dynamic>;
        expect(formatGhs(ghs, GhsFormat.core), fmt['core'], reason: 'ms $ms');
        expect(formatGhs(ghs, GhsFormat.ui), fmt['ui'], reason: 'ms $ms');
        expect(formatGhs(ghs, GhsFormat.text), fmt['text'], reason: 'ms $ms');
        expect(formatGhs(ghs, GhsFormat.short), fmt['short'], reason: 'ms $ms');
      }
    });

    test('rejects all invalidParseInputs vectors with RangeError', () {
      for (final raw in vectors['invalidParseInputs'] as List<dynamic>) {
        final v = raw as Map<String, dynamic>;
        final era = v['era'] as int;
        final monthRaw = v['month'];
        final int? month = monthRaw == 'A' ? null : monthRaw as int;
        final day = v['day'] as int;
        final beats = (v['beats'] as num).toDouble();
        expect(
          () => parseGhsDate(era, month, day, beats),
          throwsRangeError,
          reason: v['label'] as String,
        );
      }
    });
  });
}
