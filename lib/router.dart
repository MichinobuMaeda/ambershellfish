import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'blocs/user_bloc.dart';
import 'config/l10n.dart';
import 'views/app_page.dart';

enum RouteEntry {
  loading,
  signin,
  home,
  admin,
  prefs,
  info,
}

String routeString(RouteEntry e) => e == RouteEntry.home ? '/' : '/${e.name}';

List<RouteEntry> authorizedRoutes(UserState userState) {
  if (userState.confReceived && userState.authStateChecked) {
    if (userState.authUser == null || userState.me == null) {
      return [
        RouteEntry.signin,
        RouteEntry.info,
      ];
    } else {
      return [
        RouteEntry.home,
        RouteEntry.prefs,
        if (userState.me!.admin) RouteEntry.admin,
        RouteEntry.info,
      ];
    }
  } else {
    return [
      RouteEntry.loading,
      RouteEntry.info,
    ];
  }
}

class RouteItem {
  final Icon icon;
  final String label;

  const RouteItem({
    required this.icon,
    required this.label,
  });
}

Map<RouteEntry, RouteItem> routeItems(BuildContext context) => {
      RouteEntry.loading: RouteItem(
        icon: const Icon(Icons.autorenew),
        label: L10n.of(context)?.connecting ?? '',
      ),
      RouteEntry.signin: RouteItem(
        icon: const Icon(Icons.login),
        label: L10n.of(context)?.signIn ?? '',
      ),
      RouteEntry.home: RouteItem(
        icon: const Icon(Icons.home),
        label: L10n.of(context)?.home ?? '',
      ),
      RouteEntry.admin: RouteItem(
        icon: const Icon(Icons.handyman),
        label: L10n.of(context)?.admin ?? '',
      ),
      RouteEntry.prefs: RouteItem(
        icon: const Icon(Icons.settings),
        label: L10n.of(context)?.settings ?? '',
      ),
      RouteEntry.info: RouteItem(
        icon: const Icon(Icons.info),
        label: L10n.of(context)?.aboutApp ?? '',
      ),
    };

List<GoRoute> routes(BuildContext contexst) => RouteEntry.values
    .map(
      (route) => GoRoute(
        path: routeString(route),
        pageBuilder: (context, state) => NoTransitionPage<void>(
          child: AppPage(
            key: Key('Layout: ${routeString(route)}'),
            route: route,
          ),
        ),
      ),
    )
    .toList();

Widget routeErrorBuilder(BuildContext context, GoRouterState state) =>
    const AppPage(route: RouteEntry.loading);

String? Function(GoRouterState) guard(UserBloc userBloc) =>
    (GoRouterState state) {
      List<RouteEntry> routes = authorizedRoutes(userBloc.state);
      return routes.map((route) => routeString(route)).contains(state.subloc)
          ? null
          : routeString(routes[0]);
    };
