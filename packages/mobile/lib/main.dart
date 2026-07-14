import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/converter_screen.dart';

void main() {
  runApp(const GhsApp());
}

class GhsApp extends StatelessWidget {
  const GhsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GHS Time',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1A3A5C),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const MainShell(),
    );
  }
}

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  static const _screens = [
    HomeScreen(),
    ConverterScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.access_time),
            label: 'Jetzt',
          ),
          NavigationDestination(
            icon: Icon(Icons.swap_horiz),
            label: 'Umrechner',
          ),
        ],
      ),
    );
  }
}
