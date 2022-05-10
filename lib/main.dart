import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  static const String _title = 'Amber Shellfish';

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: _title,
      home: const MyHomePage(),
      theme: ThemeData(
        colorSchemeSeed: Colors.amber,
      ),
      darkTheme: ThemeData(
        colorSchemeSeed: Colors.amber,
        brightness: Brightness.dark,
      ),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({Key? key}) : super(key: key);
// [SliverAppBar]s are typically used in [CustomScrollView.slivers], which in
// turn can be placed in a [Scaffold.body].
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: <Widget>[
          const SliverAppBar(
            pinned: false,
            snap: true,
            floating: true,
            expandedHeight: 160.0,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                'Amber Shellfish',
                style: TextStyle(color: Colors.white70),
              ),
              background: Image(image: AssetImage('images/logo.png')),
            ),
          ),
          const SliverToBoxAdapter(
            child: SizedBox(
              height: 20,
              child: Center(
                child: Text('Scroll to see the SliverAppBar in effect.'),
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (BuildContext context, int index) {
                return Container(
                  color: index.isOdd ? Colors.black12 : Colors.white10,
                  height: 64.0,
                  child: Center(
                    child: Text('$index', textScaleFactor: 3),
                  ),
                );
              },
              childCount: 4,
            ),
          ),
        ],
      ),
    );
  }
}
