import 'package:flutter/material.dart';
import '../core/ghs_converter.dart';

/// Bidirectional date converter: Gregorian ↔ GHS.
class ConverterScreen extends StatefulWidget {
  const ConverterScreen({super.key});

  @override
  State<ConverterScreen> createState() => _ConverterScreenState();
}

class _ConverterScreenState extends State<ConverterScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabs;

  // Gregorian → GHS
  final _gregController = TextEditingController();
  GhsDateResult? _gregResult;
  String? _gregError;

  // GHS → Gregorian
  final _eraController = TextEditingController();
  final _monthController = TextEditingController();
  final _dayController = TextEditingController();
  final _beatsController = TextEditingController(text: '0');
  DateTime? _ghsResult;
  String? _ghsError;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabs.dispose();
    _gregController.dispose();
    _eraController.dispose();
    _monthController.dispose();
    _dayController.dispose();
    _beatsController.dispose();
    super.dispose();
  }

  void _convertGregorian() {
    final raw = _gregController.text.trim();
    try {
      final date = DateTime.parse(raw).toUtc();
      setState(() {
        _gregResult = getGhsDate(date);
        _gregError = null;
      });
    } catch (_) {
      setState(() {
        _gregResult = null;
        _gregError = 'Ungültiges Datum (erwartet: YYYY-MM-DD)';
      });
    }
  }

  void _convertGhs() {
    try {
      final era = int.parse(_eraController.text.trim());
      final monthRaw = _monthController.text.trim().toUpperCase();
      final int? month = monthRaw == 'A' ? null : int.parse(monthRaw);
      final day = int.parse(_dayController.text.trim());
      final beats = double.tryParse(_beatsController.text.trim()) ?? 0;

      setState(() {
        _ghsResult = parseGhsDate(era, month, day, beats);
        _ghsError = null;
      });
    } catch (_) {
      setState(() {
        _ghsResult = null;
        _ghsError = 'Ungültige GHS-Eingabe';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Umrechner'),
        bottom: TabBar(
          controller: _tabs,
          tabs: const [
            Tab(text: 'Gregorianisch → GHS'),
            Tab(text: 'GHS → Gregorianisch'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabs,
        children: [
          _GregorianToGhs(
            controller: _gregController,
            result: _gregResult,
            error: _gregError,
            onConvert: _convertGregorian,
          ),
          _GhsToGregorian(
            eraController: _eraController,
            monthController: _monthController,
            dayController: _dayController,
            beatsController: _beatsController,
            result: _ghsResult,
            error: _ghsError,
            onConvert: _convertGhs,
          ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------

class _GregorianToGhs extends StatelessWidget {
  final TextEditingController controller;
  final GhsDateResult? result;
  final String? error;
  final VoidCallback onConvert;

  const _GregorianToGhs({
    required this.controller,
    required this.result,
    required this.error,
    required this.onConvert,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: controller,
            decoration: InputDecoration(
              labelText: 'Datum (YYYY-MM-DD)',
              hintText: '2026-04-16',
              errorText: error,
              border: const OutlineInputBorder(),
            ),
            keyboardType: TextInputType.datetime,
            onSubmitted: (_) => onConvert(),
          ),
          const SizedBox(height: 16),
          FilledButton(onPressed: onConvert, child: const Text('Umrechnen')),
          if (result != null) ...[
            const SizedBox(height: 32),
            _ResultCard(children: [
              _Row('Datum', result!.fullDate),
              _Row('Langform', formatGhs(result!, GhsFormat.text)),
              _Row('UI-Format', formatGhs(result!, GhsFormat.ui)),
              _Row('@Beats', result!.beatsLong),
              _Row('Wochentag', result!.weekday),
              if (result!.isAuroraWeek) _Row('', 'Aurora Week'),
            ]),
          ],
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------

class _GhsToGregorian extends StatelessWidget {
  final TextEditingController eraController;
  final TextEditingController monthController;
  final TextEditingController dayController;
  final TextEditingController beatsController;
  final DateTime? result;
  final String? error;
  final VoidCallback onConvert;

  const _GhsToGregorian({
    required this.eraController,
    required this.monthController,
    required this.dayController,
    required this.beatsController,
    required this.result,
    required this.error,
    required this.onConvert,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(children: [
            Expanded(
              child: TextField(
                controller: eraController,
                decoration: const InputDecoration(
                  labelText: 'Ära (HE)',
                  hintText: '12026',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                controller: monthController,
                decoration: const InputDecoration(
                  labelText: 'Monat (1–13 / A)',
                  hintText: '4',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.text,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                controller: dayController,
                decoration: const InputDecoration(
                  labelText: 'Tag',
                  hintText: '16',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
              ),
            ),
          ]),
          const SizedBox(height: 12),
          TextField(
            controller: beatsController,
            decoration: InputDecoration(
              labelText: '@Beats (optional)',
              hintText: '0',
              errorText: error,
              border: const OutlineInputBorder(),
            ),
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            onSubmitted: (_) => onConvert(),
          ),
          const SizedBox(height: 16),
          FilledButton(onPressed: onConvert, child: const Text('Umrechnen')),
          if (result != null) ...[
            const SizedBox(height: 32),
            _ResultCard(children: [
              _Row('Datum (UTC)', result!.toIso8601String().substring(0, 10)),
              _Row('Uhrzeit (UTC)', result!.toIso8601String().substring(11, 19)),
            ]),
          ],
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------

class _ResultCard extends StatelessWidget {
  final List<Widget> children;
  const _ResultCard({required this.children});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: children,
        ),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label;
  final String value;
  const _Row(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: Theme.of(context).textTheme.bodySmall),
          Text(value,
              style: Theme.of(context)
                  .textTheme
                  .bodyMedium
                  ?.copyWith(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
