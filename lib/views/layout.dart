import 'package:flutter/material.dart';

class Layout extends StatelessWidget {
  final String title;
  const Layout({
    Key? key,
    required this.title,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: <Widget>[
          SliverAppBar(
            pinned: false,
            snap: true,
            floating: true,
            expandedHeight: 96.0,
            centerTitle: false,
            title: Text(
              title,
              style: const TextStyle(color: Colors.white70),
            ),
            backgroundColor:
                MediaQuery.of(context).platformBrightness == Brightness.dark
                    ? const Color(0x80745B1A)
                    : null,
            flexibleSpace: const FlexibleSpaceBar(
              background: Image(image: AssetImage('images/logo.png')),
            ),
          ),
          SliverToBoxAdapter(
            child: Container(
              height: 20,
              child: const Center(
                child: Text('Scroll to see the SliverAppBar in effect.'),
              ),
              color: Colors.white10,
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (BuildContext context, int index) {
                return Container(
                  color: index.isEven ? Colors.black12 : Colors.white10,
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
