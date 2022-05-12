import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../config/app_info.dart';
import '../config/theme.dart';
import '../blocs/conf_bloc.dart';
import '../router.dart';
import 'app_update_banner.dart';
import 'overflow_menu.dart';
import 'about_app_panel.dart';
import 'policy_panel.dart';

class AppPage extends StatelessWidget {
  final RouteEntry _route;

  const AppPage({
    Key? key,
    required RouteEntry route,
  })  : _route = route,
        super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: <Widget>[
          SliverAppBar(
            pinned: false,
            snap: true,
            floating: true,
            expandedHeight: baseWidth / 10,
            backgroundColor:
                MediaQuery.of(context).platformBrightness == Brightness.dark
                    ? Theme.of(context).colorScheme.primary.withAlpha(0x40)
                    : Theme.of(context).colorScheme.primary.withAlpha(0xD0),
            centerTitle: false,
            title: const Text(
              appName,
              style: TextStyle(color: Colors.white70),
            ),
            actions: [
              OverflowMenu(route: _route),
            ],
            flexibleSpace: const FlexibleSpaceBar(
              background: Image(image: AssetImage('images/logo.png')),
            ),
          ),
          if (context.watch<ConfBloc>().state != null &&
              context.watch<ConfBloc>().state?.version != version)
            const AppUpdateBanner(),
          if (_route == RouteEntry.info) const AboutAppPanel(),
          if (_route == RouteEntry.info) const PolicyPanel(),
          if (_route == RouteEntry.home || _route == RouteEntry.signin)
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (BuildContext context, int index) {
                  return Container(
                    color: stripedPattern(index),
                    height: 64.0,
                    child: Center(
                      child: Text('$index', textScaleFactor: 3),
                    ),
                  );
                },
                childCount: 20,
              ),
            ),
        ],
      ),
    );
  }
}
