import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../blocs/user_bloc.dart';
import '../config/theme.dart';
import '../router.dart';

class OverflowMenu extends StatelessWidget {
  final RouteEntry _route;

  const OverflowMenu({
    Key? key,
    required RouteEntry route,
  })  : _route = route,
        super(key: key);

  @override
  Widget build(BuildContext context) {
    final UserBloc userBloc = context.read<UserBloc>();
    return PopupMenuButton<RouteEntry>(
      icon: const Icon(Icons.more_vert),
      offset: const Offset(0, baseWidth / 20),
      onSelected: (RouteEntry route) {
        GoRouter.of(context).go(routeString(route));
      },
      itemBuilder: (BuildContext context) => <PopupMenuEntry<RouteEntry>>[
        ...authorizedRoutes(userBloc.state)
            .map((route) => PopupMenuItem<RouteEntry>(
                  value: route,
                  child: ListTile(
                    leading: routeItems(context)[route]!.icon,
                    title: Text(routeItems(context)[route]!.label),
                  ),
                  enabled: route != _route,
                ))
            .toList(),
      ],
    );
  }
}
